# HERO VIDEO — BRAND DIRECTION & STORYBOARD
**Project:** SmartGift Web UI (`web-ui-smg`)  
**Companion to:** [`docs/HERO-VIDEO-SPEC.md`](HERO-VIDEO-SPEC.md) (กลไก scrub, encoding, ffmpeg) — เอกสารนี้เป็นชั้น *creative direction* ที่วางทับสเปกทางเทคนิค  
**Sources analysed:** `business-01-smart-gift/data-pipeline/02_prepared/*.json`, `output/pdf/smartgift-catalog-adcreative-proof-v0.2.pdf`, `PRODUCT.md`, `docs/business/*`, `logo-smg.jpg`  
**Version:** `1.5.1b` · **Date:** 2026-09-07 · **Status:** draft — tall gift-box previews in §12.9 plus exterior gold-foil material revision in §12.10; deployed v3 remains unchanged

---

## 0. สรุปสำหรับผู้ตัดสินใจ

1. **แบรนด์คือ "ของขวัญที่เริ่มจากผู้รับ"** ไม่ใช่ fashion archive — hero ปัจจุบัน (นางแบบ streetwear, rim light สีฟ้า cyan, gallery เป็นเฟอร์นิเจอร์ B—Line) มาจากเทมเพลตเดิม ไม่ได้สะท้อน SmartGift เลย
2. **แนวคิดที่เสนอ: "แกนของการให้" (The Giving Axis)** — ตำแหน่งเมาส์คือแกนเรื่อง: เลื่อนซ้าย = *คนรับ* (มือรับกล่อง), เลื่อนขวา = *ของ* (ฝาเปิด เผยของในชุด) โดยเฟรมแรกของทั้งสองคลิปเป็นภาพเดียวกัน (กล่องปิดวางบนพื้นหิน) เพื่อให้ข้าม deadzone กลางจอได้โดยไม่กระตุก
3. **โทนสีต้องเป็นของ SmartGift:** ส้มแบรนด์ + ทองเหลือง + ไอวอรี บนพื้น charcoal อุ่น — ตัด cyan/blue neon ออกจาก prompt ทั้งหมด
4. **ของในวิดีโอต้องเป็นสินค้าจริงในแคตตาล็อก** (ตามหลัก PRODUCT.md) — ใช้ภาพ ad creative ที่ผ่าน edit-target แล้ว (เช่น `FXD66-3-adcreative-v1.png`) เป็นเฟรมตั้งต้นของ image-to-video หรือ render จาก digital twin `.glb` และติดป้าย "ภาพสร้างสรรค์จากภาพสินค้าอ้างอิง" เหมือนใน PDF
5. เสนอ 3 preset ใหม่ (SG-1 Unboxing Axis, SG-2 Tier Ladder, SG-3 Twin Orbit) แทน Preset A/B/C เดิม ส่วน Preset C (B—Line) ให้ย้ายไปใช้เฉพาะ section B—Line

---

## 1. สิ่งที่แบรนด์บอกเรา (Brand findings)

### 1.1 ตำแหน่งทางการตลาดและภาษา

| แหล่ง | สาระที่ต้องสะท้อนใน hero |
|---|---|
| Portfolio Architecture (SG-BPPA-001) | Positioning: **"SmartGift — เริ่มจากคนรับ ไม่ใช่เริ่มจากของ"** / *Right gift. Right people. Right quantity.* |
| Logo (`logo-smg.jpg`) | Tagline บนโลโก้: **"The Right Gift. The Right Impact."** — กล่องส้ม + โบว์ทอง + ตัวอักษร S/G |
| Creative proof PDF (12 หน้า) | Headline "ของขวัญที่เริ่มจากผู้รับ", ระบบ 4 Tier (Reach / Select / Signature / Bespoke) และ "The Art of Unboxing: มองเห็น → เปิดสัมผัส → ค้นพบ" |
| GTM plan | 3 use case หลัก: Customer & Member Appreciation, Launch/Event with Media, Employee Welcome & Recognition |
| PRODUCT.md | บุคลิก: *ชัดเจน พิถีพิถัน ตรงไปตรงมา* · ห้ามใช้ภาพ AI ที่ไม่ได้อ้างอิงสินค้าจริง · ห้ามแต่งราคา · รองรับ reduced motion |

### 1.2 อัตลักษณ์ภาพที่มีอยู่แล้ว (ต้องใช้ ไม่ต้องคิดใหม่)

| องค์ประกอบ | ค่าที่พบ | ที่มา |
|---|---|---|
| ส้มแบรนด์ | `#F26522` (กล่องในโลโก้ และกล่อง FXD66-3 ใน ad creative) | logo, PDF p.4 |
| ทองเหลือง / โบว์ | `#C79A5B` (dim `#7A6238`) | logo, `hero-portfolio.html` tokens |
| น้ำตาลเทา (ตัวอักษร SMART) | `#6B5B4E` | logo |
| ไอวอรี / หินอุ่น | `#F1ECE3` – `#EFE9DE` (พื้นหลังทุกหน้าใน PDF) | PDF |
| หมึกเข้ม (headline ไทยใน PDF) | `#1F3A3D` (เขียวเข้มอมเทา) | PDF p.2, p.3 |
| พื้นมืดที่ใช้แล้ว | `#0F1416` press-room + brass accent | `hero-portfolio.html` |
| แสง | window light เฉียงจากซ้ายบน มีเงาช่องหน้าต่างพาดบนพื้นหิน, เงานุ่ม, ไม่มี flare | ad creative ทั้ง 4 ชุด |
| มุมกล้อง | top-down / near top-down ของกล่องเปิดฝา (flat lay) ที่จัดของแบบ "อ่านได้" | ad creative |
| ตัวอักษร | Thai display: Anuphan / IBM Plex Sans Thai · label: IBM Plex Mono ตัวพิมพ์ใหญ่ tracking กว้าง | `hero-portfolio.html` |

**ข้อสรุป:** โลกภาพของ SmartGift คือ *"press-room อุ่น"* — วัตถุจริงบนพื้นหิน แสงหน้าต่าง โทนส้ม/ทอง/ไอวอรี — ไม่ใช่ *"obsidian void + cyan rim"* ตาม Preset A/B ใน HERO-VIDEO-SPEC §6

### 1.3 ช่องว่างใน hero ปัจจุบัน (`src/App.tsx`, `src/config/mediaConfig.ts`)

| จุด | ปัญหา | ผลกระทบต่อแบรนด์ |
|---|---|---|
| วิดีโอทั้งสอง (CloudFront) | นางแบบ streetwear ตาม Preset A | ผู้ซื้อ B2B ไม่รู้ว่านี่คือของขวัญองค์กร |
| `#outro-info` | "ARCHIVE COLLECTION 'SMARTGIFT' · **5,500 ฿**" | ราคาสมมติ ผิดหลัก "ไม่แต่งราคา" |
| Header `[ CART ]` | flow แบบ retail | SmartGift ขายผ่านใบเสนอราคา ไม่มีตะกร้า |
| Gallery 10 ภาพ (`galleryUrls`) | เฟอร์นิเจอร์ B—Line จาก higgs.ai | ไม่ใช่สินค้า SmartGift |
| Font `Inter Tight` + accent `#00f2fe` | ภาษาภาพของเทมเพลต | ขัดกับ brass/orange ของแบรนด์ |
| `mediaConfig.ts` คำอธิบาย slot | เขียนว่า `videoLeft` เล่นเมื่อเมาส์อยู่ **ซ้าย** แต่โค้ดแสดง `videoLeft` เมื่อเมาส์อยู่ **ขวา** (`active === 'left'` เมื่อ `clientX > center + dead`) | คนอัปโหลดวิดีโอจะสลับข้างผิด — ดู §3.2 |

---

## 2. แนวคิดหลัก: "แกนของการให้" (The Giving Axis)

> เมาส์ไม่ได้แค่ scrub วิดีโอ — มันเลื่อนผู้ชมไปมาระหว่าง **คนรับ** กับ **ของ** ซึ่งคือประโยคเดียวกับ positioning ของแบรนด์

```
   ◀── mouse ซ้าย: "คนรับ" ──┤  deadzone  ├── mouse ขวา: "ของ" ──▶
   มือรับกล่อง / ยกฝาเล็กน้อย   │ กล่องปิด    │ ฝาเลื่อนออก เผยของทั้งชุด
   กล้อง crane ลงมุมต่ำ 3/4    │ top-down   │ กล้อง push-in ช้า ๆ
   progress 0 ──────────► 1   │  (t = 0)   │ progress 0 ──────────► 1
```

### 2.1 กฎ "เฟรมแรกร่วม" (Shared rest frame) — กฎที่สำคัญที่สุด

จากสมการใน `App.tsx`: `progress` เท่ากับ 0 ที่ขอบ deadzone **ทั้งสองข้าง** และวิ่งไป 1 ที่ขอบจอ ดังนั้น

- `t = 0` ของคลิปทั้งสองต้องเป็น **ภาพเดียวกันทุกพิกเซล** (กล่องปิด มุม top-down บนพื้นหิน)
- เมื่อเมาส์ข้ามกลางจอ ภาพจะ "หยุดนิ่ง" ที่เฟรมร่วมนี้ ไม่กระโดด
- นี่คือเหตุผลที่ต้องสร้างคลิปด้วย **image-to-video จากภาพตั้งต้นภาพเดียวกัน** (§5) ไม่ใช่ text-to-video สองครั้ง
- Poster ของ `<video>` ควรเป็นเฟรมร่วมนี้ด้วย (ปัจจุบัน `<video>` ยังไม่มี `poster`)

