# HongRong Portfolio Story Redesign Plan

- Repository: LawrenceTWT/hongrong-website
- Planning branch: feature/portfolio-story-redesign
- Audited base: main at a373a2ce6276a43453496bbd1b91b1547682345e
- Status: plan approved; implementation is in progress on the feature branch
- Review decision (2026-08-28): the compact four-section / rectangular project-window experiment is cancelled. Preserve the sticky AI phone sequence while the next organic, vine-led visual direction is researched and discussed before implementation.
- Product position: AI × WEB × PRODUCT
- Narrative principle: every layout, motion, and visual element must explain HongRong's growth, work, or decisions. If it only looks impressive, it does not ship.

## 1. Current audit

### 1.1 Current information architecture

| Route | Current role | Main content | Audit finding |
|---|---|---|---|
| index.html | General portfolio homepage | Hero, toolkit, statement, capabilities, About preview, two projects, process, CTA | Clear and polished, but it reads as a Web Developer résumé before it reads as HongRong's story. |
| about.html | Biography / résumé | Portrait, manifesto, timeline, skills matrix, certifications, CTA | Contains useful evidence, but the most meaningful USA experience is compressed into one timeline row. |
| work.html | Project index | Jinhong Foods, AI Driving Assistant, generic project principles | Useful route to preserve, but the two projects are presented through the same template even though their origins and lessons are different. |
| ai-driving-assistant.html | Capstone case study | Challenge, four features, contribution, learning | Starts at the product summary instead of the daily traffic problem; model work, failures, trade-offs, and recovery are absent. |
| jinhong-foods.html | Client case study | Brief, six features, build, links | Shows features and stack, but not the friend/client relationship, research process, first real-user responsibility, or unfinished SEO work. |
| contact.html | Contact route | Contact details, mailto form, marquee | Functional and honest. It can remain as a deeper contact route while the homepage gets a concise contact ending. |

The current site is a six-page static site. The redesign should keep those URLs working, but index.html becomes the canonical narrative spine. The project pages remain evidence-rich deep dives. about.html, work.html, and contact.html remain useful secondary routes and must not duplicate the complete homepage story.

### 1.2 Design system worth keeping

The following system already has a distinctive base and should be evolved, not discarded:

- Warm paper palette: #ebe7da, #f5f1e6, and #ddd7c7.
- Charcoal ink: #1b1a17.
- Existing olive/green direction and the botanical asset.
- English display type: Libre Caslon Condensed.
- English UI/body type: Geist.
- Traditional Chinese type: GenSen Rounded TW.
- Local font hosting with font-display: swap.
- Fluid spacing and type built with clamp().
- Shared page padding through --page-pad.
- Thin rules, editorial labels, restrained pills, and generous whitespace.
- Glass navigation and portrait card treatment.
- Grid/Flexbox as the primary layout system.
- Light/dark chapter contrast without turning the site into a black technology theme.

Changes to the visual system:

- Add explicit sage, olive, and deep-forest tokens.
- Reduce the current rust accent to a small signal color rather than a competing brand color.
- Keep rounded/glass treatment for the navigation, portrait, and selected controls only.
- Reduce repeated rounded project cards and repeated / number / © labels.
- Treat the vine as a navigational growth path, not a reusable background decoration.
- Use editorial composition, scale, cropping, and whitespace to create difference between chapters.

### 1.3 Reusable CSS

Keep and extend:

- Font-face declarations and typography variables.
- Color, spacing, header, radius, and page-padding variables.
- section-pad, button, text-link, eyebrow, and baseline reset utilities.
- The glass site-header styling and scrolled state.
- The portrait flip, front/back faces, tilt variables, and focus-visible behavior.
- Grid/Flex foundations for hero, two-column narratives, timelines, and footer.
- Fluid clamp() scales.
- Existing mobile breakpoints at 1120px, 820px, and 540px as a starting point.
- prefers-reduced-motion coverage.
- Footer overflow safeguards and min-width: 0 protections.

Refactor or replace:

