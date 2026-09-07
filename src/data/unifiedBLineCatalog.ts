import { SMARTGIFT_PRODUCTS, SmartGiftProduct } from './smartGiftCatalogData'

export interface BLineProduct {
  id: string
  name: string
  designer: string
  year: number
  category: 'Chair' | 'Stool' | 'Lamp' | 'Storage'
  image: string
}

export const BLINE_PRODUCTS: BLineProduct[] = [
  {
    id: 'boby',
    name: 'Boby',
    designer: 'Joe Colombo',
    year: 1970,
    category: 'Storage',
    image: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260629_104530_521b2f85-c0f3-4d0e-9704-b578315b4cb9.png&w=1920&q=85'
  },
  {
    id: 'spinny',
    name: 'Spinny',
    designer: 'Marc Sadler',
    year: 2003,
    category: 'Stool',
    image: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260629_103711_76ccdb8b-5043-4f47-9c54-4379713393ea.png&w=1920&q=85'
  },
  {
    id: 'ring',
    name: 'Ring',
    designer: 'Marc Sadler',
    year: 2005,
    category: 'Lamp',
    image: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260629_103728_394f6a1b-85e2-4386-a4f6-408472a0a5b7.png&w=1920&q=85'
  },
  {
    id: 'linea',
    name: 'Linea',
    designer: 'Marc Newson',
    year: 2012,
    category: 'Stool',
    image: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260629_103739_86743e0e-16a7-4bee-bf38-dd67985344dc.png&w=1920&q=85'
  },
  {
    id: 'arco',
    name: 'Arco',
    designer: 'Michele De Lucchi',
    year: 2015,
    category: 'Lamp',
    image: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260629_103748_b2215dc8-a3a7-470d-b19a-5b87fa7d0c37.png&w=1920&q=85'
  },
  {
    id: 'polo',
    name: 'Polo',
    designer: 'Alberto Meda',
    year: 2018,
    category: 'Stool',
    image: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260629_103758_e919ce72-5c9d-4b87-9be6-d7647b34825c.png&w=1920&q=85'
  },
  {
    id: 'cento',
    name: 'Cento',
    designer: 'Jasper Morrison',
    year: 2019,
    category: 'Chair',
    image: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260629_103808_013583d0-3386-4547-9832-37c7d8edb3ac.png&w=1920&q=85'
  },
  {
    id: 'orbita',
    name: 'Orbita',
    designer: 'Ferruccio Laviani',
    year: 2020,
    category: 'Lamp',
    image: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260629_103937_a0c49d0a-33eb-4ead-aea6-c1baf241acbc.png&w=1920&q=85'
  },
  {
    id: 'kilo',
    name: 'Kilo',
    designer: 'Stefan Diez',
    year: 2021,
    category: 'Stool',
    image: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260629_103956_d18ed8fd-7b6f-4b86-91f9-20010fe38670.png&w=1920&q=85'
  },
  {
    id: 'uno',
    name: 'Uno',
    designer: 'Ronan Bouroullec',
    year: 2022,
    category: 'Chair',
    image: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260629_104034_ba5a9963-87ff-4008-a545-6bd686c088b5.png&w=1920&q=85'
  },
  {
    id: 'nova',
    name: 'Nova',
    designer: 'Patricia Urquiola',
    year: 2023,
    category: 'Lamp',
    image: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260629_104530_521b2f85-c0f3-4d0e-9704-b578315b4cb9.png&w=1920&q=85'
  },
  {
    id: 'duo',
    name: 'Duo',
    designer: 'Konstantin Grcic',
    year: 2024,
    category: 'Stool',
    image: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260629_103711_76ccdb8b-5043-4f47-9c54-4379713393ea.png&w=1920&q=85'
  }
]

export interface UnifiedCatalogItem {
  id: string
  name: string
  name_th?: string
  subtitle: string
  category: 'Eco-Friendly' | 'Classic Oriental' | 'Novelty & Care' | 'Smart Tech' | 'Bespoke (B-Line)'
  image: string
  mockup_image?: string
  model3d_url?: string
  client_showcase?: { brand: string; image: string }[]
  srp_price?: number
  bulk_price?: number
  price_tiers?: { min_qty: number; unit_price: number }[]
  dimensions?: string
  weight?: string
  lead_time?: string
  description: string
  designer?: string
  year?: number
}

// Convert SmartGift 16 products to UnifiedCatalogItem
const smartGiftUnified: UnifiedCatalogItem[] = SMARTGIFT_PRODUCTS.map((p) => {
  let categoryName: UnifiedCatalogItem['category'] = 'Eco-Friendly'
  if (p.category_slug === 'classic-oriental') categoryName = 'Classic Oriental'
  else if (p.category_slug === 'novelty-self-care') categoryName = 'Novelty & Care'
  else if (p.category_slug === 'executive-smart-tech') categoryName = 'Smart Tech'

  const bestTier = p.price_tiers[p.price_tiers.length - 1]
  const clientBrand = p.client_showcase && p.client_showcase.length > 0 ? p.client_showcase[0].brand : null

  return {
    id: p.code,
    name: p.name_en,
    name_th: p.name_th,
    subtitle: clientBrand ? `${clientBrand} Showcase · ฿${bestTier.unit_price}` : `B2B Tier from ฿${bestTier.unit_price}`,
    category: categoryName,
    image: p.plate_image,
    mockup_image: p.mockup_image,
    model3d_url: p.model3d_url,
    client_showcase: p.client_showcase,
    srp_price: p.srp_price,
    bulk_price: bestTier.unit_price,
    price_tiers: p.price_tiers,
    dimensions: `${p.dimensions_cm.length} × ${p.dimensions_cm.width} × ${p.dimensions_cm.height} cm`,
    weight: `${p.unit_weight_kg} kg`,
    lead_time: `${p.lead_time_days} days`,
    description: p.description_th
  }
})

// Convert B-Line Italian Design products to UnifiedCatalogItem (Tier: Bespoke (B-Line))
const blineUnified: UnifiedCatalogItem[] = BLINE_PRODUCTS.map((p) => ({
  id: p.id,
  name: p.name,
  subtitle: `${p.designer}, ${p.year}`,
  category: 'Bespoke (B-Line)',
  image: p.image,
  designer: p.designer,
  year: p.year,
  description: `Masterpiece of Italian industrial design by ${p.designer} (${p.year}). Featured in the permanent collection of international design museums. Precision crafted by B—Line S.r.l., Italy.`
}))

// Combine into canonical unified catalog
export const UNIFIED_CATALOG_ITEMS: UnifiedCatalogItem[] = [
  ...smartGiftUnified,
  ...blineUnified
]

export const CATALOG_TIERS = [
  'All',
  'Eco-Friendly',
  'Classic Oriental',
  'Novelty & Care',
  'Smart Tech',
  'Bespoke (B-Line)'
] as const