### 2.2 ทำไมทิศทางนี้ถึงตรงกับกลไกในสเปกเดิม

| กฎใน HERO-VIDEO-SPEC §5.1 | วิธีที่แนวคิดนี้ตอบ |
|---|---|
| Single continuous take | แต่ละคลิปคือ take เดียว จากกล่องปิด → เปิด / จากกล่องปิด → มือรับ |
| Linear unidirectional motion | ฝาเลื่อนทางเดียว, crane ทางเดียว, push-in ทางเดียว |
| Complementary L/R pairs | คู่กันในเชิงเรื่อง (คนรับ ↔ ของ) และในเชิงกล้อง (crane ลง ↔ push-in) |
| Dark minimalist studio | ใช้ **charcoal อุ่น** `#16130F` ไม่ใช่ `#000000` (ดู §4) |
| Slow motion & stabilized | ความเร็วคงที่ ≤ 1/3 ของความกว้างเฟรมต่อวินาที |

---

## 3. Storyboard — Preset SG-1 "Unboxing Axis" (flagship)

### 3.1 เฟรมตั้งต้นร่วม (Frame 0)

- **วัตถุ:** กล่องของขวัญ SmartGift ฝาปิด สีส้มแบรนด์ `#F26522` ขอบฝาสีไอวอรีบาง ๆ (ตามกล่อง FXD66-3) วางกลางเฟรมค่อนไปทางขวา 60% (เว้นซ้าย 40% ให้ headline HTML)
- **พื้น:** หินอุ่น/ปูนขัดสีทราย มีเงาช่องหน้าต่างพาดเฉียง (signature ของ ad creative)
- **มุมกล้อง:** top-down เอียง 8–10° (near top-down เดียวกับ PDF p.4)
- **แสง:** key นุ่มจากซ้ายบน, fill อุ่น, rim ทองเหลืองบาง ๆ ที่ขอบกล่อง
- **ไม่มี** ข้อความ โลโก้ มือ หรือ prop อื่นในเฟรมนี้

### 3.2 การ map คลิปเข้ากับ slot (อ้างอิงโค้ดจริง ไม่ใช่ชื่อ slot)

| ชื่อในเอกสารนี้ | เล่นเมื่อเมาส์อยู่ | slot ใน `mediaConfig` ที่ต้องใส่ | ไฟล์ที่เสนอ |
|---|---|---|---|
| **Clip W (west) — "คนรับ"** | ครึ่ง**ซ้าย**ของจอ | `videoRightUrl` | `/assets/videos/hero_west_receive.mp4` |
| **Clip E (east) — "ของ"** | ครึ่ง**ขวา**ของจอ | `videoLeftUrl` | `/assets/videos/hero_east_discover.mp4` |

> ควรแก้ `description` ของ `VIDEO_SLOTS` ใน `mediaConfig.ts` ให้ตรงกับโค้ด หรือดีกว่านั้นคือ rename slot เป็น `videoWestUrl` / `videoEastUrl` ในรอบ implement

### 3.3 Timeline (4.0 s · 30 fps · 120 เฟรม · I-frame ทุก 15 เฟรม)

| progress | t | Clip W — คนรับ (mouse ซ้าย) | Clip E — ของ (mouse ขวา) |
|---|---|---|---|
| 0.00 | 0.0 s | **Frame 0 ร่วม** | **Frame 0 ร่วม** |
| 0.25 | 1.0 s | กล้องเริ่ม crane ลง (90°→70°) มือคู่หนึ่งเข้าจากขอบล่าง | ฝาเริ่มเลื่อนออกทางขวา 20% เผยขอบไอวอรีด้านใน |
| 0.50 | 2.0 s | crane ถึง 45°, มือแตะข้างกล่อง เงามือทาบพื้น | ฝาออก 60%, เห็นทัมเบลอร์ไอวอรีและพาวเวอร์แบงก์ส้ม |
| 0.75 | 3.0 s | crane ถึง 25°, ปลายนิ้วยกฝาขึ้น 2–3 ซม. แสงทองลอดใต้ฝา | ฝาออก 100% (หลุดเฟรม), กล้อง push-in 10% เห็นครบ 3 ชิ้น |
| 1.00 | 4.0 s | มุม 3/4 ต่ำ กล่องปิดอยู่ในมือ — **ยังไม่เห็นของ** | flat lay สมบูรณ์เหมือน PDF p.4 (จบที่ภาพ ad creative ที่ approve แล้ว) |

**เจตนา:** ฝั่ง "คนรับ" ไม่เผยของเลย (ความรู้สึกมาก่อน — "ก่อนเห็นของ ก็เริ่มรู้สึกแล้ว" PDF p.10) ส่วนฝั่ง "ของ" จบที่ภาพที่ลูกค้าจะเจอในแคตตาล็อกจริง ทำให้ CTA `EXPLORE CATALOG →` ต่อเนื่องทางภาพ

### 3.4 Copy overlay (HTML ไม่ใช่ใน pixel ของวิดีโอ — negative prompt ห้าม text)

```
eyebrow   CORPORATE GIFT PORTFOLIO  /  RECIPIENT-FIRST          (mono, brass, tracking 0.14em)
headline  ของขวัญที่เริ่มจากผู้รับ                                (Anuphan 700, ivory, clamp(2.9rem, 7.2vw, 6.4rem))
subline   Right gift. Right people. Right quantity.              (IBM Plex Sans Thai 400, ink-2)
scrub hint ◀ คนรับ        ·        ของ ▶                          (mono, muted; ซ่อนบน touch)
footnote  ภาพสร้างสรรค์จากภาพสินค้าอ้างอิง · โปรดยืนยันรายละเอียดก่อนสั่งผลิต  (เหมือน PDF)
CTA       EXPLORE CATALOG →  (คงไว้)   ·   ขอใบเสนอราคา  (แทน [ CART ])
```

`#outro-info` ให้เปลี่ยนจาก "ARCHIVE COLLECTION / 5,500 ฿" เป็น "4 GIFT TIERS · 16 CORE PRODUCTS · MOQ 10" (ตัวเลขจาก SSOT เท่านั้น)

---

## 4. Visual specification (ใช้กับทุก preset)

| พารามิเตอร์ | ค่า | เหตุผล |
|---|---|---|
| Ground (dark, default) | `#16130F` → gradient `#241E17` ที่ขอบบน | charcoal อุ่น กลืนกับหน้า archive สีดำ แต่ไม่เย็นเหมือน `#000` |
| Ground (light, ทางเลือกสำหรับ light theme ของ catalog) | `#EFE9DE` หินอุ่น | ต่อเนื่องกับ PDF |
| Product accent | `#F26522` ส้มแบรนด์ (กล่อง) | brand recall สูงสุดในเฟรมเดียว |
| Rim / hardware | `#C79A5B` ทองเหลือง | โบว์ในโลโก้, brass token ที่มีอยู่ |
| Highlights | `#F1ECE3` ไอวอรี | ทัมเบลอร์, ฝาด้านใน |
| Key light | soft box 1.2 m จากซ้ายบน 45°, CT 4300K, มี gobo ช่องหน้าต่าง | signature ของ ad creative |
| Rim light | strip ทองอุ่น 3200K จากขวาหลัง ความเข้ม 30% ของ key | แทน cyan rim ในสเปกเดิม |
| เลนส์ / DoF | 50 mm eq., f/5.6 look, โฟกัสที่กล่องตลอด | ไม่ใช้ bokeh ballsเพราะดู "AI" |
| ความเร็วกล้อง | ≤ 0.33 frame-width/s, ease none (linear) | scrub ตอบสนองเมาส์แบบ 1:1 |
| Materials | matte lacquer (กล่อง), ribbed ivory steel (ทัมเบลอร์), soft-touch plastic (พาวเวอร์แบงก์) | ตรงกับสินค้าจริง |
| ห้าม | cyan/blue light, neon, fashion model, ใบหน้า, glass glare, lens flare, confetti, ข้อความ, โลโก้ปลอม | brand + สเปกเดิม §5.2 |

**Negative prompt (ต่อท้ายทุก prompt — ขยายจากสเปก §5.2):**

```text
cuts, jump cuts, montage, transitions, camera shake, handheld, fast jerky movement, flicker, sudden stop, text, watermark, logo overlay, bright white background, blurry, low resolution, cyan rim light, blue neon, cold white light, fashion model, human face, glossy black void, lens flare, bokeh balls, confetti, extra products, duplicated objects, invented labels
```

---

## 5. Production pipeline (ปรับจาก HERO-VIDEO-SPEC §4 ให้ product-faithful)

```
[1] เฟรมตั้งต้นร่วม  ←  edit-target จาก ad creative ที่ approve แล้ว (ไม่ใช่ text-to-image)
        FXD66-3-adcreative-v1.png  --targeted edit "ปิดฝา"-->  frame0_closed.png (1920×1080)
[2] image-to-video ×2 (Clip W, Clip E) จาก frame0_closed.png ภาพเดียวกัน  →  raw_W.mp4, raw_E.mp4 (5 s)
[3] ffmpeg (สเปก §4) + ตัดเหลือ 4.0 s  →  hero_west_receive.mp4, hero_east_discover.mp4
[4] Frame-0 parity check + keyframe check  (§5.2)
[5] วางไฟล์ public/assets/videos/, อัปเดต DEFAULT_MEDIA_CONFIG, ใส่ poster = frame0_closed.jpg
[6] ติดป้าย media readiness = client-ready → public-approved (taxonomy §9) ก่อน deploy
```