- The universal “one section equals one bordered grid/card system.”
- skill-tiles, process-card, matrix-grid, feature-grid, and repeated case-study blocks where they create the same visual rhythm.
- The botanical vine as a CSS background. The current SVG is a reusable visual source, but its stem and leaves are not targetable when used as background-image, so it cannot become a meaningful scroll-drawn path.
- Repeated fixed-height card/min-height rules when content-led sizing is safer.
- The same fade-up reveal on nearly every element.
- Large decorative labels that do not add narrative information.
- The faux Jinhong browser composition once real site screenshots are available.

### 1.4 Reusable JavaScript

Keep and adapt:

- Central Traditional Chinese dictionary and data-i18n mechanism.
- English copy stored from the HTML.
- localStorage language preference with safe error handling.
- Taipei local time and current-year updates, moved to secondary UI.
- Active navigation state.
- IntersectionObserver reveal infrastructure.
- requestAnimationFrame scroll batching.
- Fine-pointer detection and coarse-pointer fallbacks.
- prefers-reduced-motion detection.
- Portrait tilt and accessible flip control.
- Menu open/close state and Escape handling.
- Mailto contact-form behavior.
- Back-to-top action.
- Internal page transition behavior, provided it never delays navigation noticeably.
- Existing validation/build/serve scripts and static dist output.

Extend later:

- A single scroll progress controller for vine growth and sticky chapter states.
- IntersectionObserver state changes for the AI phone rather than many independent scroll listeners.
- Keyboard/focus parity for skill-to-project mappings.
- Optional magnetic CTA only for fine pointers and only when reduced motion is off.
- Image/parallax transforms limited to visible elements.

### 1.5 Existing interactions

The current site already includes:

- First-visit loader.
- Floating glass navigation with pointer-reactive highlight.
- Full-screen menu.
- English / Traditional Chinese switching.
- Live Taichung time.
- Scroll reveal.
- Scroll-scrubbed statement text.
- Accordion capabilities.
- Portrait tilt, shine, and click/keyboard flip.
- Hover movement for work mockups.
- Custom cursor orb.
- Page fade transition.
- Back-to-top.
- Contact form that opens the visitor's email app.
- Animated contact marquee.
- Reduced-motion CSS fallback.

Audit decision:

- Preserve portrait flip, bilingual switching, menu, contact behavior, and restrained glass feedback.
- Reuse the observer and scroll batching infrastructure.
- Shorten or remove the loader if it delays first content.
- Replace universal fade-ins with chapter-specific motion.
- Keep the cursor reaction subtle or remove it on visually dense chapters.
- Do not add scroll hijacking, heavy 3D, particles, or a large animation library by default.

### 1.6 Current RWD structure

Strengths:

- Fluid type and spacing.
- Grid/Flex layouts collapse at 820px.
- Dedicated compact rules at 540px.
- Desktop navigation disappears below 1120px.
- Coarse pointers disable cursor effects.
- Mobile portrait and case-study layouts already simplify.
- min-width: 0, overflow clipping, and responsive widths prevent several common overflows.

Risks to address:

- Breakpoints are page-wide rather than component-led; long Chinese copy can still create dense blocks.
- Many min-heights can leave excess empty space or awkward crops on short landscape screens.
- Sticky sections need explicit release behavior on small/short viewports.
- Fixed visual aspect ratios need content-safe fallbacks.
- The hidden menu currently uses visibility and aria-hidden but needs stronger focus management/inert handling.
- Hover-only project/skill information needs focus and touch alternatives.
- Gentle parallax must be disabled on coarse pointers and reduced-motion settings.
- Editorial overlap must collapse into normal document flow below tablet width.

Target QA widths: 360, 390, 540, 768, 820, 1024, 1120, 1366, 1440, and 1920 pixels, plus short landscape viewports and browser zoom at 125% and 200%.

### 1.7 Repeated content

- Header, mobile menu, social links, footer, and CTA structure are copied across all six HTML files.
- About content appears on the homepage, about page, AI case page, and timeline in slightly different wording.
- Skills appear as toolkit tiles, capabilities accordion, skills matrix, project tags, and generic process/principles.
- Jinhong's synthetic browser mockup is repeated on index.html, work.html, and jinhong-foods.html.
- AI project screens and summary language repeat without adding deeper evidence.
- “How I work” and “What each project should do” communicate similar generic principles.
- 2026 and numbered copyright-style labels repeat even when the number has no real meaning.
- Contact CTAs repeat the same message without advancing the story.

