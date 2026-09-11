/**
 * SmartGift catalog taxonomy — canonical vocabulary for the web catalog.
 *
 * Two lenses over ONE item pool:
 *   Lens A  recipient-first (brand):  Occasion → Gift Tier → Interest Theme
 *   Lens B  standard (conventional):  Standard Category (L1) → Product Family (L2)
 *
 * Source of truth (do not change values here without a matching change upstream):
 *   business-01-smart-gift/data-pipeline/02_prepared/smartgift_catalog_master.json  (4 themes, 16 PM, core sets)
 *   business-01-smart-gift/data-pipeline/02_prepared/pricelist_master.json          (32 product_families, offers, pkg)
 *   business-01-smart-gift/docs/business/SMARTGIFT-PRODUCT-TAXONOMY-OFFER-RULES-2026-08.md (controlled vocabulary)
 *   business-01-smart-gift/config/schema_genesisblock.yaml                          (canonical id prefixes)
 *
 * Spec: docs/CATALOG-STRUCTURE-SPEC.md
 * AGENTS.md Rule 3: this module must never import from src/components.
 */

// ---------------------------------------------------------------------------
// Vocabulary
// ---------------------------------------------------------------------------

/** 4 interest themes = `Category` nodes (`cat:`) in the GenesisBlock schema. */
export type ThemeSlug = 'eco-friendly' | 'classic-oriental' | 'novelty-self-care' | 'executive-smart-tech'

/** Gift tier = level of treatment, never a product type (Portfolio Architecture P5). */
export type GiftTier = 'Reach' | 'Select' | 'Signature' | 'Bespoke'

/** Controlled theme vocabulary from the Product Taxonomy & Offer Rules doc (§6.1). */
export type ControlledTheme =
  | 'TECH'
  | 'CARE_WELLNESS'
  | 'TASTE'
  | 'LIFESTYLE_TRAVEL'
  | 'IMPACT'
  | 'WORK_WELCOME'
  | 'CULTURE_LOCAL'

/** Standard (conventional) category — Level 1 of Lens B. */
export type StandardCategorySlug =
  | 'drinkware'
  | 'tech-gadgets'
  | 'stationery-office'
  | 'bags-travel'
  | 'wellness-personal-care'
  | 'home-living'
  | 'gift-sets'
  | 'unclassified'

/** Product family — Level 2 of Lens B. 32 slugs come from pricelist_master.product_families; the rest cover PM-only items. */
export type ProductFamilySlug =
  | 'drinkware'
  | 'coffee_maker'
  | 'cutlery'
  | 'power_bank'
  | 'charger'
  | 'usb_flash_drive'
  | 'speaker'
  | 'earbuds'
  | 'earphone'
  | 'headset'
  | 'mouse'
  | 'keyboard'
  | 'smart_bracelet'
  | 'car_accessory'
  | 'notebook'
  | 'notebook_refill'
  | 'pen'
  | 'bookmark'
  | 'name_card_holder'
  | 'key_chain'
  | 'lighter'
  | 'desk_mat'
  | 'bag'
  | 'briefcase'
  | 'umbrella'
  | 'neck_massager'
  | 'massage_gun'
  | 'massage_comb'
  | 'fan'
  | 'hair_dryer'
  | 'humidifier'
  | 'aroma_diffuser'
  | 'nail_clipper'
  | 'towel'
  | 'glove'

/** Source grouping used by pricelist_master.product_families.source_group_id. */
export type SourceGroup = 'home_travel' | 'office' | 'smart_tech' | 'care_wellness'

export type OfferKind = 'single' | 'set' | 'bundle'
export type CatalogLens = 'recipient' | 'standard'
export type CatalogView = 'grid' | 'list' | 'index'
export type PriceStatus = 'tiered' | 'ask_for_quote'
export type ImageStatus = 'source_verified' | 'generated_from_source' | 'missing'
export type OccasionSlug =
  | 'new-year'
  | 'christmas'
  | 'songkran'
  | 'new-employee-welcome'
  | 'recognition'
  | 'member-appreciation'
  | 'launch-event'
  | 'csr-community'

export type RecipientRelationshipCode =
  | 'LEADERSHIP'
  | 'TEAM'
  | 'CUSTOMER_MEMBER'
  | 'PARTNER_DEALER'
  | 'MEDIA_CREATOR'
  | 'GUEST_PUBLIC'
  | 'COMMUNITY'

// ---------------------------------------------------------------------------
// Records
// ---------------------------------------------------------------------------

export interface InterestTheme {
  slug: ThemeSlug
  /** Full label as recorded in the SSOT. */
  name_th: string
  name_en: string
  /** Short label for nav pills. */
  short_th: string
  short_en: string
  vibe: string
  target_recipient: string
  guardrail: string
  controlled_themes: ControlledTheme[]
}

export interface GiftTierDef {
  code: GiftTier
  name_th: string
  /** Wording from the 2026 creative proof (public-safe). */
  tagline_th: string
  definition_th: string
  definition_en: string
}

export interface StandardCategory {
  slug: StandardCategorySlug
  name_th: string
  name_en: string
  description_th: string
  /** Level-2 families that roll up into this category. Empty for gift-sets / unclassified. */
  families: ProductFamilySlug[]
  sort: number
  /** Hidden from the public catalog until a human classifies the item (taxonomy gate CLASSIFIED). */
  public: boolean
}

