# Story overlay visibility

- Symptom: The fixed portfolio count overlaps the new product gallery on mobile.
- Evidence: docs/qa-home-story/390.png first verification showed the 238 count covering the tote image. App.tsx updates its position but previously never hid it during the middle scroll phase.
- Root cause: The hero information panel remains at z-index 20 while the gallery is at 10, with opacity 1 throughout the story.
- Why missed: Previous gallery verification checked imagery and timeline completion without testing text and product visibility together.
- Correction: Fade the hero information out during the initial panel transition and restore it with the existing outro progress. This is within the approved requirement for no overlapping story content.
- Prevention: Verify the computed information-panel opacity in the middle story phase as well as screenshots at mobile and desktop sizes.
