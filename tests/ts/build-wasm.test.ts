import { mkdtempSync, rmSync, writeFileSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { afterEach, describe, expect, it } from "vitest";

// The build:wasm wrapper is a build-tooling script (scripts/build-wasm.mjs), so
// it lives outside the instrumented coverage scope (src/ trees only). These
// tests exercise its two pure decision helpers, which encode the sandbox
// wasm-opt fallback logic.
import { wasmPackArgs, shouldRetryWithoutOpt } from "../../scripts/build-wasm.mjs";

describe("wasmPackArgs", () => {
  it("builds an optimized release argv by default", () => {
    expect(wasmPackArgs()).toEqual(["build", "--target", "web", "--release"]);
  });

  it("does not add --no-opt when noOpt is false", () => {
    expect(wasmPackArgs({ noOpt: false })).not.toContain("--no-opt");
  });

  it("appends --no-opt when noOpt is true", () => {
    const args = wasmPackArgs({ noOpt: true });
    expect(args).toEqual(["build", "--target", "web", "--release", "--no-opt"]);
    expect(args).toContain("--no-opt");
  });
});

describe("shouldRetryWithoutOpt", () => {
  const dirs: string[] = [];

  afterEach(() => {
    while (dirs.length) rmSync(dirs.pop()!, { recursive: true, force: true });
  });

  function tempPkg(): string {
    const dir = mkdtempSync(join(tmpdir(), "megane-pkg-"));
    dirs.push(dir);
    return dir;
  }

  it("returns false when the pkg dir does not exist", () => {
    expect(shouldRetryWithoutOpt(join(tmpdir(), "megane-nonexistent-pkg-xyz"))).toBe(false);
  });

  it("returns false when the wasm artifact was not produced (real compile error)", () => {
    const pkg = tempPkg();
    // A failed Rust compile leaves no *_bg.wasm — only unrelated leftovers, if any.
    writeFileSync(join(pkg, "README.md"), "leftover");
    expect(shouldRetryWithoutOpt(pkg)).toBe(false);
  });

  it("returns true when the wasm artifact exists (wasm-opt/pack step failed)", () => {
    const pkg = tempPkg();
    // Rust compiled fine; wasm-pack aborted at the wasm-opt/pack step, so the
    // artifact is present but package.json is missing.
    writeFileSync(join(pkg, "megane_wasm_bg.wasm"), "\0asm");
    expect(shouldRetryWithoutOpt(pkg)).toBe(true);
  });
});
