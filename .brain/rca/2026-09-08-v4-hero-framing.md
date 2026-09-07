# v4 hero framing integration

- Symptom: new closed gift box overlaps the lower-right ledger at1366×768; portrait cover fitting would crop its sides.
- Evidence: `business-01-smart-gift/comfy-hero-video/outputs/v4/deploy-desktop-before-fit.png` shows the box crossing into the ledger. The new source object spans about1057px while the previous renderer deliberately limited its object to442px. Existing CSS fills the viewport with `object-fit:cover`.
- Root cause: the viewport-filling presentation was calibrated for the smaller old composition, not the newly approved larger closed-frame composition.
- Why it escaped detection: standalone video verification covered the full frame, not its placement below the site's fixed logo and ledger.
- Prevention: retain the original video pixels and motion, constrain the hero video's displayed width to1016px and use contain fitting; reserve vertical space for logo and ledger on narrow screens. Verify both desktop sizes and portrait before completion.

Stable default filenames also carry immutable caching. Deployment revisions the video/poster URLs and upgrades only saved default paths, preserving custom media settings.

## Center reset

Browser event test moved the pointer from x1 to the center: visible A remained at3.993492seconds. `onMove` returned from the deadzone without seeking, retaining the open frame. This pre-existing behavior conflicts with the closed shared-master contract. Reset both clips to time0 inside the center deadzone, then verify an edge-to-center jump and cross-axis playback.
