import { englishCopy } from "./copy.js";
import { createVine, progressBetween } from "./botanical.js";

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
const englishTitles = {
  "index.html": "HongRong — AI × Web × Product",
  "about.html": "About — HongRong",
  "work.html": "Selected work — HongRong",
  "ai-driving-assistant.html": "AI Driving Assistant — HongRong",
  "jinhong-foods.html": "Jinhong Foods — HongRong",
  "contact.html": "Contact — HongRong",
};
let sceneTimeline = null;
const scenePacing = { aboutIn: 0.12, about: 1.4, workIn: 2.1, work: 3.4 };
let refreshRevision = 0;
let scrollFrame = 0;
let prototypeRun = 0;
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
    ...document.querySelectorAll("main > section, main > div, footer"),
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
  const trigger = sceneTimeline?.scrollTrigger;
  if (!trigger) return;
  trigger.getTween()?.progress(1);
  sceneTimeline.progress(trigger.progress);
  updateSceneAccess();
}
["wheel", "touchstart", "pointerdown"].forEach((type) =>
  window.addEventListener(
    type,
    () => {
      refreshRevision += 1;
    },
    { passive: true },
  ),
);

function applyLanguage(next, { persist = false, restore = true } = {}) {
  const position = restore ? capturePosition() : null;
  language = next === "en" ? "en" : "zh";
  root.lang = language === "zh" ? "zh-Hant" : "en";
  body.dataset.lang = language;
  document.title =
    language === "zh"
      ? chineseTitle
      : englishTitles[location.pathname.split("/").pop() || "index.html"] ||
        chineseTitle;
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
  if (persist) storage.set(language);
  if (restore) void refreshLayout(position);
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
  refreshRevision += 1;
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
    if (body.dataset.page === "home") {
      if (location.hash !== "#top") history.pushState(null, "", "#top");
    }
    scrollToPosition(0, true);
  }),
);

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
    const timeline = gsap.timeline({
      defaults: { ease: "none" },
      onUpdate() {
        if (sceneTimeline !== this) return;
        updateSceneAccess();
        requestScrollState();
      },
      scrollTrigger: {
        trigger: sequence,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.8,
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
        about.querySelector("[data-about-text-effect]"),
        { "--about-text-progress": "0%" },
        {
          "--about-text-progress": "100%",
          duration: 0.85,
          immediateRender: false,
        },
        0.65,
      )
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
    : 0.06 + 0.94 * progressBetween(innerHeight * 0.5, first, last);
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
function updateScrollState() {
  scrollFrame = 0;
  document
    .querySelector(".site-header")
    ?.classList.toggle("is-scrolled", scrollY > 18);
  updateAiStory();
  updateNavigation();
  updateBotanicalGrowth();
}

// Decorative enhancement shares the existing scroll frame and follows progress in both directions.
function initBotanicalGrowth() {
  for (const [selector, variant] of [
    [".hero-visual", "portrait"],
    [".about-scene", "edge"],
    [".work-scene", "transition"],
    [".jinhong-editorial", "transition"],
    [".page-hero", "edge"],
    [".case-hero", "edge"],
    [".contact-main", "edge"],
  ]) {
    document.querySelectorAll(selector).forEach((region) => {
      region.classList.add("botanical-region");
      const vine = createVine(variant, botanicalVines.length);
      region.append(vine);
      const scene = region.closest("[data-scene-panel]")?.dataset.scenePanel;
      botanicalVines.push({ region, vine, scene, progress: -1 });
    });
  }
}
function updateBotanicalGrowth() {
  const updates = botanicalVines.map((item) => {
    let progress;
    if (reducedMotion.matches) progress = 1;
    else if (sceneTimeline && item.scene) {
      const time = sceneTimeline.time();
      const range =
        item.scene === "hero"
          ? [0, 0.95]
          : item.scene === "about"
            ? [scenePacing.aboutIn + 0.1, scenePacing.about + 0.4]
            : [scenePacing.workIn, scenePacing.work + 0.1];
      progress = progressBetween(time, ...range);
      if (item.scene === "hero") progress = 0.26 + progress * 0.74;
    } else {
      const box = item.region.getBoundingClientRect();
      const travel = Math.min(box.height * 0.8, innerHeight * 0.95);
      progress = progressBetween(innerHeight * 0.92 - box.top, 0, travel);
    }
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
  let flipped = false;
  const setFlipped = (next) => {
    flipped = next;
    button.classList.toggle("is-flipped", flipped);
    button.closest(".hero-visual").classList.toggle("is-portrait-flipped", flipped);
    button.setAttribute("aria-pressed", String(flipped));
    front.setAttribute("aria-hidden", String(flipped));
    back.setAttribute("aria-hidden", String(!flipped));
  };
  resetPortrait = () => setFlipped(false);
  button.disabled = false;
  document.getElementById("portrait-flip-hint").hidden = false;
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
prototypeButton?.addEventListener("click", async () => {
  const run = ++prototypeRun;
  const nodes = [...document.querySelectorAll("[data-prototype-node]")];
  const status = document.querySelector("[data-prototype-status]");
  nodes.forEach((node) => node.classList.remove("is-active"));
  prototypeButton.disabled = true;
  prototypeButton.setAttribute("aria-busy", "true");
  if (status)
    status.textContent =
      language === "zh"
        ? "正在示範語音到停車資料的流程…"
        : "Showing the request moving through the system…";
  for (const node of nodes) {
    if (!reducedMotion.matches)
      await new Promise((resolve) => setTimeout(resolve, 260));
    if (run !== prototypeRun) return;
    node.classList.add("is-active");
  }
  prototypeButton.disabled = false;
  prototypeButton.removeAttribute("aria-busy");
  if (status)
    status.textContent =
      language === "zh"
        ? "示意完成：整理停車資訊，再回覆使用者（非即時資料）"
        : "Walkthrough complete: parking information is prepared for the response. This is not live data.";
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
initCarousel();
setAiState(0);
updateScrollState();

// BFCache restores real documents, including DOM classes. Always release transient UI.
window.addEventListener("pageshow", (event) => {
  if (!event.persisted) return;
  resetPortrait();
  body.classList.remove("page-leaving", "opening-active");
  setMenu(false);
  void refreshLayout();
});
window.addEventListener("pagehide", () => {
  resetPortrait();
  refreshRevision += 1;
  prototypeRun += 1;
  if (prototypeButton) {
    prototypeButton.disabled = false;
    prototypeButton.removeAttribute("aria-busy");
  }
  body.classList.remove("page-leaving", "opening-active");
});

async function startOpening() {
  const opening = document.querySelector("[data-opening]");
  const navigation = performance.getEntriesByType("navigation")[0];
  const skip =
    !opening ||
    reducedMotion.matches ||
    navigation?.type === "back_forward" ||
    (location.hash && location.hash !== "#top");
  await refreshLayout();
  if (location.hash) goToHash(location.hash);
  if (skip || !window.gsap) {
    if (opening) opening.hidden = true;
    return;
  }
  let seen = false;
  try {
    seen = sessionStorage.getItem("hongrong-opening") === "seen";
    sessionStorage.setItem("hongrong-opening", "seen");
  } catch {
    /* Optional. */
  }
  // Revisiting the homepage shouldn't replay a blocking intro.
  if (seen) {
    opening.hidden = true;
    return;
  }
  const mark = opening.querySelector("[data-opening-mark]");
  body.classList.add("opening-active");
  const finish = () => {
    body.classList.remove("opening-active");
    opening.hidden = true;
  };
  const failsafe = setTimeout(finish, 4000);
  window.gsap
    .timeline({
      onComplete() {
        clearTimeout(failsafe);
        finish();
      },
    })
    .fromTo(
      mark,
      { opacity: 0, y: 12, filter: "blur(12px)" },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.95,
        ease: "power2.out",
      },
    )
    .to(
      mark,
      {
        opacity: 0,
        y: -8,
        filter: "blur(12px)",
        duration: 1.05,
        ease: "power2.inOut",
      },
      1.5,
    )
    .to(
      opening,
      { yPercent: -100, duration: 1.05, ease: "power2.inOut" },
      2.0,
    );
}
void startOpening();
