/**
 * Demo video director for the megane app.
 *
 * Interprets the storyboard in `scripts/demo-script.mjs` ("台本"), drives the
 * live Vite app with Playwright, and records a single continuous webm while
 * zooming into UI regions via a CSS transform tween on `#root`.
 *
 * Usage:
 *   node scripts/demo-video.mjs [options]
 *   ANTHROPIC_API_KEY=sk-ant-... node scripts/demo-video.mjs   # live AI generate
 *
 * Options:
 *   --out <path>        Output webm path (default: demo/out/megane-demo-<ts>.webm)
 *   --url <url>         Record an already-running instance (e.g. the deployed
 *                       demo site) instead of starting a local Vite server. The
 *                       demo site's built-in LLM proxy makes generation run with
 *                       no API key.
 *   --prompt <text>     Override the Chat prompt from the storyboard
 *   --width <px>        Viewport width  (default: storyboard config.width)
 *   --height <px>       Viewport height (default: storyboard config.height)
 *   --dpr <n>           deviceScaleFactor (default: storyboard config.dpr)
 *   --no-generate       Skip the live AI call; type the prompt only
 *   --generate-timeout <ms>  Max wait for the streamed response (default 45000)
 *   --clean             Remove demo/out before running
 *
 * Requires WASM to be built first (`npm run build:wasm`); this script will
 * build it automatically if the pkg directory is missing.
 */

import { spawn, execSync } from "child_process";
import { existsSync, mkdirSync, readdirSync, renameSync, rmSync } from "fs";
import { join, dirname, isAbsolute } from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { createRequire } from "module";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUT_DIR = join(ROOT, "demo", "out");

// Resolve Playwright from the global install (same pattern as dev-preview.mjs).
const _require = createRequire("/opt/node22/lib/node_modules/");
const { chromium } = _require("playwright");

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
const PORT = 15473 + Math.floor(Math.random() * 100);

// ---- Storyboard ----
const { config, scenes } = await import(
  pathToFileURL(join(__dirname, "demo-script.mjs")).href
);

const WIDTH = parseInt(getFlag("--width", String(config.width)), 10);
const HEIGHT = parseInt(getFlag("--height", String(config.height)), 10);
const DPR = parseFloat(getFlag("--dpr", String(config.dpr)));
const TRANSITION_MS = config.transitionMs ?? 900;
const PIPELINE_SCROLL_SCALE = config.pipelineScrollScale ?? 1.6;
const PIPELINE_WIDTH_FRACTION = config.pipelineWidthFraction ?? 0;
const PIPELINE_SCROLL_MS = config.pipelineScrollMs ?? 4800;
const PROMPT = getFlag("--prompt", config.prompt);
const NO_GENERATE = hasFlag("--no-generate");
const CLEAN = hasFlag("--clean");
const API_KEY = process.env.ANTHROPIC_API_KEY || "";
// Point at an already-running instance (e.g. the deployed demo site) instead of
// spinning up a local Vite server. The demo site ships the free LLM proxy, so
// generation runs there without an API key.
const URL = getFlag("--url", "");
const URL_MODE = URL.length > 0;
// Run a real generation when we have a key (local BYOK) or a site that provides
// its own LLM (the deployed demo proxy via --url). Output is non-deterministic.
const RUN_GENERATE = !NO_GENERATE && (Boolean(API_KEY) || URL_MODE);
const GENERATE_TIMEOUT_MS = parseInt(getFlag("--generate-timeout", "45000"), 10);

const outArg = getFlag("--out", join(OUT_DIR, `megane-demo-${TIMESTAMP}.webm`));
const OUT_PATH = isAbsolute(outArg) ? outArg : join(ROOT, outArg);

// ---- Setup helpers (reused from dev-preview.mjs patterns) ----

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
  // The pipeline panel defaults to the Chat tab, so the Editor tab's
  // `.react-flow` mounts hidden — wait for it attached, not visible.
  await page.waitForSelector('[data-testid="panel-pipeline"]', { state: "visible", timeout: 15000 });
  await page.waitForSelector(".react-flow", { state: "attached", timeout: 15000 });
  await page.waitForTimeout(3000); // let the first render settle
}

// ---- Zoom engine ----
// Current #root transform: screen = translate(tx,ty) ∘ scale(s) over local coords,
// with transform-origin at the top-left. We track it so a target element's
// untransformed rect can be recovered from its on-screen boundingBox.
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

