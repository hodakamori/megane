/**
 * Promotional-video director for the megane app.
 *
 * Records one continuous webm that follows this storyboard (see the user's
 * "台本"); the camera is the `#root` CSS transform, so every move between
 * regions is a smooth tween — there are no hard cuts:
 *
 *   1. Show the whole screen.
 *   2. Scroll + zoom down to the Chat input box (bottom-right).
 *   3. Type the prompt and click "Generate".
 *   4. Pan up to the top-right response area and dwell ~20s while the LLM
 *      reply streams in and the pipeline is applied (water → line repr).
 *   5. Pan over to the molecule and frame the whole structure (water now drawn
 *      as lines, caffeine left in its normal style).
 *   6. Scroll + zoom to the top-right (pipeline panel header).
 *   7. Click the Editor tab to reveal the generated pipeline graph.
 *   8. Slowly scroll down through the pipeline graph.
 *
 * Why the pipeline (steps 7-8) does NOT use the #root CSS camera:
 * ReactFlow measures node-handle positions with getBoundingClientRect and
 * divides only by its own internal zoom — it has no idea about an ancestor
 * CSS transform. Any CSS scale on `#root` (even after the handles were measured
 * at identity) corrupts the edge geometry: edges fly off their handles in wide
 * arcs. So for the pipeline we drop the #root transform entirely and instead
 * grow the ReactFlow container itself to a fullscreen overlay — a real layout
 * resize, which ReactFlow's ResizeObserver picks up and re-measures correctly —
 * then use ReactFlow's own fitView / zoom / pane-drag to frame and scroll. The
 * graph is never under a CSS scale, so the edges stay welded to their handles.
 *
 * Generation is a real, paid LLM call, so it only runs when you provide a key
 * or point at a site that ships its own proxy:
 *   ANTHROPIC_API_KEY=sk-ant-... node scripts/promo-video.mjs   # local BYOK
 *   node scripts/promo-video.mjs --url https://<demo-site>/     # site proxy
 *   node scripts/promo-video.mjs --no-generate                  # type only
 *
 * Options:
 *   --out <path>            Output webm (default: demo/out/megane-promo-<ts>.webm)
 *   --url <url>             Record an already-running instance (its built-in LLM
 *                           proxy makes Generate work with no API key)
 *   --prompt <text>         Override the Chat prompt
 *   --width / --height <px> Viewport size (default 1920x1080)
 *   --dpr <n>               deviceScaleFactor (default 2 — crisp CSS-zoom)
 *   --response-wait <ms>    Dwell on the response frame (default 20000)
 *   --no-generate           Type the prompt but don't submit
 *   --clean                 Remove demo/out before running
 *
 * Requires WASM to be built first; this script builds it automatically if the
 * pkg directory is missing (CLAUDE.md CRITICAL RULE #3).
 */

import { spawn, execSync } from "child_process";
import { existsSync, mkdirSync, readdirSync, renameSync, rmSync } from "fs";
import { join, dirname, isAbsolute } from "path";
import { fileURLToPath } from "url";
import { getChromium } from "../tests/e2e/utils/playwright.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUT_DIR = join(ROOT, "demo", "out");

const chromium = getChromium();

// ---- CLI parsing ----
const args = process.argv.slice(2);
const hasFlag = (f) => args.includes(f);
const getFlag = (f, d) => {
  const i = args.indexOf(f);
  return i === -1 || i + 1 >= args.length ? d : args[i + 1];
};

const TIMESTAMP = new Date()
  .toISOString()
  .replace(/[:.]/g, "-")
  .replace("T", "_")
  .slice(0, 19);
const PORT = 15573 + Math.floor(Math.random() * 100);

