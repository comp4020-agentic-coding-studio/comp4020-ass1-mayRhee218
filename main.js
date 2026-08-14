// Your prototype's JS goes here. This file exists so the lint sensor has
// something to check from day one. This week's stack is bare — no bundler,
// so this ships to the browser exactly as written.
const intro = document.querySelector('[data-testid="intro"]');
if (intro) {
  intro.dataset.ready = "true";
}
