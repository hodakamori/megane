import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { isOpenDx, parseDx } from "@/pipeline/executors/parseDx";
import {
  VOLUMETRIC_ACCEPT,
  VOLUMETRIC_EXTS,
  isVolumetricFileName,
  parseVolumetric,
} from "@/pipeline/executors/parseVolumetric";

/** Build a minimal OpenDX grid with `nx*ny*nz` sequential values. */
function makeDx(nx = 2, ny = 2, nz = 2, opts: { items?: number; trailer?: boolean } = {}): string {
  const total = nx * ny * nz;
  const values = Array.from({ length: total }, (_, i) => (i + 1).toFixed(4));
  const rows: string[] = [];
  for (let i = 0; i < values.length; i += 3) rows.push(values.slice(i, i + 3).join(" "));
  return [
    "# a comment line",
    `object 1 class gridpositions counts ${nx} ${ny} ${nz}`,
    "origin 1.0 2.0 3.0",
    "delta 0.5 0 0",
    "delta 0 0.5 0",
    "delta 0 0 0.5",
    `object 2 class gridconnections counts ${nx} ${ny} ${nz}`,
    `object 3 class array type double rank 0 items ${opts.items ?? total} data follows`,
    ...rows,
    ...(opts.trailer === false ? [] : ['attribute "dep" string "positions"']),
  ].join("\n");
}

const JCAMP = [
  "##TITLE=Ethanol",
  "##JCAMP-DX=4.24",
  "##XYDATA=(X++(Y..Y))",
  "400 1 2 3",
  "##END=",
].join("\n");

describe("isOpenDx", () => {
  it("recognises an OpenDX grid header", () => {
    expect(isOpenDx(makeDx())).toBe(true);
  });

  it("recognises it past leading comments", () => {
    expect(isOpenDx("# note\n# note\n" + makeDx())).toBe(true);
  });

  it("rejects a JCAMP-DX spectrum, which shares the .dx extension", () => {
    expect(isOpenDx(JCAMP)).toBe(false);
  });

  it("rejects a JCAMP-DX file whose first header is ##TITLE alone", () => {
    expect(isOpenDx("##TITLE=Something\n##XYDATA=(X++(Y..Y))\n1 2\n")).toBe(false);
  });

  it("rejects unrelated text", () => {
    expect(isOpenDx("ATOM      1  N   MET A   1\n")).toBe(false);
  });
});

describe("parseDx", () => {
  it("reads grid dimensions, origin, and step vectors", () => {
    const r = parseDx(makeDx(2, 3, 4));
    expect([r.nx, r.ny, r.nz]).toEqual([2, 3, 4]);
    expect(Array.from(r.origin)).toEqual([1, 2, 3]);
    expect(Array.from(r.step)).toEqual([0.5, 0, 0, 0, 0.5, 0, 0, 0, 0.5]);
    expect(r.type).toBe("volumetric");
  });

  it("reads all nx*ny*nz values with min and max", () => {
    const r = parseDx(makeDx(2, 2, 2));
    expect(r.data.length).toBe(8);
    expect(Array.from(r.data)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    expect(r.dataMin).toBe(1);
    expect(r.dataMax).toBe(8);
  });

  it("stops at the trailing attribute/component lines", () => {
    // The trailer must not be read as data, and the count must still match.
    expect(() => parseDx(makeDx(2, 2, 2))).not.toThrow();
  });

  it("parses the committed APBS-style fixture", () => {
    const text = readFileSync(
      resolve(__dirname, "../../../fixtures/gaussian_potential.dx"),
      "utf8",
    );
    const r = parseDx(text);
    expect([r.nx, r.ny, r.nz]).toEqual([4, 4, 4]);
    expect(r.data.length).toBe(64);
    expect(Array.from(r.origin)).toEqual([-1.5, -1.5, -1.5]);
    // The Gaussian peaks at the grid centre, so max > min > 0.
    expect(r.dataMax).toBeGreaterThan(r.dataMin);
    expect(r.dataMin).toBeGreaterThan(0);
  });

  it("throws when the gridpositions header is missing", () => {
    expect(() => parseDx("origin 0 0 0\ndelta 1 0 0\n")).toThrow(/gridpositions/);
  });

  it("throws when there are fewer than three delta lines", () => {
    const text = [
      "object 1 class gridpositions counts 2 2 2",
      "origin 0 0 0",
      "delta 1 0 0",
      "object 3 class array type double rank 0 items 8 data follows",
      "1 2 3 4 5 6 7 8",
    ].join("\n");
    expect(() => parseDx(text)).toThrow(/three delta lines/);
  });

  it("throws when the declared item count disagrees with the grid size", () => {
    expect(() => parseDx(makeDx(2, 2, 2, { items: 9 }))).toThrow(/declares 9 items/);
  });

  it("throws when the data block is short", () => {
    const text = [
      "object 1 class gridpositions counts 2 2 2",
      "origin 0 0 0",
      "delta 1 0 0",
      "delta 0 1 0",
      "delta 0 0 1",
      "object 3 class array type double rank 0 items 8 data follows",
      "1 2 3",
    ].join("\n");
    expect(() => parseDx(text)).toThrow(/expected 8 data values, got 3/);
  });

  it("throws when there is no data-follows object", () => {
    const text = [
      "object 1 class gridpositions counts 2 2 2",
      "origin 0 0 0",
      "delta 1 0 0",
      "delta 0 1 0",
      "delta 0 0 1",
    ].join("\n");
    expect(() => parseDx(text)).toThrow(/data follows/);
  });

  it("throws on a zero-sized grid", () => {
    const text = [
      "object 1 class gridpositions counts 0 2 2",
      "origin 0 0 0",
      "delta 1 0 0",
      "delta 0 1 0",
      "delta 0 0 1",
      "object 3 class array type double rank 0 items 0 data follows",
    ].join("\n");
    expect(() => parseDx(text)).toThrow(/invalid grid counts/);
  });
});

describe("parseVolumetric dispatch", () => {
  it("accepts .cube, .cub, and .dx", () => {
    expect(VOLUMETRIC_EXTS).toEqual([".cube", ".cub", ".dx"]);
    expect(VOLUMETRIC_ACCEPT).toBe(".cube,.cub,.dx");
    expect(isVolumetricFileName("density.CUBE")).toBe(true);
    expect(isVolumetricFileName("potential.dx")).toBe(true);
    expect(isVolumetricFileName("notes.txt")).toBe(false);
  });

  it("routes .dx through the OpenDX reader", () => {
    const r = parseVolumetric("potential.dx", makeDx(2, 2, 2));
    expect(r.data.length).toBe(8);
  });

  it("routes .cube through the CUBE reader", () => {
    const cube = [
      "comment 1",
      "comment 2",
      "1 0.0 0.0 0.0",
      "2 1.0 0.0 0.0",
      "2 0.0 1.0 0.0",
      "2 0.0 0.0 1.0",
      "6 6.0 0.0 0.0 0.0",
      "1 2 3 4 5 6 7 8",
    ].join("\n");
    const r = parseVolumetric("density.cube", cube);
    expect([r.nx, r.ny, r.nz]).toEqual([2, 2, 2]);
  });

  it("gives an actionable error for a .dx that is really a JCAMP-DX spectrum", () => {
    expect(() => parseVolumetric("ethanol.dx", JCAMP)).toThrow(/JCAMP-DX spectrum/);
  });

  it("rejects an unsupported extension", () => {
    expect(() => parseVolumetric("grid.bin", "whatever")).toThrow(/Unsupported volumetric format/);
  });
});
