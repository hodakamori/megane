/**
 * Rendering-FPS benchmark (webapp) — atom-count sweep × GPU on/off.
 *
 * Measures the sustained rendering frame rate of the impostor atom renderer
 * (src/renderer/ImpostorAtomMesh.ts — the "1M+ atoms at 60fps" path) as a
 * function of atom count, under two GPU conditions:
 *   - GPU on   : real hardware GPU   (headed Chromium)
 *   - GPU off  : software rasterizer (headless Chromium, SwiftShader)
 * The WebGL GPU backend is fixed at browser launch, so on/off is a launch flag
 * and one run sweeps both for an A/B comparison.
 *
 * For each (mode, N): load a synthetic N-atom XYZ through the normal pipeline,
 * rotate the camera continuously for MEASURE_SECONDS while the render loop
 * records per-frame timestamps (window.__MEGANE_PERF__ gate, src/perf.ts), then
 * report { fps, mean, stutterRatio, sampleCount } via analyzeFrames().
 *
 * Note: impostors are fill-rate bound, so FPS depends on screen coverage; the
 * camera auto-frames (fitToView) then rotates, holding that condition fixed.
 *
 * Usage:  node scripts/profile-render-fps.mjs [--gpu on|off|both]
 * Env:    MEGANE_BENCH_ATOMS    comma list (default 1000,10000,100000,500000,1000000)
 *         MEGANE_BENCH_GPU      on | off | both (default both; --gpu wins)
 *         MEGANE_BENCH_SECONDS  measurement window seconds (default 5)
 */

