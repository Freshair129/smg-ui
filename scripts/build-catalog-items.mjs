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
if (Object.keys(PM_FAMILY).length < 16) throw new Error(`PM_FAMILY has ${Object.keys(PM_FAMILY).length} rows, expected 16`)
if (FAMILY_SLUGS.size < 32) throw new Error(`PRODUCT_FAMILIES has ${FAMILY_SLUGS.size} rows, expected >= 32`)

// ---------------------------------------------------------------------------
// Load SSOT
// ---------------------------------------------------------------------------
const pricelist = await readJson(PRICELIST)
const master = await readJson(MASTER)
const mediaJson = existsSync(MEDIA_JSON) ? await readJson(MEDIA_JSON) : { sets: [], products: [] }

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

const coreSingles = pricelist.srp_reference_products.map(r => {
  const c = canonicalByCode[r.product_code]
  if (!c) throw new Error(`canonical product missing for ${r.product_code}`)
  const family = PM_FAMILY[r.product_code]
  if (!family) throw new Error(`PM_FAMILY has no row for ${r.product_code} — add it to catalogTaxonomy.ts`)
  if (!themeSlugs.has(r.category_slug)) throw new Error(`unknown theme ${r.category_slug} on ${r.product_code}`)
  const tiers = [...r.price_tiers].sort((a, b) => a.min_qty - b.min_qty)
  return {
    id: `pm:${r.product_code}`,
    code: r.product_code,
    kind: 'single',
    layer: 'core',
    name_th: r.name_th,
    name_en: r.name_en,
    theme: r.category_slug,
    families: [family],
    price_status: tiers.length ? 'tiered' : 'ask_for_quote',
    srp_price: r.srp_price,
    price_tiers: tiers,
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
  const tiers = [...(o.price_tiers ?? [])].sort((a, b) => a.min_qty - b.min_qty)
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
    price_tiers: tiers,
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

let supplierSkippedNotPublic = 0
const supplierItems = []
for (const o of pricelist.catalog_offers) {
  const linked = [...new Set(linksByOffer.get(o.code) ?? [])].map(c => pmByCode[c]).filter(Boolean)
  const families = [...new Set(linked.map(p => p.product_family_id).filter(f => f && FAMILY_SLUGS.has(f)))]
  const tiers = (o.source_price_tiers ?? [])
    .filter(t => !t.priceMissing && Number(t.unitPrice) > 0 && Number(t.qtyTier) > 0)
    .map(t => ({ min_qty: Number(t.qtyTier), unit_price: Number(t.unitPrice) }))
    .sort((a, b) => a.min_qty - b.min_qty)
  const { image, image_status } = resolveImage(o.code)
  const priceStatus = tiers.length ? 'tiered' : 'ask_for_quote'
  const kind = o.offer_kind === 'single' ? 'single' : 'set'
  const eligible = image_status !== 'missing' || priceStatus === 'tiered'
  if (!eligible || (kind === 'single' && families.length === 0)) { supplierSkippedNotPublic++; continue }
  const description = clean(o.description)
  const item = {
    id: `offer:${o.code}`,
    code: o.code,
    kind,
    layer: 'supplier',
    name_th: clean(o.name_th || o.name || o.name_en || o.code),
    name_en: o.name_en ? clean(o.name_en) : undefined,
    families,
    price_status: priceStatus,
    price_tiers: tiers.length ? tiers : undefined,
    moq: tiers[0]?.min_qty,
    contains: kind === 'set' && linked.length
      ? linked.slice(0, 8).map(p => ({ product_code: p.code, qty: 1, name_th: p.display_name || p.name_en || p.name_th || p.code }))
      : undefined,
    image,
    image_status,
    description_th: description ? description.slice(0, 260) : undefined,
    branding: o.branding || undefined,
    provenance: { source_file: 'data-pipeline/02_prepared/pricelist_master.json', source_key: o.code }
  }
  for (const k of Object.keys(item)) if (item[k] === undefined) delete item[k]
  supplierItems.push(item)
}
supplierItems.sort((a, b) => (a.image_status === 'missing') - (b.image_status === 'missing') || a.code.localeCompare(b.code))

// ---------------------------------------------------------------------------
// Write outputs
// ---------------------------------------------------------------------------
const stamp = new Date().toISOString()
const strip = items => items.map(i => { const o = { ...i }; for (const k of Object.keys(o)) if (o[k] === undefined) delete o[k]; return o })

const header = `/**
 * GENERATED FILE — do not edit by hand. Run: npm run build:catalog
 * Source: ${PRICELIST.replace(/\\\\/g, '/')} (schema ${pricelist.metadata?.schema_version ?? '?'}, run ${pricelist.metadata?.source_run?.run_id ?? '?'})
 * Generated: ${stamp}
 * Core layer only: ${coreSingles.length} PM singles + ${coreSetItems.length} core sets. Media is overlaid from coreMedia.ts.
 */
import type { CatalogItemSeed } from './catalogTaxonomy'

export const CORE_ITEMS: CatalogItemSeed[] = ${JSON.stringify(strip([...coreSingles, ...coreSetItems]), null, 2)}
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

const count = (arr, f) => arr.filter(f).length
console.log(`core singles      ${coreSingles.length}`)
console.log(`core sets         ${coreSetItems.length}  (priced ${count(coreSetItems, i => i.price_status === 'tiered')})`)
console.log(`supplier eligible ${supplierItems.length} / ${pricelist.catalog_offers.length}  (image ${count(supplierItems, i => i.image_status !== 'missing')}, priced ${count(supplierItems, i => i.price_status === 'tiered')}, skipped ${supplierSkippedNotPublic})`)
console.log(`wrote ${OUT_CORE}`)
console.log(`wrote ${OUT_SUPPLIER}`)
