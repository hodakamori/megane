/**
 * The docs site (Docusaurus) compiles the shared `src/` viewer through Babel
 * with `@babel/preset-env`, whose targets come from the docs' browserslist
 * config. With no config, preset-env assumes the oldest browsers and
 * down-levels every ES2015+ construct — including `class`. `node_modules` is
 * not transpiled, so a transpiled `CameraControls extends TrackballControls`
 * then calls three.js' native class constructor without `new` and the
 * renderer throws on mount: the landing hero stays blank (its structure never
 * fades in) and every docs viewer embed dies the same way.
 *
 * Keep the targets modern enough that Babel leaves classes alone.
 */
import fs from "node:fs";
import path from "node:path";
import getTargets, { isRequired } from "@babel/helper-compilation-targets";
import { describe, expect, it } from "vitest";

const DOCS_PKG = path.resolve(__dirname, "..", "..", "..", "docs", "package.json");

describe("docs browserslist", () => {
  const pkg = JSON.parse(fs.readFileSync(DOCS_PKG, "utf8"));
  const browserslist = pkg.browserslist as Record<string, string[]> | undefined;

  it("declares production and development targets", () => {
    expect(browserslist).toBeDefined();
    for (const env of ["production", "development"]) {
      expect(Array.isArray(browserslist![env])).toBe(true);
      expect(browserslist![env].length).toBeGreaterThan(0);
    }
  });

  it.each(["production", "development"])(
    "%s targets do not make Babel down-level ES classes",
    (env) => {
      const targets = getTargets({ browsers: browserslist![env] }, {});
      // Would preset-env include transform-classes for these targets?
      expect(isRequired("transform-classes", targets)).toBe(false);
    },
  );
});
