# INTERFACE INVENTORY & UI COMPONENT REGISTRY
**Project:** SmartGift Archive Collection & B-Line Design Catalog — Web UI (`web-ui-smg`)  
**Version:** `1.1.0`  
**Status:** Candidate / Production Ready  
**Last Updated:** 2026-09-07  

---

## 1. Executive Summary

This document serves as the canonical **Interface Inventory and UI Component Audit Registry** for the SmartGift Web UI application (`web-ui-smg`). It documents all user interface surfaces, components, design system tokens, media slots, resolution specifications, overlay layers, authoring tools, catalog extensions, and container deployment contracts.

---

## 2. Technology Stack & Architectural Principles

| Layer | Technology / Library | Version | Purpose |
|---|---|---|---|
| **Core Framework** | React | `^19.1.1` | Component UI structure & state management |
| **Language** | TypeScript | `~5.8.3` | Type safety, interface definitions & contracts |
| **Build Tool** | Vite | `^6.1.0` | Fast dev server & production bundling |
| **Styling** | Vanilla CSS + TailwindCSS v4 | `^4.1.12` | Design tokens, custom layouts & responsive utilities |
| **Scroll Animation** | GSAP (ScrollTrigger) | `^3.15.0` | Timeline scroll pinned panel transitions |
| **Motion Physics** | Motion / Framer Motion | `^12.23.3` | Spring micro-animations & header entrances |
| **Web Server** | Nginx (Alpine) | `1.31.5` | Docker container SPA routing & static asset server |

---

## 3. Surface & Route Registry

| Route / Surface ID | Surface Name | Access | Type | Status | Description |
|---|---|---|---|---|---|
| `/` (Archive View) | **Main Archive Surface** | Public | Interactive SPA | `Active` | Fullscreen interactive canvas with mouse-controlled dual video playback, smooth scroll-driven archive gallery, and purchase outro. |
| `/` (Catalog View) | **B—Line / SmartGift Catalog** | Public | Interactive Surface | `Active` | Faithful B—Line layout (`bline-section`) featuring light/dark theme toggle, giant wordmark, category tier navigation (`All`, `Eco-Friendly`, `Classic Oriental`, `Novelty & Care`, `Smart Tech`, `Bespoke (B-Line)`), 3D digital twin viewer, and volume tiered pricing calculator. |
| `[⚙️ MEDIA CONFIG]` | **Media Config Drawer** | Dev / Operator | Right Panel Drawer | `Active` | Slide-over drawer to browse/upload local media files (Logo, Videos, 10 Gallery Items), inspect resolutions, and export JSON config. |
| `[📐 GRID OVERLAY]` | **Grid & Pixel Blueprint** | Dev / Operator | On-Screen Overlay | `Active` | Technical blueprint grid lines and real-time bounding size measurements ($W \times H\text{ px}$) rendered over every media slot. |

---

## 4. UI Component & Surface Inventory

### 4.1 Header & Navigation Control (`<header>`)
- **Element Selector:** `header`, `.header-tools`, `.header-nav`, `.nav-link`
- **Z-Index Layer:** `20` (`mix-blend-mode: exclusion`)
- **Sub-components:**
  - `ARCHIVE`: Navigates to the interactive video timeline and archive collection.
  - `B—LINE CATALOG`: Switches to the exact B-Line layout catalog.
  - `[ 📐 GRID OVERLAY: ON/OFF ]`: Toggles live resolution overlay and grid lines.
  - `[ ⚙️ MEDIA CONFIG ]`: Toggles the right-side media configuration drawer.
  - `[ CART ]` & Hamburger menu icon.

### 4.2 B—Line / SmartGift Catalog Surface (`<BLineCatalogSection />`)
- **Element Selector:** `.bline-section`, `.bline-nav`, `.bline-hero`, `.bline-wordmark`, `.bline-section-label`, `.bline-grid`, `.bline-card`
- **Z-Index Layer:** `30`
- **Architecture & Layout Fidelity:**
  - **100% Strict B—Line Layout:** Preserves the exact structure, font hierarchy, `.bline-wordmark`, section divider, 4:3 card aspect ratio, and theme toggle from the user's design.
  - **Theme Support:** Instant toggle between Dark (`.dark-theme`) and Light (`.light-theme`) modes.
  - **Gift Tier Mapping:**
    - `Eco-Friendly` (Smart LED bottle, double-wall mug, tumbler, canvas tote)
    - `Classic Oriental` (Imperial tea set, mulberry paper fan, incense burner, teakwood box)
    - `Novelty & Care` (Ultrasonic diffuser, botanical candle, shiatsu neck massager, silk sleep mask)
    - `Smart Tech` (10k magnetic power bank, USB 3.2 drive, thermostatic heating mug, executive notebook, inverted umbrella)
    - `Bespoke (B-Line)` (Iconic Italian design pieces: Boby, Spinny, Ring, Linea, Arco, Polo, Cento, Orbita, Kilo, Uno, Nova)
  - **3D Filter Pill:** Option to filter specifically for items with interactive 3D twins (`🌐 3D Digital Twin`).

### 4.3 Integrated B—Line Detail Modal with Interactive Components
- **Element Selector:** `.bline-modal-backdrop`, `.bline-modal-card`, `.bline-modal-img-container`, `.bline-modal-info`
- **Z-Index Layer:** `200`
- **Integrated Components:**
  - **3D Digital Twin Viewer (`<ModelViewer>`):** Full 360° rotation and camera inspection inside the B—Line modal card with toggle pills (`3D Orbit` / `Photo` / `Client Showcase`).
  - **Client Showcase Integration:** Displays enterprise mockups (Starbucks, One Bangkok, GMMTV, Iconsiam, True).
  - **B2B Volume Tiered Pricing Calculator:** Quantity pills (10, 50, 100, 300, 500, 1000 pcs) dynamically recalculating unit cost, total budget, and percentage discount.
  - **Inquiry Flow:** Interactive CTA button submitting quotation request.
  - **Action & Spec Sheet:** Interactive quotation request flow with instant confirmation banner and PDF/3D asset download buttons.

