import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import wasm from "vite-plugin-wasm";
import path from "path";

export default defineConfig({
  plugins: [react(), wasm()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "../src"),
    },
    // Resolve dependencies from both vscode-megane/node_modules and parent node_modules
    modules: [
      path.resolve(__dirname, "node_modules"),
      path.resolve(__dirname, "../node_modules"),
    ],
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
