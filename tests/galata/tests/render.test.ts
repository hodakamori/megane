/**
 * Render export tests for the megane widget.
 *
 * Tests the Python render API (render_image, render_video) which
 * communicates with the JS side via traitlets to produce PNG/GIF output.
 *
 * These tests execute notebooks that:
 *   1. Load a structure and display the widget
 *   2. Call viewer.render_image() / viewer.render_video()
 *   3. Assert the output is valid PNG / GIF data
 */

import { test, expect, type Page } from "@playwright/test";

/** Wait for ALL cells to complete execution (check for multiple [N] prompts). */
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

/** Execute all cells in the notebook using Run All menu. */
async function runAllCells(page: Page) {
  // Use keyboard shortcut to run all cells
  await page.keyboard.press("Control+Shift+Enter");
}

test.describe("render - image export", () => {
  const NOTEBOOK = "tests/galata/notebooks/test_render_image.ipynb";

  test("render_image produces valid PNG", async ({ page }) => {
    await page.goto(`/lab/tree/${NOTEBOOK}`);
    await page.waitForSelector(".jp-Notebook", { timeout: 30_000 });

    // Wait for kernel
    await page
      .waitForSelector(
        '.jp-Notebook-ExecutionIndicator[data-status="idle"]',
        { timeout: 30_000 },
      )
      .catch(() => {});
    await page.waitForTimeout(2_000);

    // Run all cells
    await runAllCells(page);

    // Wait for both cells to complete (cell 1: widget, cell 2: render_image)
    await waitForAllCellsExecution(page, 2, 120_000);

    // Check that no cells contain Python traceback output
    const tracebacks = await page
      .locator(
        '.jp-OutputArea-child .jp-RenderedText[data-mime-type="application/vnd.jupyter.stderr"]',
      )
      .count();
    expect(tracebacks).toBe(0);

    // Verify the output text includes "Image render: OK"
    const outputText = await page
      .locator(".jp-OutputArea-output")
      .allInnerTexts();
    const allText = outputText.join("\n");
    expect(allText).toContain("Image render: OK");
  });
});

test.describe("render - video export", () => {
  const NOTEBOOK = "tests/galata/notebooks/test_render_video.ipynb";

  test("render_video produces valid GIF", async ({ page }) => {
    test.setTimeout(180_000); // Video rendering can be slow

    await page.goto(`/lab/tree/${NOTEBOOK}`);
    await page.waitForSelector(".jp-Notebook", { timeout: 30_000 });

    // Wait for kernel
    await page
      .waitForSelector(
        '.jp-Notebook-ExecutionIndicator[data-status="idle"]',
        { timeout: 30_000 },
      )
      .catch(() => {});
    await page.waitForTimeout(2_000);

    // Run all cells
    await runAllCells(page);

    // Wait for both cells to complete (cell 1: widget + trajectory, cell 2: render_video)
    await waitForAllCellsExecution(page, 2, 180_000);

    // Check no Python errors
    const tracebacks = await page
      .locator(
        '.jp-OutputArea-child .jp-RenderedText[data-mime-type="application/vnd.jupyter.stderr"]',
      )
      .count();
    expect(tracebacks).toBe(0);

    // Verify the output text includes "Video render: OK"
    const outputText = await page
      .locator(".jp-OutputArea-output")
      .allInnerTexts();
    const allText = outputText.join("\n");
    expect(allText).toContain("Video render: OK");
  });
});
