/**
 * Pipeline-specific widget tests.
 *
 * Tests pipeline functionality with different node types:
 *   - Perovskite SrTiO3 with polyhedra (Ti-O coordination)
 *   - Filter + Modify + Labels on caffeine water
 *   - Notebook execution pass/fail for all pipeline notebooks
 */

import { test, expect, type Page } from "@playwright/test";

const CANVAS_SELECTOR = ".jp-OutputArea canvas";
const RENDER_WAIT_MS = 5_000;

/** Check if the WebGL canvas has rendered non-white pixels. */
async function checkCanvasHasContent(
  page: Page,
  selector: string,
): Promise<{ hasContent: boolean; nonWhitePixels: number; totalPixels: number }> {
  return page.evaluate((sel) => {
    const canvas = document.querySelector(sel) as HTMLCanvasElement | null;
    if (!canvas)
      return { hasContent: false, totalPixels: 0, nonWhitePixels: 0 };

    const gl =
      canvas.getContext("webgl2") || canvas.getContext("webgl");
    if (!gl)
      return { hasContent: false, totalPixels: 0, nonWhitePixels: 0 };

    const width = (gl as WebGLRenderingContext).drawingBufferWidth;
    const height = (gl as WebGLRenderingContext).drawingBufferHeight;
    const pixels = new Uint8Array(width * height * 4);
    (gl as WebGLRenderingContext).readPixels(
      0, 0, width, height,
      (gl as WebGLRenderingContext).RGBA,
      (gl as WebGLRenderingContext).UNSIGNED_BYTE,
      pixels,
    );

    let nonWhite = 0;
    const total = width * height;
    for (let i = 0; i < pixels.length; i += 4) {
      if (pixels[i] < 250 || pixels[i + 1] < 250 || pixels[i + 2] < 250) {
        nonWhite++;
      }
    }
    return {
      hasContent: nonWhite > total * 0.001,
      totalPixels: total,
      nonWhitePixels: nonWhite,
    };
  }, selector);
}

/** Wait for cell execution to complete (execution count changes from [*] to [N]). */
async function waitForCellExecution(page: Page, timeoutMs = 60_000) {
  await page.waitForFunction(
    () => {
      const prompts = document.querySelectorAll(".jp-InputPrompt");
      for (const p of prompts) {
        const text = p.textContent || "";
        if (text.includes("[") && !text.includes("*") && /\[\d+\]/.test(text)) {
          return true;
        }
      }
      return false;
    },
    { timeout: timeoutMs },
  );
}

/** Open a notebook, execute all cells, and wait for rendering. */
async function openAndExecuteNotebook(page: Page, notebookPath: string) {
  await page.goto(`/lab/tree/${notebookPath}`);
  await page.waitForSelector(".jp-Notebook", { timeout: 30_000 });

  // Wait for kernel
  await page
    .waitForSelector(
      '.jp-Notebook-ExecutionIndicator[data-status="idle"]',
      { timeout: 30_000 },
    )
    .catch(() => {});
  await page.waitForTimeout(2_000);

  // Execute first cell
  const cellInput = page
    .locator(".jp-Cell-inputArea .cm-editor .cm-content")
    .first();
  await cellInput.click();
  await page.keyboard.press("Shift+Enter");

  await waitForCellExecution(page);
  await page.waitForSelector(CANVAS_SELECTOR, { timeout: 30_000 });
  await page.waitForTimeout(RENDER_WAIT_MS);
}

test.describe("pipeline - perovskite with polyhedra", () => {
  const NOTEBOOK = "tests/galata/notebooks/test_perovskite_pipeline.ipynb";

  test.beforeEach(async ({ page }) => {
    await openAndExecuteNotebook(page, NOTEBOOK);
  });

  test("renders canvas with content", async ({ page }) => {
    const canvasCount = await page.locator(CANVAS_SELECTOR).count();
    expect(canvasCount).toBeGreaterThan(0);

    const result = await checkCanvasHasContent(page, CANVAS_SELECTOR);
    expect(result.hasContent).toBe(true);
  });

  test("perovskite snapshot", async ({ page }) => {
    const widget = page.locator(".jp-OutputArea-child").last();
    await expect(widget).toHaveScreenshot("perovskite-polyhedra.png", {
      maxDiffPixelRatio: 0.03,
    });
  });

  test("notebook execution succeeds", async ({ page }) => {
    const tracebacks = await page
      .locator(
        '.jp-OutputArea-child .jp-RenderedText[data-mime-type="application/vnd.jupyter.stderr"]',
      )
      .count();
    expect(tracebacks).toBe(0);
  });
});

test.describe("pipeline - filter + modify + labels", () => {
  const NOTEBOOK = "tests/galata/notebooks/test_pipeline_filter_modify.ipynb";

  test.beforeEach(async ({ page }) => {
    await openAndExecuteNotebook(page, NOTEBOOK);
  });

  test("renders canvas with content", async ({ page }) => {
    const canvasCount = await page.locator(CANVAS_SELECTOR).count();
    expect(canvasCount).toBeGreaterThan(0);

    const result = await checkCanvasHasContent(page, CANVAS_SELECTOR);
    expect(result.hasContent).toBe(true);
  });

  test("filter modify snapshot", async ({ page }) => {
    const widget = page.locator(".jp-OutputArea-child").last();
    await expect(widget).toHaveScreenshot("filter-modify-labels.png", {
      maxDiffPixelRatio: 0.03,
    });
  });

  test("notebook execution succeeds", async ({ page }) => {
    const tracebacks = await page
      .locator(
        '.jp-OutputArea-child .jp-RenderedText[data-mime-type="application/vnd.jupyter.stderr"]',
      )
      .count();
    expect(tracebacks).toBe(0);
  });
});