import { existsSync, mkdirSync, writeFileSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import {
  getChromium,
  startViteServer,
  setupPerfHooks,
  collectPerf,
  analyzeFrames,
  waitForCanvasNonEmpty,
  savePerfJson,
  sleep,
} from "../tests/e2e/utils/playwright.mjs";

// ── Configuration ───────────────────────────────────────────────────────────
function gpuArg() {
  const i = process.argv.indexOf("--gpu");
  if (i !== -1 && process.argv[i + 1]) return process.argv[i + 1];
  return process.env.MEGANE_BENCH_GPU ?? "both";
}

const ATOM_COUNTS = (process.env.MEGANE_BENCH_ATOMS ?? "1000,10000,100000,500000,1000000")
  .split(",")
  .map((s) => parseInt(s.trim(), 10))
  .filter((n) => Number.isFinite(n) && n > 0);

const GPU = gpuArg().toLowerCase();
const GPU_MODES = GPU === "on" ? ["on"] : GPU === "off" ? ["off"] : ["on", "off"];
const MEASURE_SECONDS = Number(process.env.MEGANE_BENCH_SECONDS ?? 5);

const VIEWPORT = { width: 1280, height: 720 };
const FIXTURE_DIR = join(tmpdir(), "megane-render-fixtures");

// ── Deterministic single-frame fixture (N carbon atoms on a cubic lattice) ───
function genXyz(n) {
  const path = join(FIXTURE_DIR, `atoms_${n}.xyz`);
  if (existsSync(path)) return path;
  mkdirSync(FIXTURE_DIR, { recursive: true });
  const grid = Math.ceil(Math.cbrt(n));
  const spacing = 2.0; // Å
  const parts = [String(n), `${n} carbon atoms (cubic lattice)`];
  let placed = 0;
  for (let i = 0; i < grid && placed < n; i++) {
    for (let j = 0; j < grid && placed < n; j++) {
      for (let k = 0; k < grid && placed < n; k++) {
        parts.push(`C ${(i * spacing).toFixed(3)} ${(j * spacing).toFixed(3)} ${(k * spacing).toFixed(3)}`);
        placed++;
      }
    }
  }
  writeFileSync(path, parts.join("\n") + "\n");
  return path;
}

// ── Chromium launch flags per GPU mode ───────────────────────────────────────
function launchOptions(mode) {
  return mode === "off"
    ? { headless: true, args: ["--use-gl=swiftshader", "--disable-gpu"] }
    : { headless: false, args: ["--ignore-gpu-blocklist", "--enable-gpu"] };
}

// ── The GL renderer string actually in use (hardware vs software) ────────────
async function readGlRenderer(page) {
  return page.evaluate(() => {
    const gl = document.createElement("canvas").getContext("webgl2");
    const ext = gl.getExtension("WEBGL_debug_renderer_info");
    return String(gl.getParameter(ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER));
  });
}

// ── Drive a continuous drag-rotate over the canvas for `seconds` ─────────────
async function rotateCamera(page, seconds) {
  const box = await page.evaluate(() => {
    const r = document.querySelector("canvas").getBoundingClientRect();
    return { x: r.x, y: r.y, w: r.width, h: r.height };
  });
  const cx = box.x + box.w / 2;
  const cy = box.y + box.h / 2;
  const radius = Math.min(box.w, box.h) * 0.3;

  await page.mouse.move(cx, cy);
  await page.mouse.down();
  const deadline = Date.now() + seconds * 1000;
  let angle = 0;
  try {
    while (Date.now() < deadline) {
      angle += 0.15;
      await page.mouse.move(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius, { steps: 2 });
      await sleep(12);
    }
  } finally {
    await page.mouse.up();
  }
}

// ── One (mode, N) measurement ────────────────────────────────────────────────
async function measureOnce(context, server, n) {
  const page = await context.newPage();
  page.on("pageerror", (e) => console.log(`  [pageerror] ${e.message}`));
  try {
    await page.goto(server.url, { waitUntil: "domcontentloaded", timeout: 30000 });
    await page.waitForSelector("canvas", { timeout: 20000 });
    await page.waitForFunction(() => window.__meganeRendererReady === true, null, { timeout: 30000 });
    await waitForCanvasNonEmpty(page, "canvas", { timeout: 30000, interval: 100 });

    // Load the synthetic structure through the normal pipeline (not timed as FPS).
    const input = page.locator('[data-testid="load-structure-input"]').first();
    await input.waitFor({ state: "attached", timeout: 5000 });
    const t0 = Date.now();
    await input.setInputFiles(genXyz(n));
    await page.waitForFunction(
      (want) => {
        const r = window.__megane_test_ready;
        return !!r && r.dataLoaded === true && r.atomCount === want;
      },
      n,
      { timeout: 180000, polling: 100 },
    );
    const loadMs = Date.now() - t0;

    // Reset the frame buffer, then rotate and measure.
    await page.evaluate(() => {
      window.__meganeFrameTimes = [];
    });
    await rotateCamera(page, MEASURE_SECONDS);

    const { frameTimes } = await collectPerf(page);
    const stats = analyzeFrames(frameTimes);
    return {
      atoms: n,
      fps: stats ? Number(stats.fps.toFixed(1)) : null,
      meanMs: stats ? Number(stats.mean.toFixed(2)) : null,
      stutterPct: stats ? Number((stats.stutterRatio * 100).toFixed(1)) : null,
      samples: stats ? stats.sampleCount : (frameTimes || []).length,
      loadMs,
    };
  } finally {
    await page.close();
  }
}

// ── Main ─────────────────────────────────────────────────────────────────────
let server = null;
try {
  console.log(
    `[render-fps] modes=${GPU_MODES.join(",")} atoms=${ATOM_COUNTS.join(",")} measure=${MEASURE_SECONDS}s`,
  );
  server = await startViteServer();
  const chromium = getChromium();

  const rows = [];
  const glRenderers = {};

  for (const mode of GPU_MODES) {
    console.log(`\n[render-fps] === GPU ${mode} ===`);
    const browser = await chromium.launch(launchOptions(mode));
    try {
      const context = await browser.newContext({ viewport: VIEWPORT });
      // __MEGANE_TEST__ exposes __megane_test_ready (load/first-draw signal);
      // must run before setupPerfHooks so both init scripts land first.
      await context.addInitScript(() => {
        window.__MEGANE_TEST__ = true;
      });
      await setupPerfHooks(context);

      const probe = await context.newPage();
      await probe.goto(server.url, { waitUntil: "domcontentloaded", timeout: 30000 });
      const gl = await readGlRenderer(probe);
      await probe.close();
      glRenderers[mode] = gl;
      console.log(`[render-fps] GL renderer: ${gl}`);
      if (mode === "on" && /swiftshader|llvmpipe|software/i.test(gl)) {
        console.log(
          "[render-fps] WARNING: no hardware GPU context (software rasterizer) — these numbers are CPU-bound.",
        );
      }

      for (const n of ATOM_COUNTS) {
        const r = await measureOnce(context, server, n);
        r.mode = mode;
        rows.push(r);
        console.log(
          `[render-fps] gpu=${mode} atoms=${String(n).padStart(8)} fps=${String(r.fps).padStart(6)} ` +
            `mean=${String(r.meanMs).padStart(7)}ms stutter=${String(r.stutterPct).padStart(5)}% ` +
            `samples=${r.samples} load=${r.loadMs}ms`,
        );
      }
    } finally {
      await browser.close();
    }
  }

  console.table(
    rows.map((r) => ({
      GPU: r.mode,
      atoms: r.atoms,
      fps: r.fps,
      "mean(ms)": r.meanMs,
      "stutter%": r.stutterPct,
      samples: r.samples,
    })),
  );
  const outPath = savePerfJson("render_fps", {
    conditions: {
      viewport: VIEWPORT,
      measureSeconds: MEASURE_SECONDS,
      camera: "continuous drag-rotate",
      element: "C",
      glRenderers,
    },
    rows,
  });
  console.log(`\n[render-fps] saved: ${outPath}`);
  console.log(`[render-fps] JSON: ${JSON.stringify(rows)}`);
} catch (err) {
  console.error("[render-fps] fatal:", err);
  process.exitCode = 1;
} finally {
  if (server) server.kill();
}
