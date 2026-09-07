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
  finalizeItem,
  productFamily,
  standardCategory
} from './catalogTaxonomy'
import { CORE_ITEMS } from './catalogItems.generated'
import { CORE_MEDIA } from './coreMedia'
import { BLINE_PRODUCTS } from './unifiedBLineCatalog'

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
