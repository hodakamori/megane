/**
 * Capture documentation screenshots for README and docs.
 *
 * Usage:
 *   node scripts/capture-screenshots.mjs
 *
 * Starts a Vite dev server, opens the app in Playwright Chromium,
 * and captures a high-quality screenshot.
 */

import { spawn } from "child_process";
import { mkdirSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUTPUT_DIR = join(ROOT, "docs", "public", "screenshots");

// Resolve Playwright from global installation
const _require = createRequire("/opt/node22/lib/node_modules/");
const { chromium } = _require("playwright");

const PORT = 15273 + Math.floor(Math.random() * 100);

function startViteServer() {
  return new Promise((resolve, reject) => {
    const proc = spawn("npx", ["vite", "--port", String(PORT), "--host", "127.0.0.1"], {
      cwd: ROOT,
      stdio: ["ignore", "pipe", "pipe"],
      env: { ...process.env, NODE_ENV: "development" },
    });

    const timeout = setTimeout(() => {
      reject(new Error("Vite dev server did not start in time"));
    }, 30000);

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

let server = null;
let browser = null;

try {
  mkdirSync(OUTPUT_DIR, { recursive: true });

  console.log("Starting Vite dev server...");
  server = await startViteServer();
  console.log(`Vite dev server running on port ${PORT}`);

  browser = await chromium.launch({ headless: true });

  // Hero screenshot: desktop with sidebar expanded (1280x720)
  {
    const context = await browser.newContext({
      viewport: { width: 1280, height: 720 },
      deviceScaleFactor: 2,
    });
    const page = await context.newPage();

    await page.goto(`http://127.0.0.1:${PORT}`, { waitUntil: "networkidle", timeout: 30000 });
    await page.waitForSelector("canvas", { timeout: 15000 });
    console.log("Canvas found (1280x720, DPR=2)");

    // Wait for rendering to settle
    await page.waitForTimeout(3000);

    const screenshot = await page.screenshot({ type: "png" });
    const outputPath = join(OUTPUT_DIR, "hero.png");
    writeFileSync(outputPath, screenshot);
    console.log(`Saved: ${outputPath}`);

    await context.close();
  }

  console.log("\nAll screenshots captured successfully.");
} catch (err) {
  console.error("Screenshot capture failed:", err.message);
  process.exitCode = 1;
} finally {
  if (browser) await browser.close();
  if (server) server.kill();
}
