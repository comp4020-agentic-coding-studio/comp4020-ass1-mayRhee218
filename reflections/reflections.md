# Project Reflections

Development lessons from building this prototype — what was tried, what went
wrong, and what the project settled on. This is technical/process history for
future development on this repo, not the course's graded reflection (that's
`reflections/assignment-1.md`, which answers a different pair of prompts).

## Overview

The prototype is a scroll-driven journey through nine mythological "realms,"
each with one or two Greek gods rendered as large character illustrations.
The single hardest problem in building it was not the scroll mechanics or the
layout — it was how to represent the gods themselves. That problem went
through three distinct attempts before landing on the right answer, and the
gap between attempt 2 and the final approach is the most useful thing this
file can hand to whoever works on this next.

## Initial Approach

### SVG Character Icons

The first version represented each god as a hand-authored inline SVG:
simple geometric shapes — an oval head, a rectangular/tapered torso, thin
stroke-line limbs — colored per god with gradients and given a signature
prop (thunderbolt, trident, lyre, bow).

This was fast to build and easy to theme (every god could share the same
`viewBox` and a similar shape vocabulary), and it satisfied the mechanical
requirements: an `<svg role="img" aria-label="…">` per god, distinct colors,
distinct props.

It did not satisfy the actual goal. The result read as **icons and symbols**,
not characters — closer to a UI icon set (a settings gear, a user avatar)
than to an illustration of a person. A visitor could tell "this is the
lightning one" but not "this is a bearded king mid-stride." Commits
[`69ad51f`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-mayRhee218/commit/69ad51f),
[`7651ad3`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-mayRhee218/commit/7651ad3), and
[`d41cd04`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-mayRhee218/commit/d41cd04)
track this line of work — from flat silhouettes, to "full character
silhouettes," to gradient-shaded "multi-tone busts." Each pass added detail,
and none of it closed the gap.

## Second Approach

### SVG Human Character Construction

The next attempt treated the previous result as insufficiently detailed and
tried to fix that by making the SVG anatomy itself more sophisticated:
tapered filled limbs instead of strokes, a visible neck, hands with fingers,
volumetric hair shapes, drawn facial features (eyes, brows, a mouth), and
clothing with fold-lines to suggest draped fabric — all still hand-authored
`<path>` data, per god, at the same `viewBox` scale.

Committed as
[`b2c031e`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-mayRhee218/commit/b2c031e),
"Replace geometric god illustrations with illustrated human characters."

## What Went Wrong

More SVG complexity did not solve the underlying problem — it just moved the
same problem one level down. The characters still read as constructed
shapes rather than illustrated people:

- Anatomy was unconvincing even with tapered limbs and defined joints.
- Proportions were awkward — the kind of "almost right" that reads as wrong
  faster than something more abstract would.
- Poses looked stiff rather than dynamic, despite deliberate bend/angle
  choices in the paths.
- Faces built from a handful of primitive strokes and dots did not carry
  expression convincingly.
- Hands and limbs, the hardest parts of any figure to draw, were the
  weakest parts of the result.
- The overall effect still looked generic — a "person template" with
  per-god palette swapped in, not a distinct illustrated character.

The lesson from this attempt specifically: **the problem was never the
amount of SVG detail.** Adding more path data, more gradients, more anatomical
correctness-on-paper did not make the output look like professional character
art, because SVG path construction is the wrong tool for illustrating a
human figure with real anatomical and expressive nuance — no amount of
iteration inside that tool closes the gap to what an illustrator (human or
AI image model) produces.

## Final Approach

### AI-Generated PNG Character Assets

The project moved to using finished, AI-generated PNG character portraits —
one file per god, stored in `characters/` (`Zeus.png`, `Hera.png`,
`Apollo.png`, `Artemis.png`, `Hermes.png`, `Athena.png`, `Ares.png`,
`Demeter.png`, `Dionysus.png`, `Hephaestus.png`, `Poseidon.png`,
`Aphrodite.png`, `Hades.png`) — and rewrote the site to treat those files as
finished artwork to be displayed and animated, not redrawn.

