/**
 * E2E rendering test for the megane VS Code extension.
 *
 * Downloads the VSIX from the VS Code Marketplace, installs it into
 * code-server, opens a PDB file, and verifies that:
 *   1. The megane custom editor activates (canvas element created)
 *   2. No critical JS errors occur
 *   3. The canvas contains non-white pixels (atoms rendered)
 *
 * Usage:
 *   node tests/e2e/test_vscode_render.mjs <version>
 *   node tests/e2e/test_vscode_render.mjs 0.4.0
 *
 * Requires:
 *   - code-server (installed via `npm install -g code-server` if missing)
 *   - playwright (global install at /opt/node22/lib/node_modules/)
 *   - Internet access to download VSIX from VS Code Marketplace
 */

import { createRequire } from "module";
import { spawn, execSync, execFileSync } from "child_process";
import { mkdirSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import { createWriteStream } from "fs";
import { get as httpsGet } from "https";

// Playwright is installed globally; resolve it explicitly.
const _require = createRequire("/opt/node22/lib/node_modules/");
const { chromium } = _require("playwright");

const VERSION = process.argv[2];
if (!VERSION) {
  console.error("Usage: node test_vscode_render.mjs <version>");
  console.error("Example: node test_vscode_render.mjs 0.4.0");
  process.exit(1);
}
if (!/^\d+\.\d+\.\d+$/.test(VERSION)) {
  console.error(`Invalid version format: ${VERSION}. Expected semver (e.g. 0.4.0)`);
  process.exit(1);
}

const PUBLISHER = "hodakamori";
const EXTENSION_NAME = "vscode-megane";
const MARKETPLACE_URL = `https://marketplace.visualstudio.com/_apis/public/gallery/publishers/${PUBLISHER}/vsextensions/${EXTENSION_NAME}/${VERSION}/vspackage`;
const VSIX_PATH = `/tmp/vscode-megane-${VERSION}.vsix`;
const WORKSPACE_DIR = `/tmp/megane-ws-${VERSION}`;
const PORT = 38000 + Math.floor(Math.random() * 1000);
const CWD = process.cwd();

// Minimal 3-atom water molecule PDB for testing
const TEST_PDB = `ATOM      1  O   HOH A   1       0.000   0.000   0.117  1.00  0.00           O
ATOM      2  H1  HOH A   1       0.757   0.000  -0.469  1.00  0.00           H
ATOM      3  H2  HOH A   1      -0.757   0.000  -0.469  1.00  0.00           H
END
`;

// ---- Helpers ----

function assert(condition, message) {
  if (!condition) {
    console.error(`FAIL: ${message}`);
    process.exitCode = 1;
    throw new Error(message);
  }
  console.log(`PASS: ${message}`);
}

function ensureCodeServer() {
  try {
    execFileSync("which", ["code-server"], { stdio: "ignore" });
    console.log("code-server is available");
  } catch {
    console.log("code-server not found, installing via npm...");
    execSync("npm install -g code-server", { stdio: "inherit" });
    console.log("code-server installed");
  }
}

async function downloadVsixAsync(url, destPath) {
  if (existsSync(destPath)) {
    console.log(`VSIX already exists at ${destPath}, skipping download`);
    return;
  }

  console.log(`Downloading VSIX from Marketplace...`);

  return new Promise((resolve, reject) => {
    const file = createWriteStream(destPath);

    function doGet(requestUrl) {
      const lib = requestUrl.startsWith("https://") ? httpsGet : null;
      if (!lib) {
        reject(new Error("Only HTTPS URLs are supported"));
        return;
      }
      lib(requestUrl, { headers: { "User-Agent": "megane-release-verify/1.0" } }, (response) => {
        if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
          doGet(response.headers.location);
          return;
        }
        if (response.statusCode !== 200) {
          reject(new Error(`Failed to download VSIX: HTTP ${response.statusCode} from ${requestUrl}`));
          return;
        }
        response.pipe(file);
        file.on("finish", () => {
          file.close();
          console.log(`VSIX downloaded to ${destPath}`);
          resolve();
        });
        file.on("error", reject);
      }).on("error", reject);
    }

    doGet(url);
  });
}

function installExtension(vsixPath) {
  console.log(`Installing extension from ${vsixPath}...`);
  execFileSync("code-server", ["--install-extension", vsixPath], { stdio: "inherit" });
  console.log("Extension installed");
}

function setupWorkspace() {
  mkdirSync(WORKSPACE_DIR, { recursive: true });
  const pdbPath = join(WORKSPACE_DIR, "test.pdb");
  writeFileSync(pdbPath, TEST_PDB);
  console.log(`Workspace created at ${WORKSPACE_DIR}`);
  console.log(`Test PDB written to ${pdbPath}`);
  return pdbPath;
}

async function startCodeServer() {
  return new Promise((resolve, reject) => {
    const proc = spawn(
      "code-server",
      [
        "--auth", "none",
        "--port", String(PORT),
        "--disable-telemetry",
        WORKSPACE_DIR,
      ],
      {
        stdio: ["ignore", "pipe", "pipe"],
        env: { ...process.env, HOME: "/root" },
      }
    );

    const timer = setTimeout(
      () => reject(new Error("code-server did not start within 30s")),
      30000
    );

    const handler = (data) => {
      const line = data.toString();
      process.stdout.write(`[code-server] ${line}`);
      if (line.includes("HTTP server listening") || line.includes(`localhost:${PORT}`)) {
        clearTimeout(timer);
        resolve(proc);
      }
    };

    proc.stdout.on("data", handler);
    proc.stderr.on("data", handler);
    proc.on("error", (err) => {
      clearTimeout(timer);
      reject(err);
    });
  });
}

