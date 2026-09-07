# Prompt for Codex — SmartGift hero video "drawer box" (v3)

คัดลอกทั้งบล็อกด้านล่างไปวางใน Codex ได้เลย (ปรับรายการแบรนด์ในข้อ 5 ได้ตามต้องการ)

---

คุณคือ motion/graphics engineer ทำ hero video ให้เว็บ SmartGift (ของขวัญองค์กร B2B ประเทศไทย) งานนี้อยู่ในสองโฟลเดอร์บนเครื่องนี้:

- เว็บ: `C:\Users\pc\workspace\web-ui-smg` (React + Vite, deploy ด้วย docker บน port 8080)
- ข้อมูล/แอสเซ็ต: `C:\Users\pc\workspace\business-01-smart-gift`

อ่านก่อนเริ่ม (ห้ามข้าม):
1. `web-ui-smg\docs\HERO-VIDEO-SPEC.md` — กลไก hero: วิดีโอ 2 คลิปถูก scrub ด้วยตำแหน่งเมาส์ ครึ่งจอซ้ายเล่นคลิปในช่อง `videoRightUrl`, ครึ่งจอขวาเล่นคลิปในช่อง `videoLeftUrl` (ชื่อช่องกลับด้านกับฝั่งเมาส์ ดูสมการใน `src/App.tsx` ฟังก์ชัน onMove) progress = 0 ที่ขอบ deadzone กลางจอ (±5 % ของความกว้าง) และ = 1 ที่ขอบจอ
2. `web-ui-smg\docs\HERO-VIDEO-BRAND-DIRECTION.md` — สี/ฟอนต์แบรนด์ และ §10 คือ v2 ที่ทำไว้แล้วด้วยสคริปต์ `business-01-smart-gift\comfy-hero-video\scripts\drawer_v2.py` (ให้เริ่มจากสคริปต์นี้ ปรับปรุงต่อ ไม่ต้องเขียนใหม่จากศูนย์)
3. `business-01-smart-gift\PRODUCT.md` — กติกา: ใช้ภาพสินค้าจริงที่ตรวจรหัสได้ ห้ามใช้ภาพสินค้าคล้ายกันแทน ห้ามแต่งราคา/สเปก

เป้าหมาย (brief จากเจ้าของแบรนด์):
- พื้นหลังขาวล้วน กล่องของขวัญ SmartGift อยู่ตรงกลางเฟรม
- ทั้งสองคลิปเริ่มจาก **เฟรมเดียวกันทุกพิกเซล** = กล่องปิด
- คลิป "west" (เมาส์ซ้าย → ไฟล์ `hero_west_receive.mp4` → ช่อง `videoRightUrl`): ถาดในกล่องเลื่อนออกทาง**ซ้าย** เผยสินค้าจริงด้านใน เลื่อนสุดได้แค่ **ครึ่งกล่อง** ที่ progress = 1
- คลิป "east" (เมาส์ขวา → ไฟล์ `hero_east_discover.mp4` → ช่อง `videoLeftUrl`): ถาดเลื่อนออกทาง**ขวา** ครึ่งกล่องเหมือนกัน แต่ของในถาดเป็น **สินค้า mockup ที่พิมพ์โลโก้แบรนด์ลูกค้า** (ข้อ 5)
- การเคลื่อนไหวต้องเป็น linear (ไม่มี ease) เพราะเมาส์ scrub เวลาแบบ 1:1
- ต้องการ refinement ระดับงานโฆษณา: ฝากล่องดูเป็นแลคเกอร์ด้านมีน้ำหนัก เงาสมจริง (เงากล่องบนพื้นขาว, เงาถาด, เงาขอบกล่องทาบบนถาด) ขอบกล่องมีความหนา มีโลโก้/เดบอส SmartGift บนฝา

