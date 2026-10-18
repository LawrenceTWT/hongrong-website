# Portrait interaction and real project imagery

PR #3 follow-up, 2026-10-18. This direction replaces the earlier generated artwork after the user's review.

## Composition

- Chinese hero: 「嗨！我是紅龍／是個喜歡攝影的工程師」; English: “Hi! I’m HongRong. / An engineer who loves photography.”
- Keep the shared 1080px central content container and the existing glass navigation
- Display the user's formal portrait first. Mouse entry turns it to the glacier photograph; mouse exit reverses the turn, including an interrupted transition
- The photo is a native toggle button: touch, Enter and Space switch sides; Escape, blur and browser restoration return to the formal portrait
- Both photos retain their full composition using `object-fit: contain` in one stable 4:5 area. There is no polygon crop, tilted mat or heavy border
- The formal photo's white background blends with ivory through CSS multiply. SVG ivy rises from its right side at a 45° angle; size and inset adapt to smaller viewports
- Turning to the glacier face hides the ivy and draws layered blue-gray water lines with a faint wider current, fine highlight, graduated line weights and fading ends. The back face is transparent, without the former sage surround or rectangular focus outline. Original photograph colors are not regenerated
- Keyboard focus is indicated on the hint below the photo; reduced motion skips the flip and line-drawing transitions
- Short, translated hover/tap hints explain the interaction. The current side is reflected in `aria-pressed` and only that face is exposed to assistive technology
- Reduced motion removes the animated turn while retaining access to both photographs
- Homepage and Work retain their two image/title/summary/case-link cards, AI first and Jinhong second. Their imagery is now actual app/website evidence
- The AI preview combines the original login, parking and traffic screens in CSS. Jinhong uses its actual homepage capture. No generated interface or conceptual machinery is shown
- All three generated bitmap assets and their obsolete preview screenshots have been removed. Botanical growth now uses the existing SVG and the same reversible scroll progress

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
