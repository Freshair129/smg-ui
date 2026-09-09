---
version: "1.0.0"
created_at: "2026-09-10,RWANG,63c9e59"
last_update: "2026-09-10,RWANG"
status: active
attributes:
  domain: web-ui
  scope: web-ui-smg-interface-audit
---

# SmartGift — Interface inventory from current source

Audit date: 2026-09-10. Source revision: `63c9e59`. Scope: `web-ui-smg`; includes publicly served legacy files, excludes backend services in other repositories. Read-only source/runtime inspection; no customer brief was submitted. This audit supersedes the surface/route/API counts in INTERFACE-INVENTORY.md dated 2026-09-07. No application code or deployment changed.

## Counting rules and totals

A surface is a distinct page, modal, form panel, or operator overlay. Tabs, cards, gallery chapters, filters and loading/error states are subordinate controls, not extra surfaces. Desktop/mobile variants share one surface. Shared product-detail and brief components count once even with multiple entry points.

| Inventory | Count | Meaning |
| --- | ---: | --- |
| User surfaces | 13 | 9 in React app, 4 in standalone legacy catalog |
| Page-level surfaces | 6 | Home, recipient catalog, category catalog, partner collection, bundle builder, legacy catalog |
| Panels/dialogs/overlays | 7 | 4 in React, 3 in legacy |
| Logical route patterns | 15 | 14 SPA patterns including normalized home aliases, plus standalone /catalog/ |
| HTML entry documents | 2 | /index.html and /catalog/index.html; / and /catalog/ are canonical entrances |
| First-party backend API handlers | 0 | Nginx static hosting; no REST/GraphQL/auth/upload server in this repo |
| Public JSON resource URLs | 9 | Static GET resources; not business API handlers |
| Optional outbound business API integration | 1 | POST configured VITE_BRIEF_ENDPOINT; no endpoint URL configured in local env at audit |
| Implemented fetch call sites | 2 | Supplier JSON GET and optional brief POST |

Do not add these totals together: surfaces, routes and HTTP resources measure different things. Asset URLs and parameter values are not enumerated as individual business endpoints.

## Complete surface registry

| ID | Surface | Entry / owner | Controls and states |
| --- | --- | --- | --- |
| S01 | Home / Archive | /, /#archive; App.tsx | Fixed gift-box hero, dual video scrub, touch playback branch, three scroll chapters (Bespoke, Everyday Elevated, The Art of Giving), seven images, portfolio count, catalog outro |
| S02 | Recipient-first catalog | /#catalog; BLineCatalogSection | Gifting brief (recipient, occasion, tier, quantity), recommendations, theme navigation, search, filters, grid/list/index, supplier opt-in, light/dark |
| S03 | Standard-category catalog | /#catalog/category | Category/family navigation, set-contents filter, search and shared listing controls |
| S04 | B—Line partner collection | /#bline | Partner listings and product details; explicitly not SmartGift-manufactured products |
| S05 | Bundle builder | /#catalog/bundle[/template] | Recipient groups, tier/set/qty selection, add/remove group, reference total, aggregate BOM, copy summary, submit panel |
| S06 | Product detail modal | /#catalog/item/code, /#bline/item/code | Image/3D/BOM modes as available, concept client references, specifications, quantity/reference price, copy/share brief, quotation entry; missing product state |
| S07 | Brief submit form | Detail modal and bundle builder | Name + email or phone required, optional company/note, sending/done/error, webhook/mailto/clipboard outcomes, optional LINE continuation |
| S08 | Media configuration drawer | ?dev=1 then operator button | Browse/Blueprint/JSON tabs; logo, two videos, seven default gallery slots; URL/file selection, reset, copy configuration |
| S09 | Resolution/grid overlay | ?dev=1 then operator toggle | Pixel measurements, grid, card overlays; shared operator surface |
| S10 | Standalone legacy catalog | /catalog/ | Separate HTML app, search, category/kind filters, palette selection, product listing |
| S11 | Legacy inline product detail | Select item in S10 | Item information, reference prices, quantity controls and actions |
| S12 | Legacy comparison | Select up to four items, open comparison | Comparison tray plus cmp-dlg table; grouped as one comparison surface |
| S13 | Legacy quotation dialog | q-dlg in S10 | Quantity/reference quotation summary, copy for sales, optional configured contact links |

