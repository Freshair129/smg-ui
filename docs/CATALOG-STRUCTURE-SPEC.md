# CATALOG STRUCTURE SPECIFICATION — Two Lenses, One Item Pool
**Project:** SmartGift Web UI (`web-ui-smg`)  
**Machine-readable companion:** [`src/data/catalogTaxonomy.ts`](../src/data/catalogTaxonomy.ts)  
**Sources:** `business-01-smart-gift/data-pipeline/02_prepared/{smartgift_catalog_master, pricelist_master, ProductMaster, CatalogOffer, BundleOffer}.json`, `docs/business/SMARTGIFT-PRODUCT-TAXONOMY-OFFER-RULES-2026-08.md`, `docs/business/2026-09-07-catalog-listing.md`, `PRODUCT.md`  
**Version:** `1.4.0` · **Date:** 2026-09-07 · **Status:** P0–P5 implemented; brief intake endpoint on the zuri-ai side still pending (client falls back to mailto / clipboard)

---

## 0. สรุปสำหรับผู้ตัดสินใจ

1. **แคตตาล็อกมีสองมุมมอง (lens) บนข้อมูลชุดเดียว**
   - **Lens A — เริ่มจากผู้รับ** (แบรนด์): โอกาส → ระดับการดูแล (Reach/Select/Signature/Bespoke) → ธีมความสนใจ (4 ธีม)
   - **Lens B — หมวดหมู่สินค้ามาตรฐาน** (ที่ผู้จัดซื้อคุ้นเคย): 7 หมวดหลัก → 35 กลุ่มสินค้า (product family) — นี่คือ "การแบ่งหมวดหมู่มาตรฐานทั่วไป" ที่ต้องดูได้
2. **Gift Tier ไม่ใช่หมวดสินค้า** — UI ปัจจุบันเรียก 4 ธีม + B—Line ว่า "5 Gift Tiers" ซึ่งขัดกับนิยามที่ Boss อนุมัติ (Tier = ระดับการดูแล) ต้องแยกแกนให้ถูก
3. **หมวดมาตรฐานถูก *derive* จาก product family ไม่ได้พิมพ์มือ** — กติกาอยู่ใน `standardCategoryOf()` และตาราง §4; ชุดของขวัญอยู่หมวด "ชุดของขวัญ" และค้นตาม "ชิ้นที่อยู่ในชุด" ได้
4. **ข้อมูลใน UI ต้อง generate จาก SSOT** — วันนี้ `src/data/smartGiftCatalogData.ts` มีรหัสตรง SSOT ครบ 16 แต่ **ราคา SRP ต่างจาก SSOT 8 รายการ** (§9.1) และ AGENTS.md/SITEMAP.md ยังบรรยายสินค้าที่ไม่มีอยู่จริง 8 รายการ (PM-TEA-SET, PM-SILK-FAN, …)
5. B—Line 11 ชิ้น (เฟอร์นิเจอร์อิตาลี) ไม่ใช่ SKU ของ SmartGift — คงไว้ได้ในฐานะ *"Design partner / Bespoke inspiration"* ที่ `#bline` แยกจาก item pool

---

## 1. ปัญหาของโครงสร้างปัจจุบัน (`unifiedBLineCatalog.ts`, `BLineCatalogSection.tsx`)

| ประเด็น | ปัจจุบัน | ผลต่อผู้ใช้ |
|---|---|---|
| แกนเดียว | `category: 'Eco-Friendly' \| 'Classic Oriental' \| 'Novelty & Care' \| 'Smart Tech' \| 'Bespoke (B-Line)'` | ผู้จัดซื้อที่ต้องการ "พาวเวอร์แบงก์ 300 ชิ้น" ต้องเดาว่าอยู่ธีมไหน |
| Tier ปนธีม | "5 Gift Tiers" = 4 ธีม + 1 แบรนด์พาร์ตเนอร์ | ขัด Portfolio Architecture P5 และหน้า 2 ของ creative proof |
| ไม่มีชุด/เดี่ยว | ทุกอย่างเป็น card เดียวกัน | SSOT มี 6 ชุด core + 1,080 ชุดจากผู้ผลิต และ 11 PKG ที่ยังไม่แสดงเลย |
| ราคา | `srp_price` พิมพ์มือ | ต่างจาก SSOT 8/16 รายการ (§9.1) |
| สถานะราคา | ทุกรายการมีตัวเลข | SSOT ระบุ 1,002 รายการเป็น `ask_for_quote` — ห้ามแสดง 0 บาทหรือราคาเดา |
| สถานะภาพ | ไม่มี | PRODUCT.md บังคับแยก "ภาพต้นฉบับ / ภาพสร้างสรรค์ / ยังไม่มีภาพ" |
| 3D | badge "3D" | `category_coverage_report.json` บอกว่าทั้ง 16 ยัง `held` (0 owner_approved) → ต้องติด "draft" |