// ---- Config ----
const WIDTH = parseInt(getFlag("--width", "1920"), 10);
const HEIGHT = parseInt(getFlag("--height", "1080"), 10);
const DPR = parseFloat(getFlag("--dpr", "2"));
// Default zoom-tween duration. Long enough to read as a deliberate camera move.
const TRANSITION_MS = parseInt(getFlag("--transition", "1100"), 10);
const PROMPT = getFlag(
  "--prompt",
  "Render the water molecules as a line representation, but leave the caffeine in its normal style.",
);
const RESPONSE_WAIT_MS = parseInt(getFlag("--response-wait", "20000"), 10);
// Linear time spent scrolling down through the pipeline graph.
const PIPELINE_SCROLL_MS = parseInt(getFlag("--pipeline-scroll", "5200"), 10);
const NO_GENERATE = hasFlag("--no-generate");
const CLEAN = hasFlag("--clean");
const API_KEY = process.env.ANTHROPIC_API_KEY || "";
const URL = getFlag("--url", "");
const URL_MODE = URL.length > 0;
const RUN_GENERATE = !NO_GENERATE && (Boolean(API_KEY) || URL_MODE);

const outArg = getFlag("--out", join(OUT_DIR, `megane-promo-${TIMESTAMP}.webm`));
const OUT_PATH = isAbsolute(outArg) ? outArg : join(ROOT, outArg);

const SEL = {
  chatTab: '[data-testid="pipeline-editor-tab-chat"]',
  editorTab: '[data-testid="pipeline-editor-tab-editor"]',
  promptBox: 'textarea[placeholder="Describe the pipeline you want..."]',
  generateBtn: 'button:has-text("Generate")',
  chatMessages: '[data-testid="pipeline-chat-messages"]',
  appliedNotice: '[data-testid="pipeline-editor-applied-notice"]',
  panelPipeline: '[data-testid="panel-pipeline"]',
  viewer: '[data-testid="viewer-root"]',
  reactFlow: ".react-flow",
  rfPane: ".react-flow__pane",
  rfZoomIn: ".react-flow__controls-zoomin",
  rfFitView: ".react-flow__controls-fitview",
};

// ---- Setup helpers ----

function ensureWasm() {
  if (existsSync(join(ROOT, "crates", "megane-wasm", "pkg"))) return;
  console.log("WASM package not found. Building...");
  execSync("npm run build:wasm", { cwd: ROOT, stdio: "inherit", timeout: 180000 });
}

function startViteServer() {
  return new Promise((resolve, reject) => {
    const proc = spawn("npx", ["vite", "--port", String(PORT), "--host", "127.0.0.1"], {
      cwd: ROOT,
      stdio: ["ignore", "pipe", "pipe"],
      env: { ...process.env, NODE_ENV: "development" },
    });
    const timeout = setTimeout(() => reject(new Error("Vite did not start in time")), 30000);
    const handler = (data) => {
      const line = data.toString();
      if (line.includes("Local:") && line.includes(String(PORT))) {
        clearTimeout(timeout);
        resolve(proc);
      }
    };
    proc.stdout.on("data", handler);
    proc.stderr.on("data", handler);
    proc.on("error", (err) => {
      clearTimeout(timeout);
      reject(err);
    });
  });
}

async function waitForApp(page, appUrl) {
  await page.goto(appUrl, { waitUntil: "domcontentloaded", timeout: 30000 });
  await page.waitForSelector("canvas", { timeout: 20000 });
  await page.waitForSelector(SEL.panelPipeline, { state: "visible", timeout: 15000 });
  // ReactFlow mounts hidden on the Editor tab — wait for it attached, not visible.
  await page.waitForSelector(SEL.reactFlow, { state: "attached", timeout: 15000 });
  await page.waitForTimeout(3500); // let the first render + trajectory settle
}

// ---- Camera (the #root CSS transform) ----
// screen = translate(tx,ty) ∘ scale(s) over local coords, origin top-left.
let current = { tx: 0, ty: 0, s: 1 };

async function applyTransform(page, t) {
  current = t;
  await page.evaluate(
    ({ tx, ty, s }) => {
      const root = document.getElementById("root");
      if (root) root.style.transform = `translate(${tx}px, ${ty}px) scale(${s})`;
    },
    t,
  );
}

