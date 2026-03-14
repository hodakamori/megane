/**
 * E2E snapshot test for the megane Jupyter widget.
 *
 * Launches JupyterLab (headless), creates notebooks with MolecularViewer
 * widgets, takes screenshots of the widget output, and compares against
 * baseline snapshots using pixelmatch.
 *
 * Usage:
 *   node tests/e2e/widget_snapshot.test.mjs [--update]
 *
 * Flags:
 *   --update  Re-generate baseline snapshots
 *
 * Requires:
 *   - playwright (with chromium)
 *   - jupyterlab installed and `megane` pip-installed
 */

import { createRequire } from "module";
import { spawn } from "child_process";
import { randomBytes } from "crypto";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  unlinkSync,
} from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CWD = join(__dirname, "..", "..");
const SNAPSHOTS_DIR = join(__dirname, "snapshots", "widget");

// Resolve Playwright from global installation
const _require = createRequire("/opt/node22/lib/node_modules/");
const { chromium } = _require("playwright");

// Resolve pixelmatch and pngjs from project node_modules
const { default: pixelmatch } = await import(
  join(CWD, "node_modules", "pixelmatch", "index.js")
);
const { PNG } = await import(
  join(CWD, "node_modules", "pngjs", "lib", "png.js")
);

const UPDATE_MODE = process.argv.includes("--update");
const TOKEN = randomBytes(16).toString("hex");
const PORT = 28888 + Math.floor(Math.random() * 1000);

// Pixel difference threshold (0-1, smaller = stricter)
const PIXEL_THRESHOLD = 0.15;
// Maximum allowed pixel diff percentage (slightly higher than app snapshots
// due to JupyterLab rendering variance)
const MAX_DIFF_PERCENT = 3.0;

// ---- Test Case Definitions ----

const TEST_CASES = [
  {
    name: "widget-caffeine-water",
    code: [
      "import warnings; warnings.filterwarnings('ignore', category=DeprecationWarning)",
      "import megane",
      "v = megane.MolecularViewer()",
      `v.load("${CWD}/tests/fixtures/caffeine_water.pdb")`,
      "v",
    ].join("\n"),
  },
  {
    name: "widget-perovskite",
    code: [
      "from megane.pipeline import _load_structure_file",
      "from megane.protocol import encode_snapshot",
      "import megane",
      "v = megane.MolecularViewer()",
      `structure = _load_structure_file("${CWD}/tests/fixtures/perovskite_srtio3_3x3x3.xyz")`,
      "v._snapshot_data = encode_snapshot(structure)",
      "v",
    ].join("\n"),
  },
];

// ---- Helpers ----

function assert(condition, message) {
  if (!condition) {
    console.error(`FAIL: ${message}`);
    process.exitCode = 1;
    throw new Error(message);
  }
  console.log(`PASS: ${message}`);
}

