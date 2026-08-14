// Scroll position is the point of view: as the visitor scrolls down, they
// descend through six realms of the pantheon. window.scrollY / innerHeight
// (not IntersectionObserver) drives which realm is "active" — a single,
// simple calculation that works the same in a real browser (recomputed on
// resize) and under a test runner with no real layout engine.
const REALMS = [
  "The Heavens",
  "Sea & Harvest",
  "Wisdom & War",
  "Forge & Love",
  "Light & Wild",
  "Roads & Revelry",
];

const sections = Array.from(document.querySelectorAll(".realm"));
const indicator = document.querySelector('[data-testid="interaction"]');
const numberEl = indicator.querySelector('[data-role="realm-number"]');
const nameEl = indicator.querySelector('[data-role="realm-name"]');

let sectionPx = window.innerHeight * 0.9;

function activeIndex() {
  const raw = Math.floor(window.scrollY / sectionPx);
  return Math.min(REALMS.length - 1, Math.max(0, raw));
}

function updateActive() {
  const idx = activeIndex();
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
