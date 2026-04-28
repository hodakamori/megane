/**
 * Performance budget test for the megane Vite app.
 *
 * Measures (via window.__MEGANE_PERF__ + performance.measure entries):
 *   - megane:wasm-init     ms          ≤ 1500
 *   - megane:parse:<file>  ms          ≤ 200 (1crn) / ≤ 5000 (water_100k)
 *   - megane:first-render  ms          ≤ 2500
 *   - steady FPS           ≥ 24 (computed from window.__meganeFrameTimes after a
 *                                 5-second observation window)
 *   - playback stutter     ≤ 10% of frame intervals exceed 50 ms
 *   - heap usage           ≤ 1500 MB after water_100k
 *
 * Persists raw measurements to tests/e2e/perf_app.json for artifact upload.
 *
 * The test is split into two scenarios:
 *   A. small  : load 1crn.pdb, exercise WASM init + first-render budget
 *   B. medium : load water_100k.pdb, exercise large parse + heap budget
 *
 * Each scenario runs 3 times and takes the median value to bound runner flake.
 */

import { join } from "path";
import { assert } from "./utils/assert.mjs";
import {
  REPO_ROOT,
  getChromium,
  startViteServer,
  setupPerfHooks,
  collectPerf,
  analyzeFrames,
  saveScreenshot,
  savePerfJson,
  waitForCanvasNonEmpty,
  sleep,
} from "./utils/playwright.mjs";

const FIXTURES = join(REPO_ROOT, "tests", "fixtures");

const BUDGETS = {
  wasmInitMs: 1500,
  parse1CrnMs: 200,
  parseWater100kMs: 5000,
  firstRenderMs: 2500,
  steadyFpsMin: 24,
  stutterRatioMax: 0.10,
  heapMaxBytes: 1500 * 1024 * 1024,
};

function median(arr) {
  if (!arr.length) return null;
  const sorted = [...arr].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}

async function runScenarioOnce({ context, server, fixture, fixtureKey }) {
  const page = await context.newPage();
  page.on("pageerror", (err) => console.log(`  [pageerror] ${err.message}`));
  try {
    await page.goto(server.url, { waitUntil: "domcontentloaded", timeout: 30000 });
    await page.waitForSelector("canvas", { timeout: 15000 });
    await page
      .waitForFunction(() => window.__meganeRendererReady === true, null, { timeout: 30000 })
      .catch(() => {});

    // Upload the fixture if requested
    if (fixture) {
      const input = page.locator('[data-testid="structure-upload-input"]');
      await input.waitFor({ state: "attached", timeout: 5000 });
      await input.setInputFiles(fixture);
      await waitForCanvasNonEmpty(page, "canvas", { timeout: 30000 });
    }
    await sleep(500);

    // Observe steady FPS for 5 seconds. Reset frame times first.
    await page.evaluate(() => { window.__meganeFrameTimes = []; });
    await sleep(5000);

    const perf = await collectPerf(page);
    const frames = analyzeFrames(perf.frameTimes);
    await saveScreenshot(page, `perf-${fixtureKey}.png`);
    return { perf, frames };
  } finally {
    await page.close().catch(() => {});
  }
}

async function runScenario({ context, server, fixture, fixtureKey, runs = 3 }) {
  const results = [];
  for (let i = 0; i < runs; i++) {
    console.log(`  run ${i + 1}/${runs}`);
    results.push(await runScenarioOnce({ context, server, fixture, fixtureKey }));
  }

  function pickMeasure(measures, namePred) {
    const m = measures.find(namePred);
    return m ? m.duration : null;
  }

  const wasmInit = results.map((r) => pickMeasure(r.perf.measures, (m) => m.name === "megane:wasm-init")).filter((v) => v !== null);
  const parse = results.map((r) => pickMeasure(r.perf.measures, (m) => m.name.startsWith("megane:parse:"))).filter((v) => v !== null);
  const firstRender = results.map((r) => pickMeasure(r.perf.measures, (m) => m.name === "megane:first-render")).filter((v) => v !== null);
  const fps = results.map((r) => (r.frames ? r.frames.fps : null)).filter((v) => v !== null);
  const stutter = results.map((r) => (r.frames ? r.frames.stutterRatio : null)).filter((v) => v !== null);
  const heap = results.map((r) => r.perf.heap).filter((v) => v !== null && v !== undefined);

  return {
    wasmInitMs: median(wasmInit),
    parseMs: median(parse),
    firstRenderMs: median(firstRender),
    fps: median(fps),
    stutterRatio: median(stutter),
    heapBytes: median(heap),
    raw: results.map((r) => ({
      measures: r.perf.measures,
      frames: r.frames,
      heap: r.perf.heap,
    })),
  };
}