### 5.1 ffmpeg (เพิ่ม `-t 4` และ poster จากสเปกเดิม)

```bash
ffmpeg -i raw_E.mp4 -t 4 \
  -vf "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080" \
  -c:v libx264 -preset slow -crf 20 -g 15 -keyint_min 15 -sc_threshold 0 \
  -pix_fmt yuv420p -an -movflags +faststart hero_east_discover.mp4
```

```bash
ffmpeg -i hero_east_discover.mp4 -vframes 1 -q:v 2 frame0_east.jpg
```

### 5.2 Verification (เพิ่มจาก checklist §8 ของสเปกเดิม)

```bash
ffprobe -v error -select_streams v:0 -show_entries frame=pict_type -of csv=p=0 hero_east_discover.mp4 | grep -c I
```
ต้องได้ ≥ 8 (120 เฟรม / 15)

```bash
python -c "from PIL import Image, ImageChops; a=Image.open('frame0_west.jpg'); b=Image.open('frame0_east.jpg'); d=ImageChops.difference(a,b).convert('L'); h=d.histogram(); print(sum(i*v for i,v in enumerate(h))/sum(h))"
```
ค่าเฉลี่ยความต่างต้อง < 3.0 (จาก 255) มิฉะนั้นเฟรมร่วมไม่ตรงกัน

- [ ] ทั้งสองคลิปยาว 4.0 s ± 0.05, 30 fps CFR, ไม่มี audio
- [ ] ไม่มีสีในช่วง hue 180–220° (cyan/blue) เกิน 1% ของพิกเซล
- [ ] ผลิตภัณฑ์ในเฟรมสุดท้ายของ Clip E ตรงกับ `FXD66-3-adcreative-v1.png` (จำนวน 3 ชิ้น สี รูปทรง)
- [ ] มีคำว่า "ภาพสร้างสรรค์จากภาพสินค้าอ้างอิง" บนหน้า hero
- [ ] Touch/reduced-motion: เล่นสลับ W→E→W และแสดง poster ก่อนโหลด

---

## 6. Prompt library (ready to deploy — ใช้กับ image-to-video ที่รับเฟรมตั้งต้น)

### Preset SG-1 · Unboxing Axis (flagship)

**Clip W — "คนรับ" → slot `videoRightUrl`**
```text
Image-to-video, the provided frame is the exact first frame. A single continuous take. A closed SmartGift-orange lacquered gift box with a thin ivory lid edge rests on a warm sand-stone surface under soft directional window light with slatted shadows. The camera cranes down slowly and linearly from a near top-down view to a low three-quarter angle. As it descends, a pair of hands in a plain charcoal sleeve enters from the bottom edge, rests on the box, and lifts the lid only two centimetres so a warm brass-toned glow escapes underneath; the contents stay hidden. Constant velocity, no ease, 4 seconds, 30 fps, photoreal, warm charcoal studio ground, matte materials, no text.
```

**Clip E — "ของ" → slot `videoLeftUrl`**
```text
Image-to-video, the provided frame is the exact first frame. A single continuous take, near top-down. The ivory-edged lid of the SmartGift-orange gift box slides straight to the right at constant speed and exits the frame, revealing an ivory ribbed insulated tumbler with a brown lid and hanging pale strap, a bright orange power bank with a small black display strip, and a white foldable handheld fan with a circular grille, arranged in one row in a white inset. The camera pushes in ten percent while the lid moves. Soft window light with slatted shadows, warm brass rim light, crisp product edges, no added products, no text. 4 seconds, 30 fps, photoreal.
```

### Preset SG-2 · Tier Ladder (ใช้เมื่อต้องการสื่อ 4 ระดับการดูแล)

เฟรมร่วม = กล้องอยู่กึ่งกลางระหว่างกล่อง Select และ Signature; กล่อง 4 ใบเรียงซ้าย→ขวา: **Reach** (กล่อง kraft 12 ใบซ้อน) · **Select** (กล่องไอวอรี) · **Signature** (กล่องดำขอบทองเหลือง) · **Bespoke** (กล่องส้มเปิดฝา มีการ์ดเปล่า)

**Clip W → `videoRightUrl`** (dolly ไปทาง Reach)
```text
Image-to-video, provided frame is the exact first frame. Single continuous lateral dolly moving LEFT at constant speed along a warm sand-stone table under slatted window light. The camera passes an ivory gift box and settles on a neat stack of twelve small kraft gift boxes with brass-toned bands. Eye-level, 50 mm look, shallow but readable depth of field, warm charcoal background, no people, no text, 4 seconds, 30 fps, photoreal.
```

**Clip E → `videoLeftUrl`** (dolly ไปทาง Bespoke)
```text
Image-to-video, provided frame is the exact first frame. Single continuous lateral dolly moving RIGHT at constant speed along the same warm sand-stone table. The camera passes a black gift box with a brass edge and settles on a single open SmartGift-orange box whose lid leans against it, an unmarked ivory card inside, brass rim light on the edges. Eye-level, 50 mm look, warm charcoal background, no people, no text, 4 seconds, 30 fps, photoreal.
```

### Preset SG-3 · Twin Orbit (render จาก `.glb` — ไม่ใช้ AI)

ใช้กับ hero ของ theme/category page (เช่น `PM-BOTTLE-LED`, `PM-NB`) เพราะ product-faithful 100%

| พารามิเตอร์ | ค่า |
|---|---|
| Renderer | Blender 4.x Cycles หรือ three.js + `EffectComposer` บันทึกผ่าน `MediaRecorder` |
| Frame 0 ร่วม | มุมหน้าตรง azimuth 0°, elevation 12° |
| Clip W | orbit azimuth 0° → **−90°** ใน 4 s (linear) |
| Clip E | orbit azimuth 0° → **+90°** ใน 4 s (linear) |
| Environment | HDRI studio อุ่น 4300K, ground `#16130F`, brass rim light key/2 |
| Output | 1920×1080, 30 fps PNG sequence → ffmpeg §5.1 |
| เงื่อนไข | ใช้ได้เมื่อ `.glb` ผ่าน owner_approved ใน `output/catalog-3d/category_coverage_report.json` (ปัจจุบันทั้ง 16 ยัง `held`) |

### Theme B-roll (ไม่ scrub — ใช้เป็นแบนเนอร์หัว category ใน catalog)

| Theme | ภาพ 4 s ต่อเนื่อง | ของที่ใช้ (ต้องมีใน SSOT) |
|---|---|---|
| รักษ์โลก | ทัมเบลอร์ SUS316 + ร่มพับ บนพื้นหินอ่อนเขียวเทา แสงเช้า | PM-TMB, PM-UMB |
| ศิลปะและวัฒนธรรม | ปากกาไม้วอลนัท + กระบอกชงชาแก้ว บนผ้าไหมสีชา | PM-PEN, PM-TEA-INF |
| ไลฟ์สไตล์และดูแลตัวเอง | เครื่องกระจายกลิ่นเปลวไฟ + แก้วกาแฟ 3-way ในแสงเย็น | PM-AROMA, PM-CFMUG |
| เทคโนโลยีและการทำงาน | สมุดพาวเวอร์แบงก์ + MagSafe power bank บนโต๊ะดำ | PM-NB, PM-PB10K |

---

## 7. Mobile / reduced-motion

- คง fallback สลับเล่น W → E → W ตามสเปก §2.3 แต่ **เริ่มที่ Clip E** (ของ) เพราะบนมือถือไม่มี "แกน" ให้เลื่อน — ผู้ชมควรเห็นสินค้าก่อน
- `prefers-reduced-motion`: แสดง poster (เฟรมร่วม) นิ่ง + copy overlay เท่านั้น ไม่ autoplay
- Poster ต้องเป็น JPG ≤ 180 KB จากเฟรมร่วม เพื่อให้ LCP ไม่รอวิดีโอ

---

## 8. สิ่งที่ต้องเปลี่ยนในโค้ดเมื่อ implement (นอกขอบเขตเอกสารนี้)

| ไฟล์ | การเปลี่ยน |
|---|---|
| `src/config/mediaConfig.ts` | default videos → `/assets/videos/hero_*.mp4`, เพิ่ม `posterUrl`, แก้/rename คำอธิบาย slot ให้ตรงโค้ด (§3.2) |
| `src/App.tsx` | เพิ่ม `poster`, copy overlay §3.4, ลบ "5,500 ฿" และ `[ CART ]`, เริ่ม touch loop ที่ Clip E |
| `index.html` | โหลด `Anuphan` + `IBM Plex Sans Thai` + `IBM Plex Mono` แทน/เพิ่มจาก `Inter Tight` |
| `src/index.css` | tokens `--brass`, `--sg-orange`, `--ivory`, `--ground-warm`; ลบ accent `#00f2fe` ออกจาก hero |
| `DEFAULT_MEDIA_CONFIG.galleryUrls` | เปลี่ยน 10 ภาพเป็น ad creative 4 ชุด + client mockup ที่ verified (`/assets/smartgift/mockups/*`) — gallery card ปัจจุบันเป็น 2:3 แต่ ad creative เป็น 3:2 ต้องปรับ ratio ของ `.bp-card` หรือ crop |
| `docs/HERO-VIDEO-SPEC.md` §5.1 กฎข้อ 4 และ §6 | แก้ "obsidian void" เป็น "warm charcoal press-room" และแทน Preset A/B ด้วย SG-1/SG-2 (Preset C คงไว้เฉพาะ B—Line) |

