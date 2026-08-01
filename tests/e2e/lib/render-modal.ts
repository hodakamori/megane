/**
 * Shared driver for the Render modal's animation tab.
 *
 * GIF export is the one export path that needs a Web Worker (gif.js encodes
 * there; MP4 uses MediaRecorder on the main thread), which makes it the path
 * that breaks per-host — see issues #497 (JupyterLab) and #599 (VSCode). Every
 * host that mounts the pipeline editor drives the same flow, so the setup lives
 * here rather than being duplicated per spec.
 */

import { readFileSync } from "fs";
import { expect, type Frame, type Page } from "playwright/test";

/** Set a controlled number input by testid, so React's onChange fires. */
async function setNumber(scope: Page | Frame, testid: string, value: number): Promise<void> {
  const input = scope.locator(`[data-testid="${testid}"]`);
  await input.fill(String(value));
  await expect(input).toHaveValue(String(value));
}

/**
 * Open the Render modal. The pipeline panel that hosts the Render button starts
 * collapsed when the viewport is narrow (< 768px) — which it is inside the
 * code-server webview — so expand it first.
 */
export async function openRenderModal(scope: Page | Frame): Promise<void> {
  const panel = scope.locator('[data-testid="panel-pipeline"]');
  if ((await panel.getAttribute("data-collapsed")) === "true") {
    await scope.locator('[data-testid="panel-pipeline-toggle"]').click();
    await expect(panel).toHaveAttribute("data-collapsed", "false");
  }

  await scope.locator('[data-testid="pipeline-editor-render"]').click();
  await expect(scope.locator('[data-testid="render-modal"]')).toBeVisible();
}

/**
 * Switch an already-open Render modal to a deliberately tiny GIF export.
 *
 * The encode runs under software GL in E2E, so keep the resolution and frame
 * count small: the point is whether the worker loads at all, not throughput.
 */
export async function useSmallGifExport(
  scope: Page | Frame,
  opts: { width?: number; endFrame?: number } = {},
): Promise<void> {
  const { width = 160, endFrame = 1 } = opts;

  const animationTab = scope.locator('[data-testid="render-modal-tab-animation"]');
  await expect(animationTab).toBeVisible();
  await animationTab.click();
  await expect(animationTab).toHaveAttribute("data-active", "true");

  // GIF is the default animation format; only click when something changed it.
  const gifFormat = scope.locator('[data-testid="render-modal-format-gif"]');
  if ((await gifFormat.getAttribute("data-active")) !== "true") {
    await gifFormat.click();
  }
  await expect(gifFormat).toHaveAttribute("data-active", "true");

  await setNumber(scope, "render-modal-width", width);
  await setNumber(scope, "render-modal-start-frame", 0);
  await setNumber(scope, "render-modal-end-frame", endFrame);
}

/**
 * Assert that a written export really is a GIF.
 *
 * A hung worker produced no file at all, and a worker handed an HTML error page
 * (the #497 shape) could resolve with something that is not a GIF — so check
 * the magic bytes rather than mere existence.
 */
export function expectGifFile(path: string): void {
  const bytes = readFileSync(path);
  expect(bytes.subarray(0, 4).toString("latin1")).toBe("GIF8");
  expect(bytes.byteLength).toBeGreaterThan(100);
}