Content rule for the redesign:

- Homepage tells the canonical story.
- Project pages prove the work.
- Secondary pages index or expand facts.
- Repeated summaries must point forward; they should not retell the same paragraph.

### 1.8 Sources of template feel

- Nearly every chapter begins with the same kicker + oversized heading + section number.
- Skills, process, principles, and features use interchangeable rectangular grids.
- Both case studies share the same challenge / features / build template.
- Most motion is the same upward fade.
- Generic copy such as “solve a real problem,” “respect the user,” and “test and refine” could belong to many portfolios.
- A single portrait is reused in three prominent places.
- The current faux browser and repeated feature cells prioritize presentation polish over project origin, decisions, and limitations.
- Certifications and toolkit blocks currently take more visual weight than their importance to the new positioning.

### 1.9 Storytelling blockers

- There is no chronological path from childhood curiosity to Information Management, coding frustration, the lost sneaker site, GPT, capstone leadership, a real client, the USA experience, and the next direction.
- The first website is absent, so the first moment of creative agency is missing.
- GPT is presented as a capability rather than the turning point in how HongRong learned.
- The AI Driving Assistant opens with a polished solution rather than the daily traffic and road-safety problem.
- The AI model's dataset limits, 70–80% accuracy range, middle-class weakness, conversion problem, normalization mismatch, and recovery work are not shown.
- Jinhong does not explain why a real company trusted HongRong or what changed when the user was no longer hypothetical.
- USA is reduced to employment history; the SSN difficulty, Kaytlin, cultural adaptation, and courage outcome are missing.
- Basketball, games, music, photography, travel, and nature are absent.
- The future direction is generic web work instead of AI applications, product development, and web products.
- Navigation splits the narrative before the visitor understands the whole arc.

## 2. New information architecture

### Primary narrative: index.html

1. HERO
2. MY JOURNEY
3. AI DRIVING ASSISTANT
4. JINHONG FOODS / REAL CLIENT
5. USA / OUT OF MY COMFORT ZONE
6. OUTSIDE THE SCREEN
7. SKILLS / HOW I BUILD
8. WHAT'S NEXT
9. CONTACT

Recommended global navigation:

- Journey
- Work
- Life
- Skills
- Contact
- Language toggle

On index.html, navigation targets chapter anchors. On inner pages, the same items link back to index.html anchors. Local time, coordinates, and availability move to secondary hero metadata or the footer.

### Preserved routes

| Route | New responsibility |
|---|---|
| index.html | Canonical story and primary hiring/product narrative. |
| ai-driving-assistant.html | Full technical/product case study: problem, role, system, prototype, model, failures, fixes, reflection, rebuild plan. |
| jinhong-foods.html | Full real-client case study: relationship, goal, research, IA, design, build, delivery, maintenance, honest SEO next steps. |
| work.html | Lightweight project index and entry point to both case studies; no generic principle grid. |
| about.html | Compact factual profile, experience, travel context, and certification archive; no duplicate long-form homepage story. |
| contact.html | Detailed contact form and links; homepage contact remains concise. |

No existing route is removed in the first implementation. This protects bookmarks, GitHub Pages URLs, and search history.

## 3. Story flow

### 01 Hero — position before biography

Core copy:

- HONG RONG.
- AI × WEB × PRODUCT
- “I turn ideas into useful digital products.” or the approved alternative.
- One concise supporting line.
- Portrait flip retained.

Back of portrait:

- CURRENTLY
- Learning — JavaScript / Product Thinking
- Building — Web experiences
- Exploring — AI Applications
- Based in — Taichung, Taiwan

Purpose: establish the new position in one screen and invite a small act of discovery without front-loading résumé metadata.

### 02 My Journey — tension, first creation, turning point

Sequence:

- “Computers always felt interesting to me. Coding didn't.”
- 2021 — Information Management; coding felt frustrating.
- 2022 — first sneaker website; first feeling of creating something.
- “404 / MY FIRST WEBSITE / MEMORY ONLY.”
- Explicitly say the site was lost because there was no backup.
- “Then GPT changed how I learned.”
- Messy questions/code resolve into a clearer mental model.
- “AI didn't replace thinking. It helped me understand.”
- Close with ownership: HongRong remains responsible for requirements, logic, architecture, and decisions.

