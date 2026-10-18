# Portfolio UX redesign — 2026-10-17

Branch: `feature/portfolio-ux-redesign`

Base: `5514a61`

Purpose: a maintainable portfolio that HongRong can keep using for future work

This decision record supersedes conflicting visual and navigation instructions in `redesign-plan.md`.

## Confirmed direction

- Chinese is the initial, server-delivered language; English is an explicit secondary choice
- Preserve the glass header appearance and use identical page navigation on all six routes
- Keep a concise homepage, the reversible scene push, and the real-screen sticky AI story
- Use Fathom's editorial hierarchy, centered content and whitespace as composition references
- Use ordinary rectangular photo frames, preserving scenic and portrait compositions
- Closing direction A means **landscape layering**: the real ridgeline occludes only the bottom of the name
- Keep real project evidence and honest SEO next steps; remove generic copy and fabricated page mockups

## Reproduced defects

1. Case → next case → browser Back restored `page-leaving`, leaving the whole document at opacity 0
2. Language changes and repeated ScrollTrigger refreshes reused mutated tween start values, so About or Work could cover Hero even at scrollY 0
3. Header labels, destinations and desktop/mobile controls differed between home and child pages
4. Viewport-scaled headings outgrew the fixed content grid, especially in Chinese
5. Ordinary scenic photos were clipped into polygons; a 720px portrait footer image was stretched across desktop
6. English initial HTML and partially translated controls caused a language flash and mixed labels

## Implementation approach

- Keep static HTML, CSS, local fonts, GSAP and GitHub Pages
- Generate shared header/footer markup into committed HTML; navigation does not depend on JavaScript
- Deliver Chinese content in HTML and retain an English dictionary for the language control
- Use native page links and browser restoration; no opacity-based page exit interception
- Build scene motion from explicit initial and final states, with one refresh/restoration path
- Enable scene pinning only on suitable desktop viewports; normal document flow is the fallback
- Use one content width, spacing scale and separate Chinese/English typography rules
- Use real website screenshots for Jinhong, and existing capstone imagery for AI
- Preserve keyboard navigation, visible focus, native carousel scrolling and reduced motion

## Landscape asset dependency

The existing Wānaka photograph is 1536 × 1152; the Horseshoe Bend image is only 720 × 960.
The current Wānaka photo can demonstrate correctly registered layers without inventing a landscape.
For a sharp large-desktop final version, request an original horizontal photograph at least 3000px wide,
with a clear sky/land boundary and enough sky for the name. The mask must be retraced when the photograph changes.

## Verification scope

- Six-route navigation, home return and browser Back/Forward
- Chinese → English → Chinese at top, mid-scene, project and footer positions
- Reversible scene motion and five real AI phone states
- USA carousel buttons, dots, keyboard and complete photo compositions
- Semantic headings, translated controls, local assets, build and GitHub Pages-relative paths
- Static responsive/reduced-motion rules plus browser layout and interaction checks where supported

The feature branch is the review surface; publication to main requires a later merge decision.
