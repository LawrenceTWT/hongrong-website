import { englishCopy, englishPageMetadata } from "./copy.js";
import { botanicalPlacements, createVine, progressBetween } from "./botanical.js";

// Chinese HTML is the source of the initial view. Only explicit language choices persist.
const root = document.documentElement;
const body = document.body;
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
const desktopMotion =
  "(min-width: 960px) and (min-height: 760px) and (prefers-reduced-motion: no-preference)";
const storageKey = "hongrong-language-choice";
const storage = {
  get() {
    try {
      return localStorage.getItem(storageKey);
    } catch {
      return null;
    }
  },
  set(value) {
    try {
      localStorage.setItem(storageKey, value);
    } catch {
      /* Storage is optional. */
    }
  },
};
const textNodes = [...document.querySelectorAll("[data-i18n]")].map((node) => ({
  node,
  key: node.dataset.i18n,
  zh: node.innerHTML,
}));
const attributeNodes = ["alt", "aria-label", "placeholder"].flatMap(
  (attribute) =>
    [...document.querySelectorAll("[data-i18n-" + attribute + "]")].map(
      (node) => ({
        node,
        attribute,
        key: node.getAttribute("data-i18n-" + attribute),
        zh: node.getAttribute(attribute),
      }),
    ),
);
let language = "zh";
const chineseTitle = document.title;
const englishMetadata =
  englishPageMetadata[location.pathname.split("/").pop() || "index.html"];
const metadataNodes = [
  ['meta[name="description"]', "description"],
  ['meta[property="og:title"]', "title"],
  ['meta[property="og:description"]', "description"],
  ['meta[property="og:locale"]', "locale"],
].flatMap(([selector, field]) => {
  const node = document.querySelector(selector);
  return node ? [{ node, field, zh: node.content }] : [];
});
let sceneTimeline = null;
let landscapeTimeline = null;
let openingAnimation = null;
const aboutText = document.querySelector("[data-about-text-effect]");
const aboutRegion = aboutText?.closest("[data-scene-panel]");
const aboutContent = document.querySelector("[data-about-content]");
let aboutBoundary = null;
let aboutHoldShift = null;
let aboutTextProgress = -1;
let aboutShadeProgress = -1;
const scenePacing = { aboutIn: 0.12, about: 1.4, workIn: 2.1, work: 3.4 };
const aboutRevealPacing = { shadeIn: 0.35, shade: 1.15, textIn: 0.95, text: 1.85 };
let finishOpening = () => releaseOpeningGate();
let refreshRevision = 0;
let languageRefreshRevision = 0;
let pendingLanguagePosition = null;
let scrollFrame = 0;
let prototypeRun = 0;
let prototypeState = "idle";
let selectedSkill = null;
const botanicalVines = [];
let resetPortrait = () => {};

function scrollToPosition(top, smooth = false) {
  window.scrollTo({
    top: Math.max(0, top),
    behavior: smooth && !reducedMotion.matches ? "smooth" : "auto",
  });
}

function capturePosition() {
  const trigger = sceneTimeline?.scrollTrigger;
  if (trigger && scrollY >= trigger.start && scrollY <= trigger.end) {
    return { scene: trigger.progress };
  }
  const candidates = [
    ...document.querySelectorAll(
      "main > section:not([data-scene-sequence]), main > div, [data-scene-panel], footer",
    ),
  ];
  const anchor = candidates.find((node) => {
    const box = node.getBoundingClientRect();
    return box.top <= innerHeight * 0.35 && box.bottom > innerHeight * 0.35;
  });
  return anchor
    ? { anchor, offset: anchor.getBoundingClientRect().top }
    : { top: scrollY };
}

// One layout update path, cancelled if the user deliberately scrolls while it is pending.
async function refreshLayout(position = null) {
  const revision = ++refreshRevision;
  await (document.fonts?.ready || Promise.resolve());
  await new Promise(requestAnimationFrame);
  if (revision !== refreshRevision) return;
  window.ScrollTrigger?.refresh();
  if (position?.scene !== undefined && sceneTimeline?.scrollTrigger) {
    const trigger = sceneTimeline.scrollTrigger;
    scrollToPosition(
      trigger.start + position.scene * (trigger.end - trigger.start),
    );
  } else if (position?.anchor?.isConnected) {
    scrollToPosition(
      scrollY + position.anchor.getBoundingClientRect().top - position.offset,
    );
  } else if (position?.top !== undefined) {
    scrollToPosition(position.top);
  }
  window.ScrollTrigger?.update();
  settleScene();
  updateScrollState();
}

// Layout restoration is immediate; only deliberate scrolling gets scrub inertia.
function settleScene() {
  for (const timeline of [sceneTimeline, landscapeTimeline]) {
    const trigger = timeline?.scrollTrigger;
    if (!trigger) continue;
    trigger.getTween()?.progress(1);
    timeline.progress(trigger.progress);
  }
  updateSceneAccess();
}
function cancelLayoutRestore(event) {
  refreshRevision += 1;
  if (!event?.target?.closest?.(".language-toggle"))
    pendingLanguagePosition = null;
}
["wheel", "touchstart", "pointerdown"].forEach((type) =>
  window.addEventListener(type, cancelLayoutRestore, { passive: true }),
);

