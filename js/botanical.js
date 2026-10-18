// Deliberate, asymmetric placements: plants frame the story in its outer margins.
export const botanicalPlacements = [
  { selector: ".hero-visual", variant: "portrait" },
  { selector: ".hero-panel", side: "left", size: 154, bottom: "-18px", angle: 28, delay: 0.08 },
  { selector: ".about-panel", side: "left", size: 172, bottom: "44%", angle: 22 },
  { selector: ".about-panel", side: "right", size: 190, bottom: "-32px", angle: -24, delay: 0.16 },
  { selector: ".work-panel", side: "left", size: 132, bottom: "8%", angle: 37, delay: 0.2 },
  { selector: ".jinhong-editorial", side: "right", size: 170, bottom: "18%", angle: -16, delay: 0.03 },
  { selector: ".jinhong-editorial", side: "left", size: 128, bottom: "55%", angle: 28, delay: 0.2 },
  { selector: ".page-hero", side: "left", size: 148, bottom: "14%", angle: 18 },
  { selector: ".case-hero", side: "right", size: 172, bottom: "-24px", angle: -25, delay: 0.1 },
  { selector: ".contact-main", side: "left", size: 140, bottom: "42%", angle: 25 },
  { selector: ".contact-main", side: "right", size: 185, bottom: "-18px", angle: -14, delay: 0.18 },
];

// Geometry reuses the portfolio's original SVG ivy; no generated bitmap is needed.
export function createVine(variant, index) {
  const id = "growth-" + index;
  const vine = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  vine.setAttribute("class", "growth-vine growth-vine--" + variant);
  vine.setAttribute("viewBox", "-35 -12 340 954");
  vine.setAttribute("aria-hidden", "true");
  vine.setAttribute("focusable", "false");
  const leaves = [
    [21, 835, -37, 0.78, 0.09], [62, 742, 22, 0.96, 0.18],
    [112, 665, 48, 0.7, 0.26], [76, 595, -28, 1.08, 0.34],
    [153, 542, 38, 0.74, 0.4], [54, 482, -62, 0.72, 0.46],
    [52, 402, -18, 1.02, 0.55], [112, 337, 44, 0.82, 0.62],
    [95, 278, -25, 0.67, 0.68], [168, 219, 37, 0.9, 0.74],
    [144, 145, -14, 0.64, 0.82], [163, 79, 18, 0.72, 0.88],
    [136, 19, -23, 0.48, 0.93],
  ];
  vine.innerHTML = `
    <defs>
      <linearGradient id="${id}-leaf" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#a7aa79"/>
        <stop offset=".48" stop-color="#7d8959"/>
        <stop offset="1" stop-color="#52613c"/>
      </linearGradient>
      <linearGradient id="${id}-fade" gradientUnits="userSpaceOnUse" x1="0" y1="942" x2="0" y2="-12">
        <stop offset="0" stop-color="white" stop-opacity="0"/>
        <stop offset=".08" stop-color="white" stop-opacity=".22"/>
        <stop offset=".23" stop-color="white"/>
        <stop offset="1" stop-color="white"/>
      </linearGradient>
      <mask id="${id}-base" maskUnits="userSpaceOnUse" x="-100" y="-100" width="500" height="1140" style="mask-type:alpha">
        <path d="M-100-100H400V1040H-100Z" fill="url(#${id}-fade)"/>
      </mask>
      <g id="${id}-leaf-shape">
        <path d="M0 0C-15-25-42-31-62-18c17 7 28 17 31 30-18 5-34 18-39 36 22-3 39-12 52-25-2 23 6 43 25 58 10-19 11-38 4-57 17 10 36 13 56 5-10-18-25-29-44-33 8-12 12-25 10-40C25-38 10-22 0 0Z" fill="url(#${id}-leaf)" stroke="#a5ad7b" stroke-width="1.3"/>
        <path d="M0 1 6 57M2 14l-32 1M5 28l29-8M4 39l-20 22M5 48l19 20" fill="none" stroke="#c8c799" stroke-width="1.1" stroke-linecap="round" opacity=".65"/>
      </g>
    </defs>
    <g mask="url(#${id}-base)">
      <path class="growth-vine-stem" pathLength="1" d="M10 930C19 788 76 732 84 616c8-115-52-174-32-283 17-94 92-128 103-237 4-42-5-77-17-108"/>
      <path class="growth-vine-branch" pathLength="1" style="--leaf-at:.22" d="M72 696c47-27 84-65 94-111"/>
      <path class="growth-vine-branch" pathLength="1" style="--leaf-at:.46" d="M59 475c-35-26-48-56-46-91"/>
      <path class="growth-vine-branch" pathLength="1" style="--leaf-at:.62" d="M67 343c38 3 75-8 103-34"/>
      <path class="growth-vine-branch" pathLength="1" style="--leaf-at:.73" d="M115 242c50-19 85-48 105-89"/>
      ${leaves.map(([x, y, angle, size, at]) => `<g transform="translate(${x} ${y}) rotate(${angle}) scale(${size})"><g class="growth-vine-leaf" style="--leaf-at:${at}"><use href="#${id}-leaf-shape"/></g></g>`).join("")}
    </g>`;
  return vine;
}

export const clampProgress = (value) => Math.max(0, Math.min(1, value));
export const progressBetween = (value, start, end) =>
  end === start
    ? Number(value >= end)
    : clampProgress((value - start) / (end - start));