Purpose: explain the relationship with AI honestly. The lost site is represented as memory, never with a fabricated screenshot.

### 03 AI Driving Assistant — apply the new way of thinking

Narrative order:

1. Daily commute and road-safety context.
2. Product idea and intended driver outcome.
3. Five-person team and HongRong's specific responsibilities.
4. Navigation, parking, traffic, vehicle location, GPT, voice, and TDX.
5. Sticky-phone progression through Problem → Idea → Navigation → Parking → Traffic → AI → Model.
6. Clearly labeled interactive prototype for “Find parking nearby.”
7. VOICE → STT → GPT → TDX API → Parking Data → Response.
8. ResNet-18 and six traffic levels.
9. What did not work.
10. Fixes and evidence.
11. If I built it again.

Purpose: this is the central case study because it connects life observation, product framing, leadership, APIs, AI, Android, failure, and iteration.

Truth constraints:

- Prototype is never labeled live.
- Accuracy remains an approximate 70–80% range unless a verified final metric is supplied.
- Precision, Recall, and confusion-matrix visuals use real values only.
- No production-safety or accident-prevention claim is made.

### 04 Jinhong Foods — first accountable client

Narrative order:

- “My first real client came through a friend.”
- Friend preparing to take over the family business.
- Before / Goal / Research / Information Architecture / Design / Build / Delivery / Maintenance / Next.
- Large browser view using actual site captures.
- React and TypeScript appear as implementation evidence, not the headline.
- Close with the responsibility shift: building for a company and real visitors.
- Honest next step: SEO, Search Console, structured data, and content optimization are not yet complete.

Purpose: prove that HongRong can move from a personal/student context to a real stakeholder and maintain a deployed product.

### 05 USA — courage through discomfort

Narrative order:

- “I LEFT MY COMFORT ZONE.”
- “My English wasn't good. That was exactly why I wanted to go.”
- Hip-Hop / R&B and long-standing curiosity about American culture.
- South Dakota arrival: unfamiliar food and culture.
- SSN counter difficulty and employer assistance.
- Hospitality/housekeeping and daily English communication.
- Kaytlin's patience and corrections.
- Friends, work, and travel.
- “I came home with more courage.”

Purpose: show behavior under uncertainty, not decorate the portfolio with travel images.

### 06 Outside the Screen — the person people remember

Content:

- Basketball.
- Apex Legends and League of Legends.
- Hip-Hop / R&B.
- Photography.
- Travel.
- Nature and large landscapes.
- New Zealand after military service.
- “If there's a view worth remembering, I probably want to be there.”

Purpose: create a memorable, specific human impression and connect nature to the site's growth language.

### 07 Skills / How I Build — evidence, not ratings

Groups:

- BUILD — HTML, CSS, JavaScript, React, TypeScript.
- CONNECT — REST API, TDX, GPT, Firebase.
- EXPLORE — AI, Prompt Design, ResNet, AWS, Azure.
- WORK — Project Planning, Teamwork, Problem Solving, Cross-cultural Communication.

Each skill maps to the project or experience where it was used. Hover, focus, and tap expose the mapping. Certifications become a quiet horizontal text/badge rail: IBM, Google Cloud, AWS, Microsoft, and TQC+ only when the exact certificates are verified.

Purpose: let visitors verify capability after seeing the work that created it.

### 08 What's Next — direction

- AI Applications.
- Product Development.
- Web Product.
- Real user problem → requirements → logic → AI/Web/API → useful product.
- CTA: “LET'S BUILD SOMETHING USEFUL.”

Purpose: convert the past story into a specific future direction.

### 09 Contact — low-friction ending

- Email, GitHub, and Instagram.
- Concise availability statement.
- Link to the detailed contact form.
- Vine reaches its final growth point in the footer.

Purpose: give the visitor a clear next action after the story resolves.

## 4. Layout strategy

