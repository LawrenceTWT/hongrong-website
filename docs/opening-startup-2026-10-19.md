# Opening first-display refinement

Base: `main` at `8ab91b5`. Scope: the reported hitch when the opening first appears, not the intentional reading pause or letter dissolve.

## Confirmed source-level startup work

- Before the opening started, the main module synchronously created all botanical SVGs, initialized the portrait, localized the page, created ScrollTrigger scenes, and measured the page. Supporting-image reveal setup also read element geometry before the opening
- `startOpening()` then scheduled `refreshLayout()` immediately. When fonts resolved, that path could globally refresh ScrollTrigger during the moving letters
- The mark used full Caslon regular/italic webfonts of 52,868 and 57,408 bytes. Only the regular face was explicitly preloaded. An italic-face request or swap could therefore occur later in the first display
- The main module's two static imports had no explicit early preload hints

These are startup contention and font-swap risks identified from code. No browser trace was available to attribute the user's approximate 0.3 seconds to one measured task.

## Implementation

- Start the original opening before the page enhancements. Initialize the existing page exactly once at 0.65 seconds, when the complete name is visible and the existing reading pause begins
- Revisit, child-page, deep-link, reduced-motion and missing-engine paths initialize the page immediately. A failure, timeout or interrupted opening initializes before releasing the curtain. Its normal completion does not append a second set of vines or scenes
- Move the explicit font-driven global layout refresh until after opening cleanup. Supporting-image geometry measurements are now inside the deferred initialization
- Preload two opening-only Caslon subsets totaling 7,140 bytes, 93.5% smaller than the full pair. `scripts/subset-opening-fonts.py` uses only the existing licensed fonts and verifies the original outlines and advances for every character in `HongRong®`. Original fonts remain intact for the rest of the site
- The coverage manifest records actual emitted cmap coverage and hashes of both subset and source files. Opening checks validate those hashes, the exact mark text, and preload references
- Add early module preloads for the existing main module and its two static dependencies
- Give only the active curtain and letters transient compositor hints. Removing `opening-active` also releases those hints

## Preserved behavior

The original entrance remains 0.45 seconds with 0.025-second letter stagger, the dissolve starts at 0.95 seconds with its original blur/stagger, and the curtain moves at 1.85–2.5 seconds. Total duration, font outlines, wordmark size, intentional reading pause, session key, skip conditions and first-paint gate are retained. Scene pacing, five real phone screens, actual photos, bilingual wording and About layout are unchanged.

## Verification

- `npm run build` passes, including six-page asset/font validation, 340 translation mappings, motion, opening and language checks
- Production opening/initializer functions are executed in controlled DOM fixtures. They verify that the letters start before page preparation, no explicit font refresh runs during the opening, initialization is idempotent, and failures/interruptions/skips still initialize their page
- The actual bundled GSAP timeline confirms no preparation at 0.3 or 0.64 seconds, preparation during the original reading pause, the original dissolve direction and 2.5-second completion
- Font generation compares decomposed outlines and horizontal metrics against both original faces
- `git diff --check` passes

Browser visual and performance tracing remain unavailable because the required `control-browser` capability is missing. The checks above do not measure frame times or prove that the reported real-device stall has disappeared. Use a new private browsing tab for a cold opening check, since the normal session deliberately skips repeated openings.
