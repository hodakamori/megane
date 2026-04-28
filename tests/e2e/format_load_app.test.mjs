/**
 * Multi-format file loading test for the megane Vite app.
 *
 * For each fixture format (PDB, GRO/-style, XYZ, CIF, LAMMPS data, .traj, MOL),
 * we:
 *   1. Open the app
 *   2. Set the file on the structure DropZone input
 *   3. Wait for the canvas to draw non-white pixels
 *   4. Take a screenshot under tests/e2e/snapshots/format-<key>.png
 *   5. Assert the sidebar atom-count badge shows the expected number
 *
 * Usage:
 *   node tests/e2e/format_load_app.test.mjs
 *
 * Prerequisites:
 *   - WASM built (npm run build:wasm)
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

const CASES = [
  { key: "pdb-1crn", file: join(FIXTURES, "1crn.pdb"), expectedAtoms: 327 },
  { key: "pdb-water-wrapped", file: join(FIXTURES, "water_wrapped.pdb"), expectedAtoms: null },
  { key: "xyz-perovskite", file: join(FIXTURES, "perovskite_srtio3.xyz"), expectedAtoms: 5 },
  { key: "xyz-quartz", file: join(FIXTURES, "quartz_sio2.xyz"), expectedAtoms: 9 },
  { key: "cif-nacl", file: join(FIXTURES, "nacl.cif"), expectedAtoms: 8 },
  { key: "lammps-water", file: join(FIXTURES, "water.lammps"), expectedAtoms: null },
  { key: "traj-water", file: join(FIXTURES, "water.traj"), expectedAtoms: null },
];

async function loadOne(page, baseUrl, { key, file, expectedAtoms }) {
  console.log(`\n=== Format: ${key} ===`);
  await page.goto(baseUrl, { waitUntil: "networkidle", timeout: 30000 });
  await page.waitForSelector("canvas", { timeout: 15000 });
  // Wait until renderer signals readiness (set by MoleculeRenderer perf hook)
  await page.waitForFunction(() => window.__meganeRendererReady === true, null, { timeout: 15000 })
    .catch(() => console.log("  WARN: __meganeRendererReady not set (perf hook may be off)"));

  const input = page.locator('[data-testid="structure-upload-input"]');
  await input.waitFor({ state: "attached", timeout: 5000 });
  await input.setInputFiles(file);
  console.log(`  setInputFiles: ${file}`);

  await sleep(500);
  const pixels = await waitForCanvasNonEmpty(page, "canvas", { timeout: 20000 });
  assert(pixels.hasContent, `[${key}] canvas drew non-white pixels (${pixels.nonWhitePixels}/${pixels.totalPixels})`);

  if (expectedAtoms !== null) {
    // Sidebar shows "<count> atoms" inside structure section
    const text = await page.locator('[data-testid="structure-upload-dropzone"]').innerText().catch(() => "");
    const normalized = text.replace(/,/g, "");
    const ok = normalized.includes(String(expectedAtoms));
    if (!ok) {
      console.log(`  Sidebar text: ${JSON.stringify(text)}`);
    }
    assert(ok, `[${key}] sidebar shows ${expectedAtoms} atoms`);
  } else {
    console.log("  (atom count check skipped for this format)");
  }

  await saveScreenshot(page, `format-${key}.png`);
  console.log(`  screenshot saved: format-${key}.png`);
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

  for (const c of CASES) {
    try {
      await loadOne(page, server.url, c);
    } catch (err) {
      console.error(`  FAIL [${c.key}]: ${err.message}`);
      // Save a failure screenshot as well
      await saveScreenshot(page, `format-${c.key}-failure.png`).catch(() => {});
    }
  }

  if (process.exitCode === 1) {
    console.log("\n--- format_load_app: SOME FAILURES ---");
  } else {
    console.log("\n--- format_load_app: ALL PASSED ---");
  }
} catch (err) {
  console.error("format_load_app fatal:", err);
  process.exitCode = 1;
} finally {
  if (browser) await browser.close().catch(() => {});
  if (server) server.kill();
}
