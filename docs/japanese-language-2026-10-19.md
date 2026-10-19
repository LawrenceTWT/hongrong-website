# Japanese language support

## Scope

- Branch: `feature/japanese-language`, based on `26d1cfdfde94961e95498730b39cc1ea8c3550c4`. This deliberately retains the unmerged opening-startup fix from PR #7; it does not roll the site back to an older opening implementation.
- Six routes retain their existing static architecture, photographs, central container, glass header, project order and motion.
- Chinese remains the first-visit default. The header offers 中文 / English / 日本語 in a native, keyboard-accessible selector. Only an explicit selection is stored; blocked storage and unknown values safely fall back to Chinese.
- `js/copy-ja.js` contains all 367 translation keys corresponding to English, including the 340 keys currently used by HTML. Chinese HTML and existing English wording remain unchanged.
- Japanese includes page titles/descriptions/Open Graph locale, image alternatives, navigation labels, form subjects/placeholders, carousel announcements, skill evidence, phone labels and simulated walkthrough feedback.
- The contact form still only composes a mailto URL. Translation does not send messages, request microphone access or connect the demonstration to a live API.

## Typography and layout safeguards

- Japanese uses a self-hosted Noto Sans JP subset with Japanese glyph forms and kana. Its emitted file is 303,196 bytes, retains variable weights and includes the upstream OFL license. It is not a Chinese font substituted for Japanese.
- CJK title sizes, readable line heights and normal emphasis styling apply to Japanese at the same desktop/tablet/mobile breakpoints as Chinese. Japanese uses stricter line-breaking and restrained tracking; text may wrap rather than collide with nearby columns.
- The two intentional one-line About mottos are column-bounded. Font-metric probes put each at 95.9% of the text column at the maximum `10.3cqi` size. Existing Chinese wording and its three explicit introductory lines are preserved.
- Grid text children can shrink, metadata/captions can wrap, CTA widths cannot exceed their parent, and narrow technical labels have emergency wrapping. The shared 1080px central container is unchanged.
- The mobile language selector is 92px wide. A conservative 320px header probe budgets 256.5px for the brand, selector, gap and menu against 262px of inner space. The longest selector label (English) measures 41.7px against 54px of text space. These are font metrics, not actual browser boxes.
- Language-driven refresh waits a frame for the new font request, then `document.fonts.ready`, then remeasures. Obsolete refreshes remain cancellable. A slow Japanese font cannot override a deliberate return to the hero.

## Verification

Passed:

1. `npm run build`, including HTML/assets/shared layout, both translation maps and emitted Chinese/Japanese font coverage hashes.
2. `npm run test:language`: all six actual HTML documents, repeated three-language round trips, attributes/metadata/section numbering, persistence and blocked storage, menu state, all skill mappings, current carousel photo, phone/portrait state, contact drafts and Japanese mailto body.
3. Reading-position tests: rapid three-language changes, normal-flow and pinned scenes, deliberate scrolling, return-to-top and late font arrival.
4. Existing motion and opening suites: actual bundled GSAP timeline checks, reversible transitions, centered About CTA, landscape reveal, vines, five real phone screens, reduced motion, opening timing and startup initialization.
5. `scripts/check-font-layout.py`: emitted-font metrics for the two one-line mottos and three mobile language labels.
6. `git diff --check`.

Browser visual QA was not available: the required `control-browser` capability is absent. Following the Sites workflow, no preview server or substitute browser automation was started. DOM fixtures, source checks and font metrics **do not prove** that every browser/device renders without overlaps. Actual review at 320, 375, 768, 1024, 1440 and 1920px, text enlargement, slow fonts and touch/native-select behavior remains necessary before claiming that guarantee.

## Maintaining translations

- Add the same key to `js/copy.js` and `js/copy-ja.js`; retain the Chinese source in HTML.
- Runtime UI phrases and Japanese skill-to-project mappings belong in `js/languages.js`.
- Edit shared navigation in `partials/header.html` and run `npm run sync`.
- When introducing new Japanese kanji, rebuild with `scripts/subset-japanese.py` using its pinned source, then rerun validation. The complete upstream source is intentionally not committed or downloaded by visitors.
- Client-side language selection does not create separate Japanese URLs. No fictitious hreflang URLs or claims of separately indexed Japanese pages were added.
