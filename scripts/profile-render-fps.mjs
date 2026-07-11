/**
 * Rendering-FPS benchmark (webapp) — atom-count sweep × GPU on/off.
 *
 * Measures the *sustained rendering frame rate* of the impostor atom renderer
 * (src/renderer/ImpostorAtomMesh.ts — a single instanced draw call of
 * fragment-shaded billboard spheres, the path behind the "1M+ atoms at 60fps"
 * claim in README.md / docs/) as a function of atom count, under two GPU
 * conditions:
 *
 *   - GPU on   : real hardware GPU (headed Chromium, --enable-gpu / ANGLE)
 *   - GPU off  : software rasterizer (headless Chromium, --use-gl=swiftshader)
 *
 * The GPU backend WebGL uses is fixed at browser launch and cannot be toggled
 * from inside the page, so on/off is a Chromium launch flag and a single run
 * sweeps both modes for an A/B comparison (per CLAUDE.md rule #10).
 *
 * For each (mode, N) case it:
 *   1. loads a deterministic single-frame XYZ of N carbon atoms through the
 *      normal load pipeline ([data-testid="load-structure-input"]),
 *   2. waits until the structure is loaded and first-drawn (NOT timed),
 *   3. clears window.__meganeFrameTimes, then drives a continuous drag-rotate
 *      of the camera for MEGANE_BENCH_SECONDS while the render loop pushes a
 *      timestamp per frame (window.__MEGANE_PERF__ gate, src/perf.ts),
 *   4. computes { fps, mean, stutterRatio, sampleCount } via analyzeFrames().
 *
 * Rotation is used deliberately: impostors are fill-rate bound, so FPS depends
 * on screen coverage (camera zoom). fitToView auto-frames each structure and we
 * then rotate — this measures the interactive worst-case, and holds the framing
 * condition fixed across N.
 *
 * Caveats (also printed in the output conditions):
 *   - preserveDrawingBuffer:true and DPR cap of 2 are the app's real defaults
 *     (src/renderer/MoleculeRenderer.ts:315-328); FPS is measured with them on,
 *     i.e. faithful to the actual app experience.
 *   - When the local WASM is built with wasm-opt disabled (sandboxes), absolute
 *     numbers are inflated, but the relative GPU-on/off and per-N comparison on
 *     the same .wasm is still valid.
 *   - The GLrenderer string (UNMASKED_RENDERER_WEBGL) is reported per mode so
 *     you can confirm GPU-on actually got hardware (not SwiftShader).
 *
 * Usage:
 *   node scripts/profile-render-fps.mjs [--gpu on|off|both]
 *
 * Env knobs:
 *   MEGANE_BENCH_ATOMS     comma list of atom counts (default 1000,10000,100000,500000,1000000)
 *   MEGANE_BENCH_GPU       on | off | both (default both; --gpu wins over env)
 *   MEGANE_BENCH_SECONDS   measurement window seconds (default 5)
 *   MEGANE_BENCH_WARMUP    warmup seconds before measuring (default 1.5)
 *   MEGANE_BENCH_HEADLESS  1 → run GPU-on in new-headless too (default: GPU-on is headed)
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
function parseGpuArg() {
  const idx = process.argv.indexOf("--gpu");
  if (idx !== -1 && process.argv[idx + 1]) return process.argv[idx + 1];
  return process.env.MEGANE_BENCH_GPU ?? "both";
}

const ATOM_COUNTS = (process.env.MEGANE_BENCH_ATOMS ?? "1000,10000,100000,500000,1000000")
  .split(",")
  .map((s) => parseInt(s.trim(), 10))
  .filter((n) => Number.isFinite(n) && n > 0);

const GPU_ARG = parseGpuArg().toLowerCase();
const GPU_MODES =
  GPU_ARG === "on" ? ["on"] : GPU_ARG === "off" ? ["off"] : ["on", "off"];

const MEASURE_SECONDS = Number(process.env.MEGANE_BENCH_SECONDS ?? 5);
// Keep rotating past MEASURE_SECONDS (up to MAX_SECONDS) until at least
// MIN_FRAMES frames are captured — otherwise heavy N at low fps yields too few
// samples for a stable FPS estimate.
const MAX_SECONDS = Number(process.env.MEGANE_BENCH_MAX_SECONDS ?? 20);
const MIN_FRAMES = Number(process.env.MEGANE_BENCH_MIN_FRAMES ?? 30);
const WARMUP_SECONDS = Number(process.env.MEGANE_BENCH_WARMUP ?? 1.5);
const FORCE_HEADLESS = process.env.MEGANE_BENCH_HEADLESS === "1";
// ANGLE backend for GPU-on. On Windows the default (d3d11) uses the GPU; on
// Linux try "gl" (native driver) or "vulkan" to escape the llvmpipe fallback.
const ANGLE_BACKEND = process.env.MEGANE_BENCH_ANGLE ?? "default";
// Extra Chromium flags appended to every launch (space-separated).
const EXTRA_ARGS = (process.env.MEGANE_BENCH_CHROMIUM_ARGS ?? "")
  .split(/\s+/)
  .filter(Boolean);

const VIEWPORT = { width: 1280, height: 720 };
const FIXTURE_DIR = join(tmpdir(), "megane-render-fixtures");

// ── Deterministic single-frame fixture (cubic lattice of carbon atoms) ───────
function fixturePath(n) {
  return join(FIXTURE_DIR, `atoms_${n}.xyz`);
}

function genXyz(n) {
  const path = fixturePath(n);
  if (existsSync(path)) return path;
  mkdirSync(FIXTURE_DIR, { recursive: true });
  const grid = Math.ceil(Math.cbrt(n));
  const spacing = 2.0; // Å, keeps atoms distinct but the box compact
  const parts = [String(n), `${n} carbon atoms (cubic lattice) — megane render-fps bench`];
  let placed = 0;
  for (let i = 0; i < grid && placed < n; i++) {
    for (let j = 0; j < grid && placed < n; j++) {
      for (let k = 0; k < grid && placed < n; k++) {
        if (placed >= n) break;
        const x = (i * spacing).toFixed(3);
        const y = (j * spacing).toFixed(3);
        const z = (k * spacing).toFixed(3);
        parts.push(`C ${x} ${y} ${z}`);
        placed++;
      }
    }
  }
  writeFileSync(path, parts.join("\n") + "\n");
  return path;
}

// ── Chromium launch flags per GPU mode ───────────────────────────────────────
function launchOptions(mode) {
  if (mode === "off") {
    // Software rasterizer — no hardware GPU.
    return { headless: true, args: ["--use-gl=swiftshader", "--disable-gpu", ...EXTRA_ARGS] };
  }
  // GPU on — real hardware. Headed is the most reliable way to get a hardware
  // context; new-headless can be forced with MEGANE_BENCH_HEADLESS=1 but on
  // Linux headless commonly falls back to Mesa llvmpipe (software).
  const gpuArgs = [
    "--ignore-gpu-blocklist",
    "--enable-gpu",
    "--enable-webgl",
    `--use-angle=${ANGLE_BACKEND}`,
    ...EXTRA_ARGS,
  ];
  if (FORCE_HEADLESS) {
    return { headless: true, args: ["--headless=new", ...gpuArgs] };
  }
  return { headless: false, args: gpuArgs };
}

// ── Read the actual GL renderer string (hardware vs SwiftShader) ─────────────
async function readGlRenderer(page) {
  return page
    .evaluate(() => {
      const c = document.createElement("canvas");
      const gl = c.getContext("webgl2") || c.getContext("webgl");
      if (!gl) return "no-webgl";
      const ext = gl.getExtension("WEBGL_debug_renderer_info");
      const raw = ext
        ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)
        : gl.getParameter(gl.RENDERER);
      return String(raw);
    })
    .catch(() => "unknown");
}

// ── Drive a continuous drag-rotate over the canvas ───────────────────────────
// Rotates for at least `minSeconds`, then keeps going until `minFrames` frames
// are captured, capped at `maxSeconds` (so slow/heavy cases still yield enough
// samples for a stable estimate instead of returning null).
async function rotateCamera(page, minSeconds, maxSeconds, minFrames) {
  // Read the canvas rect directly (getBoundingClientRect) rather than
  // Playwright's boundingBox(), whose actionability waits can time out when the
  // main thread is saturated by a heavy render.
  const box = await page
    .evaluate(() => {
      const c = document.querySelector("canvas");
      if (!c) return null;
      const r = c.getBoundingClientRect();
      return { x: r.x, y: r.y, width: r.width, height: r.height };
    })
    .catch(() => null);
  const cx = box ? box.x + box.width / 2 : VIEWPORT.width / 2;
  const cy = box ? box.y + box.height / 2 : VIEWPORT.height / 2;
  const radius = box ? Math.min(box.width, box.height) * 0.3 : 200;

  const frameCount = () =>
    page.evaluate(() => (window.__meganeFrameTimes || []).length).catch(() => 0);

  await page.mouse.move(cx, cy);
  await page.mouse.down();
  const t0 = Date.now();
  const minDeadline = t0 + minSeconds * 1000;
  const maxDeadline = t0 + maxSeconds * 1000;
  let angle = 0;
  let iter = 0;
  try {
    for (;;) {
      angle += 0.15; // radians per step → smooth orbit
      const px = cx + Math.cos(angle) * radius;
      const py = cy + Math.sin(angle) * radius;
      await page.mouse.move(px, py, { steps: 2 });
      await sleep(12); // ~ one step per frame at high fps
      const now = Date.now();
      if (now >= maxDeadline) break;
      // Check the frame count every ~10 iterations once past the min window.
      if (now >= minDeadline && ++iter % 10 === 0) {
        if ((await frameCount()) >= minFrames) break;
      }
    }
  } finally {
    await page.mouse.up().catch(() => {});
  }
}

// FPS from raw frame timestamps — a coarse fallback for when analyzeFrames()
// returns null (fewer than 10 samples, e.g. very heavy N at low fps).
function coarseFps(frameTimes) {
  const ft = (frameTimes || []).filter((t) => Number.isFinite(t));
  if (ft.length < 2) return null;
  const span = ft[ft.length - 1] - ft[0];
  if (span <= 0) return null;
  return ((ft.length - 1) / span) * 1000;
}

// ── One (mode, N) measurement ────────────────────────────────────────────────
async function measureOnce(context, server, n) {
  const page = await context.newPage();
  page.on("pageerror", (e) => console.log(`  [pageerror] ${e.message}`));
  try {
    await page.goto(server.url, { waitUntil: "domcontentloaded", timeout: 30000 });
    await page.waitForSelector("canvas", { timeout: 20000 });
    // Warm WASM: wait for the startup demo's first frame.
    await page
      .waitForFunction(() => window.__meganeRendererReady === true, null, { timeout: 30000 })
      .catch(() => {});
    await waitForCanvasNonEmpty(page, "canvas", { timeout: 30000, interval: 100 });

    // Load the synthetic structure through the normal pipeline.
    const input = page.locator('[data-testid="load-structure-input"]').first();
    await input.waitFor({ state: "attached", timeout: 5000 });
    const loadT0 = Date.now();
    await input.setInputFiles(genXyz(n));
    // Loaded + first-drawn: __megane_test_ready is populated in loadSnapshot.
    await page.waitForFunction(
      (want) => {
        const r = window.__megane_test_ready;
        return !!r && r.dataLoaded === true && r.atomCount === want;
      },
      n,
      { timeout: 180000, polling: 100 },
    );
    const loadMs = Date.now() - loadT0;

    // Warmup (let the pipeline settle), then reset the frame buffer and measure.
    await sleep(WARMUP_SECONDS * 1000);
    await page.evaluate(() => {
      window.__meganeFrameTimes = [];
    });
    await rotateCamera(page, MEASURE_SECONDS, MAX_SECONDS, MIN_FRAMES);

    const perf = await collectPerf(page);
    const stats = analyzeFrames(perf.frameTimes);
    const mem = await page
      .evaluate(() => (window.__megane_test ? window.__megane_test.getRendererMemory() : null))
      .catch(() => null);

    // Prefer the analyzeFrames estimate; fall back to a coarse fps (and mark it)
    // when there were too few samples for it (heavy N at low fps).
    const fallback = coarseFps(perf.frameTimes);
    const fps = stats ? stats.fps : fallback;
    const approx = !stats && fallback != null;

    return {
      atoms: n,
      fps: fps != null ? Number(fps.toFixed(1)) : null,
      approx,
      meanMs: stats ? Number(stats.mean.toFixed(2)) : fps ? Number((1000 / fps).toFixed(2)) : null,
      stutterPct: stats ? Number((stats.stutterRatio * 100).toFixed(1)) : null,
      samples: stats ? stats.sampleCount : (perf.frameTimes || []).length,
      loadMs,
      heapMB: perf.heap ? Number((perf.heap / 1048576).toFixed(1)) : null,
      geometries: mem ? mem.geometries : null,
    };
  } finally {
    await page.close().catch(() => {});
  }
}

// ── Main ─────────────────────────────────────────────────────────────────────
let server = null;
try {
  console.log(
    `[render-fps] modes=${GPU_MODES.join(",")} atoms=${ATOM_COUNTS.join(",")} ` +
      `measure=${MEASURE_SECONDS}-${MAX_SECONDS}s(min${MIN_FRAMES}f) warmup=${WARMUP_SECONDS}s ` +
      `angle=${ANGLE_BACKEND} headless(gpu-on)=${FORCE_HEADLESS}`,
  );
  console.log("[render-fps] starting Vite dev server...");
  server = await startViteServer();
  const chromium = getChromium();

  const rows = [];
  const glRenderers = {};

  for (const mode of GPU_MODES) {
    console.log(`\n[render-fps] === GPU ${mode} ===`);
    const browser = await chromium.launch(launchOptions(mode));
    try {
      const context = await browser.newContext({ viewport: VIEWPORT });
      // __MEGANE_TEST__ exposes __megane_test / __megane_test_ready; must run
      // before setupPerfHooks so both init scripts land before any page script.
      await context.addInitScript(() => {
        window.__MEGANE_TEST__ = true;
      });
      await setupPerfHooks(context);

      // GL renderer string (sanity: hardware vs SwiftShader).
      const probe = await context.newPage();
      await probe.goto(server.url, { waitUntil: "domcontentloaded", timeout: 30000 }).catch(() => {});
      const gl = await readGlRenderer(probe);
      glRenderers[mode] = gl;
      await probe.close().catch(() => {});
      const swiftshader = /swiftshader|llvmpipe|software/i.test(gl);
      console.log(`[render-fps] GL renderer: ${gl}`);
      if (mode === "on" && swiftshader) {
        console.log(
          "[render-fps] WARNING: GPU-on did NOT get a hardware context — the GL renderer is a " +
            "software rasterizer (SwiftShader / Mesa llvmpipe), so the GPU is NOT being used and " +
            "these numbers are CPU-bound. To use real hardware: run headed (do NOT set " +
            "MEGANE_BENCH_HEADLESS), on native Windows/macOS/Linux (not a GPU-less VM / plain WSL), " +
            "and optionally try MEGANE_BENCH_ANGLE=gl or =vulkan (Linux) / leave default (Windows d3d11).",
        );
      }

      for (const n of ATOM_COUNTS) {
        const r = await measureOnce(context, server, n);
        r.mode = mode;
        r.gl = gl;
        rows.push(r);
        console.log(
          `[render-fps] gpu=${mode} atoms=${String(n).padStart(8)} ` +
            `fps=${String(r.fps).padStart(6)}${r.approx ? "~" : " "} mean=${String(r.meanMs).padStart(7)}ms ` +
            `stutter=${String(r.stutterPct).padStart(5)}% samples=${r.samples} ` +
            `load=${r.loadMs}ms heap=${r.heapMB}MB`,
        );
      }
    } finally {
      await browser.close().catch(() => {});
    }
  }

  // Human-readable table (+ on/off speedup when both modes ran).
  const both = GPU_MODES.length === 2;
  const byKey = new Map(rows.map((r) => [`${r.mode}:${r.atoms}`, r]));
  const table = rows
    .filter((r) => !both || r.mode === "on")
    .map((r) => {
      const base = {
        "GPU": r.mode,
        "atoms": r.atoms,
        "fps": r.fps,
        "mean(ms)": r.meanMs,
        "stutter%": r.stutterPct,
        "samples": r.samples,
      };
      if (both) {
        const off = byKey.get(`off:${r.atoms}`);
        base["fps(off)"] = off ? off.fps : null;
        base["speedup"] =
          off && off.fps ? Number((r.fps / off.fps).toFixed(2)) : null;
      }
      return base;
    });
  console.log("");
  console.table(both ? table : rows.map((r) => ({
    "GPU": r.mode,
    "atoms": r.atoms,
    "fps": r.fps,
    "mean(ms)": r.meanMs,
    "stutter%": r.stutterPct,
    "samples": r.samples,
  })));

  const conditions = {
    viewport: VIEWPORT,
    devicePixelRatioCap: 2,
    preserveDrawingBuffer: true,
    camera: "continuous drag-rotate",
    measureSeconds: MEASURE_SECONDS,
    warmupSeconds: WARMUP_SECONDS,
    element: "C",
    fixture: "single-frame XYZ cubic lattice",
    glRenderers,
    note:
      "Impostor atom rendering is fill-rate bound; FPS depends on screen " +
      "coverage. Absolute numbers depend on the local .wasm optimization level; " +
      "GPU-on/off and per-N comparisons on the same build are the trustworthy signal.",
  };
  const outPath = savePerfJson("render_fps", { conditions, rows });
  console.log(`\n[render-fps] saved: ${outPath}`);
  console.log(`[render-fps] JSON: ${JSON.stringify(rows)}`);
} catch (err) {
  console.error("[render-fps] fatal:", err);
  process.exitCode = 1;
} finally {
  if (server) server.kill();
}
