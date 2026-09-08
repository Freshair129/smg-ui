# Mobile hero background mismatch

- Symptom: the white-backed logo and hero video appear as separate white rectangles on a cream mobile page.
- Evidence: at390×844, live computed `.page-root` background is `rgb(239, 233, 222)` while `#main-canvas` is `rgb(255, 255, 255)`. The mobile canvas reserves220px above and230px below, exposing the parent background. The outro overlay has opacity0 and is not the cause.
- Root cause: mobile fitting exposes the older stone-coloured archive parent outside the white studio canvas.
- Why it escaped detection: v5 checks covered sizing, overlap, media parity and scrubbing, but did not require parent/canvas background equality on mobile.
- Correction: C-1 / LOW, a non-structural CSS hotfix within the approved white-studio direction. Set `.page-root` background to white inside the existing max-width1023px rule. Preserve catalog theme tokens, media pixels, composition and motion.
- Verification: compare computed parent/canvas colours and visual edges at mobile sizes, then check desktop and catalog isolation after the build and local deployment.
- Visual refinement: the video also contains a baked studio-grey falloff outside the box. On mobile, widen only the horizontal empty-background feather to30%/70%. The entire box/lid sweep occupies approximately32.8%–67.2% of video width and remains fully opaque; the existing vertical4% feather stays outside its bounds.
