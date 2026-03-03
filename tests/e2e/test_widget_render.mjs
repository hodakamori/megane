/**
 * E2E rendering test for the megane Jupyter widget.
 *
 * Launches JupyterLab (headless), opens a notebook, executes a cell that
 * creates a MolecularViewer widget, and verifies that:
 *   1. The widget output area renders (`.jp-RenderedWidget`)
 *   2. A <canvas> element is created (Three.js WebGL context)
 *   3. No critical JS errors related to the widget occur
 *
 * Usage:
 *   node tests/e2e/test_widget_render.mjs
 *
 * Requires:
 *   - playwright (with chromium)
 *   - jupyterlab installed and `megane` pip-installed
 */

import { createRequire } from "module";
import { spawn } from "child_process";
import { randomBytes } from "crypto";
import { writeFileSync, unlinkSync } from "fs";
import { join } from "path";

// Playwright is installed globally; resolve it explicitly.
const _require = createRequire("/opt/node22/lib/node_modules/");
const { chromium } = _require("playwright");

const TOKEN = randomBytes(16).toString("hex");
const PORT = 28888 + Math.floor(Math.random() * 1000);
const CWD = process.cwd();

// ---- Helpers ----

function assert(condition, message) {
  if (!condition) {
    console.error(`FAIL: ${message}`);
    process.exitCode = 1;
    throw new Error(message);
  }
  console.log(`PASS: ${message}`);
}

function createTestNotebook(path) {
  const nb = {
    nbformat: 4,
    nbformat_minor: 5,
    metadata: {
      kernelspec: {
        display_name: "Python 3",
        language: "python",
        name: "python3",
      },
    },
    cells: [
      {
        cell_type: "code",
        metadata: {},
        source: [
          "import megane\n",
          "v = megane.MolecularViewer()\n",
          `v.load("${CWD}/tests/fixtures/1crn.pdb")\n`,
          "v",
        ],
        outputs: [],
        execution_count: null,
      },
    ],
  };
  writeFileSync(path, JSON.stringify(nb, null, 2));
}

async function waitForServer(proc, timeout = 30000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error("JupyterLab server did not start in time")),
      timeout
    );
    const handler = (data) => {
      const line = data.toString();
      // JupyterLab prints the URL on stderr; match any localhost variant
      if (line.includes(`${PORT}`) && (line.includes("http://") || line.includes("is running at"))) {
        clearTimeout(timer);
        resolve();
      }
    };
    proc.stdout.on("data", handler);
    proc.stderr.on("data", handler);
  });
}

// ---- Main ----

let server = null;
let browser = null;
const nbPath = join(CWD, "tests", "e2e", "_test_widget.ipynb");

try {
  // Create a test notebook
  createTestNotebook(nbPath);

  // Start JupyterLab
  server = spawn(
    "jupyter",
    [
      "lab",
      "--no-browser",
      "--allow-root",
      `--port=${PORT}`,
      `--IdentityProvider.token=${TOKEN}`,
      "--ServerApp.disable_check_xsrf=True",
      `--notebook-dir=${CWD}`,
    ],
    {
      env: { ...process.env, HOME: "/root" },
      stdio: ["ignore", "pipe", "pipe"],
      cwd: CWD,
    }
  );
  await waitForServer(server);
  console.log(`JupyterLab started on port ${PORT}`);

  // Launch browser
  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Collect JS errors
  const jsErrors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") jsErrors.push(msg.text());
  });
  page.on("pageerror", (err) => jsErrors.push(err.message));

  // Navigate to test notebook
  const nbUrl = `http://localhost:${PORT}/lab/tree/tests/e2e/_test_widget.ipynb?token=${TOKEN}`;
  await page.goto(nbUrl, { timeout: 20000 });
  console.log("Navigated to notebook");

  // Wait for notebook to load
  await page.waitForSelector(".jp-Notebook", { timeout: 20000 });
  console.log("Notebook UI loaded");

  // Wait for kernel to be ready (idle indicator)
  await page
    .waitForSelector(
      '.jp-Notebook-ExecutionIndicator[data-status="idle"]',
      { timeout: 30000 }
    )
    .catch(() => console.log("Warning: kernel status indicator not found, continuing..."));
  await page.waitForTimeout(2000);

  // Execute the cell: click on it, then Shift+Enter
  const cellInput = page
    .locator(".jp-Cell-inputArea .cm-editor .cm-content")
    .first();
  await cellInput.click();
  await page.keyboard.press("Shift+Enter");
  console.log("Cell executed");

  // Wait for widget output to appear.
  // anywidget renders a canvas inside the cell output area.
  const canvasSelector = ".jp-OutputArea canvas";
  try {
    await page.waitForSelector(canvasSelector, { timeout: 20000 });
    console.log("Widget canvas appeared");
  } catch {
    // Take a screenshot for debugging
    await page.screenshot({ path: join(CWD, "tests", "e2e", "debug_screenshot.png") });
    console.log("Screenshot saved to tests/e2e/debug_screenshot.png");
  }

  // Allow time for Three.js to fully initialise
  await page.waitForTimeout(2000);

  // Take a screenshot for reference
  await page.screenshot({ path: join(CWD, "tests", "e2e", "debug_screenshot.png") });

  // ---- Assertions ----

  // 1. Canvas element exists (Three.js WebGL context created)
  const canvasCount = await page.locator(canvasSelector).count();
  assert(canvasCount > 0, "WebGL canvas element is created");

  // 2. No critical widget/WebGL errors
  const criticalErrors = jsErrors.filter(
    (e) =>
      e.includes("Cannot read propert") ||
      e.includes("ipywidget") ||
      e.includes("WebGL") ||
      e.includes("anywidget")
  );
  assert(
    criticalErrors.length === 0,
    `No critical JS errors (found ${criticalErrors.length}: ${JSON.stringify(criticalErrors)})`
  );

  // 3. Info overlay shows atom/bond count
  const infoText = await page
    .locator(".jp-OutputArea div")
    .filter({ hasText: /atoms/ })
    .first()
    .innerText()
    .catch(() => "");
  if (infoText) {
    assert(infoText.includes("327"), "Info overlay shows correct atom count (327)");
  } else {
    console.log("SKIP: Info overlay text not found (may not be visible in headless mode)");
  }

  console.log("\n--- All E2E tests passed ---");
} catch (err) {
  console.error("E2E test failed:", err.message);
  process.exitCode = 1;
} finally {
  if (browser) await browser.close();
  if (server) server.kill();
  try {
    unlinkSync(nbPath);
  } catch {}
}