export interface ProductFamily {
  slug: ProductFamilySlug
  name_th: string
  name_en: string
  standard_category: StandardCategorySlug
  source_group: SourceGroup
  aliases_th: string[]
  aliases_en: string[]
}

export interface Occasion {
  slug: OccasionSlug
  name_th: string
  name_en: string
  /** GTM beachhead archetype this occasion belongs to. */
  archetype: 'customer-member' | 'launch-event' | 'employee' | 'seasonal'
  /** Recipient relationships that commonly appear in this occasion (Portfolio Architecture §10). Hint only. */
  typical_recipients: RecipientRelationshipCode[]
}

export interface RecipientRelationship {
  code: RecipientRelationshipCode
  name_en: string
  name_th: string
  examples_th: string
  /**
   * Gift tiers this relationship is usually treated with (Portfolio Architecture §7 "เหมาะกับ" + §12.2).
   * A starting point for the brief, never a rule — the client owns the mapping (P4) and Signature is
   * not reserved for executives (P5).
   */
  typical_tiers: GiftTier[]
}

export interface PriceTier {
  min_qty: number
  unit_price: number
}

/**
 * Which of the two selling prices a ladder is.
 *
 * SPEC-FULL-ENTERPRISE-SCHEMA-2026-09-10 §3 splits selling price into
 * `standard_selling_price_thb` (retail SRP, 39-52% margin) and
 * `corporate_selling_price_thb` (B2B, 20-35%). This site publishes the standard ladder.
 *
 * NEVER subtract one from the other and call the difference profit — both are selling prices.
 * Gross margin is only ever (selling price - landed cost), and landed cost never leaves the SSOT.
 * See business-01-smart-gift/.agent/price/AGENT.md for the full four-layer taxonomy.
 */
export type PriceLayer =
  /** Retail / catalogue SRP incl. logo printing. What this site shows today. */
  | 'standard'
  /** Negotiated corporate B2B price. Lower than standard; not published yet. */
  | 'corporate'

/**
 * One packaging choice, after SPEC-FULL-ENTERPRISE-SCHEMA §3 `packaging_options[]`.
 * `P-06`, `P-20`, `P-BAG` are box types, never new SKUs (AGENT.md rule 3) — but they carry their
 * own price, and the SSOT's `flowaccount_product_code` is `Model-Count(Package)`.
 *
 * The spec also defines `additional_cost_thb`, a delta from the included box. We do not emit it:
 * the SSOT gives absolute ladders per variant, and for at least one code the other variant is
 * *cheaper* because its set contents differ — a derived "additional cost" would be negative and
 * misleading. `from_price` carries the real number instead.
 */
export interface PackagingOption {
  /** Package code as written in the SSOT, e.g. `P-02`. */
  package_code: string
  /** True when the published ladder already covers this box. */
  cost_included: boolean
  /** Unit price at the ladder's first quantity step, when the SSOT knows it. */
  from_price?: number
}

export interface BomLine {
  product_code: string
  qty: number
  name_th?: string
}

/** One recipient group inside a multi-tier package template. `qty` = number of recipients (sets), unknown until the brief. */
export interface BundleTemplateGroup {
  label: string
  /** Segment name as written in the SSOT (Operations / Mid-Management / C-Level). */
  segment?: string
  tier?: GiftTier
  /** Core set proposed for this group; undefined = choose in the builder (Bespoke never has one). */
  offer_code?: string
  qty?: number
}

/**
 * Package template = the structure of a BundleOffer (`bundle:`) without any cost, margin or stored total.
 * `pkg` rows come from pricelist_master.pkg (11, none quote-ready yet); `blueprint` rows are the two worked
 * examples in the portfolio blueprint. Prices are always recomputed from the set ladders in the builder.
 */
export interface BundleTemplate {
  code: string
  name_th: string
  source: 'pkg' | 'blueprint'
  status: string
  occasion?: OccasionSlug
  description_th?: string
  target_recipients?: number
  design_scope_themes: ThemeSlug[]
  groups: BundleTemplateGroup[]
}

/**
 * One row of the catalog item pool. Singles, sets and bundles share this shape so
 * both lenses can filter the same array. Values are generated from the SSOT —
 * never hand-edit prices here (PRODUCT.md: ไม่แต่งราคา MOQ วัสดุ สี หรือส่วนประกอบที่ยังไม่ยืนยัน).
 */
