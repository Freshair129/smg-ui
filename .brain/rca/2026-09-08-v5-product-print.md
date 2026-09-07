# v5 product print proof corrections

- **Symptom:** the full-resolution tumbler print had a pale rectangular edge; parts of the tote lettering disappeared across fabric wrinkles.
- **Evidence:** the initial material converted photograph luminance to a print mask, including bright reflected body pixels. The initial tote print was a separate mesh sampled from an analytic cloth height, while the final cloth surface used a different tessellation and thickness/bevel modifiers. Shrinkwrapping this separate mesh still produced visible intersections in a full-resolution proof.
- **Root cause:** photograph brightness is not an artwork alpha mask; an independently tessellated print surface is not the cloth surface itself.
- **Why it escaped detection:** half-resolution broad composition proofs made the print-edge contamination and small letter holes less apparent.
- **Correction:** reuse the existing transparent client artwork from `comfy-3d-products/assets/logos/`. Put tote ink directly in the actual cloth material using a clipped coordinate projection. Preserve original reference files.
- **Prevention:** inspect complete artwork at final output resolution before rendering the full sequence. No bitmap product-plane substitution; prints must follow their physical substrate. Revised A/B full-open proofs show complete lettering with no photograph background patch. Re-render affected production frames before encoding/deployment.