S01–S05 and S10 are the six page-level surfaces. S06–S09 and S11–S13 are the seven subordinate interactive surfaces.

## Complete logical route registry (15 patterns)

All hash paths below are browser-side state; the fragment is not sent to Nginx as an HTTP request path.

| ID | Pattern | Behaviour |
| --- | --- | --- |
| R01 | / or /#archive | Home; aliases counted once |
| R02 | /#catalog | Recipient-first catalog index |
| R03 | /#catalog/category | Standard-category index |
| R04 | /#catalog/category/:category | Category listing |
| R05 | /#catalog/category/:category/:family | Product-family listing |
| R06 | /#catalog/theme/:theme | Theme listing |
| R07 | /#catalog/tier/:tier | Tier listing |
| R08 | /#catalog/occasion/:occasion | Occasion listing |
| R09 | /#catalog/kind/:kind | Single/set kind listing |
| R10 | /#catalog/item/:code | Product modal deep link |
| R11 | /#catalog/bundle | Empty/default bundle builder |
| R12 | /#catalog/bundle/:template | Template-based bundle builder |
| R13 | /#bline | Partner collection |
| R14 | /#bline/item/:code | Partner product modal |
| R15 | /catalog/ | Separate legacy HTML catalog, not an alias of /#catalog |

Parser axes are category/theme/tier/occasion/kind/item/bundle. A parser accepting arbitrary strings is not a guarantee that every value is a valid catalog item. `/index.html` and `/catalog/index.html` are document aliases, not extra logical routes. Arbitrary SPA fallback paths are not additional implemented pages.

Hash query controls: `view=grid|list|index`, `q`, `supplier=1`, `3d=1`, `priced=1`, `kind`, `contains` (comma-separated families), `recipient`, `occasion`, `tier`, `qty`, and `g` (bundle group encoding). Example: `/#catalog?recipient=TEAM&tier=select&qty=100`. The operator flag `?dev=1` belongs BEFORE the hash and is consumed/removed from the address bar. Preview `?v=5.2` is not a new route.

## HTTP / API registry

### Incoming business APIs: none

There is no API server, database, authentication endpoint, customer account, payment/checkout endpoint, server-side upload, order creation handler, or admin CRUD endpoint implemented in this repository. Production Docker runs Nginx serving Vite output. `nginx.conf` contains static locations and SPA fallback, no application proxy_pass. Receiving HTML 200 at an arbitrary `/api/...` URL would not establish an API: fallback may return index.html.

### Static document and data endpoints

GET / and GET /catalog/ returned HTTP 200 text/html in the local deployment during this audit.

All nine URLs below returned HTTP 200 application/json:

| Method | URL | Role |
| --- | --- | --- |
| GET | /catalog/data/supplier-items.json | Supplier layer, explicitly lazy-fetched by React; smartgift-catalog-items/1 |
| GET | /catalog/data/catalog_listing.json | Published catalog listing artifact |
| GET | /catalog/data/catalog_media.json | Published catalog media artifact |
| GET | /catalog/data/pricelist_public.json | Published public pricing artifact |
| GET | /catalog/data/product_manifest.json | Published product manifest artifact |
| GET | /catalog/data/categories/classic-oriental.json | Category artifact |
| GET | /catalog/data/categories/eco-friendly.json | Category artifact |
| GET | /catalog/data/categories/executive-smart-tech.json | Category artifact |
| GET | /catalog/data/categories/novelty-self-care.json | Category artifact |

Only supplier-items.json has an explicit React runtime fetch call. Other files being served does not prove active use. Legacy index.html embeds its DATA inline.

