# AGENTS.MD — AI AGENT & DEVELOPER PLAYBOOK
**Repository:** SmartGift Web UI (`web-ui-smg`)  
**Workspace:** `c:\Users\pc\workspace\web-ui-smg`  
**Target Audience:** All Autonomous AI Agents (Antigravity, Claude, ChatGPT, Cursor) & Human Engineers  
**Version:** `1.3.0`  
**Last Updated:** 2026-09-07  

---

## 1. Mission & Repository Identity

`web-ui-smg` is the flagship web front-end for **SmartGift (Thailand)**. It blends high-end interactive luxury brand storytelling with a practical corporate B2B catalog:

1. **Archive Experience (`/` or `#archive`)**:
   - Dual-video bidirectional timeline scrubber powered by mouse X coordinates.
   - Pinned GSAP ScrollTrigger gallery showcasing archive collection lookbook garments.
   - Custom blend-mode cursor (`↗`).
2. **B—Line / SmartGift Catalog (`/#bline` or `/#catalog`)**:
   - 100% faithful adherence to the **B—Line Italian Design** layout.
   - Light/Dark theme switching (`☀️ LIGHT` / `🌙 DARK`).
   - Colossal wordmark header (`SmartGift` / `B—Line`).
   - 27 curated canonical products mapped into 5 Gift Tiers (including Bespoke B-Line Italian design classics).
   - In-modal interactive Google `<model-viewer>` (9 products with 3D `.glb` digital twins).
   - In-modal real-time B2B tiered volume pricing calculator (10, 50, 100, 300, 500, 1000 pcs).
   - In-modal enterprise client brand showcases (Starbucks, One Bangkok, GMMTV, Iconsiam, True).
3. **Developer & Operator Tools**:
   - `[ ⚙️ MEDIA CONFIG ]`: Live slide-over drawer to configure logo, video URLs, and gallery images.
   - `[ 📐 GRID OVERLAY ]`: Technical blueprint grid lines and real-time bounding size measurements ($W \times H\text{ px}$).

---

## 2. Hard Invariants & Guardrails (DO NOT BREAK)

