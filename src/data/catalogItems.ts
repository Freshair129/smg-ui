/**
 * The catalog item pool. Three layers, one shape (CatalogItem):
 *   core     — 16 PM singles + 6 core sets, generated from the SSOT (catalogItems.generated.ts)
 *              with media overlaid from coreMedia.ts. Bundled, synchronous.
 *   supplier — factory catalog projection, public-eligible rows only. Fetched on demand from
 *              /catalog/data/supplier-items.json (written by `npm run build:catalog`).
 *   partner  — B—Line design pieces. Not SmartGift SKUs; shown only under #bline.
 *
 * AGENTS.md Rule 3: this module must never import from src/components.
 */
import {
  CatalogItem,
  CatalogItemSeed,
  INTEREST_THEMES,
  finalizeItem,
  productFamily,
  standardCategory
} from './catalogTaxonomy'
import { CORE_ITEMS, SUPPLIER_LAYER_META, BUNDLE_TEMPLATES } from './catalogItems.generated'
import { CORE_MEDIA } from './coreMedia'
import { BLINE_PRODUCTS } from './unifiedBLineCatalog'

export { SUPPLIER_LAYER_META, BUNDLE_TEMPLATES }

function withMedia(seed: CatalogItemSeed): CatalogItemSeed {
  const media = CORE_MEDIA[seed.code]
  if (!media) return seed
  return {
    ...seed,
    image: media.image ?? seed.image,
    image_status: media.image ? media.image_status ?? 'generated_from_source' : seed.image_status,
    model3d_url: media.model3d_url,
    model3d_status: media.model3d_url ? media.model3d_status ?? 'draft' : undefined,
    client_showcase: media.client_showcase,
    description_th: media.description_th ?? seed.description_th,
    lead_time_days: media.lead_time_days ?? seed.lead_time_days
  }
}

/** Core layer: 16 singles + 6 sets, facts from the SSOT, media from coreMedia.ts. */
export const CATALOG_ITEMS: CatalogItem[] = CORE_ITEMS.map(withMedia).map(finalizeItem)

export const CATALOG_ITEM_BY_CODE: Record<string, CatalogItem> = Object.fromEntries(
  CATALOG_ITEMS.map(item => [item.code, item])
)

/** Core sets only — the options a package group can pick from. */
export const CORE_SETS: CatalogItem[] = CATALOG_ITEMS.filter(item => item.kind === 'set')

/** B—Line design partner pieces, rendered with the same card/modal but kept out of #catalog pools. */
export const PARTNER_ITEMS: CatalogItem[] = BLINE_PRODUCTS.map(p => ({
  id: `partner:bline-${p.id}`,
  code: p.id,
  kind: 'single',
  layer: 'partner',
  name_th: p.name,
  name_en: p.name,
  families: [],
  standard_category: 'unclassified',
  price_status: 'ask_for_quote',
  image: p.image,
  image_status: 'generated_from_source',
  designer: p.designer,
  year: p.year,
  description_th: `${p.category} · ออกแบบโดย ${p.designer} (${p.year}) · ผลิตโดย B—Line S.r.l., Italy`
}))

// ---------------------------------------------------------------------------
// Supplier layer (lazy)
// ---------------------------------------------------------------------------

export const SUPPLIER_ITEMS_URL = '/catalog/data/supplier-items.json'

interface SupplierFile {
  schema: string
  generated_at: string
  disclaimer_th?: string
  items: CatalogItemSeed[]
}

let supplierCache: Promise<CatalogItem[]> | null = null

/** Fetches the supplier layer once and caches it for the session. Returns [] when the file is absent. */
export function loadSupplierItems(): Promise<CatalogItem[]> {
  if (!supplierCache) {
    supplierCache = fetch(SUPPLIER_ITEMS_URL)
      .then(res => (res.ok ? (res.json() as Promise<SupplierFile>) : Promise.reject(new Error(`HTTP ${res.status}`))))
      .then(file => (file.schema === 'smartgift-catalog-items/1' ? file.items.map(finalizeItem) : []))
      .catch(() => {
        supplierCache = null
        return [] as CatalogItem[]
      })
  }
  return supplierCache
}

// ---------------------------------------------------------------------------
// Display helpers shared by components (pure functions, no React)
// ---------------------------------------------------------------------------

export function familyLabel(slug: string): string {
  return productFamily(slug)?.name_th ?? slug
}

export function categoryLabel(slug: string): string {
  return standardCategory(slug)?.name_th ?? slug
}

export function formatBaht(n: number): string {
  return `฿${Math.round(n).toLocaleString('en-US')}`
}

// ---------------------------------------------------------------------------
// Search — one lowercase haystack per item (code, names, families + aliases, copy)
// ---------------------------------------------------------------------------

const haystacks = new WeakMap<CatalogItem, string>()

export function searchHaystack(item: CatalogItem): string {
  const cached = haystacks.get(item)
  if (cached) return cached
  const familyTerms = item.families.flatMap(f => {
    const fam = productFamily(f)
    return fam ? [fam.slug, fam.name_th, fam.name_en, ...fam.aliases_th, ...fam.aliases_en] : [f]
  })
  const theme = INTEREST_THEMES.find(t => t.slug === item.theme)
  const text = [
    item.code,
    // A merged supplier row keeps its factory code searchable — the code was on the site before
    // the two records were collapsed, and buyers quote it.
    item.factory_item_code,
    item.name_th,
    item.name_en,
    item.description_th,
    item.unboxing_th,
    item.tier,
    theme?.short_th,
    theme?.short_en,
    standardCategory(item.standard_category)?.name_th,
    ...familyTerms,
    ...(item.contains ?? []).map(c => `${c.product_code} ${c.name_th ?? ''}`),
    ...(item.colors ?? []),
    item.branding,
    item.designer
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
  haystacks.set(item, text)
  return text
}

/** Every whitespace-separated token must appear somewhere in the item's haystack. */
export function matchesQuery(item: CatalogItem, query: string): boolean {
  const tokens = query.toLowerCase().split(/\s+/).filter(Boolean)
  if (!tokens.length) return true
  const hay = searchHaystack(item)
  return tokens.every(t => hay.includes(t))
}

export function imageStatusLabel(status: CatalogItem['image_status']): string {
  switch (status) {
    case 'source_verified':
      return 'ภาพต้นฉบับ'
    case 'generated_from_source':
      return 'ภาพสร้างสรรค์จากภาพสินค้าอ้างอิง'
    default:
      return 'ยังไม่มีภาพสินค้า'
  }
}