---

## 2. Information architecture

```
ITEM POOL (CatalogItem[])  ──  singles ∪ sets ∪ bundles  (core layer + supplier layer)
        │
        ├── Lens A  "เริ่มจากผู้รับ"  (default ที่ #catalog)
        │     ├── โอกาส (Occasion)          8 ค่า   ← PKG.occasion + GTM archetypes
        │     ├── ระดับการดูแล (Gift Tier)   4 ค่า   ← sets/bundles มี tier, singles มี tier_eligibility
        │     └── ธีมความสนใจ (Theme)        4 ค่า   ← Category node (cat:) ใน SSOT
        │
        └── Lens B  "หมวดหมู่สินค้า"  (#catalog/category)
              ├── หมวดหลัก L1                7 ค่า (+ unclassified ซ่อน)
              └── กลุ่มสินค้า L2 (family)   35 ค่า   ← pricelist_master.product_families (32) + PM-only (3)

FACETS ใช้ร่วมทั้งสอง lens: รูปแบบ (เดี่ยว/ชุด/แพ็กเกจ) · ช่วงราคา @100 · MOQ · สถานะราคา · มี 3D · มี client showcase · สถานะภาพ · ธีม · tier
VIEWS: grid (B—Line 4:3, default) · list (ตารางสเปก) · index (หน้ารวมทุกหมวดพร้อมตัวอย่าง 4 ชิ้น)
```

### 2.1 หลักการที่ยึด

| หลัก | ที่มา | ผลต่อการออกแบบ |
|---|---|---|
| Public simplicity, internal precision (T8/P7) | Taxonomy doc | ลูกค้าเห็น 7 หมวด + 4 ธีม + 4 tier; readiness state ทั้งหมดซ่อนไว้ในข้อมูล |
| Tier belongs to treatment (T2/P5) | Taxonomy doc | tier เป็น facet ของ *ชุด/แพ็กเกจ* singles มีแค่ eligibility |
| Product family ≠ marketing positioning (§4.5) | Taxonomy doc | family คือ L2 ของ lens มาตรฐาน ไม่ใช่ธีม |
| แยกสินค้ารายชิ้นกับชุดของขวัญ | PRODUCT.md | `kind` เป็น facet ระดับบนสุด และ card ต่างกัน |
| ไม่แต่งราคา / ห้าม 0 บาท | PRODUCT.md, catalog-listing | `price_status` + `bestTierPrice()` คืน `undefined` → แสดง "สอบถามราคา" |
| ภาพต้นฉบับที่ตรวจรหัสได้ | PRODUCT.md | `image_status` บังคับ, `isPublicItem()` ซ่อนรายการที่ไม่มีทั้งภาพและราคา |
| B—Line layout fidelity (AGENTS Rule 1) | AGENTS.md | ทุก view ยังใช้ `.bline-nav`, `.bline-wordmark`, `.bline-section-label`, `.bline-grid`, `.bline-card` 4:3 |

---

## 3. Lens A — เริ่มจากผู้รับ (brand lens)

| แกน | ค่า (จาก `catalogTaxonomy.ts`) | ใช้ filter อะไร |
|---|---|---|
| โอกาส | new-year, christmas, songkran, new-employee-welcome, recognition, member-appreciation, launch-event, csr-community | `item.occasions` (bundles/sets) |
| ระดับการดูแล | Reach · Select · Signature · Bespoke (คำโปรยจาก PDF p.2: เข้าถึงผู้รับในวงกว้าง / คัดให้เหมาะกับกลุ่ม / ใส่ใจในรายละเอียด / ออกแบบตามบริบท) | `item.tier` หรือ `tier_eligibility` |
| ธีมความสนใจ | รักษ์โลก · ศิลปะและวัฒนธรรม · ไลฟ์สไตล์และดูแลตัวเอง · เทคโนโลยีและการทำงาน | `item.theme` |

หน้า index ของ lens นี้เรียงเป็นคำถาม 4 ข้อ (ตาม PDF p.11 "เริ่มคุยจากโจทย์ที่สำคัญ" และ Portfolio Architecture §13): **ให้ใคร → เพื่ออะไร → ระดับไหน → จำนวนเท่าไร** แล้วจึงแสดง "ชุดของขวัญที่เข้ากับโจทย์" (core sets เรียงตามโอกาส/ระดับ) ตามด้วยสินค้าเดี่ยวแยกตามธีม

### 3.1 Gifting brief (implemented P3)

