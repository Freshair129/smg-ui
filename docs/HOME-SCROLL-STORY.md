---
version: "0.1.1b"
created_at: "2026-09-08T00:00:00+07:00,RWANG,uncommitted"
last_update: "2026-09-08T06:18:00+07:00,RWANG"
status: beta
attributes:
  domain: web-ui
  scope: archive-scroll-gallery
---

# SmartGift home scroll story

## Request and scope

Replace the template people/lookbook imagery that rises on scroll after the opening gift-box hero with SmartGift-related products and editorial text. Complexity C-2; risk LOW. Approved by the user on 2026-09-08 and implemented.

## Proposed experience

Retain the existing scroll-driven rising-image rhythm. Use colour product imagery, generous spacing, and readable text between image groups. Three sequential chapters:

| Chapter | Heading | Supporting copy | Proposed existing imagery |
| --- | --- | --- | --- |
| 1 | BESPOKE | ออกแบบให้เป็นแบรนด์คุณ | Notebook, tumbler, branded tote |
| 2 | EVERYDAY, ELEVATED | ของใช้ประจำวัน ที่ให้ได้อย่างมีความหมาย | Bottle, mug, power bank |
| 3 | THE ART OF GIVING | ใส่ใจตั้งแต่ของขวัญถึงบรรจุภัณฑ์ | Gift-box open composition from the existing hero and product details |

Use existing local SmartGift media, visually inspected before selection. Existing plates and client mockups are concept renders; mark the relevant gallery as “ภาพจำลองแนวทางการออกแบบ”. Do not imply these are photographs of delivered customer orders. Show the full product silhouette; do not force landscape compositions into a portrait crop. Text is live HTML, not embedded in images. On mobile it occupies a readable full row between image groups, with no clipping or overlap.

## Parent and peer alignment

- Parent: HERO-VIDEO-BRAND-DIRECTION.md identifies recipient-first corporate gifting and replacing the template gallery with SmartGift imagery.
- Peer: src/data/coreMedia.ts distinguishes generated plates and concept mockups from verified source photographs.
- Current src/config/mediaConfig.ts still supplies ten external template gallery URLs. src/App.tsx uses garment alt text and preserves saved gallery URLs. src/index.css applies grayscale to gallery images.
- Keep the fixed-camera gift-box videos and the approved mobile white background. Catalog layout and its data remain outside this change.

## Implementation

1. Curate local images and map them to the three chapters; update default gallery media and accurate alt text.
2. Add headings/supporting text to the existing scroll sequence and remove forced grayscale for these products. Adjust card fit and responsive spacing only where needed.
3. Migrate only known template gallery URLs in saved media settings; preserve custom URLs. Avoid presenting stock captions as factual descriptions of custom images.
4. Verify, then rebuild the existing local Docker deployment.

## Acceptance and verification

- Default and legacy-default home galleries show SmartGift products, with no template people images or broken media.
- Three headings and their Thai copy appear in the specified order on forward and reverse scroll.
- Products remain in colour and important details are not cropped.
- Desktop and mobile (390 and 430 px) have readable text, no horizontal overflow, and a complete scroll path into the outro.
- Existing hero camera, box scale, video switching, mobile white background and catalog navigation still work.
- Check migration for fresh settings, saved template settings and custom media settings. TypeScript/Vite build and browser verification pass before reporting deployment complete.

## Version diff

Existing: ten template-image slots, grayscale, garment alt text, no product-story headings.

Proposed 0.1.0b: local SmartGift product imagery, three editorial chapters, accurate image descriptions and responsive text layout.

## CHANGELOG

| Version | Date | Status | Summary | Commit Hash | Agent |
| --- | --- | --- | --- | --- | --- |
| 0.1.0b | 2026-09-08 | draft | Proposed SmartGift scroll imagery and copy | uncommitted | RWANG |


## Deployment verification — 2026-09-08

- Implemented and deployed at http://localhost:8080/?v=5.2#archive using the existing Docker service.
- TypeScript/Vite build passed; existing bundle-size advisory remains.
- `scripts/test-home-gallery.cjs`: fresh, template, mixed custom, current and unrelated CDN gallery cases pass.
- `scripts/verify-home-story.py`: 390×844, 430×932 and 1366×768 browser viewports pass, seven local images loaded, all three headings visible on forward/reverse scroll, no horizontal overflow, outro reached, hero information hidden during story. Screenshots reviewed under `docs/qa-home-story/`.
- Existing hero regression audit passes: mouse left/right mapping, common closed frame, reverse seek and fixed-copy bounds. Catalog navigation passes. No browser errors reported.
- Fixed the old persistent hero-information overlay during the story; evidence and prevention in `.brain/rca/2026-09-08-story-overlay.md`.
- Version diff 0.1.0b → 0.1.1b: approved proposal implemented and locally deployed. Website preview query v5.1 → v5.2; video assets remain v5.
- Viewport emulation was used; physical-device testing was not performed.

| 0.1.1b | 2026-09-08 | beta | Implemented and verified home scroll story | uncommitted | RWANG |
