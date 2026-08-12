/**
 * Post-processes the emitted type declarations (dist/types/) after
 * `tsc -p tsconfig.build-types.json`, fixing two things tsc cannot:
 *
 * 1. TypeScript preserves side-effect imports (`import "./tour.css";`) in
 *    .d.ts output, but stylesheets are never shipped inside dist/types/, so
 *    those specifiers cannot resolve in consumer projects and break
 *    type-checking for consumers that don't set skipLibCheck. Declarations
 *    never need styles, so every side-effect .css import is stripped.
 *
 * 2. The sources use extensionless relative imports (bundler resolution),
 *    which tsc copies verbatim into the .d.ts. Consumers on
 *    `moduleResolution: node16/nodenext` then fail with TS2834 ("Relative
 *    import paths need explicit file extensions"). Since megane-viewer is
 *    `"type": "module"`, every relative specifier in the declarations gets an
 *    explicit `.js` extension (which TypeScript maps back to the sibling
 *    `.d.ts`), including inline `import("./x")` type references.
 */

import { existsSync, readdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const TYPES_DIR = join(__dirname, "..", "dist", "types");

/**
 * Remove side-effect stylesheet imports (`import "x.css";`) from declaration
 * source text. Imports with bindings (`import styles from "x.css"`) are left
 * untouched — they carry a type and would need a different fix.
 * @param {string} source
 * @returns {string}
 */
export function stripStyleImports(source) {
  return source.replace(/^import\s+["'][^"']+\.css["'];\r?\n?/gm, "");
}

/**
 * Append explicit `.js` extensions to extensionless relative specifiers in
 * declaration source text so node16/nodenext consumers can resolve them.
 * Handles `import ... from "./x"`, `export ... from "./x"` and inline
 * `import("./x")` type references.
 * @param {string} source
 * @param {(specifier: string) => "file" | "directory" | null} classify
 *   Callback reporting whether the specifier resolves (relative to the file
 *   being processed) to a declaration file (`spec.d.ts`) or a directory with
 *   an index declaration (`spec/index.d.ts`). Unresolvable specifiers are
 *   left untouched.
 * @returns {string}
 */
export function addExplicitExtensions(source, classify) {
  const rewrite = (specifier) => {
    if (!specifier.startsWith("./") && !specifier.startsWith("../")) {
      return specifier;
    }
    if (/\.(js|mjs|cjs|json|css)$/.test(specifier)) {
      return specifier;
    }
    const kind = classify(specifier);
    if (kind === "file") return `${specifier}.js`;
    if (kind === "directory") return `${specifier}/index.js`;
    return specifier;
  };
  return source
    .replace(
      /(from\s*)(["'])([^"']+)\2/g,
      (_m, prefix, quote, spec) => `${prefix}${quote}${rewrite(spec)}${quote}`,
    )
    .replace(
      /(import\s*\(\s*)(["'])([^"']+)\2(\s*\))/g,
      (_m, prefix, quote, spec, suffix) => `${prefix}${quote}${rewrite(spec)}${quote}${suffix}`,
    );
}

/**
 * Recursively collect .d.ts files under a directory.
 * @param {string} dir
 * @returns {string[]}
 */
export function collectDtsFiles(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...collectDtsFiles(full));
    } else if (entry.name.endsWith(".d.ts")) {
      out.push(full);
    }
  }
  return out;
}

function main() {
  let changed = 0;
  for (const file of collectDtsFiles(TYPES_DIR)) {
    const source = readFileSync(file, "utf-8");
    const fileDir = dirname(file);
    const cleaned = addExplicitExtensions(stripStyleImports(source), (specifier) => {
      if (existsSync(join(fileDir, `${specifier}.d.ts`))) return "file";
      if (existsSync(join(fileDir, specifier, "index.d.ts"))) return "directory";
      return null;
    });
    if (cleaned !== source) {
      writeFileSync(file, cleaned);
      changed += 1;
    }
  }
  console.log(`[postprocess-dts] rewrote ${changed} file(s)`);
}

// Only run when executed directly, so the pure helpers can be imported in tests.
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main();
}
