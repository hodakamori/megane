/**
 * build:wasm wrapper — builds the megane-wasm crate with wasm-pack, and
 * self-heals the sandbox case where the wasm-opt (binaryen) binary download is
 * blocked.
 *
 * Background:
 *   `wasm-pack build --target web --release` runs wasm-opt (-O3, configured in
 *   crates/megane-wasm/Cargo.toml). In sandboxed / proxied environments the
 *   wasm-opt binary download is blocked (HTTP 403), and wasm-pack aborts AFTER
 *   emitting the .wasm/.js but BEFORE writing pkg/package.json. The half-written
 *   pkg/ then breaks Vite (parseCore.ts → 500) because pkg/package.json is
 *   missing. wasm-pack 0.15+ exposes `--no-opt`, which skips wasm-opt entirely
 *   so no download is attempted and pkg/package.json IS written.
 *
 * Behavior:
 *   - Default: try the optimized -O3 build. If it fails but the wasm artifact was
 *     already produced (the wasm-opt/pack step failed, not a Rust compile error),
 *     retry once with --no-opt.
 *   - MEGANE_WASM_NO_OPT=1 (or passing --no-opt): skip the optimized attempt and
 *     go straight to --no-opt — useful in known sandboxes to avoid the doomed
 *     first attempt.
 *   - A genuine Rust compile error (no wasm artifact produced) is NOT retried;
 *     the original non-zero exit is propagated so real errors surface loudly.
 *
 * Optimized builds are fully preserved in CI / any networked environment — the
 * fallback only ever engages when the wasm-opt download is actually blocked.
 */

import { spawnSync } from "child_process";
import { existsSync, readdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CRATE_DIR = join(__dirname, "..", "crates", "megane-wasm");
const PKG_DIR = join(CRATE_DIR, "pkg");

/**
 * Build the wasm-pack argv. `--no-opt` skips wasm-opt (and its binary download).
 * @param {{ noOpt?: boolean }} opts
 * @returns {string[]}
 */
export function wasmPackArgs({ noOpt = false } = {}) {
  const args = ["build", "--target", "web", "--release"];
  if (noOpt) args.push("--no-opt");
  return args;
}

/**
 * Whether a failed wasm-pack run should be retried with --no-opt. True when the
 * compiled wasm artifact is present in pkg/ — i.e. Rust compiled fine and only
 * the wasm-opt/pack step failed (the blocked-download signature). False for a
 * genuine compile error, where no artifact was produced.
 * @param {string} pkgDir
 * @returns {boolean}
 */
export function shouldRetryWithoutOpt(pkgDir) {
  if (!existsSync(pkgDir)) return false;
  return readdirSync(pkgDir).some((f) => f.endsWith("_bg.wasm"));
}

function runWasmPack({ noOpt }) {
  const result = spawnSync("wasm-pack", wasmPackArgs({ noOpt }), {
    cwd: CRATE_DIR,
    stdio: "inherit",
  });
  if (result.error) {
    console.error(`[build-wasm] failed to spawn wasm-pack: ${result.error.message}`);
    if (result.error.code === "ENOENT") {
      console.error("[build-wasm] is wasm-pack installed? (`cargo install wasm-pack`)");
    }
    process.exit(1);
  }
  return result.status ?? 1;
}

function main() {
  const forceNoOpt =
    process.env.MEGANE_WASM_NO_OPT === "1" || process.argv.slice(2).includes("--no-opt");

  if (forceNoOpt) {
    console.log("[build-wasm] MEGANE_WASM_NO_OPT set — building with --no-opt (unoptimized).");
    process.exit(runWasmPack({ noOpt: true }));
  }

  const status = runWasmPack({ noOpt: false });
  if (status === 0) {
    process.exit(0);
  }

  if (shouldRetryWithoutOpt(PKG_DIR)) {
    console.warn(
      "[build-wasm] wasm-opt unavailable (sandbox) — retrying with --no-opt (UNOPTIMIZED wasm).",
    );
    process.exit(runWasmPack({ noOpt: true }));
  }

  console.error(
    "[build-wasm] wasm-pack failed before producing a wasm artifact — treating as a real build error (not retrying).",
  );
  process.exit(status);
}

// Only run when executed directly, so the pure helpers can be imported in tests.
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main();
}