function applyLanguage(next, { persist = false, restore = true } = {}) {
  const position = restore
    ? pendingLanguagePosition || capturePosition()
    : null;
  language = next === "en" ? "en" : "zh";
  root.lang = language === "zh" ? "zh-Hant" : "en";
  body.dataset.lang = language;
  document.title =
    language === "zh"
      ? chineseTitle
      : englishMetadata?.title || chineseTitle;
  for (const { node, field, zh } of metadataNodes) {
    node.content =
      language === "zh"
        ? zh
        : field === "locale"
          ? "en_US"
          : englishMetadata?.[field] || zh;
  }
  for (const { node, key, zh } of textNodes) {
    const value = language === "en" ? (englishCopy[key] ?? zh) : zh;
    if (node.innerHTML !== value) node.innerHTML = value;
  }
  for (const { node, attribute, key, zh } of attributeNodes) {
    node.setAttribute(
      attribute,
      language === "en" ? (englishCopy[key] ?? zh) : zh,
    );
  }
  document.querySelectorAll(".language-toggle").forEach((button) => {
    button.hidden = false;
    button.textContent = language === "zh" ? "EN" : "中文";
    button.lang = language === "zh" ? "en" : "zh-Hant";
    button.setAttribute(
      "aria-label",
      language === "zh" ? "Switch to English" : "切換至繁體中文",
    );
  });
  updateMenuLabel();
  document
    .querySelectorAll("[data-usa-slide]")
    .forEach((slide, index) =>
      slide.setAttribute(
        "aria-label",
        language === "zh"
          ? "第 " + (index + 1) + " 張，共 5 張"
          : "Photo " + (index + 1) + " of 5",
      ),
    );
  document
    .querySelectorAll("[data-usa-carousel-dot]")
    .forEach((dot, index) =>
      dot.setAttribute(
        "aria-label",
        language === "zh"
          ? "查看第 " + (index + 1) + " 張照片"
          : "View photo " + (index + 1),
      ),
    );
  const name = document.querySelector('input[name="name"]');
  const message = document.querySelector('textarea[name="message"]');
  if (name) name.placeholder = language === "zh" ? "名字" : "Name";
  if (message)
    message.placeholder =
      language === "zh"
        ? "需求、時程，或想聊的事⋯"
        : "The need, timeline, or what you have in mind...";
  if (selectedSkill) showSkill(selectedSkill);
  setAiState(activeAiState);
  updatePrototypeStatus();
  if (persist) storage.set(language);
  if (restore) {
    const revision = ++languageRefreshRevision;
    pendingLanguagePosition = position;
    void refreshLayout(position).then(() => {
      if (revision === languageRefreshRevision) pendingLanguagePosition = null;
    });
  }
}
document
  .querySelectorAll(".language-toggle")
  .forEach((button) =>
    button.addEventListener("click", () =>
      applyLanguage(language === "zh" ? "en" : "zh", { persist: true }),
    ),
  );

// Mobile menu keeps keyboard focus inside and restores focus to its trigger.
const menuButton = document.querySelector(".menu-toggle");
const menu = document.querySelector(".menu-panel");
const menuQuery = matchMedia("(max-width: 600px)");
function updateMenuLabel() {
  const open = menuButton?.getAttribute("aria-expanded") === "true";
  menuButton?.setAttribute(
    "aria-label",
    language === "zh"
      ? open
        ? "關閉選單"
        : "開啟選單"
      : open
        ? "Close menu"
        : "Open menu",
  );
}
function setMenu(open, returnFocus = false) {
  if (!menu || !menuButton) return;
  body.classList.toggle("menu-open", open);
  menu.classList.toggle("is-open", open);
  menu.inert = !open;
  menu.setAttribute("aria-hidden", String(!open));
  menuButton.setAttribute("aria-expanded", String(open));
  document.querySelector("main")?.toggleAttribute("inert", open);
  document.querySelector("footer")?.toggleAttribute("inert", open);
  updateMenuLabel();
  if (open) menu.querySelector("a")?.focus();
  else if (returnFocus) menuButton.focus();
}
if (menuButton) menuButton.hidden = false;
menuButton?.addEventListener("click", () =>
  setMenu(menuButton.getAttribute("aria-expanded") !== "true"),
);
menu
  ?.querySelectorAll("a")
  .forEach((link) => link.addEventListener("click", () => setMenu(false)));
menuQuery.addEventListener("change", (event) => {
  if (!event.matches) setMenu(false);
});
document.addEventListener("keydown", (event) => {
  if (!body.classList.contains("menu-open")) return;
  if (event.key === "Escape") {
    setMenu(false, true);
    return;
  }
  if (event.key !== "Tab") return;
  const focusable = [
    ...document.querySelectorAll(
      ".site-header a, .site-header button, .menu-panel a",
    ),
  ].filter(
    (node) =>
      !node.hidden &&
      !node.disabled &&
      node.getClientRects().length &&
      getComputedStyle(node).display !== "none",
  );
  const first = focusable[0],
    last = focusable.at(-1);
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last?.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first?.focus();
  }
});