Static media families: /logo-smg.jpg; /assets/videos/* (two MP4s and poster); /assets/smartgift/plates/*, mockups/*, 3d/*.glb, story/*; /catalog/assets/*; Vite-generated JS/CSS. These are asset resources, not APIs. Byte-range video delivery and GET/HEAD are hosting mechanics, not separate business operations.

### Outbound brief integration (one optional API)

- Method: POST to the value of VITE_BRIEF_ENDPOINT, not a hard-coded path hosted by this repository.
- Content-Type: application/json. Contract: smartgift-brief/1.
- Payload: schema, submitted_at, source=web-ui-smg, page_url, brief (recipient/occasion/tier/qty), lines, optional bundle, optional contact, notes.
- Contact: name, company, email, phone, note. Lines contain code/name/kind/tier/qty/reference prices. Prices remain references, not confirmed orders.
- Timeout: 8 seconds with AbortController. HTTP non-2xx/network errors attempt fallback.
- Response interpretation: response.ok only; no structured response schema consumed.
- Fallback: configured mailto → clipboard. Mailto opens an email draft; it does not confirm delivery. Clipboard requires the user to send the summary.
- Local env audit: webhook URL unset; sales email configured; LINE OA URL unset. Environment values are build-time; this is a configuration audit, not a successful CRM delivery test.
- No POST made during inventory inspection.

Non-API integrations: mailto sales handoff, optional LINE OA link, Clipboard API, object URLs/File API for local media selection. Selecting a file does not upload it to a server.

### Third-party presentation resources

Main HTML loads Google Fonts (fonts.googleapis.com/fonts.gstatic.com) and model-viewer from ajax.googleapis.com. B—Line partner imagery uses images.higgs.ai URLs referencing CloudFront images. The unused gift-anatomy-3d.js file references esm.sh/three; it is not an active API integration. No credentials are needed to describe these public presentation resources.

## State, access, and ownership

- smg_media_config localStorage: per-browser media overrides; not shared publishing.
- smg_dev localStorage: operator visibility. ?dev=1 is not authentication or a permission boundary.
- sg-palette localStorage: legacy palette preference.
- Catalog route/filter/brief selections: hash; detail form contacts: component memory until handoff. No application contact persistence implemented here.
- Supplier fetch is cached in memory for the session.
- Data-generation scripts are offline build tooling, not HTTP APIs.
- Tailscale Funnel forwards HTTPS 8443 to local 8080. It adds reachability, not a business endpoint. The separate /webhook/line proxy on port 443 belongs to another service and is excluded from this inventory. Current remote reachability was not retested in this audit.

## Dormant files, gaps and stale claims

1. SmartGiftCatalogSection.tsx is present but not imported by the active app; do not count its extra tabs, fake quote confirmation or controls as deployed surfaces.
2. public/catalog/customer-catalog.js, customer-catalog.css and gift-anatomy-25d.js / gift-anatomy-3d.js are shipped files but not referenced by the current legacy index.html; do not count their proposed customer dialog or 3D experience as active surfaces.
3. #privacy appears in the catalog footer, but no corresponding privacy page is implemented in the route switch. Home privacy text is not a privacy document.
4. Hamburger styling is a visual control without an implemented menu action in the home header. No active shopping-cart/checkout flow found.
5. Previous inventory has outdated ten-image/portrait/grayscale gallery details; current home has seven product images and three chapters, plus two videos and one logo (10 configurable media slots, poster separate).
6. Public JSON artifacts may exceed what the UI currently consumes; review publication scope independently. This audit did not remove files or change privacy controls.
7. HTTP verification confirms document/resource delivery, not all 13 surfaces being exercised in a browser. Source mapping establishes the inventory; no new complete end-to-end UI test performed for this documentation task.

## Evidence pointers

- src/App.tsx: root view switch, home story, shared overlays, media persistence.
- src/data/catalogTaxonomy.ts: CatalogRoute, buildCatalogHash, parseCatalogHash.
- src/components/BLineCatalogSection.tsx: route matching, filters, product modal and brief entry.
- src/components/BundleBuilder.tsx and BriefSubmitPanel.tsx: package groups and submission UI.
- src/data/catalogItems.ts: supplier JSON loader.
- src/data/briefSubmit.ts and src/config/briefConfig.ts: POST contract and fallback.
- src/devMode.ts and components/MediaConfigModal.tsx: operator controls and local files.
- public/catalog/index.html: independent inline application and three subordinate surfaces.
- nginx.conf, Dockerfile, vite.config.ts, index.html: hosting and presentation dependencies.

## CHANGELOG

| Version | Date | Status | Summary | Commit Hash | Agent |
| --- | --- | --- | --- | --- | --- |
| 1.0.0 | 2026-09-10 | active | Source-derived 13-surface / 15-route inventory and API/resource distinction | source 63c9e59 | RWANG |
