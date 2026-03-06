/**
 * E2E snapshot test for the megane standalone web application.
 *
 * Launches Vite dev server, opens the app in Playwright Chromium,
 * waits for the demo molecule to render, and performs screenshot-based
 * snapshot comparison using pixelmatch.
 *
 * Usage:
 *   node tests/e2e/snapshot.test.mjs [--update]
 *
 * Flags:
 *   --update  Re-generate baseline snapshots
 */

import { spawn } from "child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync, unlinkSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SNAPSHOTS_DIR = join(__dirname, "snapshots");
const CWD = join(__dirname, "..", "..");

// Resolve Playwright from global installation
const _require = createRequire("/opt/node22/lib/node_modules/");
const { chromium } = _require("playwright");

// Resolve pixelmatch and pngjs from project node_modules
const { default: pixelmatch } = await import(join(CWD, "node_modules", "pixelmatch", "index.js"));
const { PNG } = await import(join(CWD, "node_modules", "pngjs", "lib", "png.js"));

const UPDATE_MODE = process.argv.includes("--update");
const PORT = 15173 + Math.floor(Math.random() * 100);

// Pixel difference threshold (0-1, smaller = stricter)
const PIXEL_THRESHOLD = 0.15;
// Maximum allowed pixel diff percentage
const MAX_DIFF_PERCENT = 2.0;

// ---- Helpers ----

function assert(condition, message) {
  if (!condition) {
    console.error(`FAIL: ${message}`);
    process.exitCode = 1;
    throw new Error(message);
  }
  console.log(`PASS: ${message}`);
}

function startViteServer() {
  return new Promise((resolve, reject) => {
    const proc = spawn("npx", ["vite", "--port", String(PORT), "--host", "127.0.0.1"], {
      cwd: CWD,
      stdio: ["ignore", "pipe", "pipe"],
      env: { ...process.env, NODE_ENV: "development" },
    });

    const timeout = setTimeout(() => {
      reject(new Error("Vite dev server did not start in time"));
    }, 30000);

    const handler = (data) => {
      const line = data.toString();
      if (line.includes("Local:") && line.includes(String(PORT))) {
        clearTimeout(timeout);
        resolve(proc);
      }
    };

    proc.stdout.on("data", handler);
    proc.stderr.on("data", handler);

    proc.on("error", (err) => {
      clearTimeout(timeout);
      reject(err);
    });
  });
}

function comparePNG(baselinePath, currentBuffer, testName) {
  if (!existsSync(baselinePath)) {
    writeFileSync(baselinePath, currentBuffer);
    console.log(`  Baseline saved: ${baselinePath}`);
    return { isNew: true, diffPixels: 0, totalPixels: 0 };
  }

  const baseline = PNG.sync.read(readFileSync(baselinePath));
  const current = PNG.sync.read(currentBuffer);

  if (baseline.width !== current.width || baseline.height !== current.height) {
    const newPath = baselinePath.replace(".png", ".new.png");
    writeFileSync(newPath, currentBuffer);
    return {
      isNew: false,
      diffPixels: baseline.width * baseline.height,
      totalPixels: baseline.width * baseline.height,
      sizeMismatch: true,
    };
  }

  const { width, height } = baseline;
  const diff = new PNG({ width, height });
  const numDiffPixels = pixelmatch(
    baseline.data,
    current.data,
    diff.data,
    width,
    height,
    { threshold: PIXEL_THRESHOLD }
  );

  const totalPixels = width * height;
  const diffPercent = (numDiffPixels / totalPixels) * 100;

  if (diffPercent > MAX_DIFF_PERCENT) {
    const diffPath = baselinePath.replace(".png", ".diff.png");
    const newPath = baselinePath.replace(".png", ".new.png");
    writeFileSync(diffPath, PNG.sync.write(diff));
    writeFileSync(newPath, currentBuffer);
    console.log(`  Diff saved: ${diffPath}`);
    console.log(`  New saved: ${newPath}`);
  }

  return { isNew: false, diffPixels: numDiffPixels, totalPixels, diffPercent };
}

// ---- Test Cases ----

async function testDefaultView(page) {
  console.log("\n=== Test: Default View Snapshot ===");

  await page.goto(`http://127.0.0.1:${PORT}`, { waitUntil: "networkidle", timeout: 30000 });
  console.log("  Page loaded");

  await page.waitForSelector("canvas", { timeout: 15000 });
  console.log("  Canvas found");

  // Wait for rendering to settle
  await page.waitForTimeout(3000);

  const screenshot = await page.screenshot({ type: "png" });
  const snapshotPath = join(SNAPSHOTS_DIR, "default-view.png");
  const result = comparePNG(snapshotPath, screenshot, "default-view");

  if (result.isNew) {
    console.log("  INFO: New baseline created (first run)");
    assert(true, "Default view snapshot baseline created");
  } else if (result.sizeMismatch) {
    assert(false, "Default view snapshot size mismatch");
  } else {
    console.log(`  Diff: ${result.diffPixels}/${result.totalPixels} pixels (${result.diffPercent.toFixed(2)}%)`);
    assert(
      result.diffPercent <= MAX_DIFF_PERCENT,
      `Default view snapshot matches baseline (${result.diffPercent.toFixed(2)}% diff, max ${MAX_DIFF_PERCENT}%)`
    );
  }
}

