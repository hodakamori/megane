/**
 * Bundle render smoke test.
 *
 * Why this exists: the v0.9.0 VSCode extension shipped a *blank* webview. The
 * cause was a toolchain bug — bumping Vite to 8.x (rolldown) produced a webview
 * bundle that crashed at runtime. Nothing caught it because:
 *   - CI runs no E2E (E2E is local-only by policy), so the built bundle was
 *     never loaded in a browser, and
 *   - local E2E builds with the developer's node_modules, which still had the
 *     older (working) Vite — the artifact that *shipped* (CI `npm ci`, Vite 8)
 *     was never the artifact that got *tested*.
 *
 * This script closes that gap with a fast, baseline-free check: build with the
 * real (locked) toolchain, then load each Vite-built bundle headless and assert
 * the React viewer actually mounts and the WebGL canvas draws pixels. It is
 * deliberately NOT a pixel-diff test, so it is safe to run on CI runners where
 * font/GPU drift makes screenshot baselines flaky.
 *
 * Usage:
 *   node scripts/smoke-render.mjs            # both targets
 *   node scripts/smoke-render.mjs webapp     # webapp bundle only
 *   node scripts/smoke-render.mjs vscode     # vscode webview bundle only
 *
 * Prereqs: build the targets first
 *   webapp  -> npm run build:app   (outputs python/megane/static/app)
 *   vscode  -> npm --prefix vscode-megane run build:webview
 */

import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { getChromium, randomPort } from "../tests/e2e/utils/playwright.mjs";

const REPO = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const MIME = {
  ".js": "text/javascript",
  ".mjs": "text/javascript",
  ".css": "text/css",
  ".wasm": "application/wasm",
  ".html": "text/html",
  ".json": "application/json",
  ".svg": "image/svg+xml",
};

function serveDir(root, extraRoutes = {}) {
  const server = http.createServer((req, res) => {
    let url = decodeURIComponent(req.url.split("?")[0]);
    if (extraRoutes[url]) {
      const { type, body } = extraRoutes[url];
      res.setHeader("Content-Type", type);
      res.end(body);
      return;
    }
    if (url === "/") url = "/index.html";
    const fp = path.join(root, url);
    if (!fp.startsWith(root) || !fs.existsSync(fp) || !fs.statSync(fp).isFile()) {
      res.statusCode = 404;
      res.end("not found");
      return;
    }
    res.setHeader("Content-Type", MIME[path.extname(fp)] || "application/octet-stream");
    res.end(fs.readFileSync(fp));
  });
  return server;
}

async function listen(server) {
  const port = randomPort(17000, 2000);
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, resolve);
  });
  return port;
}

/** Drive a page until the WebGL canvas has drawn non-background pixels. */
async function assertCanvasDrew(page, label) {
  await page.waitForSelector("[data-testid='megane-viewer']", { timeout: 20000 });
  await page.waitForSelector("canvas", { timeout: 20000 });
  // Poll the drawing buffer for any non-white pixel — proves the renderer ran.
  const drew = await page.waitForFunction(
    () => {
      const c = document.querySelector("canvas");
      if (!c) return false;
      const gl = c.getContext("webgl2") || c.getContext("webgl");
      if (!gl) return false;
      const w = c.width;
      const h = c.height;
      if (!w || !h) return false;
      const px = new Uint8Array(w * h * 4);
      gl.readPixels(0, 0, w, h, gl.RGBA, gl.UNSIGNED_BYTE, px);
      for (let i = 0; i < px.length; i += 4) {
        if (px[i] < 250 || px[i + 1] < 250 || px[i + 2] < 250) return true;
      }
      return false;
    },
    { timeout: 20000, polling: 500 },
  ).then(() => true).catch(() => false);
  if (!drew) throw new Error(`${label}: canvas mounted but never drew any pixels`);
}