| ข้อ | เก็บที่ | ผลต่อรายการ |
|---|---|---|
| ให้ใคร (`?recipient=TEAM`) | hash filter | **ไม่กรอง** — ไฮไลต์ระดับที่ "มักใช้" จาก `RECIPIENT_RELATIONSHIPS[].typical_tiers` (Portfolio §7/§12.2) และแนบไปใน brief เท่านั้น (P4: ลูกค้าเป็นเจ้าของ mapping) |
| เพื่ออะไร (`?occasion=new-year`) | hash filter | กรองเฉพาะเมื่อมีรายการที่ผูกโอกาสนั้น (วันนี้มี 2 ชุด XMAS/NY) มิฉะนั้นแสดงทั้งหมดพร้อมหมายเหตุ |
| ระดับไหน (`?tier=select`) | hash filter | กรอง **ชุด/แพ็กเกจ** ตาม tier; สินค้าเดี่ยวไม่ถูกกรอง (ยังไม่มี `tier_eligibility` ใน SSOT) |
| จำนวนเท่าไร (`?qty=100`) | hash filter | ราคาบนการ์ดเปลี่ยนเป็นราคา @qty ผ่าน `unitPriceAt()` และเป็นค่าเริ่มต้นของ calculator ใน modal |

คำตอบทั้งหมดอยู่ใน hash จึงแชร์ลิงก์ได้ ปุ่ม "คัดลอกสรุป brief" สร้างข้อความสรุป (ให้ใคร/เพื่ออะไร/ระดับ/จำนวน/รายการ/ลิงก์/หมายเหตุราคาอ้างอิง) ลง clipboard — เป็น handoff ชั่วคราวก่อน P5 ส่งเข้า CRM

> Recipient relationship (7 ค่า) และ client-defined segment **ไม่เป็น filter สาธารณะ** — เป็นของลูกค้าตามหลัก P4 ใช้ในแบบฟอร์ม brief เท่านั้น

---

## 4. Lens B — หมวดหมู่สินค้ามาตรฐาน (standard lens)

### 4.1 หมวดหลัก (L1) และกลุ่มสินค้า (L2)

| # | L1 slug | ชื่อไทย | families (L2) | รุ่นผู้ผลิต* | ชุดที่มีชิ้นในหมวดนี้* | core PM |
|---|---|---|---|---:|---:|---|
| 1 | `drinkware` | แก้วน้ำและกระบอกน้ำ | drinkware | 95 | 705 | PM-TMB, PM-BOTTLE-LED, PM-CFMUG, PM-MUG-HEAT, PM-TEA-INF |
| 2 | `tech-gadgets` | เทคโนโลยีและแกดเจ็ต | power_bank, charger, usb_flash_drive, speaker, earbuds, earphone, headset, mouse, keyboard, smart_bracelet, car_accessory | 94 | 547 | PM-PB10K, PM-FLASH, PM-SPK |
| 3 | `stationery-office` | เครื่องเขียนและอุปกรณ์สำนักงาน | notebook, notebook_refill, pen, bookmark, name_card_holder, key_chain, lighter, desk_mat | 97 | 345 | PM-NB, PM-PEN, PM-DESK-MAT |
| 4 | `bags-travel` | กระเป๋าและการเดินทาง | bag, briefcase, umbrella | 30 | 330 | PM-UMB |
| 5 | `wellness-personal-care` | สุขภาพและการดูแลตัวเอง | neck_massager, massage_gun, massage_comb, fan, hair_dryer, humidifier, aroma_diffuser, nail_clipper, towel, glove | 57 | 365 | PM-MSG, PM-FAN, PM-AROMA |
| 6 | `home-living` | บ้านและไลฟ์สไตล์ | coffee_maker, cutlery | 4 | — | PM-CUTLERY |
| 7 | `gift-sets` | ชุดของขวัญ | (ค้นตาม "ชิ้นที่อยู่ในชุด") | — | 1,080 + 6 core | TDD03-2, TGC06-4, TMK0215, TWL01-8, XMAS-2026, NY-2027 |
| — | `unclassified` | ยังไม่จัดหมวด (ซ่อน) | — | 50 | 103 | — |

\* นับจาก `pricelist_master.json` (427 product_masters, 1,110 catalog_offers, `offer_product_links`) วันที่ 2026-09-07

### 4.2 กติกาการ derive (ห้ามพิมพ์หมวดด้วยมือ)

```
single  →  L1 = PRODUCT_FAMILIES[family].standard_category        (family ไม่รู้จัก → unclassified)
set     →  L1 = gift-sets ;  families = ∪ family ของทุกชิ้นในชุด   (ใช้เป็น facet "มี…ในชุด")
bundle  →  L1 = gift-sets ;  families = ∪ ของทุก offer ที่รวม
PM-*    →  family จากตาราง PM_FAMILY (ตรงกับ srp_reference_products.product_family)
```