async function testSidebarCollapsed(page) {
  console.log("\n=== Test: Sidebar Collapsed Snapshot ===");

  await page.goto(`http://127.0.0.1:${PORT}`, { waitUntil: "networkidle", timeout: 30000 });
  await page.waitForSelector("canvas", { timeout: 15000 });
  await page.waitForTimeout(2000);

  // Find and click the sidebar collapse button
  const collapseBtn = await page.$('button[title="Collapse sidebar"]');
  if (collapseBtn) {
    await collapseBtn.click();
    await page.waitForTimeout(500);
    console.log("  Sidebar collapsed");
  } else {
    console.log("  SKIP: Collapse button not found, testing current state");
  }

  await page.waitForTimeout(1000);

  const screenshot = await page.screenshot({ type: "png" });
  const snapshotPath = join(SNAPSHOTS_DIR, "sidebar-collapsed.png");
  const result = comparePNG(snapshotPath, screenshot, "sidebar-collapsed");

  if (result.isNew) {
    console.log("  INFO: New baseline created (first run)");
    assert(true, "Sidebar collapsed snapshot baseline created");
  } else if (result.sizeMismatch) {
    assert(false, "Sidebar collapsed snapshot size mismatch");
  } else {
    console.log(`  Diff: ${result.diffPixels}/${result.totalPixels} pixels (${result.diffPercent.toFixed(2)}%)`);
    assert(
      result.diffPercent <= MAX_DIFF_PERCENT,
      `Sidebar collapsed snapshot matches baseline (${result.diffPercent.toFixed(2)}% diff, max ${MAX_DIFF_PERCENT}%)`
    );
  }
}

async function testMobileView(page) {
  console.log("\n=== Test: Mobile View Snapshot ===");

  await page.setViewportSize({ width: 375, height: 812 });

  await page.goto(`http://127.0.0.1:${PORT}`, { waitUntil: "networkidle", timeout: 30000 });
  await page.waitForSelector("canvas", { timeout: 15000 });
  console.log("  Canvas found (375×812)");

  // Wait for rendering to settle
  await page.waitForTimeout(3000);

  const screenshot = await page.screenshot({ type: "png" });
  const snapshotPath = join(SNAPSHOTS_DIR, "mobile-view.png");
  const result = comparePNG(snapshotPath, screenshot, "mobile-view");

  if (result.isNew) {
    console.log("  INFO: New baseline created (first run)");
    assert(true, "Mobile view snapshot baseline created");
  } else if (result.sizeMismatch) {
    assert(false, "Mobile view snapshot size mismatch");
  } else {
    console.log(`  Diff: ${result.diffPixels}/${result.totalPixels} pixels (${result.diffPercent.toFixed(2)}%)`);
    assert(
      result.diffPercent <= MAX_DIFF_PERCENT,
      `Mobile view snapshot matches baseline (${result.diffPercent.toFixed(2)}% diff, max ${MAX_DIFF_PERCENT}%)`
    );
  }
}

async function testDesktopSidebarExpanded(page) {
  console.log("\n=== Test: Desktop Sidebar Expanded ===");

  await page.setViewportSize({ width: 1280, height: 720 });

  await page.goto(`http://127.0.0.1:${PORT}`, { waitUntil: "networkidle", timeout: 30000 });
  await page.waitForSelector("canvas", { timeout: 15000 });
  console.log("  Canvas found (1280×720, sidebar expanded)");

  await page.waitForTimeout(3000);

  const screenshot = await page.screenshot({ type: "png" });
  const snapshotPath = join(SNAPSHOTS_DIR, "desktop-sidebar-expanded.png");
  const result = comparePNG(snapshotPath, screenshot, "desktop-sidebar-expanded");

  if (result.isNew) {
    console.log("  INFO: New baseline created (first run)");
    assert(true, "Desktop sidebar expanded snapshot baseline created");
  } else if (result.sizeMismatch) {
    assert(false, "Desktop sidebar expanded snapshot size mismatch");
  } else {
    console.log(`  Diff: ${result.diffPixels}/${result.totalPixels} pixels (${result.diffPercent.toFixed(2)}%)`);
    assert(
      result.diffPercent <= MAX_DIFF_PERCENT,
      `Desktop sidebar expanded snapshot matches baseline (${result.diffPercent.toFixed(2)}% diff, max ${MAX_DIFF_PERCENT}%)`
    );
  }
}

/**
 * Enable "Structure" labels by clicking the correct "Structure" button.
 * There are multiple "Structure" buttons (BONDS and LABELS sections).
 * The LABELS section's button is the second one.
 * Returns false if the button is disabled or not found.
 */
