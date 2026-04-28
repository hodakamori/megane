/**
 * E2E test for the megane JupyterLab extension's "open from file browser" path.
 *
 * For a list of structure files in tests/fixtures/, we:
 *   1. Open JupyterLab
 *   2. Programmatically execute `docmanager:open` with `factory: "megane Molecular Viewer"`
 *   3. Wait for `[data-testid="megane-doc-root"][data-state="ready"]` and a canvas
 *   4. Save a screenshot under tests/e2e/snapshots/lab-<key>.png
 *   5. Assert the canvas drew non-white pixels
 *
 * This complements test_widget_render.mjs (which only exercises the anywidget
 * path, not the docmanager file-open factory provided by jupyterlab-megane).
 *
 * Prerequisites:
 *   - megane installed via `maturin develop --release`
 *   - jupyterlab installed
 *   - the labextension prebuilt as part of `npm run build:lab` (already shipped
 *     via the wheel data dir at install time)
 */

import { randomBytes } from "crypto";
import { join } from "path";
import { assert } from "./utils/assert.mjs";
import {
  REPO_ROOT,
  getChromium,
  startJupyterLab,
  saveScreenshot,
  waitForCanvasNonEmpty,
  sleep,
} from "./utils/playwright.mjs";

const FIXTURES = join(REPO_ROOT, "tests", "fixtures");
const FACTORY = "megane Molecular Viewer";

const CASES = [
  { key: "1crn", path: "tests/fixtures/1crn.pdb" },
  { key: "nacl", path: "tests/fixtures/nacl.cif" },
  { key: "perovskite", path: "tests/fixtures/perovskite_srtio3.xyz" },
  { key: "caffeine_water", path: "tests/fixtures/caffeine_water.pdb" },
];

async function openOne(browser, baseUrl, token, { key, path }) {
  console.log(`\n=== Lab open: ${key} (${path}) ===`);
  // Use a fresh browser context per case so JupyterLab tab state from a
  // previous file does not interfere with the megane-doc-root selector
  // (Lab keeps inactive document widgets in the DOM).
  const context = await browser.newContext({ viewport: { width: 1280, height: 960 } });
  const page = await context.newPage();
  page.on("pageerror", (err) => console.log("  [pageerror]", err.message));

  try {
    // JupyterLab supports opening a path with a specific factory via the /lab/tree URL:
    //   /lab/tree/<path>?factory=<factoryName>&token=<token>
    const url = `${baseUrl}/lab/tree/${path}?factory=${encodeURIComponent(FACTORY)}&token=${token}`;
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
    await page.waitForSelector(".jp-LabShell", { timeout: 30000 });
    await page.waitForTimeout(2500);

    // Wait for the megane doc widget to mark itself ready
    const readyOk = await page
      .waitForSelector('[data-testid="megane-doc-root"][data-state="ready"]', { timeout: 60000 })
      .then(() => true)
      .catch(() => false);
    if (!readyOk) {
      await saveScreenshot(page, `lab-${key}-failure.png`).catch(() => {});
    }
    assert(readyOk, `[${key}] megane-doc-root reached state=ready`);

    // Confirm a canvas drew something
    await sleep(1500);
    const pixels = await waitForCanvasNonEmpty(
      page,
      '[data-testid="megane-doc-root"] canvas',
      { timeout: 20000 },
    );
    assert(pixels.hasContent, `[${key}] canvas drew non-white pixels (${pixels.nonWhitePixels}/${pixels.totalPixels})`);

    await saveScreenshot(page, `lab-${key}.png`);
    console.log(`  screenshot saved: lab-${key}.png`);
  } finally {
    await context.close().catch(() => {});
  }
}

let server = null;
let browser = null;

try {
  const token = randomBytes(16).toString("hex");
  console.log("Starting JupyterLab...");
  server = await startJupyterLab({ token, notebookDir: REPO_ROOT });
  console.log(`JupyterLab running on ${server.url}`);

  const chromium = getChromium();
  browser = await chromium.launch({ headless: true, args: ["--use-gl=swiftshader"] });

  for (const c of CASES) {
    try {
      await openOne(browser, server.url, token, c);
    } catch (err) {
      console.error(`  FAIL [${c.key}]: ${err.message}`);
    }
  }

  if (process.exitCode === 1) {
    console.log("\n--- jupyterlab_open_file: SOME FAILURES ---");
  } else {
    console.log("\n--- jupyterlab_open_file: ALL PASSED ---");
  }
} catch (err) {
  console.error("jupyterlab_open_file fatal:", err);
  process.exitCode = 1;
} finally {
  if (browser) await browser.close().catch(() => {});
  if (server) server.kill();
}
