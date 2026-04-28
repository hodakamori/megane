/**
 * Interaction tests for the megane Vite app.
 *
 * Covers behaviors that snapshot.test.mjs does NOT exercise:
 *   1. Trajectory playback toggle and seek bar drives frame_index
 *   2. Sidebar collapse / expand toggle round-trip
 *   3. Atom selection via canvas click renders the MeasurementPanel
 *   4. Structure D&D upload via the structure DropZone input
 *
 * Each successful step writes a screenshot to tests/e2e/snapshots/.
 * On failure a -failure.png is saved alongside.
 */

import { join } from "path";
import { assert } from "./utils/assert.mjs";
import {
  REPO_ROOT,
  getChromium,
  startViteServer,
  waitForCanvasNonEmpty,
  saveScreenshot,
  sleep,
} from "./utils/playwright.mjs";

const FIXTURES = join(REPO_ROOT, "tests", "fixtures");

async function gotoFresh(page, baseUrl) {
  await page.goto(baseUrl, { waitUntil: "networkidle", timeout: 30000 });
  await page.waitForSelector("canvas", { timeout: 15000 });
  await page.waitForFunction(() => window.__meganeRendererReady === true, null, { timeout: 15000 })
    .catch(() => {});
  await sleep(1500);
}

async function testPlaybackToggle(page, baseUrl) {
  console.log("\n=== Test: playback toggle + seek ===");
  await gotoFresh(page, baseUrl);
  // Default fixture is caffeine_water (with XTC). Timeline is rendered when totalFrames > 1.
  const toggle = page.locator('[data-testid="playback-toggle"]');
  await toggle.waitFor({ timeout: 15000 });

  const beforePlaying = await toggle.getAttribute("data-playing");
  await toggle.click();
  await sleep(800);
  const afterPlaying = await toggle.getAttribute("data-playing");
  assert(beforePlaying !== afterPlaying, `playback toggle flipped state (${beforePlaying} -> ${afterPlaying})`);

  // Pause again (toggle data attribute should flip back)
  await toggle.click();
  await sleep(300);
  const finalPlaying = await toggle.getAttribute("data-playing");
  assert(finalPlaying === beforePlaying, `playback toggle returns to original state (${finalPlaying})`);

  // Drive the seek bar to the middle frame
  const seek = page.locator('[data-testid="playback-seekbar"]');
  const max = await seek.getAttribute("max");
  if (max && Number(max) > 1) {
    const target = Math.floor(Number(max) / 2);
    await seek.evaluate((el, v) => {
      el.value = String(v);
      el.dispatchEvent(new Event("input", { bubbles: true }));
      el.dispatchEvent(new Event("change", { bubbles: true }));
    }, target);
    await sleep(500);
    const value = await seek.inputValue();
    assert(Number(value) === target, `seek bar moved to frame ${target}`);
  } else {
    console.log("  (skipped seek: only 1 frame or no max attribute)");
  }

  await saveScreenshot(page, "interaction-playback.png");
}

async function testSidebarCollapseRoundtrip(page, baseUrl) {
  console.log("\n=== Test: sidebar collapse round-trip ===");
  await gotoFresh(page, baseUrl);
  const sidebar = page.locator('[data-testid="sidebar-root"]');
  await sidebar.waitFor({ timeout: 5000 });
  const before = await sidebar.getAttribute("data-collapsed");
  assert(before === "false", `sidebar starts expanded (data-collapsed=${before})`);

  await page.locator('[data-testid="sidebar-toggle"]').first().click();
  await sleep(400);
  const collapsed = await page.locator('[data-testid="sidebar-root"]').getAttribute("data-collapsed");
  assert(collapsed === "true", `sidebar collapsed after toggle (data-collapsed=${collapsed})`);

  // Re-expand
  await page.locator('[data-testid="sidebar-toggle"]').first().click();
  await sleep(400);
  const reopened = await page.locator('[data-testid="sidebar-root"]').getAttribute("data-collapsed");
  assert(reopened === "false", `sidebar re-expanded (data-collapsed=${reopened})`);

  await saveScreenshot(page, "interaction-sidebar.png");
}

async function testAtomSelection(page, baseUrl) {
  console.log("\n=== Test: atom click selection -> MeasurementPanel ===");
  await gotoFresh(page, baseUrl);

  // Click center of the canvas; the default scene has the molecule centered
  const canvas = page.locator("canvas").first();
  const box = await canvas.boundingBox();
  if (!box) {
    assert(false, "canvas bounding box available");
    return;
  }
  // Click a few near-center positions; the first hit on an atom triggers selection.
  const positions = [
    { x: box.x + box.width / 2, y: box.y + box.height / 2 },
    { x: box.x + box.width / 2 - 30, y: box.y + box.height / 2 },
    { x: box.x + box.width / 2 + 30, y: box.y + box.height / 2 - 20 },
    { x: box.x + box.width / 2 + 60, y: box.y + box.height / 2 + 10 },
  ];

  let panelVisible = false;
  for (const pos of positions) {
    await page.mouse.click(pos.x, pos.y);
    await sleep(400);
    const count = await page.locator('[data-testid="measurement-panel"]').count();
    if (count > 0) {
      panelVisible = true;
      break;
    }
  }
  if (!panelVisible) {
    await saveScreenshot(page, "interaction-selection-failure.png").catch(() => {});
  }
  assert(panelVisible, "MeasurementPanel appears after atom click");

  await saveScreenshot(page, "interaction-selection.png");

  // Clear via the panel's clear button
  await page.locator('[data-testid="measurement-clear"]').click();
  await sleep(300);
  const remaining = await page.locator('[data-testid="measurement-panel"]').count();
  assert(remaining === 0, "MeasurementPanel hides after Clear");
}

async function testStructureUpload(page, baseUrl) {
  console.log("\n=== Test: structure upload via DropZone input ===");
  await gotoFresh(page, baseUrl);

  const input = page.locator('[data-testid="structure-upload-input"]');
  await input.waitFor({ state: "attached", timeout: 5000 });
  await input.setInputFiles(join(FIXTURES, "1crn.pdb"));
  await sleep(1500);
  const pixels = await waitForCanvasNonEmpty(page, "canvas", { timeout: 15000 });
  assert(pixels.hasContent, `canvas redrew after structure upload (${pixels.nonWhitePixels} non-white)`);

  const text = await page.locator('[data-testid="structure-upload-dropzone"]').innerText();
  assert(text.includes("1crn.pdb") || text.includes("327"), `sidebar reflects new file (text=${JSON.stringify(text)})`);

  await saveScreenshot(page, "interaction-upload.png");
}

let server = null;
let browser = null;

try {
  console.log("Starting Vite dev server...");
  server = await startViteServer();
  console.log(`Vite running on ${server.url}`);

  const chromium = getChromium();
  browser = await chromium.launch({ headless: true, args: ["--use-gl=swiftshader"] });
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const page = await context.newPage();
  page.on("pageerror", (err) => console.log("  [pageerror]", err.message));

  await testPlaybackToggle(page, server.url);
  await testSidebarCollapseRoundtrip(page, server.url);
  await testAtomSelection(page, server.url);
  await testStructureUpload(page, server.url);

  if (process.exitCode === 1) {
    console.log("\n--- interaction_app: SOME FAILURES ---");
  } else {
    console.log("\n--- interaction_app: ALL PASSED ---");
  }
} catch (err) {
  console.error("interaction_app fatal:", err);
  process.exitCode = 1;
} finally {
  if (browser) await browser.close().catch(() => {});
  if (server) server.kill();
}
