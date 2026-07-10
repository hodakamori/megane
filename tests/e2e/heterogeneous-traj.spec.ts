/**
 * Heterogeneous ASE .traj E2E (webapp).
 *
 * Drives the full WASM → parseCore → playback → renderer pipeline for `.traj`
 * trajectories whose frames differ in atom count, unit cell, or elements. The
 * assertions are DOM-contract only (frame counts, per-frame atom count,
 * scrubbing) rather than pixel baselines: this exercises the heterogeneous
 * *behaviour* in a real browser without depending on the host's font/GL render
 * (committed pixel baselines drift across environments — see the e2e-coverage
 * skill). `data-frame-atoms` reflects the atom count of the frame currently
 * drawn, so it is the signal that the per-frame topology swap actually ran.
 */

import { readFileSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { test, expect } from "playwright/test";
import { getReadyState, waitForReady } from "./lib/setup";

const REPO = join(fileURLToPath(import.meta.url), "..", "..", "..");
const FIXTURES = join(REPO, "tests", "fixtures");

async function dropTraj(page: import("playwright/test").Page, file: string): Promise<void> {
  const bytes = readFileSync(join(FIXTURES, file));
  const input = page.locator('[data-testid="load-structure-input"]').first();
  await input.setInputFiles({
    name: file,
    mimeType: "application/octet-stream",
    buffer: bytes,
  });
}

async function seekTo(page: import("playwright/test").Page, frame: number): Promise<void> {
  await page.locator('[data-testid="playback-seekbar"]').evaluate((el: HTMLInputElement, f) => {
    const proto = Object.getPrototypeOf(el);
    const setter = Object.getOwnPropertyDescriptor(proto, "value")?.set;
    setter?.call(el, String(f));
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
  }, frame);
  await page.waitForFunction(
    (f) =>
      document
        .querySelector('[data-testid="megane-viewer"]')
        ?.getAttribute("data-current-frame") === String(f),
    frame,
    { timeout: 5_000 },
  );
}

function viewerAttr(page: import("playwright/test").Page, attr: string): Promise<string | null> {
  return page.locator('[data-testid="megane-viewer"]').getAttribute(attr);
}

test.describe("heterogeneous .traj: webapp", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/?test=1", { waitUntil: "domcontentloaded" });
    await waitForReady(page);
  });

  test("variable atom count: per-frame atom count grows on scrub", async ({ page }) => {
    const before = await getReadyState(page);
    await dropTraj(page, "water_var_atoms.traj");
    await waitForReady(page, { untilEpoch: before.renderEpoch + 1 });

    // 5 frames: 3, 6, 9, 12, 15 atoms.
    expect(await viewerAttr(page, "data-total-frames")).toBe("5");
    // Frame 0 (the snapshot) has 3 atoms.
    expect(Number(await viewerAttr(page, "data-frame-atoms"))).toBe(3);

    // Scrub to the last frame — the renderer must re-topologise to 15 atoms.
    await seekTo(page, 4);
    expect(Number(await viewerAttr(page, "data-frame-atoms"))).toBe(15);

    // Scrub back to a middle frame — count shrinks again (9 atoms).
    await seekTo(page, 2);
    expect(Number(await viewerAttr(page, "data-frame-atoms"))).toBe(9);
  });

  test("variable cell: loads and scrubs all frames without error", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(String(e)));

    const before = await getReadyState(page);
    await dropTraj(page, "water_var_cell.traj");
    await waitForReady(page, { untilEpoch: before.renderEpoch + 1 });

    expect(await viewerAttr(page, "data-total-frames")).toBe("5");
    // Constant 3 atoms across frames (only the cell changes).
    await seekTo(page, 4);
    expect(Number(await viewerAttr(page, "data-frame-atoms"))).toBe(3);
    expect(errors).toEqual([]);
  });

  test("variable topology: elements change without crashing the renderer", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(String(e)));

    const before = await getReadyState(page);
    await dropTraj(page, "water_var_topology.traj");
    await waitForReady(page, { untilEpoch: before.renderEpoch + 1 });

    expect(await viewerAttr(page, "data-total-frames")).toBe("5");
    await seekTo(page, 3);
    expect(Number(await viewerAttr(page, "data-frame-atoms"))).toBe(3);
    expect(errors).toEqual([]);
  });
});
