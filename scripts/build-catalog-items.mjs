#!/usr/bin/env node
/**
 * Build the catalog item pool from the SmartGift SSOT (business-01-smart-gift).
 *
 *   npm run build:catalog
 *   npm run build:catalog -- --from ../some/other/checkout
 *
 * Reads (public-safe fields only):
 *   data-pipeline/02_prepared/pricelist_master.json
 *       srp_reference_products (16 PM, 8-step ladders), seasonal_offers (6 core sets),
 *       catalog_offers (supplier projection), product_masters + offer_product_links (families)
 *   data-pipeline/02_prepared/smartgift_catalog_master.json
 *       canonical_products (dimensions, weight, Thai names)
 *   public/data/catalog_media.json  (in the SmartGift repo) — visual status per supplier code
 *   public/catalog/assets/catalog-media/*  (in THIS repo) — which supplier codes have a verified image file
 *
 * Writes:
 *   src/data/catalogItems.generated.ts       core layer (bundled, synchronous)
 *   public/catalog/data/supplier-items.json  supplier layer, public-eligible only (fetched on demand)
 *
 * Never copies: base_cost, factory_*, margin, landed cost, or any provenance that points at customer files.
 * Spec: docs/CATALOG-STRUCTURE-SPEC.md §8
 */
import { readFile, writeFile, readdir, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const repo = resolve(here, '..')

const fromArg = process.argv.indexOf('--from')
const source = resolve(repo, fromArg > -1 ? process.argv[fromArg + 1] : '../business-01-smart-gift')

const PRICELIST = join(source, 'data-pipeline', '02_prepared', 'pricelist_master.json')
const MASTER = join(source, 'data-pipeline', '02_prepared', 'smartgift_catalog_master.json')
const FLOWACCOUNT = join(source, 'data-pipeline', '02_prepared', 'flowaccount_catalog_normalized.json')
const PRICING_RULES = join(source, 'config', 'pricing_rules_formula.yaml')
const PM_MAPPING = join(source, 'data-pipeline', '02_prepared', 'factory_cost_pm_mapping.json')
const MEDIA_JSON = join(source, 'public', 'data', 'catalog_media.json')
const MEDIA_DIR = join(repo, 'public', 'catalog', 'assets', 'catalog-media')
const TAXONOMY_TS = join(repo, 'src', 'data', 'catalogTaxonomy.ts')
const OUT_CORE = join(repo, 'src', 'data', 'catalogItems.generated.ts')
const OUT_SUPPLIER = join(repo, 'public', 'catalog', 'data', 'supplier-items.json')

for (const p of [PRICELIST, MASTER]) {
  if (!existsSync(p)) {
    console.error(`missing SSOT file: ${p}`)
    console.error('pass --from <path to the smartgift repo> if it lives elsewhere')
    process.exit(1)
  }
}

const readJson = async p => JSON.parse(await readFile(p, 'utf8'))

// ---------------------------------------------------------------------------
// Taxonomy tables — parsed from the typed TS module so there is one source of truth
// ---------------------------------------------------------------------------
const taxonomySrc = await readFile(TAXONOMY_TS, 'utf8')
const pmBlock = taxonomySrc.match(/export const PM_FAMILY[^{]*\{([\s\S]*?)\n\}/)
if (!pmBlock) throw new Error('PM_FAMILY table not found in catalogTaxonomy.ts')
const PM_FAMILY = Object.fromEntries([...pmBlock[1].matchAll(/'(PM-[A-Z0-9-]+)':\s*'([a-z_]+)'/g)].map(m => [m[1], m[2]]))
const FAMILY_SLUGS = new Set([...taxonomySrc.matchAll(/\{ slug: '([a-z_]+)', name_th: '[^']*', name_en: '[^']*', standard_category:/g)].map(m => m[1]))

/**
 * Every word the SSOT uses for a family (name + aliases, Thai and English), parsed from the same
 * typed rows so the vocabulary has one home. Used to read families off a set's title when the
 * SSOT's offer_product_links table has no rows for it.
 */
const FAMILY_TERMS = new Map()
for (const m of taxonomySrc.matchAll(
  /\{ slug: '([a-z_]+)', name_th: '([^']*)', name_en: '([^']*)', standard_category: '[a-z-]+', source_group: '[a-z_]+', aliases_th: \[([^\]]*)\], aliases_en: \[([^\]]*)\] \}/g
)) {
  const quoted = str => [...str.matchAll(/'([^']+)'/g)].map(q => q[1])
  const terms = [m[2], m[3], ...quoted(m[4]), ...quoted(m[5])]
    .map(t => t.trim().toLowerCase())
    .filter(Boolean)
  FAMILY_TERMS.set(m[1], [...new Set(terms)])
}
if (FAMILY_TERMS.size < FAMILY_SLUGS.size) throw new Error(`FAMILY_TERMS parsed ${FAMILY_TERMS.size} of ${FAMILY_SLUGS.size} family rows`)

/**
 * Quantities a public SRP ladder may use, from the SSOT's own pricing rules
 * (config/pricing_rules_formula.yaml -> srp_benchmark_rules.moq_breaks).
 * Read here rather than restated so the rule keeps one home.
 */
const rulesSrc = await readFile(PRICING_RULES, 'utf8')
const breaks = /^\s*moq_breaks:\s*\[([\d,\s]+)\]/m.exec(rulesSrc)
if (!breaks) throw new Error(`srp_benchmark_rules.moq_breaks not found in ${PRICING_RULES}`)
const MOQ_BREAKS = new Set(breaks[1].split(',').map(n => Number(n.trim())).filter(Number.isFinite))
if (MOQ_BREAKS.size < 2) throw new Error(`moq_breaks parsed as ${[...MOQ_BREAKS]}`)

/** Rows dropped from an SRP ladder for sitting outside moq_breaks. Reported after the build. */
const offBreakTiers = []

/**
 * An SRP ladder may only quote the authorised MOQ breaks.
 *
 * The blueprint extraction restates each product's SRP as a `min_qty: 1` row — for all 16 PM
 * singles that row's price equals `srp_price` exactly, and 1 is not one of the breaks. Published
 * as a tier it reads as "you may buy one", which the pricing rules do not allow. Drop it; the
 * number itself is not lost, `srp_price` carries it.
 */
function onlyMoqBreaks(tiers, code) {
  const kept = tiers.filter(t => MOQ_BREAKS.has(t.min_qty))
  const dropped = tiers.filter(t => !MOQ_BREAKS.has(t.min_qty))
  if (dropped.length) offBreakTiers.push({ code, dropped: dropped.map(t => `@${t.min_qty} ฿${t.unit_price}`) })
  return kept.length ? kept : tiers
}

const THAI = /[฀-๿]/
const SAFE_TERM = /^[\p{L}\p{N} .+-]+$/u
const wordCache = new Map()
/** Whole-word matcher for a Latin term. The family vocabulary is plain words — reject anything else. */
function wordRe(term) {
  let re = wordCache.get(term)
  if (!re) {
    if (!SAFE_TERM.test(term)) throw new Error(`family term is not a plain word: ${term}`)
    re = new RegExp('\\b' + term + '\\b')
    wordCache.set(term, re)
  }
  return re
}

/**
 * Families named in a title. Thai has no word boundaries so its terms match as substrings;
 * Latin terms are matched whole so `car` does not fire on `card`, nor `cup` on `cupboard`.
 * Titles only — descriptions carry packaging blurbs ("in a gift bag") that misfile the item.
 */
function familiesFromTitle(text) {
  const haystack = (text ?? '').toLowerCase()
  if (!haystack) return []
  const hits = []
  for (const [slug, terms] of FAMILY_TERMS) {
    if (!FAMILY_SLUGS.has(slug)) continue
    const found = terms.some(term =>
      THAI.test(term) ? haystack.includes(term) : wordRe(term).test(haystack)
    )
    if (found) hits.push(slug)
  }
  return hits
}
if (Object.keys(PM_FAMILY).length < 16) throw new Error(`PM_FAMILY has ${Object.keys(PM_FAMILY).length} rows, expected 16`)
if (FAMILY_SLUGS.size < 32) throw new Error(`PRODUCT_FAMILIES has ${FAMILY_SLUGS.size} rows, expected >= 32`)

// ---------------------------------------------------------------------------
// Load SSOT
// ---------------------------------------------------------------------------
const pricelist = await readJson(PRICELIST)
const master = await readJson(MASTER)
const mediaJson = existsSync(MEDIA_JSON) ? await readJson(MEDIA_JSON) : { sets: [], products: [] }
const flowaccount = existsSync(FLOWACCOUNT) ? await readJson(FLOWACCOUNT) : { products: [] }
const pmMapping = existsSync(PM_MAPPING) ? await readJson(PM_MAPPING) : { metadata: {}, mapping: [] }

const canonicalByCode = Object.fromEntries(master.canonical_products.map(p => [p.code, p]))
const themeSlugs = new Set(master.top_level_categories.map(c => c.slug))

const norm = code => String(code).toLowerCase().replace(/_/g, '-')

// ---------------------------------------------------------------------------
// Verified image files present in this repo
// ---------------------------------------------------------------------------
const mediaFiles = existsSync(MEDIA_DIR) ? await readdir(MEDIA_DIR) : []
const PRIORITY = { 'source-offer-': 0, 'product-': 1, 'set-': 2 }
const imageByCode = new Map()
for (const file of mediaFiles) {
  const base = file.replace(/\.(jpg|jpeg|png|webp)$/i, '')
  for (const prefix of Object.keys(PRIORITY)) {
    if (!base.startsWith(prefix)) continue
    const key = norm(base.slice(prefix.length))
    const status = prefix === 'set-' ? 'generated_from_source' : 'source_verified'
    const candidate = { file, prefix, status, rank: PRIORITY[prefix] }
    const existing = imageByCode.get(key)
    if (!existing || candidate.rank < existing.rank) imageByCode.set(key, candidate)
  }
}
const mediaStatusByCode = new Map()
for (const row of [...(mediaJson.sets ?? []), ...(mediaJson.products ?? [])]) {
  mediaStatusByCode.set(norm(row.code), row.visual_status)
}

function resolveImage(code) {
  const hit = imageByCode.get(norm(code))
  if (!hit) return { image: undefined, image_status: 'missing' }
  let status = hit.status
  const declared = mediaStatusByCode.get(norm(code))
  if (declared === 'source-photo') status = 'source_verified'
  else if (declared && /generated|creative/.test(declared) && hit.prefix !== 'source-offer-') status = 'generated_from_source'
  return { image: `/catalog/assets/catalog-media/${hit.file}`, image_status: status }
}

// ---------------------------------------------------------------------------
// Tier ladders
// ---------------------------------------------------------------------------
/** Codes whose source ladder carried two prices for the same quantity. Reported after the build. */
const tierConflicts = []

/**
 * One price per quantity. The SSOT collapses package variants (P-02 / P-05 ...) into a single offer
 * row, so their ladders arrive merged and a code can carry two prices for the same min_qty — the
 * site then quotes both. Until the package dimension is restored upstream, keep the HIGHEST price
 * so we never under-quote a variant, and report every code where the prices actually disagreed.
 */
function dedupeTiers(tiers, code) {
  const byQty = new Map()
  const disagreed = new Map()
  for (const t of tiers) {
    const prev = byQty.get(t.min_qty)
    if (prev === undefined) { byQty.set(t.min_qty, t.unit_price); continue }
    if (prev !== t.unit_price) disagreed.set(t.min_qty, [Math.min(prev, t.unit_price), Math.max(prev, t.unit_price)])
    byQty.set(t.min_qty, Math.max(prev, t.unit_price))
  }
  if (disagreed.size) tierConflicts.push({ code, qtys: [...disagreed.entries()] })
  return [...byQty.entries()]
    .map(([min_qty, unit_price]) => ({ min_qty, unit_price }))
    .sort((a, b) => a.min_qty - b.min_qty)
}

/**
 * Packaging per model, recovered from the normalized FlowAccount catalogue.
 *
 * pricelist_master drops the package dimension: `TSQ01-2(P-02)` and `TSQ01-2(P-05)` arrive as one
 * offer row with both ladders merged. The normalized catalogue still carries `package_code`, so we
 * use it to label WHICH box the ladder we kept is quoted for. Only the label is taken from there —
 * the prices we publish stay the Layer 3 catalogue ladder (AGENT.md: never mix the two selling
 * layers arithmetically).
 */
const packagingByModel = new Map()
for (const p of flowaccount.products ?? []) {
  if (!p.package_code) continue
  const tiers = (p.price_tiers ?? []).filter(t => Number(t.unit_price) > 0)
  if (!tiers.length) continue
  const key = p.model_code || p.code
  if (!packagingByModel.has(key)) packagingByModel.set(key, [])
  packagingByModel.get(key).push({
    code: p.package_code,
    ladder: new Map(tiers.map(t => [Number(t.min_qty), Number(t.unit_price)]))
  })
}

/**
 * Factory model code -> SmartGift PM code, from the confirmed factory-cost mapping.
 *
 * The same physical product reaches us twice: once as a PM single with an SRP ladder, once as a
 * factory catalogue offer. Listing both puts one product on the site under two codes at two
 * prices. Only an explicitly confirmed mapping may collapse them.
 */
const pmByFactoryCode = new Map()
if (pmMapping.metadata?.status === 'confirmed') {
  for (const row of pmMapping.mapping ?? []) {
    const factory = row.factory_product_code ?? row.factory_item_code
    const pm = row.pm_code ?? row.product_code
    if (factory && pm) pmByFactoryCode.set(factory, pm)
  }
} else {
  console.warn(`factory_cost_pm_mapping status is ${pmMapping.metadata?.status ?? 'unknown'} — not merging duplicates`)
}

/** Supplier rows dropped as duplicates of a core product. Reported after the build. */
const mergedDuplicates = []

/**
 * `{ packaging, packaging_variants }` for a published ladder; `{}` when the SSOT names no box.
 *
 * A variant is covered by the ladder when it prices no quantity differently — a variant that simply
 * stops earlier (no @500 step) still agrees on everything it does price, so it is covered, not split.
 */
function resolvePackaging(code, tiers) {
  const variants = packagingByModel.get(code)
  if (!variants?.length || !tiers.length) return {}
  const compare = v => {
    let agree = 0
    let conflict = 0
    for (const t of tiers) {
      const price = v.ladder.get(t.min_qty)
      if (price === undefined) continue
      if (price === t.unit_price) agree++
      else conflict++
    }
    return { agree, conflict }
  }
  const scored = variants.map(v => ({ v, ...compare(v) }))
  const covered = scored.filter(x => x.conflict === 0 && x.agree > 0)
  if (!covered.length) return {}
  const differing = scored.filter(x => x.conflict > 0)
  const first = tiers[0].min_qty
  const ref = ({ v }) => {
    const from_price = v.ladder.get(first)
    return from_price === undefined ? { package_code: v.code } : { package_code: v.code, from_price }
  }
  return {
    packaging_options: [
      ...covered.map(x => ({ ...ref(x), cost_included: true })),
      ...differing.map(x => ({ ...ref(x), cost_included: false }))
    ]
  }
}

// ---------------------------------------------------------------------------
// Core singles (16)
// ---------------------------------------------------------------------------
const themeOrder = [...themeSlugs]
const coreSets = pricelist.seasonal_offers
const usedIn = new Map()
for (const set of coreSets) {
  for (const line of set.contains ?? []) {
    if (!usedIn.has(line.product_code)) usedIn.set(line.product_code, [])
    usedIn.get(line.product_code).push(set.code)
  }
}

const factoryCodeByPm = new Map([...pmByFactoryCode].map(([factory, pm]) => [pm, factory]))
const coreSingles = pricelist.srp_reference_products.map(r => {
  const c = canonicalByCode[r.product_code]
  if (!c) throw new Error(`canonical product missing for ${r.product_code}`)
  const family = PM_FAMILY[r.product_code]
  if (!family) throw new Error(`PM_FAMILY has no row for ${r.product_code} — add it to catalogTaxonomy.ts`)
  if (!themeSlugs.has(r.category_slug)) throw new Error(`unknown theme ${r.category_slug} on ${r.product_code}`)
  const tiers = onlyMoqBreaks(dedupeTiers(r.price_tiers, r.product_code), r.product_code)
  return {
    id: `pm:${r.product_code}`,
    code: r.product_code,
    factory_item_code: factoryCodeByPm.get(r.product_code),
    kind: 'single',
    layer: 'core',
    name_th: r.name_th,
    name_en: r.name_en,
    theme: r.category_slug,
    families: [family],
    price_status: tiers.length ? 'tiered' : 'ask_for_quote',
    price_layer: tiers.length ? 'standard' : undefined,
    srp_price: r.srp_price,
    price_tiers: tiers,
    ...resolvePackaging(r.product_code, tiers),
    moq: tiers[0]?.min_qty,
    dimensions_cm: c.dimensions_cm,
    unit_weight_kg: c.unit_weight_kg,
    used_in: usedIn.get(r.product_code) ?? [],
    image_status: 'missing',
    provenance: { source_file: 'data-pipeline/02_prepared/pricelist_master.json', source_key: r.product_code }
  }
}).sort((a, b) => themeOrder.indexOf(a.theme) - themeOrder.indexOf(b.theme) || a.code.localeCompare(b.code))

// ---------------------------------------------------------------------------
// Core sets (6)
// ---------------------------------------------------------------------------
const occasionsForCode = code => {
  const out = []
  if (/XMAS|CHRISTMAS/i.test(code)) out.push('christmas')
  if (/-NY-|NEW-?YEAR/i.test(code)) out.push('new-year')
  return out
}

const coreSetItems = coreSets.map(o => {
  const contains = (o.contains ?? []).map(l => ({
    product_code: l.product_code,
    qty: l.qty,
    name_th: canonicalByCode[l.product_code]?.name_th
  }))
  const families = [...new Set(contains.map(l => PM_FAMILY[l.product_code]).filter(Boolean))]
  const tiers = dedupeTiers(o.price_tiers ?? [], o.code)
  return {
    id: o.id,
    code: o.code,
    kind: 'set',
    layer: 'core',
    name_th: o.name,
    theme: themeSlugs.has(o.catalog_slug) ? o.catalog_slug : undefined,
    tier: o.gift_tier,
    occasions: occasionsForCode(o.code),
    families,
    price_status: tiers.length ? 'tiered' : 'ask_for_quote',
    price_layer: tiers.length ? 'standard' : undefined,
    price_tiers: tiers,
    ...resolvePackaging(o.code, tiers),
    moq: tiers[0]?.min_qty,
    contains,
    unboxing_th: o.unboxing_experience ?? undefined,
    image_status: 'missing',
    provenance: { source_file: 'data-pipeline/02_prepared/pricelist_master.json', source_key: o.code }
  }
})

// ---------------------------------------------------------------------------
// Supplier layer (public-eligible only)
// ---------------------------------------------------------------------------
const pmByCode = Object.fromEntries(pricelist.product_masters.map(p => [p.code, p]))
const linksByOffer = new Map()
for (const l of pricelist.offer_product_links) {
  if (!linksByOffer.has(l.offer_code)) linksByOffer.set(l.offer_code, [])
  linksByOffer.get(l.offer_code).push(l.product_code)
}

const clean = s => (s ?? '').replace(/\s*\n+\s*/g, ' • ').replace(/\s+/g, ' ').trim()

/** "Colors: Green, pink, gray" as written in supplier descriptions → ['Green', 'pink', 'gray'] */
const parseColors = s => {
  const m = /colou?rs?\s*:\s*([^•\n]+)/i.exec(s ?? '')
  if (!m) return undefined
  const list = [...new Set(m[1].split(/[,/]/).map(c => c.trim()).filter(c => c && c.length <= 24))].slice(0, 8)
  return list.length ? list : undefined
}

const coreSingleCodes = new Set(coreSingles.map(c => c.code))
let supplierSkippedNotPublic = 0
const supplierItems = []
for (const o of pricelist.catalog_offers) {
  const linked = [...new Set(linksByOffer.get(o.code) ?? [])].map(c => pmByCode[c]).filter(Boolean)
  let families = [...new Set(linked.map(p => p.product_family_id).filter(f => f && FAMILY_SLUGS.has(f)))]
  // 50 of the supplier sets have no offer_product_links row at all and 4 more link to product
  // masters with no product_family_id, so they would all land in `unclassified`. Fall back to the
  // family vocabulary against the title. SSOT links always win; this only fills a hole.
  let familiesDerived = false
  if (!families.length) {
    families = familiesFromTitle([o.name_th, o.name, o.name_en].filter(Boolean).join(' '))
    familiesDerived = families.length > 0
  }
  const tiers = dedupeTiers(
    (o.source_price_tiers ?? [])
      .filter(t => !t.priceMissing && Number(t.unitPrice) > 0 && Number(t.qtyTier) > 0)
      .map(t => ({ min_qty: Number(t.qtyTier), unit_price: Number(t.unitPrice) })),
    o.code
  )
  const { image, image_status } = resolveImage(o.code)
  const priceStatus = tiers.length ? 'tiered' : 'ask_for_quote'
  const kind = o.offer_kind === 'single' ? 'single' : 'set'
  const eligible = image_status !== 'missing' || priceStatus === 'tiered'
  if (!eligible || (kind === 'single' && families.length === 0)) { supplierSkippedNotPublic++; continue }

  // Same physical product as a core PM single (confirmed mapping). Listing both would put one
  // product on the site under two codes at two prices — and the factory row's ladder is the
  // weaker of the two, so the core ladder wins.
  const duplicateOf = pmByFactoryCode.get(o.code)
  if (duplicateOf && coreSingleCodes.has(duplicateOf)) {
    mergedDuplicates.push({
      code: o.code,
      into: duplicateOf,
      dropped_tiers: tiers.map(t => `@${t.min_qty} ฿${t.unit_price}`),
      image_status
    })
    continue
  }
  const description = clean(o.description)
  const item = {
    id: `offer:${o.code}`,
    code: o.code,
    kind,
    layer: 'supplier',
    name_th: clean(o.name_th || o.name || o.name_en || o.code),
    name_en: o.name_en ? clean(o.name_en) : undefined,
    families,
    families_derived: familiesDerived || undefined,
    price_status: priceStatus,
    price_layer: tiers.length ? 'standard' : undefined,
    price_tiers: tiers.length ? tiers : undefined,
    ...resolvePackaging(o.code, tiers),
    moq: tiers[0]?.min_qty,
    contains: kind === 'set' && linked.length
      ? linked.slice(0, 8).map(p => ({ product_code: p.code, qty: 1, name_th: p.display_name || p.name_en || p.name_th || p.code }))
      : undefined,
    image,
    image_status,
    description_th: description ? description.slice(0, 260) : undefined,
    colors: parseColors(o.description),
    branding: o.branding || undefined,
    provenance: { source_file: 'data-pipeline/02_prepared/pricelist_master.json', source_key: o.code }
  }
  for (const k of Object.keys(item)) if (item[k] === undefined) delete item[k]
  supplierItems.push(item)
}

// Two spellings of one offer code. The factory price file writes some codes with a doubled hyphen
// (TDR0--3) where FlowAccount has TDR0-3: the same set listed twice, the FlowAccount row with the
// price and the factory row with the photo. Keep the FlowAccount code, fill its gaps from the factory
// row and drop the factory row. Only a doubled hyphen counts: a trailing letter (TBX-1-2A, FXD04-0N)
// is often a different set or edition, so those stay separate. A row with its own ladder is never
// merged away.
// Pairs the owner confirmed by eye as one product, where the codes give no rule to go by. Each is a
// factory row (photo, often no ladder) against the FlowAccount row for the same set; the trailing
// letter turns out to be a colourway, not a different set. Confirmed 2026-09-12.
//   TBH02-3A  vacuum cup + neck massager + earphones, photo is the red colourway
//   TBJ03-3A  vacuum cup + neck massager + smart bracelet, orange cup against the black one
//   TYG00-2A  humidifier + mug, red against blue/cream
//   TBT02-8A  the same eight-piece office set, shot as a flat lay where TBT02-8 is shot with its
//             gift bag and box; confirmed one product by the owner on 2026-09-12
const CONFIRMED_SAME_OFFER = {
  'TBH02-3A': 'TBH02-3',
  'TBJ03-3A': 'TBJ03-3',
  'TYG00-2A': 'TYG00-2',
  'TBT02-8A': 'TBT02-8'
}

const mergedSpellings = []
{
  const byCode = new Map(supplierItems.map(i => [i.code, i]))
  const FILL = ['image', 'image_status', 'name_en', 'contains', 'colors', 'description_th', 'branding']
  for (const typo of [...supplierItems]) {
    const code = CONFIRMED_SAME_OFFER[typo.code] ?? typo.code.replace(/-{2,}/g, '-')
    const keep = code !== typo.code && byCode.get(code)
    if (!keep || typo.price_tiers) continue
    const filled = []
    for (const k of FILL) {
      const empty = keep[k] === undefined || (k === 'image_status' && keep[k] === 'missing')
      if (empty && typo[k] !== undefined) { keep[k] = typo[k]; filled.push(k) }
    }
    // families linked in the SSOT beat families guessed from the title
    if (keep.families_derived && typo.families.length && !typo.families_derived) {
      keep.families = typo.families
      delete keep.families_derived
      filled.push('families')
    }
    keep.provenance = { ...keep.provenance, merged_codes: [...(keep.provenance.merged_codes ?? []), typo.code] }
    supplierItems.splice(supplierItems.indexOf(typo), 1)
    mergedSpellings.push({ code: typo.code, into: code, filled })
  }
}
supplierItems.sort((a, b) => (a.image_status === 'missing') - (b.image_status === 'missing') || a.code.localeCompare(b.code))

// ---------------------------------------------------------------------------
// Bundle templates (public-safe): PKG structures + blueprint examples.
// Never copies est_landed_cost, gross_profit, margin, bom_breakdown costs or stored totals —
// the builder recomputes reference prices from the core set ladders.
// ---------------------------------------------------------------------------
const setCodeById = Object.fromEntries(coreSets.map(o => [o.id, o.code]))
const setByCode = Object.fromEntries(coreSets.map(o => [o.code, o]))
const SEGMENT_TH = { Operations: 'ทีมปฏิบัติการ', 'Mid-Management': 'หัวหน้าทีม', 'C-Level': 'ผู้บริหาร' }
const occasionSlugOf = s => (/christmas|xmas/i.test(s ?? '') ? 'christmas' : /new[_-]?year/i.test(s ?? '') ? 'new-year' : /employee/i.test(s ?? '') ? 'new-employee-welcome' : undefined)
const tierOf = id => { const t = String(id ?? '').replace(/^tier:/, ''); return ['Reach', 'Select', 'Signature', 'Bespoke'].includes(t) ? t : undefined }

const bundleTemplates = pricelist.pkg.map(p => {
  const optionByTier = new Map((p.options ?? []).map(o => [tierOf(o.gift_tier_id), o]))
  const entries = Object.entries(p.tier_breakdown ?? {})
  const groups = entries.length
    ? entries.map(([segment, v]) => {
        const tier = tierOf(v.tier_id)
        const opt = optionByTier.get(tier)
        const fromBreakdown = v.offer_id ? setCodeById[v.offer_id] ?? String(v.offer_id).replace(/^offer:/, '') : undefined
        const offer = fromBreakdown ?? opt?.offer_code
        return { label: SEGMENT_TH[segment] ?? segment, segment, tier, offer_code: offer && setByCode[offer] ? offer : undefined }
      })
    : (p.design_scope?.gift_tiers ?? []).map(t => ({ label: t, tier: tierOf(`tier:${t}`) }))
  return {
    code: p.code,
    name_th: p.name,
    source: 'pkg',
    status: p.status,
    occasion: occasionSlugOf(p.occasion),
    design_scope_themes: (p.design_scope?.catalog_slugs ?? []).filter(s => themeSlugs.has(s)),
    groups
  }
})
for (const b of master.corporate_bundles ?? []) {
  bundleTemplates.push({
    code: b.bundle_code,
    name_th: b.name,
    source: 'blueprint',
    status: 'blueprint_example',
    description_th: b.description,
    target_recipients: b.target_recipients,
    design_scope_themes: [],
    groups: (b.included_offers ?? []).map(o => ({
      label: setByCode[o.offer_code]?.gift_tier ?? 'Set',
      tier: tierOf(`tier:${setByCode[o.offer_code]?.gift_tier}`),
      offer_code: setByCode[o.offer_code] ? o.offer_code : undefined,
      qty: o.qty
    }))
  })
}

// ---------------------------------------------------------------------------
// Write outputs
// ---------------------------------------------------------------------------
const stamp = new Date().toISOString()
const strip = items => items.map(i => { const o = { ...i }; for (const k of Object.keys(o)) if (o[k] === undefined) delete o[k]; return o })

const count = (arr, f) => arr.filter(f).length
const supplierMeta = {
  count: supplierItems.length,
  with_image: count(supplierItems, i => i.image_status !== 'missing'),
  priced: count(supplierItems, i => i.price_status === 'tiered'),
  source_total: pricelist.catalog_offers.length,
  generated_at: stamp
}

const header = `/**
 * GENERATED FILE — do not edit by hand. Run: npm run build:catalog
 * Source: ${PRICELIST.replace(/\\\\/g, '/')} (schema ${pricelist.metadata?.schema_version ?? '?'}, run ${pricelist.metadata?.source_run?.run_id ?? '?'})
 * Generated: ${stamp}
 * Core layer only: ${coreSingles.length} PM singles + ${coreSetItems.length} core sets. Media is overlaid from coreMedia.ts.
 * The supplier layer lives in public/catalog/data/supplier-items.json; its counts are exported here so the UI can
 * advertise it before loading it.
 */
import type { CatalogItemSeed, BundleTemplate } from './catalogTaxonomy'

export const SUPPLIER_LAYER_META = ${JSON.stringify(supplierMeta, null, 2)} as const

export const CORE_ITEMS: CatalogItemSeed[] = ${JSON.stringify(strip([...coreSingles, ...coreSetItems]), null, 2)}

/** Package templates: ${pricelist.pkg.length} PKG structures (none quote-ready) + ${(master.corporate_bundles ?? []).length} blueprint examples. No prices stored. */
export const BUNDLE_TEMPLATES: BundleTemplate[] = ${JSON.stringify(strip(bundleTemplates.map(t => ({ ...t, groups: strip(t.groups) }))), null, 2)}
`
await writeFile(OUT_CORE, header, 'utf8')

await mkdir(dirname(OUT_SUPPLIER), { recursive: true })
await writeFile(OUT_SUPPLIER, JSON.stringify({
  schema: 'smartgift-catalog-items/1',
  generated_at: stamp,
  source: {
    file: 'data-pipeline/02_prepared/pricelist_master.json',
    schema_version: pricelist.metadata?.schema_version,
    run_id: pricelist.metadata?.source_run?.run_id,
    catalog_offers_total: pricelist.catalog_offers.length,
    public_eligible: supplierItems.length
  },
  disclaimer_th: 'รายการจากแคตตาล็อกผู้ผลิต ยังไม่ผ่านการยืนยันเป็นสินค้า core ราคา (ถ้ามี) เป็นราคาอ้างอิงตามขั้นจำนวน โปรดยืนยันก่อนเสนอราคา',
  items: strip(supplierItems)
}, null, 1), 'utf8')

console.log(`bundle templates  ${bundleTemplates.length}  (pkg ${pricelist.pkg.length}, blueprint ${(master.corporate_bundles ?? []).length})`)
console.log(`core singles      ${coreSingles.length}`)
console.log(`core sets         ${coreSetItems.length}  (priced ${count(coreSetItems, i => i.price_status === 'tiered')})`)
console.log(`supplier eligible ${supplierItems.length} / ${pricelist.catalog_offers.length}  (image ${count(supplierItems, i => i.image_status !== 'missing')}, priced ${count(supplierItems, i => i.price_status === 'tiered')}, skipped ${supplierSkippedNotPublic})`)
console.log(`wrote ${OUT_CORE}`)
console.log(`wrote ${OUT_SUPPLIER}`)

if (tierConflicts.length) {
  console.log('')
  console.log(`tier conflicts    ${tierConflicts.length}  (same qty, two prices in the SSOT — kept the higher)`)
  for (const c of tierConflicts) {
    const detail = c.qtys.map(([qty, [lo, hi]]) => `@${qty} ${lo}/${hi}→${hi}`).join('  ')
    console.log(`  ${c.code}  ${detail}`)
  }
  console.log('  fix upstream: pricelist_master collapses package variants (P-xx) into one offer row.')
}

if (offBreakTiers.length) {
  console.log('')
  console.log(`off-break tiers   ${offBreakTiers.length}  (quantity not in moq_breaks ${[...MOQ_BREAKS].join('/')} — dropped)`)
  for (const t of offBreakTiers) console.log(`  ${t.code}  ${t.dropped.join('  ')}`)
}

const offBreakSupplier = supplierItems.filter(i => (i.price_tiers ?? []).some(t => !MOQ_BREAKS.has(t.min_qty)))
if (offBreakSupplier.length) {
  console.log('')
  console.log(`supplier off-break ${offBreakSupplier.length}  (kept as quoted — supplier ladders are not SRP benchmarks)`)
  for (const i of offBreakSupplier) {
    console.log(`  ${i.code}  ${i.price_tiers.map(t => `@${t.min_qty}`).join(' ')}`)
  }
}

if (mergedSpellings.length) {
  console.log(`merged spellings ${mergedSpellings.length}  (doubled hyphen, or a pair the owner confirmed)`)
  for (const d of mergedSpellings) console.log(`  ${d.code} -> ${d.into}  filled: ${d.filled.join(', ') || '-'}`)
}
if (mergedDuplicates.length) {
  console.log('')
  console.log(`merged duplicates ${mergedDuplicates.length}  (factory row = same product as a core PM single)`)
  for (const d of mergedDuplicates) {
    const price = d.dropped_tiers.length ? d.dropped_tiers.join(' ') : 'ask-for-quote'
    console.log(`  ${d.code} -> ${d.into}   dropped: ${price}`)
    if (d.image_status === 'source_verified') {
      console.log(`     note: ${d.code} had a source-verified photo; ${d.into} uses coreMedia.ts, which wins on merge`)
    }
  }
}

const derivedFamilies = supplierItems.filter(i => i.families_derived)
const unclassified = supplierItems.filter(i => !i.families.length)
if (derivedFamilies.length || unclassified.length) {
  console.log('')
  console.log(`derived families  ${derivedFamilies.length}  (read off the title; SSOT has no offer_product_links row)`)
  console.log(`unclassified      ${unclassified.length}  (no family term in the title)`)
  for (const i of unclassified) console.log(`  ${i.code}  ${i.name_th.slice(0, 54)}`)
  console.log('  fix upstream: add offer_product_links rows, or a family for these product types.')
}

const splitPricing = supplierItems.filter(i => i.packaging_options?.some(p => !p.cost_included))
if (splitPricing.length) {
  console.log('')
  console.log(`split packaging   ${splitPricing.length}  (ladder shown covers some boxes only)`)
  for (const i of splitPricing) {
    const inc = i.packaging_options.filter(p => p.cost_included)
    const out = i.packaging_options.filter(p => !p.cost_included)
    const shown = inc.map(p => p.package_code).join('/')
    const other = out.map(p => `${p.package_code} ฿${p.from_price ?? '?'}`).join(', ')
    console.log(`  ${i.code}  showing ${shown} ฿${inc[0]?.from_price ?? '?'}  |  not shown: ${other}`)
  }
}

