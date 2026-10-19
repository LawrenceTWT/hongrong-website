# About reveal, first-paint opening and equal project frames

Branch: `fix/about-reveal-opening-cards`

Base: `abae17c8b35d2aab137ea870b2be8d85eae437dd` (merged PR #5)

## Four requested changes

### About composition

The former effect only changed the last line's ink. All four actual, translatable heading lines now reveal in sequence, from left to right with a small soft edge. The surface moves from the existing warm ivory to deep forest; ivory text and a pale sage final line retain the portfolio's palette rather than introducing a separate technology theme

The same scroll frame and timeline control the surface and text in both directions. The surface darkens over timeline positions 0.35–1.15. Text appears over 0.95–1.85, after the surface is sufficiently dark, and finishes before Work begins at 2.1. These are scrubbed timeline coordinates, not auto-playing durations

The existing center hold, next-section boundary, 0.8-second scrub, overall scroll distance, vine completion at scene arrival and centered story CTA remain. Normal-flow mobile/short viewports use section-entry progress. No-JavaScript and reduced-motion views show a complete readable dark composition. A feature-query fallback also keeps a static dark surface if color mixing is unavailable

The heading is not rebuilt into generated character nodes. Four CSS line ranges preserve the original heading structure, normal wrapping and bilingual replacement. Screen readers retain the complete sentence; unchanged frames do not keep rewriting style values

### First paint

Previously `startOpening` waited for fonts and a layout frame before applying `opening-active`. That allowed the complete hero to paint first and then be covered by the intro

A small inline head script now checks the existing session preference, reduced motion, deep link and back/forward navigation before installing an opaque first-paint gate. It runs before the stylesheet and deferred/module scripts. The actual curtain takes over before asynchronous layout work; its wordmark starts immediately while font/layout readiness settles behind it. The existing 2.5-second letter dissolve and type size are unchanged

The gate has a five-second module-load fallback. If that timeout has already released the page, a late module skips the intro instead of covering the hero again. Missing GSAP, animation initialization failure, interrupted navigation and reduced-motion changes also release the overlay. Completion clears pending timers. Without JavaScript, no gate class is added

### Equal project frames

The former grid used `1.08fr 0.92fr` and a 28px top margin on Jinhong. It now uses two equal `minmax(0, 1fr)` columns, stretched equal-height cards and one 2:1 visual frame. Flex copy pushes the case-study action to the same lower edge while allowing real text to wrap. The mobile grid still stacks the two cards within the existing central content width

All project images remain the real app/website captures. No image generation, replacement or cropping change is introduced. Equal geometry follows the CSS constraints; this round does not claim measured rendered pixel equality

### Return-home statement

Chinese: `回國後／變得比以前的自己更勇敢`

English: `I came home / braver than I used to be.`

Both current Chinese fonts already cover the requested characters; their files do not need regeneration

## Verification

- The production About updater is checked with the bundled GSAP at entry, centered partial reveal, completion, reading pause and identical reversed positions. Four line ranges and background/label restoration are covered
- Normal-flow heights and sections shorter/equal/taller than the viewport remain covered, as do reduced motion, static completed state and unchanged-frame writes
- New `npm run test:opening` executes the actual inline gate and production opening functions against parsed HTML and controlled promises/timers. It checks the gate's head order, immediate wordmark while fonts wait, late fonts, session/deep-link/reduced-motion skips, blocked storage, missing/broken engine, timeout release, late module skip and cleanup
- The existing six-page language suite checks the updated English/Chinese statement, markup round trips, reading position, portrait, phone, carousel and form state
- Build validation checks local assets, shared components and both Chinese font maps

Managed browser QA remains unavailable because `control-browser` is not installed. Parser/state fixtures are not first-paint recordings, native layout measurements or real-wheel testing. The supplied screenshot identifies the unequal card composition; no new browser screenshot or frame-for-frame reference fidelity is claimed
