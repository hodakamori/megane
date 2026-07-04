/**
 * Streaming-decode A/B profiler (multi-frame XYZ / multi-MODEL PDB).
 *
 * For each fixture it loads the file TWICE on the same branch — once with lazy
 * streaming FORCED OFF (`window.__MEGANE_LAZY_XTC__ = false`, eager: decode all
 * frames up-front) and once FORCED ON (`= true`, lazy: decode frame 0, stream the
 * rest) — and measures the wall-clock from "drop the file" to "frame-0 data is
 * ready to render". This isolates the streaming feature's effect on time-to-first
 * paint without checking out a base commit.
 *
 * Metric: wall-clock from `setInputFiles` until the PRIMARY load_structure node's
 * per-node snapshot reference changes. Interactive loads update
 * `nodeSnapshots[loaderId]` (NOT the global store.snapshot — that is the
 * useMeganeLocal React state), and both eager and lazy call setNodeSnapshot at
 * "frame 0 ready", so this is a uniform signal. Requires the test store hook
 * (`window.__MEGANE_TEST__ = true`, exposes `window.__megane_test_pipeline_store`).
 *
 * Fixtures are generated deterministically into the OS temp dir if missing
 * (override sizes via env N_MOL / N_FRAMES, or supply your own via
 * XYZ_FIXTURE / PDB_FIXTURE). The local WASM is typically built with wasm-opt
 * disabled in sandboxes, so absolute numbers are slower than production — but
 * eager and lazy share the same .wasm, so the RELATIVE speedup is valid.
 *
 * Usage: node scripts/profile-streaming.mjs
 */