การตัดสินใจที่ควรบันทึกเป็น ADR ฝั่ง business repo หากยอมรับ:

| การตัดสินใจ | เหตุผล |
|---|---|
| `fan` อยู่ wellness ไม่ใช่ tech | source_group ของ pipeline คือ `care_wellness`; ผู้ซื้อมองพัดลมพกพาเป็นของใช้ส่วนตัว |
| `desk_mat` (PM-DESK-MAT, PF-SMART-OFFICE) อยู่ stationery-office | ผู้ซื้อค้น "ของบนโต๊ะทำงาน" ไม่ใช่ "ที่ชาร์จ" แม้มีชาร์จไร้สาย |
| `PF-ECO-LIFESTYLE` แตกเป็น 2 family (fan / cutlery) | family ใน PM เป็น positioning ไม่ใช่ product type — ต้อง map ราย PM |
| `briefcase` อยู่ bags-travel แม้ source_group = office | เป็นกระเป๋าตามความเข้าใจทั่วไป |
| ไม่มี L1 "ของรักษ์โลก" | ECO เป็นธีม/claim ที่ต้องมีหลักฐาน (Taxonomy §7.6) ไม่ใช่ product type |

### 4.3 ชุดของขวัญ — ค้นตามองค์ประกอบ

การกระจายของชุด 1,080 รายการตามจำนวน family ที่มีในชุด: 2 families 329 · 3 families 329 · 4 families 143 · 5+ families 115 · 1 family 61 · ไม่มี link 103

คู่ที่พบบ่อยที่สุด (ใช้เป็น quick filter ในหน้า `gift-sets`):

| องค์ประกอบ | จำนวนชุด |
|---|---:|
| แก้วน้ำ + ร่ม | 49 |
| แก้วน้ำอย่างเดียว (หลายใบ) | 48 |
| แก้วน้ำ + พาวเวอร์แบงก์ | 39 |
| แก้วน้ำ + สมุด + ปากกา | 39 |
| แก้วน้ำ + พัดลม | 30 |
| สมุด + ปากกา | 29 |
| แก้วน้ำ + เครื่องนวดคอ | 26 |

UI: หน้า `#catalog/category/gift-sets` มี pill "มีในชุด: แก้วน้ำ · พาวเวอร์แบงก์ · ร่ม · สมุด/ปากกา · เครื่องนวด · พัดลม · ลำโพง" (7 family ที่พบ ≥ 120 ชุด) และเมื่ออยู่ในหน้า L1 อื่น (เช่น drinkware) มี toggle "รวมชุดที่มีแก้วน้ำ (705)"

---

## 5. Item model

ดู `CatalogItem` ใน `src/data/catalogTaxonomy.ts` — สรุปฟิลด์ที่ต้องมีต่อ `kind`

| ฟิลด์ | single | set | bundle | หมายเหตุ |
|---|:-:|:-:|:-:|---|
| `id` (`pm:` / `offer:` / `bundle:`) | ✓ | ✓ | ✓ | canonical id ตาม schema_genesisblock |
| `layer` core / supplier | ✓ | ✓ | core | core = PM ยืนยัน (16 + 6), supplier = 1,107 |
| `theme` | ✓ | ✓ | – | bundle ครอบหลายธีม |
| `tier` / `tier_eligibility` | eligibility | tier | tier per option | |
| `families` | 1 | ≥1 | ≥1 | |
| `standard_category` | derived | `gift-sets` | `gift-sets` | |
| `price_status`, `price_tiers` | 8 ขั้น (1…1000) | 3 ขั้น (10/50/100) | ยังไม่มี | supplier ส่วนใหญ่ `ask_for_quote` |
| `contains` / `used_in` | `used_in` | `contains` | `contains` (offers) | reverse BOM ให้ single บอกว่า "อยู่ในชุด TGC06-4" |
| `image_status` | ✓ | ✓ | ✓ | source_verified / generated_from_source / missing |
| `model3d_status` | draft จนกว่า owner_approved | – | – | |

**ฟิลด์ที่ห้ามมีใน item pool สาธารณะ:** `base_cost`, `factory_*`, `margin_*`, `landed_cost`, provenance ที่ชี้ไฟล์ลูกค้า (Zero-PII / PRODUCT.md)

---

## 6. Navigation, routes และ views

### 6.1 Hash routes (ต่อยอด router ใน `App.tsx` ที่วันนี้เช็คแค่ `#catalog`/`#bline` แบบตรงตัว → ต้องเปลี่ยนเป็น prefix match)