async function enableStructureLabels(page) {
  const structureBtns = await page.$$('button >> text="Structure"');
  // The second "Structure" button is in the LABELS section
  const btn = structureBtns.length >= 2 ? structureBtns[1] : structureBtns[0];
  if (!btn) return false;
  const disabled = await btn.getAttribute("disabled");
  if (disabled !== null) return false;
  await btn.click();
  return true;
}

async function testDesktopLabels(page) {
  console.log("\n=== Test: Desktop Labels Alignment ===");

  await page.setViewportSize({ width: 1280, height: 720 });

  await page.goto(`http://127.0.0.1:${PORT}`, { waitUntil: "networkidle", timeout: 30000 });
  await page.waitForSelector("canvas", { timeout: 15000 });
  await page.waitForTimeout(2000);

  // Enable "Structure" labels in the Appearance panel (LABELS section)
  if (await enableStructureLabels(page)) {
    console.log("  Labels enabled (Structure)");
  } else {
    console.log("  SKIP: Structure button not found");
  }

  await page.waitForTimeout(1500);

  const screenshot = await page.screenshot({ type: "png" });
  const snapshotPath = join(SNAPSHOTS_DIR, "desktop-labels.png");
  const result = comparePNG(snapshotPath, screenshot, "desktop-labels");

  if (result.isNew) {
    console.log("  INFO: New baseline created (first run)");
    assert(true, "Desktop labels snapshot baseline created");
  } else if (result.sizeMismatch) {
    assert(false, "Desktop labels snapshot size mismatch");
  } else {
    console.log(`  Diff: ${result.diffPixels}/${result.totalPixels} pixels (${result.diffPercent.toFixed(2)}%)`);
    assert(
      result.diffPercent <= MAX_DIFF_PERCENT,
      `Desktop labels snapshot matches baseline (${result.diffPercent.toFixed(2)}% diff, max ${MAX_DIFF_PERCENT}%)`
    );
  }
}

async function testMobileLabels(page) {
  console.log("\n=== Test: Mobile Labels Alignment ===");

  await page.setViewportSize({ width: 375, height: 812 });

  await page.goto(`http://127.0.0.1:${PORT}`, { waitUntil: "networkidle", timeout: 30000 });
  await page.waitForSelector("canvas", { timeout: 15000 });
  await page.waitForTimeout(2000);

  // Expand the Appearance panel to enable labels
  const appearanceBtn = await page.$('button[title="Open appearance panel"]');
  if (appearanceBtn) {
    await appearanceBtn.click();
    await page.waitForTimeout(500);
  }

  // Enable "Structure" labels
  if (await enableStructureLabels(page)) {
    console.log("  Labels enabled (Structure)");
  } else {
    console.log("  SKIP: Structure button not found");
  }

  // Collapse the Appearance panel back
  const collapseAppBtn = await page.$('button[title="Collapse panel"]');
  if (collapseAppBtn) {
    await collapseAppBtn.click();
    await page.waitForTimeout(500);
  }

  await page.waitForTimeout(1500);

  const screenshot = await page.screenshot({ type: "png" });
  const snapshotPath = join(SNAPSHOTS_DIR, "mobile-labels.png");
  const result = comparePNG(snapshotPath, screenshot, "mobile-labels");

  if (result.isNew) {
    console.log("  INFO: New baseline created (first run)");
    assert(true, "Mobile labels snapshot baseline created");
  } else if (result.sizeMismatch) {
    assert(false, "Mobile labels snapshot size mismatch");
  } else {
    console.log(`  Diff: ${result.diffPixels}/${result.totalPixels} pixels (${result.diffPercent.toFixed(2)}%)`);
    assert(
      result.diffPercent <= MAX_DIFF_PERCENT,
      `Mobile labels snapshot matches baseline (${result.diffPercent.toFixed(2)}% diff, max ${MAX_DIFF_PERCENT}%)`
    );
  }
}

// ---- Main ----

let server = null;
let browser = null;

try {
  mkdirSync(SNAPSHOTS_DIR, { recursive: true });

  if (UPDATE_MODE) {
    console.log("=== UPDATE MODE: Regenerating baselines ===\n");
    for (const name of [
      "default-view.png", "sidebar-collapsed.png",
      "mobile-view.png", "desktop-sidebar-expanded.png",
      "desktop-labels.png", "mobile-labels.png",
    ]) {
      const p = join(SNAPSHOTS_DIR, name);
      try { unlinkSync(p); } catch {}
    }
  }

  // Start Vite dev server
  console.log("Starting Vite dev server...");
  server = await startViteServer();
  console.log(`Vite dev server running on port ${PORT}`);

  // Launch headless Chromium via Playwright
  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const page = await context.newPage();

  // Run test cases
  await testDefaultView(page);
  await testSidebarCollapsed(page);
  await testDesktopSidebarExpanded(page);
  await testDesktopLabels(page);
  await testMobileView(page);
  await testMobileLabels(page);

  console.log("\n--- All E2E snapshot tests passed ---");
} catch (err) {
  console.error("E2E snapshot test failed:", err.message);
  process.exitCode = 1;
} finally {
  if (browser) await browser.close();
  if (server) server.kill();
}