import { existsSync, writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";
import {
  getChromium,
  startViteServer,
  setupPerfHooks,
  collectPerf,
  waitForCanvasNonEmpty,
} from "../tests/e2e/utils/playwright.mjs";

const RUNS = Number(process.env.RUNS ?? 2);
const LOAD_TIMEOUT_MS = 180000;
const N_MOL = Number(process.env.N_MOL ?? 200); // waters; atoms = 3 * N_MOL
const N_FRAMES = Number(process.env.N_FRAMES ?? 1000);

// ── Deterministic fixture generation (water box, per-frame jitter) ──────────
function buildBase() {
  const grid = Math.ceil(Math.cbrt(N_MOL));
  const spacing = 3.5;
  const base = [];
  let placed = 0;
  for (let i = 0; i < grid && placed < N_MOL; i++)
    for (let j = 0; j < grid && placed < N_MOL; j++)
      for (let k = 0; k < grid && placed < N_MOL; k++) {
        const ox = i * spacing,
          oy = j * spacing,
          oz = k * spacing;
        base.push({ el: "O", x: ox, y: oy, z: oz });
        base.push({ el: "H", x: ox + 0.76, y: oy + 0.59, z: oz });
        base.push({ el: "H", x: ox - 0.76, y: oy + 0.59, z: oz });
        placed++;
      }
  return { base, boxLen: (grid * spacing).toFixed(3) };
}

function makeRng() {
  let seed = 12345;
  return () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
}

function frameCoords(base, rand) {
  return base.map((a) => ({
    el: a.el,
    x: a.x + (rand() - 0.5) * 0.1,
    y: a.y + (rand() - 0.5) * 0.1,
    z: a.z + (rand() - 0.5) * 0.1,
  }));
}

function genXyz(path, base) {
  const rand = makeRng();
  const parts = [];
  for (let f = 0; f < N_FRAMES; f++) {
    parts.push(String(base.length), `Frame ${f}`);
    for (const a of frameCoords(base, rand))
      parts.push(`${a.el} ${a.x.toFixed(4)} ${a.y.toFixed(4)} ${a.z.toFixed(4)}`);
  }
  writeFileSync(path, parts.join("\n") + "\n");
}

function genPdb(path, base, boxLen) {
  const rand = makeRng();
  const put = (buf, start, str) => {
    for (let i = 0; i < str.length; i++) buf[start + i] = str[i];
  };
  const f83 = (v) => v.toFixed(3).padStart(8);
  const p = (v, n) => String(v).padStart(n);
  const parts = [
    `CRYST1${p(boxLen, 9)}${p(boxLen, 9)}${p(boxLen, 9)}  90.00  90.00  90.00 P 1           1`,
  ];
  for (let m = 0; m < N_FRAMES; m++) {
    parts.push(`MODEL     ${p(m + 1, 4)}`);
    const coords = frameCoords(base, rand);
    for (let idx = 0; idx < coords.length; idx++) {
      const a = coords[idx];
      const buf = new Array(78).fill(" ");
      put(buf, 0, "HETATM");
      put(buf, 6, p((idx % 99999) + 1, 5));
      put(buf, 12, a.el === "O" ? " O  " : " H  ");
      put(buf, 17, "HOH");
      put(buf, 21, "A");
      put(buf, 22, p((((idx / 3) | 0) % 9999) + 1, 4));
      put(buf, 30, f83(a.x));
      put(buf, 38, f83(a.y));
      put(buf, 46, f83(a.z));
      put(buf, 54, "  1.00");
      put(buf, 60, "  0.00");
      put(buf, 76, a.el === "O" ? " O" : " H");
      parts.push(buf.join(""));
    }
    parts.push("ENDMDL");
  }
  parts.push("END");
  writeFileSync(path, parts.join("\n") + "\n");
}

function ensureFixtures() {
  const dir = join(tmpdir(), "megane-stream-fixtures");
  mkdirSync(dir, { recursive: true });
  const xyz = process.env.XYZ_FIXTURE ?? join(dir, `wb_${N_MOL}x${N_FRAMES}.xyz`);
  const pdb = process.env.PDB_FIXTURE ?? join(dir, `wb_${N_MOL}x${N_FRAMES}.pdb`);
  if (!existsSync(xyz) || !existsSync(pdb)) {
    const { base, boxLen } = buildBase();
    if (!existsSync(xyz)) genXyz(xyz, base);
    if (!existsSync(pdb)) genPdb(pdb, base, boxLen);
    console.log(`[streaming] generated fixtures: ${3 * N_MOL} atoms x ${N_FRAMES} frames`);
  }
  return [
    { key: "multiframe.xyz", file: xyz },
    { key: "multimodel.pdb", file: pdb },
  ];
}

function median(arr) {
  const a = arr.filter((v) => v !== null && v !== undefined).sort((x, y) => x - y);
  return a.length ? a[Math.floor(a.length / 2)] : null;
}

async function measureOnce(context, server, file, lazy) {
  const page = await context.newPage();
  page.on("pageerror", (e) => console.log(`  [pageerror] ${e.message}`));
  try {
    await page.goto(server.url, { waitUntil: "domcontentloaded", timeout: 30000 });
    await page.waitForSelector("canvas", { timeout: 15000 });
    await page
      .waitForFunction(() => window.__meganeRendererReady === true, null, { timeout: 30000 })
      .catch(() => {});
    await waitForCanvasNonEmpty(page, "canvas", { timeout: 30000, interval: 100 });

    // Force lazy on/off and baseline the primary loader node's per-node snapshot.
    const setup = await page.evaluate((isLazy) => {
      window.__MEGANE_LAZY_XTC__ = isLazy;
      const store = window.__megane_test_pipeline_store;
      if (!store) return { ok: false };
      const s = store.getState();
      const loader = s.nodes.find((n) => n.type === "load_structure");
      window.__loaderId = loader?.id ?? null;
      window.__baseNodeSnap = loader ? (s.nodeSnapshots[loader.id]?.snapshot ?? null) : null;
      performance.clearMeasures();
      return { ok: true, loaderId: loader?.id ?? null };
    }, lazy);
    if (!setup.ok) throw new Error("test pipeline store not exposed");
    if (!setup.loaderId) throw new Error("no load_structure node in the demo pipeline");

    const input = page.locator('[data-testid="load-structure-input"]').first();
    await input.waitFor({ state: "attached", timeout: 5000 });

    const t0 = Date.now();
    await input.setInputFiles(file);
    await page.waitForFunction(
      () => {
        const store = window.__megane_test_pipeline_store;
        if (!store) return false;
        return (
          store.getState().nodeSnapshots[window.__loaderId]?.snapshot !== window.__baseNodeSnap
        );
      },
      null,
      { timeout: LOAD_TIMEOUT_MS, polling: 20 },
    );
    const wallMs = Date.now() - t0;

    const info = await page.evaluate(() => {
      const s = window.__megane_test_pipeline_store.getState();
      return {
        hasProvider: !!s.structureProvider,
        nFrames: s.structureProvider?.meta?.nFrames ?? null,
      };
    });
    const perf = await collectPerf(page);
    const parseSumMs = perf.measures
      .filter((m) => m.name.startsWith("megane:parse:"))
      .reduce((s, m) => s + m.duration, 0);

    return { wallMs, parseSumMs, hasProvider: info.hasProvider, nFrames: info.nFrames };
  } finally {
    await page.close().catch(() => {});
  }
}

async function runCase(context, server, c) {
  const out = { fixture: c.key };
  for (const mode of ["eager", "lazy"]) {
    const runs = [];
    for (let i = 0; i < RUNS; i++)
      runs.push(await measureOnce(context, server, c.file, mode === "lazy"));
    out[mode] = {
      wallMs: median(runs.map((r) => r.wallMs)),
      parseSumMs: median(runs.map((r) => r.parseSumMs)),
      hasProvider: runs[runs.length - 1].hasProvider,
      nFrames: runs[runs.length - 1].nFrames,
    };
  }
  return out;
}

let server = null;
let browser = null;
try {
  const CASES = ensureFixtures();
  console.log("[streaming] starting Vite dev server...");
  server = await startViteServer();
  const chromium = getChromium();
  browser = await chromium.launch({ headless: true, args: ["--use-gl=swiftshader"] });
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  await context.addInitScript(() => {
    window.__MEGANE_TEST__ = true;
  });
  await setupPerfHooks(context);

  const rows = [];
  for (const c of CASES) {
    const row = await runCase(context, server, c);
    rows.push(row);
    const e = row.eager,
      l = row.lazy;
    const speedup = e.wallMs && l.wallMs ? (e.wallMs / l.wallMs).toFixed(2) : "?";
    const saved = e.wallMs != null && l.wallMs != null ? e.wallMs - l.wallMs : null;
    console.log(
      `\n[streaming] ${c.key}` +
        `\n  eager: wall=${e.wallMs}ms  parseSum=${e.parseSumMs?.toFixed(0)}ms  provider=${e.hasProvider}` +
        `\n  lazy : wall=${l.wallMs}ms  parseSum=${l.parseSumMs?.toFixed(0)}ms  provider=${l.hasProvider} nFrames=${l.nFrames}` +
        `\n  => first-paint ${saved}ms faster (${speedup}x)`,
    );
  }
  console.log(`\n[streaming] JSON: ${JSON.stringify(rows)}`);
} catch (err) {
  console.error("[streaming] fatal:", err);
  process.exitCode = 1;
} finally {
  if (browser) await browser.close().catch(() => {});
  if (server) server.kill();
}