export interface CatalogItem {
  /** Canonical id: `pm:PM-TMB`, `offer:TGC06-4`, `bundle:smartgift-…`. */
  id: string
  code: string
  /**
   * Factory model code for a core product, from the confirmed factory_cost_pm_mapping
   * (SPEC-FULL-ENTERPRISE-SCHEMA §3 `codes_and_identification.factory_item_code`).
   * Present when a supplier row for the same physical product was merged into this one.
   */
  factory_item_code?: string
  kind: OfferKind
  /** core = PM-confirmed (16 singles + 6 sets); supplier = factory catalog projection; partner = B—Line design pieces (not SmartGift SKUs). */
  layer: 'core' | 'supplier' | 'partner'
  name_th: string
  name_en?: string
  // Lens A
  theme?: ThemeSlug
  tier?: GiftTier
  tier_eligibility?: GiftTier[]
  occasions?: OccasionSlug[]
  // Lens B
  families: ProductFamilySlug[]
  /**
   * True when `families` was read off the item's own title instead of the SSOT's
   * offer_product_links — weaker evidence, kept so QA can tell the two apart.
   * The link table has no rows for 50 of the supplier sets; see the builder.
   */
  families_derived?: boolean
  standard_category: StandardCategorySlug
  // Commercial (public-safe only — no cost, no margin)
  price_status: PriceStatus
  srp_price?: number
  price_tiers?: PriceTier[]
  /** Which of the two selling prices `price_tiers` / `srp_price` is. Absent when ask-for-quote. */
  price_layer?: PriceLayer
  /**
   * Packaging choices for this product. Options with `cost_included: true` are covered by the
   * published ladder; the rest are priced differently and must be quoted separately.
   * Populated only while pricelist_master collapses variants into one offer row.
   */
  packaging_options?: PackagingOption[]
  moq?: number
  lead_time_days?: number
  // Physical
  dimensions_cm?: { length: number; width: number; height: number }
  unit_weight_kg?: number
  // Composition
  contains?: BomLine[]
  /** Reverse BOM for singles: offer codes that include this product. */
  used_in?: string[]
  // Media
  image?: string
  image_status: ImageStatus
  model3d_url?: string
  model3d_status?: 'draft' | 'owner_approved'
  client_showcase?: { brand: string; image: string }[]
  // Copy
  description_th?: string
  unboxing_th?: string
  /** Supplier branding methods as written in the source (e.g. "สกรีนโลโก้,เลเซอร์โลโก้"). */
  branding?: string
  colors?: string[]
  // Partner (B—Line) only
  designer?: string
  year?: number
  /** merged_codes: other spellings of this offer code merged into it at build time (e.g. TDR0--3 into TDR0-3) */
  provenance?: { source_file: string; source_key: string; merged_codes?: string[] }
}

/** Shape emitted by scripts/build-catalog-items.mjs — the Level-1 category is derived at import time. */
export type CatalogItemSeed = Omit<CatalogItem, 'standard_category'>

export function finalizeItem(seed: CatalogItemSeed): CatalogItem {
  return { ...seed, standard_category: standardCategoryOf(seed.kind, seed.families) }
}

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

export const CANONICAL_ID_PREFIX = {
  Category: 'cat:',
  ProductMaster: 'pm:',
  CatalogOffer: 'offer:',
  BundleOffer: 'bundle:',
  GiftTier: 'tier:',
  RecipientSegment: 'seg:'
} as const

export const INTEREST_THEMES: InterestTheme[] = [
  {
    slug: 'eco-friendly',
    name_th: 'ชุดผลิตภัณฑ์รักษ์โลกและสิ่งแวดล้อม (Eco-Friendly Series)',
    name_en: 'Eco-Friendly & Sustainability (Green & Earth)',
    short_th: 'รักษ์โลก',
    short_en: 'Eco-Friendly',
    vibe: 'ยั่งยืน รักษ์โลก เป็นมิตรต่อธรรมชาติ',
    target_recipient: 'องค์กรสาย ESG, แคมเปญเพื่อสิ่งแวดล้อม',
    guardrail: 'เน้นใช้วัสดุรีไซเคิล ย่อยสลายได้ หรือลดขยะพลาสติก — คำว่า ECO ไม่ใช่หลักฐาน ต้องมี material/certificate ก่อน claim',
    controlled_themes: ['IMPACT', 'LIFESTYLE_TRAVEL']
  },
  {
    slug: 'classic-oriental',
    name_th: 'ชุดศิลปะร่วมสมัยและตะวันออก (Classic Oriental)',
    name_en: 'Classic Oriental (Mindfulness & Craft)',
    short_th: 'ศิลปะและวัฒนธรรม',
    short_en: 'Classic Oriental',
    vibe: 'ประณีต ทรงคุณค่า คลาสสิก',
    target_recipient: 'ผู้ใหญ่, แขก VIP ต่างชาติ',
    guardrail: 'ตรวจเช็คความหมายมงคลของลวดลาย และสิทธิ์ใช้ design/story',
    controlled_themes: ['CULTURE_LOCAL', 'WORK_WELCOME']
  },
  {
    slug: 'novelty-self-care',
    name_th: 'ชุด Novelty & Self-Care',
    name_en: 'Novelty & Self-Care (Warm & Wellness)',
    short_th: 'ไลฟ์สไตล์และดูแลตัวเอง',
    short_en: 'Novelty & Care',
    vibe: 'ผ่อนคลาย อบอุ่น ใส่ใจ',
    target_recipient: 'กลุ่มผู้หญิง, พนักงานสาย Wellness',
    guardrail: 'ห้ามเคลมสรรพคุณ Medical โดยไม่มีหลักฐาน',
    controlled_themes: ['CARE_WELLNESS', 'LIFESTYLE_TRAVEL']
  },
  {
    slug: 'executive-smart-tech',
    name_th: 'ชุดนวัตกรรมทางการทำงานอัจฉริยะ (Executive Smart Tech)',
    name_en: 'Executive Smart Tech (Modern & Work)',
    short_th: 'เทคโนโลยีและการทำงาน',
    short_en: 'Smart Tech',
    vibe: 'ทันสมัย นวัตกรรม เป็นมืออาชีพ',
    target_recipient: 'ผู้บริหาร, กลุ่มนักธุรกิจยุคใหม่',
    guardrail: 'ตรวจสเปกแบตเตอรี่และการรับรองความปลอดภัย',
    controlled_themes: ['TECH', 'WORK_WELCOME']
  }
]

