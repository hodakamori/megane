/**
 * E2E rendering test for the megane Jupyter widget.
 *
 * Launches JupyterLab (headless), opens a notebook, executes a cell that
 * creates a MolecularViewer widget, and verifies that:
 *   1. The widget output area renders (`.jp-RenderedWidget`)
 *   2. A <canvas> element is created (Three.js WebGL context)
 *   3. No critical JS errors related to the widget occur
 *   4. (100k test) Canvas contains non-white pixels (atoms rendered)
 *
 * Usage:
 *   node tests/e2e/test_widget_render.mjs
 *
 * Requires:
 *   - playwright (with chromium)
 *   - jupyterlab installed and `megane` pip-installed
 */

import { spawn } from "child_process";
import { randomBytes } from "crypto";
import { writeFileSync, unlinkSync } from "fs";
import { join } from "path";
import { getChromium } from "./utils/playwright.mjs";

const chromium = getChromium();

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

function createTestNotebook(path, pdbPath) {
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
          `v.load("${pdbPath}")\n`,
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

/**
 * Check if a WebGL canvas contains non-white pixels (i.e. something was rendered).
 * Returns { hasContent, totalPixels, nonWhitePixels }.
 */
async function checkCanvasHasContent(page, canvasSelector) {
  return page.evaluate((sel) => {
    const canvas = document.querySelector(sel);
    if (!canvas) return { hasContent: false, totalPixels: 0, nonWhitePixels: 0 };

    // Read pixels from WebGL canvas
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    if (!gl) {
      // Fallback: try 2D context (unlikely for Three.js)
      const ctx = canvas.getContext("2d");
      if (!ctx) return { hasContent: false, totalPixels: 0, nonWhitePixels: 0 };
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      let nonWhite = 0;
      for (let i = 0; i < imageData.data.length; i += 4) {
        if (imageData.data[i] < 250 || imageData.data[i + 1] < 250 || imageData.data[i + 2] < 250) {
          nonWhite++;
        }
      }
      const total = canvas.width * canvas.height;
      return { hasContent: nonWhite > total * 0.001, totalPixels: total, nonWhitePixels: nonWhite };
    }

    // WebGL path
    const width = gl.drawingBufferWidth;
    const height = gl.drawingBufferHeight;
    const pixels = new Uint8Array(width * height * 4);
    gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

    let nonWhite = 0;
    const total = width * height;
    for (let i = 0; i < pixels.length; i += 4) {
      if (pixels[i] < 250 || pixels[i + 1] < 250 || pixels[i + 2] < 250) {
        nonWhite++;
      }
    }

    return { hasContent: nonWhite > total * 0.001, totalPixels: total, nonWhitePixels: nonWhite };
  }, canvasSelector);
}

/**
 * Run a single test case: load a PDB file and verify rendering.
 */
async function runTestCase(page, { name, pdbPath, screenshotName, expectedAtoms, checkPixels }) {
  console.log(`\n=== Test: ${name} ===`);

  const nbPath = join(CWD, "tests", "e2e", `_test_${name}.ipynb`);
  const jsErrors = [];

  try {
    // Create notebook
    createTestNotebook(nbPath, pdbPath);

    // Clear previous errors
    page.removeAllListeners("console");
    page.removeAllListeners("pageerror");
    page.on("console", (msg) => {
      if (msg.type() === "error") jsErrors.push(msg.text());
    });
    page.on("pageerror", (err) => jsErrors.push(err.message));

    // Navigate to test notebook
    const nbUrl = `http://localhost:${PORT}/lab/tree/tests/e2e/_test_${name}.ipynb?token=${TOKEN}`;
    await page.goto(nbUrl, { timeout: 30000 });
    console.log("Navigated to notebook");

    // Wait for notebook to load
    await page.waitForSelector(".jp-Notebook", { timeout: 20000 });
    console.log("Notebook UI loaded");

    // Wait for kernel to be ready
    await page
      .waitForSelector(
        '.jp-Notebook-ExecutionIndicator[data-status="idle"]',
        { timeout: 30000 }
      )
      .catch(() => console.log("Warning: kernel status indicator not found, continuing..."));
    await page.waitForTimeout(2000);

    // Execute the cell
    const cellInput = page
      .locator(".jp-Cell-inputArea .cm-editor .cm-content")
      .first();
    await cellInput.click();
    await page.keyboard.press("Shift+Enter");
    console.log("Cell executed");

    // Wait for cell execution to complete (execution count changes from [*] to a number)
    const execTimeout = expectedAtoms > 10000 ? 120000 : 30000;
    try {
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
        { timeout: execTimeout }
      );
      console.log("Cell execution completed");
    } catch {
      console.log(`Warning: Cell execution may not have completed within ${execTimeout}ms`);
    }

    // Wait for widget canvas
    const canvasSelector = ".jp-OutputArea canvas";
    const waitTimeout = expectedAtoms > 10000 ? 60000 : 20000;
    try {
      await page.waitForSelector(canvasSelector, { timeout: waitTimeout });
      console.log("Widget canvas appeared");
    } catch {
      await page.screenshot({ path: join(CWD, "tests", "e2e", `${screenshotName}`) });
      console.log(`Screenshot saved to tests/e2e/${screenshotName}`);
    }

    // Allow time for Three.js rendering (more time for large structures)
    const renderWait = expectedAtoms > 10000 ? 5000 : 2000;
    await page.waitForTimeout(renderWait);

    // Take screenshot
    await page.screenshot({ path: join(CWD, "tests", "e2e", screenshotName) });
    console.log(`Screenshot saved: tests/e2e/${screenshotName}`);

    // ---- Assertions ----

    // 1. Canvas element exists
    const canvasCount = await page.locator(canvasSelector).count();
    assert(canvasCount > 0, `[${name}] WebGL canvas element is created`);

    // 2. No critical JS errors (exclude WebGL shader errors which occur in headless mode)
    const criticalErrors = jsErrors.filter(
      (e) =>
        (e.includes("Cannot read propert") ||
        e.includes("ipywidget") ||
        e.includes("anywidget")) &&
        !e.includes("Shader Error") &&
        !e.includes("WebGLProgram")
    );
    assert(
      criticalErrors.length === 0,
      `[${name}] No critical JS errors (found ${criticalErrors.length}: ${JSON.stringify(criticalErrors)})`
    );

    // Log WebGL shader warnings (expected in headless mode without GPU)
    const shaderErrors = jsErrors.filter((e) => e.includes("Shader Error") || e.includes("WebGLProgram"));
    if (shaderErrors.length > 0) {
      console.log(`  INFO: ${shaderErrors.length} WebGL shader error(s) (expected in headless mode)`);
    }

    // 3. Check canvas has rendered content (non-white pixels)
    if (checkPixels) {
      const result = await checkCanvasHasContent(page, canvasSelector);
      console.log(`  Canvas: ${result.nonWhitePixels}/${result.totalPixels} non-white pixels`);
      assert(
        result.hasContent,
        `[${name}] Canvas contains rendered atoms (${result.nonWhitePixels} non-white pixels)`
      );
    }

    // 4. Info overlay (optional check)
    if (expectedAtoms) {
      const infoText = await page
        .locator(".jp-OutputArea div")
        .filter({ hasText: /atoms/ })
        .first()
        .innerText()
        .catch(() => "");
      if (infoText) {
        // Strip commas for numeric comparison (e.g. "100,002" -> "100002")
        const normalizedText = infoText.replace(/,/g, "");
        assert(
          normalizedText.includes(String(expectedAtoms)),
          `[${name}] Info overlay shows correct atom count (${expectedAtoms})`
        );
      } else {
        console.log(`  SKIP: Info overlay text not found (may not be visible in headless mode)`);
      }
    }

    console.log(`=== ${name}: PASSED ===`);
  } finally {
    try { unlinkSync(nbPath); } catch {}
  }
}

// ---- Main ----

let server = null;
let browser = null;

try {
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

  // Test 1: Small molecule (1CRN, 327 atoms)
  await runTestCase(page, {
    name: "1crn",
    pdbPath: `${CWD}/tests/fixtures/1crn.pdb`,
    screenshotName: "screenshot_1crn.png",
    expectedAtoms: 327,
    checkPixels: true,
  });

  // Test 2: Large structure (100k water molecules)
  await runTestCase(page, {
    name: "water_100k",
    pdbPath: `${CWD}/tests/fixtures/water_100k.pdb`,
    screenshotName: "screenshot_water_100k.png",
    expectedAtoms: 100002,
    checkPixels: true,
  });

  console.log("\n--- All E2E tests passed ---");
} catch (err) {
  console.error("E2E test failed:", err.message);
  process.exitCode = 1;
} finally {
  if (browser) await browser.close();
  if (server) {
    server.kill();
    server.stdout?.destroy();
    server.stderr?.destroy();
    server.unref();
    // Fire-and-forget SIGKILL fallback; unref'd so it doesn't block exit.
    setTimeout(() => { try { server.kill('SIGKILL'); } catch {} }, 3000).unref();
  }
}
