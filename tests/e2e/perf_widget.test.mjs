/**
 * Performance budget test for the megane ipywidget.
 *
 * Loads water_100k.pdb in a Jupyter Lab notebook and asserts:
 *   - megane:widget-mount  ms      ≤ 4000   (anywidget render → root mount)
 *   - megane:wasm-init     ms      ≤ 1500   (one-time per page)
 *   - megane:first-render  ms      ≤ 5000   (large structure)
 *   - steady FPS                   ≥ 20
 *   - heap usage           bytes   ≤ 1.5 GB
 *
 * Persists raw measurements to tests/e2e/perf_widget.json.
 */

import { spawn } from "child_process";
import { randomBytes } from "crypto";
import { writeFileSync, unlinkSync } from "fs";
import { join } from "path";
import { assert } from "./utils/assert.mjs";
import {
  REPO_ROOT,
  getChromium,
  setupPerfHooks,
  collectPerf,
  analyzeFrames,
  saveScreenshot,
  savePerfJson,
  sleep,
} from "./utils/playwright.mjs";

const FIXTURES = join(REPO_ROOT, "tests", "fixtures");
const TOKEN = randomBytes(16).toString("hex");
const PORT = 28900 + Math.floor(Math.random() * 100);

const BUDGETS = {
  widgetMountMs: 4000,
  wasmInitMs: 1500,
  firstRenderMs: 5000,
  steadyFpsMin: 20,
  heapMaxBytes: 1500 * 1024 * 1024,
};

function buildNotebook(targetPath) {
  const pdb = join(FIXTURES, "water_100k.pdb");
  const nb = {
    nbformat: 4,
    nbformat_minor: 5,
    metadata: { kernelspec: { display_name: "Python 3", language: "python", name: "python3" } },
    cells: [
      {
        cell_type: "code",
        metadata: {},
        source: [
          "import warnings\n",
          "warnings.filterwarnings('ignore')\n",
          "import megane\n",
          "viewer = megane.MolecularViewer()\n",
          `viewer.load(${JSON.stringify(pdb)})\n`,
          "viewer\n",
        ],
        outputs: [],
        execution_count: null,
      },
    ],
  };
  writeFileSync(targetPath, JSON.stringify(nb, null, 2));
}

function spawnLab() {
  return new Promise((resolve, reject) => {
    const proc = spawn(
      "jupyter",
      [
        "lab",
        "--no-browser",
        "--allow-root",
        `--port=${PORT}`,
        `--IdentityProvider.token=${TOKEN}`,
        "--ServerApp.disable_check_xsrf=True",
        `--notebook-dir=${REPO_ROOT}`,
      ],
      {
        env: { ...process.env, HOME: process.env.HOME || "/root" },
        stdio: ["ignore", "pipe", "pipe"],
        cwd: REPO_ROOT,
      },
    );
    const timer = setTimeout(() => reject(new Error("JupyterLab did not start in time")), 90000);
    const handler = (data) => {
      const line = data.toString();
      if (line.includes(String(PORT)) && (line.includes("http://") || line.includes("is running at"))) {
        clearTimeout(timer);
        resolve(proc);
      }
    };
    proc.stdout.on("data", handler);
    proc.stderr.on("data", handler);
    proc.on("error", (err) => { clearTimeout(timer); reject(err); });
  });
}

let server = null;
let browser = null;
const nbPath = join(REPO_ROOT, "tests", "e2e", "_test_perf_widget.ipynb");

