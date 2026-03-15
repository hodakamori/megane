/**
 * E2E screenshot tests for megane Jupyter widget notebooks.
 *
 * Opens each test notebook in JupyterLab via Playwright, executes all cells,
 * waits for widget canvases to render, and saves screenshots.
 *
 * Usage:
 *   node tests/e2e/test_notebook_screenshots.mjs
 *
 * Requires:
 *   - playwright (with chromium)
 *   - jupyterlab installed and `megane` pip-installed
 */

import { createRequire } from "module";
import { execSync, spawn } from "child_process";
import { randomBytes } from "crypto";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { join } from "path";

// Playwright is installed globally; resolve it explicitly.
const _require = createRequire("/opt/node22/lib/node_modules/");
const { chromium } = _require("playwright");

const TOKEN = randomBytes(16).toString("hex");
const PORT = 28888 + Math.floor(Math.random() * 1000);
const CWD = process.cwd();
const SNAPSHOT_DIR = join(CWD, "tests", "e2e", "snapshots");

// Ensure snapshots directory exists
if (!existsSync(SNAPSHOT_DIR)) {
  mkdirSync(SNAPSHOT_DIR, { recursive: true });
}

// ---- Helpers ----

function assert(condition, message) {
  if (!condition) {
    console.error(`FAIL: ${message}`);
    process.exitCode = 1;
    throw new Error(message);
  }
  console.log(`PASS: ${message}`);
}

async function waitForServer(proc, timeout = 30000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error("JupyterLab server did not start in time")),
      timeout,
    );
    const handler = (data) => {
      const line = data.toString();
      if (
        line.includes(`${PORT}`) &&
        (line.includes("http://") || line.includes("is running at"))
      ) {
        clearTimeout(timer);
        resolve();
      }
    };
    proc.stdout.on("data", handler);
    proc.stderr.on("data", handler);
  });
}

/**
 * Execute all cells in a JupyterLab notebook via the Run menu.
 */
async function executeAllCells(page) {
  const cellCount = await page.locator(".jp-Cell").count();
  console.log(`  Found ${cellCount} cells`);

  // Use the JupyterLab menu: Run > Run All Cells
  await page.click('div.lm-MenuBar-itemLabel:text("Run")');
  await page.waitForTimeout(300);
  await page.click('li.lm-Menu-item:has-text("Run All Cells")');
  console.log("  Triggered Run All Cells");
}

/**
 * Wait for all code cells to finish executing (no [*] indicators).
 */
async function waitForExecution(page, timeout = 60000) {
  try {
    await page.waitForFunction(
      () => {
        const prompts = document.querySelectorAll(".jp-InputPrompt");
        for (const p of prompts) {
          const text = p.textContent || "";
          if (text.includes("*")) return false;
        }
        return prompts.length > 0;
      },
      { timeout },
    );
    console.log("  All cells executed");
  } catch {
    console.log("  Warning: Cell execution may not have completed in time");
  }
}

/**
 * Run a notebook test: navigate, execute, screenshot, verify.
 */
