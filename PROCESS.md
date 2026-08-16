# Process overview

A reading-guide to how the work came together, and (below the divider) a
practical development workflow for this project going forward. The two
halves have different jobs: this first half is the cited, evidence-checked
overview `pnpm check:evidence` verifies (real commit citations, no template
boilerplate); the second half, "Development Workflow," is a how-we-work guide
for whoever — human or agent — touches this repo next.

## What I built

A single-page, vertical-scroll journey through nine realms of Greek & Roman
myth (Olympus down to the Underworld), each realm rendering one or two gods
as large character illustrations against an animated background. Scroll
position drives a realm indicator and per-realm parallax; hovering or
focusing a god reveals their longer story. The whole prototype is bare
HTML/CSS/JS with no bundler or framework.

## The moments that mattered

1. **The first character pass read as icons, not gods.** Each god was a
   hand-authored inline SVG — an oval head, a tapered torso, stroke-line
   limbs, a signature prop — themed per god with gradients
   ([`7651ad3`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-mayRhee218/commit/7651ad3),
   [`d41cd04`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-mayRhee218/commit/d41cd04)).
   It satisfied every mechanical requirement (one `<svg role="img"
   aria-label="…">` per god, distinct color, distinct prop) and still looked
   like a settings-gear-style icon set rather than an illustration of a
   person. That gap — mechanically correct, visually wrong — is what the
   rest of the character work was about closing.

2. **Adding SVG anatomy detail didn't close the gap — it just moved it.**
   The obvious next move was more detail: tapered filled limbs instead of
   strokes, a visible neck, hands with fingers, drawn facial features,
   fold-lined clothing
   ([`b2c031e`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-mayRhee218/commit/b2c031e)).
   I checked this against the same bar as the first attempt — does it read
   as a person, not a shape — and it still failed: unconvincing anatomy,
   stiff poses, generic faces. That result is what told me the problem
   wasn't *how much* SVG detail, it was that SVG path construction is the
   wrong tool for illustrating a convincing human figure at all, however much
   detail is added.

3. **The fix was to change tools, not to iterate again.** Instead of a third
   SVG attempt, every `<svg class="god-art">` was replaced with an `<img>`
   pointing at a finished, AI-generated PNG portrait per god
   ([`36ca224`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-mayRhee218/commit/36ca224)),
   with `styles.css` rewritten to size and animate the images as large
   primary elements rather than small icons. I verified this with Playwright
   screenshots at both marking viewports (1920×1080 and 390×844) across all
   13 gods, confirming the artwork rendered at full quality, uncropped, with
   its transparent background intact, before treating the swap as done.
   `reflections/reflections.md` has the full before/after.

## Before you ship

`pnpm check:evidence` verifies the citations above resolve to real commits in
this repo, that the current deliverable's exact reflection is in
`reflections/`, and that `CLAUDE.md` is present. It checks that the map is
traceable, not that it's good — read this file on GitHub before shipping and
confirm it still says something true.

---

# Development Workflow

How to develop this project going forward — distinct from the historical,
cited overview above. This section isn't evidence-checked; it's the practical
process for the next round of work on this repo.

## Stage 1 — Understand the visual goal

Before implementing anything new, be clear on:

