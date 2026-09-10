/**
 * GENERATED FILE — do not edit by hand. Run: npm run build:catalog
 * Source: C:\Users\pc\workspace\business-01-smart-gift\data-pipeline\02_prepared\pricelist_master.json (schema 1.3.0b, run 2026-08-24T08-46-40-226Z)
 * Generated: 2026-09-10T19:35:49.563Z
 * Core layer only: 16 PM singles + 6 core sets. Media is overlaid from coreMedia.ts.
 * The supplier layer lives in public/catalog/data/supplier-items.json; its counts are exported here so the UI can
 * advertise it before loading it.
 */
import type { CatalogItemSeed, BundleTemplate } from './catalogTaxonomy'

export const SUPPLIER_LAYER_META = {
  "count": 216,
  "with_image": 152,
  "priced": 107,
  "source_total": 1110,
  "generated_at": "2026-09-10T19:35:49.563Z"
} as const

export const CORE_ITEMS: CatalogItemSeed[] = [
  {
    "id": "pm:PM-BOTTLE-LED",
    "code": "PM-BOTTLE-LED",
    "kind": "single",
    "layer": "core",
    "name_th": "กระบอกน้ำสแตนเลสบอกอุณหภูมิหน้าจอ Smart LED",
    "name_en": "Smart LED Temperature Thermos Bottle",
    "theme": "eco-friendly",
    "families": [
      "drinkware"
    ],
    "price_status": "tiered",
    "price_layer": "catalog_srp",
    "srp_price": 290,
    "price_tiers": [
      {
        "min_qty": 10,
        "unit_price": 260
      },
      {
        "min_qty": 20,
        "unit_price": 240
      },
      {
        "min_qty": 50,
        "unit_price": 220
      },
      {
        "min_qty": 100,
        "unit_price": 200
      },
      {
        "min_qty": 300,
        "unit_price": 185
      },
      {
        "min_qty": 500,
        "unit_price": 170
      },
      {
        "min_qty": 1000,
        "unit_price": 155
      }
    ],
    "moq": 10,
    "dimensions_cm": {
      "length": 7,
      "width": 7,
      "height": 23
    },
    "unit_weight_kg": 0.32,
    "used_in": [
      "TDD03-2",
      "SG-OFFER-XMAS-2026-REACH-OPS",
      "SG-OFFER-NY-2027-REACH-OPS"
    ],
    "image_status": "missing",
    "provenance": {
      "source_file": "data-pipeline/02_prepared/pricelist_master.json",
      "source_key": "PM-BOTTLE-LED"
    }
  },
  {
    "id": "pm:PM-FAN",
    "code": "PM-FAN",
    "kind": "single",
    "layer": "core",
    "name_th": "พัดลมพกพาดีไซน์มินิมอลหน้าจอดิจิทัลแบต 4000mAh",
    "name_en": "Digital Display Mini Handheld Fan",
    "theme": "eco-friendly",
    "families": [
      "fan"
    ],
    "price_status": "tiered",
    "price_layer": "catalog_srp",
    "srp_price": 260,
    "price_tiers": [
      {
        "min_qty": 10,
        "unit_price": 230
      },
      {
        "min_qty": 20,
        "unit_price": 210
      },
      {
        "min_qty": 50,
        "unit_price": 195
      },
      {
        "min_qty": 100,
        "unit_price": 175
      },
      {
        "min_qty": 300,
        "unit_price": 160
      },
      {
        "min_qty": 500,
        "unit_price": 148
      },
      {
        "min_qty": 1000,
        "unit_price": 138
      }
    ],
    "moq": 10,
    "dimensions_cm": {
      "length": 19.5,
      "width": 9,
      "height": 4.5
    },
    "unit_weight_kg": 0.21,
    "used_in": [],
    "image_status": "missing",
    "provenance": {
      "source_file": "data-pipeline/02_prepared/pricelist_master.json",
      "source_key": "PM-FAN"
    }
  },
  {
    "id": "pm:PM-TMB",
    "code": "PM-TMB",
    "kind": "single",
    "layer": "core",
    "name_th": "แก้วทัมเบลอร์เก็บอุณหภูมิ (Tumbler SUS316)",
    "name_en": "Thermal Tumbler SUS316",
    "theme": "eco-friendly",
    "families": [
      "drinkware"
    ],
    "price_status": "tiered",
    "price_layer": "catalog_srp",
    "srp_price": 320,
    "price_tiers": [
      {
        "min_qty": 10,
        "unit_price": 290
      },
      {
        "min_qty": 20,
        "unit_price": 270
      },
      {
        "min_qty": 50,
        "unit_price": 250
      },
      {
        "min_qty": 100,
        "unit_price": 230
      },
      {
        "min_qty": 300,
        "unit_price": 215
      },
      {
        "min_qty": 500,
        "unit_price": 200
      },
      {
        "min_qty": 1000,
        "unit_price": 185
      }
    ],
    "moq": 10,
    "dimensions_cm": {
      "length": 8,
      "width": 8,
      "height": 21
    },
    "unit_weight_kg": 0.35,
    "used_in": [
      "TDD03-2",
      "SG-OFFER-XMAS-2026-REACH-OPS",
      "SG-OFFER-NY-2027-REACH-OPS"
    ],
    "image_status": "missing",
    "provenance": {
      "source_file": "data-pipeline/02_prepared/pricelist_master.json",
      "source_key": "PM-TMB"
    }
  },
  {
    "id": "pm:PM-UMB",
    "code": "PM-UMB",
    "kind": "single",
    "layer": "core",
    "name_th": "ร่มพับออโต้ 6 ตอน เคลือบซิลิโคนกันแดด UPF50+",
    "name_en": "Auto 6-Fold UPF50+ Umbrella",
    "theme": "eco-friendly",
    "families": [
      "umbrella"
    ],
    "price_status": "tiered",
    "price_layer": "catalog_srp",
    "srp_price": 250,
    "price_tiers": [
      {
        "min_qty": 10,
        "unit_price": 220
      },
      {
        "min_qty": 20,
        "unit_price": 200
      },
      {
        "min_qty": 50,
        "unit_price": 185
      },
      {
        "min_qty": 100,
        "unit_price": 170
      },
      {
        "min_qty": 300,
        "unit_price": 155
      },
      {
        "min_qty": 500,
        "unit_price": 140
      },
      {
        "min_qty": 1000,
        "unit_price": 130
      }
    ],
    "moq": 10,
    "dimensions_cm": {
      "length": 28,
      "width": 5.5,
      "height": 5.5
    },
    "unit_weight_kg": 0.38,
    "used_in": [
      "TDD03-2",
      "SG-OFFER-XMAS-2026-REACH-OPS"
    ],
    "image_status": "missing",
    "provenance": {
      "source_file": "data-pipeline/02_prepared/pricelist_master.json",
      "source_key": "PM-UMB"
    }
  },
  {
    "id": "pm:PM-FLASH",
    "code": "PM-FLASH",
    "kind": "single",
    "layer": "core",
    "name_th": "แฟลชไดรฟ์โลหะหมุน Dual Interface (Type-C / USB 3.0)",
    "name_en": "Dual Interface Metal Flash Drive",
    "theme": "classic-oriental",
    "families": [
      "usb_flash_drive"
    ],
    "price_status": "tiered",
    "price_layer": "catalog_srp",
    "srp_price": 220,
    "price_tiers": [
      {
        "min_qty": 10,
        "unit_price": 190
      },
      {
        "min_qty": 20,
        "unit_price": 175
      },
      {
        "min_qty": 50,
        "unit_price": 160
      },
      {
        "min_qty": 100,
        "unit_price": 145
      },
      {
        "min_qty": 300,
        "unit_price": 135
      },
      {
        "min_qty": 500,
        "unit_price": 125
      },
      {
        "min_qty": 1000,
        "unit_price": 115
      }
    ],
    "moq": 10,
    "dimensions_cm": {
      "length": 6.5,
      "width": 1.8,
      "height": 0.9
    },
    "unit_weight_kg": 0.035,
    "used_in": [
      "TMK0215"
    ],
    "image_status": "missing",
    "provenance": {
      "source_file": "data-pipeline/02_prepared/pricelist_master.json",
      "source_key": "PM-FLASH"
    }
  },
  {
    "id": "pm:PM-PEN",
    "code": "PM-PEN",
    "kind": "single",
    "layer": "core",
    "name_th": "ปากกาเจลบอดี้ไม้แท้หัวทองเหลือง (Brass Wood Signature)",
    "name_en": "Solid Walnut Brass Gel Pen",
    "theme": "classic-oriental",
    "families": [
      "pen"
    ],
    "price_status": "tiered",
    "price_layer": "catalog_srp",
    "srp_price": 190,
    "price_tiers": [
      {
        "min_qty": 10,
        "unit_price": 160
      },
      {
        "min_qty": 20,
        "unit_price": 145
      },
      {
        "min_qty": 50,
        "unit_price": 130
      },
      {
        "min_qty": 100,
        "unit_price": 120
      },
      {
        "min_qty": 300,
        "unit_price": 110
      },
      {
        "min_qty": 500,
        "unit_price": 100
      },
      {
        "min_qty": 1000,
        "unit_price": 90
      }
    ],
    "moq": 10,
    "dimensions_cm": {
      "length": 14.5,
      "width": 1.4,
      "height": 1.4
    },
    "unit_weight_kg": 0.045,
    "used_in": [
      "TGC06-4",
      "TMK0215"
    ],
    "image_status": "missing",
    "provenance": {
      "source_file": "data-pipeline/02_prepared/pricelist_master.json",
      "source_key": "PM-PEN"
    }
  },
  {
    "id": "pm:PM-TEA-INF",
    "code": "PM-TEA-INF",
    "kind": "single",
    "layer": "core",
    "name_th": "กระบอกชงชาแก้ว Borosilicate สองชั้นแยกกากชา",
    "name_en": "Double Wall Borosilicate Tea Infuser",
    "theme": "classic-oriental",
    "families": [
      "drinkware"
    ],
    "price_status": "tiered",
    "price_layer": "catalog_srp",
    "srp_price": 360,
    "price_tiers": [
      {
        "min_qty": 10,
        "unit_price": 320
      },
      {
        "min_qty": 20,
        "unit_price": 300
      },
      {
        "min_qty": 50,
        "unit_price": 280
      },
      {
        "min_qty": 100,
        "unit_price": 255
      },
      {
        "min_qty": 300,
        "unit_price": 235
      },
      {
        "min_qty": 500,
        "unit_price": 220
      },
      {
        "min_qty": 1000,
        "unit_price": 205
      }
    ],
    "moq": 10,
    "dimensions_cm": {
      "length": 7.5,
      "width": 7.5,
      "height": 20
    },
    "unit_weight_kg": 0.45,
    "used_in": [
      "TMK0215"
    ],
    "image_status": "missing",
    "provenance": {
      "source_file": "data-pipeline/02_prepared/pricelist_master.json",
      "source_key": "PM-TEA-INF"
    }
  },
  {
    "id": "pm:PM-AROMA",
    "code": "PM-AROMA",
    "kind": "single",
    "layer": "core",
    "name_th": "เครื่องกระจายกลิ่นอโรมาอัลตราโซนิกเปลวไฟแสงไฟ Ambient",
    "name_en": "Ultrasonic Flame Aroma Diffuser",
    "theme": "novelty-self-care",
    "families": [
      "aroma_diffuser"
    ],
    "price_status": "tiered",
    "price_layer": "catalog_srp",
    "srp_price": 550,
    "price_tiers": [
      {
        "min_qty": 10,
        "unit_price": 490
      },
      {
        "min_qty": 20,
        "unit_price": 460
      },
      {
        "min_qty": 50,
        "unit_price": 420
      },
      {
        "min_qty": 100,
        "unit_price": 380
      },
      {
        "min_qty": 300,
        "unit_price": 350
      },
      {
        "min_qty": 500,
        "unit_price": 320
      },
      {
        "min_qty": 1000,
        "unit_price": 295
      }
    ],
    "moq": 10,
    "dimensions_cm": {
      "length": 17.5,
      "width": 10.5,
      "height": 8
    },
    "unit_weight_kg": 0.48,
    "used_in": [
      "TWL01-8"
    ],
    "image_status": "missing",
    "provenance": {
      "source_file": "data-pipeline/02_prepared/pricelist_master.json",
      "source_key": "PM-AROMA"
    }
  },
  {
    "id": "pm:PM-CFMUG",
    "code": "PM-CFMUG",
    "kind": "single",
    "layer": "core",
    "name_th": "แก้วกาแฟพกพาสแตนเลส 316 พร้อมฝา 3 ระบบ",
    "name_en": "Stainless Coffee Mug 3-Way Lid",
    "theme": "novelty-self-care",
    "families": [
      "drinkware"
    ],
    "price_status": "tiered",
    "price_layer": "catalog_srp",
    "srp_price": 299,
    "price_tiers": [
      {
        "min_qty": 10,
        "unit_price": 270
      },
      {
        "min_qty": 20,
        "unit_price": 250
      },
      {
        "min_qty": 50,
        "unit_price": 230
      },
      {
        "min_qty": 100,
        "unit_price": 210
      },
      {
        "min_qty": 300,
        "unit_price": 195
      },
      {
        "min_qty": 500,
        "unit_price": 180
      },
      {
        "min_qty": 1000,
        "unit_price": 165
      }
    ],
    "moq": 10,
    "dimensions_cm": {
      "length": 9,
      "width": 9,
      "height": 14.5
    },
    "unit_weight_kg": 0.28,
    "used_in": [
      "TWL01-8"
    ],
    "image_status": "missing",
    "provenance": {
      "source_file": "data-pipeline/02_prepared/pricelist_master.json",
      "source_key": "PM-CFMUG"
    }
  },
  {
    "id": "pm:PM-CUTLERY",
    "code": "PM-CUTLERY",
    "kind": "single",
    "layer": "core",
    "name_th": "ชุดช้อนส้อมมีดสแตนเลสฟู้ดเกรดพกพา",
    "name_en": "Portable Stainless Steel Cutlery Set",
    "theme": "novelty-self-care",
    "families": [
      "cutlery"
    ],
    "price_status": "tiered",
    "price_layer": "catalog_srp",
    "srp_price": 165,
    "price_tiers": [
      {
        "min_qty": 10,
        "unit_price": 140
      },
      {
        "min_qty": 20,
        "unit_price": 130
      },
      {
        "min_qty": 50,
        "unit_price": 120
      },
      {
        "min_qty": 100,
        "unit_price": 110
      },
      {
        "min_qty": 300,
        "unit_price": 100
      },
      {
        "min_qty": 500,
        "unit_price": 92
      },
      {
        "min_qty": 1000,
        "unit_price": 85
      }
    ],
    "moq": 10,
    "dimensions_cm": {
      "length": 21,
      "width": 6,
      "height": 3
    },
    "unit_weight_kg": 0.18,
    "used_in": [],
    "image_status": "missing",
    "provenance": {
      "source_file": "data-pipeline/02_prepared/pricelist_master.json",
      "source_key": "PM-CUTLERY"
    }
  },
  {
    "id": "pm:PM-MSG",
    "code": "PM-MSG",
    "kind": "single",
    "layer": "core",
    "name_th": "เครื่องนวดคอพกพาคลื่นความถี่ต่ำ Low Pulse & ประคบร้อน",
    "name_en": "Portable Low Pulse Neck Massager",
    "theme": "novelty-self-care",
    "families": [
      "neck_massager"
    ],
    "price_status": "tiered",
    "price_layer": "catalog_srp",
    "srp_price": 850,
    "price_tiers": [
      {
        "min_qty": 10,
        "unit_price": 780
      },
      {
        "min_qty": 20,
        "unit_price": 720
      },
      {
        "min_qty": 50,
        "unit_price": 660
      },
      {
        "min_qty": 100,
        "unit_price": 600
      },
      {
        "min_qty": 300,
        "unit_price": 550
      },
      {
        "min_qty": 500,
        "unit_price": 500
      },
      {
        "min_qty": 1000,
        "unit_price": 460
      }
    ],
    "moq": 10,
    "dimensions_cm": {
      "length": 18,
      "width": 16,
      "height": 6
    },
    "unit_weight_kg": 0.32,
    "used_in": [
      "TWL01-8"
    ],
    "image_status": "missing",
    "provenance": {
      "source_file": "data-pipeline/02_prepared/pricelist_master.json",
      "source_key": "PM-MSG"
    }
  },
  {
    "id": "pm:PM-MUG-HEAT",
    "code": "PM-MUG-HEAT",
    "kind": "single",
    "layer": "core",
    "name_th": "ชุดแก้วเซรามิกพร้อมแท่นอุ่นอุณหภูมิคงที่ 55°C",
    "name_en": "Ceramic Mug with 55C Heating Base",
    "theme": "novelty-self-care",
    "families": [
      "drinkware"
    ],
    "price_status": "tiered",
    "price_layer": "catalog_srp",
    "srp_price": 350,
    "price_tiers": [
      {
        "min_qty": 10,
        "unit_price": 310
      },
      {
        "min_qty": 20,
        "unit_price": 290
      },
      {
        "min_qty": 50,
        "unit_price": 270
      },
      {
        "min_qty": 100,
        "unit_price": 245
      },
      {
        "min_qty": 300,
        "unit_price": 225
      },
      {
        "min_qty": 500,
        "unit_price": 210
      },
      {
        "min_qty": 1000,
        "unit_price": 195
      }
    ],
    "moq": 10,
    "dimensions_cm": {
      "length": 16,
      "width": 14,
      "height": 12
    },
    "unit_weight_kg": 0.65,
    "used_in": [],
    "image_status": "missing",
    "provenance": {
      "source_file": "data-pipeline/02_prepared/pricelist_master.json",
      "source_key": "PM-MUG-HEAT"
    }
  },
  {
    "id": "pm:PM-DESK-MAT",
    "code": "PM-DESK-MAT",
    "kind": "single",
    "layer": "core",
    "name_th": "แผ่นรองโต๊ะทำงานหนัง Vegan Leather พร้อมที่ชาร์จไว",
    "name_en": "Wireless Charging Vegan Desk Mat",
    "theme": "executive-smart-tech",
    "families": [
      "desk_mat"
    ],
    "price_status": "tiered",
    "price_layer": "catalog_srp",
    "srp_price": 590,
    "price_tiers": [
      {
        "min_qty": 10,
        "unit_price": 530
      },
      {
        "min_qty": 20,
        "unit_price": 490
      },
      {
        "min_qty": 50,
        "unit_price": 450
      },
      {
        "min_qty": 100,
        "unit_price": 410
      },
      {
        "min_qty": 300,
        "unit_price": 375
      },
      {
        "min_qty": 500,
        "unit_price": 345
      },
      {
        "min_qty": 1000,
        "unit_price": 320
      }
    ],
    "moq": 10,
    "dimensions_cm": {
      "length": 80,
      "width": 40,
      "height": 0.4
    },
    "unit_weight_kg": 0.55,
    "used_in": [],
    "image_status": "missing",
    "provenance": {
      "source_file": "data-pipeline/02_prepared/pricelist_master.json",
      "source_key": "PM-DESK-MAT"
    }
  },
  {
    "id": "pm:PM-NB",
    "code": "PM-NB",
    "kind": "single",
    "layer": "core",
    "name_th": "สมุดโน้ตหนัง PU อัจฉริยะฝังพาวเวอร์แบงก์ชาร์จไร้สาย",
    "name_en": "Smart Leather Powerbank Notebook",
    "theme": "executive-smart-tech",
    "families": [
      "notebook"
    ],
    "price_status": "tiered",
    "price_layer": "catalog_srp",
    "srp_price": 750,
    "price_tiers": [
      {
        "min_qty": 10,
        "unit_price": 680
      },
      {
        "min_qty": 20,
        "unit_price": 630
      },
      {
        "min_qty": 50,
        "unit_price": 590
      },
      {
        "min_qty": 100,
        "unit_price": 540
      },
      {
        "min_qty": 300,
        "unit_price": 490
      },
      {
        "min_qty": 500,
        "unit_price": 450
      },
      {
        "min_qty": 1000,
        "unit_price": 420
      }
    ],
    "moq": 10,
    "dimensions_cm": {
      "length": 24,
      "width": 18,
      "height": 3
    },
    "unit_weight_kg": 0.72,
    "used_in": [
      "TGC06-4"
    ],
    "image_status": "missing",
    "provenance": {
      "source_file": "data-pipeline/02_prepared/pricelist_master.json",
      "source_key": "PM-NB"
    }
  },
  {
    "id": "pm:PM-PB10K",
    "code": "PM-PB10K",
    "kind": "single",
    "layer": "core",
    "name_th": "พาวเวอร์แบงก์แม่เหล็กไร้สาย 10,000mAh (MagSafe & Stand)",
    "name_en": "MagSafe Wireless Powerbank 10000mAh",
    "theme": "executive-smart-tech",
    "families": [
      "power_bank"
    ],
    "price_status": "tiered",
    "price_layer": "catalog_srp",
    "srp_price": 690,
    "price_tiers": [
      {
        "min_qty": 10,
        "unit_price": 620
      },
      {
        "min_qty": 20,
        "unit_price": 580
      },
      {
        "min_qty": 50,
        "unit_price": 540
      },
      {
        "min_qty": 100,
        "unit_price": 490
      },
      {
        "min_qty": 300,
        "unit_price": 450
      },
      {
        "min_qty": 500,
        "unit_price": 420
      },
      {
        "min_qty": 1000,
        "unit_price": 390
      }
    ],
    "moq": 10,
    "dimensions_cm": {
      "length": 10.5,
      "width": 6.8,
      "height": 1.6
    },
    "unit_weight_kg": 0.22,
    "used_in": [
      "TGC06-4"
    ],
    "image_status": "missing",
    "provenance": {
      "source_file": "data-pipeline/02_prepared/pricelist_master.json",
      "source_key": "PM-PB10K"
    }
  },
  {
    "id": "pm:PM-SPK",
    "code": "PM-SPK",
    "kind": "single",
    "layer": "core",
    "name_th": "ลำโพงบลูทูธสเตอริโอคู่พรีเมียม (Bluetooth Speaker 5W)",
    "name_en": "Dual Stereo Bluetooth Speaker",
    "theme": "executive-smart-tech",
    "families": [
      "speaker"
    ],
    "price_status": "tiered",
    "price_layer": "catalog_srp",
    "srp_price": 480,
    "price_tiers": [
      {
        "min_qty": 10,
        "unit_price": 440
      },
      {
        "min_qty": 20,
        "unit_price": 410
      },
      {
        "min_qty": 50,
        "unit_price": 380
      },
      {
        "min_qty": 100,
        "unit_price": 350
      },
      {
        "min_qty": 300,
        "unit_price": 320
      },
      {
        "min_qty": 500,
        "unit_price": 295
      },
      {
        "min_qty": 1000,
        "unit_price": 275
      }
    ],
    "moq": 10,
    "dimensions_cm": {
      "length": 12,
      "width": 8.5,
      "height": 6.5
    },
    "unit_weight_kg": 0.42,
    "used_in": [],
    "image_status": "missing",
    "provenance": {
      "source_file": "data-pipeline/02_prepared/pricelist_master.json",
      "source_key": "PM-SPK"
    }
  },
  {
    "id": "offer:TDD03-2",
    "code": "TDD03-2",
    "kind": "set",
    "layer": "core",
    "name_th": "ชุดของขวัญ Pastel Series (ร่มพาสเทล + สมุด Skin-touch + กระบอกน้ำสุญญากาศ)",
    "theme": "eco-friendly",
    "tier": "Select",
    "occasions": [],
    "families": [
      "umbrella",
      "drinkware"
    ],
    "price_status": "tiered",
    "price_layer": "catalog_srp",
    "price_tiers": [
      {
        "min_qty": 10,
        "unit_price": 550
      },
      {
        "min_qty": 50,
        "unit_price": 490
      },
      {
        "min_qty": 100,
        "unit_price": 440
      }
    ],
    "moq": 10,
    "contains": [
      {
        "product_code": "PM-UMB",
        "qty": 1,
        "name_th": "ร่มพับออโต้ 6 ตอน เคลือบซิลิโคนกันแดด UPF50+"
      },
      {
        "product_code": "PM-BOTTLE-LED",
        "qty": 1,
        "name_th": "กระบอกน้ำสแตนเลสบอกอุณหภูมิหน้าจอ Smart LED"
      },
      {
        "product_code": "PM-TMB",
        "qty": 1,
        "name_th": "แก้วทัมเบลอร์เก็บอุณหภูมิ (Tumbler SUS316)"
      }
    ],
    "unboxing_th": "การคุมโทนสีฟ้าพาสเทลและสัมผัส Skin-touch อ่อนหวาน ละมุน บรรจุในกล่องฝาสวมพรีเมียม",
    "image_status": "missing",
    "provenance": {
      "source_file": "data-pipeline/02_prepared/pricelist_master.json",
      "source_key": "TDD03-2"
    }
  },
  {
    "id": "offer:TGC06-4",
    "code": "TGC06-4",
    "kind": "set",
    "layer": "core",
    "name_th": "ชุดของขวัญ Executive Smart Tech (Smart Notebook + Power Bank + Metal Pen)",
    "theme": "executive-smart-tech",
    "tier": "Signature",
    "occasions": [],
    "families": [
      "notebook",
      "power_bank",
      "pen"
    ],
    "price_status": "tiered",
    "price_layer": "catalog_srp",
    "price_tiers": [
      {
        "min_qty": 10,
        "unit_price": 930
      },
      {
        "min_qty": 50,
        "unit_price": 880
      },
      {
        "min_qty": 100,
        "unit_price": 820
      }
    ],
    "moq": 10,
    "contains": [
      {
        "product_code": "PM-NB",
        "qty": 1,
        "name_th": "สมุดโน้ตหนัง PU อัจฉริยะฝังพาวเวอร์แบงก์ชาร์จไร้สาย"
      },
      {
        "product_code": "PM-PB10K",
        "qty": 1,
        "name_th": "พาวเวอร์แบงก์แม่เหล็กไร้สาย 10,000mAh (MagSafe & Stand)"
      },
      {
        "product_code": "PM-PEN",
        "qty": 1,
        "name_th": "ปากกาเจลบอดี้ไม้แท้หัวทองเหลือง (Brass Wood Signature)"
      }
    ],
    "unboxing_th": "กล่องแม่เหล็กพรีเมียมบุโฟม EVA กำมะหยี่สีดำ พร้อมสมุดอัจฉริยะฝังพาวเวอร์แบงก์ชาร์จไร้สายในตัว",
    "image_status": "missing",
    "provenance": {
      "source_file": "data-pipeline/02_prepared/pricelist_master.json",
      "source_key": "TGC06-4"
    }
  },
  {
    "id": "offer:TMK0215",
    "code": "TMK0215",
    "kind": "set",
    "layer": "core",
    "name_th": "ชุดของขวัญ Classic Oriental (สมุดคลิปโลหะ + ปากกาไม้แท้ + ที่คั่นหนังสือเมฆมงคล)",
    "theme": "classic-oriental",
    "tier": "Signature",
    "occasions": [],
    "families": [
      "pen",
      "usb_flash_drive",
      "drinkware"
    ],
    "price_status": "tiered",
    "price_layer": "catalog_srp",
    "price_tiers": [
      {
        "min_qty": 10,
        "unit_price": 850
      },
      {
        "min_qty": 50,
        "unit_price": 790
      },
      {
        "min_qty": 100,
        "unit_price": 730
      }
    ],
    "moq": 10,
    "contains": [
      {
        "product_code": "PM-PEN",
        "qty": 1,
        "name_th": "ปากกาเจลบอดี้ไม้แท้หัวทองเหลือง (Brass Wood Signature)"
      },
      {
        "product_code": "PM-FLASH",
        "qty": 1,
        "name_th": "แฟลชไดรฟ์โลหะหมุน Dual Interface (Type-C / USB 3.0)"
      },
      {
        "product_code": "PM-TEA-INF",
        "qty": 1,
        "name_th": "กระบอกชงชาแก้ว Borosilicate สองชั้นแยกกากชา"
      }
    ],
    "unboxing_th": "ดีไซน์สไตล์จีนคลาสสิกร่วมสมัย พร้อมลวดลายเมฆมงคลและพู่ไหม สัมผัสทรงคุณค่าและประณีต",
    "image_status": "missing",
    "provenance": {
      "source_file": "data-pipeline/02_prepared/pricelist_master.json",
      "source_key": "TMK0215"
    }
  },
  {
    "id": "offer:TWL01-8",
    "code": "TWL01-8",
    "kind": "set",
    "layer": "core",
    "name_th": "ชุดของขวัญ Novelty & Self-Care (เทียนหอมอโรมา + แก้วอเนกประสงค์ + สบู่กุหลาบ)",
    "theme": "novelty-self-care",
    "tier": "Select",
    "occasions": [],
    "families": [
      "aroma_diffuser",
      "drinkware",
      "neck_massager"
    ],
    "price_status": "tiered",
    "price_layer": "catalog_srp",
    "price_tiers": [
      {
        "min_qty": 10,
        "unit_price": 680
      },
      {
        "min_qty": 50,
        "unit_price": 620
      },
      {
        "min_qty": 100,
        "unit_price": 570
      }
    ],
    "moq": 10,
    "contains": [
      {
        "product_code": "PM-AROMA",
        "qty": 1,
        "name_th": "เครื่องกระจายกลิ่นอโรมาอัลตราโซนิกเปลวไฟแสงไฟ Ambient"
      },
      {
        "product_code": "PM-CFMUG",
        "qty": 1,
        "name_th": "แก้วกาแฟพกพาสแตนเลส 316 พร้อมฝา 3 ระบบ"
      },
      {
        "product_code": "PM-MSG",
        "qty": 1,
        "name_th": "เครื่องนวดคอพกพาคลื่นความถี่ต่ำ Low Pulse & ประคบร้อน"
      }
    ],
    "unboxing_th": "ชุดผ่อนคลายอโรมาเธอราพี ให้ความรู้สึกอบอุ่น ใส่ใจ เหมาะสำหรับแคมเปญสุขภาพและ Wellness",
    "image_status": "missing",
    "provenance": {
      "source_file": "data-pipeline/02_prepared/pricelist_master.json",
      "source_key": "TWL01-8"
    }
  },
  {
    "id": "offer:smartgift-2026-christmas-reach-operations",
    "code": "SG-OFFER-XMAS-2026-REACH-OPS",
    "kind": "set",
    "layer": "core",
    "name_th": "ชุดส่งต่อความอบอุ่นสำหรับทีมปฏิบัติการ",
    "theme": "eco-friendly",
    "tier": "Reach",
    "occasions": [
      "christmas"
    ],
    "families": [
      "umbrella",
      "drinkware"
    ],
    "price_status": "ask_for_quote",
    "price_tiers": [],
    "contains": [
      {
        "product_code": "PM-UMB",
        "qty": 1,
        "name_th": "ร่มพับออโต้ 6 ตอน เคลือบซิลิโคนกันแดด UPF50+"
      },
      {
        "product_code": "PM-BOTTLE-LED",
        "qty": 1,
        "name_th": "กระบอกน้ำสแตนเลสบอกอุณหภูมิหน้าจอ Smart LED"
      },
      {
        "product_code": "PM-TMB",
        "qty": 1,
        "name_th": "แก้วทัมเบลอร์เก็บอุณหภูมิ (Tumbler SUS316)"
      }
    ],
    "unboxing_th": "โทนอบอุ่น ใช้จริงในชีวิตประจำวัน พร้อมข้อความขอบคุณทีมงาน",
    "image_status": "missing",
    "provenance": {
      "source_file": "data-pipeline/02_prepared/pricelist_master.json",
      "source_key": "SG-OFFER-XMAS-2026-REACH-OPS"
    }
  },
  {
    "id": "offer:smartgift-2027-new-year-reach-operations",
    "code": "SG-OFFER-NY-2027-REACH-OPS",
    "kind": "set",
    "layer": "core",
    "name_th": "ชุด Fresh Start Essentials สำหรับทีมปฏิบัติการ",
    "theme": "eco-friendly",
    "tier": "Reach",
    "occasions": [
      "new-year"
    ],
    "families": [
      "drinkware"
    ],
    "price_status": "ask_for_quote",
    "price_tiers": [],
    "contains": [
      {
        "product_code": "PM-TMB",
        "qty": 1,
        "name_th": "แก้วทัมเบลอร์เก็บอุณหภูมิ (Tumbler SUS316)"
      },
      {
        "product_code": "PM-BOTTLE-LED",
        "qty": 1,
        "name_th": "กระบอกน้ำสแตนเลสบอกอุณหภูมิหน้าจอ Smart LED"
      }
    ],
    "unboxing_th": "โทนสะอาดและสดใหม่ อุปกรณ์ที่หยิบใช้ได้ตั้งแต่วันแรกของปี",
    "image_status": "missing",
    "provenance": {
      "source_file": "data-pipeline/02_prepared/pricelist_master.json",
      "source_key": "SG-OFFER-NY-2027-REACH-OPS"
    }
  }
]

