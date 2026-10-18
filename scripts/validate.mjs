import { access, readFile, readdir } from "node:fs/promises";
import { join, resolve, sep } from "node:path";
import { englishCopy } from "../js/copy.js";
import { createHash } from "node:crypto";

const root = process.cwd();
const files = (await readdir(root)).filter((name) => name.endsWith(".html"));
const errors = [];
const keys = new Set();
const attrs = (tag) =>
  Object.fromEntries(
    [...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map((match) => [
      match[1],
      match[2],
    ]),
  );
const pageIds = new Map();
const sources = new Map(
  await Promise.all(
    files.map(async (file) => [file, await readFile(file, "utf8")]),
  ),
);
for (const [file, html] of sources) {
  const fail = (message) => errors.push(file + ": " + message);
  const tags = [...html.matchAll(/<[a-zA-Z][^>]*>/g)].map((match) => ({
    markup: match[0],
    attributes: attrs(match[0]),
  }));
  const ids = tags.map((tag) => tag.attributes.id).filter(Boolean);
  pageIds.set(file, new Set(ids));
  if (new Set(ids).size !== ids.length) fail("duplicate IDs");
  if (!/<html\b[^>]*lang="zh-Hant"/.test(html))
    fail("initial document must be Traditional Chinese");
  if (!/<title>[^<]+<\/title>/.test(html)) fail("missing title");
  if (tags.filter((tag) => /^<h1\b/.test(tag.markup)).length !== 1)
    fail("expected exactly one h1");
  if (!tags.some((tag) => tag.attributes.name === "viewport"))
    fail("missing viewport");
  if (
    !tags.some(
      (tag) => tag.attributes.name === "description" && tag.attributes.content,
    )
  )
    fail("missing description");
  if (
    !tags.some(
      (tag) =>
        tag.attributes.rel === "canonical" &&
        tag.attributes.href?.startsWith(
          "https://lawrencetwt.github.io/hongrong-website/",
        ),
    )
  )
    fail("missing canonical");
  if (!tags.some((tag) => tag.attributes.property === "og:image"))
    fail("missing social image");
  if (
    !html.includes("<!-- shared:header:start -->") ||
    !html.includes("<!-- shared:footer:start -->")
  )
    fail("missing generated shared layout");
  for (const { markup, attributes: a } of tags) {
    for (const key of Object.keys(a).filter((key) =>
      /^data-i18n(?:-|$)/.test(key),
    ))
      keys.add(a[key]);
    if (/^<img\b/.test(markup)) {
      if (a.alt === undefined) fail("image missing alt");
      if (!/^\d+$/.test(a.width || "") || !/^\d+$/.test(a.height || ""))
        fail("image missing dimensions");
    }
    if (
      /^<a\b/.test(markup) &&
      a.target === "_blank" &&
      !/\bnoreferrer\b/.test(a.rel || "")
    )
      fail("external tab missing noreferrer");
    for (const value of [a.href, a.src].filter(Boolean)) {
      const reference = value.split("#")[0].split("?")[0];
      if (!reference || /^(https?:|mailto:|tel:|data:)/.test(reference))
        continue;
      const local = resolve(root, reference);
      if (!local.startsWith(root + sep)) {
        fail("asset escapes project: " + reference);
        continue;
      }
      try {
        await access(local);
      } catch {
        fail("missing local asset " + reference);
      }
    }
  }
  const header =
    html.match(
      /<!-- shared:header:start -->([\s\S]*?)<!-- shared:header:end -->/,
    )?.[1] || "";
  for (const target of [
    "index.html#top",
    "about.html",
    "work.html",
    "contact.html",
  ]) {
    if (!header.includes('href="' + target + '"'))
      fail("shared navigation missing " + target);
  }
  if (header.includes('href="#about"') || header.includes('href="#work"'))
    fail("global navigation must use page routes");
  if (
    /class="[^"]*loader(?![^"]*fathom-opening)/.test(html) &&
    file !== "index.html"
  )
    fail("child route contains an unnecessary loading overlay");
  if (file === "index.html") {
    for (const attribute of ["data-ai-step", "data-ai-panel"]) {
      const values = tags
        .filter((tag) => tag.attributes[attribute] !== undefined)
        .map((tag) => tag.attributes[attribute]);
      if (values.join(",") !== "0,1,2,3,4")
        fail("real-screen phone flow is incomplete");
    }
    if (!html.includes("data-about-text-effect"))
      fail("missing capability text effect");
    if (!html.includes('id="wanaka-ridgeline"'))
      fail("missing registered landscape foreground");
    if (html.includes("hongrong-canyon.webp"))
      fail("low-resolution portrait image must not be the full-bleed footer");
  }
  if (file === "about.html") {
    if (
      tags.filter(
        (tag) =>
          "data-usa-slide" in tag.attributes ||
          /\bdata-usa-slide(?:\s|=|>)/.test(tag.markup),
      ).length !== 5
    )
      fail("expected five USA photographs");
    for (const control of ["data-usa-carousel-prev", "data-usa-carousel-next"])
      if (!html.includes(control)) fail("missing carousel arrow");
  }
  if (
    ["index.html", "work.html", "jinhong-foods.html"].includes(file) &&
    !html.includes("jinhong-live-home.jpg")
  )
    fail("missing actual Jinhong screenshot");
  for (const match of html.matchAll(/>([^<>]*[\u3400-\u9fff][^<>]*)</g)) {
    if (match[1].trim().endsWith("。"))
      fail("Chinese copy ends in a full stop");
  }
}
for (const [file, html] of sources) {
  for (const match of html.matchAll(/<a\b[^>]*>/g)) {
    const href = attrs(match[0]).href;
    if (!href || /^(https?:|mailto:|tel:)/.test(href)) continue;
    const [path, hash] = href.split("#");
    if (
      hash &&
      pageIds.has(path || file) &&
      !pageIds.get(path || file).has(hash)
    )
      errors.push(file + ": missing anchor " + href);
  }
}
for (const key of keys)
  if (!(key in englishCopy)) errors.push("Missing English translation: " + key);
for (const file of ["robots.txt", "sitemap.xml"]) {
  try {
    await access(join(root, file));
  } catch {
    errors.push("Missing " + file);
  }
}
const css = await readFile(join(root, "css/styles.css"), "utf8");
if ((css.match(/{/g) || []).length !== (css.match(/}/g) || []).length)
  errors.push("CSS braces are unbalanced");
if (/clip-path:\s*polygon/.test(css))
  errors.push("Ordinary photos must not use polygon crops");
const js = await readFile(join(root, "js/main.js"), "utf8");
const coverage = JSON.parse(
  await readFile(join(root, "assets/fonts/gensen-coverage.json"), "utf8"),
);
const chineseCharacters = new Set(
  [...([...sources.values()].join("") + js)].filter((character) =>
    /[\u3400-\u9fff]/.test(character),
  ),
);
for (const [weight, font] of Object.entries(coverage.fonts)) {
  const data = await readFile(join(root, "assets/fonts", font.file));
  if (createHash("sha256").update(data).digest("hex") !== font.sha256)
    errors.push(weight + " font does not match its coverage manifest");
  const supported = new Set(font.characters);
  const missing = [...chineseCharacters].filter(
    (character) => !supported.has(character.codePointAt(0)),
  );
  if (missing.length)
    errors.push(
      weight +
        " font is missing Chinese glyphs: " +
        missing.join("") +
        "; run scripts/subset-fonts.py",
    );
}
if (/classList\.add\("page-leaving"\)/.test(js))
  errors.push("Opacity-based page exits break browser restoration");
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(
  "Validated " +
    files.length +
    " Chinese-first pages, " +
    keys.size +
    " English mappings, shared navigation and local assets.",
);