| Chapter | Layout | Why it exists | Responsive behavior |
|---|---|---|---|
| Hero | Asymmetric two-column grid with large whitespace and smaller portrait card | Separates identity/position from personal discovery | Stacks in normal flow; portrait remains fully operable without tilt |
| Journey | Vertical editorial timeline with one continuous vine spine | Makes growth and chronology physically readable | Vine moves to the margin; entries become single-column |
| Lost website | Large typographic 404 interruption | Makes absence itself truthful evidence | Text scales and wraps; no fake browser frame |
| GPT turning point | Progressive text/code-to-interface composition | Visualizes increased understanding | Static before/after sequence under reduced motion |
| AI case | Copy rail plus sticky phone; state changes by chapter marker | Keeps one product object in view while the reasoning evolves | Sticky disabled on short/mobile viewports; screens appear sequentially |
| Prototype | Inline flow diagram and one button | Demonstrates system logic and feedback, not a live API | Button reveals a readable ordered flow; no animation dependency |
| Model failures | Data-shaped bands, class spectrum, conversion path, and verified matrix | Makes limitations and engineering recovery scannable | Becomes stacked lists/tables with text equivalents |
| Jinhong | Full-width real browser imagery with editorial steps around it | Gives the real client work visual authority | Browser crop becomes a scrollable/stacked image with captions |
| USA | Temporary deep-forest chapter with full-bleed editorial collage | Signals a different environment and emotional chapter | Overlap collapses; photo order follows the story |
| Outside screen | Irregular photo/word composition | Shows personality without icon cards | Becomes a curated vertical photo essay |
| Skills | Four typographic lanes with project mapping | Connects capabilities to evidence | Focus/tap disclosure list |
| Certifications | Low-height horizontal rail | Preserves proof without competing with projects | Wraps or becomes native horizontal overflow |
| What's next / Contact | Oversized editorial ending with restrained CTA | Resolves the narrative and invites action | Balanced multiline copy; no clipped marquee |

Absolute positioning is limited to vines, masks, overlap, labels, and special visual layers. Core text and reading order remain in Grid/Flexbox document flow.

## 5. Interaction map

| Interaction | Narrative function | Implementation direction | Reduced-motion / no-JS result |
|---|---|---|---|
| Portrait flip | Reveals current focus without crowding the hero | Reuse accessible button and front/back card | Both faces remain reachable; no tilt |
| Vine growth | Connects personal growth across chapters | Inline SVG stem with stroke progress; leaves appear near meaningful transitions | Fully drawn static vine with all content visible |
| Journey reveals | Controls chronology and hierarchy | IntersectionObserver with targeted state classes | Normal readable timeline |
| GPT transition | Shows confusion becoming understanding | Mask/text progression tied to section progress | Side-by-side or stacked before/after |
| AI sticky phone | Maintains product context across system states | Marker-driven active screen; CSS transforms/opacity only | Sequential figures with captions |
| Parking prototype | Shows the real data/AI chain | User-triggered deterministic demo; visibly labeled prototype | Ordered list always available |
| Model visual | Explains weak middle classes and conversion mismatch | Verified chart/table/diagram; no invented values | Accessible table and prose |
| Jinhong browser reveal | Lets real work replace a synthetic mockup | Responsive picture elements and restrained mask reveal | Full screenshots remain visible |
| USA collage parallax | Adds depth to an emotional/environmental shift | Small transform on visible media only | Static editorial collage |
| Skills mapping | Proves where each skill was used | Hover + focus + tap state | Always-visible project labels on small screens |
| Magnetic CTA | Provides optional final feedback | Fine pointer only, small radius, no navigation delay | Normal button |
| Page transitions | Smooths movement to case studies | Reuse existing light fade only if it does not block | Immediate navigation |

No interaction may prevent scrolling, hide essential content, or require a mouse.

## 6. Reusable components

### Keep as shared foundations

- Glass header, brand, menu, language toggle, and active nav.
- Footer, contact links, and back-to-top.
- Portrait flip card and tilt variables.
- Buttons, text links, eyebrow labels, rules, and section padding.
- Bilingual dictionary and language persistence.
- IntersectionObserver and requestAnimationFrame infrastructure.
- Contact mailto form.
- Static build, development server, and validation scripts.
- Existing project URLs and case-study links.

### Evolve

- Header navigation becomes chapter-oriented.
- Current botanical leaf design informs a new inline growth-path SVG.
- Generic reveal becomes a small base utility; each chapter gets only the motion it needs.
- Existing phone screenshots become states in a sticky narrative.
- Existing Jinhong product images remain supporting assets until real site captures are added.
- Existing case routes become project-specific rather than sharing one template.
- Existing timeline becomes the semantic base for Journey and USA, but not the final visual.

