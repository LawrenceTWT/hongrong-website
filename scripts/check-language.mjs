import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import vm from "node:vm";
import { parseHTML } from "linkedom";
import { englishCopy, englishPageMetadata } from "../js/copy.js";
import { botanicalPlacements, createVine, progressBetween } from "../js/botanical.js";

// Execute the production module against parsed, real page markup. Geometry,
// storage and timers are controlled fixtures; this is not browser/layout QA.
const root = new URL("../", import.meta.url);
const source = (await readFile(new URL("js/main.js", root), "utf8"))
  .replace(/^import[^\n]+\n/gm, "");
const pages = (await readdir(root)).filter((name) => name.endsWith(".html"));
const cjk = /[\u3400-\u9fff]/;

async function loadPage(file, { stored = null, storageBlocked = false, height = 900 } = {}) {
  const { document, Event } = parseHTML(await readFile(new URL(file, root), "utf8"));
  const url = new URL(file, "https://example.test/hongrong-website/");
  const events = document.createElement("span");
  const frames = [], timers = [], rectangles = new Map();
  const saved = new Map(stored ? [["hongrong-language-choice", stored]] : []);
  const media = new Map();
  let sandbox;
  const zeroBox = { top: 0, bottom: 0, left: 0, right: 0, width: 0, height: 0 };
  for (const node of document.querySelectorAll("*")) {
    // LinkeDOM's generic hyphenator splits digits in "i18n"; browsers do not.
    // Adapt this one dataset lookup without changing production translation code.
    const dataset = node.dataset;
    Object.defineProperty(node, "dataset", { value: new Proxy(dataset, {
      get(target, key) { return key === "i18n" ? node.getAttribute("data-i18n") : target[key]; },
    }) });
    node.getBoundingClientRect = () => rectangles.get(node) || zeroBox;
    node.getClientRects = () => [node.getBoundingClientRect()];
    node.getTotalLength = () => 2000;
    node.scrollLeft = 0;
    Object.defineProperty(node, "clientWidth", { value: 600, configurable: true });
    Object.defineProperty(node, "clientHeight", { value: 500, configurable: true });
    node.scrollTo = ({ left }) => { node.scrollLeft = left; };
    if (node.matches("a[href]")) Object.defineProperty(node, "href", {
      get() { return new URL(node.getAttribute("href"), url).href; },
    });
  }
  const window = {
    document,
    addEventListener: events.addEventListener.bind(events),
    dispatchEvent: events.dispatchEvent.bind(events),
    scrollTo({ top }) { sandbox.scrollY = top; },
  };
  const storage = {
    getItem(key) { if (storageBlocked) throw Error("Storage blocked"); return saved.get(key) ?? null; },
    setItem(key, value) { if (storageBlocked) throw Error("Storage blocked"); saved.set(key, value); },
  };
  sandbox = {
    window, document, englishCopy, englishPageMetadata, botanicalPlacements, progressBetween,
    createVine(...args) {
      const previous = globalThis.document;
      globalThis.document = document;
      try { return createVine(...args); }
      finally { if (previous === undefined) delete globalThis.document; else globalThis.document = previous; }
    },
    location: { origin: url.origin, pathname: url.pathname, search: "", hash: "", href: url.href },
    history: { pushState(_state, _title, hash) { sandbox.location.hash = hash; } },
    localStorage: storage, sessionStorage: storage,
    innerHeight: height, scrollY: 0, URL, Date, Math, console,
    performance: { getEntriesByType: () => [{ type: "navigate" }] },
    requestAnimationFrame(callback) { frames.push(callback); return frames.length; },
    setTimeout(callback) { timers.push(callback); return timers.length; },
    clearTimeout() {},
    matchMedia(query) {
      if (!media.has(query)) media.set(query, {
        matches: false, addEventListener() {},
      });
      return media.get(query);
    },
    ResizeObserver: class { observe() {} },
    getComputedStyle: () => ({
      display: "block", paddingTop: "0", paddingBottom: "0", paddingLeft: "0", paddingRight: "0",
    }),
  };
  vm.createContext(sandbox);
  vm.runInContext(source + `
    globalThis.testAPI = {
      applyLanguage, capturePosition, cancelLayoutRestore, goToHash, setAiState, setMenu, showSkill,
      setScene(value) { sceneTimeline = value; },
      state() { return { language, prototypeState, pendingLanguagePosition }; }
    };`, sandbox, { filename: "main.js" });
  async function flush(includeTimers = false) {
    for (let turn = 0; turn < 30; turn++) {
      await Promise.resolve();
      for (const callback of frames.splice(0)) callback(0);
      if (includeTimers) for (const callback of timers.splice(0)) callback();
    }
  }
  await flush();
  const click = (node) => node.dispatchEvent(new Event("click", { bubbles: true }));
  return { ...sandbox.testAPI, sandbox, document, Event, window, rectangles, saved, click, flush };
}