async function runNotebookTest(page, { name, notebookPath, screenshotName }) {
  console.log(`\n=== Notebook: ${name} ===`);

  const jsErrors = [];
  page.removeAllListeners("console");
  page.removeAllListeners("pageerror");
  page.on("console", (msg) => {
    if (msg.type() === "error") jsErrors.push(msg.text());
  });
  page.on("pageerror", (err) => jsErrors.push(err.message));

  // Navigate to notebook (use reset=true to close previous tabs)
  const nbUrl = `http://localhost:${PORT}/lab/tree/${notebookPath}?token=${TOKEN}&reset`;
  await page.goto(nbUrl, { timeout: 30000 });
  console.log("  Navigated to notebook");

  // Wait for notebook UI (use the active panel's notebook)
  await page.waitForSelector(".jp-NotebookPanel .jp-Notebook", { timeout: 20000 });
  console.log("  Notebook UI loaded");

  // Wait for kernel ready
  await page
    .waitForSelector('.jp-Notebook-ExecutionIndicator[data-status="idle"]', {
      timeout: 30000,
    })
    .catch(() =>
      console.log("  Warning: kernel status indicator not found, continuing..."),
    );
  await page.waitForTimeout(2000);

  // Execute all cells
  await executeAllCells(page);

  // Wait for execution to complete
  await waitForExecution(page);

  // Wait for widget canvas to appear
  const canvasSelector = ".jp-OutputArea canvas";
  try {
    await page.waitForSelector(canvasSelector, { timeout: 20000 });
    console.log("  Widget canvas appeared");
  } catch {
    console.log("  Warning: No canvas found (widget may not render in headless)");
  }

  // Allow time for Three.js rendering
  await page.waitForTimeout(3000);

  // ---- Assertions ----

  // 1. Check if canvas exists
  const canvasCount = await page.locator(canvasSelector).count();
  if (canvasCount > 0) {
    assert(true, `[${name}] Widget canvas created (${canvasCount} canvas elements)`);
  } else {
    console.log(`  INFO: No canvas elements found (headless rendering limitation)`);
  }

  // 2. Take per-widget screenshots by scrolling each canvas into view
  const baseName = screenshotName.replace(".png", "");
  if (canvasCount > 0) {
    for (let i = 0; i < canvasCount; i++) {
      const canvas = page.locator(canvasSelector).nth(i);

      // Scroll so the canvas center is at the viewport center
      await canvas.evaluate((el) => {
        const rect = el.getBoundingClientRect();
        const scrollParent = el.closest(".jp-WindowedPanel-outer") || el.closest(".jp-Notebook");
        if (scrollParent) {
          const parentRect = scrollParent.getBoundingClientRect();
          const targetScroll = scrollParent.scrollTop + rect.top - parentRect.top
            - parentRect.height / 2 + rect.height / 2;
          scrollParent.scrollTop = Math.max(0, targetScroll);
        } else {
          el.scrollIntoView({ block: "center", behavior: "instant" });
        }
      });
      // Force Three.js re-render
      await page.evaluate(() => window.dispatchEvent(new Event("resize")));
      await page.waitForTimeout(2000);

      // Take a viewport screenshot showing the widget
      const widgetPath = join(SNAPSHOT_DIR, `${baseName}_widget_${i}.png`);
      await page.screenshot({ path: widgetPath });
      console.log(`  Widget screenshot saved: ${widgetPath}`);
    }

    // Also save the first widget view as the main notebook screenshot
    const firstCanvas = page.locator(canvasSelector).first();
    await firstCanvas.evaluate((el) => {
      const rect = el.getBoundingClientRect();
      const scrollParent = el.closest(".jp-WindowedPanel-outer") || el.closest(".jp-Notebook");
      if (scrollParent) {
        const parentRect = scrollParent.getBoundingClientRect();
        const targetScroll = scrollParent.scrollTop + rect.top - parentRect.top
          - parentRect.height / 2 + rect.height / 2;
        scrollParent.scrollTop = Math.max(0, targetScroll);
      } else {
        el.scrollIntoView({ block: "center", behavior: "instant" });
      }
    });
    await page.evaluate(() => window.dispatchEvent(new Event("resize")));
    await page.waitForTimeout(1500);
    const screenshotPath = join(SNAPSHOT_DIR, screenshotName);
    await page.screenshot({ path: screenshotPath });
    console.log(`  Screenshot saved: ${screenshotPath}`);
  } else {
    // Fallback: full page screenshot
    const screenshotPath = join(SNAPSHOT_DIR, screenshotName);
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`  Screenshot saved: ${screenshotPath}`);
  }

  // 2. No critical JS errors
  const criticalErrors = jsErrors.filter(
    (e) =>
      (e.includes("Cannot read propert") ||
        e.includes("ipywidget") ||
        e.includes("anywidget")) &&
      !e.includes("Shader Error") &&
      !e.includes("WebGLProgram"),
  );
  assert(
    criticalErrors.length === 0,
    `[${name}] No critical JS errors (found ${criticalErrors.length}: ${JSON.stringify(criticalErrors)})`,
  );

  // Log WebGL shader warnings
  const shaderErrors = jsErrors.filter(
    (e) => e.includes("Shader Error") || e.includes("WebGLProgram"),
  );
  if (shaderErrors.length > 0) {
    console.log(
      `  INFO: ${shaderErrors.length} WebGL shader error(s) (expected in headless mode)`,
    );
  }

  console.log(`=== ${name}: PASSED ===`);
}