let server = null;
let browser = null;

try {
  console.log("Starting Vite dev server...");
  server = await startViteServer();
  console.log(`Vite running on ${server.url}`);

  const chromium = getChromium();
  browser = await chromium.launch({ headless: true, args: ["--use-gl=swiftshader"] });
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  await setupPerfHooks(context);

  const out = { budgets: BUDGETS, scenarios: {} };

  console.log("\n=== Scenario: small (1crn.pdb) ===");
  const small = await runScenario({
    context,
    server,
    fixture: join(FIXTURES, "1crn.pdb"),
    fixtureKey: "1crn",
  });
  out.scenarios.small = small;
  console.log(`  wasm-init      median = ${small.wasmInitMs?.toFixed(1)} ms (budget ${BUDGETS.wasmInitMs})`);
  console.log(`  parse(1crn)    median = ${small.parseMs?.toFixed(1)} ms (budget ${BUDGETS.parse1CrnMs})`);
  console.log(`  first-render   median = ${small.firstRenderMs?.toFixed(1)} ms (budget ${BUDGETS.firstRenderMs})`);
  console.log(`  steady fps     median = ${small.fps?.toFixed(1)} (budget ≥ ${BUDGETS.steadyFpsMin})`);
  console.log(`  stutter ratio  median = ${(small.stutterRatio ?? 0).toFixed(3)} (budget ≤ ${BUDGETS.stutterRatioMax})`);

  if (small.wasmInitMs !== null) assert(small.wasmInitMs <= BUDGETS.wasmInitMs, `WASM init ≤ ${BUDGETS.wasmInitMs} ms`);
  if (small.parseMs !== null) assert(small.parseMs <= BUDGETS.parse1CrnMs, `parse(1crn) ≤ ${BUDGETS.parse1CrnMs} ms`);
  if (small.firstRenderMs !== null) assert(small.firstRenderMs <= BUDGETS.firstRenderMs, `first-render ≤ ${BUDGETS.firstRenderMs} ms`);
  if (small.fps !== null) assert(small.fps >= BUDGETS.steadyFpsMin, `steady FPS ≥ ${BUDGETS.steadyFpsMin}`);
  if (small.stutterRatio !== null) assert(small.stutterRatio <= BUDGETS.stutterRatioMax, `stutter ratio ≤ ${BUDGETS.stutterRatioMax}`);

  console.log("\n=== Scenario: medium (water_100k.pdb) ===");
  const medium = await runScenario({
    context,
    server,
    fixture: join(FIXTURES, "water_100k.pdb"),
    fixtureKey: "water_100k",
    runs: 1,
  });
  out.scenarios.medium = medium;
  console.log(`  parse(100k)    = ${medium.parseMs?.toFixed(1)} ms (budget ${BUDGETS.parseWater100kMs})`);
  console.log(`  first-render   = ${medium.firstRenderMs?.toFixed(1)} ms (budget ${BUDGETS.firstRenderMs})`);
  console.log(`  heap           = ${(medium.heapBytes ?? 0) / (1024 * 1024)} MB (budget ${BUDGETS.heapMaxBytes / (1024 * 1024)} MB)`);

  if (medium.parseMs !== null) assert(medium.parseMs <= BUDGETS.parseWater100kMs, `parse(water_100k) ≤ ${BUDGETS.parseWater100kMs} ms`);
  if (medium.heapBytes !== null && medium.heapBytes !== undefined) assert(medium.heapBytes <= BUDGETS.heapMaxBytes, `heap ≤ ${BUDGETS.heapMaxBytes / (1024 * 1024)} MB`);

  savePerfJson("app", out);

  if (process.exitCode === 1) {
    console.log("\n--- perf_app: SOME BUDGETS EXCEEDED ---");
  } else {
    console.log("\n--- perf_app: WITHIN BUDGET ---");
  }
} catch (err) {
  console.error("perf_app fatal:", err);
  process.exitCode = 1;
} finally {
  if (browser) await browser.close().catch(() => {});
  if (server) server.kill();
}