export const GIFT_TIERS: GiftTierDef[] = [
  {
    code: 'Reach',
    name_th: 'Reach',
    tagline_th: 'เข้าถึงผู้รับในวงกว้าง',
    definition_th: 'ของขวัญจำนวนมากสำหรับงาน Event / Mass Engagement เน้นความคุ้มค่าและความเร็ว',
    definition_en: 'Repeatable, cost-controlled gifts for large audiences'
  },
  {
    code: 'Select',
    name_th: 'Select',
    tagline_th: 'คัดให้เหมาะกับกลุ่ม',
    definition_th: 'ของขวัญมาตรฐานระดับพรีเมียมสำหรับพนักงานหรือลูกค้าทั่วไป (Balanced & Versatile)',
    definition_en: 'Curated standard-premium gifts for a specific group'
  },
  {
    code: 'Signature',
    name_th: 'Signature',
    tagline_th: 'ใส่ใจในรายละเอียด',
    definition_th: 'การดูแลระดับพิเศษสำหรับ VIP, Top Partner หรือ High-Impact Stakeholder (Premium Unboxing)',
    definition_en: 'High quality bar with curated presentation and personalization'
  },
  {
    code: 'Bespoke',
    name_th: 'Bespoke',
    tagline_th: 'ออกแบบตามบริบท',
    definition_th: 'งานสั่งผลิตเฉพาะเจาะจงหรือ Exclusive Collaboration (Fully Customized)',
    definition_en: 'Project-specific development with design, commercial and operations review'
  }
]

export const STANDARD_CATEGORIES: StandardCategory[] = [
  {
    slug: 'drinkware',
    name_th: 'แก้วน้ำและกระบอกน้ำ',
    name_en: 'Drinkware',
    description_th: 'แก้วมัค ทัมเบลอร์ กระบอกน้ำสุญญากาศ แก้วชงชา และแก้วอุ่นร้อน',
    families: ['drinkware'],
    sort: 1,
    public: true
  },
  {
    slug: 'tech-gadgets',
    name_th: 'เทคโนโลยีและแกดเจ็ต',
    name_en: 'Tech & Gadgets',
    description_th: 'พาวเวอร์แบงก์ ที่ชาร์จ แฟลชไดรฟ์ ลำโพง หูฟัง เมาส์ คีย์บอร์ด และอุปกรณ์อัจฉริยะ',
    families: [
      'power_bank',
      'charger',
      'usb_flash_drive',
      'speaker',
      'earbuds',
      'earphone',
      'headset',
      'mouse',
      'keyboard',
      'smart_bracelet',
      'car_accessory'
    ],
    sort: 2,
    public: true
  },
  {
    slug: 'stationery-office',
    name_th: 'เครื่องเขียนและอุปกรณ์สำนักงาน',
    name_en: 'Stationery & Office',
    description_th: 'สมุดโน้ต ปากกา ที่คั่นหนังสือ ที่ใส่นามบัตร พวงกุญแจ และแผ่นรองโต๊ะ',
    families: ['notebook', 'notebook_refill', 'pen', 'bookmark', 'name_card_holder', 'key_chain', 'lighter', 'desk_mat'],
    sort: 3,
    public: true
  },
  {
    slug: 'bags-travel',
    name_th: 'กระเป๋าและการเดินทาง',
    name_en: 'Bags & Travel',
    description_th: 'กระเป๋าผ้า เป้ กระเป๋าเอกสาร และร่ม',
    families: ['bag', 'briefcase', 'umbrella'],
    sort: 4,
    public: true
  },
  {
    slug: 'wellness-personal-care',
    name_th: 'สุขภาพและการดูแลตัวเอง',
    name_en: 'Wellness & Personal Care',
    description_th: 'เครื่องนวด พัดลมพกพา ไดร์เป่าผม เครื่องทำความชื้น เครื่องกระจายกลิ่น และของใช้ส่วนตัว',
    families: [
      'neck_massager',
      'massage_gun',
      'massage_comb',
      'fan',
      'hair_dryer',
      'humidifier',
      'aroma_diffuser',
      'nail_clipper',
      'towel',
      'glove'
    ],
    sort: 5,
    public: true
  },
  {
    slug: 'home-living',
    name_th: 'บ้านและไลฟ์สไตล์',
    name_en: 'Home & Living',
    description_th: 'เครื่องชงกาแฟ ชุดช้อนส้อมพกพา และของใช้ในบ้าน',
    families: ['coffee_maker', 'cutlery'],
    sort: 6,
    public: true
  },
  {
    slug: 'gift-sets',
    name_th: 'ชุดของขวัญ',
    name_en: 'Gift Sets',
    description_th: 'ชุดจัดรวมหลายชิ้นในกล่องเดียว ค้นหาตามชิ้นที่อยู่ในชุดได้ (เช่น ชุดที่มีแก้วน้ำ + ร่ม)',
    families: [],
    sort: 7,
    public: true
  },
  {
    slug: 'unclassified',
    name_th: 'ยังไม่จัดหมวด',
    name_en: 'Unclassified',
    description_th: 'รายการที่ยังไม่ผ่านการจัดหมวดโดยคน — ไม่แสดงในมุมมองลูกค้า',
    families: [],
    sort: 99,
    public: false
  }
]