### Retire or demote

- Capabilities accordion as a major homepage chapter.
- Toolkit tiles.
- Generic three-card process.
- Generic project principles.
- Repeated feature-card grids.
- Repeated synthetic Jinhong mockup.
- Overused section numbers and © labels.
- Certifications as a large section.
- Local time and availability as primary header content.
- Decorative vine backgrounds that are unrelated to scroll progress.

Static HTML remains the architecture. No Next.js migration is planned.

## 7. Asset requirements

### Current repository assets

- Portrait: assets/images/hongrong-portrait.png.
- AI screens: ai-driver-home.jpg, ai-driver-map.jpg, ai-driver-traffic.jpg.
- Jinhong products: jinhong-slicer.webp, jinhong-bone-saw.webp, jinhong-vacuum.webp.
- Botanical source: botanical-vine.svg.
- USA story set: usa-badlands.webp, usa-mount-rushmore.webp, usa-kaytlin-work.webp, usa-street-friends.webp, and usa-hiking-friends.webp. The approved order moves from place to work, friendship, and courage.
- Documents: downloadable résumé and capstone-report PDFs are intentionally not shipped.
- Fonts: Libre Caslon Condensed, Geist, GenSen Rounded TW, plus licenses.
- Favicon: assets/favicon.svg.

### Approved asset and privacy decisions

- All five supplied USA photos may appear publicly on the portfolio and in the public repository.
- Kaytlin is the woman on the left in the hotel-corridor photo, and her name may appear publicly.
- The five photos are exported as stripped, size-bounded WebP files; originals remain outside the served asset set.
- The USA chapter uses truthful alt text and captions. It does not imply that the photos show the SSN interaction.
- No New Zealand photograph has been supplied, so that memory remains a clearly labeled typographic/nature composition rather than a fabricated image.

### Remaining requirements for later evidence upgrades

1. New Zealand / nature set
   Three to six original landscape/travel photos, location captions if known, and a preferred hero landscape.

2. Outside-the-screen media
   Optional basketball, photography, travel, or personal images. Games and music can be handled typographically if original images would add clutter or licensing risk.

3. AI Driving Assistant evidence
   Prefer actual screens for parking, GPT/voice, vehicle location, and model output. Existing three screens are enough for an initial story but not all seven requested states.

4. Model evidence
   Exact six class names, dataset size/split, selected final accuracy, Precision/Recall, and confusion matrix. If these are only in the report, verify them from the PDF before drawing visuals. Never infer missing values.

5. Jinhong real screenshots
   Current live desktop homepage, product/category page, product-detail/service page, and at least one mobile capture. The current CSS recreation is not a substitute for the real site.

6. Client context
   Approved wording for the company relationship, launch/maintenance status, and whether business results exist. Do not invent traffic, leads, or SEO outcomes.

7. Certifications
   Exact issuer/title/year for IBM, Google Cloud, AWS, Microsoft, and TQC+. Use a text rail until approved badge/logo assets and names are verified.

8. Social preview
   A 1200 × 630 Open Graph image built from the approved visual system.

### Asset rules

- Never fabricate a sneaker website screenshot.
- Never label prototype screens as live services.
- Never imply SEO work is complete.
- Never use unverified model numbers.
- Every meaningful image receives alt text and, where useful, a caption.
- Below-fold photography is exported responsively in WebP/AVIF with JPEG/PNG fallback only where needed.
- Preserve originals outside the served asset set.

## 8. Accessibility

