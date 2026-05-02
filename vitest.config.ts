import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      // The `@jupyterlab/*` packages live in jupyterlab-megane/package.json,
      // not the root, so vitest's import-analysis can't resolve bare specifiers
      // referenced by `jupyterlab-megane/src/`. Tests mock these via vi.mock();
      // the stubs only need to satisfy resolution, not provide behavior.
      "@jupyterlab/coreutils": path.resolve(
        __dirname,
        "tests/ts/__stubs__/jupyterlab-coreutils.ts",
      ),
      "@jupyterlab/docregistry": path.resolve(
        __dirname,
        "tests/ts/__stubs__/jupyterlab-docregistry.ts",
      ),
      "@jupyterlab/services": path.resolve(
        __dirname,
        "tests/ts/__stubs__/jupyterlab-services.ts",
      ),
      // `vscode` is injected by the VS Code extension host at runtime and is
      // not present in any node_modules. Tests mock it via vi.mock(); the stub
      // only needs to satisfy resolution.
      vscode: path.resolve(__dirname, "tests/ts/__stubs__/vscode.ts"),
    },
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