| Route | หน้า | Lens |
|---|---|---|
| `#catalog` | index Lens A: ให้ใคร → เพื่ออะไร → ระดับไหน + ชุด core | A |
| `#catalog/occasion/new-year` | ชุด/แพ็กเกจของโอกาสนั้น | A |
| `#catalog/tier/signature` | ทุกชุดที่ tier = Signature + singles ที่ eligible | A |
| `#catalog/theme/eco-friendly` | รายการในธีม (เท่ากับ filter เดิม) | A |
| `#catalog/category` | **index Lens B: 7 หมวดพร้อมตัวอย่าง 4 ชิ้น/หมวด** ("หน้าแคตตาล็อกมาตรฐาน") | B |
| `#catalog/category/tech-gadgets` | หมวดหลัก + pill L2 | B |
| `#catalog/category/tech-gadgets/power_bank` | กลุ่มสินค้า L2 | B |
| `#catalog/category/gift-sets?contains=drinkware,umbrella` | ชุดตามองค์ประกอบ | B |
| `#catalog/kind/single` · `/set` · `/bundle` | ตามรูปแบบ | ทั้งคู่ |
| `#catalog/item/PM-TMB` | modal เปิดตรงรายการ (deep link) | ทั้งคู่ |
| `#bline` | B—Line design partner (แยกจาก item pool) | — |
| `?view=list` · `?view=index` | สลับ view (default grid) | ทั้งคู่ |

`buildCatalogHash()` / `parseCatalogHash()` ใน taxonomy module เป็น contract ของ route นี้

### 6.2 การวาง lens ใน B—Line layout (ไม่ทำลาย Rule 1)

```
.bline-nav
  [← SMARTGIFT ARCHIVE]  B—LINE / SMARTGIFT   [ เริ่มจากผู้รับ | หมวดหมู่สินค้า ]   ...links ตาม lens...   [☀️/🌙]
                                              ^ segmented control 2 ปุ่ม (ใหม่)     ^ Lens A: 4 ธีม + 4 tier
                                                                                     ^ Lens B: 7 หมวด L1
.bline-hero            .bline-wordmark = "SmartGift"  (B—Line เฉพาะ #bline)
.bline-section-label   breadcrumb: "หมวดหมู่สินค้า / เทคโนโลยีและแกดเจ็ต / พาวเวอร์แบงก์ · 31 รายการ"
                       pills: L2 families ของ L1 ที่เลือก + [เดี่ยว|ชุด] + [🌐 3D] + [มีราคา] + view toggle
.bline-grid            การ์ด 4:3 เหมือนเดิม
```

### 6.3 View modes

| View | ใครใช้ | สิ่งที่แสดง |
|---|---|---|
| `grid` (default) | ทุกคน | `.bline-card` 4:3: ภาพ → ชื่อไทย → บรรทัดรอง (family · "เริ่ม ฿185 @1,000" หรือ "สอบถามราคา") · badge 3D/ชุด/ภาพสร้างสรรค์ |
| `list` | ผู้จัดซื้อ / ฝ่ายขาย | ตาราง: รหัส · ชื่อ · หมวด/กลุ่ม · ขนาด · น้ำหนัก · ราคา @10 / @100 / @1000 · MOQ · lead time · ภาพ (สถานะ) — ใช้ `overflow-x:auto`, `tabular-nums` |
| `index` | ผู้ที่ยังไม่รู้จะเริ่มจากไหน | ทุก L1 (หรือทุก tier ใน Lens A) แสดง 4 ชิ้นแรก + "ดูทั้งหมด (n)" |
| ค้นหา (`?q=`) | ทุกคน | ช่องค้นหาในแถบ section label ค้นทุก token ใน haystack (รหัส ชื่อไทย/อังกฤษ คำอธิบาย หมวด กลุ่ม + alias สี ชิ้นในชุด) ผลลัพธ์แสดงเป็น grid ข้าม lens; ถ้าไม่พบและยังไม่เปิด supplier จะชวนเปิด |

---

## 7. Card และ modal — กฎเนื้อหา

### 7.1 Card

| องค์ประกอบ | single | set / bundle |
|---|---|---|
| ภาพ | plate/ภาพต้นฉบับ; ถ้า `image_status = missing` ใช้ placeholder เทาอุ่นพร้อมชื่อ family (ไม่ใช้ภาพสินค้าคล้ายกัน) | ad creative / ภาพต้นฉบับชุด |
| บรรทัด 1 | `name_th` | `name_th` ของชุด |
| บรรทัด 2 | family · ราคาเริ่ม (best tier) หรือ "สอบถามราคา" | tier chip (Select/Signature…) · จำนวนชิ้น "3 ชิ้น" |
| chips | 3D (draft), client showcase | composition chips: 🥤 📓 🖊 (family icons, สูงสุด 4) |
| caption ภาพ | "ภาพต้นฉบับ" / "ภาพสร้างสรรค์จากภาพสินค้าอ้างอิง" | เหมือนกัน |

