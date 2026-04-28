/**
 * Shared utilities for Playwright-based E2E tests in megane.
 *
 * Provides:
 *   - getChromium()           Resolve Playwright from the global node_modules
 *   - startViteServer(opts)   Spawn `npx vite` and wait for ready
 *   - startJupyterLab(opts)   Spawn `jupyter lab` and wait for ready
 *   - startCodeServer(opts)   Spawn `code-server` and wait for ready
 *   - waitForCanvasNonEmpty   Poll the WebGL canvas until pixels are drawn
 *   - readCanvasPixels        Read drawingBuffer and count non-white pixels
 *   - setupPerfHooks          Enable window.__MEGANE_PERF__ via addInitScript
 *   - collectPerf             Collect performance.measure entries + frame times + heap
 *   - saveScreenshot          Persist a screenshot under tests/e2e/snapshots/
 *   - randomPort              Generate a random ephemeral port within a range
 *   - sleep                   Promise-based sleep
 *
 * Conventions:
 *   - All tests must use this module (do not duplicate the createRequire of Playwright)
 *   - Screenshots go to tests/e2e/snapshots/<name>.png
 *   - perf JSON goes to tests/e2e/perf_<name>.json
 */

import { spawn } from "child_process";
import { createRequire } from "module";
import { mkdirSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
export const REPO_ROOT = join(__dirname, "..", "..", "..");
export const SNAPSHOTS_DIR = join(REPO_ROOT, "tests", "e2e", "snapshots");
export const PERF_DIR = join(REPO_ROOT, "tests", "e2e");

mkdirSync(SNAPSHOTS_DIR, { recursive: true });

// ---- Playwright resolution ----

const _require = createRequire("/opt/node22/lib/node_modules/");

export function getChromium() {
  const { chromium } = _require("playwright");
  return chromium;
}

export function getPlaywrightVersion() {
  try {
    const pkg = _require("playwright/package.json");
    return pkg.version;
  } catch {
    return "unknown";
  }
}

// ---- Generic helpers ----

export function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

export function randomPort(base = 20000, span = 10000) {
  return base + Math.floor(Math.random() * span);
}

// ---- Server launchers ----

export function startViteServer({ cwd = REPO_ROOT, port = randomPort(15000, 1000) } = {}) {
  return new Promise((resolve, reject) => {
    const proc = spawn("npx", ["vite", "--port", String(port), "--host", "127.0.0.1"], {
      cwd,
      stdio: ["ignore", "pipe", "pipe"],
      env: { ...process.env, NODE_ENV: "development" },
    });

    const timer = setTimeout(() => reject(new Error("Vite dev server did not start in time")), 30000);
    const handler = (data) => {
      const line = data.toString();
      if (line.includes("Local:") && line.includes(String(port))) {
        clearTimeout(timer);
        resolve({
          proc,
          port,
          url: `http://127.0.0.1:${port}`,
          kill: () => killProc(proc),
        });
      }
    };
    proc.stdout.on("data", handler);
    proc.stderr.on("data", handler);
    proc.on("error", (err) => { clearTimeout(timer); reject(err); });
  });
}

export function startJupyterLab({
  cwd = REPO_ROOT,
  port = randomPort(28000, 1000),
  token,
  notebookDir,
} = {}) {
  if (!token) {
    throw new Error("startJupyterLab requires a token");
  }
  const args = [
    "lab",
    "--no-browser",
    "--allow-root",
    `--port=${port}`,
    `--IdentityProvider.token=${token}`,
    "--ServerApp.disable_check_xsrf=True",
    `--notebook-dir=${notebookDir || cwd}`,
  ];
  return new Promise((resolve, reject) => {
    const proc = spawn("jupyter", args, {
      cwd,
      stdio: ["ignore", "pipe", "pipe"],
      env: { ...process.env, HOME: process.env.HOME || "/root" },
    });
    const timer = setTimeout(() => reject(new Error("JupyterLab did not start in time")), 60000);
    const handler = (data) => {
      const line = data.toString();
      if (line.includes(String(port)) && (line.includes("http://") || line.includes("is running at"))) {
        clearTimeout(timer);
        resolve({
          proc,
          port,
          token,
          url: `http://localhost:${port}`,
          kill: () => killProc(proc),
        });
      }
    };
    proc.stdout.on("data", handler);
    proc.stderr.on("data", handler);
    proc.on("error", (err) => { clearTimeout(timer); reject(err); });
  });
}

export function startCodeServer({ workspaceDir, port = randomPort(38000, 1000) } = {}) {
  if (!workspaceDir) throw new Error("startCodeServer requires workspaceDir");
  return new Promise((resolve, reject) => {
    const proc = spawn(
      "code-server",
      ["--auth", "none", "--port", String(port), "--disable-telemetry", workspaceDir],
      {
        stdio: ["ignore", "pipe", "pipe"],
        env: { ...process.env, HOME: process.env.HOME || "/root" },
      },
    );
    const timer = setTimeout(() => reject(new Error("code-server did not start in time")), 30000);
    const handler = (data) => {
      const line = data.toString();
      if (line.includes("HTTP server listening") || line.includes(`localhost:${port}`)) {
        clearTimeout(timer);
        resolve({ proc, port, url: `http://localhost:${port}`, kill: () => killProc(proc) });
      }
    };
    proc.stdout.on("data", handler);
    proc.stderr.on("data", handler);
    proc.on("error", (err) => { clearTimeout(timer); reject(err); });
  });
}

function killProc(proc) {
  try { proc.kill(); } catch {}
  try { proc.stdout?.destroy(); } catch {}
  try { proc.stderr?.destroy(); } catch {}
  try { proc.unref(); } catch {}
  setTimeout(() => { try { proc.kill("SIGKILL"); } catch {} }, 3000).unref();
}

// ---- Canvas inspection (works in main page or a frame) ----

const READ_PIXELS_FN = (sel) => {
  const canvas = document.querySelector(sel);
  if (!canvas) return { hasContent: false, totalPixels: 0, nonWhitePixels: 0, found: false };
  const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
  if (!gl) {
    const ctx = canvas.getContext("2d");
    if (!ctx) return { hasContent: false, totalPixels: 0, nonWhitePixels: 0, found: true };
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let nonWhite = 0;
    for (let i = 0; i < data.length; i += 4) {
      if (data[i] < 250 || data[i + 1] < 250 || data[i + 2] < 250) nonWhite++;
    }
    const total = canvas.width * canvas.height;
    return { hasContent: nonWhite > total * 0.001, totalPixels: total, nonWhitePixels: nonWhite, found: true };
  }
  const width = gl.drawingBufferWidth;
  const height = gl.drawingBufferHeight;
  const pixels = new Uint8Array(width * height * 4);
  gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
  let nonWhite = 0;
  const total = width * height;
  for (let i = 0; i < pixels.length; i += 4) {
    if (pixels[i] < 250 || pixels[i + 1] < 250 || pixels[i + 2] < 250) nonWhite++;
  }
  return { hasContent: nonWhite > total * 0.001, totalPixels: total, nonWhitePixels: nonWhite, found: true };
};

export async function readCanvasPixels(pageOrFrame, selector = "canvas") {
  return pageOrFrame.evaluate(READ_PIXELS_FN, selector);
}

export async function waitForCanvasNonEmpty(pageOrFrame, selector = "canvas", { timeout = 15000, interval = 500 } = {}) {
  const deadline = Date.now() + timeout;
  let last = { hasContent: false, totalPixels: 0, nonWhitePixels: 0, found: false };
  while (Date.now() < deadline) {
    last = await readCanvasPixels(pageOrFrame, selector).catch(() => last);
    if (last.hasContent) return last;
    await sleep(interval);
  }
  return last;
}

// ---- Performance hooks ----

/**
 * Inject a flag and frame-time collector before any script runs.
 * The src/ side checks `window.__MEGANE_PERF__` and only emits perf data when true.
 * src/renderer/MoleculeRenderer.ts pushes per-frame timestamps to
 * `window.__meganeFrameTimes` (capped at ~600 entries to bound memory).
 */
export async function setupPerfHooks(context) {
  await context.addInitScript(() => {
    // eslint-disable-next-line no-undef
    window.__MEGANE_PERF__ = true;
    // eslint-disable-next-line no-undef
    window.__meganeFrameTimes = [];
  });
}

export async function collectPerf(pageOrFrame) {
  return pageOrFrame.evaluate(() => {
    const measures = performance.getEntriesByType("measure")
      .filter((m) => m.name.startsWith("megane:"))
      .map((m) => ({ name: m.name, duration: m.duration, startTime: m.startTime }));
    const frameTimes = (window.__meganeFrameTimes || []).slice();
    const heap = performance.memory ? performance.memory.usedJSHeapSize : null;
    const ready = !!window.__meganeRendererReady;
    return { measures, frameTimes, heap, ready };
  });
}

/**
 * Compute steady FPS and stutter ratio from a list of frame timestamps.
 * Returns null if insufficient samples (< 10 frames).
 */
export function analyzeFrames(frameTimes) {
  if (!Array.isArray(frameTimes) || frameTimes.length < 10) return null;
  const intervals = [];
  for (let i = 1; i < frameTimes.length; i++) {
    const dt = frameTimes[i] - frameTimes[i - 1];
    if (dt > 0 && dt < 2000) intervals.push(dt);
  }
  if (intervals.length === 0) return null;
  const mean = intervals.reduce((a, b) => a + b, 0) / intervals.length;
  const fps = 1000 / mean;
  const stutterCount = intervals.filter((dt) => dt > 50).length;
  const stutterRatio = stutterCount / intervals.length;
  return { fps, mean, stutterRatio, sampleCount: intervals.length };
}

// ---- Persistence ----

export async function saveScreenshot(page, name) {
  const path = join(SNAPSHOTS_DIR, name.endsWith(".png") ? name : `${name}.png`);
  await page.screenshot({ path, fullPage: false });
  return path;
}

export function savePerfJson(name, data) {
  const path = join(PERF_DIR, name.endsWith(".json") ? name : `perf_${name}.json`);
  writeFileSync(path, JSON.stringify(data, null, 2));
  return path;
}