```text
Character Artwork
        ↓
AI-generated PNG assets
        ↓
characters/*.png
        ↓
Website (<img>, CSS, main.js)
        ↓
Position / animate / scale / parallax
```

Concretely, every `<svg class="god-art">` block in `index.html` was replaced
with:

```html
<div class="god-portrait">
  <img
    class="god-art"
    src="./characters/Zeus.png"
    alt="Zeus, a bearded king mid-stride, silver hair and golden diadem, thunderbolt gripped overhead"
    loading="lazy"
    decoding="async"
  />
</div>
```

`styles.css` was updated to size the images as large, primary visual
elements (`object-fit: contain` inside a bounding box, rather than the
SVG-tuned `clamp()` width), and to add an idle float + scroll-tied
fade/rise animation on the wrapper, separate from the hover/focus scale on
the image itself — so the two animations never fight over one element's
`transform`.

This is the architecture the project settled on. It should not be revisited
in favor of a "better" hand-drawn SVG attempt — see `CLAUDE.md`'s
non-negotiable character asset rules.

## Key Technical Lesson

Character illustration — human anatomy, faces, expression, clothing that
drapes convincingly, a recognizable art style — is fundamentally an
**image-generation/illustration task**, not a **markup-construction task**.
SVG (and CSS) are excellent at precise, parametric, resolution-independent
shapes: icons, diagrams, charts, geometric backgrounds, simple silhouettes.
They are a poor fit for illustrating a convincing human figure, because that
requires exactly the kind of holistic, non-parametric visual judgment an
image model (or a human illustrator) applies, not shape composition.

No amount of additional SVG path complexity closes that gap — attempt 2
proved that empirically on this project, not just in theory.

## Key Design Lesson

"More detail" is not the same axis as "more convincing." Attempt 1 to
attempt 2 added real detail (fingers, necks, facial features, fabric folds)
and the result was still rejected — because the missing ingredient wasn't
detail, it was illustrative quality, which detail-within-the-same-technique
cannot manufacture.

## Separation of Responsibilities

The project's architecture now reflects a deliberate split:

**AI image generation** produces:

- character artwork
- human anatomy
- faces and expression
- clothing and costume detail
- overall visual character identity
- complex artistic/illustrated assets

**Claude / web development** produces:

- website structure and markup
- layout and responsive design
- scroll behavior and interaction
- animation and parallax
- background/environment styling
- typography
- asset integration (wiring the finished artwork into the page)
- accessibility and performance

Neither side should try to do the other's job: the web layer should not
attempt to illustrate a character, and the illustration should not need to
encode layout or interaction concerns.

## What We Would Do Differently From the Beginning

- Skip both SVG attempts and start from the PNG-based architecture directly
  once the requirement was "characters that look like actual gods, not
  icons." The two SVG attempts consumed real time before the underlying
  category error (illustration-as-markup) was identified.
- Decide up front which visual elements are illustration tasks (characters)
  versus which are legitimately code/CSS tasks (backgrounds, particles,
  layout, motion) — see `PROCESS.md`'s Stage 2 for the workflow this became.
- Treat "it still looks generic/iconic" feedback as a signal to change
  *technique*, not just to add more detail within the same technique.

## Lessons for Future Development

- If a future feature needs a new illustrated character (a new god, a new
  creature, a mascot), generate it as an image asset and drop it in
  `characters/` (or an equivalent asset directory) — do not hand-author it
  in SVG or CSS, even as a "quick placeholder." Placeholders in this
  category have a way of becoming load-bearing.
- Reserve SVG for what it's actually good at in this project: realm
  background shapes, particles, simple icons, and the parallax layers —
  not human figures.
- When a character looks wrong, check the image asset first before touching
  CSS or markup (see `PROCESS.md`'s iteration guidance) — most "character
  looks bad" problems are illustration problems, not layout problems, and
  vice versa.
