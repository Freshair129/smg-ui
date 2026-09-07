export interface PriceTier {
  min_qty: number
  unit_price: number
}

export interface SmartGiftProduct {
  code: string
  name_th: string
  name_en: string
  category_slug: 'eco-friendly' | 'classic-oriental' | 'novelty-self-care' | 'executive-smart-tech'
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
  slug: 'eco-friendly' | 'classic-oriental' | 'novelty-self-care' | 'executive-smart-tech'
  name_th: string
  name_en: string
  vibe: string
  target_recipient: string
  icon: string
}

export const SMARTGIFT_CATEGORIES: CatalogCategory[] = [
  {
    slug: 'eco-friendly',
    name_th: 'ชุดผลิตภัณฑ์รักษ์โลก (Eco-Friendly)',
    name_en: 'Eco-Friendly & Sustainability',
    vibe: 'ยั่งยืน รักษ์โลก วัสดุธรรมชาติ เป็นมิตรต่อสิ่งแวดล้อม',
    target_recipient: 'องค์กรสาย ESG, แคมเปญเพื่อสังคมและสิ่งแวดล้อม',
    icon: '🌿'
  },
  {
    slug: 'classic-oriental',
    name_th: 'ชุดศิลปะร่วมสมัยและตะวันออก (Classic Oriental)',
    name_en: 'Classic Oriental & Mindfulness',
    vibe: 'ประณีต ทรงคุณค่า คลาสสิก สิริมงคล',
    target_recipient: 'ผู้ใหญ่, แขก VIP ต่างชาติ, พิธีการทางการ',
    icon: '🏮'
  },
  {
    slug: 'novelty-self-care',
    name_th: 'ชุด Novelty & Self-Care',
    name_en: 'Novelty & Self-Care',
    vibe: 'ผ่อนคลาย อบอุ่น ใส่ใจสุขภาพ สุขกายสบายใจ',
    target_recipient: 'กลุ่มผู้หญิง, พนักงานสาย Wellness, ของขวัญปีใหม่',
    icon: '🕯️'
  },
  {
    slug: 'executive-smart-tech',
    name_th: 'ชุดนวัตกรรมอัจฉริยะ (Executive Smart Tech)',
    name_en: 'Executive Smart Tech',
    vibe: 'ทันสมัย นวัตกรรม เป็นมืออาชีพ ตอบโจทย์คนทำงานยุคใหม่',
    target_recipient: 'ผู้บริหาร, ทีมงาน Tech, ลูกค้า Corporate ระดับพรีเมียม',
    icon: '⚡'
  }
]

