import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  resolve: {
    alias: [
      { find: "@", replacement: path.resolve(__dirname, "src") },
      // The `@jupyterlab/*` packages live in jupyterlab-megane/package.json,
      // not the root, so vitest's import-analysis can't resolve bare specifiers
      // referenced by `jupyterlab-megane/src/`. Tests mock these via vi.mock();
      // the stubs only need to satisfy resolution, not provide behavior.
      {
        find: "@jupyterlab/application",
        replacement: path.resolve(
          __dirname,
          "tests/ts/__stubs__/jupyterlab-application.ts",
        ),
      },
      {
        find: "@jupyterlab/apputils",
        replacement: path.resolve(
          __dirname,
          "tests/ts/__stubs__/jupyterlab-apputils.ts",
        ),
      },
      {
        find: "@jupyterlab/coreutils",
        replacement: path.resolve(
          __dirname,
          "tests/ts/__stubs__/jupyterlab-coreutils.ts",
        ),
      },
      {
        find: "@jupyterlab/docregistry",
        replacement: path.resolve(
          __dirname,
          "tests/ts/__stubs__/jupyterlab-docregistry.ts",
        ),
      },
      {
        find: "@jupyterlab/services",
        replacement: path.resolve(
          __dirname,
          "tests/ts/__stubs__/jupyterlab-services.ts",
        ),
      },
      {
        find: "@jupyterlab/statusbar",
        replacement: path.resolve(
          __dirname,
          "tests/ts/__stubs__/jupyterlab-statusbar.ts",
        ),
      },
      // `@lumino/widgets` is a peer dep of jupyterlab-megane but is not in the
      // root node_modules. The stub satisfies import resolution at test time.
      {
        find: "@lumino/widgets",
        replacement: path.resolve(
          __dirname,
          "tests/ts/__stubs__/lumino-widgets.ts",
        ),
      },
      // `vscode` is injected by the VS Code extension host at runtime and is
      // not present in any node_modules. Tests mock it via vi.mock(); the stub
      // only needs to satisfy resolution.
      {
        find: "vscode",
        replacement: path.resolve(__dirname, "tests/ts/__stubs__/vscode.ts"),
      },
      // `crates/megane-wasm/pkg` does not exist until `npm run build:wasm` is
      // run.  Two aliases handle different import shapes:
      //
      //  1. The .wasm binary asset (wasmLoader.ts tries to import it as a
      //     webpack asset/resource URL).  The stub throws so that wasmLoader's
      //     catch branch — tested by wasmLoader.test.ts — still fires.
      //
      //  2. The JS glue package index (parsers/structure.ts and friends import
      //     the wasm-bindgen JS output). The stub exports no-op stubs for every
      //     WASM function so that test collection succeeds without a real build.
      //     Tests that actually invoke WASM functions mock @/parsers/structure.
      //
      // Both regexes match the full import specifier (anchored) so no stale
      // prefix is left after String.prototype.replace(find, replacement).
      {
        find: /^.*\/crates\/megane-wasm\/pkg\/.*\.wasm$/,
        replacement: path.resolve(
          __dirname,
          "tests/ts/__stubs__/megane-wasm-bg-wasm.ts",
        ),
      },
      {
        find: /^.*\/crates\/megane-wasm\/pkg(?:\/index)?$/,
        replacement: path.resolve(
          __dirname,
          "tests/ts/__stubs__/megane-wasm-pkg.ts",
        ),
      },
    ],
  },
  test: {
    environment: "jsdom",
    include: ["tests/ts/**/*.test.{ts,tsx}"],
    setupFiles: ["tests/ts/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "text-summary", "json", "html", "lcov"],
      reportsDirectory: "coverage/ts",
      include: [
        "src/**/*.{ts,tsx}",
        "vscode-megane/src/**/*.ts",
        "jupyterlab-megane/src/**/*.{ts,tsx}",
      ],
      exclude: [
        "src/vite-env.d.ts",
        "src/**/*.d.ts",
        "vscode-megane/src/**/*.d.ts",
        "jupyterlab-megane/src/**/*.d.ts",
      ],
    },
  },
});
