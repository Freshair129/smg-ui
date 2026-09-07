/**
 * Compatibility adapter for the alternate SmartGiftCatalogSection view.
 * Facts (names, prices, dimensions) are read from the SSOT-generated item pool —
 * nothing here is typed by hand anymore. Prefer CATALOG_ITEMS (catalogItems.ts) in new code.
 */
import { INTEREST_THEMES, ThemeSlug, PriceTier } from './catalogTaxonomy'
import { CATALOG_ITEMS } from './catalogItems'
import { CORE_MEDIA } from './coreMedia'

export type { PriceTier }

export interface SmartGiftProduct {
  code: string
  name_th: string
  name_en: string
  category_slug: ThemeSlug
  category_name: string
  srp_price: number
  price_tiers: PriceTier[]
  dimensions_cm: { length: number; width: number; height: number }
  unit_weight_kg: number
  model3d_url?: string
  plate_image: string
  mockup_image: string
  client_showcase?: { brand: string; image: string }[]
  lead_time_days: number
  description_th: string
}

export interface CatalogCategory {
  slug: ThemeSlug
  name_th: string
  name_en: string
  vibe: string
  target_recipient: string
  icon: string
}

const THEME_ICON: Record<ThemeSlug, string> = {
  'eco-friendly': '🌿',
  'classic-oriental': '🏮',
  'novelty-self-care': '🕯️',
  'executive-smart-tech': '⚡'
}

export const SMARTGIFT_CATEGORIES: CatalogCategory[] = INTEREST_THEMES.map(t => ({
  slug: t.slug,
  name_th: t.name_th,
  name_en: t.name_en,
  vibe: t.vibe,
  target_recipient: t.target_recipient,
  icon: THEME_ICON[t.slug]
}))

const themeName = (slug?: ThemeSlug) => INTEREST_THEMES.find(t => t.slug === slug)?.name_en ?? ''

export const SMARTGIFT_PRODUCTS: SmartGiftProduct[] = CATALOG_ITEMS
  .filter(item => item.kind === 'single' && item.theme && item.srp_price !== undefined)
  .map(item => ({
    code: item.code,
    name_th: item.name_th,
    name_en: item.name_en ?? item.name_th,
    category_slug: item.theme as ThemeSlug,
    category_name: themeName(item.theme),
    srp_price: item.srp_price as number,
    price_tiers: item.price_tiers ?? [],
    dimensions_cm: item.dimensions_cm ?? { length: 0, width: 0, height: 0 },
    unit_weight_kg: item.unit_weight_kg ?? 0,
    model3d_url: item.model3d_url,
    plate_image: item.image ?? '',
    mockup_image: CORE_MEDIA[item.code]?.mockup_image ?? item.image ?? '',
    client_showcase: item.client_showcase,
    lead_time_days: item.lead_time_days ?? 0,
    description_th: item.description_th ?? item.name_th
  }))
