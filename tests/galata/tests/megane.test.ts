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

import { test, expect, type Page, type Browser } from "@playwright/test";

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

test.describe.serial("megane widget tests", () => {
  let page: Page;
  const jsErrors: string[] = [];

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();

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

    // Run all cells (Ctrl+Shift+Enter)
    await page.keyboard.press("Control+Shift+Enter");

    // Wait for all cells to complete (render_video can be slow)
    await waitForAllCellsExecution(page, TOTAL_CELLS, 300_000);

    // Wait for WebGL rendering to settle
    await page.waitForTimeout(RENDER_WAIT_MS);
  });

  test.afterAll(async () => {
    await page?.close();
  });

  // --- Caffeine water basic tests (Cell 0) ---

  test("caffeine water renders canvas", async () => {
    const outputAreas = page.locator(".jp-Cell .jp-OutputArea");
    const firstOutput = outputAreas.nth(0);
    const canvasCount = await firstOutput.locator("canvas").count();
    expect(canvasCount).toBeGreaterThan(0);
  });

  test("caffeine water canvas has content", async () => {
    const result = await checkCanvasHasContent(
      page,
      ".jp-Cell:nth-child(1) .jp-OutputArea canvas",
    );
    expect(result.hasContent).toBe(true);
  });

  test("caffeine water snapshot", async () => {
    const widget = page
      .locator(".jp-Cell:nth-child(1) .jp-OutputArea-child")
      .last();
    await expect(widget).toHaveScreenshot("caffeine-water-widget.png", {
      maxDiffPixelRatio: 0.03,
    });
  });

  // --- Perovskite pipeline tests (Cell 1) ---

  test("perovskite renders canvas with content", async () => {
    const cell = page.locator(".jp-Cell:nth-child(2) .jp-OutputArea");
    const canvasCount = await cell.locator("canvas").count();
    expect(canvasCount).toBeGreaterThan(0);

    const result = await checkCanvasHasContent(
      page,
      ".jp-Cell:nth-child(2) .jp-OutputArea canvas",
    );
    expect(result.hasContent).toBe(true);
  });

  test("perovskite snapshot", async () => {
    const widget = page
      .locator(".jp-Cell:nth-child(2) .jp-OutputArea-child")
      .last();
    await expect(widget).toHaveScreenshot("perovskite-polyhedra.png", {
      maxDiffPixelRatio: 0.03,
    });
  });

  // --- Filter + Modify + Labels tests (Cell 2) ---

  test("filter modify renders canvas with content", async () => {
    const cell = page.locator(".jp-Cell:nth-child(3) .jp-OutputArea");
    const canvasCount = await cell.locator("canvas").count();
    expect(canvasCount).toBeGreaterThan(0);

    const result = await checkCanvasHasContent(
      page,
      ".jp-Cell:nth-child(3) .jp-OutputArea canvas",
    );
    expect(result.hasContent).toBe(true);
  });

  test("filter modify snapshot", async () => {
    const widget = page
      .locator(".jp-Cell:nth-child(3) .jp-OutputArea-child")
      .last();
    await expect(widget).toHaveScreenshot("filter-modify-labels.png", {
      maxDiffPixelRatio: 0.03,
    });
  });

  // --- Render image test (Cell 3) ---

  test("render_image produces valid PNG", async () => {
    const outputText = await page
      .locator(".jp-Cell:nth-child(4) .jp-OutputArea-output")
      .allInnerTexts();
    const allText = outputText.join("\n");
    expect(allText).toContain("Image render: OK");
  });

  // --- Render video test (Cells 4-5) ---

  test("render_video produces valid GIF", async () => {
    const outputText = await page
      .locator(".jp-Cell:nth-child(6) .jp-OutputArea-output")
      .allInnerTexts();
    const allText = outputText.join("\n");
    expect(allText).toContain("Video render: OK");
  });

  // --- Cross-cutting tests ---

  test("no critical JS errors", async () => {
    const critical = jsErrors.filter(isCriticalError);
    expect(critical).toHaveLength(0);
  });

  test("all cells execute without errors", async () => {
    const tracebacks = await page
      .locator(
        '.jp-OutputArea-child .jp-RenderedText[data-mime-type="application/vnd.jupyter.stderr"]',
      )
      .count();
    expect(tracebacks).toBe(0);
  });
});
