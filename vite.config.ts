import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import wasm from "vite-plugin-wasm";
import path from "path";

export default defineConfig({
  plugins: [react(), wasm()],
  // The parse worker (src/parsers/parse.worker.ts) imports the WASM module, so
  // its sub-build needs vite-plugin-wasm too.
  worker: {
    format: "es",
    plugins: () => [wasm()],
  },
  assetsInclude: ["**/*.xtc"],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    port: 5173,
    allowedHosts: true,
    proxy: {
      "/ws": {
        target: "ws://localhost:8765",
        ws: true,
      },
      "/api": {
        target: "http://localhost:8765",
      },
    },
  },
  build: {
    outDir: "python/megane/static/app",
  },
});