function createTestNotebook(path, code) {
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
        source: code.split("\n").map((line, i, arr) =>
          i < arr.length - 1 ? line + "\n" : line
        ),
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

async function dismissNotification(page) {
  // Hide all JupyterLab notification toasts via DOM removal
  await page.evaluate(() => {
    document
      .querySelectorAll(".jp-Notification-List, .lm-Toast-Content, .jp-Notification")
      .forEach((el) => el.remove());
    // Also hide by CSS as a fallback
    const style = document.createElement("style");
    style.textContent = `
      .jp-Notification-List, .lm-Toast, .jp-Notification,
      [class*="Notification"] { display: none !important; }
    `;
    document.head.appendChild(style);
  });
}

// Collect results for summary generation
const testResults = [];

async function runSnapshotTest(page, testCase) {
  const { name, code } = testCase;
  console.log(`\n=== Test: ${name} ===`);

  const nbPath = join(CWD, "tests", "e2e", `_test_widget_snap_${name}.ipynb`);
  const jsErrors = [];

  try {
    createTestNotebook(nbPath, code);

    // Set up error monitoring
    page.removeAllListeners("console");
    page.removeAllListeners("pageerror");
    page.on("console", (msg) => {
      if (msg.type() === "error") jsErrors.push(msg.text());
    });
    page.on("pageerror", (err) => jsErrors.push(err.message));

    // Navigate to notebook
    const nbUrl = `http://localhost:${PORT}/lab/tree/tests/e2e/_test_widget_snap_${name}.ipynb?token=${TOKEN}`;
    await page.goto(nbUrl, { timeout: 30000 });
    console.log("  Navigated to notebook");

    // Wait for notebook UI
    await page.waitForSelector(".jp-Notebook", { timeout: 20000 });
    console.log("  Notebook UI loaded");

    // Dismiss Jupyter notification popup if present
    await dismissNotification(page);

    // Wait for kernel to be ready
    await page
      .waitForSelector(
        '.jp-Notebook-ExecutionIndicator[data-status="idle"]',
        { timeout: 30000 }
      )
      .catch(() =>
        console.log("  Warning: kernel status indicator not found, continuing...")
      );
    await page.waitForTimeout(2000);

    // Execute the cell
    const cellInput = page
      .locator(".jp-Cell-inputArea .cm-editor .cm-content")
      .first();
    await cellInput.click();
    await page.keyboard.press("Shift+Enter");
    console.log("  Cell executed");

    // Wait for cell execution to complete
    try {
      await page.waitForFunction(
        () => {
          const prompts = document.querySelectorAll(".jp-InputPrompt");
          for (const p of prompts) {
            const text = p.textContent || "";
            if (
              text.includes("[") &&
              !text.includes("*") &&
              /\[\d+\]/.test(text)
            ) {
              return true;
            }
          }
          return false;
        },
        { timeout: 60000 }
      );
      console.log("  Cell execution completed");
    } catch {
      console.log("  Warning: Cell execution may not have completed within timeout");
    }

    // Wait for widget canvas
    const canvasSelector = ".jp-OutputArea canvas";
    try {
      await page.waitForSelector(canvasSelector, { timeout: 30000 });
      console.log("  Widget canvas appeared");
    } catch {
      console.log("  Warning: Canvas did not appear within timeout");
    }

    // Wait for Three.js rendering to settle
    await page.waitForTimeout(5000);

    // Dismiss any lingering notification popup before screenshot
    await dismissNotification(page);
    await page.waitForTimeout(500);

    // Take element screenshot of the widget output area (not full page)
    let screenshot;
    try {
      const widgetOutput = page.locator(".jp-OutputArea-child").first();
      screenshot = await widgetOutput.screenshot({ type: "png", timeout: 10000 });
    } catch {
      // Fallback: take a full-page screenshot if element screenshot fails
      console.log("  Warning: Element screenshot failed, using full page");
      screenshot = await page.screenshot({ type: "png" });
    }
    console.log("  Widget screenshot captured");

    // Compare with baseline
    const snapshotPath = join(SNAPSHOTS_DIR, `${name}.png`);
    const result = comparePNG(snapshotPath, screenshot, name);

    if (result.isNew) {
      console.log("  INFO: New baseline created (first run)");
      assert(true, `${name} snapshot baseline created`);
      testResults.push({ name, status: "new", diffPercent: 0 });
    } else if (result.sizeMismatch) {
      assert(false, `${name} snapshot size mismatch`);
      testResults.push({ name, status: "fail", diffPercent: 100, reason: "size mismatch" });
    } else {
      console.log(
        `  Diff: ${result.diffPixels}/${result.totalPixels} pixels (${result.diffPercent.toFixed(2)}%)`
      );
      const passed = result.diffPercent <= MAX_DIFF_PERCENT;
      testResults.push({
        name,
        status: passed ? "pass" : "fail",
        diffPercent: result.diffPercent,
      });
      assert(
        passed,
        `${name} snapshot matches baseline (${result.diffPercent.toFixed(2)}% diff, max ${MAX_DIFF_PERCENT}%)`
      );
    }

    // Log WebGL shader warnings (expected in headless mode)
    const shaderErrors = jsErrors.filter(
      (e) => e.includes("Shader Error") || e.includes("WebGLProgram")
    );
    if (shaderErrors.length > 0) {
      console.log(
        `  INFO: ${shaderErrors.length} WebGL shader error(s) (expected in headless mode)`
      );
    }

    console.log(`=== ${name}: DONE ===`);
  } finally {
    try {
      unlinkSync(nbPath);
    } catch {}
  }
}

function generateSummary() {
  const timestamp = new Date().toISOString().replace(/\.\d{3}Z$/, "");
  let md = `# Widget Snapshot Results - ${timestamp}\n\n`;

  for (const r of testResults) {
    md += `## ${r.name}\n`;
    if (r.status === "new") {
      md += `**NEW** baseline created\n\n`;
      md += `![${r.name}](${r.name}.png)\n\n`;
    } else if (r.status === "pass") {
      md += `**PASS** (${r.diffPercent.toFixed(2)}% diff)\n\n`;
      md += `![${r.name}](${r.name}.png)\n\n`;
    } else {
      const reason = r.reason ? ` - ${r.reason}` : "";
      md += `**FAIL** (${r.diffPercent.toFixed(2)}% diff, max ${MAX_DIFF_PERCENT}%)${reason}\n\n`;
      md += `| Baseline | Current | Diff |\n`;
      md += `|----------|---------|------|\n`;
      md += `| ![baseline](${r.name}.png) | ![current](${r.name}.new.png) | ![diff](${r.name}.diff.png) |\n\n`;
    }
  }

  const summaryPath = join(SNAPSHOTS_DIR, "summary.md");
  writeFileSync(summaryPath, md);
  console.log(`\nSummary written to: ${summaryPath}`);
}

// ---- Main ----

let server = null;
let browser = null;

try {
  mkdirSync(SNAPSHOTS_DIR, { recursive: true });

  if (UPDATE_MODE) {
    console.log("=== UPDATE MODE: Regenerating baselines ===\n");
    for (const tc of TEST_CASES) {
      const p = join(SNAPSHOTS_DIR, `${tc.name}.png`);
      try {
        unlinkSync(p);
      } catch {}
    }
  }

  // Start JupyterLab
  console.log("Starting JupyterLab...");
  server = spawn(
    "jupyter",
    [
      "lab",
      "--no-browser",
      "--allow-root",
      `--port=${PORT}`,
      `--IdentityProvider.token=${TOKEN}`,
      "--ServerApp.disable_check_xsrf=True",
      "--LabApp.news_url=''",
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

  // Launch browser (enable WebGL via SwiftShader for headless rendering)
  browser = await chromium.launch({
    headless: true,
    args: [
      "--use-gl=angle",
      "--use-angle=swiftshader",
      "--enable-webgl",
    ],
  });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
  });

  // Run test cases (use a fresh page per test to avoid stale state)
  for (const testCase of TEST_CASES) {
    const testPage = await context.newPage();
    await runSnapshotTest(testPage, testCase);
    await testPage.close();
  }

  // Generate markdown summary
  generateSummary();

  const failed = testResults.filter((r) => r.status === "fail").length;
  if (failed > 0) {
    console.log(`\n--- ${failed} snapshot test(s) FAILED ---`);
  } else {
    console.log("\n--- All widget snapshot tests passed ---");
  }
} catch (err) {
  console.error("Widget snapshot test failed:", err.message);
  process.exitCode = 1;
} finally {
  if (browser) await browser.close();
  if (server) server.kill();
}