async function setTransition(page, ms, easing = "cubic-bezier(0.4, 0, 0.2, 1)") {
  await page.evaluate(
    ({ ms, easing }) => {
      const root = document.getElementById("root");
      if (root) root.style.transition = `transform ${ms}ms ${easing}`;
    },
    { ms, easing },
  );
}

/** Recover an element's untransformed (local) rect from its on-screen box. */
function toLocalRect(box) {
  return {
    lx: (box.x - current.tx) / current.s,
    ly: (box.y - current.ty) / current.s,
    lw: box.width / current.s,
    lh: box.height / current.s,
  };
}

/** Union of several on-screen boxes (skips nulls). */
function unionBoxes(boxes) {
  const valid = boxes.filter(Boolean);
  if (valid.length === 0) return null;
  const x0 = Math.min(...valid.map((b) => b.x));
  const y0 = Math.min(...valid.map((b) => b.y));
  const x1 = Math.max(...valid.map((b) => b.x + b.width));
  const y1 = Math.max(...valid.map((b) => b.y + b.height));
  return { x: x0, y: y0, width: x1 - x0, height: y1 - y0 };
}

async function boxOf(page, sel) {
  return page.locator(sel).first().boundingBox();
}

/**
 * Tween the camera so a local rect is framed.
 *   scale   explicit zoom factor; otherwise fit the padded rect to the viewport
 *   anchorX/anchorY  which point of the rect maps to the viewport centre (0..1)
 *   alignTop pin the rect's top near the top of the screen instead of centring Y
 */
async function frameLocalRect(page, rect, opts = {}, ms = TRANSITION_MS) {
  const { pad = 0, scale, anchorX = 0.5, anchorY = 0.5, alignTop = false, topMargin = 48 } = opts;
  const lx = rect.lx - pad;
  const ly = rect.ly - pad;
  const lw = rect.lw + 2 * pad;
  const lh = rect.lh + 2 * pad;
  const s = scale ?? Math.min(WIDTH / lw, HEIGHT / lh);
  const tx = WIDTH / 2 - (lx + lw * anchorX) * s;
  const ty = alignTop ? topMargin - ly * s : HEIGHT / 2 - (ly + lh * anchorY) * s;
  await setTransition(page, ms);
  await applyTransform(page, { tx, ty, s });
  await page.waitForTimeout(ms);
}

async function zoomFull(page, ms = TRANSITION_MS) {
  await setTransition(page, ms);
  await applyTransform(page, { tx: 0, ty: 0, s: 1 });
  await page.waitForTimeout(ms);
}

async function zoomToSel(page, sel, opts = {}, ms = TRANSITION_MS) {
  const box = await boxOf(page, sel);
  if (!box) {
    console.warn(`  zoom target not found: ${sel} (skipping)`);
    return;
  }
  await frameLocalRect(page, toLocalRect(box), opts, ms);
}

async function zoomToUnion(page, sels, opts = {}, ms = TRANSITION_MS) {
  const boxes = await Promise.all(sels.map((s) => boxOf(page, s)));
  const u = unionBoxes(boxes);
  if (!u) {
    console.warn(`  zoom targets not found: ${sels.join(", ")} (skipping)`);
    return;
  }
  await frameLocalRect(page, toLocalRect(u), opts, ms);
}

// ---- Chat actions ----

async function typePrompt(page) {
  await page.locator(SEL.promptBox).first().waitFor({ state: "visible", timeout: 10000 });
  const perChar = 45;
  // The whole typewriter loop runs in-page (a single evaluate), so there's no
  // per-key Playwright roundtrip — in dev mode that latency otherwise stretches
  // typing to tens of seconds. We drive React's controlled textarea via its
  // native value setter + an `input` event so the state (and Generate enabled
  // state) updates. It doesn't depend on the element's screen position, so it
  // stays correct while the camera is zoomed into the input.
  await page.evaluate(
    async ({ sel, text, perChar }) => {
      const el = document.querySelector(sel);
      if (!el) return;
      const setter = Object.getOwnPropertyDescriptor(
        window.HTMLTextAreaElement.prototype,
        "value",
      ).set;
      const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
      for (let i = 1; i <= text.length; i++) {
        setter.call(el, text.slice(0, i));
        el.dispatchEvent(new Event("input", { bubbles: true }));
        await sleep(perChar);
      }
    },
    { sel: SEL.promptBox, text: PROMPT, perChar },
  );
}