// Native cross-page links are intentional. No exit-opacity class or delayed navigation.
function sameDocument(url) {
  if (url.origin !== location.origin || url.search !== location.search)
    return false;
  const normalize = (path) =>
    path.replace(/index\.html$/, "").replace(/\/$/, "");
  return normalize(url.pathname) === normalize(location.pathname);
}
function hashPosition(hash) {
  if (hash === "#top") return 0;
  const trigger = sceneTimeline?.scrollTrigger;
  const label = hash.slice(1);
  if (trigger && sceneTimeline.labels[label] !== undefined) {
    return (
      trigger.start +
      (sceneTimeline.labels[label] / sceneTimeline.duration()) *
        (trigger.end - trigger.start)
    );
  }
  const target = document.getElementById(label);
  return target
    ? target.getBoundingClientRect().top +
        scrollY -
        (target.matches(".scene-panel") ? 0 : 96)
    : null;
}
function goToHash(hash, smooth = false) {
  const top = hashPosition(hash);
  if (top === null) return;
  cancelLayoutRestore();
  scrollToPosition(top, smooth);
  window.ScrollTrigger?.update();
  if (!smooth) settleScene();
  updateScrollState();
}
document.addEventListener("click", (event) => {
  const link = event.target.closest("a[href]");
  if (
    !link ||
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.altKey ||
    event.shiftKey ||
    link.hasAttribute("download") ||
    (link.target && link.target !== "_self")
  )
    return;
  const url = new URL(link.href);
  if (!sameDocument(url) || !url.hash) return;
  const target = document.getElementById(url.hash.slice(1));
  if (!target) return;
  event.preventDefault();
  setMenu(false);
  if (location.hash !== url.hash) history.pushState(null, "", url.hash);
  goToHash(url.hash, true);
  // Skip links retain their expected keyboard semantics.
  if (link.classList.contains("skip-link"))
    target.focus({ preventScroll: true });
});
window.addEventListener("hashchange", () => goToHash(location.hash || "#top"));
document.querySelectorAll(".back-to-top").forEach((button) =>
  button.addEventListener("click", () => {
    cancelLayoutRestore();
    if (body.dataset.page === "home") {
      if (location.hash !== "#top") history.pushState(null, "", "#top");
    }
    scrollToPosition(0, true);
  }),
);

// Match the scene's sine easing when other layers use its progress.
function sceneTransitionProgress(time, start, end) {
  return (1 - Math.cos(Math.PI * progressBetween(time, start, end))) / 2;
}

// Measure in layout coordinates: transforms must not feed back into the boundary.
function measureAboutBoundary() {
  if (!aboutContent || !aboutRegion) return;
  aboutBoundary = {
    height: aboutRegion.clientHeight,
    bottom: aboutContent.offsetTop + aboutContent.offsetHeight,
    gap: Math.min(40, Math.max(24, aboutRegion.clientHeight * 0.03)),
  };
}

// Explicit from/to values survive refresh, localization and reverse scrolling.
function initScenes() {
  const sequence = document.querySelector("[data-scene-sequence]");
  if (!sequence || !window.gsap || !window.ScrollTrigger) return;
  const gsap = window.gsap;
  gsap.registerPlugin(window.ScrollTrigger);
  const motion = gsap.matchMedia();
  motion.add(desktopMotion, () => {
    const hero = sequence.querySelector('[data-scene-panel="hero"]');
    const about = sequence.querySelector('[data-scene-panel="about"]');
    const work = sequence.querySelector('[data-scene-panel="work"]');
    const panels = [hero, about, work];
    sequence.classList.add("scene-enhanced");
    gsap.set(hero, { yPercent: 0 });
    gsap.set([about, work], { yPercent: 100 });
    measureAboutBoundary();
    const timeline = gsap.timeline({
      defaults: { ease: "sine.inOut" },
      onUpdate() {
        if (sceneTimeline !== this) return;
        updateSceneAccess();
        updateAboutHold();
        requestScrollState();
      },
      scrollTrigger: {
        trigger: sequence,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.8,
        onRefresh() {
          measureAboutBoundary();
          requestScrollState();
        },
      },
    });
    sceneTimeline = timeline;
    timeline
      .fromTo(
        hero,
        { yPercent: 0 },
        { yPercent: -30, duration: 1.5, immediateRender: false },
        0,
      )
      .fromTo(
        hero.querySelector("[data-scene-copy]"),
        { yPercent: 0 },
        { yPercent: -3, duration: 1.5, immediateRender: false },
        0,
      )
      .fromTo(
        about,
        { yPercent: 100 },
        {
          yPercent: 0,
          duration: scenePacing.about - scenePacing.aboutIn,
          immediateRender: false,
        },
        scenePacing.aboutIn,
      )
      .addLabel("about", scenePacing.about)
      // A real reading pause keeps the centered story CTA visible.
      .fromTo(
        about,
        { yPercent: 0 },
        {
          yPercent: -20,
          duration: scenePacing.work - scenePacing.workIn,
          immediateRender: false,
        },
        scenePacing.workIn,
      )
      .fromTo(
        work,
        { yPercent: 100 },
        {
          yPercent: 0,
          duration: scenePacing.work - scenePacing.workIn,
          immediateRender: false,
        },
        scenePacing.workIn,
      )
      .addLabel("work", scenePacing.work)
      .to({}, { duration: 0.2 });
    updateSceneAccess();
    return () => {
      sceneTimeline = null;
      aboutBoundary = null;
      aboutHoldShift = null;
      aboutContent?.style.removeProperty("--about-hold-y");
      sequence.classList.remove("scene-enhanced");
      panels.forEach((panel) => {
        panel.inert = false;
        panel.removeAttribute("aria-hidden");
      });
      timeline.scrollTrigger?.kill();
      timeline.kill();
    };
  });
}

