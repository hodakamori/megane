import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import wasm from "vite-plugin-wasm";
import path from "path";

export default defineConfig({
  plugins: [react(), wasm()],
  resolve: {
    alias: [
      // npm library bundle: use the synchronous main-thread parse path so the
      // published bundle stays self-contained without an embedded Web Worker.
      {
        find: /\.\/parseClient$/,
        replacement: path.resolve(__dirname, "src/parsers/parseClientSync.ts"),
      },
      { find: "@", replacement: path.resolve(__dirname, "src") },
    ],
  },
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
  build: {
    outDir: "dist",
    emptyOutDir: false,
    lib: {
      entry: path.resolve(__dirname, "src/lib.ts"),
      formats: ["es"],
      fileName: () => "lib.js",
    },
    rollupOptions: {
      external: ["react", "react-dom", "three"],
    },
    minify: true,
    sourcemap: false,
  },
});