export const PRODUCT_FAMILIES: ProductFamily[] = [
  // drinkware
  { slug: 'drinkware', name_th: 'แก้วน้ำ', name_en: 'Drinkware', standard_category: 'drinkware', source_group: 'home_travel', aliases_th: ['แก้วมัค', 'ทัมเบลอร์', 'กระบอกน้ำ', 'แก้วเก็บอุณหภูมิ', 'แก้วชงชา', 'แก้ว', 'แก้วกาแฟ', 'ขวดน้ำ', 'กระติก', 'กระติกน้ำ'], aliases_en: ['mug', 'cup', 'bottle', 'tumbler', 'flask', 'infuser'] },
  // tech-gadgets
  { slug: 'power_bank', name_th: 'พาวเวอร์แบงก์', name_en: 'Power bank', standard_category: 'tech-gadgets', source_group: 'smart_tech', aliases_th: ['แบตสำรอง', 'พาวเวอร์แบงค์', 'แบตเตอรี่สำรอง'], aliases_en: ['power bank', 'powerbank'] },
  { slug: 'charger', name_th: 'ที่ชาร์จ', name_en: 'Charger', standard_category: 'tech-gadgets', source_group: 'smart_tech', aliases_th: ['แท่นชาร์จ', 'หัวชาร์จ', 'สายชาร์จ'], aliases_en: ['charger', 'charging'] },
  { slug: 'usb_flash_drive', name_th: 'แฟลชไดรฟ์', name_en: 'USB flash drive', standard_category: 'tech-gadgets', source_group: 'smart_tech', aliases_th: ['แฟลชไดร์ฟ', 'ยูเอสบี', 'แฟลชไดร์ฟ์'], aliases_en: ['flash drive', 'usb'] },
  { slug: 'speaker', name_th: 'ลำโพง', name_en: 'Speaker', standard_category: 'tech-gadgets', source_group: 'smart_tech', aliases_th: ['ลำโพงบลูทูธ'], aliases_en: ['speaker'] },
  { slug: 'earbuds', name_th: 'หูฟังไร้สาย', name_en: 'Earbuds', standard_category: 'tech-gadgets', source_group: 'smart_tech', aliases_th: ['เอียร์บัด'], aliases_en: ['earbuds', 'tws'] },
  { slug: 'earphone', name_th: 'หูฟัง', name_en: 'Earphone', standard_category: 'tech-gadgets', source_group: 'smart_tech', aliases_th: ['หูฟังมีสาย'], aliases_en: ['earphone'] },
  { slug: 'headset', name_th: 'เฮดเซ็ต', name_en: 'Headset', standard_category: 'tech-gadgets', source_group: 'smart_tech', aliases_th: ['หูฟังครอบหู', 'ครอบหู', 'แบบครอบหู', 'หูฟังในตัว'], aliases_en: ['headset', 'headphone'] },
  { slug: 'mouse', name_th: 'เมาส์', name_en: 'Mouse', standard_category: 'tech-gadgets', source_group: 'smart_tech', aliases_th: ['เม้าส์'], aliases_en: ['mouse'] },
  { slug: 'keyboard', name_th: 'คีย์บอร์ด', name_en: 'Keyboard', standard_category: 'tech-gadgets', source_group: 'smart_tech', aliases_th: ['แป้นพิมพ์'], aliases_en: ['keyboard'] },
  { slug: 'smart_bracelet', name_th: 'สายรัดข้อมืออัจฉริยะ', name_en: 'Smart bracelet', standard_category: 'tech-gadgets', source_group: 'smart_tech', aliases_th: ['กำไลอัจฉริยะ', 'สมาร์ทวอทช์'], aliases_en: ['smart bracelet', 'smart band'] },
  { slug: 'car_accessory', name_th: 'อุปกรณ์ในรถ', name_en: 'Car accessory', standard_category: 'tech-gadgets', source_group: 'smart_tech', aliases_th: ['ของใช้ในรถ'], aliases_en: ['car'] },
  // stationery-office
  { slug: 'notebook', name_th: 'สมุดโน้ต', name_en: 'Notebook', standard_category: 'stationery-office', source_group: 'office', aliases_th: ['สมุด', 'ไดอารี่', 'สมุดโน๊ต'], aliases_en: ['notebook', 'diary'] },
  { slug: 'notebook_refill', name_th: 'ไส้สมุด', name_en: 'Notebook refill', standard_category: 'stationery-office', source_group: 'office', aliases_th: ['ไส้ใน', 'แค่ไส้ใน', 'ไส้สมุดโน้ต'], aliases_en: ['refill'] },
  { slug: 'pen', name_th: 'ปากกา', name_en: 'Pen', standard_category: 'stationery-office', source_group: 'office', aliases_th: [], aliases_en: ['pen'] },
  { slug: 'bookmark', name_th: 'ที่คั่นหนังสือ', name_en: 'Bookmark', standard_category: 'stationery-office', source_group: 'office', aliases_th: [], aliases_en: ['bookmark'] },
  { slug: 'name_card_holder', name_th: 'ที่ใส่นามบัตร', name_en: 'Name card holder', standard_category: 'stationery-office', source_group: 'office', aliases_th: ['กล่องนามบัตร'], aliases_en: ['card holder'] },
  { slug: 'key_chain', name_th: 'พวงกุญแจ', name_en: 'Key chain', standard_category: 'stationery-office', source_group: 'office', aliases_th: [], aliases_en: ['keychain', 'key chain'] },
  { slug: 'lighter', name_th: 'ไฟแช็ก', name_en: 'Lighter', standard_category: 'stationery-office', source_group: 'office', aliases_th: ['ไฟแช็ค'], aliases_en: ['lighter'] },
  { slug: 'desk_mat', name_th: 'แผ่นรองโต๊ะ', name_en: 'Desk mat', standard_category: 'stationery-office', source_group: 'office', aliases_th: ['แผ่นรองเมาส์'], aliases_en: ['desk mat', 'desk pad'] },
  // bags-travel
  { slug: 'bag', name_th: 'กระเป๋า', name_en: 'Bag', standard_category: 'bags-travel', source_group: 'home_travel', aliases_th: ['กระเป๋าผ้า', 'เป้', 'ล้อลาก', 'มีล้อลาก', 'กระเป๋าล้อลาก'], aliases_en: ['bag', 'backpack', 'tote'] },
  { slug: 'briefcase', name_th: 'กระเป๋าเอกสาร', name_en: 'Briefcase', standard_category: 'bags-travel', source_group: 'office', aliases_th: [], aliases_en: ['briefcase'] },
  { slug: 'umbrella', name_th: 'ร่ม', name_en: 'Umbrella', standard_category: 'bags-travel', source_group: 'home_travel', aliases_th: ['ร่มพับ'], aliases_en: ['umbrella'] },
  // wellness-personal-care
  { slug: 'neck_massager', name_th: 'เครื่องนวดคอ', name_en: 'Neck massager', standard_category: 'wellness-personal-care', source_group: 'care_wellness', aliases_th: ['ที่นวดคอ'], aliases_en: ['neck massager'] },
  { slug: 'massage_gun', name_th: 'ปืนนวด', name_en: 'Massage gun', standard_category: 'wellness-personal-care', source_group: 'care_wellness', aliases_th: [], aliases_en: ['massage gun'] },
  { slug: 'massage_comb', name_th: 'หวีนวด', name_en: 'Massage comb', standard_category: 'wellness-personal-care', source_group: 'care_wellness', aliases_th: [], aliases_en: ['massage comb'] },
  { slug: 'fan', name_th: 'พัดลมพกพา', name_en: 'Fan', standard_category: 'wellness-personal-care', source_group: 'care_wellness', aliases_th: ['พัดลม'], aliases_en: ['fan'] },
  { slug: 'hair_dryer', name_th: 'ไดร์เป่าผม', name_en: 'Hair dryer', standard_category: 'wellness-personal-care', source_group: 'care_wellness', aliases_th: ['ไดร์'], aliases_en: ['hair dryer'] },
  { slug: 'humidifier', name_th: 'เครื่องทำความชื้น', name_en: 'Humidifier', standard_category: 'wellness-personal-care', source_group: 'care_wellness', aliases_th: ['เครื่องเพิ่มความชื้น'], aliases_en: ['humidifier'] },
  { slug: 'aroma_diffuser', name_th: 'เครื่องกระจายกลิ่น', name_en: 'Aroma diffuser', standard_category: 'wellness-personal-care', source_group: 'care_wellness', aliases_th: ['อโรมา'], aliases_en: ['aroma', 'diffuser'] },
  { slug: 'nail_clipper', name_th: 'กรรไกรตัดเล็บ', name_en: 'Nail clipper', standard_category: 'wellness-personal-care', source_group: 'care_wellness', aliases_th: ['ที่ตัดเล็บ'], aliases_en: ['nail clipper'] },
  { slug: 'towel', name_th: 'ผ้าเช็ดตัว', name_en: 'Towel', standard_category: 'wellness-personal-care', source_group: 'care_wellness', aliases_th: ['ผ้าขนหนู'], aliases_en: ['towel'] },
  { slug: 'glove', name_th: 'ถุงมือ', name_en: 'Glove', standard_category: 'wellness-personal-care', source_group: 'care_wellness', aliases_th: [], aliases_en: ['glove'] },
  // home-living
  { slug: 'coffee_maker', name_th: 'เครื่องชงกาแฟ', name_en: 'Coffee maker', standard_category: 'home-living', source_group: 'home_travel', aliases_th: ['ดริปกาแฟ', 'ชุดดริปกาแฟ', 'ที่ดริปกาแฟ'], aliases_en: ['coffee maker', 'pour-over'] },
  { slug: 'cutlery', name_th: 'ชุดช้อนส้อมพกพา', name_en: 'Cutlery set', standard_category: 'home-living', source_group: 'home_travel', aliases_th: ['ช้อนส้อม'], aliases_en: ['cutlery'] }
]

