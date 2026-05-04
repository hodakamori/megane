/**
 * Stub for crates/megane-wasm/pkg/megane_wasm_bg.wasm — used by vitest so
 * wasmLoader.ts can be imported without the WASM binary being built.
 *
 * wasmLoader.ts tries to import this asset URL (via webpack asset/resource)
 * and falls back to the JupyterLab PageConfig URL when the import fails.
 * Throwing here lets vitest exercise that catch branch without a real binary.
 */
throw new Error("WASM binary not available in test environment — mock or stub wasmLoader instead.");
