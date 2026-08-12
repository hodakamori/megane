/**
 * Guards the npm package surface of megane-viewer.
 *
 * Consumers import the JS entries ("megane-viewer", "megane-viewer/lib"),
 * the stylesheet ("megane-viewer/styles.css") and TypeScript declarations.
 * A missing `exports` entry fails at install time in user projects with
 * ERR_PACKAGE_PATH_NOT_EXPORTED, and a missing `types` condition surfaces
 * as TS7016 — neither is caught by any other test, so pin the map here.
 */
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";

const root = path.resolve(__dirname, "../..");

const pkg = JSON.parse(readFileSync(path.join(root, "package.json"), "utf-8")) as {
  types?: string;
  files?: string[];
  scripts: Record<string, string>;
  exports: Record<string, string | Record<string, string>>;
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
};

const typesConfig = JSON.parse(
  readFileSync(path.join(root, "tsconfig.build-types.json"), "utf-8"),
) as {
  compilerOptions: Record<string, unknown>;
  include: string[];
};

describe("package.json exports map", () => {
  it("exposes the JS entry points with types + import conditions", () => {
    for (const subpath of [".", "./lib", "./dist/widget.js", "./dist/lib.js"]) {
      const entry = pkg.exports[subpath];
      expect(entry, `exports["${subpath}"]`).toBeTypeOf("object");
      const conditions = entry as Record<string, string>;
      expect(conditions.types, `types condition for "${subpath}"`).toMatch(
        /^\.\/dist\/types\/.+\.d\.ts$/,
      );
      expect(conditions.import, `import condition for "${subpath}"`).toMatch(/^\.\/dist\/.+\.js$/);
      // Node picks the first matching condition, so "types" must come first.
      expect(Object.keys(conditions)[0]).toBe("types");
    }
  });

  it("keeps deep imports and friendly aliases pointing at the same files", () => {
    expect(pkg.exports["./dist/widget.js"]).toEqual(pkg.exports["."]);
    expect(pkg.exports["./dist/lib.js"]).toEqual(pkg.exports["./lib"]);
  });

  it("exposes the stylesheet under both the alias and the real dist path", () => {
    expect(pkg.exports["./styles.css"]).toBe("./dist/megane-viewer.css");
    expect(pkg.exports["./dist/megane-viewer.css"]).toBe("./dist/megane-viewer.css");
  });

  it("exposes package.json for tooling", () => {
    expect(pkg.exports["./package.json"]).toBe("./package.json");
  });

  it("only references files shipped in the npm tarball", () => {
    const files = pkg.files ?? [];
    expect(files).toContain("dist/");
    const targets = Object.values(pkg.exports).flatMap((entry) =>
      typeof entry === "string" ? [entry] : Object.values(entry),
    );
    for (const target of targets) {
      expect(
        target === "./package.json" || target.startsWith("./dist/"),
        `"${target}" must live under dist/ (or be package.json)`,
      ).toBe(true);
    }
  });

  it("keeps the top-level types field in sync with the root export", () => {
    const rootEntry = pkg.exports["."] as Record<string, string>;
    expect(pkg.types).toBe(rootEntry.types);
  });

  it("ships @types/three as a runtime dependency", () => {
    // The public d.ts reference three's types (Snapshot, MoleculeRenderer,
    // …), so consumers with skipLibCheck:false hit TS7016 unless @types/three
    // is installed alongside the package — it must not be dev-only.
    expect(pkg.dependencies["@types/three"]).toBeDefined();
    expect(pkg.devDependencies["@types/three"]).toBeUndefined();
  });
});

describe("type declaration build", () => {
  it("is wired into the lib and full builds", () => {
    expect(pkg.scripts["build:types"]).toContain("tsc -p tsconfig.build-types.json");
    // Emitted d.ts keep side-effect CSS imports (unresolvable inside
    // dist/types/) and extensionless relative specifiers (TS2834 under
    // node16/nodenext) — the post-processing must run after tsc.
    expect(pkg.scripts["build:types"]).toContain("node scripts/postprocess-dts.mjs");
    expect(pkg.scripts["build:lib"]).toContain("npm run build:types");
    expect(pkg.scripts["build"]).toContain("npm run build:types");
    // `build` wipes dist/ midway; declarations must be emitted afterwards.
    const build = pkg.scripts["build"];
    expect(build.indexOf("npm run build:types")).toBeGreaterThan(build.indexOf("rm -rf dist"));
  });

  it("emits declarations only, into dist/types, for both entry points", () => {
    const opts = typesConfig.compilerOptions;
    expect(opts.emitDeclarationOnly).toBe(true);
    expect(opts.declaration).toBe(true);
    expect(opts.outDir).toBe("dist/types");
    expect(opts.rootDir).toBe("src");
    expect(typesConfig.include).toContain("src/lib.ts");
    expect(typesConfig.include).toContain("src/widget.ts");
  });
});