// The name rises from behind the traced ridge as the landscape enters the view.
// Base and foreground remain one SVG, so their photographic edges stay aligned.
function initLandscape() {
  const scene = document.querySelector("[data-landscape-scene]");
  if (!scene || !window.gsap || !window.ScrollTrigger) return;
  const gsap = window.gsap;
  gsap.registerPlugin(window.ScrollTrigger);
  const motion = gsap.matchMedia();
  motion.add("(prefers-reduced-motion: no-preference)", () => {
    const timeline = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: scene,
        start: "top bottom",
        end: "bottom bottom",
        scrub: 0.8,
        invalidateOnRefresh: true,
      },
    });
    landscapeTimeline = timeline;
    timeline
      .fromTo(scene.querySelector(".landscape-art"),
        { scale: 1.035 }, { scale: 1, duration: 1 }, 0)
      .fromTo(scene.querySelector(".landscape-word"),
        { y: 260 }, { y: 0, duration: 0.9 }, 0.1)
      .fromTo(scene.querySelector(".landscape-caption"),
        { y: 12 }, { y: 0, duration: 0.65 }, 0.35);
    return () => {
      landscapeTimeline = null;
      timeline.scrollTrigger?.kill();
      timeline.kill();
    };
  });
}
function updateSceneAccess() {
  if (!sceneTimeline) return;
  const time = sceneTimeline.time();
  const active =
    time < scenePacing.about - 0.08
      ? "hero"
      : time < scenePacing.work - 0.08
        ? "about"
        : "work";
  document.querySelectorAll("[data-scene-panel]").forEach((panel) => {
    const inactive = panel.dataset.scenePanel !== active;
    if (panel.inert !== inactive) panel.inert = inactive;
    if (panel.getAttribute("aria-hidden") !== String(inactive))
      panel.setAttribute("aria-hidden", String(inactive));
  });
}