async function clickGenerate(page) {
  if (!RUN_GENERATE) {
    console.log("  generation off (no key / no site LLM / --no-generate); prompt left in box");
    return;
  }
  // The Generate button is on-screen in the zoomed-in input frame; Playwright
  // resolves the click point through the CSS transform, so a normal click works.
  await page
    .locator(SEL.generateBtn)
    .first()
    .click({ timeout: 8000 })
    .catch(async (e) => {
      console.warn("  Generate click failed, falling back to Enter:", e.message);
      await page.evaluate((sel) => document.querySelector(sel)?.focus(), SEL.promptBox);
      await page.keyboard.press("Enter");
    });
}

/** Wait until the streamed reply has been applied (or the timeout elapses). */
async function waitForApplied(page, ms) {
  if (!RUN_GENERATE) {
    await page.waitForTimeout(ms);
    return;
  }
  const applied = page
    .locator(SEL.appliedNotice)
    .first()
    .waitFor({ state: "visible", timeout: ms })
    .then(() => true)
    .catch(() => false);
  // Dwell the full window regardless, so the response stays readable on screen.
  const [ok] = await Promise.all([applied, page.waitForTimeout(ms)]);
  console.log(ok ? "  pipeline applied" : "  applied notice not seen (dwell elapsed)");
}

// ---- BYOK key setup (local runs only; --url uses the site's own proxy) ----
async function setupApiKey(page) {
  if (NO_GENERATE || !API_KEY || URL_MODE) return;
  try {
    await page.locator(SEL.chatTab).first().click();
    await page.waitForTimeout(300);
    await page.locator('button[title="AI Settings"]').first().click();
    await page.waitForTimeout(300);
    await page.locator('input[type="password"]').first().fill(API_KEY);
    await page.locator('button[title="AI Settings"]').first().click();
    await page.waitForTimeout(300);
    console.log("  API key injected via Chat config panel");
  } catch (e) {
    console.warn("  API key setup failed (will fall back to no-generate):", e.message);
  }
}

// ---- Pipeline display (ReactFlow-native, NOT the #root CSS camera) ----
// ReactFlow measures node-handle positions with getBoundingClientRect and has
// no knowledge of an ancestor CSS transform, so scaling #root corrupts the edge
// geometry (edges fly off their handles). For the pipeline scenes we therefore
// leave #root untransformed and instead grow the ReactFlow container itself to
// fullscreen — a real layout resize, which ReactFlow's ResizeObserver picks up
// and re-measures correctly — then use ReactFlow's own zoom/pan so the edges
// always stay attached.

/** Drop the #root camera transform entirely (so position:fixed is viewport-relative). */
async function clearRootTransform(page) {
  await page.evaluate(() => {
    const root = document.getElementById("root");
    if (root) {
      root.style.transition = "none";
      root.style.transform = "none";
    }
  });
  current = { tx: 0, ty: 0, s: 1 };
}

// Rule body for the fullscreen pipeline overlay. We drive this through an
// injected `!important` stylesheet rather than inline styles because
// React/ReactFlow re-apply their own inline style on `.react-flow` and would
// wipe direct mutations. The geometry is set in a single step (never animated):
// animating the panel size makes ReactFlow's ResizeObserver fire mid-tween and
// measure handles at an intermediate size, corrupting the edge geometry.
const PANEL_FS_BASE = (sel) =>
  `${sel}{position:fixed!important;z-index:99999!important;margin:0!important;` +
  `left:0!important;top:0!important;width:100vw!important;height:100vh!important;` +
  `max-width:none!important;max-height:none!important;min-width:0!important;` +
  `background:var(--megane-surface-solid,#fff)!important;opacity:1!important;}`;