---

## 9. Production log — v1 (2026-09-07, local ComfyUI)

| รายการ | ค่าที่ใช้จริง |
|---|---|
| โครงการ | `business-01-smart-gift/comfy-hero-video/` (comfy project/1: `assets/`, `fragments/wan5b_i2v.json`, `blueprints/sg1_hero.yaml`, `scripts/`, `outputs/`) |
| เครื่อง | RTX 5060 Ti 16 GB, ComfyUI local :8188, `comfy` CLI 1.19 — ไม่ได้ login Comfy Cloud จึงไม่ใช้ partner API (Kling/Veo/Seedance) |
| โมเดล | **Wan 2.2 TI2V 5B fp16** (template `video_wan2_2_5B_ti2v` decompose เป็น fragment แล้วเพิ่ม input `start_image`) + umt5-xxl fp8 + wan2.2 VAE — ดาวน์โหลดด้วย `scripts/download_models.py` (~18 GB) |
| เฟรมตั้งต้นร่วม | `assets/frame0_open_box_1280x704.png` crop จาก `FXD66-3-adcreative-v1.png` (ภาพ ad creative ที่ approve แล้ว) — ไม่ได้ generate ใหม่ จึง product-faithful ตาม PRODUCT.md |
| Clip W (คนรับ → slot `videoRightUrl`) | มือในแขนเสื้อ charcoal เข้าจากขอบล่าง วางบนขอบกล่อง ยกทัมเบลอร์ขึ้นเล็กน้อย กล้อง tilt ลงช้า ๆ (seed 20260907) |
| Clip E (ของ → slot `videoLeftUrl`) | กล้อง push-in ช้า ๆ แบบ linear มุม near top-down แสงหน้าต่างเคลื่อนช้า ของทั้ง 3 ชิ้นนิ่ง (seed 20260908) |
| พารามิเตอร์ | 1280×704, 97 เฟรม @24 fps (4.0 s), 20 steps, cfg 5, uni_pc/simple, shift ตาม template — ทั้งสอง clip อยู่ใน graph เดียว (`sg1_hero.compiled.json`) |
| Conform | `scripts/conform.py`: scale/crop 1920×1080, fps=30, `-t 4`, libx264 high crf 20, `-g 15 -keyint_min 15 -sc_threshold 0`, `-an`, `+faststart` แล้วตรวจ I-frame count และ mean abs diff ของเฟรมแรกทั้งสองคลิป (< 3.0) จากนั้น copy ไป `web-ui-smg/public/assets/videos/` |
| Poster | `hero_frame0_poster.jpg` (1920×1080 จากภาพเดียวกัน) ใส่ใน `<video poster>` ทั้งสองแท็ก |

### 9.1 สิ่งที่ต่างจาก storyboard §3 (จงใจ ไม่ใช่พลาด)

- **เฟรมตั้งต้นเป็นกล่องเปิด ไม่ใช่กล่องปิด** — ไม่มีโมเดล image-edit ที่ปิดฝาได้อย่างซื่อสัตย์ต่อสินค้าบนเครื่องนี้ (มีแต่ Qwen-Image base) และการ edit ก่อน I2V เพิ่มความเสี่ยงที่ของในกล่องจะเพี้ยน จึงใช้ภาพ ad creative ที่ approve แล้วเป็นเฟรม 0 ตรง ๆ ผลคือ Clip E เปลี่ยนจาก "ฝาเลื่อนออกเผยของ" เป็น "push-in เข้าหาของที่เห็นอยู่แล้ว" และ Clip W เป็น "มือรับ/ยกทัมเบลอร์" แทน "ยกฝา"
- **ความละเอียดต้นทาง 1280×704** (native ของ 5B) แล้ว upscale เป็น 1080p ใน conform — คมน้อยกว่าสเปก 1080p แท้ ยอมรับได้สำหรับ v1; **24 → 30 fps** ใช้ frame duplication ไม่ interpolate
- ยังไม่มี **SG-2 / SG-3** และ theme B-roll ในรอบนี้

### 9.2 ทางไป v2

1. เฟรมปิดฝา: ใช้โมเดล edit (Qwen-Image-Edit หรือ Flux Kontext) ทำ targeted edit "ปิดฝา" จาก ad creative เดียวกัน แล้วรัน storyboard §3 เต็ม
2. คุณภาพ: Wan 2.2 14B I2V (ต้อง VRAM มากกว่านี้หรือใช้ Comfy Cloud / partner API หลัง login) หรือ render 1080p แท้
3. SG-3 Twin Orbit เมื่อ `.glb` ผ่าน owner_approved

## 10. Production log — v2 "drawer box" (2026-09-07, composited, deployed)

Boss brief หลังดู v1: พื้นหลังขาว · กล่อง SmartGift อยู่กลางจอ · เลื่อนซ้าย = ถาดเลื่อนออกทางซ้ายเผยของด้านใน (สุดแค่ครึ่งกล่อง) · เลื่อนขวา = เหมือนกันแต่ของด้านในเป็น mockup ของแบรนด์ลูกค้า · ขอ refinement

| รายการ | ค่าที่ใช้จริง |
|---|---|
| วิธีผลิต | **Composite แบบ deterministic** (`scripts/drawer_v2.py`, PIL + ffmpeg) ไม่ใช้ generative video — ควบคุมได้ 100% ว่าของในถาดคือสินค้าจริง, ระยะเลื่อนพอดีครึ่งกล่อง, เฟรมแรกเหมือนกันทุกพิกเซล, motion linear ตรงกับ scrubber |
| กล่อง (sleeve) | สร้างจากสีส้มที่วัดจากภาพ ad creative (median RGB 235,76,3) + gradient แสง, grain, vignette, ขอบหนา, sheen และ **เดบอส tone-on-tone "SG / SmartGift / THE RIGHT GIFT. THE RIGHT IMPACT."** — พิมพ์บนกล่องเป็น option ปกติของงานจริง |
| ถาด W (คนรับ/ของจริง) | crop ส่วนในของกล่องจาก `FXD66-3-adcreative-v1.png` (ทัมเบลอร์ + พาวเวอร์แบงก์ + พัดลม) — ครึ่งที่โผล่คือ ทัมเบลอร์ + พาวเวอร์แบงก์ |
| ถาด E (ลูกค้า) | 4 ช่อง: `udtrucks`, `gmmtv_pb` (ซ่อน) · `gmmtv_tmb`, `truepride` (โผล่) — cut out จาก `public/assets/smartgift/mockups/` ด้วย rembg 2.0.83 วางบนพื้นถาดสีเดียวกัน พร้อม contact shadow |
| การเคลื่อนไหว | progress 0 → 1 = ถาดออก 0 → 50 % ของความกว้างกล่อง, linear, 120 เฟรม @30 fps = 4.0 s; เงาถาด + เงาขอบ sleeve ทาบบนถาด |
| Conform | เข้า `scripts/conform.py` เหมือน v1: 1920×1080, `-g 15`, ไม่มีเสียง, faststart; เฟรมแรก mean diff = 0 (ภาพเดียวกันโดยสร้าง) |
| Deploy | `public/assets/videos/hero_west_receive.mp4`, `hero_east_discover.mp4`, `hero_frame0_poster.jpg` (ทับ v1) · container 8080 rebuild |

### 10.1 ข้อควรระวังเรื่องแบรนด์ลูกค้า

mockup ทั้งชุดเป็น **ภาพจำลอง AI** ไม่ใช่ภาพงานจริง; ตามเอกสาร `docs/business/2026-09-07-client-work-evidence-and-mockups.md` มีหลักฐานงานจริงเฉพาะ UD Trucks และ CP/True ส่วน GMMTV เป็นลูกค้าอันดับ 1 ตามยอดวางบิลแต่ยังไม่มีรูปงาน — v2 จึงเลือกเฉพาะ 3 แบรนด์นี้ และไม่ใช้ Starbucks / One Bangkok / One31 / Iconsiam ที่ยังไม่มีหลักฐานความสัมพันธ์ในระบบ การใช้โลโก้แบรนด์อื่นบนหน้าเว็บสาธารณะควรมีสิทธิ์/หลักฐานก่อน (Taxonomy §9 "Media asset: public-approved")

### 10.2 ปรับต่อได้ทันที (แก้ค่าใน `drawer_v2.py` แล้วรัน ~40 วินาที)

- เปลี่ยนชุดสินค้าในถาด W: ชี้ `AD` ไปยัง ad creative ชุดอื่น (TMK00-4 / FXD6064 / TGC09-3)
- เปลี่ยนแบรนด์ในถาด E: แก้ `CLIENT_MOCKUPS` (ต้อง cut out ไฟล์ใหม่ด้วย rembg ก่อน)
- ระยะเลื่อนสูงสุด: ตัวคูณ `0.5` ใน `render_frame()`
- v1 (Wan 2.2 คลิปมือรับ/push-in) ยังเก็บไว้ที่ `outputs/conformed/` และ `outputs/preview/*_sheet.jpg` เผื่อต้องการสลับกลับ

## 11. Production log — v3

