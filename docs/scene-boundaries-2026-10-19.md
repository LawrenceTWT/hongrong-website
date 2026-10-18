# Centered About and progressive landscape

Branch: `feature/skills-vines-intro`

Base: `bba6f530f73fd8a043439f9271fbed16c6663c56`

## Requested motion

The supplied Fathom stills show a centered statement meeting the following section and a translucent wordmark behind a landscape. They establish composition and overlap; still images do not establish measured reference timing

The homepage keeps its existing static architecture, central 1080px content token, three-scene sequence, glass navigation, 2.5-second intro, actual project imagery and five-screen phone story. No wheel handler intercepts scrolling, no snapping is added and no extra scroll distance is introduced

## About boundary

The About heading and its story CTA now occupy one centered `.about-scene-content` group. The small section label sits independently above it, so the label and bottom CTA no longer distribute the statement unevenly across the available grid height

The scene still enters and holds at the original timeline labels. As Work begins entering, the group initially compensates for its parent panel's upward movement and remains at its center. When the incoming Work edge reaches the group's lower edge plus a 24–40px safety gap, that edge carries the group upward. The CTA remains attached to its heading and is not covered independently

In layout coordinates, let the viewport scene height be `H`, measured group bottom be `B`, safety gap be `G`, and eased Work entry progress be `p`. Work's edge is `H × (1 − p)`. The group's net displacement is `min(0, edge − B − G)`. Its local compensation also cancels the parent's `−0.2 × H × p` displacement

The calculation uses the actual rendered group height after fonts and language changes. Layout measurements use `offsetTop`, `offsetHeight` and `clientHeight`, so the current transform cannot feed back into subsequent measurements. Refresh remeasures; each motion tick uses those cached values. Unchanged transforms are not rewritten

Both parent movement and the entry-progress helper now use the same sine curve. This removes abrupt scene starts/stops while keeping text, vines and panels aligned. Existing 0.8-second GSAP scrub remains. Reverse scrolling follows the same boundary calculation rather than triggering a separate animation

This counter-transform exists only inside the desktop scene enhancement. Small screens, short viewports, reduced motion and no-JavaScript layouts retain their readable normal flow. Match-media cleanup removes the inline hold value and resets access state

## Landscape reveal

The existing Wānaka image and traced foreground remain in one SVG. A separate ScrollTrigger starts when the landscape's top reaches the viewport bottom and ends when its bottom reaches the viewport bottom

- The complete SVG settles from 1.035× to 1×, preserving the exact image/foreground registration
- The semitransparent HongRong wordmark rises from 260 SVG units below its final position, emerging from behind the ridge
- The small photo credit travels only 12px; there is no large opacity fade, blur or generated replacement image
- Progress is scrubbed and reversible. No extra pinned footer or artificial blank scroll range is added

Layout/language restoration settles both the homepage and landscape scrub timelines at their restored logical progress. Reduced motion skips this landscape timeline and displays the final static SVG; the source HTML also remains complete without JavaScript

## Glacier follow-up

The user requested removing the water lines after the framing revision. The inline water-contour SVG, paint definitions, stroke transitions and unused selectors are removed. The original glacier image, 4:5 cover crop, formal face, flip button, hints, focus feedback and touch/keyboard behavior remain

## Validation

- The actual production scene and landscape functions run against the bundled GSAP engine in `npm run test:motion`
- Boundary samples cover 760, 900 and 1080px scene heights, two measured content heights, 101 forward positions and the identical reverse positions per combination. Checks compare the text/CTA position with the actual eased Work-panel edge and ensure the safety gap is maintained
- Scene text and vines are compared with actual panel progress, so changing the easing cannot silently leave these layers on a linear clock
- Landscape samples verify partial, final and reversed text/image positions, trigger bounds, scrub and immediate settlement during layout restoration
- Existing normal-flow text, reduced-motion plant/text, opening, language round trips, six-page assets and phone/portrait-state checks remain in the build

Browser visual QA is unavailable: the managed preview requires `control-browser`, which is not installed. DOM and geometry fixtures verify program state rather than actual font rendering, native match-media cleanup or measured wheel feel. No new browser screenshots or frame-for-frame fidelity claim is made