### 7.2 Modal (`.bline-modal-card` 2 คอลัมน์เดิม)

- **ซ้าย:** tabs `3D (draft)` / `ภาพ` / `Client showcase` เหมือนเดิม; สำหรับ set เพิ่ม tab `ในชุดประกอบด้วย` แสดง BOM เป็นภาพชิ้นย่อย (จาก PM ที่มีภาพ)
- **ขวา:** breadcrumb ทั้งสอง lens ("ธีม: เทคโนโลยีและการทำงาน · หมวด: เครื่องเขียนและอุปกรณ์สำนักงาน / สมุดโน้ต"), ชื่อไทย/อังกฤษ, สเปก (ขนาด/น้ำหนัก/lead time), **calculator ใช้ `unitPriceAt()`** — ถ้า `undefined` แสดง "สอบถามราคาสำหรับจำนวนนี้" ห้ามคำนวณจาก 0
- single แสดง "ใช้ในชุด: TGC06-4, TMK0215" (reverse BOM) → ลิงก์ไปชุด
- set แสดง unboxing_th (จาก SSOT) และ tier
- CTA: `ขอใบเสนอราคา` (แทน REQUEST B2B SPECIFICATION & QUOTE) — ส่ง code + qty + lens ที่มา ไปยัง brief form

---

## 8. Data pipeline: SSOT → item pool

```
business-01-smart-gift/data-pipeline/02_prepared/
   smartgift_catalog_master.json ─┐
   pricelist_master.json ─────────┼─►  scripts/build-catalog-items.mjs  (ใหม่)  ─►  src/data/catalogItems.generated.ts
   public/data/catalog_media.json ┘            │
                                               ├─ กรอง: ไม่เอา cost/margin/provenance ลูกค้า
                                               ├─ derive: families, standard_category, price_status, image_status, used_in
                                               └─ gate: supplier layer ผ่านเมื่อ image_status ≠ missing หรือ price_status = tiered
src/data/catalogTaxonomy.ts (มือ, เขียนแล้ว)  +  catalogItems.generated.ts (เครื่อง)  ─►  BLineCatalogSection
```

| ชั้น | แหล่ง | แสดงเป็น default | เงื่อนไข |
|---|---|---|---|
| Core singles (16) | `srp_reference_products` / `canonical_products` | ✓ | ราคา 8 ขั้นจาก SSOT เท่านั้น |
| Core sets (6) | `seasonal_offers` | ✓ | ราคา 3 ขั้น + BOM |
| Bundles (11 PKG) | `pkg` | เฉพาะ `quote_ready` (วันนี้ = 0) | แสดงเป็น "โครงแพ็กเกจ" ไม่มีราคา ถ้าจะโชว์ต้องติด "ยังไม่ยืนยันราคา" |
| Supplier singles (30) / sets (1,080) | `catalog_offers` + `offer_product_links` → `public/catalog/data/supplier-items.json` (216 รายการ) | ซ่อนหลัง toggle "แคตตาล็อกผู้ผลิต"; banner ชวนเปิดใน Lens B และตอนค้นหา | gate ในตัว generator: ภาพต้นฉบับ (152) หรือราคาอ้างอิง (107); `SUPPLIER_LAYER_META` ใน generated file ให้ UI แสดงจำนวนก่อนโหลด |

**ห้าม** import `pricelist_master.json` ทั้งไฟล์ (6.4 MB มี cost) เข้า bundle — generate เฉพาะฟิลด์สาธารณะ

---

## 9. Migration จากโครงสร้างปัจจุบัน

### 9.1 ความคลาดเคลื่อนที่พบวันนี้ (ต้องแก้ก่อน/พร้อม P1)

| รหัส | SRP ใน UI | SRP ใน SSOT |
|---|---:|---:|
| PM-CFMUG | 240 | 299 |
| PM-CUTLERY | 120 | 165 |
| PM-FLASH | 350 | 220 |
| PM-MSG | 790 | 850 |
| PM-MUG-HEAT | 420 | 350 |
| PM-NB | 650 | 750 |
| PM-PEN | 390 | 190 |
| PM-UMB | 280 | 250 |

อีก 8 รายการตรงกัน; `price_tiers` ใน UI เป็น 7 ขั้นแต่ SSOT เป็น 8 ขั้น (มี @20) → ให้ generated file แทนที่ทั้งชุด

