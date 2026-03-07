/**
 * Vite config for building the full MeganeViewer app for docs embedding.
 * Outputs to docs/public/app/ with the correct base path.
 */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import wasm from "vite-plugin-wasm";
import path from "path";

export default defineConfig({
  plugins: [react(), wasm()],
  assetsInclude: ["**/*.xtc"],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  base: "/megane/app/",
  build: {
    outDir: "docs/public/app",
    emptyOutDir: true,
  },
});