**Revision:** `1.3.0b` · **Updated:** `2026-09-07T22:14:56+07:00,RWANG` · **Status:** beta / approved and locally verified

**Complexity:** C-2 (documentation-driven implementation) · **Risk:** MEDIUM (renderer, media artifacts, local Docker deployment)

**Current result:** ต่อยอด renderer v2, ผลิต MP4 สองคลิปและ poster v3, conform/ตรวจไฟล์, build และ Docker deploy ที่ localhost:8080 แล้ว ตรวจ desktop สองขนาดและ touch/reduced-motion emulation ผ่าน; มีข้อจำกัด layout มือถือเดิมตาม §11.7

### 11.1 Scope and authority

บรีฟเจ้าของแบรนด์รอบ v3 เป็นข้อกำหนดของรอบนี้: พื้นขาวล้วน กล่องปิดกึ่งกลาง ถาดเลื่อนซ้าย/ขวาเพียงครึ่งกล่อง ใช้ภาพที่ระบุเท่านั้น จึงแทนข้อเสนอเก่าเรื่องพื้นมืด/หิน มือยกของ กล้องเคลื่อน และการ rename slot ใน §2–8 เฉพาะงานนี้ ส่วนกลไก scrub และ encoding ยังคงตาม `HERO-VIDEO-SPEC.md` และค่าที่เข้มงวดกว่าในบรีฟ

**[ASSUMPTIONS] — อนุมัติแล้วด้วยข้อความ `approve` ใน task นี้**

1. ใช้ deterministic compositing ต่อยอด `business-01-smart-gift/comfy-hero-video/scripts/drawer_v2.py` ตามเดิม เพิ่มมุมมองและความหนากล่องโดยไม่สร้างภาพสินค้าใหม่
2. ใช้ตรากล่อง SG พร้อมโบว์ที่ตัดจาก `public/logo-smg.jpg` เป็นเดบอส tone-on-tone กลางฝา ไม่พิมพ์ข้อความ/tagline เพิ่มในวิดีโอ; โลโก้ที่ติดอยู่บนภาพ mockup เดิมคงไว้
3. คง FXD66-3 และ mockup 4 ชิ้นตามค่าตั้งต้นในบรีฟ ไม่มีการเปลี่ยนแบรนด์หรือชุดสินค้า
4. ความสูงไม่เกิน 560 px หมายถึงตัวกล่องรวมขอบ/ผนังที่ฉายลงเฟรม ไม่ใช่เฉพาะพื้นผิวฝา; จุดกึ่งกลางของกล่องปิดอยู่ที่ (960, 540) และ sleeve อยู่ตำแหน่งเดิมตลอด

### 11.2 Evidence and proposed visual refinement

ตรวจ `drawer_v2.py` และ `outputs/preview/v2_stills.jpg` พบว่า sleeve เป็นระนาบสี่เหลี่ยมหน้าตรง มีแถบขอบ 8 px และเดบอสจากข้อความฟอนต์ (`SG`, `SmartGift`, tagline); ยังไม่มีการอ่าน `logo-smg.jpg` หรือการฉาย perspective กล่องจริงในสคริปต์ นี่คือฐานของ refinement รอบนี้ ไม่ใช่ข้อสรุปว่า encoding หรือ scrubber เสีย

| ส่วน | v2 ที่ตรวจพบ | ข้อเสนอ v3 |
|---|---|---|
| กล้องและรูปทรง | top-down หน้าตรง พื้นผิวระนาบเดียว | near top-down เอียงเล็กน้อยประมาณ 8–10° เห็นผนังหน้าและรอยต่อฝา; ใช้การฉายแบบ orthographic/affine คงที่เพื่อรักษาการเลื่อนเชิงเส้นบนจอ |
| ขนาด | `BOX_H = 560` สำหรับฝา | ลดขนาดระนาบฝาเท่าที่ต้องใช้เพื่อรวมความหนาแล้วสูง ≤560 px และตรวจเงา/ถาดกับ ledger ในหน้าเว็บ |
| วัสดุ | gradient, grain, sheen | แลคเกอร์ด้านสีส้มฐาน RGB (235,76,3), highlight กว้างและเบา, microtexture คงที่ทุกเฟรม, bevel แคบ มีน้ำหนักแต่ไม่เงาเหมือนพลาสติก |
| แบรนด์ | ตัว SG พิมพ์ด้วยฟอนต์ | mask จากตรากล่อง/โบว์จริงใน `logo-smg.jpg`, ขอบรับแสงและเงาร่องเดบอสสัมพันธ์กับแสงซ้ายบน |
| เงา | เงาสี่เหลี่ยมเบลอและแถบ shadow | เงาสัมผัสฐานกล่อง + เงาทอดบนพื้นขาว + เงาถาดที่เลื่อนตามถาด + เงาปาก sleeve ที่ยึดกับช่องเปิด; ไม่ให้ผลิตภัณฑ์ดูเหมือนลอย |
| การจัดสินค้า | crop FXD66-3 และ mockup 4 ช่อง | คงแหล่งภาพเดิม, ใช้ transform ร่วมกับพื้นถาดอย่างระมัดระวัง, ตรวจขอบ alpha และความอ่านออกของโลโก้ที่ความละเอียดส่งมอบ |

พื้นนอกวัตถุและเงาต้องเป็น RGB (255,255,255) ในภาพต้นทาง ไม่มี gradient พื้นหลัง, prop, ราคา, คำบรรยาย, เสียง หรือการเคลื่อนกล้อง

### 11.3 Asset and motion contract

| คลิป | เมาส์ / config | ภาพในถาด | ปลายทาง |
|---|---|---|---|
| `hero_west_receive.mp4` | ซ้าย / `videoRightUrl` | crop เฉพาะส่วนในกล่องของ `output/catalog-internal/artwork/FXD66-3-adcreative-v1.png`; ต้นฉบับประกอบด้วยทัมเบลอร์ไอวอรี พาวเวอร์แบงก์ส้ม พัดลมขาว | ถาดเลื่อนซ้าย; เห็นสินค้าตามพื้นที่ที่เปิดโดยไม่เปลี่ยนสัดส่วนเพื่อบังคับให้เห็นครบทุกชิ้น |
| `hero_east_discover.mp4` | ขวา / `videoLeftUrl` | `assets/mockups_cut/udtrucks.png`, `gmmtv_pb.png` อยู่ครึ่งซ่อน; `gmmtv_tmb.png`, `truepride.png` อยู่ครึ่งเปิด ตรวจเทียบ JPG ชื่อเดียวกันในเว็บ | ถาดเลื่อนขวา; ที่ progress=1 ต้องเห็น GMMTV tumbler และ True card holder ชัดเจนทั้งสองชิ้น |

ที่ progress=0 ใช้ภาพกล่องปิดร่วมกันทุกพิกเซล และซ่อนสินค้า/เงาที่อาจทำให้สองคลิปต่างกัน สูตรเลื่อนคือ `dx = sign × 0.5 × box_width × progress` โดย sign=-1 สำหรับ west และ +1 สำหรับ east; ระยะนี้วัดในระนาบกล่องก่อนฉายภาพและตรวจระยะบนจอด้วย ไม่มี easing หรือการเคลื่อนย้อนกลับ

ใช้ 120 เฟรม โดย `progress = frame_index / 119` เพื่อให้เฟรมสุดท้ายถึงระยะครึ่งกล่อง เฟรมสุดท้ายมี PTS 119/30 ≈3.9667 s และ container ยาว 4.0 s ตามสเปก

**Provenance:** ภาพ west เป็น approved ad creative ตามบรีฟ; east ทุกไฟล์เป็นภาพจำลอง AI ไม่ใช่ภาพถ่ายงานส่งมอบ เอกสารหลักฐานลูกค้าปัจจุบันมีภาคผนวกใหม่กว่า §10.1 รวมทั้ง ONE BANGKOK/ICONSIAM และสถานะ CP ที่ต่างจากข้อความสรุปเดิม แต่รอบนี้ยังใช้เฉพาะชุดที่เจ้าของระบุ ไม่ขยายแบรนด์และไม่อ้างว่า mockup เป็นหลักฐานงานจริง

### 11.4 Implementation and impact boundary after approval

1. ปรับ `drawer_v2.py` ต่อจากโครงเดิม แยก output v3 ที่ `comfy-hero-video/outputs/v3/`; เก็บ v2 และสำรองไฟล์เป้าหมายเดิมก่อนแทนที่ เพราะทั้งสอง repository มีงานค้างอยู่แล้ว
2. ผลิตภาพตรวจ 0%, 50%, 100% เพื่อทบทวนวัสดุ เดบอส การบังสินค้า และพื้นที่ ledger ก่อน render ทั้งคู่; ปรับภาพจนผ่านเกณฑ์ก่อน encode
3. Encode และตรวจ raw v3 ก่อนเรียก `python scripts/conform.py <west.mp4> <east.mp4>` จาก `comfy-hero-video`; สคริปต์เดิม re-encode และ copy ไปเว็บอัตโนมัติ จึงต้องมี backup และตรวจผล conformed ซ้ำก่อน deploy
4. สร้าง poster JPG 1920×1080 จากเฟรมแรกของวิดีโอ conformed และ copy ไป `web-ui-smg/public/assets/videos/hero_frame0_poster.jpg`
5. ใช้ Git Bash โดยตรงสำหรับ `npm run build` แล้ว `docker compose up -d --build` ตามคำสั่งเจ้าของรอบนี้ ซึ่งแทนคำแนะนำ `cmd /c` ใน playbook เดิม
6. ตรวจ HTTP และหน้าเว็บจริง ส่ง contact sheet สองภาพในบทสนทนาก่อนสรุป แล้วเติมผลที่วัดได้และเส้นทางหลักฐานลง §11 นี้