/**
 * The 16 canonical ProductMasters carry a `PF-*` family code. Map each PM to its
 * Level-2 family here; the Level-1 category is then derived from the family.
 * Keep this table equal to srp_reference_products in pricelist_master.json.
 */
export const PM_FAMILY: Record<string, ProductFamilySlug> = {
  'PM-TMB': 'drinkware',
  'PM-BOTTLE-LED': 'drinkware',
  'PM-CFMUG': 'drinkware',
  'PM-MUG-HEAT': 'drinkware',
  'PM-TEA-INF': 'drinkware',
  'PM-PB10K': 'power_bank',
  'PM-FLASH': 'usb_flash_drive',
  'PM-SPK': 'speaker',
  'PM-NB': 'notebook',
  'PM-PEN': 'pen',
  'PM-DESK-MAT': 'desk_mat',
  'PM-UMB': 'umbrella',
  'PM-FAN': 'fan',
  'PM-MSG': 'neck_massager',
  'PM-AROMA': 'aroma_diffuser',
  'PM-CUTLERY': 'cutlery'
}

export const OCCASIONS: Occasion[] = [
  { slug: 'new-year', name_th: 'ปีใหม่', name_en: 'New Year', archetype: 'seasonal', typical_recipients: ['CUSTOMER_MEMBER', 'TEAM', 'PARTNER_DEALER', 'LEADERSHIP'] },
  { slug: 'christmas', name_th: 'คริสต์มาส', name_en: 'Christmas', archetype: 'seasonal', typical_recipients: ['CUSTOMER_MEMBER', 'TEAM', 'PARTNER_DEALER', 'LEADERSHIP'] },
  { slug: 'songkran', name_th: 'สงกรานต์', name_en: 'Songkran', archetype: 'seasonal', typical_recipients: ['CUSTOMER_MEMBER', 'TEAM', 'PARTNER_DEALER', 'LEADERSHIP'] },
  { slug: 'new-employee-welcome', name_th: 'ต้อนรับพนักงานใหม่', name_en: 'New employee welcome', archetype: 'employee', typical_recipients: ['TEAM'] },
  { slug: 'recognition', name_th: 'ยกย่องและขอบคุณพนักงาน', name_en: 'Recognition & service anniversary', archetype: 'employee', typical_recipients: ['TEAM', 'LEADERSHIP'] },
  { slug: 'member-appreciation', name_th: 'ขอบคุณลูกค้าและสมาชิก', name_en: 'Customer & member appreciation', archetype: 'customer-member', typical_recipients: ['CUSTOMER_MEMBER', 'PARTNER_DEALER'] },
  { slug: 'launch-event', name_th: 'งานเปิดตัวและอีเวนต์', name_en: 'Launch / event with media', archetype: 'launch-event', typical_recipients: ['MEDIA_CREATOR', 'GUEST_PUBLIC', 'CUSTOMER_MEMBER', 'PARTNER_DEALER'] },
  { slug: 'csr-community', name_th: 'CSR และชุมชน', name_en: 'CSR & community', archetype: 'customer-member', typical_recipients: ['COMMUNITY', 'GUEST_PUBLIC', 'PARTNER_DEALER'] }
]

