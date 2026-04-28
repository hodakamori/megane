import { PageConfig } from "@jupyterlab/coreutils";

let promise: Promise<void> | null = null;

/**
 * Resolve the URL of the megane WASM binary and expose it on the global
 * object so that the shared parser at `src/parsers/structure.ts` can pick it
 * up via `globalThis.__MEGANE_WASM_URL__`.
 *
 * Strategy: import the .wasm file via webpack's `asset/resource` rule (set
 * up in webpack.config.js). If that fails for any reason, fall back to the
 * JupyterLab labextension static URL.
 */
export function ensureWasmUrl(): Promise<void> {
  if (promise) return promise;
  promise = (async () => {
    try {
      // The .wasm file is emitted as an asset URL by webpack's `asset/resource`
      // rule (see webpack.config.js). At runtime, `mod.default` is a string URL
      // pointing into the labextension's static/ directory; the `unknown` cast
      // is needed because the wasm-bindgen .d.ts at build time is the JS glue
      // module's type, not the asset URL type.
      const mod = (await import(
        "../../crates/megane-wasm/pkg/megane_wasm_bg.wasm"
      )) as unknown as { default: string };
      (globalThis as Record<string, unknown>).__MEGANE_WASM_URL__ = mod.default;
    } catch (err) {
      const base = PageConfig.getOption("fullLabextensionsUrl");
      if (base) {
        (globalThis as Record<string, unknown>).__MEGANE_WASM_URL__ =
          `${base}/megane-jupyterlab/static/megane_wasm_bg.wasm`;
      } else {
        throw err;
      }
    }
  })();
  return promise;
}
