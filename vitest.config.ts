import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
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