try {
  buildNotebook(nbPath);

  console.log("Starting JupyterLab...");
  server = await spawnLab();
  console.log(`JupyterLab running on port ${PORT}`);

  const chromium = getChromium();
  browser = await chromium.launch({ headless: true, args: ["--use-gl=swiftshader"] });
  const context = await browser.newContext({ viewport: { width: 1280, height: 960 } });
  await setupPerfHooks(context);

  const page = await context.newPage();
  page.on("pageerror", (err) => console.log(`  [pageerror] ${err.message}`));

  const url = `http://localhost:${PORT}/lab/tree/tests/e2e/_test_perf_widget.ipynb?token=${TOKEN}`;
  await page.goto(url, { timeout: 30000 });
  await page.waitForSelector(".jp-Notebook", { timeout: 20000 });

  // Wait for kernel idle
  await page
    .waitForSelector('.jp-Notebook-ExecutionIndicator[data-status="idle"]', { timeout: 60000 })
    .catch(() => {});
  await sleep(1500);

  // Run the cell
  await page.locator(".jp-Cell-inputArea .cm-editor .cm-content").first().click();
  await page.keyboard.press("Shift+Enter");

  // Wait for canvas
  await page.waitForSelector(".jp-OutputArea canvas", { timeout: 120000 });
  console.log("widget canvas appeared");
  // Allow load + initial render to settle
  await sleep(5000);

  // Reset frame buffer and observe steady FPS for 5 seconds
  await page.evaluate(() => { window.__meganeFrameTimes = []; });
  await sleep(5000);

  const perf = await collectPerf(page);
  const frames = analyzeFrames(perf.frameTimes);

  function pick(predicate) {
    const m = perf.measures.find(predicate);
    return m ? m.duration : null;
  }
  const widgetMountMs = pick((m) => m.name === "megane:widget-mount");
  const wasmInitMs = pick((m) => m.name === "megane:wasm-init");
  const firstRenderMs = pick((m) => m.name === "megane:first-render");

  const out = {
    budgets: BUDGETS,
    measurements: {
      widgetMountMs,
      wasmInitMs,
      firstRenderMs,
      fps: frames ? frames.fps : null,
      stutterRatio: frames ? frames.stutterRatio : null,
      heapBytes: perf.heap,
    },
    raw: perf,
  };
  savePerfJson("widget", out);
  await saveScreenshot(page, "perf-widget.png");

  console.log(`  widget-mount   = ${widgetMountMs?.toFixed(1)} ms (budget ${BUDGETS.widgetMountMs})`);
  console.log(`  wasm-init      = ${wasmInitMs?.toFixed(1)} ms (budget ${BUDGETS.wasmInitMs})`);
  console.log(`  first-render   = ${firstRenderMs?.toFixed(1)} ms (budget ${BUDGETS.firstRenderMs})`);
  console.log(`  steady fps     = ${frames?.fps?.toFixed(1)} (budget ≥ ${BUDGETS.steadyFpsMin})`);
  console.log(`  heap           = ${(perf.heap ?? 0) / (1024 * 1024)} MB (budget ${BUDGETS.heapMaxBytes / (1024 * 1024)} MB)`);

  if (widgetMountMs !== null) assert(widgetMountMs <= BUDGETS.widgetMountMs, `widget-mount ≤ ${BUDGETS.widgetMountMs} ms`);
  if (wasmInitMs !== null) assert(wasmInitMs <= BUDGETS.wasmInitMs, `wasm-init ≤ ${BUDGETS.wasmInitMs} ms`);
  if (firstRenderMs !== null) assert(firstRenderMs <= BUDGETS.firstRenderMs, `first-render ≤ ${BUDGETS.firstRenderMs} ms`);
  if (frames) assert(frames.fps >= BUDGETS.steadyFpsMin, `steady FPS ≥ ${BUDGETS.steadyFpsMin}`);
  if (perf.heap !== null && perf.heap !== undefined) assert(perf.heap <= BUDGETS.heapMaxBytes, `heap ≤ ${BUDGETS.heapMaxBytes / (1024 * 1024)} MB`);

  if (process.exitCode === 1) {
    console.log("\n--- perf_widget: SOME BUDGETS EXCEEDED ---");
  } else {
    console.log("\n--- perf_widget: WITHIN BUDGET ---");
  }
} catch (err) {
  console.error("perf_widget fatal:", err);
  process.exitCode = 1;
} finally {
  try { unlinkSync(nbPath); } catch {}
  if (browser) await browser.close().catch(() => {});
  if (server) {
    try { server.kill(); } catch {}
    try { server.stdout?.destroy(); } catch {}
    try { server.stderr?.destroy(); } catch {}
    try { server.unref(); } catch {}
    setTimeout(() => { try { server.kill("SIGKILL"); } catch {} }, 3000).unref();
  }
}
