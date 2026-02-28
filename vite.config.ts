import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import wasm from "vite-plugin-wasm";
import path from "path";

export default defineConfig({
  plugins: [react(), wasm()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    port: 5173,
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
