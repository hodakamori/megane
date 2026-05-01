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
    const companionBytes = readFileSync(join(REPO, "tests", "fixtures", "water_wrapped.pdb"));

    // Pipeline files don't go through the structure dropzone — the app
    // handles them via the root <div>'s React drop handler. Dispatching on
    // `document` doesn't reach React's synthetic event system, so target
    // the megane-viewer testid (a child of the root) and let the event
    // bubble up. We pass the referenced structure file alongside so
    // openFile's companion path actually populates the LoadStructure node.
    await page.evaluate(
      async ({ pipeline, companion }) => {
        const decode = (b64: string) => {
          const raw = atob(b64);
          const bytes = new Uint8Array(raw.length);
          for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
          return bytes;
        };
        const pipelineFile = new File([decode(pipeline)], "water.megane.json", {
          type: "application/json",
        });
        const companionFile = new File([decode(companion)], "water_wrapped.pdb");
        const dt = new DataTransfer();
        dt.items.add(pipelineFile);
        dt.items.add(companionFile);
        const target =
          document.querySelector('[data-testid="megane-viewer"]') ?? document.body;
        const ev = new DragEvent("drop", {
          bubbles: true,
          cancelable: true,
          dataTransfer: dt,
        });
        target.dispatchEvent(ev);
      },
      {
        pipeline: pipelineBytes.toString("base64"),
        companion: companionBytes.toString("base64"),
      },
    );

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

    // Regression: deserialize must inject an AddBond node when the saved
    // graph lacks one (water.megane.json is the canonical broken fixture —
    // it wires LoadStructure.particle straight to Viewport.particle). The
    // resulting graph should render with a non-zero bond count.
    const addBondCount = await page
      .locator('[data-testid="pipeline-node-add_bond"]')
      .count();
    expect(addBondCount, "AddBond node must be present after open").toBeGreaterThanOrEqual(1);

    const bondAttr = await page
      .locator('[data-testid="megane-viewer"]')
      .getAttribute("data-bond-count");
    expect(
      Number(bondAttr),
      "Viewer must render bonds even when the saved pipeline omitted AddBond",
    ).toBeGreaterThan(0);

    // Regression: viewport guide settings (cellAxesVisible / pivotMarkerVisible)
    // saved in the pipeline JSON must survive deserialize. The fixture has
    // both turned OFF, so the renderer's reported visibility flags must
    // reflect that — previously, apply.ts overrode them with hardcoded
    // CellData.axesVisible: true on every cell-data update.
    const viewerVisibility = await page.evaluate(() => {
      const store = (window as { __megane_test_pipeline_store?: any })
        .__megane_test_pipeline_store;
      const vs = store?.getState().viewportState;
      return {
        cellAxesVisible: vs?.cellAxesVisible,
        pivotMarkerVisible: vs?.pivotMarkerVisible,
      };
    });
    expect(viewerVisibility.cellAxesVisible).toBe(false);
    expect(viewerVisibility.pivotMarkerVisible).toBe(false);
  });
});
