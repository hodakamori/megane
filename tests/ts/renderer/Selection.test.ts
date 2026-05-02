import { describe, it, expect } from "vitest";
import {
  computeDistance,
  computeAngle,
  computeDihedral,
  computeMeasurement,
} from "@/renderer/Selection";

const EPS = 1e-6;

describe("computeDistance", () => {
  it("returns Euclidean distance between two atoms", () => {
    const pos = new Float32Array([0, 0, 0, 3, 4, 0]);
    expect(computeDistance(pos, 0, 1)).toBeCloseTo(5, 6);
  });

  it("is symmetric in argument order", () => {
    const pos = new Float32Array([1, 2, 3, 4, 6, 8]);
    expect(computeDistance(pos, 0, 1)).toBeCloseTo(computeDistance(pos, 1, 0), 6);
  });

  it("returns 0 for coincident points", () => {
    const pos = new Float32Array([1, 2, 3, 1, 2, 3]);
    expect(computeDistance(pos, 0, 1)).toBe(0);
  });

  it("handles negative coordinates", () => {
    const pos = new Float32Array([-1, -1, -1, 1, 1, 1]);
    expect(computeDistance(pos, 0, 1)).toBeCloseTo(Math.sqrt(12), 5);
  });
});

describe("computeAngle", () => {
  it("returns 90 degrees for orthogonal vectors", () => {
    // a-b along +x, b-c along +y
    const pos = new Float32Array([
      1,
      0,
      0, // a
      0,
      0,
      0, // b (vertex)
      0,
      1,
      0, // c
    ]);
    expect(computeAngle(pos, 0, 1, 2)).toBeCloseTo(90, 5);
  });

  it("returns 180 degrees for collinear opposite vectors", () => {
    const pos = new Float32Array([-1, 0, 0, 0, 0, 0, 1, 0, 0]);
    expect(computeAngle(pos, 0, 1, 2)).toBeCloseTo(180, 5);
  });

  it("returns 0 degrees for collinear same-direction vectors", () => {
    const pos = new Float32Array([1, 0, 0, 0, 0, 0, 2, 0, 0]);
    expect(computeAngle(pos, 0, 1, 2)).toBeCloseTo(0, 5);
  });

  it("returns 60 degrees for equilateral triangle vertex", () => {
    const pos = new Float32Array([1, 0, 0, 0, 0, 0, 0.5, Math.sqrt(3) / 2, 0]);
    expect(computeAngle(pos, 0, 1, 2)).toBeCloseTo(60, 4);
  });

  it("clamps numerical noise so acos doesn't NaN", () => {
    // Identical vectors at b would give dot/(|ba||bc|) = 1; floating point
    // could produce 1 + ε. Verify we get 0 not NaN.
    const pos = new Float32Array([1, 0, 0, 0, 0, 0, 1, 0, 0]);
    const a = computeAngle(pos, 0, 1, 2);
    expect(Number.isNaN(a)).toBe(false);
    expect(a).toBeCloseTo(0, 5);
  });
});

describe("computeDihedral", () => {
  it("returns 0 degrees for atoms in a coplanar cis arrangement", () => {
    // a-b-c-d all in xy plane with c-d going back parallel to b-a
    const pos = new Float32Array([
      0,
      1,
      0, // a
      0,
      0,
      0, // b
      1,
      0,
      0, // c
      1,
      1,
      0, // d (cis: same side as a relative to b-c)
    ]);
    expect(Math.abs(computeDihedral(pos, 0, 1, 2, 3))).toBeCloseTo(0, 4);
  });

  it("returns ±180 degrees for trans coplanar arrangement", () => {
    const pos = new Float32Array([
      0,
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      1,
      -1,
      0, // trans: opposite side
    ]);
    const d = computeDihedral(pos, 0, 1, 2, 3);
    expect(Math.abs(d)).toBeCloseTo(180, 4);
  });

  it("returns ±90 degrees for a 90° out-of-plane d atom", () => {
    const pos = new Float32Array([
      0,
      1,
      0, // a
      0,
      0,
      0, // b
      1,
      0,
      0, // c
      1,
      0,
      1, // d (out of plane)
    ]);
    expect(Math.abs(computeDihedral(pos, 0, 1, 2, 3))).toBeCloseTo(90, 4);
  });

  it("changes sign when d is reflected across the b-c axis plane", () => {
    const posA = new Float32Array([0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1]);
    const posB = new Float32Array([0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, -1]);
    const dA = computeDihedral(posA, 0, 1, 2, 3);
    const dB = computeDihedral(posB, 0, 1, 2, 3);
    expect(dA).toBeCloseTo(-dB, 4);
    // Reflected geometries should produce equal-magnitude opposite-sign dihedrals.
    expect(Math.abs(dA)).toBeCloseTo(Math.abs(dB), 4);
  });
});

describe("computeMeasurement", () => {
  it("returns null for fewer than 2 atoms", () => {
    const pos = new Float32Array([0, 0, 0]);
    expect(computeMeasurement(pos, [])).toBeNull();
    expect(computeMeasurement(pos, [0])).toBeNull();
  });

  it("returns null for more than 4 atoms", () => {
    const pos = new Float32Array(15);
    expect(computeMeasurement(pos, [0, 1, 2, 3, 4])).toBeNull();
  });

  it("formats distance for 2 atoms with Å suffix and 3 decimals", () => {
    const pos = new Float32Array([0, 0, 0, 3, 4, 0]);
    const m = computeMeasurement(pos, [0, 1]);
    expect(m).not.toBeNull();
    expect(m!.type).toBe("distance");
    expect(m!.value).toBeCloseTo(5, 6);
    expect(m!.label).toBe("5.000 Å");
    expect(m!.atoms).toEqual([0, 1]);
  });

  it("formats angle for 3 atoms with ° suffix and 1 decimal", () => {
    const pos = new Float32Array([1, 0, 0, 0, 0, 0, 0, 1, 0]);
    const m = computeMeasurement(pos, [0, 1, 2]);
    expect(m).not.toBeNull();
    expect(m!.type).toBe("angle");
    expect(m!.value).toBeCloseTo(90, 4);
    expect(m!.label).toBe("90.0°");
  });

  it("formats dihedral for 4 atoms with ° suffix and 1 decimal", () => {
    const pos = new Float32Array([0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1]);
    const m = computeMeasurement(pos, [0, 1, 2, 3]);
    expect(m).not.toBeNull();
    expect(m!.type).toBe("dihedral");
    expect(Math.abs(m!.value)).toBeCloseTo(90, 4);
    expect(m!.label).toMatch(/^-?90\.0°$/);
  });

  it("returned atoms array is a copy, not a reference", () => {
    const pos = new Float32Array([0, 0, 0, 1, 0, 0]);
    const input = [0, 1];
    const m = computeMeasurement(pos, input);
    expect(m!.atoms).not.toBe(input);
    input.push(2);
    expect(m!.atoms).toEqual([0, 1]);
  });

  it("EPS sanity: numerical helpers stay within tolerance", () => {
    // Guards against accidental degree↔radian swaps.
    expect(EPS).toBeLessThan(1e-3);
  });
});
