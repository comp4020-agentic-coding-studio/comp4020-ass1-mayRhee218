# Assignment 1 Reflection

## What was the breakthrough that moved the work forward?

The breakthrough wasn't a fix — it was a diagnosis. Two separate attempts at
drawing the gods in SVG failed
([`7651ad3`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-mayRhee218/commit/7651ad3),
[`b2c031e`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-mayRhee218/commit/b2c031e)),
and my first instinct after each was to add more detail: more anatomy, more
facial features, more fold-lines in the clothing. The second attempt did all
of that and still failed the same way the first one did — it still read as a
constructed shape, not an illustrated person. That repeat failure is what
surfaced the real problem: I'd been treating "draw a better SVG" as a
retry loop, when the actual issue was a category error — illustrating a
convincing human figure is an image-generation task, not a markup-
construction one, and no amount of iteration inside SVG was going to close
that gap. Once I named it that way, the fix was obvious: generate the
character art as finished PNGs and have the website's job be displaying and
animating that artwork, not drawing it ([`36ca224`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-mayRhee218/commit/36ca224)).

## What did this work change about who I want to be as a software developer?

It changed how I read a second failed attempt. My default was to treat
"still not good enough" as "needs another pass," which just spent a whole
attempt confirming the same wrong hypothesis. I want to be the kind of
developer who, after one retry doesn't close the gap, stops and asks whether
the tool is wrong before asking whether the effort was. I also didn't want
that lesson to live only in my memory of this project — I wrote it into
`CLAUDE.md` as a standing, non-negotiable rule, so the next time I'm tempted
to "just redraw it in SVG," the harness itself stops me rather than relying
on me to remember.
