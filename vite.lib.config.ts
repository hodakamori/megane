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
