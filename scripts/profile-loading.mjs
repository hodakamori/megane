/**
 * Loading-latency profiler (webapp).
 *
 * Loads the Vite app headless, lets the startup demo render (so WASM is warm),
 * then uploads a fixture through the load_structure node input and measures:
 *   - parseCount  : number of `megane:parse:*` measure entries emitted for the
 *                   upload (the double-parse shows as 2; the fix drops it to 1)
 *   - parseSumMs  : total duration of those parse entries (worker round-trips)
 *   - wallMs      : Node-side wall-clock from setInputFiles -> canvas draws pixels
 *   - wasmInitMs  : one-time WASM compile/instantiate captured at demo load
 *
 * Runs each fixture N times and reports the median. Used to A/B the current
 * branch against the pre-improvement base commit.
 *
 * Usage: node scripts/profile-loading.mjs [label]
 */

import { join } from "path";
import {
  REPO_ROOT,
  getChromium,
  startViteServer,
  setupPerfHooks,
  collectPerf,
  waitForCanvasNonEmpty,
  sleep,
} from "../tests/e2e/utils/playwright.mjs";

const LABEL = process.argv[2] ?? "run";
const FIXTURES = join(REPO_ROOT, "tests", "fixtures");
const RUNS = 3;

const CASES = [
  { key: "1ubq.pdb", file: join(FIXTURES, "1ubq.pdb") },
  { key: "caffeine_water.pdb", file: join(FIXTURES, "caffeine_water.pdb") },
  { key: "water_100k.pdb", file: join(FIXTURES, "water_100k.pdb") },
];

function median(arr) {
  const a = arr.filter((v) => v !== null && v !== undefined).sort((x, y) => x - y);
  return a.length ? a[Math.floor(a.length / 2)] : null;
}

async function measureOnce(context, server, file) {
  const page = await context.newPage();
  page.on("pageerror", (e) => console.log(`  [pageerror] ${e.message}`));
  try {
    await page.goto(server.url, { waitUntil: "domcontentloaded", timeout: 30000 });
    await page.waitForSelector("canvas", { timeout: 15000 });
    // Let the startup demo finish so WASM is initialized (warm) before we time.
    await page
      .waitForFunction(() => window.__meganeRendererReady === true, null, { timeout: 30000 })
      .catch(() => {});
    await waitForCanvasNonEmpty(page, "canvas", { timeout: 30000, interval: 100 });

    // Isolate the upload's parse entries from the demo's. The demo already
    // warmed the parse worker (its own WASM instance), so we are timing a warm
    // parse path, not first-init.
    await page.evaluate(() => performance.clearMeasures());

    const input = page.locator('[data-testid="load-structure-input"]').first();
    await input.waitFor({ state: "attached", timeout: 5000 });

    const t0 = Date.now();
    await input.setInputFiles(file);
    // Wait until the parse measures for THIS upload appear and stop growing.
    // The demo canvas is already non-empty, so we cannot rely on "canvas has
    // pixels"; instead we wait for the `megane:parse:*` entry count to settle
    // (>= 1 entry, unchanged for 1s). Before the fix this settles at 2, after
    // the fix at 1.
    await page
      .waitForFunction(
        () => {
          const entries = performance
            .getEntriesByType("measure")
            .filter((m) => m.name.startsWith("megane:parse:"));
          const w = window;
          const now = performance.now();
          if (!w.__pc || w.__pc.n !== entries.length) {
            w.__pc = { n: entries.length, t: now };
            return false;
          }
          return entries.length >= 1 && now - w.__pc.t > 1000;
        },
        null,
        { timeout: 90000, polling: 100 },
      )
      .catch(() => {});
    const wallMs = Date.now() - t0;

    const perf = await collectPerf(page);
    const parseEntries = perf.measures.filter((m) => m.name.startsWith("megane:parse:"));
    const parseCount = parseEntries.length;
    const parseSumMs = parseEntries.reduce((s, m) => s + m.duration, 0);

    return { parseCount, parseSumMs, wallMs };
  } finally {
    await page.close().catch(() => {});
  }
}

let server = null;
let browser = null;
try {
  console.log(`[${LABEL}] starting Vite dev server...`);
  server = await startViteServer();
  const chromium = getChromium();
  browser = await chromium.launch({ headless: true, args: ["--use-gl=swiftshader"] });
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  await setupPerfHooks(context);

  const rows = [];
  for (const c of CASES) {
    const runs = [];
    for (let i = 0; i < RUNS; i++) {
      runs.push(await measureOnce(context, server, c.file));
    }
    const row = {
      fixture: c.key,
      parseCount: median(runs.map((r) => r.parseCount)),
      parseSumMs: median(runs.map((r) => r.parseSumMs)),
      wallMs: median(runs.map((r) => r.wallMs)),
    };
    rows.push(row);
    console.log(
      `[${LABEL}] ${c.key.padEnd(20)} parseCount=${row.parseCount} ` +
        `parseSum=${row.parseSumMs?.toFixed(1)}ms wall=${row.wallMs}ms`,
    );
  }
  console.log(`\n[${LABEL}] JSON: ${JSON.stringify(rows)}`);
} catch (err) {
  console.error(`[${LABEL}] fatal:`, err);
  process.exitCode = 1;
} finally {
  if (browser) await browser.close().catch(() => {});
  if (server) server.kill();
}