### 4.4 Interactive Video Canvas (`#main-canvas`)
- **Element Selector:** `#main-canvas`, `leftVideo`, `rightVideo`
- **Z-Index Layer:** `0` (Fixed background)
- **Behavior:** Dual MP4 video elements with cursor scrubbing timeline control.

### 4.5 Media Configuration Panel Drawer (`<MediaConfigModal />`)
- **Element Selector:** `.config-panel-backdrop`, `.config-panel-container`
- **Z-Index Layer:** `100`

### 4.6 Resolution & Live Pixel Measurement Overlay (`<ResolutionOverlay />` & `<CardOverlay />`)
- **Element Selector:** `.resolution-overlay-layer`, `.card-res-overlay`, `.grid-blueprint-lines`
- **Z-Index Layer:** `40`

---

## 5. Media & Asset Inventory

| Slot ID | Asset Name | Media Type | Recommended Aspect Ratio | Target Resolution | Recommended Format | Location / Source |
|---|---|---|---|---|---|---|
| `logo` | Brand Logo | Image | `1:1` (Square) | `500 × 500 px` | PNG (Transparent) / JPG | `public/logo-smg.jpg` |
| `videoLeft` | Background Video (Left) | Video | `16:9` (Landscape) | `1920 × 1080 px` | MP4 (H.264, Muted) | CloudFront / Local |
| `videoRight` | Background Video (Right) | Video | `16:9` (Landscape) | `1920 × 1080 px` | MP4 (H.264, Muted) | CloudFront / Local |
| `gallery-0` .. `gallery-9` | Gallery Product Items 1–10 | Image | `2:3` (Portrait) | `1200 × 1800 px` | WebP / PNG / JPG | Higgs AI CDN / Local |
| `sg-3d-models` | 9 Canonical 3D GLB Models | 3D Asset | Free 3D Orbit | High-Poly Mesh | GLB (Binary glTF) | `public/assets/smartgift/3d/` |
| `sg-mockups` | Corporate Brand Client Mockups | Image | Varied / Landscape | 2K Resolution | JPG / WebP | `public/assets/smartgift/mockups/` |
| `sg-plates` | Photorealistic Product Plates | Image | `1:1` (Square) | 1024 × 1024 px | PNG | `public/assets/smartgift/plates/` |

> 📘 **Hero Video Specification & Prompt Handbook:** See [docs/HERO-VIDEO-SPEC.md](file:///c:/Users/pc/workspace/web-ui-smg/docs/HERO-VIDEO-SPEC.md) for full interactive mechanics, encoding pipelines, GOP interval requirements, and AI prompt engineering library.

---


## 6. Design System Tokens

### 6.1 Typography
- **Primary Font Family:** `"Inter Tight", Arial, sans-serif`
- **Code & SKU Font:** `monospace` (Consolas, Menlo, Monaco)
- **Weights Used:** `500` (Medium), `600` (SemiBold), `700` (Bold), `800` (ExtraBold), `900` (Black)

### 6.2 Color Palette
| Token Name | Hex / Value | Usage |
|---|---|---|
| `--color-bg-dark` | `#090a0f` / `#111319` | SmartGift B2B Catalog & dark theme backgrounds |
| `--color-card-bg` | `#111319` / `#13151f` | Product cards & pricing calculator card background |
| `--color-accent-cyan` | `#00f2fe` | 3D badges, active category pills, total pricing value |
| `--color-accent-pink` | `#ff0055` | Primary CTA, quotation request buttons & alert accents |
| `--color-accent-emerald` | `#10b981` | Bulk price tags, savings chips, operational status indicator |
| `--color-text-main` | `#ffffff` / `#f8fafc` | Primary titles & numeric figures |
| `--color-text-muted` | `#94a3b8` / `#64748b` | Descriptions, secondary English titles, specifications |

---

## 7. Container & Deployment Specification

| Service | Image Base | Port Mapping | Routing Strategy | Status |
|---|---|---|---|---|
| `web-ui-smg` | `node:20-alpine` -> `nginx:alpine` | `8080:80` | Nginx SPA Fallback (`try_files $uri $uri/ /index.html`) | `Deployed (Running)` |

---

## CHANGELOG & AUDIT LOG

| Version | Date | Status | Summary | Agent / Author |
|---|---|---|---|---|
| `1.0.0` | 2026-09-07 | Candidate | Created canonical Interface Inventory document; cataloged all 13 media slots, components, design tokens, right drawer, and live grid overlay. | Antigravity AI |
| `1.1.0` | 2026-09-07 | Candidate | Integrated B—Line Italian Design Catalog (`BLineCatalogSection`) with 12 designer products, filter categories, theme toggles, modal dialogs, and navigation routing. | Antigravity AI |
| `1.2.0` | 2026-09-07 | Production Ready | Designed and integrated the SmartGift B2B Corporate Catalog (`SmartGiftCatalogSection`): 4 core categories, 16 canonical products, 9 interactive 3D twins (`<model-viewer>`), volume tiered pricing engine (10-1000 pcs), and enterprise client brand cases (Starbucks, One Bangkok, GMMTV, Iconsiam, True). | Antigravity AI |