export const RECIPIENT_RELATIONSHIPS: RecipientRelationship[] = [
  { code: 'LEADERSHIP', name_en: 'Leadership', name_th: 'ผู้บริหาร', examples_th: 'ผู้บริหาร กรรมการ ผู้ถือหุ้น', typical_tiers: ['Signature', 'Bespoke'] },
  { code: 'TEAM', name_en: 'Team', name_th: 'ทีมงาน', examples_th: 'พนักงาน ผู้จัดการ พนักงานอายุงานสูง', typical_tiers: ['Reach', 'Select'] },
  { code: 'CUSTOMER_MEMBER', name_en: 'Customer & Member', name_th: 'ลูกค้าและสมาชิก', examples_th: 'Customer, Member, VIP Member', typical_tiers: ['Reach', 'Select', 'Signature', 'Bespoke'] },
  { code: 'PARTNER_DEALER', name_en: 'Partner & Dealer', name_th: 'คู่ค้าและตัวแทน', examples_th: 'คู่ค้า ตัวแทนจำหน่าย Sponsor', typical_tiers: ['Select', 'Signature'] },
  { code: 'MEDIA_CREATOR', name_en: 'Media & Creator', name_th: 'สื่อและครีเอเตอร์', examples_th: 'สื่อมวลชน KOL Influencer', typical_tiers: ['Select', 'Signature'] },
  { code: 'GUEST_PUBLIC', name_en: 'Guest & Public', name_th: 'แขกและบุคคลทั่วไป', examples_th: 'Event Guest, Booth Visitor', typical_tiers: ['Reach'] },
  { code: 'COMMUNITY', name_en: 'Community', name_th: 'ชุมชน', examples_th: 'ผู้เข้าร่วม CSR หน่วยงานท้องถิ่น', typical_tiers: ['Reach'] }
]

export function recipientRelationship(code: string): RecipientRelationship | undefined {
  return RECIPIENT_RELATIONSHIPS.find(r => r.code === code)
}

export function occasion(slug: string): Occasion | undefined {
  return OCCASIONS.find(o => o.slug === slug)
}

export function giftTier(code: string): GiftTierDef | undefined {
  return GIFT_TIERS.find(t => t.code.toLowerCase() === code.toLowerCase())
}

