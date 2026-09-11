import type { ImageStatus } from './catalogTaxonomy'

/**
 * Hand-curated media and copy for the 16 core ProductMasters. Facts (names, prices,
 * dimensions) come from the generated SSOT layer; this file only adds what the SSOT
 * does not carry: images, 3D twins, client mockups, lead time and marketing copy.
 *
 * Image rules (PRODUCT.md): a plate is used only when it shows the same product type
 * as the PM. Plates that showed a different product (tote bag for the umbrella,
 * card holder for the flash drive, backdrop for the massager …) were dropped — the
 * card renders a placeholder instead of a look-alike. All plates are AI-generated
 * product renders, hence `generated_from_source`; none is a verified source photo.
 *
 * `client_showcase` images are concept mockups, not evidence of delivered work.
 * `description_th` and `lead_time_days` were carried over from the previous data
 * file and are NOT verified against supplier specs — the UI labels them as such.
 */
export interface CoreMedia {
  image?: string
  image_status?: ImageStatus
  model3d_url?: string
  model3d_status?: 'draft' | 'owner_approved'
  mockup_image?: string
  client_showcase?: { brand: string; image: string }[]
  description_th?: string
  lead_time_days?: number
}

export const CORE_MEDIA: Record<string, CoreMedia> = {
  'PM-BOTTLE-LED': {
    image: '/assets/smartgift/plates/ob_bottle_plate.png',
    image_status: 'generated_from_source',
    // Procedural model, built from dimensions_cm (7 x 7 x 23 cm) by scripts/build-procedural-3d.mjs:
    // shape exact, lid proportions and finish schematic. Replaces the TRELLIS draft, archived in .drafts/3d/ (mesh 1 : 0.73 : 0.62 vs product 1 : 0.30 : 0.30).
    model3d_url: '/assets/smartgift/3d/procedural/PM-BOTTLE-LED.glb',
    model3d_status: 'draft',
    mockup_image: '/assets/smartgift/mockups/ob_bottle.jpg',
    client_showcase: [
      { brand: 'One Bangkok', image: '/assets/smartgift/mockups/ob_bottle.jpg' },
      { brand: 'Starbucks', image: '/assets/smartgift/mockups/sbux_bottle.jpg' }
    ],
    description_th: 'กระบอกน้ำสแตนเลส 304 ฝาสัมผัสแตะดูอุณหภูมิแบบเรียลไทม์ เก็บร้อน-เย็นได้ยาวนาน 18-24 ชั่วโมง',
    lead_time_days: 7
  },
  'PM-CFMUG': {
    // Procedural model, built from dimensions_cm (9 x 9 x 14.5 cm) by scripts/build-procedural-3d.mjs:
    // shape exact, lid proportions and finish schematic. Replaces the TRELLIS draft, archived in .drafts/3d/ (mesh 1 : 0.79 : 0.63, cross-section not round).
    model3d_url: '/assets/smartgift/3d/procedural/PM-CFMUG.glb',
    model3d_status: 'draft',
    mockup_image: '/assets/smartgift/mockups/gmmtv_mug.jpg',
    client_showcase: [
      { brand: 'GMMTV', image: '/assets/smartgift/mockups/gmmtv_mug.jpg' },
      { brand: 'Starbucks', image: '/assets/smartgift/mockups/sbux_mug.jpg' }
    ],
    description_th: 'แก้วกาแฟสแตนเลสสองชั้นกันลวกมือ ผิวสัมผัสเนื้อแมตต์พรีเมียม สกรีนหรือยิงเลเซอร์โลโก้ได้อย่างคมชัด',
    lead_time_days: 5
  },
  'PM-FLASH': {
    // 3D withheld — mesh 1 : 0.96 : 0.37 vs product 1 : 0.28 : 0.14, 68% off. เกือบเป็นแท่งจัตุรัส แต่แฟลชไดรฟ์จริงแบนบาง
    // Draft archived to .drafts/3d/, no longer served (original: business-01-smart-gift/comfy-3d-products/outputs/final/).
    // model3d_url: '/assets/smartgift/3d/PM-FLASH.glb',
    // model3d_status: 'draft',
    description_th: 'แฟลชไดร์ฟโลหะหล่อลวดลายหยูอี้ความหมายมงคล รองรับทั้ง USB ปกติและพอร์ต Type-C ของสมาร์ตโฟน',
    lead_time_days: 5
  },
  'PM-MSG': {
    model3d_url: '/assets/smartgift/3d/PM-MSG.glb',
    model3d_status: 'draft',
    description_th: 'อุปกรณ์ดูแลสุขภาพเพื่อชาวออฟฟิศ ปรับโหมดนวดและความร้อนได้ 3 ระดับ',
    lead_time_days: 10
  },
  'PM-MUG-HEAT': {
    image: '/assets/smartgift/plates/ob_mug_plate.png',
    image_status: 'generated_from_source',
    model3d_url: '/assets/smartgift/3d/PM-MUG-HEAT.glb',
    model3d_status: 'draft',
    mockup_image: '/assets/smartgift/mockups/ob_mug.jpg',
    client_showcase: [
      { brand: 'One Bangkok', image: '/assets/smartgift/mockups/ob_mug.jpg' },
      { brand: 'GMMTV', image: '/assets/smartgift/mockups/gmmtv.jpg' }
    ],
    description_th: 'ชุดแก้วเซรามิกคุณภาพสูงพร้อมฐานอุ่นไฟอัจฉริยะ รักษาความอุ่นของเครื่องดื่มที่ 55°C ตลอดวันทำงาน',
    lead_time_days: 7
  },
  'PM-NB': {
    image: '/assets/smartgift/plates/one31_nb_plate.png',
    image_status: 'generated_from_source',
    // 3D withheld — mesh 1 : 0.76 : 0.46 vs product 1 : 0.75 : 0.12, 34% off. หนาเกือบครึ่งของด้านยาว แต่สมุดหนาแค่ 3 ซม.
    // Draft archived to .drafts/3d/, no longer served (original: business-01-smart-gift/comfy-3d-products/outputs/final/).
    // model3d_url: '/assets/smartgift/3d/PM-NB.glb',
    // model3d_status: 'draft',
    mockup_image: '/assets/smartgift/mockups/one31_nb.jpg',
    client_showcase: [
      { brand: 'One31', image: '/assets/smartgift/mockups/one31_nb.jpg' },
      { brand: 'One Bangkok', image: '/assets/smartgift/mockups/ob_nb.jpg' }
    ],
    description_th: 'สมุดปกหนัง PU มาพร้อมพาวเวอร์แบงก์ชาร์จไร้สายในตัว มีช่องเสียบการ์ด ปากกา และสายชาร์จ',
    lead_time_days: 7
  },
  'PM-PB10K': {
    image: '/assets/smartgift/plates/gmmtv_pb_plate.png',
    image_status: 'generated_from_source',
    // 3D withheld — mesh 1 : 0.85 : 0.40 vs product 1 : 0.65 : 0.15, 25% off. หนากว่าพาวเวอร์แบงก์จริง 2.7 เท่า
    // Draft archived to .drafts/3d/, no longer served (original: business-01-smart-gift/comfy-3d-products/outputs/final/).
    // model3d_url: '/assets/smartgift/3d/PM-PB10K.glb',
    // model3d_status: 'draft',
    mockup_image: '/assets/smartgift/mockups/gmmtv_pb.jpg',
    client_showcase: [
      { brand: 'GMMTV', image: '/assets/smartgift/mockups/gmmtv_pb.jpg' },
      { brand: 'One31', image: '/assets/smartgift/mockups/one31_pb.jpg' }
    ],
    description_th: 'แบตสำรองรองรับระบบแม่เหล็ก ชาร์จไร้สายติดหลังมือถือ พร้อมขาตั้งในตัว',
    lead_time_days: 7
  },
  'PM-TMB': {
    image: '/assets/smartgift/plates/one31_tmb_plate.png',
    image_status: 'generated_from_source',
    // Procedural model, built from dimensions_cm (6.5 x 6.5 x 23 cm) by scripts/build-procedural-3d.mjs:
    // shape exact, lid proportions and finish schematic. Replaces the TRELLIS draft, archived in .drafts/3d/ (mesh 1 : 0.78 : 0.21, a flat slab).
    model3d_url: '/assets/smartgift/3d/procedural/PM-TMB.glb',
    model3d_status: 'draft',
    mockup_image: '/assets/smartgift/mockups/one31_tmb.jpg',
    client_showcase: [
      { brand: 'Starbucks', image: '/assets/smartgift/mockups/sbux_tmb.jpg' },
      { brand: 'GMMTV', image: '/assets/smartgift/mockups/gmmtv_tmb.jpg' },
      { brand: 'One31', image: '/assets/smartgift/mockups/one31_tmb.jpg' }
    ],
    description_th: 'กระบอกน้ำสุญญากาศทัมเบลอร์ SUS304 พกพาสะดวก เคลือบสีป้องกันรอยขีดข่วน',
    lead_time_days: 6
  },
  'PM-UMB': {
    model3d_url: '/assets/smartgift/3d/PM-UMB.glb',
    model3d_status: 'draft',
    description_th: 'ร่มพับออโต้ 6 ตอน กาง-หุบอัตโนมัติ ผ้าเคลือบซิลิโคนกันแดด UPF50+',
    lead_time_days: 6
  },
  'PM-AROMA': {
    description_th: 'เครื่องสร้างละอองกลิ่นหอมผ่อนคลาย มาพร้อมไฟ LED จำลองเปลวไฟสร้างบรรยากาศบนโต๊ะทำงาน',
    lead_time_days: 7
  },
  'PM-CUTLERY': {
    description_th: 'ชุดช้อนส้อมมีดพกพา ผลิตจากสแตนเลสมาตรฐานฟู้ดเกรด พร้อมกล่องพกพา',
    lead_time_days: 4
  },
  'PM-DESK-MAT': {
    description_th: 'แผ่นรองโต๊ะหนัง Vegan กว้าง 80×40 ซม. มีแท่นชาร์จสมาร์ตโฟนไร้สายฝังในตัว',
    lead_time_days: 7
  },
  'PM-FAN': {
    description_th: 'พัดลมพกพาดีไซน์มินิมอล หน้าจอดิจิทัลแสดงระดับแรงลมและแบตเตอรี่ แบตเตอรี่ 4000mAh',
    lead_time_days: 5
  },
  'PM-PEN': {
    description_th: 'ปากกาเจลด้ามไม้วอลนัทแท้ หัวทองเหลือง สลักชื่อได้ พร้อมกล่อง',
    lead_time_days: 5
  },
  'PM-SPK': {
    description_th: 'ลำโพงบลูทูธสเตอริโอคู่พกพา ดีไซน์มินิมอล',
    lead_time_days: 6
  },
  'PM-TEA-INF': {
    description_th: 'กระบอกชงชาแก้ว Borosilicate สองชั้นแยกกากชา ไม่ร้อนมือ',
    lead_time_days: 6
  }
}