// Swap the #root transition used for the next move (duration + easing).
async function setTransition(page, ms, easing = "cubic-bezier(0.4, 0, 0.2, 1)") {
  await page.evaluate(
    ({ ms, easing }) => {
      const root = document.getElementById("root");
      if (root) root.style.transition = `transform ${ms}ms ${easing}`;
    },
    { ms, easing },
  );
}

async function zoomTo(page, spec, ms = TRANSITION_MS) {
  if (spec === "keep") return;
  await setTransition(page, ms);
  if (!spec || spec === "full") {
    await applyTransform(page, { tx: 0, ty: 0, s: 1 });
    await page.waitForTimeout(ms);
    return;
  }
  const { sel, pad = 0, scale } = spec;
  const box = await page.locator(sel).first().boundingBox();
  if (!box) {
    console.warn(`  zoom target not found: ${sel} (skipping)`);
    return;
  }
  // Recover the untransformed (local) rect from the on-screen box.
  const lx = (box.x - current.tx) / current.s - pad;
  const ly = (box.y - current.ty) / current.s - pad;
  const lw = box.width / current.s + 2 * pad;
  const lh = box.height / current.s + 2 * pad;
  // `scale` (explicit) zooms by a fixed factor centered on the target — use it
  // when the target is full-height (fit-to-bbox would compute ~1× and not zoom).
  // Otherwise fit the padded bbox to the viewport.
  const s = scale ?? Math.min(WIDTH / lw, HEIGHT / lh);
  // Horizontal: anchorX picks which point maps to the viewport centre.
  const tx = WIDTH / 2 - (lx + lw * (spec.anchorX ?? 0.5)) * s;
  // Vertical: `alignTop` pins the element's top near the top of the screen
  // (e.g. to keep the Pipeline/Chat tab bar up top); otherwise anchorY centres.
  const ty = spec.alignTop
    ? (spec.topMargin ?? 28) - ly * s
    : HEIGHT / 2 - (ly + lh * (spec.anchorY ?? 0.5)) * s;
  await applyTransform(page, { tx, ty, s });
  await page.waitForTimeout(ms);
}

// ---- Scene actions ("verbs") ----

const SEL = {
  chatTab: '[data-testid="pipeline-editor-tab-chat"]',
  editorTab: '[data-testid="pipeline-editor-tab-editor"]',
  promptBox: 'textarea[placeholder="Describe the pipeline you want..."]',
  generateBtn: 'button:has-text("Generate")',
  cancelBtn: 'button:has-text("Cancel")',
  chatMessages: '[data-testid="pipeline-chat-messages"]',
  appliedNotice: '[data-testid="pipeline-editor-applied-notice"]',
  panelPipeline: '[data-testid="panel-pipeline"]',
  viewer: '[data-testid="viewer-root"]',
  reactFlow: ".react-flow",
};

