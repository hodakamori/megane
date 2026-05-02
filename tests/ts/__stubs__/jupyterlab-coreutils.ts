// Test-only stub for the `@jupyterlab/coreutils` package, which is a dep
// of the `jupyterlab-megane/` workspace and is NOT installed at the repo root.
// Vite's import-analysis pass needs every bare specifier to resolve, even when
// vi.mock() will replace the module at runtime. This stub provides just enough
// of the surface that `jupyterlab-megane/src/wasmLoader.ts` references.
// See `vitest.config.ts` resolve.alias for the wiring.

export const PageConfig = {
  getOption(_key: string): string {
    return "";
  },
};
