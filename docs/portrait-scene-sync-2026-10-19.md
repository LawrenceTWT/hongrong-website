# Portrait crop and synchronized scene entry

Branch: `feature/skills-vines-intro`

Base: `5ac3e64902dd417dc8ca1058343fa3a6ebe64976`

## Glacier framing

The existing 800 × 1422 glacier photograph was inspected alongside the 700 × 890 formal portrait. Using `contain` in a 4:5 area made the reverse image approximately 70.3% of the frame width. The new `cover` display fills the same width and height as the formal face, approximately 42.2% larger than its previous display scale

The glacier image uses `object-position: 50% 86%` and inherits the same 18px frame radius. At the fixed frame ratio, the visible source rectangle is approximately x 0–800, y 363–1363. Visual inspection of the original identifies the person and crampons within roughly x 190–640, y 640–1300; these bounds fit within the calculated crop. Upper sky is removed while the person remains in view

The source photograph is unchanged. No new or edited raster image, border mat or extra bitmap download is introduced. The water contours present in this revision were subsequently removed at the user's request; see `docs/scene-boundaries-2026-10-19.md`. Hover, touch, keyboard and reduced-motion behavior retain the existing control

## One entry clock

Previously the About panel arrived at timeline position 1.4, its plants finished at 1.25 and the final-line text sweep continued to 1.95. Independent CSS transitions also delayed branch and leaf display after each progress update

`getSectionEntryProgress` now supplies both text and decorative plant progress:

| Composition | Timeline positions | Completion |
| --- | --- | --- |
| About enters | 0.12–1.4 | Panel reaches zero translation; both plants and the final-line sweep reach 100% |
| About reading pause | 1.4–2.1 | Complete composition remains available; the CTA stays centered |
| Work enters | 2.1–3.4 | Work reaches zero translation and its plant reaches 100% |

These are positions on a scroll-scrubbed timeline, not fixed playback durations. The original 0.8-second GSAP scrub, scene transforms and overall scroll distance are retained. Text begins its color sweep after 55% of entry so the final line is coming into view; it completes at arrival

The emphasized line sizes its gradient to its own text width and remains centered. This avoids spending part of the sweep on empty space on either side of the text

Normal-flow sections begin at the viewport's lower edge. If the section fits in the viewport, its plants complete when its full height is visible. Longer sections complete at their first full viewport, with their top at the viewport top. Small intentional differences in plant starting offsets remain, but every plant shares its section's completion point

The extra CSS interpolation on branch strokes and leaf transforms is removed, so they follow the same progress as the scene rather than trailing it. The leaf growth coefficient now lets even the last leaf become fully open by 100% progress

Hero and child-page opening plants remain complete from the initial view. The AI phone's separate continuous five-screen story remains intact. Reverse scrolling restores the same composition; reduced motion displays static complete plants and text

## Verification

- Original photograph inspection and numeric crop geometry, including the full-person/crampon bounds above. This is a composition estimate from the supplied image, not automated face detection or browser rendering
- The production entry helper, About text update and plant update are exercised by `npm run test:motion` with the bundled GSAP timeline. Checks cover partial entry, completion at the same scene time, reading-pause stability, delayed left/right plants and reverse restoration
- Normal-flow text checks cover 680, 719 and 900px heights and regions shorter than, equal to and taller than the viewport. Plant checks cover full-height and shorter sections
- The six-route language suite checks retained phone/portrait state, repeated language changes and reading-position restoration. Build validation covers the local assets, fonts and shared layout

Browser visual QA remains unavailable because the managed environment lacks `control-browser`. No new desktop/mobile browser screenshots or measured real-wheel pacing are claimed. The calculated crop and scene-state checks do not replace seeing the updated composition in a browser
