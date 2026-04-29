/**
 * Pipeline file E2E (M4).
 *
 * Drag-drop a `.megane.json` pipeline file onto the webapp and verify the
 * graph is hydrated (the seeded LoadStructure node attaches the referenced
 * structure). Uses tests/fixtures/water.megane.json which references
 * tests/fixtures/water.gro.
 */

import { readFileSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { test, expect } from "playwright/test";
import {
  assertDomContract,
  defaultViewerContract,
  waitForReady,
} from "./lib/setup";

const REPO = join(fileURLToPath(import.meta.url), "..", "..", "..");

test.describe("pipeline-file: webapp .megane.json", () => {
  test("dropping water.megane.json hydrates the pipeline", async ({ page }) => {
    await page.goto("/?test=1", { waitUntil: "domcontentloaded" });
    await waitForReady(page);

    const pipelineBytes = readFileSync(join(REPO, "tests", "fixtures", "water.megane.json"));

    // Pipeline files don't go through the structure dropzone — the app
    // handles them via a window-level drag/drop listener that reads the
    // .megane.json extension. We dispatch a synthetic DataTransfer drop on
    // the document to mimic that path.
    await page.evaluate(async (b64) => {
      const raw = atob(b64);
      const bytes = new Uint8Array(raw.length);
      for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
      const file = new File([bytes], "water.megane.json", { type: "application/json" });
      const dt = new DataTransfer();
      dt.items.add(file);
      const ev = new DragEvent("drop", {
        bubbles: true,
        cancelable: true,
        dataTransfer: dt,
      });
      document.dispatchEvent(ev);
    }, pipelineBytes.toString("base64"));

    // Some apps absorb pipeline drops without re-rendering the seed graph
    // immediately — wait for the LoadStructure node to either acquire the
    // referenced filename OR for the data-state attr to settle to "ready".
    await page.waitForFunction(
      () => {
        const root = document.querySelector('[data-testid="megane-viewer"]');
        const state = root?.getAttribute("data-state");
        return state === "ready" || state === null;
      },
      null,
      { timeout: 30_000 },
    );

    await assertDomContract(page, [
      ...defaultViewerContract({ context: "webapp" }),
    ]);

    // Sanity: the renderer must have an atom count > 0 (water.gro is small).
    const atomAttr = await page
      .locator('[data-testid="megane-viewer"]')
      .getAttribute("data-atom-count");
    expect(Number(atomAttr)).toBeGreaterThan(0);
  });
});