เอกสาร `AGENTS.md` §5 และ `SITEMAP.md` §4 บรรยาย PM-TEA-SET, PM-SILK-FAN, PM-INCENSE, PM-WOOD-BOX, PM-DIFFUSER, PM-CANDLE, PM-SLEEP-SET, PM-CANVAS ซึ่ง **ไม่มีในโค้ดและไม่มีใน SSOT** → ต้องอัปเดตเอกสารให้ตรง 16 รหัสจริง

### 9.2 Phases

| Phase | งาน | ผลลัพธ์ |
|---|---|---|
| **P0 ✅** | `catalogTaxonomy.ts` + สเปกนี้ | vocabulary และ route contract ตกลงกันได้ |
| **P1 ✅** | `scripts/build-catalog-items.mjs` (`npm run build:catalog`) → `src/data/catalogItems.generated.ts` (core) + `public/catalog/data/supplier-items.json` (supplier, public-eligible); `catalogItems.ts` = pool; media แยกไว้ใน `coreMedia.ts`; `smartGiftCatalogData.ts` กลายเป็น adapter ไม่มีราคาพิมพ์มือ | ข้อมูลถูกต้อง 16 + 6 |
| **P2 ✅** | Lens toggle ใน `.bline-nav`, route prefix match ใน `App.tsx`, หน้า `#catalog/category` (index) และ L1/L2, view `list`, deep link `#catalog/item/<code>` | **ดูแบบหมวดหมู่มาตรฐานได้** |
| **P3 ✅** | Gifting brief 4 ข้อบน Lens A index (ให้ใคร→เพื่ออะไร→ระดับไหน→จำนวน) เก็บใน hash, ชุดที่เข้ากับโจทย์เรียงก่อน, composition chips บนการ์ดชุด, BOM/reverse BOM ใน modal, brief แนบใน modal + คัดลอกสรุป | ขายเป็น "ชุด" ได้ |
| **P4 ✅** | Supplier layer หลัง pill "แคตตาล็อกผู้ผลิต (216)" — lazy fetch, gate = ภาพต้นฉบับหรือราคาอ้างอิง (894 รายการยังไม่ผ่าน), banner แนะนำใน Lens B และตอนค้นหา, section "จากแคตตาล็อกผู้ผลิต" ใน Lens A, ช่องค้นหา `?q=` ครอบคลุมรหัส/ชื่อ/กลุ่มสินค้า/alias/สี/ส่วนประกอบ, ป้าย "ภาพสร้างสรรค์" บนการ์ด, สีจาก description, หมายเหตุราคาอ้างอิงยังไม่ยืนยันใน modal | ใช้ catalog 1,110 รายการที่มีอยู่ |
| **P5 ✅ (client side)** | Bundle builder ที่ `#catalog/bundle[/<PKG>]` ใช้ 11 PKG + 2 blueprint เป็น *แม่แบบโครงสร้าง* (ไม่มีราคาแพ็กเกจที่อนุมัติ จึงคิดราคาอ้างอิงจากขั้นจำนวนของชุด core สด ๆ), กลุ่มผู้รับเก็บใน `?g=`, BOM รวมทั้งแพ็กเกจ; brief form (ชื่อ/บริษัท/อีเมล/โทร/หมายเหตุ) ส่งผ่าน webhook `VITE_BRIEF_ENDPOINT` → mailto `VITE_SALES_EMAIL` → clipboard ตาม contract §11 | ปิด loop ขอใบเสนอราคาฝั่งเว็บ; ฝั่ง CRM ต้องเปิด endpoint ตาม CR |

---

## 11. Brief intake contract (P5) — `smartgift-brief/1`

ฝั่งเว็บส่ง JSON นี้ไปยัง `VITE_BRIEF_ENDPOINT` (POST, `Content-Type: application/json`) ถ้าตั้งค่าไว้; ถ้าไม่ตั้งค่าหรือส่งไม่สำเร็จจะเปิดอีเมลถึง `VITE_SALES_EMAIL` แล้วจึงคัดลอกลง clipboard เป็นทางสุดท้าย (`src/data/briefSubmit.ts`) ข้อมูลติดต่อไม่ถูกเก็บในหน้าเว็บ (Zero-PII นอก CRM)

