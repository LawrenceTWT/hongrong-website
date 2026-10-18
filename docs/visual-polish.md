# Portrait interaction and real project imagery

PR #3 follow-up, 2026-10-18. This direction replaces the earlier generated artwork after the user's review.

## Composition

- Chinese hero: 「嗨！我是紅龍／是個喜歡攝影的工程師」; English: “Hi! I’m HongRong. / An engineer who loves photography.”
- Keep the shared 1080px central content container and the existing glass navigation
- Display the user's formal portrait first. Mouse entry turns it to the glacier photograph; mouse exit reverses the turn, including an interrupted transition
- The photo is a native toggle button: touch, Enter and Space switch sides; Escape, blur and browser restoration return to the formal portrait
- Both photos retain their full composition using `object-fit: contain` in one stable 4:5 area. There is no polygon crop, tilted mat or heavy border
- The formal photo's white background blends with ivory through CSS multiply. SVG ivy is rooted below its right edge and leans inward as it rises; size and inset adapt to smaller viewports. This supersedes the earlier top-hanging 45° treatment
- Turning to the glacier face hides the ivy and draws layered blue-gray water lines with a faint wider current, fine highlight, graduated line weights and fading ends. The back face is transparent, without the former sage surround or rectangular focus outline. Original photograph colors are not regenerated
- Keyboard focus is indicated on the hint below the photo; reduced motion skips the flip and line-drawing transitions
- Short, translated hover/tap hints explain the interaction. The current side is reflected in `aria-pressed` and only that face is exposed to assistive technology
- Reduced motion removes the animated turn while retaining access to both photographs
- Homepage and Work retain their two image/title/summary/case-link cards, AI first and Jinhong second. Their imagery is now actual app/website evidence
- The AI preview combines the original login, parking and traffic screens in CSS. Jinhong uses its actual homepage capture. No generated interface or conceptual machinery is shown
- All three generated bitmap assets and their obsolete preview screenshots have been removed. Botanical growth now reuses the original SVG leaf geometry in `js/botanical.js`: the stem draws from its lower endpoint, then each attached leaf unfolds. A local SVG mask softly fades the root into the page

## Scroll and landscape refinement

- The opening wordmark takes about 3.05 seconds through appearance, pause, blur/dissolve and curtain departure. It still skips repeat visits, deep links and reduced motion
- Hero → About → Work remains a reversible scroll-controlled composition. GSAP uses 0.8-second scrub smoothing, a shared timing map and a reading pause; it does not intercept the wheel or snap to sections
- Access and navigation state follow the animation's update callback, so they continue to settle while scrub catches up after the scroll input stops
- Language/layout restoration settles the scrub immediately at the saved logical progress. Explicit from/to coordinates preserve the return to the hero
- Pinned-scene vines use the scene timeline, rather than measurements of an already-transformed child. Other page vines use local viewport progress. Both shrink back along the same path on reverse scrolling
- The phone keeps the real five-screen sequence, with a 240ms crossfade. Its line-art vine now grows between screen changes instead of advancing only at five thresholds
- The Wānaka container has an explicit full width and height. Its SVG fills that box absolutely, avoiding the auto-width/aspect-ratio/max-height combination that can leave a blank strip on a wide display
- The name is shifted slightly right and given more horizontal safety space. The photograph and registered ridgeline remain in the same coordinate system
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
| Inline `.portrait-waterlines` in `index.html` | Vector | Code-native water contours and local SVG gradients; no extra bitmap |
| `assets/images/paper-grain.svg` | 180 × 180 | Lightweight code-native paper grain |

The two supplied photographs are resized and encoded as WebP without cropping or AI editing; together they are 156,924 bytes. Case-study evidence and the five-state sticky phone remain unchanged.

## Verification

Build and Chinese font coverage checks pass. Current Chrome layout and interaction checks, proof image paths and testing limits are recorded in `docs/qa-2026-10-18.md`.