export const CATALOG_LENSES: { id: CatalogLens; label_th: string; label_en: string; axes: string[] }[] = [
  { id: 'recipient', label_th: 'เริ่มจากผู้รับ', label_en: 'Recipient-first', axes: ['occasion', 'tier', 'theme'] },
  { id: 'standard', label_th: 'หมวดหมู่สินค้า', label_en: 'By product type', axes: ['category', 'family'] }
]

/** Quantity presets for the B2B calculator; 10 is the public MOQ story ("เริ่มต้นสั่งได้ตั้งแต่ 10 ชุด"). */
export const QTY_PRESETS = [10, 50, 100, 300, 500, 1000] as const

// ---------------------------------------------------------------------------
// Derivation helpers
// ---------------------------------------------------------------------------

const FAMILY_BY_SLUG: Record<string, ProductFamily> = Object.fromEntries(PRODUCT_FAMILIES.map(f => [f.slug, f]))
const CATEGORY_BY_SLUG: Record<string, StandardCategory> = Object.fromEntries(STANDARD_CATEGORIES.map(c => [c.slug, c]))

export function productFamily(slug: string): ProductFamily | undefined {
  return FAMILY_BY_SLUG[slug]
}

export function standardCategory(slug: string): StandardCategory | undefined {
  return CATEGORY_BY_SLUG[slug]
}

export function familiesIn(category: StandardCategorySlug): ProductFamily[] {
  return PRODUCT_FAMILIES.filter(f => f.standard_category === category)
}

/**
 * Level-1 category of an item, derived — never stored by hand.
 *  - sets and bundles → `gift-sets` (their families become the "contains" facet)
 *  - singles → the category of their family; unknown family → `unclassified`
 */
export function standardCategoryOf(kind: OfferKind, families: ProductFamilySlug[]): StandardCategorySlug {
  if (kind !== 'single') return 'gift-sets'
  const first = families[0]
  return first && FAMILY_BY_SLUG[first] ? FAMILY_BY_SLUG[first].standard_category : 'unclassified'
}

/** Public catalog shows an item only when it has a public category AND either a verified image or a price ladder. */
export function isPublicItem(item: Pick<CatalogItem, 'standard_category' | 'image_status' | 'price_status'>): boolean {
  const cat = CATEGORY_BY_SLUG[item.standard_category]
  if (!cat || !cat.public) return false
  return item.image_status !== 'missing' || item.price_status === 'tiered'
}

/** Best (largest-quantity) tier price; `undefined` when the item is ask-for-quote. Never returns 0. */
export function bestTierPrice(item: Pick<CatalogItem, 'price_status' | 'price_tiers'>): number | undefined {
  if (item.price_status !== 'tiered' || !item.price_tiers?.length) return undefined
  const best = item.price_tiers.reduce((a, b) => (b.min_qty > a.min_qty ? b : a))
  return best.unit_price > 0 ? best.unit_price : undefined
}

/** Unit price for a quantity on the item's ladder; `undefined` when ask-for-quote or below the first tier. */
export function unitPriceAt(item: Pick<CatalogItem, 'price_status' | 'price_tiers'>, qty: number): number | undefined {
  if (item.price_status !== 'tiered' || !item.price_tiers?.length) return undefined
  const eligible = item.price_tiers.filter(t => qty >= t.min_qty)
  if (!eligible.length) return undefined
  return eligible.reduce((a, b) => (b.min_qty > a.min_qty ? b : a)).unit_price
}

// ---------------------------------------------------------------------------
// Hash routes  (#catalog/<axis>/<value>[/<sub>][?view=grid|list|index&...])
// ---------------------------------------------------------------------------

export interface CatalogRoute {
  lens: CatalogLens
  axis?: 'category' | 'theme' | 'tier' | 'occasion' | 'kind' | 'item' | 'bundle'
  value?: string
  /** Level-2 family under a category. */
  family?: string
  view?: CatalogView
  filters?: Record<string, string>
}

export function buildCatalogHash(route: CatalogRoute): string {
  const parts = ['#catalog']
  if (route.axis && route.value) {
    parts.push(route.axis, route.value)
    if (route.family) parts.push(route.family)
  } else if (route.axis === 'bundle') {
    parts.push('bundle')
  } else if (route.lens === 'standard') {
    parts.push('category')
  }
  const query = new URLSearchParams(route.filters ?? {})
  if (route.view && route.view !== 'grid') query.set('view', route.view)
  const qs = query.toString()
  return parts.join('/') + (qs ? `?${qs}` : '')
}

export function parseCatalogHash(hash: string): CatalogRoute | null {
  const [pathPart, queryPart] = hash.replace(/^#/, '').split('?')
  const segments = pathPart.split('/').filter(Boolean)
  if (segments[0] !== 'catalog' && segments[0] !== 'bline') return null
  const filters: Record<string, string> = {}
  let view: CatalogView | undefined
  new URLSearchParams(queryPart ?? '').forEach((v, k) => {
    if (k === 'view' && (v === 'grid' || v === 'list' || v === 'index')) view = v
    else filters[k] = v
  })
  const axis = segments[1] as CatalogRoute['axis'] | undefined
  const standardAxes = new Set(['category'])
  const lens: CatalogLens = axis && standardAxes.has(axis) ? 'standard' : 'recipient'
  return {
    lens,
    axis,
    value: segments[2],
    family: axis === 'category' ? segments[3] : undefined,
    view,
    filters: Object.keys(filters).length ? filters : undefined
  }
}
