# Portrait visibility follow-up

Branch: `feature/skills-vines-intro`

Base: `cfc0032fafe5cf076bfde1fbea548eab5ab886b7`

The user supplied a screenshot showing the former water contours without the glacier photograph and reiterated that only the contours should be removed. The story CTA must remain horizontally centered

## Evidence and scope

Both original image files and both image elements are present in the base commit: `hongrong-formal.webp` (700 × 890) and `hongrong-glacier.webp` (800 × 1422). The water SVG was removed in that commit. A screenshot still showing the contours cannot identify the current checkout, cached resources or local changes; it also does not establish an image-load or browser-compositing cause. The exact reported browser failure has not been reproduced

This follow-up keeps both originals and their sources. It adds two targeted protections against a blank reverse face:

- The 4:5 inner frame is a positioned block, with both faces absolutely filling that one frame. Each face has an explicit rotation and a 0.5px outward depth, avoiding coplanar faces. The reverse photograph retains the approved `cover` crop at `50% 86%`, matching the same 18px radius. It no longer has an overflow exception for removed contours
- The formal face remains the default. Flip controls are enabled only after the original reverse image has loaded with a nonzero natural width and decoding has completed. A failed load restores the formal face and disables flipping. A stale decode completion cannot re-enable a failed image

The story button stays in the centered About content group, now with explicit `align-self: center` and automatic inline margins. Its existing scroll-boundary behavior and arrow interaction remain. No image assets are changed, generated or uploaded

## Checks

The language/interaction suite executes actual page markup and production JavaScript. It checks the exact formal/glacier source paths, absence of the removed contour element, loading → ready → flip, error fallback, stale decoding and retained centered-group membership. Existing six-page bilingual checks, motion tests and the complete production build also apply

The DOM image-readiness properties and decode promises are controlled fixtures, not actual browser networking or compositing. Managed browser QA remains unavailable because `control-browser` is not installed. Final photograph rendering and hover/touch visuals remain unverified in an actual browser