สเปกไฟล์ส่งมอบ (ตรวจด้วย ffprobe/ffmpeg ก่อนส่ง):
- 1920×1080, 30 fps CFR, ยาว 4.0 s, H.264 High, `-g 15 -keyint_min 15 -sc_threshold 0`, `-pix_fmt yuv420p`, ไม่มีเสียง (`-an`), `-movflags +faststart`
- `hero_frame0_poster.jpg` = เฟรมแรก (1920×1080)
- เฟรมแรกของทั้งสองคลิปต้องต่างกันน้อยกว่า mean abs diff 3/255 (มีสคริปต์ตรวจใน `comfy-hero-video\scripts\conform.py` ใช้ได้เลย มันจะ copy ไฟล์ไป `web-ui-smg\public\assets\videos\` ให้ด้วย)
- กล่องสูงไม่เกิน 560 px บนเฟรม 1080 และอยู่กึ่งกลาง เพื่อไม่ทับ ledger ตัวเลขที่มุมล่างขวาของหน้าเว็บ

แอสเซ็ตที่ต้องใช้ (ทางเดียวที่อนุญาต — ห้าม generate สินค้าใหม่):
1. โลโก้ SmartGift: `C:\Users\pc\workspace\web-ui-smg\public\logo-smg.jpg` (สำเนาเดียวกันที่ `web-ui-smg\logo-smg.jpg`) — กล่องส้ม โบว์ทอง ตัว S/G สีน้ำตาลเทา tagline "The Right Gift. The Right Impact." ใช้เป็นต้นแบบเดบอสบนฝา (ทำ tone-on-tone หรือตัด SG mark ออกจากพื้นขาวมาใช้)
2. สีแบรนด์: ส้ม `#F26522` (วัดจากภาพจริงได้ RGB 235,76,3), ทองเหลือง `#C79A5B`, ไอวอรี `#F1ECE3`, charcoal `#16130F`; ฟอนต์ Anuphan (display) / IBM Plex Sans Thai (body) — ระบบไม่มีฟอนต์เหล่านี้ติดตั้ง ใช้ Segoe UI/Arial Bold แทนได้ถ้าเป็นข้อความเดบอส
3. สินค้าจริงสำหรับถาด west — ใช้ภาพ ad creative ที่ approve แล้วเท่านั้น (crop ส่วนในกล่อง):
   - `C:\Users\pc\workspace\business-01-smart-gift\output\catalog-internal\artwork\FXD66-3-adcreative-v1.png` — ชุด FXD66-3: ทัมเบลอร์ไอวอรีลายร่อง + พาวเวอร์แบงก์ส้ม + พัดลมพกพาขาว (ชุดที่ใช้ใน v2)
   - ทางเลือกในโฟลเดอร์เดียวกัน: `TMK00-4-adcreative-v1.png`, `FXD6064-adcreative-v1.png`, `TGC09-3-adcreative-v1.png`
4. สินค้า mockup แบรนด์ลูกค้า: `C:\Users\pc\workspace\web-ui-smg\public\assets\smartgift\mockups\` (1328×1328 JPG พื้นสตูดิโอเข้ม ต้องตัดพื้นก่อน — rembg 2.0.83 ติดตั้งอยู่ใน python ระบบแล้ว และมี cutout 9 ไฟล์ทำไว้ที่ `business-01-smart-gift\comfy-hero-video\assets\mockups_cut\`) รายการ แบรนด์ → ไฟล์ → สินค้า:
   - GMMTV → `gmmtv_tmb.jpg` ทัมเบลอร์สแตนเลสขาว · `gmmtv_pb.jpg` พาวเวอร์แบงก์ขาว · `gmmtv_mug.jpg` แก้วมัคขาว · `gmmtv_tote.jpg` กระเป๋าผ้าดิบ · `gmmtv.jpg` แท่นชาร์จ/พาวเวอร์แบงก์ขาว
   - True → `truepride.jpg` ที่ใส่การ์ดหนังสีแทน
   - UD Trucks → `udtrucks.jpg` ทัมเบลอร์มีหูดำ
   - CP → `cpli.jpg` สมุดโน้ตดำโลโก้ใบไม้เขียว
   - One Bangkok → `ob_bottle.jpg` กระบอกน้ำดำ · `ob_mug.jpg` แก้วมัคดำ · `ob_nb.jpg` สมุดหนังดำ · `ob_card.jpg` ที่ใส่การ์ดหนังดำ · `obt_black.jpg` / `obt_grey.jpg` / `obt_hook.jpg` / `obt_silver.jpg` กระเป๋าผ้า
   - One31 → `one31_tmb.jpg` ทัมเบลอร์ดำ · `one31_pb.jpg` พาวเวอร์แบงก์ดำ · `one31_nb.jpg` สมุดดำ · `one31_tote.jpg` กระเป๋าผ้าดำ
   - Starbucks → `sbux_tmb.jpg` ทัมเบลอร์เขียว · `sbux_bottle.jpg` กระบอกน้ำขาว · `sbux_mug.jpg` แก้วมัคครีม · `sbux_tote.jpg` กระเป๋าผ้าเขียว
   - Iconsiam → `icon_stick.jpg` / `icon_stick_stand.jpg` / `icon_stick_lit.jpg` แท่งไฟ
   - ไฟล์โลโก้แบรนด์ (PNG/SVG) เผื่อต้องประทับเพิ่ม: `C:\Users\pc\workspace\business-01-smart-gift\comfy-3d-products\assets\logos\` (cpgroup, gmmtv, iconsiam, one31, onebangkok, oneenterprise, starbucks, truecorp, udtrucks) และสคริปต์ประทับโลโก้ `comfy-3d-products\scripts\stamp_logo.py`
   - สินค้าหลัก (PM) ที่ผูกกับแบรนด์ลูกค้าตาม `web-ui-smg\src\data\coreMedia.ts` (client_showcase): PM-BOTTLE-LED → One Bangkok, Starbucks · PM-CFMUG → GMMTV, Starbucks · PM-MUG-HEAT → One Bangkok, GMMTV · PM-NB → One31, One Bangkok · PM-PB10K → GMMTV, One31 · PM-TMB → Starbucks, GMMTV, One31 · PM-UMB → One Bangkok
5. ของที่ต้องอยู่ในถาด east (ครึ่งที่โผล่ออกมาต้องเห็นชัด 2 ชิ้น): ค่าตั้งต้น = GMMTV ทัมเบลอร์ (`gmmtv_tmb`) + True ที่ใส่การ์ด (`truepride`) ส่วนครึ่งที่ซ่อน = UD Trucks ทัมเบลอร์ (`udtrucks`) + GMMTV พาวเวอร์แบงก์ (`gmmtv_pb`) — **ข้อจำกัด:** ตามเอกสาร `business-01-smart-gift\docs\business\2026-09-07-client-work-evidence-and-mockups.md` มีหลักฐานงานจริงเฉพาะ UD Trucks กับ CP/True และ GMMTV เป็นลูกค้าอันดับ 1 ตามยอดวางบิล ส่วน Starbucks / One Bangkok / One31 / Iconsiam ยังไม่มีหลักฐานในระบบ ถ้าจะใช้แบรนด์เหล่านั้นต้องให้เจ้าของแบรนด์ยืนยันก่อน และ mockup ทุกไฟล์เป็นภาพจำลอง AI ไม่ใช่ภาพงานจริง ห้ามเขียนว่าเป็นภาพงานจริง

ขั้นตอนที่คาดหวัง:
1. ปรับ/ต่อยอด `drawer_v2.py` (หรือ Blender/three.js ถ้าทำได้ดีกว่า แต่ output ต้องเป็นสินค้าจริงจากไฟล์ข้างต้น) ให้ได้ความสมจริงขึ้น: perspective เล็กน้อยให้เห็นความหนากล่อง, วัสดุฝา, เงา, โลโก้/เดบอสจาก logo-smg.jpg
2. ผลิต 2 คลิป + poster → รัน `python scripts\conform.py <west.mp4> <east.mp4>` ใน `comfy-hero-video` (ต้องได้ frame0_parity_ok = true, iframes = 8)
3. copy poster ไป `web-ui-smg\public\assets\videos\hero_frame0_poster.jpg`
4. ใน `web-ui-smg`: `npm run build` แล้ว `docker compose up -d --build` (รันจาก Git Bash ตรง ๆ ไม่ผ่าน `cmd /c`) ตรวจ `http://localhost:8080/assets/videos/hero_west_receive.mp4` ได้ 200
5. ส่ง contact sheet 9 เฟรมต่อคลิป (t = 0, 0.5 … 3.95 s) ให้ดูก่อนสรุป และบันทึกสิ่งที่เปลี่ยนใน `docs\HERO-VIDEO-BRAND-DIRECTION.md` เป็น §11 "Production log — v3"

ห้าม: เปลี่ยนชื่อไฟล์วิดีโอ/ช่อง config, ใส่ข้อความหรือราคาในวิดีโอ, ใช้ภาพสินค้าที่ไม่ได้อยู่ในรายการข้างต้น, ใส่เสียง, ใช้ ease/การเคลื่อนไหวย้อนกลับ, แก้ไฟล์ใน `data-pipeline\`