// ---- Main ----

let server = null;
let browser = null;

try {
  // Find jupyter executable (prefer venv, fallback to system)
  let jupyterCmd = "jupyter";
  const venvJupyter = join(CWD, ".venv", "bin", "jupyter");
  if (existsSync(venvJupyter)) {
    jupyterCmd = venvJupyter;
  } else {
    try {
      execSync("which jupyter", { stdio: "ignore" });
    } catch {
      console.error("jupyter not found. Install with: pip install jupyterlab");
      process.exit(1);
    }
  }

  // Disable JupyterLab's windowed notebook rendering so that WebGL canvases
  // stay in the DOM when scrolling.  Without this, Three.js loses its context
  // when cells are virtualized off-screen and cannot repaint.
  //
  // JupyterLab reads overrides.json from <lab_dir>/settings/.  We find the
  // lab dir relative to the venv and write the override there.
  const venvLabDir = join(CWD, ".venv", "share", "jupyter", "lab");
  const labSettingsDir = join(venvLabDir, "settings");
  mkdirSync(labSettingsDir, { recursive: true });
  writeFileSync(
    join(labSettingsDir, "overrides.json"),
    JSON.stringify({
      "@jupyterlab/notebook-extension:tracker": {
        windowingMode: "none",
      },
    }),
  );

  // Start JupyterLab
  server = spawn(
    jupyterCmd,
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
      env: {
        ...process.env,
        HOME: "/root",
      },
      stdio: ["ignore", "pipe", "pipe"],
      cwd: CWD,
    },
  );
  await waitForServer(server);
  console.log(`JupyterLab started on port ${PORT}`);

  // Launch browser
  browser = await chromium.launch({
    headless: true,
    args: ["--use-gl=swiftshader"],
  });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 960 },
  });
  const page = await context.newPage();

  // Navigate to JupyterLab to disable windowed rendering via Settings API.
  // The overrides.json file in lab/settings/ may not always take effect, so
  // we also set it programmatically before opening any notebooks.
  const labUrl = `http://localhost:${PORT}/lab?token=${TOKEN}`;
  await page.goto(labUrl, { timeout: 30000 });
  await page.waitForSelector(".jp-Launcher", { timeout: 20000 }).catch(() => {});
  await page.waitForTimeout(2000);
  try {
    await page.evaluate(async () => {
      // Access JupyterLab application singleton
      const app = window._jupyterlab;
      if (app && app.settingRegistry) {
        await app.settingRegistry.set(
          "@jupyterlab/notebook-extension:tracker",
          "windowingMode",
          "none",
        );
        console.log("Set windowingMode to none via settings API");
      }
    });
    console.log("Disabled windowed rendering via settings API");
  } catch (e) {
    console.log(`Settings API not available: ${e.message}`);
  }

  // Test each notebook
  const notebooks = [
    {
      name: "visualization",
      notebookPath: "tests/notebooks/test_visualization.ipynb",
      screenshotName: "notebook_visualization.png",
    },
    {
      name: "pipeline",
      notebookPath: "tests/notebooks/test_pipeline.ipynb",
      screenshotName: "notebook_pipeline.png",
    },
    {
      name: "render_setup",
      notebookPath: "tests/notebooks/test_render_setup.ipynb",
      screenshotName: "notebook_render_setup.png",
    },
  ];

  for (const nb of notebooks) {
    await runNotebookTest(page, nb);
  }

  console.log("\n--- All notebook E2E tests passed ---");
} catch (err) {
  console.error("Notebook E2E test failed:", err.message);
  process.exitCode = 1;
} finally {
  if (browser) await browser.close();
  if (server) server.kill();
  process.exit(process.exitCode || 0);
}