// One scroll controller chooses the nearest phone step, including reverse and large jumps.
const aiSteps = [...document.querySelectorAll("[data-ai-step]")];
const aiPanels = [...document.querySelectorAll("[data-ai-panel]")];
const phoneState = document.querySelector("[data-phone-state]");
const aiVine = document.querySelector("[data-ai-vine-path]");
const aiVineLength = aiVine?.getTotalLength() || 0;
const aiLeaves = [...document.querySelectorAll("[data-ai-leaf]")];
let aiGrowthProgress = -1;
let activeAiState = 0;
if (aiVine) aiVine.style.strokeDasharray = String(aiVineLength);
function setAiState(index) {
  activeAiState = index;
  aiSteps.forEach((step, i) => step.classList.toggle("is-active", i === index));
  aiPanels.forEach((panel, i) => {
    panel.classList.toggle("is-active", i === index);
    panel.setAttribute("aria-hidden", String(i !== index));
  });
  if (phoneState)
    phoneState.textContent = (
      language === "zh"
        ? ["登入", "剩餘車位", "導航", "即時路況", "車輛位置"]
        : ["Login", "Parking", "Navigation", "Live traffic", "Vehicle location"]
    )[index];
}
function updateAiStory() {
  if (!aiSteps.length) return;
  const boxes = aiSteps.map((step) => step.getBoundingClientRect());
  const closest = boxes.reduce(
    (best, box, index) => {
      const distance = Math.abs(box.top + box.height / 2 - innerHeight * 0.5);
      return distance < best.distance ? { index, distance } : best;
    },
    { index: 0, distance: Infinity },
  );
  if (closest.index !== activeAiState) setAiState(closest.index);
  const center = (box) => box.top + box.height / 2;
  const first = center(boxes[0]);
  const last = center(boxes.at(-1));
  const progress = reducedMotion.matches
    ? 1
    : 0.12 + 0.88 * progressBetween(innerHeight * 0.75, first, last);
  const rounded = Math.round(progress * 1000) / 1000;
  if (rounded === aiGrowthProgress) return;
  aiGrowthProgress = rounded;
  if (aiVine)
    aiVine.style.strokeDashoffset = String(aiVineLength * (1 - rounded));
  aiLeaves.forEach((leaf, index) => {
    const unfold = progressBetween(
      rounded,
      0.1 + index * 0.17,
      0.24 + index * 0.17,
    );
    leaf.style.setProperty("--leaf-open", String(unfold));
  });
}
function updateNavigation() {
  if (body.dataset.page !== "home") return;
  const sequence = document.querySelector("[data-scene-sequence]");
  let active = "";
  const contact = document.getElementById("contact");
  const ai = document.getElementById("ai-project");
  if (contact && contact.getBoundingClientRect().top < innerHeight * 0.45)
    active = "contact";
  else if (ai && ai.getBoundingClientRect().top < innerHeight * 0.45)
    active = "work";
  else if (sceneTimeline) {
    active =
      sceneTimeline.time() >= scenePacing.work - 0.08
        ? "work"
        : sceneTimeline.time() >= scenePacing.about - 0.08
          ? "about"
          : "";
  } else if (sequence) {
    ["about", "work"].forEach((id) => {
      if (
        document.getElementById(id)?.getBoundingClientRect().top <
        innerHeight * 0.45
      )
        active = id;
    });
  }
  document.querySelectorAll("[data-nav-page]").forEach((link) => {
    if (link.dataset.navPage === active)
      link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  });
}
// One entry clock keeps scene movement and decorative plants in step.
function getSectionEntryProgress(region, scene) {
  if (sceneTimeline && (scene === "about" || scene === "work")) {
    const range =
      scene === "about"
        ? [scenePacing.aboutIn, scenePacing.about]
        : [scenePacing.workIn, scenePacing.work];
    return sceneTransitionProgress(sceneTimeline.time(), ...range);
  }
  const box = region.getBoundingClientRect();
  const distance = Math.max(1, Math.min(box.height, innerHeight));
  return progressBetween(innerHeight - box.top, 0, distance);
}
function updateAboutText() {
  if (!aboutText || !aboutRegion) return;
  let shade = 1, progress = 1;
  if (!reducedMotion.matches) {
    if (sceneTimeline) {
      const time = sceneTimeline.time();
      shade = sceneTransitionProgress(time, aboutRevealPacing.shadeIn, aboutRevealPacing.shade);
      progress = progressBetween(time, aboutRevealPacing.textIn, aboutRevealPacing.text);
    } else {
      const entry = getSectionEntryProgress(aboutRegion, "about");
      shade = progressBetween(entry, 0.1, 0.65);
      progress = progressBetween(entry, 0.6, 1);
    }
  }
  const tone = Math.round(shade * 1000);
  if (tone !== aboutShadeProgress) {
    aboutShadeProgress = tone;
    aboutRegion.style.setProperty("--about-shade", tone / 10 + "%");
    aboutRegion.style.setProperty("--about-label-progress", String(progressBetween(shade, 0.8, 1)));
  }
  const rounded = Math.round(progress * 1000);
  if (rounded === aboutTextProgress) return;
  aboutTextProgress = rounded;
  // Four 100% line ranges keep the real, translatable heading intact.
  aboutText.style.setProperty("--about-text-progress", rounded / 2.5 + "%");
}

// Stay centered until the following scene reaches the content's lower boundary.
// Then leave with that edge; the CTA travels with its own heading.
function updateAboutHold() {
  if (!aboutContent || !sceneTimeline || !aboutBoundary) return;
  const progress = sceneTransitionProgress(
    sceneTimeline.time(), scenePacing.workIn, scenePacing.work,
  );
  const { height, bottom, gap } = aboutBoundary;
  const nextEdge = height * (1 - progress);
  const exit = Math.min(0, nextEdge - bottom - gap);
  const shift = Math.round((height * 0.2 * progress + exit) * 100) / 100;
  if (shift === aboutHoldShift) return;
  aboutHoldShift = shift;
  aboutContent.style.setProperty("--about-hold-y", shift + "px");
}
function updateScrollState() {
  scrollFrame = 0;
  document
    .querySelector(".site-header")
    ?.classList.toggle("is-scrolled", scrollY > 18);
  updateAiStory();
  updateNavigation();
  updateAboutText();
  updateAboutHold();
  updateBotanicalGrowth();
}

// Decorative enhancement shares the existing scroll frame and follows progress in both directions.
function initBotanicalGrowth() {
  for (const placement of botanicalPlacements) {
    document.querySelectorAll(placement.selector).forEach((region) => {
      region.classList.add("botanical-region");
      const vine = createVine(placement.variant || "margin", botanicalVines.length);
      const scene = region.closest("[data-scene-panel]")?.dataset.scenePanel;
      const fromTop = [".page-hero", ".case-hero", ".contact-main"].includes(placement.selector);
      vine.style.setProperty(
        "--vine-progress",
        reducedMotion.matches || scene === "hero" || fromTop ? "1" : "0",
      );
      if (placement.side) {
        const margin = document.createElement("span");
        margin.className = "botanical-margin botanical-margin--" + placement.side;
        margin.setAttribute("aria-hidden", "true");
        vine.style.setProperty("--vine-size", placement.size + "px");
        vine.style.setProperty("--vine-bottom", placement.bottom);
        vine.style.setProperty("--vine-angle", placement.angle + "deg");
        vine.style.setProperty("--vine-mirror", placement.side === "right" ? "-1" : "1");
        margin.append(vine);
        region.append(margin);
      } else region.append(vine);
      botanicalVines.push({ region, vine, scene, fromTop, delay: placement.delay || 0, progress: -1 });
    });
  }
}
function updateBotanicalGrowth() {
  const updates = botanicalVines.map((item) => {
    let progress;
    if (reducedMotion.matches || item.scene === "hero" || item.fromTop)
      progress = 1;
    else progress = getSectionEntryProgress(item.region, item.scene);
    if (!reducedMotion.matches)
      progress = progressBetween(progress, item.delay || 0, 1);
    return { item, progress: Math.round(progress * 1000) };
  });
  updates.forEach(({ item, progress }) => {
    if (item.progress === progress) return;
    item.progress = progress;
    item.vine.style.setProperty("--vine-progress", String(progress / 1000));
  });
}
function requestScrollState() {
  if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScrollState);
}