/** Snap the pipeline panel to a fullscreen overlay (opaque). */
async function setPanelFullscreen(page) {
  await page.evaluate(
    ({ sel, css }) => {
      let s = document.getElementById("promo-fs");
      if (!s) {
        s = document.createElement("style");
        s.id = "promo-fs";
        document.head.appendChild(s);
      }
      s.textContent = css;
    },
    { sel: SEL.panelPipeline, css: PANEL_FS_BASE(SEL.panelPipeline) },
  );
  await page.waitForTimeout(150);
}

/**
 * Force ReactFlow to re-measure every node handle by toggling the container's
 * display off and on (a real layout teardown/rebuild). The handles were
 * registered while #root was CSS-scaled during the chat zoom, so their stored
 * offsets are wrong and the edges balloon off their handles; rebuilding the
 * layout at the current (identity) scale fixes them. Runs behind the cover, so
 * the flicker is invisible.
 */
async function forceReactFlowRemeasure(page) {
  await page.evaluate((sel) => {
    const rf = document.querySelector(sel);
    if (rf) {
      rf.style.display = "none";
      void rf.offsetWidth;
    }
  }, SEL.reactFlow);
  await page.waitForTimeout(300);
  await page.evaluate((sel) => {
    const rf = document.querySelector(sel);
    if (rf) {
      rf.style.display = "";
      void rf.offsetWidth;
    }
  }, SEL.reactFlow);
  await page.waitForTimeout(900);
}

/**
 * Fade a full-viewport solid cover in/out. Appended to <body> (NOT inside
 * #root) so it stays viewport-fixed even while #root is CSS-transformed, and
 * sits above the pipeline overlay. We raise it over the still-zoomed chat panel,
 * swap to the clean fullscreen pipeline behind it, then fade it out — so the
 * camera never visibly pulls back to the full view between scenes 6 and 7.
 */
async function fadeCover(page, show, ms = 350) {
  await page.evaluate(
    ({ show, ms }) => {
      let c = document.getElementById("promo-cover");
      if (!c) {
        c = document.createElement("div");
        c.id = "promo-cover";
        c.style.position = "fixed";
        c.style.inset = "0";
        c.style.zIndex = "100000";
        c.style.background = "var(--megane-surface-solid, #fff)";
        c.style.opacity = "0";
        c.style.pointerEvents = "none";
        document.body.appendChild(c);
        void c.offsetWidth;
      }
      c.style.transition = `opacity ${ms}ms ease`;
      c.style.opacity = show ? "1" : "0";
    },
    { show, ms },
  );
  await page.waitForTimeout(ms + 80);
}

/** Drag the ReactFlow pane to scroll the viewport down through the graph. */
async function rfScrollDown(page, totalDy, ms) {
  const pane = await boxOf(page, SEL.rfPane);
  if (!pane) return;
  // Start the drag in an empty strip on the left so we grab the pane, not a node.
  const x = pane.x + Math.min(140, pane.width * 0.12);
  const yStart = pane.y + pane.height * 0.82;
  const yEnd = yStart - totalDy; // dragging up scrolls the view downward
  await page.mouse.move(x, yStart);
  await page.mouse.down();
  const steps = 48;
  for (let i = 1; i <= steps; i++) {
    const y = yStart + (yEnd - yStart) * (i / steps);
    await page.mouse.move(x, y);
    await page.waitForTimeout(ms / steps);
  }
  await page.mouse.up();
}

// ---- Main ----
let server = null;
let browser = null;
let context = null;

