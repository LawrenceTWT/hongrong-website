# Portrait interaction and real project imagery

PR #3 follow-up, 2026-10-18. This direction replaces the earlier generated artwork after the user's review.

## Composition

- Chinese hero: 「嗨！我是紅龍／是個喜歡攝影的工程師」; English: “Hi! I’m HongRong. / An engineer who loves photography.”
- Keep the shared 1080px central content container and the existing glass navigation
- Display the user's formal portrait first. Mouse entry turns it to the glacier photograph; mouse exit reverses the turn, including an interrupted transition
- The photo is a native toggle button: touch, Enter and Space switch sides; Escape, blur and browser restoration return to the formal portrait
- Both faces occupy the same stable 4:5 area and share an 18px radius. The formal portrait retains `contain`; the glacier photo now uses the user-approved CSS crop, `cover` with `object-position: 50% 86%`, to fill the frame while retaining the person and crampons. There is no polygon crop, tilted mat or heavy border
- Both faces now explicitly fill one positioned frame with a small outward depth. The formal photo stays visible until the glacier has loaded and decoded; a loading failure returns to the formal side rather than exposing an empty reverse face. The originals remain unchanged
- The formal photo's white background blends with ivory through CSS multiply. SVG ivy is rooted below its right edge and leans outward as it rises. Its previous inward-facing treatment has been horizontally reflected so the leaves sit beside the right shoulder and outside the face; the photograph itself is not mirrored. Size and inset adapt to smaller viewports
- Turning to the glacier face hides the ivy. The user subsequently requested removing the water contours; their inline SVG and all related CSS are now deleted. The original photograph and its current 4:5 crop remain unchanged
- Keyboard focus is indicated on the hint below the photo; reduced motion skips the flip transition
- Short, translated hover/tap hints explain the interaction. The current side is reflected in `aria-pressed` and only that face is exposed to assistive technology
- Reduced motion removes the animated turn while retaining access to both photographs
- Homepage and Work retain their two image/title/summary/case-link cards, AI first and Jinhong second. Equal columns, stretched rows and flex copy now align both card frames and their CTAs without the former second-card offset. Their imagery is now actual app/website evidence
- The AI preview combines the original login, parking and traffic screens in CSS. Jinhong uses its actual homepage capture. No generated interface or conceptual machinery is shown
- All three generated bitmap assets and their obsolete preview screenshots have been removed. Botanical growth now reuses the original SVG leaf geometry in `js/botanical.js`: the stem draws from its lower endpoint, then each attached leaf unfolds. A local SVG mask softly fades the root into the page

## Scroll and landscape refinement

- The opening wordmark now takes 2.5 seconds through appearance, a clear reading pause, per-letter blur/dissolve from right to left, and curtain departure. It is reduced by another 25% from the PR #4 size, using `clamp(42px, 8.1vw, 108px)`. The supplied reference is a still image; the sequence follows its presentation rather than claiming a measured frame-for-frame match
- The letter-dissolve intro retains its session key and skips repeat visits, deep links, browser restoration and reduced motion. A small inline head gate now covers the first paint before deferred scripts run; the wordmark begins without waiting for font/layout promises. Gate and animation failures release the page, and an expired gate cannot replay a late intro
- Opening now uses 7,140 bytes of regular/italic subsets from the same licensed Caslon faces. Both are preloaded and preserve the original glyph outlines and advances
- On first visits, the wordmark starts before the SVG/scene/page measurements. Those enhancements initialize once in the original reading pause; the explicit font-driven layout refresh follows opening cleanup. All skip paths still initialize immediately. Appearance, dissolve and total 2.5-second timing remain unchanged
- Hero → About → Work remains a reversible scroll-controlled composition. GSAP uses sine easing, 0.8-second scrub smoothing, a shared timing map and a reading pause; it does not intercept the wheel or snap to sections. Plants use that same eased entry curve; the four-line About reveal shares the timeline and continues into its centered reading pause
- Access and navigation state follow the animation's update callback, so they continue to settle while scrub catches up after the scroll input stops
- Language/layout restoration settles the scrub immediately at the saved logical progress. Explicit from/to coordinates preserve the return to the hero
- Hero vines are complete from their first frame, including the normal-flow mobile hero. Later vines share their section's entry progress. Pinned About and Work plants complete exactly as their scene reaches its full composition; normal-flow plants complete once a shorter section fits or a tall section reaches its first full viewport. These later vines shrink back along the same path on reverse scrolling, without a second CSS transition lag
- Decorative plants have curated left/right placements with staggered heights, widths, tilts and growth offsets. Their margin windows stop before the central content and softly fade at the inner edge. They do not all share a bottom-right anchor or form repeated symmetrical pairs
- Child-page opening plants are also complete from their first frame. The plant and margin windows cannot create horizontal document overflow; small screens retain only a narrow edge accent
- The phone keeps the real five-screen sequence, with a 240ms crossfade. Its line-art vine now grows between screen changes instead of advancing only at five thresholds
- The Wānaka container has an explicit full width and height. Its SVG fills that box absolutely, avoiding the auto-width/aspect-ratio/max-height combination that can leave a blank strip on a wide display
- About transitions from ivory to deep forest, then progressively reveals its four real text lines in ivory/sage. Label and text appear after the surface has darkened. Reduced motion and no-JavaScript views remain complete. About groups its centered statement and story CTA into one composition. During Work entry, it holds that composition still until the incoming edge meets its lower safety gap, then carries it out along that edge. Layout coordinates are remeasured after refresh/font/language changes; the counter-transform is removed in normal flow
- The name is shifted slightly right and given more horizontal safety space. As the landscape enters, HongRong rises from behind the ridge and the complete SVG settles from 1.035× to 1×. Base and foreground remain in one coordinate system; reverse scroll restores the same image and type positions
- The six-page glass navigation, 1080px content token, bilingual copy, actual photographs and project evidence are unchanged