// ---- Main ----

let server = null;
let browser = null;

try {
  console.log(`\n=== megane VS Code Extension Rendering Test (v${VERSION}) ===\n`);

  // Step 1: Ensure code-server is available
  ensureCodeServer();

  // Step 2: Download VSIX from Marketplace
  await downloadVsixAsync(MARKETPLACE_URL, VSIX_PATH);

  // Step 3: Install extension into code-server
  installExtension(VSIX_PATH);

  // Step 4: Set up workspace with test PDB
  setupWorkspace();

  // Step 5: Start code-server
  server = await startCodeServer();
  console.log(`code-server running on port ${PORT}`);

  // Allow code-server to fully initialize
  await new Promise((r) => setTimeout(r, 3000));

  // Step 6: Launch Playwright
  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
  });
  const page = await context.newPage();

  const jsErrors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") jsErrors.push(msg.text());
  });
  page.on("pageerror", (err) => jsErrors.push(err.message));

  // Step 7: Open code-server and navigate to the workspace
  const workspaceUrl = `http://localhost:${PORT}/?folder=${encodeURIComponent(WORKSPACE_DIR)}`;
  console.log(`Navigating to: ${workspaceUrl}`);
  await page.goto(workspaceUrl, { waitUntil: "domcontentloaded", timeout: 30000 });

  // Wait for code-server UI to load (workbench)
  await page.waitForSelector(".monaco-workbench", { timeout: 30000 });
  console.log("code-server workbench loaded");

  // Wait a bit for extensions to activate
  await page.waitForTimeout(3000);

  // Step 8: Open test.pdb via the file explorer
  // Use the Explorer view to click on test.pdb
  console.log("Opening test.pdb...");

  // Try to open file via keyboard shortcut (Ctrl+P / Quick Open)
  await page.keyboard.press("Control+p");
  await page.waitForTimeout(500);
  await page.keyboard.type("test.pdb");
  await page.waitForTimeout(1000);
  await page.keyboard.press("Enter");
  console.log("File open command issued");

  // Wait for the megane custom editor canvas to appear
  // The canvas is inside a webview iframe
  console.log("Waiting for megane custom editor to activate...");

  // code-server renders webviews in iframes; wait for the webview iframe
  let canvasFound = false;
  let canvasResult = { hasContent: false, totalPixels: 0, nonWhitePixels: 0 };

  try {
    // Wait for a webview frame to appear (megane opens in a webview)
    await page.waitForSelector(".webview", { timeout: 20000 });
    console.log("Webview element detected");

    // Allow WASM to load and Three.js to render
    await page.waitForTimeout(5000);

    // Access the webview iframe content
    const frames = page.frames();
    console.log(`Total frames: ${frames.length}`);

    for (const frame of frames) {
      try {
        const canvas = await frame.$("canvas");
        if (canvas) {
          console.log(`Canvas found in frame: ${frame.url()}`);
          canvasFound = true;
          canvasResult = await frame.evaluate(() => {
            const canvas = document.querySelector("canvas");
            if (!canvas) return { hasContent: false, totalPixels: 0, nonWhitePixels: 0 };

            const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
            if (!gl) return { hasContent: false, totalPixels: 0, nonWhitePixels: 0 };

            const width = gl.drawingBufferWidth;
            const height = gl.drawingBufferHeight;
            const pixels = new Uint8Array(width * height * 4);
            gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

            let nonWhite = 0;
            const total = width * height;
            for (let i = 0; i < pixels.length; i += 4) {
              if (pixels[i] < 250 || pixels[i + 1] < 250 || pixels[i + 2] < 250) {
                nonWhite++;
              }
            }
            return { hasContent: nonWhite > total * 0.001, totalPixels: total, nonWhitePixels: nonWhite };
          });
          break;
        }
      } catch {
        // Frame may not be accessible (cross-origin); continue
      }
    }
  } catch (err) {
    console.log(`Warning: ${err.message}`);
  }

  // Take screenshot regardless of outcome
  const screenshotPath = join(CWD, "tests", "e2e", "screenshot_vscode_render.png");
  await page.screenshot({ path: screenshotPath });
  console.log(`Screenshot saved: ${screenshotPath}`);

  // ---- Assertions ----

  assert(canvasFound, "megane custom editor canvas is created in webview");

  console.log(
    `  Canvas: ${canvasResult.nonWhitePixels}/${canvasResult.totalPixels} non-white pixels`
  );
  assert(
    canvasResult.hasContent,
    `Canvas contains rendered atoms (${canvasResult.nonWhitePixels} non-white pixels)`
  );

  const criticalErrors = jsErrors.filter(
    (e) =>
      (e.includes("Cannot read propert") ||
        e.includes("acquireVsCodeApi") ||
        e.includes("megane")) &&
      !e.includes("Shader Error") &&
      !e.includes("WebGLProgram")
  );
  assert(
    criticalErrors.length === 0,
    `No critical JS errors (found ${criticalErrors.length}: ${JSON.stringify(criticalErrors)})`
  );

  console.log("\n=== VS Code Extension Rendering Test: PASSED ===");
} catch (err) {
  console.error("\nVS Code extension rendering test FAILED:", err.message);
  process.exitCode = 1;
} finally {
  if (browser) await browser.close();
  if (server) {
    server.kill();
    server.stdout?.destroy();
    server.stderr?.destroy();
    server.unref();
    setTimeout(() => {
      try { server.kill("SIGKILL"); } catch {}
    }, 3000).unref();
  }
}