// Pointer movement reverses naturally; the same native button supports touch and keyboard.
function initPortraitFlip() {
  const button = document.querySelector("[data-portrait-flip]");
  if (!button) return;
  const hover = matchMedia("(hover: hover) and (pointer: fine)");
  const front = button.querySelector(".portrait-face-front");
  const back = button.querySelector(".portrait-face-back");
  const backImage = back.querySelector("img");
  const hint = document.getElementById("portrait-flip-hint");
  let backReady = false;
  let imageRevision = 0;
  let flipped = false;
  const setFlipped = (next) => {
    flipped = Boolean(next && backReady);
    button.classList.toggle("is-flipped", flipped);
    button.closest(".hero-visual").classList.toggle("is-portrait-flipped", flipped);
    button.setAttribute("aria-pressed", String(flipped));
    front.setAttribute("aria-hidden", String(flipped));
    back.setAttribute("aria-hidden", String(!flipped));
  };
  resetPortrait = () => setFlipped(false);
  // Keep the formal face visible until the reverse photograph can be painted.
  async function enableBackImage() {
    const revision = ++imageRevision;
    if (!backImage.complete || backImage.naturalWidth === 0) return;
    try {
      await backImage.decode?.();
    } catch {
      return;
    }
    if (revision !== imageRevision) return;
    backReady = true;
    button.disabled = false;
    hint.hidden = false;
  }
  backImage.addEventListener("load", () => void enableBackImage());
  backImage.addEventListener("error", () => {
    imageRevision += 1;
    backReady = false;
    resetPortrait();
    button.disabled = true;
    hint.hidden = true;
  });
  void enableBackImage();
  button.addEventListener("pointerenter", (event) => {
    if (hover.matches && event.pointerType === "mouse") setFlipped(true);
  });
  button.addEventListener("pointerleave", (event) => {
    if (event.pointerType === "mouse") resetPortrait();
  });
  button.addEventListener("pointercancel", resetPortrait);
  button.addEventListener("click", (event) => {
    if (event.detail === 0 || !hover.matches || event.pointerType === "touch")
      setFlipped(!flipped);
  });
  button.addEventListener("keydown", (event) => {
    if (event.key === "Escape") resetPortrait();
  });
  button.addEventListener("blur", resetPortrait);
  hover.addEventListener("change", resetPortrait);
}
window.addEventListener("scroll", requestScrollState, { passive: true });
window.addEventListener("resize", requestScrollState, { passive: true });
reducedMotion.addEventListener("change", () => {
  if (reducedMotion.matches) {
    openingAnimation?.progress(1);
    finishOpening();
  }
  setAiState(activeAiState);
  requestScrollState();
});

