# HERO VIDEO SPECIFICATION & PROMPT ENGINEERING HANDBOOK
**Project:** SmartGift Archive & B—Line UI (`web-ui-smg`)  
**Target Audience:** Autonomous AI Agents (Antigravity, Claude, Cursor, ChatGPT) & Creative Developers  
**Document Version:** `1.0.0`  
**Last Updated:** 2026-09-07  

---

> **Brand direction (added 2026-09-07):** creative direction, storyboard, brand-correct palette (warm charcoal + brass + SmartGift orange, no cyan) and the product-faithful pipeline live in [`HERO-VIDEO-BRAND-DIRECTION.md`](HERO-VIDEO-BRAND-DIRECTION.md). Where §5.1 rule 4 or the §6 presets conflict with that document, the brand direction wins.

## 1. Executive Summary & Purpose

This document is the canonical technical specification and prompt engineering manual for the **Dual-Video Interactive Hero Section** in the SmartGift web application.

Any AI Agent or engineer tasked with creating, modifying, replacing, or configuring videos for the Hero Section **MUST** adhere to the interaction mechanics, video encoding constraints, and prompt formulas defined in this handbook.

---

## 2. Interactive Architecture & Runtime Mechanics

### 2.1 The Dual-Video Scrubber Engine
The Hero Section ([`#main-canvas`](file:///c:/Users/pc/workspace/web-ui-smg/src/App.tsx)) is NOT a passive looping background video. It is a **bidirectional, mouse-scrubbed interactive canvas**:

```
 ┌───────────────────────────────┬───────────────────────────────┐
 │          LEFT HALF            │          RIGHT HALF           │
 │       (Video Right Shown)     │       (Video Left Shown)      │
 │  Scrub Progress: 1.0 ◄─── 0.0 │  Scrub Progress: 0.0 ───► 1.0 │
 │                               │                               │
 │   Center Deadzone (±5% W)     │                               │
 └───────────────────────────────┴───────────────────────────────┘
```

### 2.2 Mathematical Implementation in Code ([`src/App.tsx`](file:///c:/Users/pc/workspace/web-ui-smg/src/App.tsx))
- **Mouse Coordinate Tracking**:
  ```typescript
  const width = window.innerWidth
  const dead = Math.max(30, width * 0.05) // Deadzone around center axis
  const center = width / 2

  if (Math.abs(event.clientX - center) <= dead) return

  // Active video selection
  active = event.clientX < center - dead ? 'right' : 'left'
  const shown = active === 'left' ? left : right
  const hidden = active === 'left' ? right : left

  shown.style.display = 'block'
  hidden.style.display = 'none'

  // Scrub progress calculation (0.0 to 1.0)
  const range = Math.max(1, center - dead)
  const progress = active === 'right'
    ? (center - dead - event.clientX) / range
    : (event.clientX - center - dead) / range

  // Real-time timeline scrubbing
  if (Number.isFinite(shown.duration) && !shown.seeking) {
    shown.currentTime = Math.max(0, Math.min(1, progress)) * shown.duration
  }
  ```

### 2.3 Touch / Mobile Fallback
For touchscreen devices (`pointer: coarse`) or reduced-motion preference, the timeline scrubbing switches to an alternating auto-play loop:
`Video Left (play) -> ended -> Video Right (play) -> ended -> Video Left (repeat)`.

---

## 3. Strict Technical Video Specifications (Asset Matrix)

| Parameter | Mandatory Value | Rationale |
|---|---|---|
| **Container Format** | `MP4` | Maximum hardware-accelerated decoding across Chromium, WebKit, and Gecko |
| **Video Codec** | `H.264 (AVC)` / High Profile | Uniform compatibility; AV1/HEVC may experience frame-seeking latency on older GPUs |
| **Aspect Ratio** | `16:9` (Landscape) | Fits desktop viewport with `object-fit: cover` |
| **Resolution** | `1920 × 1080 px` (1080p) | Optimal balance between visual crispness and memory footprint |
| **Target Bitrate** | `3.5 – 5.5 Mbps` | Ensures fast buffer fill without blocky compression artifacts |
| **Duration** | `3.0 to 5.0 seconds` | Shorter clips scrub with high responsiveness; clips > 6s feel sluggish to mouse velocity |
| **Frame Rate** | `30 fps` or `60 fps` (CFR) | Constant Frame Rate is mandatory for frame-accurate time scrubbing |
| **Audio Track** | **None (Muted / Strip audio)** | Hero canvas is muted; stripped audio reduces asset payload by ~15% |
| **Pixel Format** | `yuv420p` | Universal color space supported by all modern browsers |
| **Keyframe Interval (GOP)** | **Every 10–15 frames (`-g 15`)** | **CRITICAL:** HTML5 video scrubbing requires frequent I-frames (keyframes). If GOP is default (250), seeking will skip and lag violently |
| **Moov Atom Location** | Beginning (`+faststart`) | Allows immediate playback/scrubbing before entire file downloads |

---

## 4. FFmpeg Optimization Pipeline

Whenever an AI video tool exports a raw MP4, **YOU MUST** run this optimization command before deploying to production:

```bash
ffmpeg -i raw_ai_output.mp4 \
  -vf "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080" \
  -c:v libx264 \
  -preset slow \
  -crf 20 \
  -g 15 \
  -keyint_min 15 \
  -sc_threshold 0 \
  -pix_fmt yuv420p \
  -an \
  -movflags +faststart \
  optimized_hero_video.mp4
```

### Explanation of Flags for Agents:
- `-g 15 -keyint_min 15`: Forces an I-frame (keyframe) every 15 frames (0.5 seconds at 30fps). This enables silky-smooth cursor scrubbing.
- `-sc_threshold 0`: Disables scene-change keyframe insertion variance.
- `-an`: Strips audio track completely.
- `-movflags +faststart`: Moves metadata atom (`moov`) to the start of the MP4 container.

---

## 5. AI Video Generation Prompt Framework

### 5.1 The 5 Golden Rules of Hero Video Prompts
1. **Single Continuous Take (No Cuts)**: Never allow multiple scenes, cuts, or transitions. The camera or subject must move in one continuous take.
2. **Linear Unidirectional Motion**: The motion vector must be continuous (e.g., orbiting clockwise, continuous 180° pan, smooth forward tracking). Back-and-forth oscillation in the video confuses the mouse scrubbing.
3. **Complementary Left/Right Pairs**:
   - `videoLeft`: Typically camera panning/orbiting right-to-left or front-to-profile.
   - `videoRight`: Typically camera panning/orbiting left-to-right or profile-to-detail.
4. **Dark Minimalist Studio Void**: Background should be obsidian `#000000`, deep graphite `#111319`, or dark charcoal studio to integrate seamlessly with the web page design.
5. **Slow Motion & Stabilized**: High shutter speed, slow motion, zero camera vibration or hand shake.

### 5.2 Mandatory Negative Prompts (Must Append)
```text
cuts, jump cuts, montage, transitions, camera shake, handheld, fast jerky movement, flicker, sudden stop, text, watermark, logo overlay, bright white background, blurry, low resolution
```

---

## 6. Curated Production Prompts (Ready to Deploy)

### Preset A: High-Fashion Archive Model (Original Editorial Style)
*Best for: Brand prestige, fashion-forward corporate image, apparel and wearables collection.*

#### Left Video Prompt (`videoLeftUrl`):
```text
A continuous single-take fashion editorial shot. An elegant avant-garde model wearing minimalist high-fashion black streetwear, gracefully holding a sleek matte-black executive tumbler. The model slowly turns 90 degrees from side profile to front-facing in ultra-slow motion. Cinematic studio key lighting with a soft luminous cyan rim light sculpting the silhouette. Seamless pure obsidian black studio void background. Ultra-smooth 60fps linear movement, zero camera shake, no cuts, photorealistic 8K lookbook aesthetic.
```

#### Right Video Prompt (`videoRightUrl`):
```text
A continuous single-take fashion editorial shot. The same high-fashion model in minimalist black luxury apparel, captured in a slow cinematic camera orbit moving steadily from front view to three-quarter back view. Subtle fluid garment movement in slow motion. Dramatic dual rim lighting with gentle warm and cool highlights, deep blacks, high dynamic contrast. Seamless continuous motion, 60fps, no cuts, editorial luxury aesthetic.
```

---

### Preset B: Executive SmartGift & Tech Merchandise (B2B Products)
*Best for: Corporate gifting, technology gifts, stainless drinkware, executive tech products.*

#### Left Video Prompt (Product 180° Orbit):
```text
A continuous luxury product commercial shot. A matte-black smart LED vacuum temperature bottle standing on an obsidian reflective turntable. The camera smoothly orbits 180 degrees around the bottle at a constant, buttery smooth linear velocity. Sophisticated corporate studio lighting featuring dual softbox rim lights catching the brushed metal edges and laser-etched branding. Floating micro dust particles in slow motion. Deep dark graphite background, photorealistic 4K, zero camera shake, uninterrupted single take.
```

#### Right Video Prompt (Gift Box Unboxing & Reveal):
```text
A continuous luxury commercial macro shot. An executive corporate magnetic gift box slowly sliding open in steady slow motion to reveal custom-fitted black tech accessories and a metallic power bank inside. The camera performs a smooth linear forward push-in with a slight downward crane angle. Precision studio lighting glinting off metallic surfaces. Minimalist dark aesthetic, 60fps, flawless continuous motion, no cuts.
```

---

### Preset C: Italian Minimalist Design (B—Line Architectural Classics)
*Best for: B-Line furniture, iconic interior design objects, architectural elegance.*

#### Prompt:
```text
An iconic Italian minimalist design furniture piece showcased on an architectural dark pedestal. The pedestal performs a steady 360-degree continuous rotation in slow motion. Sculptural lighting inspired by Bauhaus and Italian modernism, casting sharp geometric soft shadows against a rich dark neutral background. Smooth linear rotational velocity, perfectly stabilized, zero wobble, no cuts, hyper-realistic, 8K architectural render style.
```

---

## 7. How to Update Videos in the Live Application

Agents can deploy new hero videos using two methods:

### Method 1: In-App Live Configuration (Immediate / No Rebuild)
1. Open the web app: `http://localhost:8080/`
2. Open DevTools or enable `devMode` (press `Ctrl + Shift + D` or open Dev drawer).
3. Click **`[ ⚙️ MEDIA CONFIG ]`** on the top right.
4. Paste the new video URLs into `videoLeftUrl` and `videoRightUrl`.
5. The state automatically saves to `localStorage` (`smg_media_config`) and refreshes immediately.

### Method 2: Codebase Default Update (Permanent)
1. Save the optimized video files into `c:\Users\pc\workspace\web-ui-smg\public\assets\videos\`.
2. Update [`src/config/mediaConfig.ts`](file:///c:/Users/pc/workspace/web-ui-smg/src/config/mediaConfig.ts):
   ```typescript
   export const DEFAULT_MEDIA_CONFIG: MediaConfigState = {
     logoUrl: '/logo-smg.jpg',
     videoLeftUrl: '/assets/videos/hero_left_optimized.mp4',
     videoRightUrl: '/assets/videos/hero_right_optimized.mp4',
     ...
   }
   ```
3. Rebuild and deploy container:
   ```bash
   cmd /c "npm run build"
   cmd /c "docker compose up -d --build"
   ```

---

## 8. Agent Verification Checklist

Before reporting task completion, the agent MUST verify:
- [ ] Both MP4 files have keyframes at least every 15 frames (`-g 15`).
- [ ] No audio track exists in the MP4 container.
- [ ] Video files load with `HTTP 200 OK` or `206 Partial Content`.
- [ ] Mouse movement left/right causes smooth scrub without visual stutter or freeze.
- [ ] Mobile/touch test: video alternates automatically when clicked or on touch screen.
- [ ] Center deadzone (±5%) prevents video flickering when the mouse crosses the middle.
