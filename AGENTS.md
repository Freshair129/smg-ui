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
│   ├── HERO-VIDEO-BRAND-DIRECTION.md # Brand analysis, Giving-Axis storyboard, SG-1/2/3 prompts
│   ├── CATALOG-STRUCTURE-SPEC.md # Two-lens IA: recipient-first + standard categories (L1/L2)
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
│   │   ├── smartGiftCatalogData.ts      # Adapter for SmartGiftCatalogSection (derived from the pool)
│   ├── catalogTaxonomy.ts           # Themes, tiers, 7 standard categories, 35 families, routes (hand-authored)
│   ├── catalogItems.generated.ts    # GENERATED core layer (16 PM + 6 sets) — npm run build:catalog
│   ├── catalogItems.ts              # Item pool: core + partner + lazy supplier layer, display helpers
│   ├── coreMedia.ts                 # Hand-curated images / 3D / mockups / copy per PM
│   │   └── unifiedBLineCatalog.ts       # B—Line partner pieces only (not SmartGift SKUs)
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

## 5. Catalog Architecture — Two Lenses, One Item Pool

Spec: [`docs/CATALOG-STRUCTURE-SPEC.md`](file:///c:/Users/pc/workspace/web-ui-smg/docs/CATALOG-STRUCTURE-SPEC.md). Gift Tiers (Reach / Select / Signature / Bespoke) are levels of treatment, **not** product categories.

```
ITEM POOL  src/data/catalogItems.ts  (CatalogItem[])
├── core layer (GENERATED from the SSOT by `npm run build:catalog`)
│   ├── 16 PM singles  PM-BOTTLE-LED PM-FAN PM-TMB PM-UMB (eco-friendly) · PM-FLASH PM-PEN PM-TEA-INF (classic-oriental)
│   │                  PM-AROMA PM-CFMUG PM-CUTLERY PM-MSG PM-MUG-HEAT (novelty-self-care) · PM-DESK-MAT PM-NB PM-PB10K PM-SPK (executive-smart-tech)
│   └── 6 core sets    TDD03-2 (Select) · TGC06-4 (Signature) · TMK0215 (Signature) · TWL01-8 (Select) · XMAS-2026 / NY-2027 (Reach, no price yet)
├── supplier layer (public/catalog/data/supplier-items.json, lazy) — 216 public-eligible offers of 1,110; counts in SUPPLIER_LAYER_META
└── partner layer  B—Line design pieces (unifiedBLineCatalog.ts) — shown only under #bline

Lens A  #catalog            เริ่มจากผู้รับ : gifting brief ?recipient=&occasion=&tier=&qty= (ให้ใคร→เพื่ออะไร→ระดับไหน→จำนวน) → recommended sets → singles by theme
Lens B  #catalog/category   หมวดหมู่สินค้า : 7 standard categories (L1) → 35 product families (L2)
Views   grid (default) · list (?view=list, spec table) · index (category / theme sections) · search (?q=, all layers)
Deep link  #catalog/item/<code>   Partner  #bline   Bundle builder  #catalog/bundle[/<PKG-code>]?g=tier:set:qty|…
```

3D `.glb` twins exist for 9 PMs but all 16 are still `held` in the SSOT coverage report — the UI labels them **3D · DRAFT**. Client mockups are concept renders, labelled "ภาพจำลอง", never evidence of delivered work.

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

### 6.2 Updating Catalog Data (never hand-type prices)
1. Facts (names, prices, dimensions, BOM) come from the SmartGift SSOT: `../business-01-smart-gift/data-pipeline/02_prepared/`.
2. Regenerate the pool: `cmd /c "npm run build:catalog"` (add `-- --from <path>` if the SSOT repo lives elsewhere). This rewrites `src/data/catalogItems.generated.ts` and `public/catalog/data/supplier-items.json`.
3. Media for a PM (plate, `.glb`, mockups, copy) lives in [`src/data/coreMedia.ts`](file:///c:/Users/pc/workspace/web-ui-smg/src/data/coreMedia.ts). Only use a plate that shows the same product type; otherwise leave `image` unset and the card renders a placeholder.
4. New product family or standard category → edit [`src/data/catalogTaxonomy.ts`](file:///c:/Users/pc/workspace/web-ui-smg/src/data/catalogTaxonomy.ts) (`PRODUCT_FAMILIES`, `PM_FAMILY`) — the generator reads these tables.
5. Rebuild: `cmd /c "npm run build" && cmd /c "docker compose up -d --build"`.

### 6.2b Brief intake (P5)
- The "ขอใบเสนอราคา" panel and the bundle builder send a `smartgift-brief/1` JSON (contract: [`docs/CATALOG-STRUCTURE-SPEC.md`](file:///c:/Users/pc/workspace/web-ui-smg/docs/CATALOG-STRUCTURE-SPEC.md) §11) through `src/data/briefSubmit.ts`: webhook → mailto → clipboard.
- Configure at build time via `.env` (see `.env.example`): `VITE_BRIEF_ENDPOINT` (zuri-ai CRM intake, pending its CR), `VITE_SALES_EMAIL`, `VITE_LINE_OA_URL`. With none set the panel copies the summary to the clipboard and says so.
- Never persist contact details in this app (localStorage, JSON, logs). The CRM is the store of record.

### 6.3 Updating Hero Videos
- Refer strictly to [`docs/HERO-VIDEO-SPEC.md`](file:///c:/Users/pc/workspace/web-ui-smg/docs/HERO-VIDEO-SPEC.md).
- Ensure continuous linear motion, zero cuts, and `-g 15` keyframe interval.

---

## 7. Key References
- **UI Inventory & Media Slots:** [`docs/INTERFACE-INVENTORY.md`](file:///c:/Users/pc/workspace/web-ui-smg/docs/INTERFACE-INVENTORY.md)
- **Hero Video & Prompt Handbook:** [`docs/HERO-VIDEO-SPEC.md`](file:///c:/Users/pc/workspace/web-ui-smg/docs/HERO-VIDEO-SPEC.md)
- **Visual Sitemap & Route Tree:** [`docs/SITEMAP.md`](file:///c:/Users/pc/workspace/web-ui-smg/docs/SITEMAP.md)
