import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { JSDOM } from "jsdom";
import { describe, expect, it } from "vitest";

// Assignment 1's spec: "the visitor does something that changes what they
// see — state the core interaction plainly enough to write a test for it."
// The mechanic here is scroll: window.scrollY drives which realm is active
// (see main.js). This asserts the contract — scrolling changes the rendered
// state — not the implementation. Runs against the built site with scripts
// executing, so it checks what a visitor gets, not what the source claims.
describe("assignment-1: core interaction", () => {
  it("changes what the visitor sees when they scroll", async () => {
    const distDir = resolve("dist");
    const distPath = resolve(distDir, "index.html");
    const html = readFileSync(distPath, "utf8");

    const dom = new JSDOM(html, {
      runScripts: "dangerously",
      resources: "usable",
      url: `file://${distDir}/`,
      pretendToBeVisual: true,
    });

    await new Promise<void>((done) => {
      dom.window.addEventListener("load", () => done());
    });

    const { document, Event } = dom.window;

    const indicator = document.querySelector('[data-testid="interaction"]');
    expect(
      indicator,
      'No element tagged data-testid="interaction". Tag whatever tracks scroll progress with it so this test can find it.',
    ).toBeTruthy();

    const before = indicator!.textContent;

    // Scroll deep enough to land on a later realm regardless of the exact
    // per-realm height, then let the page's own scroll handler react.
    Object.defineProperty(dom.window, "scrollY", {
      value: dom.window.innerHeight * 5,
      configurable: true,
    });
    dom.window.dispatchEvent(new Event("scroll"));

    const after = indicator!.textContent;

    expect(
      after,
      "Scrolling didn't change the realm indicator. The brief asks for a real state-changing interaction — wire the scroll handler up to something visible.",
    ).not.toBe(before);
  });

  // Secondary interaction: each god card reveals a longer story on hover.
  // Dispatching mouseenter/mouseleave and focusin/focusout directly on the
  // card (rather than relying on CSS :hover, which jsdom can't simulate from
  // dispatched events) checks the same contract a mouse user and a keyboard
  // user each rely on: pointing at or tabbing to a card reveals its story.
  it("reveals a god's longer story on hover, and on keyboard focus", async () => {
    const distDir = resolve("dist");
    const distPath = resolve(distDir, "index.html");
    const html = readFileSync(distPath, "utf8");

    const dom = new JSDOM(html, {
      runScripts: "dangerously",
      resources: "usable",
      url: `file://${distDir}/`,
      pretendToBeVisual: true,
    });

    await new Promise<void>((done) => {
      dom.window.addEventListener("load", () => done());
    });

    const { document, Event } = dom.window;

    const card = document.querySelector('[data-testid="god-card"]');
    expect(
      card,
      'No element tagged data-testid="god-card". Tag each god card with it so this test can find one.',
    ).toBeTruthy();

    const story = card!.querySelector(".god-story");
    expect(
      story,
      "Each god card needs a .god-story element holding the longer, hidden-until-revealed story text.",
    ).toBeTruthy();

    expect(
      (story as HTMLElement).hidden,
      "The story should start hidden, before the visitor hovers or focuses the card.",
    ).toBe(true);

    card!.dispatchEvent(new Event("mouseenter"));
    expect(
      (story as HTMLElement).hidden,
      "Hovering the card didn't reveal its story.",
    ).toBe(false);

    card!.dispatchEvent(new Event("mouseleave"));
    expect(
      (story as HTMLElement).hidden,
      "The story should hide again once the pointer leaves the card.",
    ).toBe(true);

    // A visitor who can't hover (keyboard, switch access) needs the same
    // reveal from focus alone.
    card!.dispatchEvent(new Event("focusin"));
    expect(
      (story as HTMLElement).hidden,
      "Focusing the card (as a keyboard user tabbing through the page would) didn't reveal its story.",
    ).toBe(false);

    card!.dispatchEvent(new Event("focusout"));
    expect(
      (story as HTMLElement).hidden,
      "The story should hide again once focus moves away from the card.",
    ).toBe(true);
  });
});
