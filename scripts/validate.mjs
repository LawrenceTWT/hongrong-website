import { access, readFile, readdir } from "node:fs/promises";
import { join } from "node:path";

const root = process.cwd();
const htmlFiles = (await readdir(root)).filter((file) => file.endsWith(".html"));
const errors = [];
const translationKeys = new Set();

for (const file of htmlFiles) {
  const html = await readFile(join(root, file), "utf8");
  if (!/<title>[^<]+<\/title>/.test(html)) errors.push(`${file}: missing title`);
  if (!/<meta name="viewport"/.test(html)) errors.push(`${file}: missing viewport`);
  if (!/<meta name="description" content="[^"]+"/.test(html)) errors.push(`${file}: missing meta description`);
  if (!/<link rel="canonical" href="https:\/\/lawrencetwt\.github\.io\/hongrong-website\//.test(html)) errors.push(`${file}: missing canonical URL`);
  if ((html.match(/<h1\b/g) || []).length !== 1) errors.push(`${file}: expected exactly one h1`);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  for (const id of new Set(ids)) {
    if (ids.filter((candidate) => candidate === id).length > 1) errors.push(`${file}: duplicate id ${id}`);
  }
  for (const link of html.matchAll(/<a\b[^>]*href="#([^"]+)"[^>]*>/g)) {
    if (!ids.includes(link[1])) errors.push(`${file}: hash link has no target #${link[1]}`);
  }
  for (const externalLink of html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)) {
    if (!/\brel="[^"]*noreferrer[^"]*"/.test(externalLink[0])) errors.push(`${file}: target=_blank link missing noreferrer`);
  }
  for (const image of html.matchAll(/<img\b[^>]*>/g)) {
    if (!/\balt="[^"]*"/.test(image[0])) errors.push(`${file}: image missing alt text`);
    if (!/\bwidth="\d+"/.test(image[0]) || !/\bheight="\d+"/.test(image[0])) errors.push(`${file}: image missing intrinsic dimensions`);
  }
  for (const match of html.matchAll(/data-i18n="([^"]+)"/g)) translationKeys.add(match[1]);
  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const reference = match[1].split("#")[0];
    if (!reference || /^(?:https?:|mailto:|data:)/.test(reference)) continue;
    try { await access(join(root, reference)); }
    catch { errors.push(`${file}: missing local reference ${reference}`); }
  }

  if (file === "index.html") {
    const aiSteps = [...html.matchAll(/data-ai-step="(\d+)"/g)].map((match) => Number(match[1]));
    const aiPanels = [...html.matchAll(/data-ai-panel="(\d+)"/g)].map((match) => Number(match[1]));
    const expectedAiStates = "0,1,2,3,4";
    if (aiSteps.join(",") !== expectedAiStates) errors.push(`${file}: expected five ordered AI story steps (${expectedAiStates})`);
    if (aiPanels.join(",") !== expectedAiStates) errors.push(`${file}: expected five ordered AI phone panels (${expectedAiStates})`);
    if (!/data-about-text-effect/.test(html)) errors.push(`${file}: homepage capability statement is missing its scroll-linked text effect`);
    for (const target of ["about.html", "ai-driving-assistant.html", "jinhong-foods.html"]) {
      const escapedTarget = target.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      if (!new RegExp(`<a\\b[^>]*class="[^"]*story-cta[^"]*"[^>]*href="${escapedTarget}"`).test(html)) {
        errors.push(`${file}: expected a visible story CTA for ${target}`);
      }
    }
  }
  if (file === "about.html") {
    const usaSlides = [...html.matchAll(/data-usa-slide\b/g)];
    if (usaSlides.length !== 5) errors.push(`${file}: expected exactly five USA carousel slides`);
    if (!/data-usa-carousel-prev/.test(html) || !/data-usa-carousel-next/.test(html)) errors.push(`${file}: USA carousel controls are missing`);
    const stageStart = html.indexOf('class="usa-carousel-stage"');
    const previousButton = html.indexOf("data-usa-carousel-prev");
    const nextButton = html.indexOf("data-usa-carousel-next");
    const controlsStart = html.indexOf('class="usa-carousel-controls"');
    if (stageStart < 0 || previousButton < stageStart || nextButton < previousButton || controlsStart < nextButton) {
      errors.push(`${file}: carousel arrows must sit inside the photo stage before the lower progress controls`);
    }
  }
  if (file === "ai-driving-assistant.html") {
    if (!/data-i18n="systemFlowLabel"/.test(html)) errors.push(`${file}: parking request flow needs a specific section label`);
    if (!/data-prototype-start/.test(html) || !/data-i18n="prototypeButton"/.test(html)) errors.push(`${file}: simulated parking request needs a clear trigger`);
  }
  if (file === "jinhong-foods.html") {
    if (/data-i18n="(?:clientNextBody|honestRoadmap)"/.test(html)) errors.push(`${file}: next-step section still contains redundant roadmap copy`);
  }
  if (file !== "index.html" && !/<a class="brand transition-link" href="index\.html#top">/.test(html)) {
    errors.push(`${file}: header brand must return explicitly to index.html#top`);
  }
}

const js = await readFile(join(root, "js/main.js"), "utf8");
const zhKeys = new Set([...js.matchAll(/^\s{4}([A-Za-z][A-Za-z0-9]*):/gm)].map((match) => match[1]));
for (const key of translationKeys) {
  if (!zhKeys.has(key)) errors.push(`Missing Traditional Chinese copy: ${key}`);
}
const zhBlock = js.slice(js.indexOf("const zh = {"), js.indexOf("\n  };", js.indexOf("const zh = {")));
for (const match of zhBlock.matchAll(/^\s{4}([A-Za-z][A-Za-z0-9]*):\s*"((?:\\.|[^"])*)"/gm)) {
  const visibleCopy = match[2].replace(/<[^>]+>/g, "").trim().replace(/[」』】）》]+$/, "");
  if (visibleCopy.endsWith("。")) errors.push(`Traditional Chinese copy ends with a full stop: ${match[1]}`);
}

const css = await readFile(join(root, "css/styles.css"), "utf8");
if ((css.match(/{/g) || []).length !== (css.match(/}/g) || []).length) errors.push("CSS brace count is unbalanced");

for (const technicalSeoFile of ["robots.txt", "sitemap.xml"]) {
  try { await access(join(root, technicalSeoFile)); }
  catch { errors.push(`Missing technical SEO file: ${technicalSeoFile}`); }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`Validated ${htmlFiles.length} pages, ${translationKeys.size} bilingual strings, and all local assets.`);