```jsonc
{
  "schema": "smartgift-brief/1",
  "submitted_at": "2026-09-07T12:00:00.000Z",
  "source": "web-ui-smg",
  "page_url": "https://…/#catalog/item/TGC06-4?recipient=TEAM&occasion=new-year&tier=select&qty=100",
  "brief": { "recipient": "TEAM", "occasion": "new-year", "tier": "select", "qty": 100 },
  "lines": [ { "code": "TGC06-4", "name_th": "…", "kind": "set", "tier": "Signature", "qty": 100, "unit_price": 820, "total": 82000, "price_status": "reference" } ],
  "bundle": { "template": "PKG-NY-2027-CORP-MIX", "groups": [ /* BriefLine ต่อกลุ่มผู้รับ พร้อม label/tier/qty */ ], "recipients": 35, "total_reference": 46250 },
  "contact": { "name": "…", "company": "…", "email": "…", "phone": "…", "note": "…" },
  "notes": [ "ราคาเป็นราคาอ้างอิงตามขั้นจำนวน ยังไม่รวม VAT ค่าส่ง และงานพิมพ์ ยืนยันในใบเสนอราคา" ]
}
```

| ฟิลด์ | ความหมาย | ที่มา |
|---|---|---|
| `brief.recipient` | รหัส Recipient Relationship (7 ค่า) — ผู้ซื้อเลือกเอง ไม่ใช่ SmartGift เดา | `RECIPIENT_RELATIONSHIPS` |
| `brief.occasion` / `tier` / `qty` | คำตอบ brief อีก 3 ข้อ | hash filters |
| `lines[]` | รายการเดี่ยว/ชุดที่ขอราคา พร้อมราคาอ้างอิง ณ จำนวนนั้น (`price_status: reference`) หรือ `ask_for_quote` | `unitPriceAt()` |
| `bundle` | แพ็กเกจหลายระดับจาก builder: แม่แบบ (PKG/blueprint), กลุ่มผู้รับ, ผู้รับรวม, ราคาอ้างอิงรวม | `BundleBuilder` |
| `contact` | ผู้ติดต่อ — ต้องมีชื่อ + อีเมลหรือโทร | ฟอร์มใน `BriefSubmitPanel` |

**สิ่งที่ฝั่ง zuri-ai ต้องทำ (นอก repo นี้):** ประกาศ `FR-xxx` + CR สำหรับ route รับ brief (ตาม cross-repo protocol ใน AGENTS.md ของ business repo), map `brief.recipient` → `seg:` ของลูกค้าใน Campaign Recipient Matrix, และเก็บ `contact` ใน CRM domain ที่มี consent control เท่านั้น

---

## 10. Acceptance criteria

- [ ] ผู้ใช้เปิด `#catalog/category` แล้วเห็น 7 หมวดมาตรฐานพร้อมจำนวนรายการ และเข้าถึงกลุ่มสินค้า L2 ได้ภายใน 2 คลิก
- [ ] รายการเดียวกันปรากฏในทั้ง Lens A และ Lens B ด้วย `id` เดียวกัน และ modal เดียวกัน
- [ ] ไม่มีรายการใดแสดงราคา 0 หรือราคาที่ไม่มีใน SSOT; รายการ `ask_for_quote` แสดง "สอบถามราคา"
- [ ] ชุดของขวัญค้นตาม "มีในชุด" ได้ และ single แสดง "ใช้ในชุด"
- [ ] ทุกภาพมี caption สถานะ (ต้นฉบับ / สร้างสรรค์ / ไม่มีภาพ) และ 3D ที่ยังไม่ approve ติด "draft"
- [ ] `.bline-*` classes และ `.bline-page-wrapper` isolation คงเดิม (Rule 1, Rule 2); `src/data/` ไม่ import จาก components (Rule 3)
- [ ] deep link `#catalog/item/<code>` เปิด modal ตรงรายการ และ back button ปิด modal
- [ ] คีย์บอร์ดใช้งานได้ครบ (lens toggle, pills, card, modal) และ `prefers-reduced-motion` ปิด auto-rotate ของ model-viewer

---

## CHANGELOG

| Version | Date | Summary | Agent |
|---|---|---|---|
| 1.4.0 | 2026-09-07 | P5: bundle builder from PKG/blueprint templates, brief submit (webhook → mailto → clipboard), smartgift-brief/1 contract §11 | Claude |
| 1.3.0 | 2026-09-07 | P4: supplier layer surfaced (banner, Lens A section, meta counts), search `?q=`, image tags, colors, reference-price note | Claude |
| 1.2.0 | 2026-09-07 | P3: gifting brief (recipient/occasion/tier/qty in hash), recommended sets, set composition chips, brief handoff via clipboard | Claude |
| 1.1.0 | 2026-09-07 | P1+P2 implemented: generator, item pool, lens toggle, routes, index/L1/L2, list view, deep links, supplier preview toggle | Claude |
| 1.0.0 | 2026-09-07 | โครงสร้าง two-lens; ตาราง L1/L2 พร้อมจำนวนจาก pricelist_master; กติกา derive; item model; routes/views; pipeline; migration + ความคลาดเคลื่อนราคา 8 รายการ | Claude |