async function smokeWebapp() {
  const dir = path.join(REPO, "python", "megane", "static", "app");
  if (!fs.existsSync(path.join(dir, "index.html"))) {
    throw new Error(`webapp bundle not found at ${dir} — run 'npm run build:app' first`);
  }
  const server = serveDir(dir);
  const port = await listen(server);
  const chromium = getChromium();
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(`http://localhost:${port}/`, { waitUntil: "load" });
    await assertCanvasDrew(page, "webapp");
    if (errors.length) throw new Error(`webapp: uncaught page error(s):\n${errors.join("\n")}`);
    console.log("✓ webapp bundle mounts and renders");
  } finally {
    await browser.close();
    server.close();
  }
}

async function smokeVscode() {
  const media = path.join(REPO, "vscode-megane", "media");
  if (!fs.existsSync(path.join(media, "webview.js"))) {
    throw new Error(
      `vscode webview bundle not found at ${media} — run ` +
        `'npm --prefix vscode-megane run build:webview' first`,
    );
  }
  const nonce = "smoketestnonce0001";
  // Mirror the extension's getHtmlForWebview, but with a stub acquireVsCodeApi
  // and relative resource paths served by this harness.
  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"/>
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'nonce-${nonce}' 'wasm-unsafe-eval' blob:; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self' blob: data:; worker-src blob:;"/>
<link rel="stylesheet" href="main.css"/>
<style>*{margin:0;padding:0;box-sizing:border-box;}html,body,#root{width:100%;height:100%;overflow:hidden;background:#fff;}</style></head>
<body><div id="root"></div>
<script nonce="${nonce}">
  window.__MEGANE_WASM_URL__="megane_wasm_bg.wasm"; window.__MEGANE_CONTEXT__="vscode";
  let __s={}; window.acquireVsCodeApi=function(){return{postMessage:()=>{},getState:()=>__s,setState:(s)=>{__s=s;}};};
</script>
<script nonce="${nonce}" type="module" src="webview.js"></script></body></html>`;

  const server = serveDir(media, { "/": { type: "text/html", body: html } });
  const port = await listen(server);
  const chromium = getChromium();
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(`http://localhost:${port}/`, { waitUntil: "load" });
    // The React app must at least mount (renders "Loading structure...").
    await page.waitForFunction(
      () => document.getElementById("root")?.children.length > 0,
      { timeout: 20000 },
    );
    // Now post a real file like the extension host does on "ready". The WASM
    // module is loaded from window.__MEGANE_WASM_URL__ (set in the HTML above),
    // so the message no longer carries wasm bytes. contentBytes is passed as a
    // plain array here because page.evaluate arguments must be JSON-serializable
    // (an ArrayBuffer would not survive the transport); the webview's
    // `new Uint8Array(contentBytes)` accepts either form.
    const pdb = Array.from(fs.readFileSync(path.join(REPO, "tests", "fixtures", "1crn.pdb")));
    await page.evaluate(
      ({ pdb }) => {
        window.dispatchEvent(
          new MessageEvent("message", {
            data: {
              type: "loadFile",
              contentBytes: pdb,
              filename: "1crn.pdb",
              topBytes: null,
              topFilename: null,
            },
          }),
        );
      },
      { pdb },
    );
    await assertCanvasDrew(page, "vscode-webview");
    if (errors.length) {
      throw new Error(`vscode-webview: uncaught page error(s):\n${errors.join("\n")}`);
    }
    console.log("✓ vscode webview bundle mounts and renders");
  } finally {
    await browser.close();
    server.close();
  }
}

const target = process.argv[2] ?? "all";
const jobs = [];
if (target === "all" || target === "webapp") jobs.push(smokeWebapp);
if (target === "all" || target === "vscode") jobs.push(smokeVscode);
if (jobs.length === 0) {
  console.error(`unknown target '${target}' (expected: all | webapp | vscode)`);
  process.exit(2);
}

let failed = false;
for (const job of jobs) {
  try {
    await job();
  } catch (err) {
    failed = true;
    console.error(`✗ ${err.message}`);
  }
}
process.exit(failed ? 1 : 0);