- overall visual direction (immersive scroll journey, not a dashboard)
- character style (see `characters/*.png` — match that art style if adding a
  new character, don't invent a different one)
- environmental style (per-realm gradient backgrounds + CSS particles)
- scroll narrative (9 realms, Olympus → Underworld, one scroll-driven pass)
- realm hierarchy (see Realm Order below and in `CLAUDE.md`)
- animation philosophy (subtle, restrained, scroll-tied, motion-reduced
  friendly — see `CLAUDE.md`'s Animation Principles)
- responsive behavior (must work at 1920×1080 and 390×844, the two marking
  viewports)

Don't start implementing visual assets before this is settled — it's cheaper
to decide up front than to redo an asset after it's wired into the page.

## Stage 2 — Identify which assets require image generation

Classify each new visual element before building it:

```text
Greek god/goddess character
        ↓
Generate artwork externally (AI image generation)
        ↓
PNG
        ↓
characters/
```

Character artwork is always an image-generation task. Do not attempt to
reproduce detailed human character artwork with SVG or CSS — see
`reflections/reflections.md` for why two attempts at that failed on this project, and
`CLAUDE.md`'s Non-Negotiable Rules.

Backgrounds, particles, layout, and simple decorative shapes remain
legitimate CSS/SVG work — the classification is per-asset, not "no SVG
anywhere."

## Stage 3 — Establish the asset structure

Character assets live in `characters/` at the repo root, one PNG per god,
named for the god (`Zeus.png`, `Hera.png`, …) — see `CLAUDE.md`'s Character
Asset System for the full current list. `scripts/build.ts` copies this
directory into `dist/` untouched; it is not in the build's `SKIP` list.

## Stage 4 — Implement the website around the assets

Once a character asset exists, integrate it in this order:

1. Page structure (which realm/section it belongs in)
2. Background environment for that realm
3. Character placement (the `.god-portrait > img.god-art` pattern —
   see `CLAUDE.md`'s Component Architecture)
4. Scroll behavior (does it need new realm-indicator wiring in `main.js`?)
5. Character animation (idle float, hover/focus scale)
6. Parallax (background depth layers, if the realm needs them)
7. Transitions (fade/rise tied to `.realm.active`)
8. Typography (name/domain/story text)
9. Responsive behavior (check both marking viewports)
10. Performance (`loading="lazy"`, `decoding="async"` on the image)
11. Accessibility (`alt` text, `tabindex`, `aria-expanded`, focus-visible)

## Stage 5 — Validate visually

After implementing, actually look at the result — don't rely on `pnpm check`
passing as proof the page looks right; it only proves the DOM contract and
lint rules hold. Check:

- Does the character match the supplied artwork (not a redrawn/simplified
  version)?
- Is the character large enough to be a primary visual element?
- Does it sit naturally in its environment, not overlapping text awkwardly?
- Is the artwork being distorted, stretched, or cropped unexpectedly?
- Are proportions preserved (`object-fit: contain`, not `cover`/`fill`)?
- Does the scroll transition feel natural, not jarring?
- Is the background overpowering the character, or vice versa?
- Is the text hierarchy (name → domain → story) still clear?
- Does the mobile layout (390×844) hold up, not just desktop (1920×1080)?
- Are there unexpected crops or overlaps at either viewport?

Take Playwright (or equivalent) screenshots at both marking viewports as part
of this — a passing test suite and an actually-inspected screenshot are
different kinds of evidence.

## Stage 6 — Iterate

When something looks wrong, first identify which layer is responsible before
changing anything:

```text
Character looks wrong (anatomy, face, style)
→ Check the image asset first. Regenerate/replace the PNG — don't patch it
  with CSS or redraw it in SVG.

Character looks correct but is badly positioned
→ Fix CSS/layout (.god-portrait / .god-art sizing, .realm-gods layout).

Character movement feels wrong
→ Fix animation/scroll logic (main.js, @keyframes god-float, the
  .realm.active transition).

Background feels wrong
→ Fix environment/background (.realm-bg, .realm-art, particles).

Overall composition feels wrong
→ Fix section layout (.realm, .realm-content, .realm-gods).
```

Do not solve a website-layout problem by modifying the original character
artwork. Do not solve a character-art problem with CSS. Keep these
responsibilities separated — this project spent two full attempts blurring
exactly this line before separating them (see `reflections/reflections.md`).

## Do Not Repeat

- Do not use SVG icons as substitutes for character artwork.
- Do not manually construct detailed human characters from SVG primitives.
- Do not use CSS shapes to create the gods and goddesses.
- Do not replace detailed character artwork with generic avatars.
- Do not ask the web implementation layer to solve an illustration problem.
- Do not modify finished character artwork merely to solve positioning
  problems — fix the CSS/layout instead.
- Do not add a "quick placeholder" SVG for a new character "just for now" —
  see `reflections/reflections.md`'s "What We Would Do Differently" section on how those
  become load-bearing.
