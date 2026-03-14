/**
 * Consolidated Galata tests for the megane MolecularViewer widget.
 *
 * All test cases share a single notebook execution to minimize overhead:
 *   - Caffeine water basic rendering (Cell 0)
 *   - Perovskite with polyhedra pipeline (Cell 1)
 *   - Filter + Modify + Labels pipeline (Cell 2)
 */

import { test, expect, type Page } from "@playwright/test";

const NOTEBOOK = "tests/galata/notebooks/test_all.ipynb";
const RENDER_WAIT_MS = 10_000;
const TOTAL_CELLS = 3;

/** WebGL shader errors are expected in headless mode and should be ignored. */
function isCriticalError(msg: string): boolean {
  if (msg.includes("Shader Error") || msg.includes("WebGLProgram")) {
    return false;
  }
  return (
    msg.includes("Cannot read propert") ||
    msg.includes("ipywidget") ||
    msg.includes("anywidget")
  );
}

/** Wait for N cells to complete execution (prompt changes from [*] to [N]). */
async function waitForAllCellsExecution(
  page: Page,
  expectedCells: number,
  timeoutMs = 120_000,
) {
  await page.waitForFunction(
    (expected) => {
      const prompts = document.querySelectorAll(".jp-InputPrompt");
      let completed = 0;
      for (const p of prompts) {
        const text = p.textContent || "";
        if (text.includes("[") && !text.includes("*") && /\[\d+\]/.test(text)) {
          completed++;
        }
      }
      return completed >= expected;
    },
    expectedCells,
    { timeout: timeoutMs },
  );
}

test("megane widget tests", async ({ page }) => {
  test.setTimeout(300_000);

  const jsErrors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") jsErrors.push(msg.text());
  });
  page.on("pageerror", (err) => jsErrors.push(err.message));

  // Open the consolidated notebook
  await page.goto(`/lab/tree/${NOTEBOOK}`);
  await page.waitForSelector(".jp-Notebook", { timeout: 30_000 });

  // Wait for kernel to be ready
  await page
    .waitForSelector(
      '.jp-Notebook-ExecutionIndicator[data-status="idle"]',
      { timeout: 30_000 },
    )
    .catch(() => {});
  await page.waitForTimeout(2_000);

  // Execute all cells: click into first cell, then Shift+Enter for each
  const firstCell = page.locator(".jp-Cell").first();
  await firstCell
    .locator(".jp-Cell-inputArea .cm-editor .cm-content")
    .click();

  for (let i = 0; i < TOTAL_CELLS; i++) {
    await page.keyboard.press("Shift+Enter");
    await page.waitForTimeout(500);
  }

  // Wait for all cells to complete
  await waitForAllCellsExecution(page, TOTAL_CELLS, 120_000);

  // Wait for WebGL rendering to settle
  await page.waitForTimeout(RENDER_WAIT_MS);

  // --- Verify no Python errors ---
  const tracebacks = await page
    .locator(
      '.jp-OutputArea-child .jp-RenderedText[data-mime-type="application/vnd.jupyter.stderr"]',
    )
    .count();
  expect(tracebacks).toBe(0);

  // --- Caffeine water (Cell 0): canvas exists + snapshot ---
  const cell0Output = page.locator(".jp-Cell:nth-child(1) .jp-OutputArea");
  expect(await cell0Output.locator("canvas").count()).toBeGreaterThan(0);

  const widget0 = page
    .locator(".jp-Cell:nth-child(1) .jp-OutputArea-child")
    .last();
  await expect(widget0).toHaveScreenshot("caffeine-water-widget.png", {
    maxDiffPixelRatio: 0.03,
  });

  // --- Perovskite (Cell 1): canvas exists + snapshot ---
  const cell1Output = page.locator(".jp-Cell:nth-child(2) .jp-OutputArea");
  expect(await cell1Output.locator("canvas").count()).toBeGreaterThan(0);

  const widget1 = page
    .locator(".jp-Cell:nth-child(2) .jp-OutputArea-child")
    .last();
  await expect(widget1).toHaveScreenshot("perovskite-polyhedra.png", {
    maxDiffPixelRatio: 0.03,
  });

  // --- Filter + Modify + Labels (Cell 2): canvas exists + snapshot ---
  const cell2Output = page.locator(".jp-Cell:nth-child(3) .jp-OutputArea");
  expect(await cell2Output.locator("canvas").count()).toBeGreaterThan(0);

  const widget2 = page
    .locator(".jp-Cell:nth-child(3) .jp-OutputArea-child")
    .last();
  await expect(widget2).toHaveScreenshot("filter-modify-labels.png", {
    maxDiffPixelRatio: 0.03,
  });

  // --- No critical JS errors ---
  const critical = jsErrors.filter(isCriticalError);
  expect(critical).toHaveLength(0);
});
