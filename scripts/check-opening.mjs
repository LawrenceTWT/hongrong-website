import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";
import { parseHTML } from "linkedom";

// These are parser/state tests, not browser first-paint measurements.
const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
const main = await readFile(new URL("../js/main.js", import.meta.url), "utf8");
const boot = html.match(/<script data-opening-boot>([\s\S]*?)<\/script>/)[1];
const openingSource = main.slice(main.indexOf("function createOpeningTimeline("), main.indexOf("void startOpening();"));
assert.ok(html.indexOf("<script data-opening-boot>") < html.indexOf('href="css/styles.css"'), "gate must run before styles and deferred modules");
assert.match(html, /html\.opening-pending::before[\s\S]*?position: fixed;[\s\S]*?background: #182d23;/);

function fixture({ seen = false, reduced = false, navigation = "navigate", hash = "", blocked = false, gsap = true, broken = false, layout = Promise.resolve() } = {}) {
  const { document } = parseHTML(html);
  const root = document.documentElement, body = document.body;
  const timers = new Map(), saved = new Map(seen ? [["hongrong-opening-2-5s", "seen"]] : []);
  let timerId = 0, animation = null, layoutCalls = 0;
  const window = {};
  if (gsap) window.gsap = {
    timeline(options) {
      if (broken) throw Error("Unavailable animation engine");
      animation = { killed: false, fromTo() { return this; }, to() { return this; }, kill() { this.killed = true; }, complete() { options.onComplete(); } };
      return animation;
    },
  };
  const sandbox = {
    document, root, body, window, reducedMotion: { matches: reduced }, location: { hash },
    performance: { getEntriesByType: () => [{ type: navigation }] },
    matchMedia: () => ({ matches: reduced }),
    sessionStorage: {
      getItem(key) { if (blocked) throw Error("Storage blocked"); return saved.get(key) ?? null; },
      setItem(key, value) { if (blocked) throw Error("Storage blocked"); saved.set(key, value); },
    },
    setTimeout(callback) { const id = ++timerId; timers.set(id, callback); return id; },
    clearTimeout(id) { timers.delete(id); },
    refreshLayout() { layoutCalls++; return layout; },
    goToHash() {},
  };
  vm.createContext(sandbox);
  vm.runInContext(boot, sandbox);
  const pendingBeforeModule = root.classList.contains("opening-pending");
  vm.runInContext("let openingAnimation=null,finishOpening=()=>releaseOpeningGate();" + openingSource + "globalThis.start=startOpening;globalThis.finish=()=>finishOpening();", sandbox);
  return {
    ...sandbox, pendingBeforeModule,
    get animation() { return animation; },
    get layoutCalls() { return layoutCalls; },
    runTimers() { const callbacks = [...timers.values()]; timers.clear(); callbacks.forEach((callback) => callback()); },
    get timerCount() { return timers.size; },
  };
}

let resolveLayout;
const loading = fixture({ layout: new Promise((resolve) => { resolveLayout = resolve; }) });
assert.equal(loading.pendingBeforeModule, true, "first visit must already be covered before the module starts");
await loading.start();
assert.equal(loading.body.classList.contains("opening-active"), true, "curtain must be active without waiting for fonts");
assert.equal(loading.root.classList.contains("opening-pending"), false, "the actual curtain takes over the gate");
assert.ok(loading.animation, "wordmark starts immediately while layout waits");
assert.equal(loading.layoutCalls, 1);
loading.animation.complete();
assert.equal(loading.body.classList.contains("opening-active"), false);
assert.equal(loading.document.querySelector("[data-opening]").hidden, true);
assert.equal(loading.timerCount, 0);
resolveLayout(); await Promise.resolve();
assert.equal(loading.body.classList.contains("opening-active"), false, "late fonts must not replay the intro");

for (const options of [{ seen: true }, { reduced: true }, { navigation: "back_forward" }, { hash: "#about" }]) {
  const page = fixture(options);
  assert.equal(page.pendingBeforeModule, false, "repeat/deep/reduced-motion navigation must not install a curtain");
  await page.start();
  assert.equal(page.animation, null);
  assert.equal(page.body.classList.contains("opening-active"), false);
}
const noEngine = fixture({ gsap: false });
await noEngine.start();
assert.equal(noEngine.root.classList.contains("opening-pending"), false, "missing GSAP must reveal the real page immediately");
const blocked = fixture({ blocked: true });
await blocked.start(); assert.ok(blocked.animation); blocked.animation.complete();
const broken = fixture({ broken: true });
await broken.start(); assert.equal(broken.body.classList.contains("opening-active"), false); assert.equal(broken.timerCount, 0);
const expired = fixture();
expired.runTimers();
assert.equal(expired.root.classList.contains("opening-pending"), false, "module-load failure must release the gate");
await expired.start(); assert.equal(expired.animation, null, "a late module must not cover the page again after timeout");
const interrupted = fixture();
await interrupted.start(); interrupted.finish();
assert.equal(interrupted.body.classList.contains("opening-active"), false); assert.equal(interrupted.timerCount, 0);
console.log("Opening checks passed: pre-module gate, immediate wordmark, late fonts, timeout, storage failure, unavailable engine, revisit/deep-link/reduced-motion skips and cleanup. No browser paint timing is claimed.");
