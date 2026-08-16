# A Scroll-Descent Through the Twelve Olympians

A single-page, scroll-driven journey through nine realms of Greek & Roman
myth — from Olympus down to the Underworld — where thirteen gods and
goddesses appear as large character portraits along the way. There's no
navigation and no separate pages: the whole experience is one continuous
page, and how far down it you've scrolled is the content.

Live at:
<https://comp4020-agentic-coding-studio.github.io/comp4020-ass1-mayRhee218/>

## How to interact with it

The site has exactly two interactions, both discoverable without instructions:

**Scroll down.** This is the primary interaction. As you scroll:

- A small indicator pill at the top of the page (`1/9 Olympus & Sky`, `2/9
  Sun & Moon`, …) updates live to show which of the nine realms you're
  currently passing through.
- Each realm's background parallaxes at its own pace as you move through it.
- Each god's portrait fades in and rises into place once its realm becomes
  active, then floats gently in place — nothing is fully visible on first
  load; it arrives as you scroll down to it.

**Hover — or tab to — a god's portrait.** Every god is keyboard-focusable as
well as mouse-hoverable. Hovering a god with the mouse, or reaching them with
<kbd>Tab</kbd>, reveals that god's longer story beneath their name and
domain — hidden by default, so the page stays uncluttered until you actually
engage with a character. Moving the mouse away, or tabbing past, closes it
again.

## The nine realms

| # | Realm | Gods |
|---|---|---|
| 1 | Olympus & Sky | Zeus, Hera |
| 2 | Sun & Moon | Apollo, Artemis |
| 3 | Between Realms | Hermes |
| 4 | Human World & War | Athena, Ares |
| 5 | Earth & Harvest | Demeter, Dionysus |
| 6 | Underground Fire | Hephaestus |
| 7 | The Sea | Poseidon, Aphrodite |
| 8 | Deep Sea | — (atmospheric transition) |
| 9 | The Underworld | Hades |

Character artwork is finished PNG illustration (`characters/*.png`), not
hand-drawn SVG — the site's job is to position, scale, and animate that
artwork, not redraw it. See [`reflections/reflections.md`](reflections/reflections.md)
for why, and [`CLAUDE.md`](CLAUDE.md) for the resulting non-negotiable rules.

---

## About the template this was built from

This project started from the COMP4020 / COMP8020 Agentic Coding Studio's
static-site starter template, kept in its **bare** form (plain HTML/CSS/JS, no
bundler, no framework) rather than switching to a generator. The sections
below are the template's own documentation, describing the tooling and CI this
repo still uses.

## CI and Pages only turn on when you ship

Your repo starts private, and both CI jobs (`check` and `deploy`) are gated on
it being public. While private, a push to `main` runs nothing in CI ---
`pnpm check` (below) is your feedback loop until then. When you're ready, the
course's `/ship` skill flips the repo public, turns on GitHub Pages, and
dispatches the deploy for you; there's nothing to configure in the Pages
settings yourself. From that point, every push to `main` builds and deploys, and
the deploy step prints your live URL and checks it returns 200.

## What gets marked

The deployed site is the deliverable, assessed live in Chrome at two fixed
viewports --- see the course website's
[assessment page](https://comp.anu.edu.au/courses/comp4020-agentic-coding-studio/topics/assessment/#marking-environment)
for the details.

## Quick start

```sh
mise install       # supported path: install the template's Node and pnpm
pnpm install
pnpm dev        # local dev server
pnpm check      # most of what CI runs (links, secrets, evidence and deploy are CI-only)
pnpm build      # produce dist/ (what gets deployed)
pnpm dlx linkinator ./dist --silent   # reproduce CI's links check before you push
```

`mise` is the course's recommended runtime manager. If you use another manager
or the official installers, that is fine: provide the Node and pnpm versions in
`mise.toml`, then run the same commands. Tutor support reproduces runtime
problems with mise.

## What's here

- `index.html`, `styles.css`, `main.js` --- the site itself (kept as plain JS,
  the template's "bare" option, rather than the default TypeScript/Vite path).
- `mise.toml` --- the tested Node and pnpm versions for this template.
- `spec/` --- what the checks are for (`README.md`), the shipped invariants
  (`invariants.test.ts`), and a replaceable starter test (`starter.test.ts`);
  your own spec tests live alongside them.
- `CLAUDE.md` --- orients your coding agent: what the checks mean and how to
  work here. Yours to grow.
- `PROCESS.md` --- a template for your process overview, showing the
  cited-moment format. Replace it with your own; `pnpm check:evidence` verifies
  your citations resolve.
- `.github/workflows/checks.yml` --- the CI sensors that run on every push once
  your repo is public, and the GitHub Pages deploy.
- `.githooks/pre-commit` --- blocks any commit that contains something shaped
  like an API key, so your COMP4020 key can't end up in a public repo. Installed
  automatically by `pnpm install`.

This template is SSG-agnostic: it's plain HTML/CSS/TypeScript on Vite, so you
can add Astro, Eleventy, or any static generator later without changing how it
deploys. TypeScript is the course default over plain JavaScript: the types are
extra backpressure, and your agent feels it before you do.

See the course site for how the checks map to each week of the course.
