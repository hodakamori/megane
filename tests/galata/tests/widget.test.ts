/**
 * Basic widget rendering and notebook execution tests.
 *
 * Verifies that the megane MolecularViewer widget:
 *   1. Renders a WebGL canvas in JupyterLab
 *   2. Produces visible (non-white) pixels
 *   3. Matches a visual snapshot baseline
 *   4. Does not emit critical JS errors
 *   5. Notebook executes without Python errors
 */

import { test, expect, type Page } from "@playwright/test";

const NOTEBOOK = "tests/galata/notebooks/test_caffeine_basic.ipynb";
const CANVAS_SELECTOR = ".jp-OutputArea canvas";
const RENDER_WAIT_MS = 5_000;

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
    if (!gl) {
      return { hasContent: false, totalPixels: 0, nonWhitePixels: 0 };
    }

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

/** Wait for notebook cell execution to complete. */
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

test.describe("megane widget - caffeine water", () => {
  let jsErrors: string[] = [];

  test.beforeEach(async ({ page }) => {
    jsErrors = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") jsErrors.push(msg.text());
    });
    page.on("pageerror", (err) => jsErrors.push(err.message));

    // Open and execute the notebook
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

    // Execute cell
    const cellInput = page
      .locator(".jp-Cell-inputArea .cm-editor .cm-content")
      .first();
    await cellInput.click();
    await page.keyboard.press("Shift+Enter");

    // Wait for execution to complete
    await waitForCellExecution(page);

    // Wait for WebGL rendering to settle
    await page.waitForSelector(CANVAS_SELECTOR, { timeout: 30_000 });
    await page.waitForTimeout(RENDER_WAIT_MS);
  });

  test("renders a WebGL canvas", async ({ page }) => {
    const canvasCount = await page.locator(CANVAS_SELECTOR).count();
    expect(canvasCount).toBeGreaterThan(0);
  });

  test("canvas contains rendered content", async ({ page }) => {
    const result = await checkCanvasHasContent(page, CANVAS_SELECTOR);
    expect(result.hasContent).toBe(true);
  });

  test("widget snapshot", async ({ page }) => {
    const widget = page.locator(".jp-OutputArea-child").last();
    await expect(widget).toHaveScreenshot("caffeine-water-widget.png", {
      maxDiffPixelRatio: 0.03,
    });
  });

  test("no critical JS errors", async () => {
    const critical = jsErrors.filter(isCriticalError);
    expect(critical).toHaveLength(0);
  });

  test("notebook execution succeeds", async ({ page }) => {
    // Check that no cells contain Python traceback output
    const tracebacks = await page
      .locator(
        '.jp-OutputArea-child .jp-RenderedText[data-mime-type="application/vnd.jupyter.stderr"]',
      )
      .count();
    expect(tracebacks).toBe(0);
  });
});