function assertEnglishContent(document, page) {
  for (const node of document.querySelectorAll("body *")) {
    if (node.closest('script, style, noscript, [lang="zh-Hant"]')) continue;
    for (const child of node.childNodes) if (child.nodeType === 3)
      assert.ok(!cjk.test(child.textContent), `${page}: untranslated text ${child.textContent.trim()}`);
    for (const attribute of ["alt", "aria-label", "placeholder", "title"])
      assert.ok(!cjk.test(node.getAttribute(attribute) || ""), `${page}: untranslated ${attribute}`);
  }
}

for (const file of pages) {
  const page = await loadPage(file);
  const { document } = page;
  const translated = [...document.querySelectorAll("[data-i18n]")]
    .map((node) => ({ node, key: node.dataset.i18n, zh: node.innerHTML }));
  const attributes = [...document.querySelectorAll("*")].flatMap((node) =>
    ["alt", "aria-label", "placeholder"].filter((name) => node.hasAttribute("data-i18n-" + name))
      .map((name) => ({ node, name, zh: node.getAttribute(name) })),
  );
  const metadata = [...document.querySelectorAll('meta[name="description"], meta[property^="og:"]')]
    .map((node) => ({ node, content: node.content }));
  const title = document.title;
  const links = [...document.querySelectorAll("a[href]")].map((node) => [node, node.getAttribute("href")]);
  const controls = [...document.querySelectorAll("button, input, select, textarea, [data-usa-slide], [data-ai-panel]")];
  const icons = [...document.querySelectorAll(".skill-icon, .growth-vine")];
  assert.equal(document.documentElement.lang, "zh-Hant", file + ": Chinese-first default");
  assert.equal(page.saved.size, 0, "initial language must not persist an unsolicited choice");
  for (const { node, key } of translated) {
    assert.ok(englishCopy[key], file + ": missing English key " + key);
    assert.equal(node.querySelector("[data-i18n]"), null, file + ": nested translations can destroy nodes");
    assert.equal(node.querySelector("a, button, input, select, textarea"), null, file + ": translated copy must not replace controls");
  }
  for (let cycle = 0; cycle < 3; cycle++) {
    page.click(document.querySelector(".language-toggle"));
    await page.flush();
    assert.equal(document.documentElement.lang, "en");
    assert.equal(document.title, englishPageMetadata[file].title);
    assert.equal(document.querySelector('meta[name="description"]').content, englishPageMetadata[file].description);
    assert.equal(document.querySelector('meta[property="og:title"]').content, englishPageMetadata[file].title);
    assert.equal(document.querySelector('meta[property="og:locale"]').content, "en_US");
    assertEnglishContent(document, file);
    for (const { node, key, zh } of translated) {
      const expected = document.createElement("div");
      expected.innerHTML = englishCopy[key];
      assert.equal(node.innerHTML, expected.innerHTML, file + ": English content " + key);
      const index = zh.replace(/<[^>]*>/g, "").trim().match(/^\d{2}(?=\s*[—/])/);
      if (index) assert.equal(node.textContent.match(/\d{2}/)?.[0], index[0], file + ": chapter number changed for " + key);
    }
    page.click(document.querySelector(".language-toggle"));
    await page.flush();
    assert.equal(document.documentElement.lang, "zh-Hant");
    assert.equal(document.title, title);
    for (const { node, zh } of translated) assert.equal(node.innerHTML, zh, file + ": Chinese round trip");
    for (const { node, name, zh } of attributes) assert.equal(node.getAttribute(name), zh, file + ": attribute round trip");
    for (const { node, content } of metadata) assert.equal(node.content, content, file + ": metadata round trip");
    assert.ok(controls.every((node) => node.isConnected), file + ": controls must survive switching");
    assert.ok(icons.every((node) => node.isConnected), file + ": SVG icons must survive switching");
    assert.ok(links.every(([node, href]) => node.isConnected && node.getAttribute("href") === href), file + ": links must retain destinations");
  }
  page.click(document.querySelector(".menu-toggle"));
  page.applyLanguage("en", { restore: false });
  assert.equal(document.querySelector(".menu-toggle").getAttribute("aria-label"), "Close menu");
  assert.equal(document.querySelector("main").hasAttribute("inert"), true);
  page.setMenu(false);
  assert.equal(document.querySelector(".menu-toggle").getAttribute("aria-label"), "Open menu");
  assert.equal(document.querySelector("main").hasAttribute("inert"), false);
  const returning = await loadPage(file, { stored: "en" });
  assert.equal(returning.document.documentElement.lang, "en", file + ": explicit English choice must survive navigation");
  assertEnglishContent(returning.document, file);
  const blocked = await loadPage(file, { storageBlocked: true });
  blocked.applyLanguage("en", { persist: true, restore: false });
  assert.equal(blocked.document.documentElement.lang, "en", file + ": blocked storage must not break language changes");
}

