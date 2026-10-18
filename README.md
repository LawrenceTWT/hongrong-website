# HongRong Portfolio

A bilingual personal portfolio website for HongRong, inspired by editorial design and smooth scroll-led interactions.

## Pages

- `index.html` — Home
- `about.html` — About, experience, skills, and certifications
- `work.html` — Selected work index
- `jinhong-foods.html` — Jinhong Foods case study
- `ai-driving-assistant.html` — AI Driving Assistant case study
- `contact.html` — Contact links and email form

## Folder structure

```text
hongrong-portfolio/
├─ index.html
├─ about.html
├─ work.html
├─ jinhong-foods.html
├─ ai-driving-assistant.html
├─ contact.html
├─ css/
│  └─ styles.css
├─ js/
│  └─ main.js
└─ assets/
   ├─ favicon.svg
   ├─ fonts/
   ├─ images/
   └─ docs/
```

## Run locally in VS Code

No build step is required.

1. Open this folder in VS Code.
2. Install the **Live Server** extension if you do not already have it.
3. Right-click `index.html` and choose **Open with Live Server**.

You can also run a simple local server from the project folder:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

If Node.js is installed, the included scripts offer another option:

```bash
npm run dev
```

Development checks require Node.js 20.19 or newer. To install the development-only DOM test dependency and create a static copy in `dist/`:

```bash
npm ci
npm run build
```

The build runs source validation, motion checks and the six-page language regression suite. `npm run test:language` runs the latter on its own. LinkeDOM is used only by development checks; visitors still receive static HTML, CSS and JavaScript, with no new runtime dependency. The DOM fixtures do not measure browser layout or rendering

## Editing content

- Page structure and initial Traditional Chinese copy: edit the `.html` files.
- Colors, typography, layout, animation, and responsive behavior: edit `css/styles.css`.
- English translations: edit `js/copy.js`; each `data-i18n` key maps to the Chinese HTML.
- When changing Chinese copy, update its English entry as well. `englishPageMetadata` in the same file maintains the English tab title and document metadata.
- Keep headings outside paragraphs. A heading inside a translated `<p>` causes HTML parsers to move the remaining copy outside the translation boundary.
- Interactive behavior: edit `js/main.js`.
- Shared header and footer: edit `partials/`, then run `npm run sync`. The generated HTML is committed and works without JavaScript.
- Homepage portrait faces: `assets/images/hongrong-formal.webp` and `assets/images/hongrong-glacier.webp`. Keep their intrinsic dimensions and translated alt text synchronized with replacements. The About photo is maintained separately.

## Notes

- Traditional Chinese is the initial HTML language. An explicit English/Chinese choice is saved under `hongrong-language-choice` in `localStorage`.
- The contact form creates a pre-filled email in the visitor's email app. It does not store or transmit form data through a server.
- English typography uses locally hosted Geist and Libre Caslon Condensed. Traditional Chinese uses a site-specific web subset of GenSen Rounded TW.
- The corresponding SIL Open Font License files are included in `assets/fonts/licenses/`.

## Chinese font maintenance

The webfonts cover the site's current copy. Validation checks coverage and the emitted font hashes, so new Chinese characters cannot silently fall back to another font.

After adding copy, obtain the Regular and Bold OTF files from [GenSen Rounded](https://github.com/ButTaiwan/gensen-font/tree/d347d3fffcb45e08857052433a0b432ed4f7ace8/otf/TW), install `fonttools`, then run:

```sh
python scripts/subset-fonts.py --regular /path/to/GenSenRounded2TW-R.otf --bold /path/to/GenSenRounded2TW-B.otf
npm run validate
```

The script verifies the upstream source font hashes, rebuilds only the required glyphs and updates `assets/fonts/gensen-coverage.json`. The full upstream OTF files are not served.

## Redesign and media

- Current decisions and verification scope: `docs/ux-redesign.md`
- The five AI screens and model figures are original project evidence
- Jinhong previews are captures of the actual live website, taken on 2026-10-17
- Ordinary photographs preserve their composition inside rectangular frames
- Shared content is capped at 1080px; botanical graphics may extend into its margins while text and projects stay aligned
- The hero flips between the user-provided formal and glacier photographs on hover, tap or keyboard activation; reduced motion switches instantly
- Project overview cards use real app and website screenshots; the generated covers and ivy bitmap have been removed. Existing SVG ivy still follows scroll progress
- Current interaction decisions and asset provenance are in `docs/visual-polish.md`
- The closing landscape uses a shared SVG coordinate system for the image, name and ridgeline mask. Replacing the photo requires tracing its own boundary
- The existing Wānaka photo is 1536 × 1152. A new horizontal original of at least 3000px is still needed for a sharper large-desktop closing scene