// Native scroll-snap carousel, no autoplay, and no cropping of the original photographs.
function initCarousel() {
  const carousel = document.querySelector("[data-usa-carousel]");
  if (!carousel) return;
  const viewport = carousel.querySelector("[data-usa-carousel-viewport]");
  const slides = [...carousel.querySelectorAll("[data-usa-slide]")];
  const dots = [...carousel.querySelectorAll("[data-usa-carousel-dot]")];
  const previous = carousel.querySelector("[data-usa-carousel-prev]");
  const next = carousel.querySelector("[data-usa-carousel-next]");
  const status = carousel.querySelector("[data-usa-carousel-status]");
  let current = 0,
    frame = 0;
  function setCurrent(index) {
    current = Math.max(0, Math.min(slides.length - 1, index));
    slides.forEach((slide, i) =>
      slide.classList.toggle("is-active", i === current),
    );
    dots.forEach((dot, i) => {
      dot.classList.toggle("is-active", i === current);
      if (i === current) dot.setAttribute("aria-current", "true");
      else dot.removeAttribute("aria-current");
    });
    previous.disabled = current === 0;
    next.disabled = current === slides.length - 1;
    status.textContent = String(current + 1).padStart(2, "0") + " / 05";
    carousel.style.setProperty(
      "--photo-control-width",
      slides[current].clientWidth + 52 + "px",
    );
  }
  function slideLeft(slide) {
    return (
      viewport.scrollLeft +
      slide.getBoundingClientRect().left -
      viewport.getBoundingClientRect().left -
      (viewport.clientWidth - slide.clientWidth) / 2
    );
  }
  function go(index, smooth = true) {
    setCurrent(index);
    viewport.scrollTo({
      left: slideLeft(slides[current]),
      behavior: smooth && !reducedMotion.matches ? "smooth" : "auto",
    });
  }
  previous.addEventListener("click", () => go(current - 1));
  next.addEventListener("click", () => go(current + 1));
  dots.forEach((dot, i) => dot.addEventListener("click", () => go(i)));
  viewport.addEventListener(
    "scroll",
    () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const index = slides.reduce(
          (best, slide, i) => {
            const distance = Math.abs(slideLeft(slide) - viewport.scrollLeft);
            return distance < best.distance ? { index: i, distance } : best;
          },
          { index: 0, distance: Infinity },
        ).index;
        setCurrent(index);
      });
    },
    { passive: true },
  );
  viewport.addEventListener("keydown", (event) => {
    const targets = {
      ArrowLeft: current - 1,
      ArrowRight: current + 1,
      Home: 0,
      End: slides.length - 1,
    };
    if (targets[event.key] === undefined) return;
    event.preventDefault();
    go(targets[event.key]);
  });
  function sizeFrames() {
    slides.forEach((slide) => {
      const media = slide.querySelector(".usa-photo-media");
      const image = media.querySelector("img");
      const style = getComputedStyle(media);
      const paddingY =
        parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
      const paddingX =
        parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
      const ratio =
        Number(image.getAttribute("width")) /
        Number(image.getAttribute("height"));
      const width = Math.min(
        viewport.clientWidth,
        (media.clientHeight - paddingY) * ratio + paddingX,
      );
      slide.style.flexBasis = width + "px";
    });
    const edge = Math.max(
      0,
      (viewport.clientWidth - slides[0].clientWidth) / 2,
    );
    carousel.querySelector(".usa-carousel-track").style.paddingInline =
      edge + "px";
    go(current, false);
  }
  const resize = new ResizeObserver(sizeFrames);
  resize.observe(viewport);
  sizeFrames();
}

// Skills support hover, keyboard focus and taps, with factual project mappings.
function showSkill(button) {
  selectedSkill = button;
  document.querySelectorAll("[data-skill-project]").forEach((node) => {
    node.classList.toggle("is-active", node === button);
    node.setAttribute("aria-pressed", String(node === button));
  });
  const evidence = document.querySelector("[data-skill-evidence]");
  const label = document.querySelector("[data-skill-evidence-label]");
  if (label) {
    if (button.hasAttribute("data-skill-learning"))
      label.textContent = language === "zh" ? "學習紀錄" : "Learning record";
    else
      label.textContent = language === "zh" ? "使用於" : englishCopy.skillEvidenceLabel;
  }
  if (evidence)
    evidence.textContent =
      language === "zh"
        ? button.dataset.skillProjectZh
        : button.dataset.skillProject;
}
document.querySelectorAll("[data-skill-project]").forEach((button) => {
  button.setAttribute("aria-pressed", "false");
  ["pointerenter", "focus", "click"].forEach((event) =>
    button.addEventListener(event, () => showSkill(button)),
  );
});

// Clearly simulated API walkthrough. It never requests microphone or network access.
const prototypeButton = document.querySelector("[data-prototype-start]");
function updatePrototypeStatus() {
  const status = document.querySelector("[data-prototype-status]");
  if (!status) return;
  status.textContent =
    prototypeState === "running"
      ? language === "zh"
        ? "正在示範語音到停車資料的流程…"
        : englishCopy.prototypeRunning
      : prototypeState === "complete"
        ? language === "zh"
          ? "示意完成：整理停車資訊，再回覆使用者（非即時資料）"
          : englishCopy.prototypeComplete
        : "";
}
prototypeButton?.addEventListener("click", async () => {
  const run = ++prototypeRun;
  const nodes = [...document.querySelectorAll("[data-prototype-node]")];
  nodes.forEach((node) => node.classList.remove("is-active"));
  prototypeButton.disabled = true;
  prototypeButton.setAttribute("aria-busy", "true");
  prototypeState = "running";
  updatePrototypeStatus();
  for (const node of nodes) {
    if (!reducedMotion.matches)
      await new Promise((resolve) => setTimeout(resolve, 260));
    if (run !== prototypeRun) return;
    node.classList.add("is-active");
  }
  prototypeButton.disabled = false;
  prototypeButton.removeAttribute("aria-busy");
  prototypeState = "complete";
  updatePrototypeStatus();
});

// Reveal only supporting visuals; reading never depends on an observer firing.
if (!reducedMotion.matches && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.removeAttribute("data-reveal-pending");
        observer.unobserve(entry.target);
      }),
    { threshold: 0.08 },
  );
  document
    .querySelectorAll("figure.reveal, .browser-preview")
    .forEach((node) => {
      if (node.getBoundingClientRect().top < innerHeight) return;
      node.setAttribute("data-reveal-pending", "");
      observer.observe(node);
    });
}

