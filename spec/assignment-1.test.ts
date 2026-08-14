import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { JSDOM } from "jsdom";
import { describe, expect, it } from "vitest";

// Assignment 1's spec: "the visitor does something that changes what they
// see — state the core interaction plainly enough to write a test for it."
// This asserts the contract, not the mechanism: tag your core interactive
// control with data-testid="interaction" (any element, any event you like —
// this dispatches a click) and this checks the page's rendered state
// actually moves. Runs against the built site with scripts executing, so it
// checks what a visitor gets, not what the source claims.
describe("assignment-1: core interaction", () => {
  it("changes what the visitor sees when they use it", async () => {
    const distDir = resolve("dist");
    const distPath = resolve(distDir, "index.html");
    const html = readFileSync(distPath, "utf8");

    const dom = new JSDOM(html, {
      runScripts: "dangerously",
      resources: "usable",
      url: `file://${distDir}/`,
    });

    await new Promise<void>((done) => {
      dom.window.addEventListener("load", () => done());
    });

    const { document, Event } = dom.window;

    const control = document.querySelector('[data-testid="interaction"]');
    expect(
      control,
      'No element tagged data-testid="interaction". Tag your core interactive control with it so this test can find it.',
    ).toBeTruthy();

    const before = document.body.innerHTML;
    control!.dispatchEvent(new Event("click", { bubbles: true }));
    const after = document.body.innerHTML;

    expect(
      after,
      "Clicking the core control didn't change the page. The brief asks for a real state-changing interaction — wire one up.",
    ).not.toBe(before);
  });
});
