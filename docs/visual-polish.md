# Botanical composition and project covers

Follow-up to PR #3, 2026-10-18. This is the accepted direction after the user's latest visual references.

## Composition

- Chinese hero: 「嗨，我是洪戎／寫程式，也看世界」; English: “Hi, I’m HongRong. / I code. I explore.”
- A single 1080px maximum content width is shared by all six pages. Only backgrounds, landscape and deliberate botanical margins extend beyond it
- The complete real portrait stays in its rectangular frame; a transparent ivy branch grows along its outer edge
- The same ivy appears in chapter margins and page introductions, with continuous reversible progress from element position
- Vine updates share the existing scroll requestAnimationFrame; no extra animation loop, scroll interception or one-shot entrance trigger
- Reduced motion shows static foliage. Decoration is hidden from assistive technology and never intercepts clicks
- Homepage and Work use two image/title/summary/case-link cards, AI first and Jinhong second, within the central grid
- Covers are conceptual illustrations authorized by the user; app screens, website captures and research evidence inside case studies remain real

## Assets

All three bitmap assets were generated with the built-in imagegen tool and encoded as local WebP assets. No Fathom image is copied into the site.

| Asset                                      | Dimensions        | Role                                          |
| ------------------------------------------ | ----------------- | --------------------------------------------- |
| `assets/images/botanical-ivy.webp`         | 480 × 1200, alpha | Transparent scroll-linked decorative foliage  |
| `assets/images/ai-project-cover.webp`      | 1440 × 720        | Representative AI driving cover               |
| `assets/images/jinhong-project-cover.webp` | 1440 × 720        | Representative food-machinery website cover   |
| `assets/images/paper-grain.svg`            | 180 × 180         | Lightweight code-native repeating paper grain |

## Browser verification

All six pages were checked in Chinese and English at 375px, 768px and 1440px. The shared desktop content measures 1080px; headings and document edges do not overflow. Homepage cards and portrait fit the enhanced scene at 960 × 760 and 1920 × 1080; 1440 × 680 uses normal flow. A case-card visit and browser Back preserve a visible Work scene with four decorative vines, without duplicating nodes. The real phone screen changes from Login to Navigation and back while scrolling.

Browser proof: `docs/previews/home-botanical-2026-10-18.jpg` and `docs/previews/work-covers-2026-10-18.jpg`.

## Generation prompts

### Transparent ivy

Use case: photorealistic-natural. Asset type: a transparent botanical cutout overlay for a warm ivory and forest-green editorial portfolio. Create ONE slender climbing ivy vine, completely isolated on a true transparent background, portrait elongated composition about 1:2.5. A delicate naturally curving woody brown stem rises from the lower center, arcs slightly left and then right toward the top; about 10 to 14 varied ivy leaves with recognizable three- and five-lobed shapes, fine pale veins, slight natural edge wear, realistic matte olive and sage greens, a few tiny new shoots. Restrained Renaissance botanical realism, like a carefully lit real ivy sprig cut out for an art magazine, fine tactile leaf detail, soft diffuse lighting, minimal subtle leaf self-shadow. The overall branch is airy and narrow, with visible empty transparent gaps, not a dense hedge. Show the complete branch, all leaf tips inside the canvas, no ground or pot. No people, no sculpture, no portrait, no text, no lettering, no picture frame, no artwork poster, no watercolor wash, no paper, no opaque background, no vignette, no glowing effects. The vine will be revealed progressively from the bottom as a website is scrolled, wrapping a real portrait's outer edge. Keep its silhouette natural and elegant, with the leaves concentrated along the central curving stem and graceful smaller growth toward the top.

### AI project cover

Use case: stylized-concept. Asset type: a conceptual portfolio project cover, AI Driving Assistant. Wide landscape 2:1 editorial art direction. Create a refined miniature sculptural still life: a single small warm ivory car on a graceful curved road made of matte pale stone, with one understated parking marker and a few thin route lines connecting a circular parking zone to a distant road-camera shape. A delicate olive ivy sprig follows one edge of the road, connecting technology and growth. Deep desaturated forest-green studio background, soft sage shadows, warm limestone surfaces, subtle natural material texture, directional soft daylight, exquisite quiet Renaissance-inspired editorial surrealism and contemporary product still-life photography. The scene should be immediately readable at a small size. All meaningful objects clustered in the middle 65% of the frame with generous space around the sides, calm and sophisticated. Palette strictly ivory, olive, sage, forest green and tiny muted clay accents. No people, no text or lettering, no numbers, no logo, no brand, no actual phone app screenshot, no glowing UI, no neon, no cyberpunk, no poster frame, no watercolor paper. This is an expressive representative illustration, not a photograph of the real app or a claim about actual hardware.

### Jinhong project cover

Use case: stylized-concept. Asset type: a conceptual portfolio project cover, Jinhong Foods, a food-machinery company website. Wide landscape 2:1 editorial artwork matching an ivory-stone and olive-green miniature sculptural still-life series. A refined digital-showroom metaphor: three low warm limestone display plinths hold simplified matte brushed-steel food-processing roller and hopper forms, a clean ribbon of pale dough curves through one pair of rollers, and a few warm ivory modular catalogue panels stand behind them with subtle geometric recesses and no text. One graceful ivy sprig and a small olive branch weave softly along the base, linking craftsmanship, nature and a structured product catalogue. Warm pale ivory studio background, soft muted sage shadows, gently directional daylight, fine tactile plaster and satin metal materials, quiet Renaissance-inspired editorial surrealism combined with sophisticated contemporary product still-life photography. The equipment shapes are deliberately conceptual sculptures, not an exact real manufacturer product. Composition readable at thumbnail size, objects in the center 65%, generous breathing room. Palette strictly warm ivory, limestone, sage, olive and restrained forest green. No people, no text, no letters or numbers, no logo, no brands, no real web screenshot, no glowing UI, no neon, no cyberpunk, no picture frame, no watercolor, no floating random objects. A polished, coherent sister image to the AI driving cover, expressing a useful product catalogue for a real business.