### ⚠️ RULE 1: Strict B—Line Layout Fidelity
- When working on the catalog surface, **NEVER** introduce foreign dashboard, portal, or generic e-commerce layouts.
- **Always preserve**:
  - Class prefix: `.bline-*` ([`src/index.css`](file:///c:/Users/pc/workspace/web-ui-smg/src/index.css))
  - Header: `.bline-nav` with category links and theme toggle
  - Hero wordmark: `.bline-wordmark` (`clamp(64px, 12vw, 160px)` with line-height 0.9)
  - Section label bar: `.bline-section-label` with pill filters
  - Cards: `.bline-card` with **4:3 aspect ratio** (`.bline-card-img-wrap`)
  - Modal: `.bline-modal-card` (2-column layout: left media, right info/pricing)
  - Footer: `.bline-footer`

### ⚠️ RULE 2: Scroll Hijack Prevention
- The Archive landing page uses GSAP ScrollTrigger with a dynamically calculated height on `#scroll-spacer` and `cursor: none`.
- The Catalog view MUST ALWAYS be rendered inside an isolated `.bline-page-wrapper` with:
  ```css
  user-select: auto;
  cursor: auto;
  overflow-y: auto;
  ```
- Failure to maintain this isolation causes the catalog to scroll away or become unbrowsable.

### ⚠️ RULE 3: Zero Circular Dependencies
- Data files in [`src/data/`](file:///c:/Users/pc/workspace/web-ui-smg/src/data/) must NEVER import from React components in [`src/components/`](file:///c:/Users/pc/workspace/web-ui-smg/src/components/).
- All data models, arrays, and types (e.g. `BLINE_PRODUCTS`, `UNIFIED_CATALOG_ITEMS`) must reside strictly within `src/data/` and be imported by components.

### ⚠️ RULE 4: Windows Execution Policy Guardrail
- On this Windows machine, PowerShell script execution policies block `npm.ps1`.
- **Always prefix CLI commands with `cmd /c`**:
  ```bash
  cmd /c "npm run build"
  cmd /c "docker compose up -d --build"
  cmd /c "git status"
  ```

### ⚠️ RULE 5: Nginx Caching Contract
- Static assets under `/assets/` are hashed by Vite and cached for 1 year (`immutable`).
- `index.html` MUST have `Cache-Control: no-cache, no-store, must-revalidate` in [`nginx.conf`](file:///c:/Users/pc/workspace/web-ui-smg/nginx.conf). Do not remove these headers.

---

## 3. Technology Stack & Key Libraries

| Technology | Version | Purpose in this Repo |
|---|---|---|
| **React** | `^19.1.1` | Component structure, state, and hooks |
| **TypeScript** | `~5.8.3` | Strong types, interfaces, data contracts |
| **Vite** | `^6.1.0` | Fast dev server, build bundling |
| **TailwindCSS** | `^4.1.12` | Atomic utility styling |
| **Vanilla CSS** | — | Layout tokens, B—Line design system, animations |
| **GSAP + ScrollTrigger** | `^3.15.0` | Timeline scroll pinned transitions in Archive mode |
| **Motion (Framer)** | `^12.23.3` | Spring micro-animations, header reveals |
| **Google `<model-viewer>`** | `^4.0.0` | 3D GLB digital twin interactive 360° inspector |
| **Nginx (Alpine)** | `1.31.5` | Docker container production web server |

---

## 4. Repository Directory Map

```
web-ui-smg/
├── docs/
│   ├── INTERFACE-INVENTORY.md   # Complete UI component & media slot audit
│   ├── HERO-VIDEO-SPEC.md       # Video mechanics, GOP requirements, prompt handbook
│   └── SITEMAP.md               # Visual hierarchy, URL hashes, and component tree
├── public/
│   ├── assets/
│   │   └── smartgift/
│   │       ├── 3d/              # 9 Canonical GLB models (PM-BOTTLE-LED, PM-CFMUG, etc.)
│   │       ├── mockups/         # Real client mockups (Starbucks, One Bangkok, GMMTV)
│   │       └── plates/          # High-resolution photorealistic product plates
│   ├── catalog/                 # Legacy self-contained catalog
│   └── logo-smg.jpg             # Brand logo
├── src/
│   ├── components/
│   │   ├── BLineCatalogSection.tsx      # Canonical B-Line layout catalog surface
│   │   ├── MediaConfigModal.tsx         # [⚙️ MEDIA CONFIG] slide-over drawer
│   │   ├── ResolutionOverlay.tsx        # [📐 GRID OVERLAY] live blueprint & px bounds
│   │   └── SmartGiftCatalogSection.tsx  # Alternate standalone catalog view
│   ├── config/
│   │   └── mediaConfig.ts               # Default media URLs, slot specs, state types
│   ├── data/
│   │   ├── smartGiftCatalogData.ts      # 16 SmartGift corporate products + categories
│   │   └── unifiedBLineCatalog.ts       # Unified dataset: 16 corporate + 11 B-Line items
│   ├── App.tsx                          # Root application, view state, GSAP timeline
│   ├── index.css                        # Design tokens, B-Line styles, media overlays
│   └── main.tsx                         # React entry point
├── Dockerfile                           # Multi-stage build (Node 20 Alpine -> Nginx Alpine)
├── docker-compose.yml                   # Port 8080:80 container service
├── nginx.conf                           # SPA fallback, MIME types, cache control
├── AGENTS.md                            # THIS FILE (Agent playbook)
└── README.md                            # Quick start overview
```

---

## 5. Catalog Architecture & Gift Tier Mapping

The application unifies 27 products across 5 canonical Gift Tiers:

```
UNIFIED CATALOG (27 Items)
├── 🌿 Eco-Friendly (4 Items)
│   ├── PM-BOTTLE-LED   (Smart LED Vacuum Bottle 500ml · One Bangkok / Starbucks) [3D]
│   ├── PM-CFMUG        (Double Wall Stainless Coffee Mug 380ml · Starbucks) [3D]
│   ├── PM-TMB          (Ceramic Coffee Tumbler with Lid 450ml · Starbucks / True) [3D]
│   └── PM-CANVAS       (Organic Cotton Canvas Tote Bag)
├── 🏮 Classic Oriental (4 Items)
│   ├── PM-TEA-SET      (Imperial Ceramic Tea Infuser Set)
│   ├── PM-SILK-FAN     (Mulberry Paper & Bamboo Folding Fan)
│   ├── PM-INCENSE      (Artisanal Ceramic Incense Burner)
│   └── PM-WOOD-BOX     (Hand-Carved Teakwood Keepsake Box)
├── 🕯️ Novelty & Care (4 Items)
│   ├── PM-DIFFUSER     (Ultrasonic Aroma Mist Diffuser)
│   ├── PM-CANDLE       (Hand-Poured Botanical Soy Wax Candle)
│   ├── PM-MSG          (Electric Shiatsu Neck Massager) [3D]
│   └── PM-SLEEP-SET    (Pure Mulberry Silk Contoured Eye Mask)
├── ⚡ Smart Tech (4 Items)
│   ├── PM-PB10K        (10,000mAh Magnetic Power Bank · True / One31) [3D]
│   ├── PM-FLASH        (High-Speed USB 3.2 Flash Drive 64GB · GMMTV) [3D]
│   ├── PM-MUG-HEAT     (Smart Thermostatic Mug with Wireless Heating) [3D]
│   ├── PM-NB           (Hardcover Notebook & Ballpoint Pen Set · GMMTV) [3D]
│   └── PM-UMB          (Automatic Inverted Umbrella · Iconsiam) [3D]
└── ✨ Bespoke (B-Line) (11 Items)
    ├── boby            (Boby Storage · Joe Colombo, 1970)
    ├── spinny          (Spinny Stool · Marc Sadler, 2003)
    ├── ring            (Ring Lamp · Marc Sadler, 2005)
    ├── linea           (Linea Stool · Marc Newson, 2012)
    ├── arco            (Arco Lamp · Michele De Lucchi, 2015)
    ├── polo            (Polo Stool · Alberto Meda, 2018)
    ├── cento           (Cento Chair · Jasper Morrison, 2019)
    ├── orbita          (Orbita Lamp · Ferruccio Laviani, 2020)
    ├── kilo            (Kilo Stool · Stefan Diez, 2021)
    ├── uno             (Uno Chair · Ronan Bouroullec, 2022)
    └── nova            (Nova Lamp · Patricia Urquiola, 2023)
```

---

## 6. Common Developer & Agent Workflows

### 6.1 Building & Running the Project
```bash
# Test TypeScript & bundle build
cmd /c "npm run build"

# Rebuild and launch the Docker container
cmd /c "docker compose up -d --build"

# Check container status
cmd /c "docker ps"

# Inspect live container logs
cmd /c "docker logs --tail 30 web-ui-smg"
```

### 6.2 Adding or Updating Catalog Products
1. Open [`src/data/unifiedBLineCatalog.ts`](file:///c:/Users/pc/workspace/web-ui-smg/src/data/unifiedBLineCatalog.ts).
2. Add the item to `smartGiftUnified` or `UNIFIED_CATALOG_ITEMS`.
3. If the product has a 3D model:
   - Ensure the `.glb` file is in `public/assets/smartgift/3d/`.
   - Set `model3d_url: '/assets/smartgift/3d/<SKU>.glb'`.
4. Rebuild: `cmd /c "npm run build" && cmd /c "docker compose up -d --build"`.

### 6.3 Updating Hero Videos
- Refer strictly to [`docs/HERO-VIDEO-SPEC.md`](file:///c:/Users/pc/workspace/web-ui-smg/docs/HERO-VIDEO-SPEC.md).
- Ensure continuous linear motion, zero cuts, and `-g 15` keyframe interval.

---

## 7. Key References
- **UI Inventory & Media Slots:** [`docs/INTERFACE-INVENTORY.md`](file:///c:/Users/pc/workspace/web-ui-smg/docs/INTERFACE-INVENTORY.md)
- **Hero Video & Prompt Handbook:** [`docs/HERO-VIDEO-SPEC.md`](file:///c:/Users/pc/workspace/web-ui-smg/docs/HERO-VIDEO-SPEC.md)
- **Visual Sitemap & Route Tree:** [`docs/SITEMAP.md`](file:///c:/Users/pc/workspace/web-ui-smg/docs/SITEMAP.md)
