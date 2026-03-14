/**
 * Consolidated Galata tests for the megane MolecularViewer widget.
 *
 * All test cases share a single notebook execution to minimize overhead:
 *   - Caffeine water basic rendering
 *   - Perovskite with polyhedra pipeline
 *   - Filter + Modify + Labels pipeline
 *   - render_image() → PNG export
 *   - render_video() → GIF export
 */

import { test, expect, type Page } from "@playwright/test";

const NOTEBOOK = "tests/galata/notebooks/test_all.ipynb";
const CANVAS_SELECTOR = ".jp-OutputArea canvas";
const RENDER_WAIT_MS = 5_000;
const TOTAL_CELLS = 6;

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

/** Check if a WebGL canvas has rendered non-white pixels. */
async function checkCanvasHasContent(
  page: Page,
  selector: string,
): Promise<{ hasContent: boolean; nonWhitePixels: number; totalPixels: number }> {
  return page.evaluate((sel) => {
    const canvas = document.querySelector(sel) as HTMLCanvasElement | null;
    if (!canvas)
      return { hasContent: false, totalPixels: 0, nonWhitePixels: 0 };

    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
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

/** Wait for N cells to complete execution (prompt changes from [*] to [N]). */
async function waitForAllCellsExecution(
  page: Page,
  expectedCells: number,
  timeoutMs = 180_000,
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

/** Execute all cells sequentially using Shift+Enter. */
async function executeAllCells(page: Page, cellCount: number) {
  for (let i = 0; i < cellCount; i++) {
    const cell = page.locator(".jp-Cell").nth(i);
    const cellInput = cell.locator(".jp-Cell-inputArea .cm-editor .cm-content");
    await cellInput.click();
    await page.keyboard.press("Shift+Enter");

    // Wait for this cell to finish before moving to the next
    await page.waitForFunction(
      (cellIndex) => {
        const prompts = document.querySelectorAll(".jp-InputPrompt");
        if (cellIndex >= prompts.length) return false;
        const text = prompts[cellIndex].textContent || "";
        return text.includes("[") && !text.includes("*") && /\[\d+\]/.test(text);
      },
      i,
      { timeout: 120_000 },
    );
  }
}

test.describe.serial("megane widget tests", () => {
  const jsErrors: string[] = [];
  let setupDone = false;

  test("loads and executes notebook", async ({ page }) => {
    test.setTimeout(600_000); // All cells including render_video

    // Collect JS errors
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

    // Execute all cells sequentially
    await executeAllCells(page, TOTAL_CELLS);

    // Wait for WebGL rendering to settle
    await page.waitForTimeout(RENDER_WAIT_MS);

    // --- All assertions in this single test ---

    // Caffeine water (Cell 0): canvas exists
    const cell0Output = page.locator(".jp-Cell:nth-child(1) .jp-OutputArea");
    const cell0CanvasCount = await cell0Output.locator("canvas").count();
    expect(cell0CanvasCount).toBeGreaterThan(0);

    // Caffeine water: canvas has content
    const cell0Content = await checkCanvasHasContent(
      page,
      ".jp-Cell:nth-child(1) .jp-OutputArea canvas",
    );
    expect(cell0Content.hasContent).toBe(true);

    // Caffeine water: snapshot
    const widget0 = page
      .locator(".jp-Cell:nth-child(1) .jp-OutputArea-child")
      .last();
    await expect(widget0).toHaveScreenshot("caffeine-water-widget.png", {
      maxDiffPixelRatio: 0.03,
    });

    // Perovskite (Cell 1): canvas with content
    const cell1Output = page.locator(".jp-Cell:nth-child(2) .jp-OutputArea");
    const cell1CanvasCount = await cell1Output.locator("canvas").count();
    expect(cell1CanvasCount).toBeGreaterThan(0);
    const cell1Content = await checkCanvasHasContent(
      page,
      ".jp-Cell:nth-child(2) .jp-OutputArea canvas",
    );
    expect(cell1Content.hasContent).toBe(true);

    // Perovskite: snapshot
    const widget1 = page
      .locator(".jp-Cell:nth-child(2) .jp-OutputArea-child")
      .last();
    await expect(widget1).toHaveScreenshot("perovskite-polyhedra.png", {
      maxDiffPixelRatio: 0.03,
    });

    // Filter + Modify (Cell 2): canvas with content
    const cell2Output = page.locator(".jp-Cell:nth-child(3) .jp-OutputArea");
    const cell2CanvasCount = await cell2Output.locator("canvas").count();
    expect(cell2CanvasCount).toBeGreaterThan(0);
    const cell2Content = await checkCanvasHasContent(
      page,
      ".jp-Cell:nth-child(3) .jp-OutputArea canvas",
    );
    expect(cell2Content.hasContent).toBe(true);

    // Filter + Modify: snapshot
    const widget2 = page
      .locator(".jp-Cell:nth-child(3) .jp-OutputArea-child")
      .last();
    await expect(widget2).toHaveScreenshot("filter-modify-labels.png", {
      maxDiffPixelRatio: 0.03,
    });

    // render_image (Cell 3): check output
    const cell3Output = await page
      .locator(".jp-Cell:nth-child(4) .jp-OutputArea-output")
      .allInnerTexts();
    expect(cell3Output.join("\n")).toContain("Image render: OK");

    // render_video (Cell 5 = 6th child): check output
    const cell5Output = await page
      .locator(".jp-Cell:nth-child(6) .jp-OutputArea-output")
      .allInnerTexts();
    expect(cell5Output.join("\n")).toContain("Video render: OK");

    // No critical JS errors
    const critical = jsErrors.filter(isCriticalError);
    expect(critical).toHaveLength(0);

    // No Python tracebacks
    const tracebacks = await page
      .locator(
        '.jp-OutputArea-child .jp-RenderedText[data-mime-type="application/vnd.jupyter.stderr"]',
      )
      .count();
    expect(tracebacks).toBe(0);
  });
});