- One clear h1 per page and a logical h2/h3 outline.
- Add a skip-to-content link.
- Use semantic section, article, figure, figcaption, time, nav, and list elements.
- Preserve source order so the story remains coherent without CSS.
- Add global focus-visible styles.
- Make the menu trap focus while open or use inert on the page behind it; return focus to the menu button on close.
- Give accordions/disclosures stable ids and aria-controls where retained.
- Keep portrait flip and prototype actions as real buttons with current-state labels.
- Provide hover, focus, and tap parity for skill mappings.
- Make sticky screen changes available as normal figures for screen readers and mobile users.
- Give flow/model graphics an adjacent text description or table.
- Verify contrast for muted olive/cream combinations and glass navigation over every chapter background.
- Respect prefers-reduced-motion in JavaScript as well as CSS.
- Disable parallax, smooth scrolling, cursor reaction, magnetic movement, scrub animation, and tilt when reduced motion is requested.
- Avoid scroll hijacking and forced horizontal scrolling.
- Maintain 44px minimum touch targets for primary controls.
- Preserve 200% zoom without loss of content or function.
- Keep bilingual controls understandable in both languages; set html lang correctly.
- Do not put essential copy inside images.
- Ensure form labels, validation, and mailto behavior remain explicit.
- Test with keyboard-only navigation and at least one screen-reader pass.

## 9. Performance

Architecture decision:

- Keep the static HTML/CSS/JavaScript site.
- Use no framework migration and no animation library by default.
- Prefer CSS, IntersectionObserver, requestAnimationFrame, and Web Animations API only where necessary.
- Progressive enhancement: all story content and links work before JavaScript.

Media:

- Convert the 580KB portrait PNG into responsive WebP/AVIF variants while retaining a safe fallback.
- Add width and height or aspect-ratio to prevent layout shift.
- Use loading=lazy and decoding=async below the fold.
- Give only the hero/LCP portrait appropriate eager/high priority.
- Keep the supplied USA photos size-bounded and compressed; add responsive source variants only if visual QA shows a material transfer-size benefit.
- Avoid autoplay video and oversized full-resolution background images.
- Keep PDFs downloadable but never preload them.

Motion/runtime:

- One batched scroll controller, not one listener per chapter.
- Only animate transform, opacity, clip-path/mask where safe, and SVG stroke properties.
- Limit backdrop-filter to the header, portrait, and a few controls; simplify it on mobile.
- Pause or skip off-screen motion.
- Do not animate layout dimensions during scroll.
- Release sticky sections on short/mobile viewports.
- Keep the interactive prototype deterministic and local; no external API calls.

Quality targets, not claims:

- No unexpected layout shift; target CLS below 0.1.
- Target LCP below 2.5 seconds on a representative mobile/4G test.
- Target responsive interaction feedback below 200ms.
- No horizontal overflow at the QA widths.
- Technical SEO foundations only; never claim “SEO 100” or “fully optimized.”

SEO foundation to implement in a later phase:

- Unique title and meta description for every route.
- Canonical URL.
- Open Graph and Twitter preview metadata.
- Semantic heading structure.
- Descriptive alt text.
- robots.txt.
- sitemap.xml.
- Person, WebSite, and project/CreativeWork structured data where accurate.
- Stable internal links between story chapters and case studies.

## 10. Selective design-method application

The four external repositories are treated as review lenses, not as visual templates. HongRong's approved Nature × Growth × Technology system, warm palette, bilingual content, and personal story remain authoritative.

| Source | Applied here | Deliberately not imported |
|---|---|---|
| Taste Skill | Brief inference, anti-template audit, asymmetric editorial composition, and explicit design dials: variance 8 / motion 6 / density 4 | Mandatory dark mode, one-theme rules, and restrictions that conflict with the approved numbered story chapters |
| Impeccable | Typesetting, hierarchy, spacing rhythm, squint test, localization review, 200% zoom, and bounded critique/polish passes | “Overdrive” or delight passes that add spectacle without improving the story |
| UI UX Pro Max | Responsive text reflow, contrast, focus states, 44px touch targets, reduced motion, performance, and 375/768/1024/1440 checks | Generated style presets or database recommendations that would replace the existing brand system |
| Emil Kowalski Skills | Motion gate (purpose, frequency, speed, function), transform/opacity-first animation, strong easing, fine-pointer gating, and reduced-motion parity | Swift/Expo/Sonner/platform-specific patterns and ambient motion with no narrative job |

Motion decisions resulting from this filter:

- Keep SVG vine growth because it expresses the chronological growth path.
- Keep the sticky AI phone because state changes explain the product flow.
- Keep the portrait flip as deliberate user feedback, but shorten it to roughly half a second.
- Keep a restrained USA photo reveal and fine-pointer parallax because they support the change of place and emotional tone.
- Reduce magnetic CTA movement so it reads as feedback rather than a trick.
- Remove the global cursor orb, particles, scroll hijacking, universal showy reveals, and decorative loops.

