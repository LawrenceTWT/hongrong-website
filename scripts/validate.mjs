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
}

const js = await readFile(join(root, "js/main.js"), "utf8");
const zhKeys = new Set([...js.matchAll(/^\s{4}([A-Za-z][A-Za-z0-9]*):/gm)].map((match) => match[1]));
for (const key of translationKeys) {
  if (!zhKeys.has(key)) errors.push(`Missing Traditional Chinese copy: ${key}`);
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