export const SMARTGIFT_PRODUCTS: SmartGiftProduct[] = [
  {
    code: 'PM-BOTTLE-LED',
    name_th: 'กระบอกน้ำสุญญากาศอัจฉริยะจอแสดงอุณหภูมิ LED 500ml',
    name_en: 'Smart LED Temperature Vacuum Bottle',
    category_slug: 'eco-friendly',
    category_name: 'Eco-Friendly & Sustainability',
    srp_price: 290,
    price_tiers: [
      { min_qty: 1, unit_price: 290 },
      { min_qty: 10, unit_price: 260 },
      { min_qty: 50, unit_price: 230 },
      { min_qty: 100, unit_price: 205 },
      { min_qty: 300, unit_price: 185 },
      { min_qty: 500, unit_price: 170 },
      { min_qty: 1000, unit_price: 158 }
    ],
    dimensions_cm: { length: 6.5, width: 6.5, height: 23 },
    unit_weight_kg: 0.32,
    model3d_url: '/assets/smartgift/3d/PM-BOTTLE-LED.glb',
    plate_image: '/assets/smartgift/plates/ob_bottle_plate.png',
    mockup_image: '/assets/smartgift/mockups/ob_bottle.jpg',
    client_showcase: [
      { brand: 'One Bangkok', image: '/assets/smartgift/mockups/ob_bottle.jpg' },
      { brand: 'Starbucks', image: '/assets/smartgift/mockups/sbux_bottle.jpg' }
    ],
    lead_time_days: 7,
    description_th: 'กระบอกน้ำสแตนเลส 304 ฝาสัมผัสแตะดูอุณหภูมิแบบเรียลไทม์ เก็บร้อน-เย็นได้ยาวนาน 18-24 ชั่วโมง'
  },
  {
    code: 'PM-CFMUG',
    name_th: 'แก้วกาแฟพกพาสแตนเลสสองชั้นพร้อมฝาล็อค 380ml',
    name_en: 'Double Wall Stainless Coffee Mug with Leak-Proof Lid',
    category_slug: 'novelty-self-care',
    category_name: 'Novelty & Self-Care',
    srp_price: 240,
    price_tiers: [
      { min_qty: 1, unit_price: 240 },
      { min_qty: 10, unit_price: 215 },
      { min_qty: 50, unit_price: 190 },
      { min_qty: 100, unit_price: 170 },
      { min_qty: 300, unit_price: 155 },
      { min_qty: 500, unit_price: 142 },
      { min_qty: 1000, unit_price: 132 }
    ],
    dimensions_cm: { length: 8.8, width: 8.8, height: 14.5 },
    unit_weight_kg: 0.26,
    model3d_url: '/assets/smartgift/3d/PM-CFMUG.glb',
    plate_image: '/assets/smartgift/plates/gmmtv_mug_plate.png',
    mockup_image: '/assets/smartgift/mockups/gmmtv_mug.jpg',
    client_showcase: [
      { brand: 'GMMTV', image: '/assets/smartgift/mockups/gmmtv_mug.jpg' },
      { brand: 'Starbucks', image: '/assets/smartgift/mockups/sbux_mug.jpg' }
    ],
    lead_time_days: 5,
    description_th: 'แก้วกาแฟสแตนเลสสองชั้นกันลวกมือ ผิวสัมผัสเนื้อแมตต์พรีเมียม สกรีนหรือยิงเลเซอร์โลโก้ได้อย่างคมชัด'
  },
  {
    code: 'PM-FLASH',
    name_th: 'แฟลชไดร์ฟโลหะลายหยูอี้สิริมงคล Type-C & USB 3.0',
    name_en: 'Ruyi Auspicious Dual Flash Drive Type-C / USB 3.0',
    category_slug: 'classic-oriental',
    category_name: 'Classic Oriental & Mindfulness',
    srp_price: 350,
    price_tiers: [
      { min_qty: 1, unit_price: 350 },
      { min_qty: 10, unit_price: 310 },
      { min_qty: 50, unit_price: 275 },
      { min_qty: 100, unit_price: 245 },
      { min_qty: 300, unit_price: 220 },
      { min_qty: 500, unit_price: 200 },
      { min_qty: 1000, unit_price: 185 }
    ],
    dimensions_cm: { length: 6.2, width: 1.8, height: 0.9 },
    unit_weight_kg: 0.05,
    model3d_url: '/assets/smartgift/3d/PM-FLASH.glb',
    plate_image: '/assets/smartgift/plates/ob_card_plate.png',
    mockup_image: '/assets/smartgift/mockups/ob_card.jpg',
    lead_time_days: 5,
    description_th: 'แฟลชไดร์ฟโลหะหล่อลวดลายหยูอี้ความหมายมงคล รองรับทั้ง USB ปกติและพอร์ต Type-C ของสมาร์ตโฟน'
  },
  {
    code: 'PM-MSG',
    name_th: 'เครื่องนวดคอและไหล่พกพาประคบร้อนระบบกระตุ้น EMS',
    name_en: 'Smart EMS Neck & Shoulder Massager with Heat',
    category_slug: 'novelty-self-care',
    category_name: 'Novelty & Self-Care',
    srp_price: 790,
    price_tiers: [
      { min_qty: 1, unit_price: 790 },
      { min_qty: 10, unit_price: 710 },
      { min_qty: 50, unit_price: 630 },
      { min_qty: 100, unit_price: 565 },
      { min_qty: 300, unit_price: 515 },
      { min_qty: 500, unit_price: 475 },
      { min_qty: 1000, unit_price: 440 }
    ],
    dimensions_cm: { length: 15, width: 14.5, height: 4.5 },
    unit_weight_kg: 0.28,
    model3d_url: '/assets/smartgift/3d/PM-MSG.glb',
    plate_image: '/assets/smartgift/plates/backdrop_plate.png',
    mockup_image: '/assets/smartgift/mockups/truepride.jpg',
    lead_time_days: 10,
    description_th: 'อุปกรณ์ดูแลสุขภาพเพื่อชาวออฟฟิศ บรรเทาอาการ Office Syndrome ปรับโหมดนวดและความร้อนได้ 3 ระดับ'
  },
  {
    code: 'PM-MUG-HEAT',
    name_th: 'แก้วอุ่นร้อนไฟฟ้าอุณหภูมิคงที่ 55 องศาพร้อมจานชาร์จไร้สาย',
    name_en: '55°C Constant Heating Smart Mug with Wireless Pad',
    category_slug: 'novelty-self-care',
    category_name: 'Novelty & Self-Care',
    srp_price: 420,
    price_tiers: [
      { min_qty: 1, unit_price: 420 },
      { min_qty: 10, unit_price: 375 },
      { min_qty: 50, unit_price: 330 },
      { min_qty: 100, unit_price: 295 },
      { min_qty: 300, unit_price: 270 },
      { min_qty: 500, unit_price: 250 },
      { min_qty: 1000, unit_price: 232 }
    ],
    dimensions_cm: { length: 12, width: 12, height: 11 },
    unit_weight_kg: 0.65,
    model3d_url: '/assets/smartgift/3d/PM-MUG-HEAT.glb',
    plate_image: '/assets/smartgift/plates/ob_mug_plate.png',
    mockup_image: '/assets/smartgift/mockups/ob_mug.jpg',
    client_showcase: [
      { brand: 'One Bangkok', image: '/assets/smartgift/mockups/ob_mug.jpg' },
      { brand: 'GMMTV', image: '/assets/smartgift/mockups/gmmtv.jpg' }
    ],
    lead_time_days: 7,
    description_th: 'ชุดแก้วเซรามิกคุณภาพสูงพร้อมฐานอุ่นไฟอัจฉริยะ รักษาความอุ่นของเครื่องดื่มที่ 55°C ตลอดวันทำงาน'
  },
  {
    code: 'PM-NB',
    name_th: 'สมุดโน้ตหนังพรีเมียมพร้อม Powerbank 8000mAh และสายชาร์จ',
    name_en: 'Executive Smart Powerbank Notebook 8000mAh',
    category_slug: 'executive-smart-tech',
    category_name: 'Executive Smart Tech',
    srp_price: 650,
    price_tiers: [
      { min_qty: 1, unit_price: 650 },
      { min_qty: 10, unit_price: 585 },
      { min_qty: 50, unit_price: 510 },
      { min_qty: 100, unit_price: 450 },
      { min_qty: 300, unit_price: 410 },
      { min_qty: 500, unit_price: 378 },
      { min_qty: 1000, unit_price: 350 }
    ],
    dimensions_cm: { length: 24, width: 18, height: 3.5 },
    unit_weight_kg: 0.72,
    model3d_url: '/assets/smartgift/3d/PM-NB.glb',
    plate_image: '/assets/smartgift/plates/one31_nb_plate.png',
    mockup_image: '/assets/smartgift/mockups/one31_nb.jpg',
    client_showcase: [
      { brand: 'One31', image: '/assets/smartgift/mockups/one31_nb.jpg' },
      { brand: 'One Bangkok', image: '/assets/smartgift/mockups/ob_nb.jpg' }
    ],
    lead_time_days: 7,
    description_th: 'สมุดปกหนัง PU สไตล์หรู มาพร้อมพาวเวอร์แบงก์ในตัว 8,000mAh มีช่องเสียบการ์ด ปากกา และสายชาร์จ 3 หัว'
  },
  {
    code: 'PM-PB10K',
    name_th: 'พาวเวอร์แบงค์แม่เหล็กไร้สาย 10000mAh จอดิจิทัลชาร์จไว 22.5W',
    name_en: '10000mAh Magnetic Wireless Fast Charge Power Bank',
    category_slug: 'executive-smart-tech',
    category_name: 'Executive Smart Tech',
    srp_price: 690,
    price_tiers: [
      { min_qty: 1, unit_price: 690 },
      { min_qty: 10, unit_price: 620 },
      { min_qty: 50, unit_price: 540 },
      { min_qty: 100, unit_price: 480 },
      { min_qty: 300, unit_price: 435 },
      { min_qty: 500, unit_price: 400 },
      { min_qty: 1000, unit_price: 370 }
    ],
    dimensions_cm: { length: 10.5, width: 6.8, height: 1.8 },
    unit_weight_kg: 0.22,
    model3d_url: '/assets/smartgift/3d/PM-PB10K.glb',
    plate_image: '/assets/smartgift/plates/gmmtv_pb_plate.png',
    mockup_image: '/assets/smartgift/mockups/gmmtv_pb.jpg',
    client_showcase: [
      { brand: 'GMMTV', image: '/assets/smartgift/mockups/gmmtv_pb.jpg' },
      { brand: 'One31', image: '/assets/smartgift/mockups/one31_pb.jpg' }
    ],
    lead_time_days: 7,
    description_th: 'แบตสำรองรองรับระบบ Magnetic ชาร์จติดหนึบหลังมือถือ รองรับ Fast Charge 22.5W พร้อมหน้าจอดิจิทัลบอกเปอร์เซ็นต์'
  },
  {
    code: 'PM-TMB',
    name_th: 'กระบอกน้ำสแตนเลสเก็บอุณหภูมิ 24 ชม. พร้อมหูหิ้ว 750ml',
    name_en: 'Insulated Stainless Steel Tumbler with Carry Handle 750ml',
    category_slug: 'eco-friendly',
    category_name: 'Eco-Friendly & Sustainability',
    srp_price: 320,
    price_tiers: [
      { min_qty: 1, unit_price: 320 },
      { min_qty: 10, unit_price: 285 },
      { min_qty: 50, unit_price: 250 },
      { min_qty: 100, unit_price: 225 },
      { min_qty: 300, unit_price: 205 },
      { min_qty: 500, unit_price: 190 },
      { min_qty: 1000, unit_price: 176 }
    ],
    dimensions_cm: { length: 8.5, width: 8.5, height: 26 },
    unit_weight_kg: 0.38,
    model3d_url: '/assets/smartgift/3d/PM-TMB.glb',
    plate_image: '/assets/smartgift/plates/sbux_tmb_plate.png',
    mockup_image: '/assets/smartgift/mockups/sbux_tmb.jpg',
    client_showcase: [
      { brand: 'Starbucks', image: '/assets/smartgift/mockups/sbux_tmb.jpg' },
      { brand: 'GMMTV', image: '/assets/smartgift/mockups/gmmtv_tmb.jpg' },
      { brand: 'One31', image: '/assets/smartgift/mockups/one31_tmb.jpg' }
    ],
    lead_time_days: 6,
    description_th: 'กระบอกน้ำสุญญากาศ Tumbler หูหิ้วพกพาสะดวก เคลือบสี Powder Coating ป้องกันรอยขีดข่วน ไม่ลื่นหลุดมือ'
  },
  {
    code: 'PM-UMB',
    name_th: 'ร่มพับอัตโนมัติ 10 ก้านกันลมเคลือบไวนิลป้องกัน UV 99%',
    name_en: 'Automatic 10-Rib Windproof Umbrella UV 99%',
    category_slug: 'eco-friendly',
    category_name: 'Eco-Friendly & Sustainability',
    srp_price: 280,
    price_tiers: [
      { min_qty: 1, unit_price: 280 },
      { min_qty: 10, unit_price: 250 },
      { min_qty: 50, unit_price: 220 },
      { min_qty: 100, unit_price: 195 },
      { min_qty: 300, unit_price: 178 },
      { min_qty: 500, unit_price: 165 },
      { min_qty: 1000, unit_price: 152 }
    ],
    dimensions_cm: { length: 33, width: 6, height: 6 },
    unit_weight_kg: 0.44,
    model3d_url: '/assets/smartgift/3d/PM-UMB.glb',
    plate_image: '/assets/smartgift/plates/obt_black_plate.png',
    mockup_image: '/assets/smartgift/mockups/obt_black.jpg',
    client_showcase: [
      { brand: 'One Bangkok', image: '/assets/smartgift/mockups/obt_black.jpg' },
      { brand: 'One Bangkok Hook', image: '/assets/smartgift/mockups/obt_hook.jpg' }
    ],
    lead_time_days: 6,
    description_th: 'ร่มพับปุ่มกดกาง-หุบอัตโนมัติ โครงสร้างคาร์บอนไฟเบอร์ 10 ก้านต้านลมแรง ผ้าเคลือบกันยูวีสีดำทึบแสง 100%'
  },
  {
    code: 'PM-AROMA',
    name_th: 'เครื่องกระจายกลิ่นอโรมาอัลตราโซนิกเปลวไฟแสงไฟ Ambient',
    name_en: 'Ultrasonic Flame Aroma Diffuser',
    category_slug: 'novelty-self-care',
    category_name: 'Novelty & Self-Care',
    srp_price: 550,
    price_tiers: [
      { min_qty: 1, unit_price: 550 },
      { min_qty: 10, unit_price: 490 },
      { min_qty: 50, unit_price: 420 },
      { min_qty: 100, unit_price: 380 },
      { min_qty: 300, unit_price: 350 },
      { min_qty: 500, unit_price: 320 },
      { min_qty: 1000, unit_price: 295 }
    ],
    dimensions_cm: { length: 17.5, width: 10.5, height: 8 },
    unit_weight_kg: 0.48,
    plate_image: '/assets/smartgift/plates/backdrop_plate.png',
    mockup_image: '/assets/smartgift/mockups/truepride.jpg',
    lead_time_days: 7,
    description_th: 'เครื่องสร้างละอองกลิ่นหอมผ่อนคลาย มาพร้อมระบบไฟ LED จำลองเปลวไฟสร้างบรรยากาศอบอุ่นบนโต๊ะทำงาน'
  },
  {
    code: 'PM-CUTLERY',
    name_th: 'ชุดช้อนส้อมมีดสแตนเลสสตีลฟู้ดเกรดพร้อมกล่องฟางข้าวพกพา',
    name_en: 'Eco-Wheat Straw Portable Cutlery Set',
    category_slug: 'novelty-self-care',
    category_name: 'Novelty & Self-Care',
    srp_price: 120,
    price_tiers: [
      { min_qty: 1, unit_price: 120 },
      { min_qty: 10, unit_price: 105 },
      { min_qty: 50, unit_price: 90 },
      { min_qty: 100, unit_price: 80 },
      { min_qty: 300, unit_price: 72 },
      { min_qty: 500, unit_price: 66 },
      { min_qty: 1000, unit_price: 60 }
    ],
    dimensions_cm: { length: 21, width: 5.5, height: 2.8 },
    unit_weight_kg: 0.15,
    plate_image: '/assets/smartgift/plates/cpli_plate.png',
    mockup_image: '/assets/smartgift/mockups/cpli.jpg',
    lead_time_days: 4,
    description_th: 'ชุดช้อนส้อมพกพาเพื่อสุขอนามัย ผลิตจากสแตนเลสสตีลมาตรฐานฟู้ดเกรด บรรจุในกล่องวัสดุฟางข้าวสาลีธรรมชาติ'
  },
  {
    code: 'PM-DESK-MAT',
    name_th: 'แผ่นรองโต๊ะทำงานหนัง Vegan Leather พร้อมที่ชาร์จไว',
    name_en: 'Wireless Charging Vegan Desk Mat',
    category_slug: 'executive-smart-tech',
    category_name: 'Executive Smart Tech',
    srp_price: 590,
    price_tiers: [
      { min_qty: 1, unit_price: 590 },
      { min_qty: 10, unit_price: 530 },
      { min_qty: 50, unit_price: 450 },
      { min_qty: 100, unit_price: 410 },
      { min_qty: 300, unit_price: 375 },
      { min_qty: 500, unit_price: 345 },
      { min_qty: 1000, unit_price: 320 }
    ],
    dimensions_cm: { length: 80, width: 40, height: 0.4 },
    unit_weight_kg: 0.55,
    plate_image: '/assets/smartgift/plates/udtrucks_plate.png',
    mockup_image: '/assets/smartgift/mockups/udtrucks.jpg',
    lead_time_days: 7,
    description_th: 'แผ่นรองโต๊ะสไตล์ Minimalist กว้าง 80x40 ซม. มีแท่นชาร์จสมาร์ตโฟนไร้สาย Fast Charge ฝังในตัวแผ่นรอง'
  },
  {
    code: 'PM-FAN',
    name_th: 'พัดลมพกพาดีไซน์มินิมอลหน้าจอดิจิทัลแบต 4000mAh',
    name_en: 'Digital Display Mini Handheld Fan',
    category_slug: 'eco-friendly',
    category_name: 'Eco-Friendly & Sustainability',
    srp_price: 260,
    price_tiers: [
      { min_qty: 1, unit_price: 260 },
      { min_qty: 10, unit_price: 230 },
      { min_qty: 50, unit_price: 195 },
      { min_qty: 100, unit_price: 175 },
      { min_qty: 300, unit_price: 160 },
      { min_qty: 500, unit_price: 148 },
      { min_qty: 1000, unit_price: 138 }
    ],
    dimensions_cm: { length: 19.5, width: 9, height: 4.5 },
    unit_weight_kg: 0.21,
    plate_image: '/assets/smartgift/plates/icon_stick_plate.png',
    mockup_image: '/assets/smartgift/mockups/icon_stick.jpg',
    lead_time_days: 5,
    description_th: 'พัดลมพกพาลมแรงเงียบ หน้าจอ LED แสดงระดับแรงลมและแบตเตอรี่คงเหลือ ชาร์จครั้งเดียวใช้งานได้นานถึง 12 ชั่วโมง'
  },
  {
    code: 'PM-PEN',
    name_th: 'ปากกาโรลเลอร์บอลไม้โรสวูดแท้หัวทองเหลืองกล่องไม้พรีเมียม',
    name_en: 'Handcrafted Rosewood & Brass Rollerball Pen',
    category_slug: 'classic-oriental',
    category_name: 'Classic Oriental & Mindfulness',
    srp_price: 390,
    price_tiers: [
      { min_qty: 1, unit_price: 390 },
      { min_qty: 10, unit_price: 350 },
      { min_qty: 50, unit_price: 300 },
      { min_qty: 100, unit_price: 270 },
      { min_qty: 300, unit_price: 245 },
      { min_qty: 500, unit_price: 228 },
      { min_qty: 1000, unit_price: 212 }
    ],
    dimensions_cm: { length: 14.5, width: 1.4, height: 1.4 },
    unit_weight_kg: 0.08,
    plate_image: '/assets/smartgift/plates/ob_card_plate.png',
    mockup_image: '/assets/smartgift/mockups/ob_card.jpg',
    lead_time_days: 5,
    description_th: 'ปากกาสลักชื่อด้ามไม้แท้สัมผัสนุ่มนวลธรรมชาติ เสริมภาพลักษณ์ผู้บริหาร พร้อมกล่องไม้ลายสลักสวยหรู'
  },
  {
    code: 'PM-SPK',
    name_th: 'ลำโพงบลูทูธพลังเสียงสเตอริโอผิวสัมผัสผ้าดีไซน์นอร์ดิก',
    name_en: 'Nordic Fabric Portable Bluetooth Speaker',
    category_slug: 'executive-smart-tech',
    category_name: 'Executive Smart Tech',
    srp_price: 480,
    price_tiers: [
      { min_qty: 1, unit_price: 480 },
      { min_qty: 10, unit_price: 430 },
      { min_qty: 50, unit_price: 375 },
      { min_qty: 100, unit_price: 335 },
      { min_qty: 300, unit_price: 305 },
      { min_qty: 500, unit_price: 280 },
      { min_qty: 1000, unit_price: 260 }
    ],
    dimensions_cm: { length: 12, width: 8.5, height: 5 },
    unit_weight_kg: 0.32,
    plate_image: '/assets/smartgift/plates/one31_pb_plate.png',
    mockup_image: '/assets/smartgift/mockups/one31_pb.jpg',
    lead_time_days: 6,
    description_th: 'ลำโพงไร้สาย Bluetooth 5.3 พกพาสะดวก ผิวผ้าลินินผสมผสานดีไซน์มินิมอล ให้มิติเสียงเบสแน่นคมชัด'
  },
  {
    code: 'PM-TEA-INF',
    name_th: 'กระบอกน้ำแก้ว Borosilicate สองชั้นพร้อมที่กรองใบชาสแตนเลส',
    name_en: 'Double Wall Borosilicate Tea Infuser',
    category_slug: 'classic-oriental',
    category_name: 'Classic Oriental & Mindfulness',
    srp_price: 360,
    price_tiers: [
      { min_qty: 1, unit_price: 360 },
      { min_qty: 10, unit_price: 320 },
      { min_qty: 50, unit_price: 280 },
      { min_qty: 100, unit_price: 255 },
      { min_qty: 300, unit_price: 235 },
      { min_qty: 500, unit_price: 220 },
      { min_qty: 1000, unit_price: 205 }
    ],
    dimensions_cm: { length: 7.5, width: 7.5, height: 20 },
    unit_weight_kg: 0.45,
    plate_image: '/assets/smartgift/plates/sbux_bottle_plate.png',
    mockup_image: '/assets/smartgift/mockups/sbux_bottle.jpg',
    lead_time_days: 6,
    description_th: 'แก้วชงชาแยกกากสองชั้น ทนความร้อนสูง -20°C ถึง 150°C ไม่ร้อนมือ ฝาปิดไม้ไผ่ธรรมชาติพร้อมซีลซิลิโคนกันรั่ว'
  }
]