ขอบเขตไฟล์ implementation คือ renderer, output/หลักฐานตรวจรับที่เกี่ยวข้อง, วิดีโอและ poster 3 ไฟล์ในเว็บ และเอกสารนี้ คงชื่อ config และกลไก React เดิม ไม่แก้ `data-pipeline/` หรือรวมงานค้างของผู้ใช้อื่นเข้า scope

### 11.5 Acceptance and exit criteria — verified results

- [x] ภาพ: พื้นต้นทางขาว RGB 255, sleeve bounds (699,319)–(1221,761) สูง **442 px** กึ่งกลาง (960,540); ผนังหน้าและรอยต่อ, เดบอสจากตรากล่อง SG/โบว์จริง; east เห็น GMMTV และ True ชัดเมื่อเปิดสุด
- [x] Motion: render schedule 120 เฟรมใช้ linear progress และปัดตำแหน่งระดับ pixel, ระยะสูงสุด **251 px = 50% ของ box width 502 px**; ตรวจภาพ decoded ของขอบถาดที่พ้นเงา sleeve แล้ว (เฟรม 48–119) เคลื่อนทิศเดียวทั้งคู่ ความคลาดจากเส้นตรงสูงสุด **0.496 px**; frame0 ต้นทางเท่ากันทุกพิกเซล
- [x] Media: FFmpeg decode/showinfo ยืนยัน H.264 High, 1920×1080, yuv420p, 30 fps CFR, 120 เฟรม, 4.0 s, ไม่มี audio; I-frame 8 เฟรมที่ 0,15,…,105; ตรวจ MP4 atoms พบ moov ก่อน mdat
- [x] Parity: conform รายงาน `frame0_parity_ok = true`, `iframes = 8` ทั้งคู่, JPG grayscale MAD **0.089/255**; decoded RGB lossless MAD **0.103831/255** (<3/255)
- [x] Poster: JPG 1920×1080 จาก decoded frame0 ของ conformed west, **41,608 bytes**
- [x] Review: `west_contact_sheet.jpg` / `east_contact_sheet.jpg` จาก conformed MP4 ที่เวลา 0,0.5,1,1.5,2,2.5,3,3.5,3.95 s; จุดสุดท้ายเลือก frame119 / PTS3.9667 s; มี PNG ความละเอียดเต็มทุกจุด
- [x] Deploy: local `npm run build` และ Docker rebuild/start ผ่าน; GET วิดีโอและ poster HTTP200/hash ตรง; range วิดีโอ HTTP206
- [x] Browser: scrub ซ้าย/ขวา กลางทาง ขอบ deadzone และ poster รวม 14 จุดที่ 1920×1080/1366×768 ผ่าน; ถาดพ้น ledger ทั้งสองขนาด; touch autoplay สลับคู่และ reduced-motion หยุดนิ่งผ่าน CDP emulation ดูข้อจำกัด §11.7
- [x] Evidence: `outputs/v3/verification_raw.json`, `verification_conformed.json`, `conform.log`, `delivery_verification.json`, `browser-touch-cdp.json`, `build.log`, `docker-build.log`, contact sheets และ screenshots; เก็บสำเนาไฟล์ส่งมอบสุดท้ายที่ `outputs/v3/delivery/`

**ข้อจำกัดที่ต้องตรวจ ไม่ใช่งานแก้เพิ่ม:** `nginx.conf` cache `/assets/` แบบ immutable หนึ่งปีแม้ชื่อวิดีโอคงเดิม จึงตรวจรับด้วย browser session ใหม่/ปิด cache และเทียบ hash ผ่าน HTTP; browser ที่เคย cache v2 อาจต้อง hard reload ส่วน desktop `onMove` เดิม return ใน deadzone และไม่บังคับ rewind จึงไม่รับรองว่ากระโดดเมาส์เข้ากลางจอแล้วจะกลับ frame0 เสมอ งานนี้ไม่เปลี่ยน interaction

### 11.6 Version diff and execution record

**Approved:** เจ้าของตอบ `approve` ให้ดำเนินการตาม §11 ใน task นี้แล้ว

**Implementation finding:** conform เดิมทำ 120 → 119 เฟรมบน FFmpeg 7.1 เมื่อ scale อยู่ก่อน fps; การทดลองสลับ fps มาก่อน scale ได้ครบ 120 เฟรม จึงเพิ่มการแก้เฉพาะ `conform.py` (LOW) เพื่อรักษาข้อกำหนด 4.0 s และตรวจจำนวนเฟรม/I-frame/parity ก่อน copy หลักฐานและ RCA: `business-01-smart-gift/.brain/rca/2026-09-07-hero-conform-final-frame.md`

`1.2.0 → 1.3.0b`: เพิ่มข้อเสนอ refinement v3, แหล่ง asset, geometry/motion contract และเกณฑ์ตรวจรับ; ปรับ version/status ด้านบนให้ตรง revision ปัจจุบัน คงประวัติ §9–10 ไว้

| Gate | Status | Evidence |
|---|---|---|
| Documentation approval | Approved | เจ้าของตอบ `approve` |
| Renderer / media production | Passed | `outputs/v3/render.log`, source parity/geometry ใน verification JSON |
| Conform / verification / contact sheets | Passed | 120 frames, 8 I-frames, MAD <3; guard tests ปฏิเสธ frame119, I-frame7 และ parity fail ก่อน copy |
| Build / Docker / browser | Passed locally, mobile layout limitation | `build.log`, `docker-build.log`, `delivery_verification.json`, `browser-touch-cdp.json` |

### 11.7 Final production notes and limitations

- **ขนาดรอบสุดท้าย:** ภาพทดลองสูง 530 px แตะสัญลักษณ์ SG เหนือ ledger บน 1366×768 จึงลดระนาบฝาจาก 510 เป็น 420 px รวมผนังและการฉายได้ 442 px โดยคงกึ่งกลางเดิม; ตรวจ screenshot ของทั้งสองขนาดซ้ำแล้ว ขอบถาดสุดท้ายอยู่เหนือ ledger
- **ไฟล์ส่งมอบ:** west **327,408 bytes**, east **322,807 bytes**, poster **41,608 bytes**; bitrate ต่ำกว่า target band เก่าเนื่องจากภาพพื้นขาวและกล้องนิ่ง ใช้ CRF20 หลัง conform ไม่มีการเพิ่ม bitrate เปล่า; ตรวจภาพ decoded แล้ว
- **Renderer:** คง measure/crop จาก v2 และแถวสินค้าเดิม เพิ่ม affine camera คงที่ (`SHEAR=.045`, `FORESHORTEN=.985`), ผนัง28px, matte microtexture คงที่, logo mask จาก crop (112,182,590,723) ของโลโก้ที่ระบุ, silhouette/contact/cast shadows; ไม่มีโมเดล generative ใหม่หรือสินค้าใหม่
- **Touch verification:** `agent-browser set device` เปลี่ยน viewport แต่รอบตรวจพบ pointer ยังเป็น fine จึงใช้ Chrome CDP `Emulation.setTouchEmulationEnabled` แล้ว reload; ยืนยัน `(pointer: coarse)=true` และเห็นทั้งสองคลิป autoplay สลับกันภายใน 9 samples ก่อนทดสอบ reduced-motion หยุดที่ frame0; ไม่มี Runtime exception ระหว่างการทดสอบนี้ เป็น browser emulation ไม่ใช่การทดสอบบน iPhone จริง
- **Mobile layout นอก scope:** CSS เดิมใช้ object-fit cover ในกรอบแนวตั้ง และ ledger ตำแหน่งล่าง จึง crop สินค้าด้านข้าง/ซ้อนกล่องบางส่วนบน viewport 393×852; ไม่รับรอง mobile composition ว่าสมบูรณ์ และไม่ได้แก้ React/CSS ในรอบนี้ หลักฐาน `browser-mobile.png`
- **Build:** มี warning bundle JS >500 kB เดิม แต่ TypeScript/Vite และ Docker build สำเร็จ; ไม่เปลี่ยน bundle splitting ในงานวิดีโอ
- **Scope preserved:** ไม่แก้ `data-pipeline/`, config slot, ชื่อไฟล์, React/CSS หรืองานค้างเดิม; สำรอง renderer/conform/เอกสารและไฟล์เว็บก่อนแก้ที่ `outputs/v3/backup-before-v3/`
- **Version diff:** `1.2.0 → 1.3.0b` เพิ่ม §11 production v3 และหลักฐานตรวจรับ; `drawer_v2.py` v2 → v3 refinement; `conform.py` เปลี่ยนลำดับ fps/scale และกั้น copy เมื่อเฟรม/keyframes/parity ไม่ผ่าน; เปลี่ยนเฉพาะวิดีโอและ poster 3 ไฟล์ในเว็บ

## 12. Hinged luxury presentation box — v4 proposal

**Date:** 2026-09-07 · **Agent:** RWANG · **Status:** draft; strict linear motion selected, three still previews produced for review, no v4 animation or deployment yet

**Complexity:** C-2 · **Risk:** MEDIUM — replacement of the media renderer and hero assets; existing web interaction/config contracts remain in scope as dependencies, not redesign targets.

