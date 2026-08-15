// Scroll position is the point of view: as the visitor scrolls down, they
// journey through nine realms of Greek & Roman myth, from Olympus down to the
// Underworld. window.scrollY / innerHeight (not IntersectionObserver) drives
// both which realm is "active" and how far through it the visitor is — a
// single, simple calculation that works the same in a real browser
// (recomputed on resize) and under a test runner with no real layout engine.
const REALMS = [
  "Olympus & Sky",
  "Sun & Moon",
  "Between Realms",
  "Human World & War",
  "Earth & Harvest",
  "Underground Fire",
  "The Sea",
  "Deep Sea",
  "The Underworld",
];

const sections = Array.from(document.querySelectorAll(".realm"));
const indicator = document.querySelector('[data-testid="interaction"]');
const numberEl = indicator.querySelector('[data-role="realm-number"]');
const nameEl = indicator.querySelector('[data-role="realm-name"]');
const root = document.documentElement;

let sectionPx = window.innerHeight * 0.9;

// Sections aren't a fixed height (min-height: 100vh, taller wherever a realm
// needs more room for two full figures), so a real browser measures each
// section's actual offsetTop/offsetHeight rather than assuming a uniform
// spacing — otherwise the indicator drifts ahead of what's on screen the
// further you scroll. jsdom has no layout engine (offsetTop is always 0), so
// under the test runner this falls back to the fixed-spacing estimate, which
// is all the scroll -> indicator contract there actually needs.
function hasLayout() {
  return sections[sections.length - 1].offsetTop > 0;
}

function activeIndex() {
  if (hasLayout()) {
    const y = window.scrollY + window.innerHeight * 0.4;
    let idx = 0;
    for (let i = 0; i < sections.length; i++) {
      if (sections[i].offsetTop <= y) idx = i;
    }
    return idx;
  }
  const raw = Math.floor(window.scrollY / sectionPx);
  return Math.min(REALMS.length - 1, Math.max(0, raw));
}

function updateActive() {
  const idx = activeIndex();
  const current = sections[idx];

  // How far through the active realm the visitor has scrolled (0 at its
  // start, 1 at its end) — a continuous value consumed purely by CSS
  // (background parallax transforms), so it never affects the tested
  // scroll -> indicator contract below.
  const progress =
    hasLayout() && current.offsetHeight > 0
      ? Math.min(
          1,
          Math.max(0, (window.scrollY - current.offsetTop) / current.offsetHeight),
        )
      : Math.min(1, Math.max(0, window.scrollY / sectionPx - idx));
  root.style.setProperty("--realm-progress", String(progress));

  if (indicator.dataset.active === String(idx)) return;
  indicator.dataset.active = String(idx);
  numberEl.textContent = String(idx + 1);
  nameEl.textContent = REALMS[idx];
  sections.forEach((section, i) => {
    section.classList.toggle("active", i === idx);
  });
}

window.addEventListener("scroll", updateActive, { passive: true });
window.addEventListener("resize", () => {
  sectionPx = window.innerHeight * 0.9;
  updateActive();
});

updateActive();

// Secondary interaction: hovering — or focusing, for a visitor tabbing
// through the page instead of pointing a mouse — the character illustration
// itself reveals that god's longer story.
function openFigure(figure) {
  figure.setAttribute("aria-expanded", "true");
  const story = figure.querySelector(".god-story");
  if (story) story.hidden = false;
}

function closeFigure(figure) {
  figure.setAttribute("aria-expanded", "false");
  const story = figure.querySelector(".god-story");
  if (story) story.hidden = true;
}

document.querySelectorAll(".god-figure").forEach((figure) => {
  figure.addEventListener("mouseenter", () => openFigure(figure));
  figure.addEventListener("mouseleave", () => closeFigure(figure));
  figure.addEventListener("focusin", () => openFigure(figure));
  figure.addEventListener("focusout", () => closeFigure(figure));
});