## Current assets

| Asset | Dimensions | Source / role |
| --- | --- | --- |
| `assets/images/hongrong-formal.webp` | 700 × 890 | User-provided formal portrait; front face and initial preload |
| `assets/images/hongrong-glacier.webp` | 800 × 1422 | User-provided glacier photograph; reverse face |
| `assets/images/ai-screen-login.webp` | 520 × 1080 | Real capstone login screen |
| `assets/images/ai-screen-parking.webp` | 370 × 796 | Real capstone parking screen |
| `assets/images/ai-screen-traffic.webp` | 470 × 1043 | Real capstone traffic screen |
| `assets/images/ai-team-exhibition.webp` | 1600 × 1200 | User's five-person capstone exhibition photograph, supplied 2026-10-19 |
| `assets/images/ai-project-poster.webp` | 1108 × 1477 | User's photograph of the original capstone poster, supplied 2026-10-19 |
| `assets/images/jinhong-live-home.jpg` | 1348 × 926 | Actual live homepage capture, 2026-10-17 |
| `assets/images/botanical-vine.svg` | Vector | Existing code-native decorative ivy |
| `assets/images/paper-grain.svg` | 180 × 180 | Lightweight code-native paper grain |

The two supplied source photographs remain unchanged, without raster cropping or AI editing; together they are 156,924 bytes. Only the glacier face's CSS display crop changed. Case-study evidence and the five-state sticky phone remain unchanged.

## AI case-study team photographs, 2026-10-19

- Replace the text-heavy role ledger on `ai-driving-assistant.html` with a team-photo section after the origin and before the system flow. The user approved both real photographs and explicitly omitted role tags and explanatory role copy
- Desktop uses a 2:1 photo/poster grid within the existing 1080px page shell. At 800px and below the images stack, with the poster centered and capped at 400px. Both display their complete original aspect ratios, without crops, rotation, overlap or overlaid text
- Use restrained ivory mats, small corners and subtle shadows. Each image has only a short caption. The poster is a native keyboard-accessible link to its full-size image in a new tab, with a visible action and hover/focus arrow response; it also works without JavaScript
- The team image comes from `image(20261019-020221).png` (2048 × 1536); the poster comes from `image(20261019-020227).png` (1108 × 1477). Conversion to WebP only resizes the team photograph and compresses both files; no content, colors or perspective are reconstructed. The outputs total 423,594 bytes
- Captions, image alternatives and the poster-link accessible name are translated by the existing Chinese-first language system
- Rebuilt both existing Chinese font subsets from their verified original sources to include the new exhibition/poster vocabulary; the coverage manifest is regenerated with the emitted font hashes
- This change does not edit `index.html`, `js/main.js`, `js/botanical.js`, the phone-story CSS or existing phone screenshots. The scroll-linked five-screen homepage story is retained
- Browser visual QA remains unavailable because the required control-browser capability is missing. Build, language, asset/font and existing motion checks verify source/DOM state; they do not establish browser rendering or scroll feel

## Verification

The About-page wording is unchanged in both languages. Chinese 「像水一樣，流向未知」 stays on one line with a font size bounded by its own text column (`min(0.92em, 10.3cqi)`), so the nine-character phrase cannot force the grid wider. The introduction retains its original two explicit line breaks and all original wording. Removing its former 48ch cap and using a 14–16px column-aware font lets the three original Chinese sentences occupy three lines at standard desktop widths. Smaller screens and text enlargement may wrap body text for readability. English remains normally wrappable. No photo, grid track, global typography or animation rule is changed by this refinement.

Build and Chinese font coverage checks pass. Historical Chrome results and their commit scope are recorded in `docs/qa-2026-10-18.md`. The latest crop-geometry and scene-clock checks, including current browser limits, are in `docs/portrait-scene-sync-2026-10-19.md` and `docs/scene-boundaries-2026-10-19.md`.

The newest About reveal and first-paint gate checks are recorded in `docs/about-reveal-opening-2026-10-19.md`.

First-display initialization and opening-font checks are in `docs/opening-startup-2026-10-19.md`, including the limit that no browser performance trace was available.
