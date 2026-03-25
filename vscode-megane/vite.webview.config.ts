import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import wasm from "vite-plugin-wasm";
import path from "path";

export default defineConfig({
  plugins: [react(), wasm()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "../src"),
      // Resolve deps from vscode-megane/node_modules for src/ files that don't have access to it
      "zustand": path.resolve(__dirname, "node_modules/zustand"),
      "@xyflow/react": path.resolve(__dirname, "node_modules/@xyflow/react"),
      "@dagrejs/dagre": path.resolve(__dirname, "node_modules/@dagrejs/dagre"),
      "gif.js": path.resolve(__dirname, "node_modules/gif.js"),
      "three": path.resolve(__dirname, "node_modules/three"),
    },
  },
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
  build: {
    outDir: "media",
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, "webview/main.tsx"),
      output: {
        entryFileNames: "webview.js",
        // Keep WASM as a separate file (loaded by the webview)
        assetFileNames: "[name][extname]",
        inlineDynamicImports: true,
      },
    },
    minify: true,
    sourcemap: false,
  },
});
