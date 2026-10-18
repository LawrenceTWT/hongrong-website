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
- Homepage and Work retain their two image/title/summary/case-link cards, AI first and Jinhong second. Their imagery is now actual app/website evidence
- The AI preview combines the original login, parking and traffic screens in CSS. Jinhong uses its actual homepage capture. No generated interface or conceptual machinery is shown
- All three generated bitmap assets and their obsolete preview screenshots have been removed. Botanical growth now reuses the original SVG leaf geometry in `js/botanical.js`: the stem draws from its lower endpoint, then each attached leaf unfolds. A local SVG mask softly fades the root into the page

## Scroll and landscape refinement

- The opening wordmark now takes 2.5 seconds through appearance, a clear reading pause, per-letter blur/dissolve from right to left, and curtain departure. It is reduced by another 25% from the PR #4 size, using `clamp(42px, 8.1vw, 108px)`. The supplied reference is a still image; the sequence follows its presentation rather than claiming a measured frame-for-frame match
- The letter-dissolve intro uses a new session key so a visitor who saw the previous version can see this revision once. It still skips repeat visits, deep links and reduced motion; switching to reduced motion during the intro completes it immediately
- Hero → About → Work remains a reversible scroll-controlled composition. GSAP uses sine easing, 0.8-second scrub smoothing, a shared timing map and a reading pause; it does not intercept the wheel or snap to sections. Text and vines use that same eased entry curve
- Access and navigation state follow the animation's update callback, so they continue to settle while scrub catches up after the scroll input stops
- Language/layout restoration settles the scrub immediately at the saved logical progress. Explicit from/to coordinates preserve the return to the hero
- Hero vines are complete from their first frame, including the normal-flow mobile hero. Later vines share their section's entry progress. Pinned About and Work plants complete exactly as their scene reaches its full composition; normal-flow plants complete once a shorter section fits or a tall section reaches its first full viewport. These later vines shrink back along the same path on reverse scrolling, without a second CSS transition lag
- Decorative plants have curated left/right placements with staggered heights, widths, tilts and growth offsets. Their margin windows stop before the central content and softly fade at the inner edge. They do not all share a bottom-right anchor or form repeated symmetrical pairs
- Child-page opening plants are also complete from their first frame. The plant and margin windows cannot create horizontal document overflow; small screens retain only a narrow edge accent
- The phone keeps the real five-screen sequence, with a 240ms crossfade. Its line-art vine now grows between screen changes instead of advancing only at five thresholds
- The Wānaka container has an explicit full width and height. Its SVG fills that box absolutely, avoiding the auto-width/aspect-ratio/max-height combination that can leave a blank strip on a wide display
- About groups its centered statement and story CTA into one composition. During Work entry, it holds that composition still until the incoming edge meets its lower safety gap, then carries it out along that edge. Layout coordinates are remeasured after refresh/font/language changes; the counter-transform is removed in normal flow
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
| `assets/images/jinhong-live-home.jpg` | 1348 × 926 | Actual live homepage capture, 2026-10-17 |
| `assets/images/botanical-vine.svg` | Vector | Existing code-native decorative ivy |
| `assets/images/paper-grain.svg` | 180 × 180 | Lightweight code-native paper grain |

The two supplied source photographs remain unchanged, without raster cropping or AI editing; together they are 156,924 bytes. Only the glacier face's CSS display crop changed. Case-study evidence and the five-state sticky phone remain unchanged.

## Verification

Build and Chinese font coverage checks pass. Historical Chrome results and their commit scope are recorded in `docs/qa-2026-10-18.md`. The latest crop-geometry and scene-clock checks, including current browser limits, are in `docs/portrait-scene-sync-2026-10-19.md` and `docs/scene-boundaries-2026-10-19.md`.
