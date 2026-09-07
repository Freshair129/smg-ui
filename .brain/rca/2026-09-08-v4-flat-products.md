# v4 product depth and revised motion direction

## Symptom

The user reports flat-looking products and requests fixed scale with only lid movement, in a realistic product-launch presentation.

## Evidence

`business-01-smart-gift/comfy-hero-video/scripts/hinged_v4.py` creates every product in each set on the single `Recessed product photographic insert` plane (line230). The texture contains product silhouettes and baked shading, but there are no volumetric product meshes. Lines244–245 disable its diffuse and glossy ray visibility. The `pose` function changes camera elevation from80° to50°, its target and orthographic scale from7.2 to12.2.

## Root cause

Product form is represented by color on a planar surface, so it cannot create actual side surfaces, thickness, geometric contact shadows or changing reflections. Camera movement makes that planar representation easier to perceive. The scale change was intentional under the previous approved direction; removing it is a new direction, not an unexplained renderer defect.

## Why the issue escaped detection

The v4 delivery explicitly documented the reference-composited product limitation. Its verification accepted image likeness, shared-frame parity and box motion without requiring volumetric product silhouettes. The user's current realism expectation rejects that compromise.

## Proposed prevention

Replace product plates with reference-based volumetric models and real insert recesses. Use image textures only for surface graphics and material detail. Lock the camera and scale. Inspect product side surfaces, contact shadows and material responses in closed/half/open proof renders before full video production. Reverify A/B parity and occlusion rather than assuming the v4 mask strategy remains valid. See direction proposal §13; code changes await approval.