const actions = {
  // Type the prompt into the Chat input — but do NOT submit yet, so generation
  // only starts once the next scene has settled on a fixed frame.
  async typePrompt(page) {
    // The panel defaults to the Chat tab, so the textarea is already present.
    await page.locator(SEL.promptBox).first().waitFor({ state: "visible", timeout: 10000 });
    // Typewriter effect driven entirely in-page: set the value via React's
    // native textarea setter and dispatch an `input` event so React picks it up.
    // This bypasses Playwright actionability (no per-key click/stability checks),
    // so it stays fast and reliable even while the #root zoom transform is live.
    for (let i = 1; i <= PROMPT.length; i++) {
      await page.evaluate(
        ({ sel, val }) => {
          const el = document.querySelector(sel);
          if (!el) return;
          const setter = Object.getOwnPropertyDescriptor(
            window.HTMLTextAreaElement.prototype,
            "value",
          ).set;
          setter.call(el, val);
          el.dispatchEvent(new Event("input", { bubbles: true }));
        },
        { sel: SEL.promptBox, val: PROMPT.slice(0, i) },
      );
      await page.waitForTimeout(45);
    }
  },

  // Submit the typed prompt (fire-and-forget). Called after the camera has
  // settled on the fixed response frame; the scene's `hold` then dwells in place
  // (~30s) while the reply streams in and the pipeline applies — the screen does
  // not move. Submits via Enter (the textarea's own handler) so the off-screen
  // Generate button isn't required.
  async submitPrompt(page) {
    if (!RUN_GENERATE) {
      console.log("  generation off (no key / no site LLM / --no-generate); prompt left in box");
      return;
    }
    await page.evaluate((sel) => document.querySelector(sel)?.focus(), SEL.promptBox);
    await page.keyboard.press("Enter");
  },

  async rotate(page) {
    const box = await page.locator(SEL.viewer).first().boundingBox();
    if (!box) return;
    const cx = box.x + box.width / 2;
    const cy = box.y + box.height / 2;
    const r = Math.min(box.width, box.height) * 0.18;
    await page.mouse.move(cx, cy);
    await page.mouse.down();
    const steps = 40;
    for (let i = 0; i <= steps; i++) {
      const a = (i / steps) * Math.PI * 1.2;
      await page.mouse.move(cx + r * Math.cos(a), cy + r * Math.sin(a) * 0.35);
      await page.waitForTimeout(40);
    }
    await page.mouse.up();
  },

  // Switch to the Editor tab, then frame the pipeline panel at ~70% width with
  // the Pipeline/Chat tab bar pinned to the top of the screen and scroll the
  // graph top→bottom (TB dagre layout).
  //
  // The tab is clicked at IDENTITY (no #root transform) on purpose: ReactFlow
  // runs fitView on the chat→editor switch, and if a CSS transform is active
  // while it measures, the edges render offset from the node handles. We let
  // fitView settle untransformed, then zoom/scroll with a pure uniform scale —
  // which triggers no re-measure, so the edges stay connected.
  async clickPipelineTabAndScroll(page) {
    const topM = 24;
    const botM = 56;

    // Pull back to full view and switch tabs so fitView measures untransformed.
    await zoomTo(page, "full", 900);
    await page
      .locator(SEL.editorTab)
      .first()
      .click()
      .catch((e) => console.log("  editor tab click failed:", e.message));
    await page.waitForTimeout(1500); // let fitView settle at identity

    // Now at identity, so on-screen boxes equal local coordinates. Size from the
    // panel width and pin its top (the "Pipeline" title + tabs) to the top.
    const pbox = await page.locator(SEL.panelPipeline).first().boundingBox();
    if (!pbox) return;
    const S = PIPELINE_WIDTH_FRACTION
      ? (PIPELINE_WIDTH_FRACTION * WIDTH) / pbox.width
      : PIPELINE_SCROLL_SCALE;
    const tx = WIDTH / 2 - (pbox.x + pbox.width / 2) * S;
    const tyTop = topM - pbox.y * S;

    // Ease in with the tabs at the top.
    await setTransition(page, 1100);
    await applyTransform(page, { tx, ty: tyTop, s: S });
    await page.waitForTimeout(1100 + 700);

    // Scroll down through the graph, keeping the same scale/centre.
    const rf = await page.locator(SEL.reactFlow).first().boundingBox();
    if (!rf) return;
    const tyBottom = HEIGHT - botM - (rf.y + rf.height) * S;
    if (rf.height * S > HEIGHT - topM - botM) {
      await setTransition(page, PIPELINE_SCROLL_MS, "linear");
      await applyTransform(page, { tx, ty: tyBottom, s: S });
      await page.waitForTimeout(PIPELINE_SCROLL_MS);
      await setTransition(page, TRANSITION_MS); // restore eased default
    }
  },
};