## 11. Implementation phases

The plan is approved. Every implementation phase remains isolated on feature/portfolio-story-redesign until review.

### Phase 0 — Content and asset lock

- Confirm hero line and public wording.
- Import and verify the approved USA set; leave New Zealand, certification, and OG assets as explicit follow-up requirements until real source material is supplied.
- Verify AI model metrics and six class labels.
- Record the confirmed permission to show the group photos and name Kaytlin.
- Create a content matrix for English and Traditional Chinese.

Commit intent: content and asset inventory only.

### Phase 1 — Semantic foundation and design tokens

- Preserve routes and static build.
- Add chapter-oriented navigation and skip link.
- Expand sage/olive/forest tokens.
- Establish editorial layout primitives without card-first defaults.
- Add SEO metadata foundations, robots.txt, sitemap.xml, and accurate structured data.
- Improve focus/menu accessibility.

Commit intent: foundation; no complex storytelling animation.

### Phase 2 — Homepage narrative skeleton

- Reorder index.html into the nine approved chapters.
- Establish semantic source order and bilingual copy.
- Retain portrait flip with the new CURRENTLY content.
- Remove/demote generic capabilities, process, and repetitive project-principle blocks.
- Keep every chapter readable without JavaScript.

Commit intent: complete static story before motion.

### Phase 3 — Journey and growth path

- Build the 2021/2022/GPT chronology.
- Add the truthful 404 memory moment.
- Create inline SVG growth vine with section-linked leaves.
- Add purpose-specific progressive reveal.
- Implement full reduced-motion and mobile fallbacks.

Commit intent: personal learning narrative.

### Phase 4 — AI Driving Assistant centerpiece

- Rebuild the homepage chapter and ai-driving-assistant.html around the real problem.
- Add sticky phone state progression.
- Add labeled parking prototype.
- Show verified ResNet-18/six-level evidence.
- Visualize failure → diagnosis → fix.
- Add “If I built it again.”

Commit intent: flagship product/technical case.

### Phase 5 — Jinhong real-client case

- Replace synthetic browser visuals with real screenshots.
- Add friend/client origin, research, IA, design, build, deployment, maintenance, and honest next steps.
- Keep live site and source links.
- State SEO/Search Console/structured data/content optimization as future work.

Commit intent: real stakeholder/client story.

### Phase 6 — USA and Outside the Screen

- Build the deep-forest/full-bleed USA chapter from the approved five photos.
- Create editorial collage and restrained parallax.
- Add SSN, daily English, Kaytlin, culture, friends, travel, and courage outcome.
- Build the nature/travel/interest chapter with New Zealand and personal imagery.
- Collapse overlaps into normal flow on mobile.

Commit intent: courage and personality chapters.

### Phase 7 — Skills, certifications, future, and contact

- Build four evidence-linked skill lanes.
- Add keyboard/touch project mappings.
- Demote certifications to a verified rail.
- Add specific AI application/product direction.
- Finish with “LET'S BUILD SOMETHING USEFUL.”
- Let the growth vine resolve in the footer.

Commit intent: evidence and conversion.

### Phase 8 — Accessibility, performance, RWD, and QA

- Keyboard, screen reader, reduced-motion, contrast, zoom, and focus tests.
- Image optimization and responsive sources.
- Validate sticky release and short viewports.
- Test English/Traditional Chinese at all QA widths.
- Run npm run validate and npm run build.
- Check every local/external link and GitHub Pages path.
- Audit titles, canonical links, OG data, sitemap, robots, alt text, and structured data.
- Test representative Lighthouse/Core Web Vitals conditions without claiming a perfect score.
- Produce a visual QA checklist for review before merge.

Commit intent: release candidate only.

### Review and merge policy

- All implementation remains on feature/portfolio-story-redesign.
- main and the public GitHub Pages site remain unchanged until explicit approval to merge.
- Use small, phase-based commits so each major change has a recoverable point.
- Do not open or merge a final PR until the implementation is ready for review.
- Any material change to story facts, model metrics, client claims, public names, or asset privacy requires confirmation.