/** Package templates: 11 PKG structures (none quote-ready) + 2 blueprint examples. No prices stored. */
export const BUNDLE_TEMPLATES: BundleTemplate[] = [
  {
    "code": "PKG-NEW-EMPLOYEE-WELCOME",
    "name_th": "ชุดต้อนรับพนักงานใหม่",
    "source": "pkg",
    "status": "draft",
    "occasion": "new-employee-welcome",
    "design_scope_themes": [
      "eco-friendly",
      "classic-oriental",
      "novelty-self-care",
      "executive-smart-tech"
    ],
    "groups": [
      {
        "label": "Reach",
        "tier": "Reach"
      },
      {
        "label": "Select",
        "tier": "Select"
      },
      {
        "label": "Signature",
        "tier": "Signature"
      },
      {
        "label": "Bespoke",
        "tier": "Bespoke"
      }
    ]
  },
  {
    "code": "PKG-XMAS-2026-REACH-OPS",
    "name_th": "ชุดส่งต่อความอบอุ่นสำหรับทีมปฏิบัติการ",
    "source": "pkg",
    "status": "mapping_pending",
    "occasion": "christmas",
    "design_scope_themes": [
      "eco-friendly"
    ],
    "groups": [
      {
        "label": "ทีมปฏิบัติการ",
        "segment": "Operations",
        "tier": "Reach",
        "offer_code": "SG-OFFER-XMAS-2026-REACH-OPS"
      }
    ]
  },
  {
    "code": "PKG-XMAS-2026-SELECT-MID",
    "name_th": "ชุดดูแลใจและโต๊ะทำงานสำหรับหัวหน้าทีม",
    "source": "pkg",
    "status": "missing_inputs",
    "occasion": "christmas",
    "design_scope_themes": [
      "eco-friendly"
    ],
    "groups": [
      {
        "label": "หัวหน้าทีม",
        "segment": "Mid-Management",
        "tier": "Select",
        "offer_code": "TDD03-2"
      }
    ]
  },
  {
    "code": "PKG-XMAS-2026-SIGNATURE-CLEVEL",
    "name_th": "ชุด Smart Executive สำหรับผู้บริหาร",
    "source": "pkg",
    "status": "cost_pending",
    "occasion": "christmas",
    "design_scope_themes": [
      "classic-oriental",
      "executive-smart-tech"
    ],
    "groups": [
      {
        "label": "ผู้บริหาร",
        "segment": "C-Level",
        "tier": "Signature",
        "offer_code": "TGC06-4"
      }
    ]
  },
  {
    "code": "PKG-XMAS-2026-BESPOKE",
    "name_th": "ชุด Bespoke สำหรับผู้บริหารตาม brief",
    "source": "pkg",
    "status": "draft",
    "occasion": "christmas",
    "design_scope_themes": [],
    "groups": [
      {
        "label": "ผู้บริหาร",
        "segment": "C-Level",
        "tier": "Bespoke"
      }
    ]
  },
  {
    "code": "PKG-XMAS-2026-CORP-MIX",
    "name_th": "แพ็กเกจองค์กร Christmas 2026 (Corporate Mix)",
    "source": "pkg",
    "status": "draft",
    "occasion": "christmas",
    "design_scope_themes": [
      "eco-friendly",
      "executive-smart-tech"
    ],
    "groups": [
      {
        "label": "ทีมปฏิบัติการ",
        "segment": "Operations",
        "tier": "Reach",
        "offer_code": "SG-OFFER-XMAS-2026-REACH-OPS"
      },
      {
        "label": "หัวหน้าทีม",
        "segment": "Mid-Management",
        "tier": "Select",
        "offer_code": "TDD03-2"
      },
      {
        "label": "ผู้บริหาร",
        "segment": "C-Level",
        "tier": "Signature",
        "offer_code": "TGC06-4"
      }
    ]
  },
  {
    "code": "PKG-NY-2027-REACH-OPS",
    "name_th": "ชุด Fresh Start Essentials สำหรับทีมปฏิบัติการ",
    "source": "pkg",
    "status": "mapping_pending",
    "occasion": "new-year",
    "design_scope_themes": [
      "eco-friendly"
    ],
    "groups": [
      {
        "label": "ทีมปฏิบัติการ",
        "segment": "Operations",
        "tier": "Reach",
        "offer_code": "SG-OFFER-NY-2027-REACH-OPS"
      }
    ]
  },
  {
    "code": "PKG-NY-2027-SELECT-MID",
    "name_th": "ชุด Reset & Recharge สำหรับหัวหน้าทีม",
    "source": "pkg",
    "status": "cost_pending",
    "occasion": "new-year",
    "design_scope_themes": [
      "novelty-self-care"
    ],
    "groups": [
      {
        "label": "หัวหน้าทีม",
        "segment": "Mid-Management",
        "tier": "Select",
        "offer_code": "TWL01-8"
      }
    ]
  },
  {
    "code": "PKG-NY-2027-SIGNATURE-CLEVEL",
    "name_th": "ชุด Plan & Power สำหรับผู้บริหาร",
    "source": "pkg",
    "status": "cost_pending",
    "occasion": "new-year",
    "design_scope_themes": [
      "classic-oriental"
    ],
    "groups": [
      {
        "label": "ผู้บริหาร",
        "segment": "C-Level",
        "tier": "Signature",
        "offer_code": "TMK0215"
      }
    ]
  },
  {
    "code": "PKG-NY-2027-BESPOKE",
    "name_th": "ชุด Bespoke สำหรับผู้บริหารตาม brief",
    "source": "pkg",
    "status": "draft",
    "occasion": "new-year",
    "design_scope_themes": [],
    "groups": [
      {
        "label": "ผู้บริหาร",
        "segment": "C-Level",
        "tier": "Bespoke"
      }
    ]
  },
  {
    "code": "PKG-NY-2027-CORP-MIX",
    "name_th": "แพ็กเกจองค์กร New Year 2027 (Corporate Mix)",
    "source": "pkg",
    "status": "draft",
    "occasion": "new-year",
    "design_scope_themes": [
      "classic-oriental",
      "eco-friendly",
      "novelty-self-care"
    ],
    "groups": [
      {
        "label": "ทีมปฏิบัติการ",
        "segment": "Operations",
        "tier": "Reach",
        "offer_code": "SG-OFFER-NY-2027-REACH-OPS"
      },
      {
        "label": "หัวหน้าทีม",
        "segment": "Mid-Management",
        "tier": "Select",
        "offer_code": "TWL01-8"
      },
      {
        "label": "ผู้บริหาร",
        "segment": "C-Level",
        "tier": "Signature",
        "offer_code": "TMK0215"
      }
    ]
  },
  {
    "code": "PKG-SME-ELITE",
    "name_th": "SME Elite Corporate Bundle (Package A)",
    "source": "blueprint",
    "status": "blueprint_example",
    "description_th": "แพ็กเกจสำหรับบริษัทขนาดกลาง หรือ 1 แผนกใหญ่ ครอบคลุม 3 ระดับผู้รับ (VIP 5 ชุด, หัวหน้างาน 10 ชุด, ทีมงาน 20 ชุด)",
    "target_recipients": 35,
    "design_scope_themes": [],
    "groups": [
      {
        "label": "Signature",
        "tier": "Signature",
        "offer_code": "TGC06-4",
        "qty": 10
      },
      {
        "label": "Select",
        "tier": "Select",
        "offer_code": "TDD03-2",
        "qty": 5
      },
      {
        "label": "Signature",
        "tier": "Signature",
        "offer_code": "TMK0215",
        "qty": 20
      }
    ]
  },
  {
    "code": "PKG-ENTERPRISE-160",
    "name_th": "Enterprise Annual Gala Bundle (Package B)",
    "source": "blueprint",
    "status": "blueprint_example",
    "description_th": "แพ็กเกจงานประชุมใหญ่หรือปีใหม่องค์กร ครอบคลุมบอร์ดบริหาร 10 ท่าน, ผู้จัดการ 30 ท่าน, และพนักงาน 120 ท่าน",
    "target_recipients": 160,
    "design_scope_themes": [],
    "groups": [
      {
        "label": "Signature",
        "tier": "Signature",
        "offer_code": "TGC06-4",
        "qty": 30
      },
      {
        "label": "Select",
        "tier": "Select",
        "offer_code": "TDD03-2",
        "qty": 10
      },
      {
        "label": "Signature",
        "tier": "Signature",
        "offer_code": "TMK0215",
        "qty": 120
      }
    ]
  }
]