// ---- API key setup (BYOK via the Chat config panel) ----
// Only needed for local BYOK runs. In --url mode the target (e.g. the demo
// site) provides its own LLM via the built-in proxy, so no key is entered.
async function setupApiKey(page) {
  if (NO_GENERATE || !API_KEY || URL_MODE) return;
  try {
    await page.locator(SEL.chatTab).first().click();
    await page.waitForTimeout(300);
    await page.locator('button[title="AI Settings"]').first().click();
    await page.waitForTimeout(300);
    const keyInput = page.locator('input[type="password"]').first();
    await keyInput.fill(API_KEY);
    // Close the config panel, leaving the panel on the Chat tab (its default)
    // so the chat scene finds the prompt box without an extra tab switch.
    await page.locator('button[title="AI Settings"]').first().click();
    await page.waitForTimeout(300);
    console.log("  API key injected via Chat config panel");
  } catch (e) {
    console.warn("  API key setup failed (will fall back to no-generate):", e.message);
  }
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
        : "off (no key)";
  console.log(`Output: ${OUT_PATH}`);
  console.log(`Viewport: ${WIDTH}x${HEIGHT} @${DPR}x  | scenes: ${scenes.map((s) => s.id).join(" → ")}`);
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
  const tmpDir = join(OUT_DIR, `tmp-${TIMESTAMP}`);
  mkdirSync(tmpDir, { recursive: true });

  context = await browser.newContext({
    viewport: { width: WIDTH, height: HEIGHT },
    deviceScaleFactor: DPR,
    recordVideo: { dir: tmpDir, size: { width: WIDTH, height: HEIGHT } },
    // Some networks (e.g. a TLS-intercepting egress proxy) present a cert
    // Chromium doesn't trust; tolerate it so --url can reach remote sites.
    ignoreHTTPSErrors: true,
  });
  // Suppress the first-run tour overlay, and boot the pipeline panel on the Chat
  // tab so the opening frame shows Chat by default (the deployed build may
  // otherwise default to the Editor tab). Set before the app's scripts run.
  await context.addInitScript(() => {
    try {
      localStorage.setItem("megane-tour-prefs", JSON.stringify({ dontShowAgain: true }));
      sessionStorage.setItem("megane-pipeline-ui", JSON.stringify({ mode: "chat" }));
    } catch {
      /* noop */
    }
    // The chat auto-scrolls to the latest message via scrollIntoView on every
    // streamed chunk; with a verbose reply this scrolls the response out of our
    // fixed top-aligned frame mid-generation. Neutralise it for the recording so
    // the response stays put (the only scrollIntoView caller is the chat; the
    // pipeline editor pans via ReactFlow's own transform, not scrollIntoView).
    window.Element.prototype.scrollIntoView = function () {};
  });

  const page = await context.newPage();
  await waitForApp(page, appUrl);

  // Make #root zoomable with a smooth tween, anchored at the top-left.
  await page.evaluate((ms) => {
    const root = document.getElementById("root");
    if (root) {
      root.style.transformOrigin = "0 0";
      root.style.transition = `transform ${ms}ms cubic-bezier(0.4, 0, 0.2, 1)`;
      root.style.willChange = "transform";
    }
  }, TRANSITION_MS);

  await setupApiKey(page);

  // Ensure the panel is on the Chat tab so the prompt box is visible. The
  // current source defaults to Chat, but the deployed build may default to the
  // Editor tab (which keeps the chat textarea visibility:hidden). Done at full
  // view, before any zoom, so the tab is on-screen and clickable.
  await page.locator(SEL.chatTab).first().click().catch(() => {});
  await page.waitForTimeout(500);

  for (const scene of scenes) {
    console.log(`Scene: ${scene.id}`);
    const runAction = async () => {
      if (!scene.action) return;
      const fn = actions[scene.action];
      if (!fn) throw new Error(`Unknown action: ${scene.action}`);
      await fn(page);
    };
    // `actionFirst` scenes pull back to full first (so the verb's click targets
    // are on-screen regardless of the prior zoom), run the verb — which may
    // reveal the zoom target, e.g. the Editor tab unhiding `.react-flow` — then
    // frame it.
    const ms = scene.transitionMs ?? TRANSITION_MS;
    if (scene.actionFirst) {
      await zoomTo(page, "full", ms);
      await runAction();
      await zoomTo(page, scene.zoom, ms);
    } else {
      await zoomTo(page, scene.zoom, ms);
      await runAction();
    }
    if (scene.hold) await page.waitForTimeout(scene.hold);
  }

  // Finalize the recording.
  await page.close();
  await context.close();
  context = null;

  const file = readdirSync(tmpDir).find((f) => f.endsWith(".webm"));
  if (!file) throw new Error(`No webm produced in ${tmpDir}`);
  renameSync(join(tmpDir, file), OUT_PATH);
  rmSync(tmpDir, { recursive: true });

  console.log(`\nDone. Demo video saved: ${OUT_PATH}`);
} catch (err) {
  console.error("Demo video failed:", err.message);
  process.exitCode = 1;
} finally {
  if (context) await context.close();
  if (browser) await browser.close();
  if (server) server.kill();
}
