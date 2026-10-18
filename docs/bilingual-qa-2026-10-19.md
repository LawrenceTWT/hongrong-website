# Six-page language audit

Branch: `feature/skills-vines-intro`

Base: user-authored commit `46e715925ad64e9d245480893cc6063501df9426`

## Confirmed problems and repairs

| Problem | Repair |
| --- | --- |
| The new About introduction placed an `h4` inside a translated `p`. HTML parsing closed the paragraph early, leaving the Chinese introduction outside its translation boundary | Retained “Be Water, My Friend.” as its own English paragraph; kept the user's Chinese introduction in a valid translated paragraph, with line breaks instead of terminal Chinese full stops |
| About title, introduction, learning story, lost-site note and overseas-work heading still used older English content | Updated the matching English entries to reflect the user's new wording; corrected the Chinese deployment typo without changing the account of the lost site |
| Journey, USA and Outside chapters changed numbers when switching language | Matched English chapter numbers to the existing Chinese sequence, 01–04 |
| “Self-awareness” still became “WHAT DRIVES ME” | Matched the English trait heading to the user's new Chinese heading |
| Prototype running/completed messages remained in the previous language until another state change | One status renderer now follows both prototype state and the current language, including an in-progress language switch. Page departure clears interrupted feedback |
| A short-screen reading position was anchored to the whole scene sequence rather than the visible inner scene | Normal-flow restoration selects the actual Hero/About/Work panel. Pinned scenes continue to retain their logical scroll progress |
| Rapid toggles could capture an already-shifted position before the first font/layout restoration completed | Consecutive toggles share the first pending reading anchor; a revision token prevents stale completions from clearing it. Deliberate scrolling or navigation cancels the pending restoration |
| English tab titles changed but descriptions and Open Graph metadata remained Chinese | Added English route metadata and synchronized title, description and locale, restoring the original Chinese values when switching back. Initial HTML remains Chinese; this is not a claim of separate English SEO indexing |
| Newly authored Chinese characters were absent from both local font subsets | Regenerated Regular/Bold fonts and their coverage manifest from the existing verified source fonts |

The three user-authored trait columns, imagery, glass navigation, project evidence and the five-screen phone story are retained. No generated images or framework migration were introduced

## Reproduction

Parsed the original `46e7159` About markup and applied the English dictionary. The Chinese introduction remained as an untranslated text fragment outside its original paragraph. The repaired markup passes the same full-page Chinese-leak check

## Automated verification

`npm run test:language` executes the actual production module against each of the six parsed HTML documents using the development-only LinkeDOM package:

- Chinese-first entry and three English → Chinese round trips per route
- English text and accessibility attributes, original Chinese restoration and matching chapter numbers
- Tab title, description and Open Graph metadata in both languages
- Original links, input/control nodes, skill SVGs and portrait decoration surviving repeated translations
- Explicit English preference restored on every route, and switching still working when storage is blocked
- Open/closed mobile-menu labels and main-content inert state
- Skill project/learning feedback and the selected carousel photograph surviving a language change
- Active phone screen and flipped portrait face retained across language changes
- Contact name, email, message and selected subject retained
- Prototype running/completed feedback switching immediately and clearing after page departure
- Normal-flow reading anchors at 680, 719 and 900px height; rapid toggles, deliberate-scroll cancellation and returning to the hero while a restoration is pending
- Language restoration bridged to the pinned-scene contract; the separate motion suite exercises actual composition with the bundled GSAP engine

Fixtures provide geometry, timers and storage. LinkeDOM's digit-containing `dataset.i18n` lookup is adapted to the native browser attribute semantics inside the test harness; production translation code is unchanged for that library quirk. The tests do not claim to render CSS, simulate native constraint-validation messages, or reproduce real browser scrolling

`npm run build` includes the existing shared-layout, asset, heading/link, font-coverage and motion checks as well as the language suite. The full font originals and test dependency are not shipped in `dist/`

## Browser verification limit

The managed environment does not provide the required `control-browser` capability. The Sites skill directs: “If $control-browser is unavailable, skip browser QA.” No preview server, browser installation or alternative local-preview browser-control path was used

Therefore real desktop/mobile composition, font rendering, keyboard focus presentation, native form-validation language and perceived wheel pacing on this branch remain unverified in a browser. The earlier live-production check in `docs/qa-2026-10-18.md` applies to its stated older commit, not these changes