// Keep the glass highlight restrained, and avoid hover motion on touch/reduced-motion devices.
const header = document.querySelector(".site-header");
if (header && matchMedia("(pointer: fine)").matches && !reducedMotion.matches) {
  header.addEventListener("pointermove", (event) => {
    const box = header.getBoundingClientRect();
    header.style.setProperty("--glass-x", event.clientX - box.left + "px");
    header.style.setProperty("--glass-y", event.clientY - box.top + "px");
  });
}

const form = document.getElementById("contact-form");
if (form) {
  form.hidden = false;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const values = new FormData(form);
    const subject =
      form.querySelector('select[name="subject"] option:checked').textContent +
      " — " +
      values.get("name");
    const message =
      language === "zh"
        ? "你好 HongRong，\n\n" +
          values.get("message") +
          "\n\n聯絡人：" +
          values.get("name") +
          "\nEmail：" +
          values.get("email")
        : "Hi HongRong,\n\n" +
          values.get("message") +
          "\n\nFrom: " +
          values.get("name") +
          "\nEmail: " +
          values.get("email");
    location.href =
      "mailto:zxc1031777@gmail.com?subject=" +
      encodeURIComponent(subject) +
      "&body=" +
      encodeURIComponent(message);
  });
}
document.querySelectorAll(".current-year").forEach((node) => {
  node.textContent = String(new Date().getFullYear());
});

initBotanicalGrowth();
initPortraitFlip();
applyLanguage(storage.get() || "zh", { restore: false });
initScenes();
initLandscape();
initCarousel();
setAiState(0);
updateScrollState();

// BFCache restores real documents, including DOM classes. Always release transient UI.
window.addEventListener("pageshow", (event) => {
  if (!event.persisted) return;
  resetPortrait();
  finishOpening();
  body.classList.remove("page-leaving", "opening-active");
  setMenu(false);
  void refreshLayout();
});
window.addEventListener("pagehide", () => {
  resetPortrait();
  finishOpening();
  cancelLayoutRestore();
  prototypeRun += 1;
  prototypeState = "idle";
  updatePrototypeStatus();
  document.querySelectorAll("[data-prototype-node]").forEach((node) =>
    node.classList.remove("is-active"),
  );
  if (prototypeButton) {
    prototypeButton.disabled = false;
    prototypeButton.removeAttribute("aria-busy");
  }
  body.classList.remove("page-leaving", "opening-active");
});

function createOpeningTimeline(opening, mark, onComplete) {
  const letters = [...mark.querySelectorAll("[data-opening-letter]")];
  const targets = letters.length ? letters : [mark];
  return window.gsap
    .timeline({ onComplete })
    .fromTo(
      targets,
      { opacity: 0, y: 5, filter: "blur(10px)" },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.45,
        stagger: { each: 0.025, from: "start" },
        ease: "power2.out",
      },
      0,
    )
    .to(
      targets,
      {
        opacity: 0,
        x: -1,
        filter: "blur(14px)",
        duration: 0.7,
        stagger: { each: 0.045, from: "end" },
        ease: "power2.inOut",
      },
      0.95,
    )
    .to(
      opening,
      { yPercent: -100, duration: 0.65, ease: "power2.inOut" },
      1.85,
    );
}

function releaseOpeningGate() {
  root.classList.remove("opening-pending");
  clearTimeout(window.hongrongOpeningFallback);
}

async function startOpening() {
  const opening = document.querySelector("[data-opening]");
  const navigation = performance.getEntriesByType("navigation")[0];
  let seen = false;
  try {
    seen = sessionStorage.getItem("hongrong-opening-2-5s") === "seen";
  } catch { /* Storage is optional. */ }
  const skip =
    !opening ||
    seen ||
    window.hongrongOpeningExpired ||
    !window.gsap ||
    reducedMotion.matches ||
    navigation?.type === "back_forward" ||
    (location.hash && location.hash !== "#top");
  if (skip) {
    releaseOpeningGate();
    if (opening) opening.hidden = true;
    await refreshLayout();
    if (location.hash) goToHash(location.hash);
    return;
  }
  // Establish the curtain before waiting for fonts or a layout frame.
  body.classList.add("opening-active");
  releaseOpeningGate();
  let finished = false;
  let failsafe = 0;
  const finish = () => {
    if (finished) return;
    finished = true;
    clearTimeout(failsafe);
    body.classList.remove("opening-active");
    opening.hidden = true;
    openingAnimation?.kill();
    openingAnimation = null;
  };
  finishOpening = finish;
  failsafe = setTimeout(finish, 5000);
  // Fonts/layout can settle behind the opaque curtain without delaying its wordmark.
  void refreshLayout().catch(finish);
  try {
    sessionStorage.setItem("hongrong-opening-2-5s", "seen");
  } catch { /* Storage is optional. */ }
  const mark = opening.querySelector("[data-opening-mark]");
  try {
    openingAnimation = createOpeningTimeline(opening, mark, () => {
      clearTimeout(failsafe);
      finish();
    });
  } catch {
    clearTimeout(failsafe);
    finish();
  }
}
void startOpening();