const about = await loadPage("about.html");
const learningSkill = about.document.querySelector("[data-skill-learning]");
about.click(learningSkill);
about.applyLanguage("en", { restore: false });
assert.equal(about.document.querySelector("[data-skill-evidence-label]").textContent, "Learning record");
assert.equal(about.document.querySelector("[data-skill-evidence]").textContent, learningSkill.dataset.skillProject);
about.applyLanguage("zh", { restore: false });
assert.equal(about.document.querySelector("[data-skill-evidence]").textContent, learningSkill.dataset.skillProjectZh);
const projectSkill = about.document.querySelector('[data-skill-project]:not([data-skill-learning])');
about.click(projectSkill);
about.applyLanguage("en", { restore: false });
assert.equal(about.document.querySelector("[data-skill-evidence-label]").textContent, "USED IN");
const carouselNext = about.document.querySelector("[data-usa-carousel-next]");
about.click(carouselNext);
about.applyLanguage("zh", { restore: false });
assert.equal(about.document.querySelector("[data-usa-slide].is-active").getAttribute("aria-label"), "第 2 張，共 5 張");
about.applyLanguage("en", { restore: false });
assert.equal(about.document.querySelector("[data-usa-slide].is-active").getAttribute("aria-label"), "Photo 2 of 5");

const home = await loadPage("index.html");
home.setAiState(3);
home.applyLanguage("en", { restore: false });
assert.equal(home.document.querySelector("[data-phone-state]").textContent, "Live traffic");
assert.equal(home.document.querySelector("[data-ai-panel].is-active").dataset.aiPanel, "3");
home.click(home.document.querySelector("[data-portrait-flip]"));
home.applyLanguage("zh", { restore: false });
assert.equal(home.document.querySelector("[data-portrait-flip]").getAttribute("aria-pressed"), "true");
assert.equal(home.document.querySelector(".portrait-face-back").getAttribute("aria-hidden"), "false");

// Normal-flow scene anchors must follow About itself, not the tall outer sequence.
for (const height of [680, 719, 900]) {
  const page = await loadPage("index.html", { height });
  const panel = page.document.getElementById("about");
  page.rectangles.set(panel, { top: 100, bottom: height, height: height - 100 });
  page.rectangles.set(page.document.querySelector("[data-scene-sequence]"), { top: -600, bottom: height, height: height + 600 });
  page.sandbox.scrollY = 700;
  const anchor = page.capturePosition();
  assert.equal(anchor.anchor, panel, "normal flow must capture the visible inner scene");
  // Simulate language-driven layout movement while two font/layout updates wait.
  page.applyLanguage("en");
  page.rectangles.set(panel, { top: 180, bottom: height, height: height - 180 });
  page.cancelLayoutRestore({ target: page.document.querySelector(".language-toggle") });
  page.applyLanguage("zh");
  await page.flush();
  assert.equal(page.sandbox.scrollY, 780, "rapid switching must restore the first reading anchor");
  page.applyLanguage("en");
  page.window.dispatchEvent(new page.Event("wheel"));
  page.sandbox.scrollY = 850;
  await page.flush();
  assert.equal(page.sandbox.scrollY, 850, "deliberate scrolling must cancel pending restoration");
  page.applyLanguage("zh");
  page.goToHash("#top");
  await page.flush();
  assert.equal(page.sandbox.scrollY, 0, "returning home must cancel a delayed language restoration");
}

