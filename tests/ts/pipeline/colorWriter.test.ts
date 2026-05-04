import { describe, it, expect } from "vitest";
import {
  hexToRgb,
  makeColorWriter,
  ensureColorOverridesBuffer,
  NO_OVERRIDE,
} from "@/pipeline/colorWriter";
import type { ParticleData } from "@/pipeline/types";
import type { Snapshot } from "@/types";

function makeSnapshot(): Snapshot {
  return {
    nAtoms: 3,
    nBonds: 0,
    positions: new Float32Array([0, 0, 0, 1, 0, 0, 2, 0, 0]),
    elements: new Uint8Array([1, 6, 8]),
    bonds: new Uint32Array(),
    bondOrders: null,
    atomBFactors: new Float32Array([10, 20, 30]),
    atomChainIds: new Uint8Array([65, 66, 65]),
  } as unknown as Snapshot;
}

function makeParticle(overrides: Float32Array | null = null): ParticleData {
  return {
    type: "particle",
    source: makeSnapshot(),
    sourceNodeId: "src",
    indices: null,
    scaleOverrides: null,
    opacityOverrides: null,
    colorOverrides: overrides,
    representationOverride: null,
  };
}

describe("hexToRgb", () => {
  it("parses 6-digit hex with hash prefix", () => {
    const [r, g, b] = hexToRgb("#ff8800");
    expect(r).toBeCloseTo(1, 6);
    expect(g).toBeCloseTo(0x88 / 255, 6);
    expect(b).toBeCloseTo(0, 6);
  });

  it("parses 3-digit hex by doubling each nibble", () => {
    const [r, g, b] = hexToRgb("#f80");
    expect(r).toBeCloseTo(1, 6);
    expect(g).toBeCloseTo(0x88 / 255, 6);
    expect(b).toBeCloseTo(0, 6);
  });

  it("parses hex without leading hash", () => {
    const [r, g, b] = hexToRgb("00ff00");
    expect(r).toBe(0);
    expect(g).toBeCloseTo(1, 6);
    expect(b).toBe(0);
  });

  it("falls back to white for malformed input", () => {
    expect(hexToRgb("not-a-color")).toEqual([1, 1, 1]);
    expect(hexToRgb("#1234")).toEqual([1, 1, 1]);
  });
});

describe("ensureColorOverridesBuffer", () => {
  it("returns a fresh NaN-filled buffer when the upstream stream has none", () => {
    const buf = ensureColorOverridesBuffer(makeParticle(null));
    expect(buf.length).toBe(9);
    for (let i = 0; i < buf.length; i++) {
      expect(Number.isNaN(buf[i])).toBe(true);
    }
  });

  it("returns a copy of the upstream buffer (mutation safety)", () => {
    const upstream = new Float32Array(9);
    upstream.fill(NO_OVERRIDE);
    upstream[0] = 0.5;
    upstream[1] = 0.5;
    upstream[2] = 0.5;

    const buf = ensureColorOverridesBuffer(makeParticle(upstream));
    expect(buf).not.toBe(upstream);
    expect(buf[0]).toBe(0.5);

    buf[0] = 0.1;
    expect(upstream[0]).toBe(0.5);
  });
});

describe("makeColorWriter", () => {
  it("writes the same RGB triplet for every atom in uniform mode", () => {
    const writer = makeColorWriter("uniform", "#ff0000", makeParticle(), null, undefined);
    const buf = new Float32Array(9);
    buf.fill(NO_OVERRIDE);
    writer(buf, 0);
    writer(buf, 2);
    expect(buf[0]).toBe(1);
    expect(buf[1]).toBe(0);
    expect(buf[2]).toBe(0);
    expect(buf[6]).toBe(1);
    expect(buf[8]).toBe(0);
    // atom 1 untouched (still NaN)
    expect(Number.isNaN(buf[3])).toBe(true);
  });

  it("uses atomLabels when computing byResidue colors", () => {
    const labels = ["ALA1", "GLY2", "VAL3"];
    const writer = makeColorWriter(
      "byResidue",
      "#000000",
      makeParticle(),
      labels,
      undefined,
    );
    const buf = new Float32Array(9);
    buf.fill(NO_OVERRIDE);
    writer(buf, 0);
    writer(buf, 1);
    writer(buf, 2);
    // ALA palette = [0.78, 0.78, 0.78]; GLY palette = [1,1,1]; VAL palette = [0.58, 0.58, 0.58]
    expect(buf[0]).toBeCloseTo(0.78, 5);
    expect(buf[3]).toBeCloseTo(1, 5);
    expect(buf[6]).toBeCloseTo(0.58, 5);
  });

  it("respects an explicit colorRange in byBFactor mode", () => {
    const writer = makeColorWriter(
      "byBFactor",
      "#000000",
      makeParticle(),
      null,
      [0, 100],
    );
    const buf = new Float32Array(9);
    buf.fill(NO_OVERRIDE);
    writer(buf, 0); // bfactor 10 → near blue
    writer(buf, 2); // bfactor 30 → still cool half
    // Just assert ordering — atom 0 (cooler) should have lower r than atom 2 in
    // a viridis-style cool→hot gradient.
    expect(buf[0]).toBeLessThan(buf[6]);
  });

  it("byElement falls back to CPK colors", () => {
    const writer = makeColorWriter("byElement", "#000000", makeParticle(), null, undefined);
    const buf = new Float32Array(9);
    buf.fill(NO_OVERRIDE);
    writer(buf, 0); // H
    writer(buf, 1); // C
    expect(Number.isNaN(buf[0])).toBe(false);
    expect(Number.isNaN(buf[3])).toBe(false);
    // Hydrogen and carbon must produce different colors.
    const sameH = buf[0] === buf[3] && buf[1] === buf[4] && buf[2] === buf[5];
    expect(sameH).toBe(false);
  });
});