### 12.1 Authority and design reference

The user's current message replaces the orange drawer-box creative direction in §10–11. Reference image: `C:/Users/pc/AppData/Local/Temp/codex-clipboard-71e2792b-70a7-4b43-a79e-5b6044ce3e8c.png` (238×265). The attachment is a visual reference, not an instruction document or product provenance record.

Preserve the rigid rectangular briefcase-like dark navy/black shell, rear hinge, warm beige/ivory lid lining, dark fitted insert, restrained metal clasp/hinges and handle visible in the reference. Use matte, photographic materials with softly rounded manufactured edges, a white/light neutral studio ground and grounded contact shadows. The single small open-box photograph establishes design language; unseen closed/rear details are a restrained reconstruction, not verified manufacturing dimensions.

No drawer translation, camera movement, zoom, cut, shake, people, text, added logos or extra products. Do not carry over the v3 orange shell/SG deboss. Product markings, if any, must come only from the product references selected by the user; do not invent or restamp them.

### 12.2 Shared scene and hinge contract

Two independent 4-second videos use one physical scene: base, exterior lid, lining, hinge pivot, camera transform/projection, lights, exposure, materials and animation are shared. Only the contents and fitted insert recess layout differ. The base remains fixed at the frame's center; choose a fixed framing that contains the entire lid sweep. Do not recenter or rescale during opening.

The lid is a rigid object rotating around its rear-edge hinge from 0° (closed) to 105° (open past vertical). Lid thickness and ivory interior rotate together, and the hinge stays attached to the base at every frame. The handle and clasps stay physically consistent with the shell; no latch-closing mechanism should obstruct the opening path.

**[ASSUMPTIONS] — for documentation approval:**

1. Interpret the requested 25–35° camera angle as elevation above the ground plane, since the user describes 90° as overhead. Proposed starting camera: fixed 35° elevation, modest three-quarter view, long focal length. Validate that all selected products and the lining are readable in the open proof.
2. A maps to the existing west filename / `videoRightUrl` / mouse-left half; B maps to east / `videoLeftUrl` / mouse-right half. No file or slot rename.
3. Retain 1920×1080, 30 fps CFR, 120 frames, H.264 High, yuv420p, GOP15 / min-keyint15 / scene-cut0, no audio, faststart and a shared JPG poster. Frame-zero parity is tightened to exact equality, not the previous MAD tolerance.
4. Retain the 560px maximum object envelope as a layout constraint, now measured over the entire lid sweep, including the open lid. Verify readability and ledger clearance on both desktop viewports before full production; any need to change this constraint must be surfaced rather than silently shifting the camera.

### 12.3 Product manifest — preview selection and evidence limits

| Video | Preview contents | Current evidence | Limit |
|---|---|---|---|
| A | UD Trucks handled tumbler + True Digital Park tan MagSafe card holder | UD Trucks artwork; True OLD/NEW sample photographs described in the evidence document; preview uses corresponding existing mockups | UD quotations are pending and True billing entity is unidentified; not proof of a completed combined order |
| B | Folded ONE BANGKOK black tote + ICONSIAM foam event light stick | ONE BANGKOK dimensioned artwork; ICONSIAM photograph linked to QT2024000545/BL2024000242 | ONE BANGKOK artwork is not linked to a specific order; no proof that the tote and light stick were purchased as one bundle |

The user delegated selection to products ordered by well-known clients and explicitly requested first/last stills before proceeding. Available evidence does not establish two exact completed multi-product orders. These previews therefore arrange two evidence-backed product pairs, not verified historical bundles. This limitation was stated before generation. A is a corporate drinkware/card-holder direction, not a substantiated Tech Gift Set order; no power bank, notebook or other concept-only item was added to fill that gap. GMMTV/Starbucks/One31 billing headers alone do not establish what products they bought.

Sources: `comfy-3d-products/outputs/mockups/udtrucks.jpg`, `truepride.jpg`; `public/assets/portfolio/real-jobs/obt_black.jpg`, `icon_stick.jpg`. All four rendering references are existing AI mockups; artwork/photo evidence is described in `docs/business/2026-09-07-client-work-evidence-and-mockups.md` (§3.2, §3.3, §7.1–7.3). Do not label either newly arranged set as a delivered customer order or a real photograph. The notebook/watch/pen-like contents of the box design reference are not used.

### 12.4 Motion choice — confirmed strict linear

The user selected **Linear 0–105° over the full 4 seconds, no hold**, so this takes precedence over the earlier illustrative time/angle milestones.

| Mapping | Formula for frame i=0…119 | Consequence |
|---|---|---|
| Strict linear, recommended for scrub | `angle = 105 * i / 119` | Frame0 closed; final displayed frame105°; no terminal hold |

Preserve a fixed hinge/camera with no backward motion or easing. Approximate angles at requested review times are 0° at0s, 15.88° at0.6s, 63.53° at2.4s, 92.65° at3.5s, and105° at frame119 /3.9667s. The container is exactly4.0s. Stills alone do not verify these angular values.

### 12.5 Occlusion and identical opening frames

Generate one closed-box master image and use it for both sources. Products and the differing insert cavities must be fully occluded at frame0. Target the initial 0–0.6s interval (frames0–18) as a shared visible sequence: lid, common lining and rim only. Recess the contents and validate the shell/rim depth and camera sightlines; do not achieve this by fading products into view, delaying lid movement, adding a cover sheet, or popping a hidden set on at an arbitrary frame.

Depth-tested occlusion must control visibility during rotation. The A/B content masks must have zero visible pixels while concealed. Once exposed, only product/insert pixels and their local interior contact shadows may differ. Exterior shell, common lid lining, background and ground shadows must match at equal progress; isolate product-dependent indirect lighting from those shared surfaces if necessary. Realism of these common/interior shadow boundaries is a still-proof gate, not an assumed property.

Encode with deterministic settings that prevent future product frames from influencing the initial shared frames (for example fixed QP with no B-frames/lookahead), or reuse an identically encoded closed-GOP prefix. The final encoding mechanism must preserve GOP15 and eight I-frames, and pass decoded-pixel comparison. Re-running the existing CRF conform pipeline is not by itself proof of exact identity: v3 had identical source frame0 but nonzero decoded A/B MAD.

**Required pixel checks:** source frame0 `max_abs_diff=0` and equal hashes; decoded MP4 frame0 `max_abs_diff=0`; compare the early shared interval and report its exact end frame. Do not substitute a '<3/255' pass for these requirements. Poster must derive from the same decoded master frame.

### 12.6 Production plan after inputs and approval

1. Build a deterministic hinged-box scene with explicit depth/occlusion and physically coherent lighting. Preserve v3 as a rollback artifact; reuse its approved asset handling and FFmpeg checks where applicable, not its sliding-sleeve geometry. A true 3D box/hinge with reference-image product compositing is preferred to stretching a flat lid bitmap. Blender was not found on PATH or in the default Program Files location during this quick check; renderer provisioning/availability remains an implementation prerequisite.
2. Produce full-resolution shared closed master and matched A/B stills at0°,15°,60°,90°,105°. Review shape, hardware, lining, product identity, occlusion, composition and ground shadow before rendering the animation. Use only reference-backed product imagery and explicitly document any view limitation.
3. Render the two120-frame sequences with a shared scene/animation setup. Verify fixed base/camera/hinge and monotonic angle frame by frame; content visibility and exact early-frame parity are separate gates.
4. Encode and verify both independent4-second MP4s plus poster. Extend the existing verification and conform checks only as required to preserve exact frame identity; retain previous RCA coverage for the final-frame loss.
5. Generate nine decoded-frame contact sheets per clip at0,0.5,1,1.5,2,2.5,3,3.5,3.95s, and a paired early-opening proof including0,0.2,0.4,0.6s. Label the actual PTS where sample times fall between frames. Share these before the final report.
6. Replace the three existing public hero assets, run npm build and Docker compose via Git Bash, verify HTTP200/range206 and served hashes, then inspect actual mouse scrub at1920×1080 and1366×768. Verify mobile/touch/reduced-motion behavior and record pre-existing mobile layout limitations without expanding UI scope.

### 12.7 Acceptance checklist and version diff

- [x] Preview A/B source images selected within the user's delegation; evidence limitations recorded, no additional products.
- [x] Strict linear motion mapping selected by user.
- [ ] Final product-pair/art direction and animation implementation documentation approved after still review.
- [ ] Physical reference design preserved, no SG deboss/text/added logos.
- [ ] Base/camera fixed, hinge attached, lid thickness/lining rigid, no drawer movement.
- [ ] One closed master; exact source and decoded frame0 identity; early products/insert differences fully occluded.
- [ ] Lid angle meets the selected linear mapping and endpoint; reverse timeline naturally closes.
- [ ] Both complete sets readable when fully open; only permitted interior differences between A/B.
- [ ] Full opening sweep fits the fixed composition and desktop ledger clearances.
- [ ] 1920×1080,30fps CFR,120frames,4.0s,High/yuv420p,GOP15/eight I-frames,no audio,faststart.
- [ ] Poster,contact sheets,early parity proof,verification logs and source/output hashes delivered.
- [ ] Build,local deployment,HTTP hashes and browser checks completed; limitations explicitly recorded.

