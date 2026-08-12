import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { afterEach, describe, expect, it } from "vitest";

// The declaration post-processor is a build-tooling script
// (scripts/postprocess-dts.mjs), so it lives outside the instrumented
// coverage scope (src/ trees only). These tests exercise its pure helpers.
import {
  stripStyleImports,
  addExplicitExtensions,
  collectDtsFiles,
} from "../../scripts/postprocess-dts.mjs";

describe("stripStyleImports", () => {
  it("removes side-effect css imports with double quotes", () => {
    const source = 'import "./tour.css";\nexport declare class MeganeTour {\n}\n';
    expect(stripStyleImports(source)).toBe("export declare class MeganeTour {\n}\n");
  });

  it("removes side-effect css imports with single quotes", () => {
    expect(stripStyleImports("import './style.css';\nexport {};\n")).toBe("export {};\n");
  });

  it("removes package css imports too", () => {
    const source =
      'import "@xyflow/react/dist/style.css";\nimport "driver.js/dist/driver.css";\nexport declare const x: number;\n';
    expect(stripStyleImports(source)).toBe("export declare const x: number;\n");
  });

  it("keeps non-css imports and bound imports untouched", () => {
    const source =
      'import "./setup";\nimport styles from "./inline.css";\nimport { a } from "./a";\n';
    expect(stripStyleImports(source)).toBe(source);
  });

  it("only strips whole-line imports, not css mentioned mid-line", () => {
    const source = 'export declare const cssPath = "./tour.css";\n';
    expect(stripStyleImports(source)).toBe(source);
  });
});

describe("addExplicitExtensions", () => {
  const asFile = () => "file" as const;

  it("appends .js to relative import and export specifiers", () => {
    const source =
      'import { A } from "./a";\nexport { B } from "../b";\nexport type { C } from "./sub/c";\n';
    expect(addExplicitExtensions(source, asFile)).toBe(
      'import { A } from "./a.js";\nexport { B } from "../b.js";\nexport type { C } from "./sub/c.js";\n',
    );
  });

  it("rewrites inline import() type references", () => {
    const source =
      'export declare const state: import("./renderer/MoleculeRenderer").MeganeCameraState;\n';
    expect(addExplicitExtensions(source, asFile)).toBe(
      'export declare const state: import("./renderer/MoleculeRenderer.js").MeganeCameraState;\n',
    );
  });

  it("maps directory specifiers to index.js", () => {
    const source = 'import { P } from "./pipeline";\n';
    expect(addExplicitExtensions(source, () => "directory")).toBe(
      'import { P } from "./pipeline/index.js";\n',
    );
  });

  it("leaves bare (package) specifiers untouched", () => {
    const source = 'import * as THREE from "three";\nimport { create } from "zustand";\n';
    expect(addExplicitExtensions(source, asFile)).toBe(source);
  });

  it("leaves already-extensioned and unresolvable specifiers untouched", () => {
    const source = 'import { A } from "./a.js";\nimport { B } from "./gone";\n';
    expect(addExplicitExtensions(source, (spec) => (spec === "./gone" ? null : "file"))).toBe(
      source,
    );
  });
});

describe("collectDtsFiles", () => {
  const dirs: string[] = [];
  afterEach(() => {
    for (const dir of dirs.splice(0)) {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("recursively finds only .d.ts files", () => {
    const dir = mkdtempSync(join(tmpdir(), "megane-dts-"));
    dirs.push(dir);
    mkdirSync(join(dir, "nested"));
    writeFileSync(join(dir, "lib.d.ts"), "");
    writeFileSync(join(dir, "nested", "widget.d.ts"), "");
    writeFileSync(join(dir, "nested", "notes.txt"), "");
    writeFileSync(join(dir, "styles.css"), "");

    const found = collectDtsFiles(dir).sort();
    expect(found).toEqual([join(dir, "lib.d.ts"), join(dir, "nested", "widget.d.ts")]);
  });
});
