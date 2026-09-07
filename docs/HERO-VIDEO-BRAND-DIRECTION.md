# HERO VIDEO — BRAND DIRECTION & STORYBOARD
**Project:** SmartGift Web UI (`web-ui-smg`)  
**Companion to:** [`docs/HERO-VIDEO-SPEC.md`](HERO-VIDEO-SPEC.md) (กลไก scrub, encoding, ffmpeg) — เอกสารนี้เป็นชั้น *creative direction* ที่วางทับสเปกทางเทคนิค  
**Sources analysed:** `business-01-smart-gift/data-pipeline/02_prepared/*.json`, `output/pdf/smartgift-catalog-adcreative-proof-v0.2.pdf`, `PRODUCT.md`, `docs/business/*`, `logo-smg.jpg`  
**Version:** `1.0.0` · **Date:** 2026-09-07 · **Status:** design proposal (ยังไม่มีการเปลี่ยนโค้ดหรือวิดีโอในรอบนี้)

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

## CHANGELOG

| Version | Date | Summary | Agent |
|---|---|---|---|
| 1.1.0 | 2026-09-07 | Production log v1: SG-1 rendered locally with Wan 2.2 5B from the approved ad-creative frame; deviations and v2 path recorded | Claude |
| 1.0.0 | 2026-09-07 | Brand analysis จาก 02_prepared + creative proof PDF; แนวคิด Giving Axis; storyboard SG-1; visual spec; pipeline product-faithful; prompt library SG-1/SG-2/SG-3 | Claude |