try {
  if (CLEAN && existsSync(OUT_DIR)) rmSync(OUT_DIR, { recursive: true });
  mkdirSync(OUT_DIR, { recursive: true });

  const genLabel = NO_GENERATE
    ? "off (--no-generate)"
    : API_KEY
      ? "live (ANTHROPIC_API_KEY)"
      : URL_MODE
        ? "live (site LLM via --url)"
        : "off (no key — pass ANTHROPIC_API_KEY or --url for the real effect)";
  console.log(`Output: ${OUT_PATH}`);
  console.log(`Viewport: ${WIDTH}x${HEIGHT} @${DPR}x`);
  console.log(`Prompt: ${PROMPT}`);
  console.log(`Generate: ${genLabel}`);

  let appUrl;
  if (URL_MODE) {
    appUrl = URL;
    console.log(`\nTarget: ${appUrl} (no local server)`);
  } else {
    ensureWasm();
    console.log("\nStarting Vite dev server...");
    server = await startViteServer();
    appUrl = `http://127.0.0.1:${PORT}/`;
    console.log(`Vite running on port ${PORT}`);
  }

  browser = await chromium.launch({ headless: true });

  // Warm-up pass in a throwaway (non-recorded) context. Vite dev compiles the
  // app + WASM lazily on first request, which can take a minute — recording
  // that would prepend a long static frame to the video. Pre-compiling here so
  // the recorded load is fast keeps the output tight (skipped in --url mode,
  // where the target is already built/served).
  if (!URL_MODE) {
    console.log("Warming up the dev server (pre-compile)...");
    const warm = await browser.newContext({ ignoreHTTPSErrors: true });
    try {
      const wp = await warm.newPage();
      await wp.goto(appUrl, { waitUntil: "domcontentloaded", timeout: 60000 });
      await wp.waitForSelector("canvas", { timeout: 60000 }).catch(() => {});
      await wp.waitForTimeout(2000);
    } catch (e) {
      console.warn("  warm-up incomplete (continuing):", e.message);
    } finally {
      await warm.close();
    }
  }

  const tmpDir = join(OUT_DIR, `tmp-${TIMESTAMP}`);
  mkdirSync(tmpDir, { recursive: true });

  context = await browser.newContext({
    viewport: { width: WIDTH, height: HEIGHT },
    deviceScaleFactor: DPR,
    recordVideo: { dir: tmpDir, size: { width: WIDTH, height: HEIGHT } },
    ignoreHTTPSErrors: true,
  });
  await context.addInitScript(() => {
    try {
      localStorage.setItem("megane-tour-prefs", JSON.stringify({ dontShowAgain: true }));
      sessionStorage.setItem("megane-pipeline-ui", JSON.stringify({ mode: "chat" }));
    } catch {
      /* noop */
    }
    // The chat auto-scrolls to the newest message on every streamed chunk via
    // scrollIntoView; with a verbose reply that drags the response out of our
    // fixed top-aligned frame mid-generation. Neutralise it so the response
    // stays put (only the chat uses scrollIntoView; ReactFlow pans via its own
    // transform, not scrollIntoView).
    window.Element.prototype.scrollIntoView = function () {};
  });

  const page = await context.newPage();
  await waitForApp(page, appUrl);

  // Make #root zoomable with a smooth tween anchored at the top-left.
  await page.evaluate((ms) => {
    const root = document.getElementById("root");
    if (root) {
      root.style.transformOrigin = "0 0";
      root.style.transition = `transform ${ms}ms cubic-bezier(0.4, 0, 0.2, 1)`;
      root.style.willChange = "transform";
    }
  }, TRANSITION_MS);

  await setupApiKey(page);
  // Ensure we're on the Chat tab (the opening frame) before recording the moves.
  await page.locator(SEL.chatTab).first().click().catch(() => {});
  await page.waitForTimeout(500);

  // ── 1. Whole screen ───────────────────────────────────────────────────────
  console.log("Scene 1: overview");
  await zoomFull(page, 600);
  await page.waitForTimeout(2500);

  // ── 2. Scroll + zoom to the Chat input (bottom-right) ──────────────────────
  console.log("Scene 2: zoom to chat input");
  // Frame the input box together with the Generate button so the click target
  // stays comfortably on screen.
  await zoomToUnion(page, [SEL.promptBox, SEL.generateBtn], { pad: 24, anchorY: 0.5 });
  // Remember this magnification so the response scene (4) frames the chat at the
  // exact same zoom level as the input — the camera only slides up, never rescales.
  const inputScale = current.s;
  await page.waitForTimeout(700);

  // ── 3. Type the prompt and click Generate ──────────────────────────────────
  console.log("Scene 3: type prompt + Generate");
  await typePrompt(page);
  await page.waitForTimeout(600);
  await clickGenerate(page);
  await page.waitForTimeout(900);

  // ── 4. Pan up to the response area; dwell while the reply streams in ────────
  // Keep the input's magnification (`inputScale`) and only slide the camera up to
  // the messages area, so the zoom level matches scene 2/3 exactly.
  console.log(`Scene 4: response area, dwell ${RESPONSE_WAIT_MS}ms`);
  await zoomToSel(page, SEL.chatMessages, {
    pad: 18,
    alignTop: true,
    topMargin: 64,
    scale: inputScale,
  });
  await waitForApplied(page, RESPONSE_WAIT_MS);

  // ── 5. Frame the whole molecule (water now drawn as lines) ──────────────────
  console.log("Scene 5: molecule overview");
  await zoomToSel(page, SEL.viewer, { pad: 8 });
  await page.waitForTimeout(4000);

  // ── 6. Scroll + zoom to the top-right (pipeline panel header) ───────────────
  console.log("Scene 6: top-right panel");
  await zoomToSel(page, SEL.panelPipeline, { pad: 12, alignTop: true, topMargin: 56, scale: 1.9 });
  await page.waitForTimeout(2000);

  // ── 7. Stay zoomed, click the Editor tab, reveal the pipeline ──────────────
  // The camera stays zoomed into the top-right — we do NOT pull back to the full
  // view. ReactFlow can't render under a #root CSS scale (its edges detach), so
  // we hide the switch behind a brief cover fade: raise a full-viewport cover
  // over the zoomed chat panel, and behind it switch to the Editor tab, drop the
  // #root zoom, grow the panel to a fullscreen overlay at identity, re-measure
  // the handles (fixing the scale-corrupted edges), and fit the graph. Fading the
  // cover back out reveals the clean pipeline — still zoomed in, no pull-back.
  console.log("Scene 7: show pipeline (stay zoomed)");
  await fadeCover(page, true, 380);
  await page.locator(SEL.editorTab).first().click().catch((e) => console.log("  editor tab click failed:", e.message));
  await page.waitForTimeout(300);
  await clearRootTransform(page);
  await setPanelFullscreen(page);
  await forceReactFlowRemeasure(page);
  const rfBox = await boxOf(page, SEL.reactFlow);
  if (rfBox) {
    await page.locator(SEL.rfFitView).first().click().catch(() => {});
    await page.waitForTimeout(400);
    await fadeCover(page, false, 450);
    await page.waitForTimeout(1400);

    // ── 8. Zoom in and slowly scroll down through the pipeline graph ─────────
    console.log("Scene 8: scroll through pipeline");
    // Native zoom-in (centred) so the graph overflows vertically and there is
    // something to scroll through.
    for (let i = 0; i < 3; i++) {
      await page.locator(SEL.rfZoomIn).first().click().catch(() => {});
      await page.waitForTimeout(450);
    }
    await page.waitForTimeout(800);
    // Native pane drag pans the ReactFlow viewport — edges follow natively.
    await rfScrollDown(page, HEIGHT * 1.1, PIPELINE_SCROLL_MS);
    await page.waitForTimeout(2500);
  } else {
    console.warn("  react-flow not found; skipping pipeline scroll");
    await fadeCover(page, false, 450);
    await page.waitForTimeout(2500);
  }

  // Finalize the recording.
  await page.close();
  await context.close();
  context = null;

  const file = readdirSync(tmpDir).find((f) => f.endsWith(".webm"));
  if (!file) throw new Error(`No webm produced in ${tmpDir}`);
  renameSync(join(tmpDir, file), OUT_PATH);
  rmSync(tmpDir, { recursive: true });

  console.log(`\nDone. Promo video saved: ${OUT_PATH}`);
} catch (err) {
  console.error("Promo video failed:", err.message);
  process.exitCode = 1;
} finally {
  if (context) await context.close();
  if (browser) await browser.close();
  if (server) server.kill();
}