// Bridge actual localization/restoration to the scene contract. The separate
// motion suite exercises scene composition with the real bundled GSAP engine.
const pinned = await loadPage("index.html");
let sceneProgress = 0.45;
const trigger = { start: 0, end: 2250, progress: sceneProgress, getTween: () => ({ progress() {} }) };
const scene = {
  scrollTrigger: trigger, labels: { about: 1.4, work: 3.4 },
  duration: () => 3.6, time: () => sceneProgress * 3.6,
  progress(value) { sceneProgress = value; },
};
pinned.setScene(scene);
pinned.sandbox.scrollY = trigger.end * trigger.progress;
pinned.window.ScrollTrigger = {
  refresh() { trigger.end = 2500; },
  update() { trigger.progress = progressBetween(pinned.sandbox.scrollY, trigger.start, trigger.end); },
};
pinned.applyLanguage("en");
await pinned.flush();
assert.equal(pinned.sandbox.scrollY, 1125);
assert.equal(sceneProgress, 0.45);
assert.equal(pinned.document.getElementById("about").inert, false);
pinned.applyLanguage("zh");
pinned.goToHash("#top");
await pinned.flush();
assert.equal(pinned.sandbox.scrollY, 0);
assert.equal(sceneProgress, 0);
assert.equal(pinned.document.querySelector('[data-scene-panel="hero"]').inert, false);
assert.equal(pinned.document.getElementById("about").inert, true);

const prototype = await loadPage("ai-driving-assistant.html");
prototype.click(prototype.document.querySelector("[data-prototype-start]"));
assert.equal(prototype.state().prototypeState, "running");
prototype.applyLanguage("en", { restore: false });
assert.equal(prototype.document.querySelector("[data-prototype-status]").textContent, englishCopy.prototypeRunning);
await prototype.flush(true);
assert.equal(prototype.state().prototypeState, "complete");
prototype.applyLanguage("zh", { restore: false });
assert.match(prototype.document.querySelector("[data-prototype-status]").textContent, /示意完成/);
prototype.applyLanguage("en", { restore: false });
assert.equal(prototype.document.querySelector("[data-prototype-status]").textContent, englishCopy.prototypeComplete);
prototype.window.dispatchEvent(new prototype.Event("pagehide"));
assert.equal(prototype.document.querySelector("[data-prototype-status]").textContent, "");
assert.equal(prototype.document.querySelectorAll("[data-prototype-node].is-active").length, 0);

const contact = await loadPage("contact.html");
const name = contact.document.querySelector('input[name="name"]');
const email = contact.document.querySelector('input[name="email"]');
const message = contact.document.querySelector('textarea[name="message"]');
const option = contact.document.querySelectorAll('select[name="subject"] option')[2];
name.value = "Hong Rong";
email.value = "hello@example.com";
message.value = "A project idea / 合作內容";
option.selected = true;
for (const lang of ["en", "zh", "en"]) contact.applyLanguage(lang, { restore: false });
assert.equal(name.value, "Hong Rong");
assert.equal(email.value, "hello@example.com");
assert.equal(message.value, "A project idea / 合作內容");
assert.equal(option.selected, true, "language changes must retain the selected contact subject");
assert.equal(name.placeholder, "Name");
assert.equal(message.placeholder, "The need, timeline, or what you have in mind...");

console.log("Language checks passed: all six routes, repeated round trips, metadata, chapter numbers, storage, menus, icons, form drafts, skills, carousel, phone/portrait states, rapid switching and cancellable reading-position restoration. DOM/geometry fixtures are not browser visual QA.");
