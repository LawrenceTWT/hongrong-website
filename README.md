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

To create a production-ready static copy in `dist/`:

```bash
npm run build
npm run validate
```

## Editing content

- Page structure and English copy: edit the `.html` files.
- Colors, typography, layout, animation, and responsive behavior: edit `css/styles.css`.
- Traditional Chinese copy and interactive behavior: edit `js/main.js`.
- Replace the portrait at `assets/images/hongrong-portrait.png` while keeping the same filename.

## Notes

- English is the default language. The language switch stores the visitor's preference in `localStorage`.
- The contact form creates a pre-filled email in the visitor's email app. It does not store or transmit form data through a server.
- English typography uses locally hosted Geist and Libre Caslon Condensed. Traditional Chinese uses a site-specific web subset of GenSen Rounded TW.
- The corresponding SIL Open Font License files are included in `assets/fonts/licenses/`.