**Version diff:** `1.3.0b → 1.4.0b` adds the hinged-box v4 proposal, tighter pixel parity/occlusion requirements and explicit product/motion questions. No renderer, media, config, web code or deployment changed in this proposal turn. v3 remains the current deployed hero. `data-pipeline/` remains outside the change scope.

### 12.8 First/last-frame still preview delivery

The user explicitly requested image previews first. Generated through the built-in `image_gen` tool, not by modifying animation/web code:

| File under `business-01-smart-gift/comfy-hero-video/outputs/v4-preview/` | Role |
|---|---|
| `frame0_closed_master.png` | One shared closed-box master for both proposed clips; not two independently generated starting frames |
| `frame119_open_A.png` | Open-box direction A: UD Trucks tumbler and True card holder |
| `frame119_open_B.png` | Open-box direction B: ONE BANGKOK tote and ICONSIAM light stick, edited from A to retain its composition |
| `prompts.json` | Exact final prompt set and tool provenance |
| `preview_manifest.json` | Native sizes, image hashes and preview qualification |

All three previews are **1672×941** native image outputs. They are for art-direction review, not the final1920×1080 production frames. Frame0 is a single file by construction, but there are no encoded videos to claim decoded parity for yet. The open A/B images are visually similar outside the inserts but not pixel-identical: the measured top400-row region MAD is approximately2.173/255. Base position also has visible generative drift between closed/open stills. Fixed camera/hinge geometry,105° endpoint, early occlusion, pixel identity, layout envelope and product dimensions must be established in the deterministic animation scene before production; do not interpolate these three previews and call those gates passed.

The current deployed hero remains v3. No renderer code, application code, public hero asset or Docker deployment was changed by this preview work.

**Version diff:** `1.4.0b → 1.4.1b` records the user's strict-linear selection, delegated evidence-based product selection, three preview images and their explicit production/evidence limits. Video production awaits review of the stills, as requested by the user.

### 12.9 Revised tall gift-box previews — r2

The user's latest direction rejects the briefcase appearance of §12.8. This section takes precedence over all earlier briefcase hardware, fixed-camera, no-zoom and no-logo requirements in §12.1–12.7. This is a still-preview revision, complexity C-1 / LOW risk: generated image artifacts and direction documentation only.

- Use a distinctly taller, deep rigid gift box with matte dark navy exterior, attached rear-hinged lid, ivory inner lining and dark fitted insert. Remove carrying handles, visible clasps and briefcase hardware; use a concealed hinge/closure.
- Print the supplied SmartGift mark and wordmark from `web-ui-smg/public/logo-smg.jpg` at the center of the inner lid, preserving its orange/gold/brown colors. No exterior logo is requested for the closed master.
- Camera elevation target changes from approximately80° above the ground at the closed start to50° at the open end. The ending base footprint is smaller in the image, producing the requested zoom-out impression. These are image-generation targets, not measured/calibrated camera angles.
- Both future videos must share the same camera trajectory, framing/scale progression, physical box, lights and rear hinge. The physical base stays stationary; the camera/framing changes identically for A/B. Strict linear lid rotation0–105° across4seconds, no hold, remains the selected motion.
- Keep the single common closed master and fully concealed contents at progress0. Revalidate early occlusion under the higher moving camera; earlier fixed-camera assumptions do not establish visibility for this revision.
- Preserve the selected A/B products and the order-evidence limitations in §12.3. These newly arranged mockup pairs are not verified historical combined orders.

Generated and visually reviewed with the built-in `image_gen` tool. All three files are native1672×941 previews, preserved separately from the rejected first revision:

| File under `business-01-smart-gift/comfy-hero-video/outputs/v4-preview-r2/` | Role |
|---|---|
| `frame0_closed_80deg.png` | Common closed master; tall gift box, closer almost-overhead composition |
| `frame119_open_A_50deg.png` | Open A; SmartGift inner-lid branding, UD Trucks tumbler + True card holder |
| `frame119_open_B_50deg.png` | Open B, edited from A; folded ONE BANGKOK tote + ICONSIAM foam light stick |
| `prompts.json` | Exact generation/edit prompt set and tool provenance |
| `preview_manifest.json` | Dimensions, SHA-256 hashes, intended camera/motion and unverified production gates |

Visual review confirms taller gift-box styling, removal of carrying hardware, visible branded ivory lining, intended product pairs and smaller ending base footprint. Generated A/B stills may differ outside the insert; no exact exterior pixel-parity claim is made. Production still requires deterministic shared geometry/camera/lighting, calibrated endpoints, decoded frame0 equality, early occlusion, video encoding and actual hero-layout verification. Review the entire lid sweep against the existing ledger-clearance constraint with the newly requested camera movement.

No renderer/application code, public hero asset or deployment changed. The deployed hero remains v3; the user requested stills before videos. Previous preview files are retained for version comparison.

**Version diff:** `1.4.1b → 1.5.0b`: briefcase becomes taller gift box; adds original SmartGift inner-lid logo; replaces fixed camera with80°→50° elevation and zoom-out; delivers revised closed/A-open/B-open previews.

### 12.10 Exterior SmartGift gold foil — r3

The user requests a gold SmartGift logo integrated into the outer lid, visible when closed, with reflections changing naturally as the lid moves. This supersedes §12.9's unbranded exterior. Scope is C-1 / LOW risk for the current still/material-direction update; no animation code changes.

Use the supplied SG gift/bow emblem, divider and SMART GIFT THAILAND wordmark as a single warm metallic gold hot-foil stamp at the lid center. The foil is pressed into the navy wrapping paper with extremely shallow debossing, shared fine paper grain and compressed edges. No separate badge, sticker, floating overlay, extruded letters, drop shadow or rectangular backing. Retain the existing inner-lid branding and open A/B previews.

For later animation, attach the logo mask/material coordinates to the rigid outer lid surface. Use metallic reflection, micro-roughness and shallow normal/bump detail to integrate foil with paper. Lighting remains fixed; reflected highlights change with lid normal and the shared camera trajectory. Do not animate a screen-space shine sweep, emissive glow, arbitrary brightness pulse or baked highlight that stays static through rotation. A/B must share the identical foil placement, material and reflection response at equal progress. Reverse scrubbing must reproduce the same highlights without temporal randomness.

New common closed master: `business-01-smart-gift/comfy-hero-video/outputs/v4-preview-r3/frame0_closed_goldfoil_80deg.png`, generated through built-in `image_gen` by editing the r2 closed frame with the original logo artwork. Exact prompt and provenance are saved alongside it in `prompts.json`. Visual review confirms gold artwork seated in the lid plane, restrained metallic highlights, matte navy paper and retained closed-box composition. This still establishes material direction only; animated specular behavior, exact source/decoded A/B parity and geometric consistency have not been verified. No new video or deployment is claimed.

**Version diff:** `1.5.0b → 1.5.1b`: adds an integrated exterior gold-foil SmartGift stamp and physically driven reflection requirements; preserves the tall box, 80°→50° camera/zoom-out direction and strict linear lid opening.

### 12.11 Production authorization and execution

The user explicitly instructed “สร้างvdoเลย” after the r3 foil preview: the latest direction and implementation plan are authorized. Execute C-2 / MEDIUM risk production in the isolated v4 output directory. Use a deterministic Blender scene for the rigid deep shell, rear hinge, shared moving camera, material-based foil highlights and depth-tested reference product insert compositing. First inspect endpoint renders, then render A/B120-frame sequences and encode4-second videos. Verify exact source/decoded closed-frame identity, shared early visibility, linear angles, camera endpoints, foil attachment, encoding and reverse scrubbing. Preserve original previews; report differences between generated art-direction stills and calibrated production renders. Deliver reviewable videos before replacing website assets; this turn's explicit request is video creation.

## CHANGELOG

| Version | Date | Summary | Agent |
|---|---|---|---|
| 1.5.1b | 2026-09-07 | Exterior gold-foil SmartGift closed-frame preview; paper-integrated stamp and motion-dependent physical reflections specified | RWANG |
| 1.5.0b | 2026-09-07 | Revised still previews: taller gift box, SmartGift inner-lid logo, 80° start to50° end with zoom-out; supersedes briefcase/fixed-camera direction | RWANG |
| 1.4.1b | 2026-09-07 | Lock strict linear motion; produce closed/A-open/B-open still previews from delegated client-work references, with order-evidence and generative-geometry limits recorded | RWANG |
| 1.4.0b | 2026-09-07 | Draft hinged luxury presentation-box v4: shared geometry/hinge, exact decoded frame0 parity, early occlusion; A/B references and linear-versus-hold choice awaiting clarification | RWANG |
| 1.3.0b | 2026-09-07 | Approved and locally deployed v3: source-logo deboss, shallow geometry, matte material/shadows, 442px box, conform final-frame correction; media/HTTP/desktop/touch checks passed, mobile layout caveat recorded | RWANG |
| 1.2.0 | 2026-09-07 | Production log v2: composited drawer-box clips (white ground, centred box, half-slide reveal, client-mockup tray) replace v1 on the site; brand-evidence caveat | Claude |
| 1.1.0 | 2026-09-07 | Production log v1: SG-1 rendered locally with Wan 2.2 5B from the approved ad-creative frame; deviations and v2 path recorded | Claude |
| 1.0.0 | 2026-09-07 | Brand analysis จาก 02_prepared + creative proof PDF; แนวคิด Giving Axis; storyboard SG-1; visual spec; pipeline product-faithful; prompt library SG-1/SG-2/SG-3 | Claude |
