import { describe, it, expect } from "vitest";
import { marchingCubes } from "@/pipeline/executors/marchingCubes";

/** Identity step (1 Å per voxel, orthogonal). */
const UNIT_STEP = new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);
const ORIGIN_ZERO = new Float32Array([0, 0, 0]);

/** Build a uniform 3D field of size nx × ny × nz filled with `value`. */
function uniformField(nx: number, ny: number, nz: number, value: number): Float32Array {
  return new Float32Array(nx * ny * nz).fill(value);
}

/** Build a gradient field where data[ix,iy,iz] = ix (value increases along x). */
function xGradientField(nx: number, ny: number, nz: number): Float32Array {
  const d = new Float32Array(nx * ny * nz);
  for (let ix = 0; ix < nx; ix++) {
    for (let iy = 0; iy < ny; iy++) {
      for (let iz = 0; iz < nz; iz++) {
        d[ix * ny * nz + iy * nz + iz] = ix;
      }
    }
  }
  return d;
}

/** Sphere-like SDF: value = sqrt((x-cx)²+(y-cy)²+(z-cz)²) - r. */
function sphereSdf(
  nx: number, ny: number, nz: number,
  cx: number, cy: number, cz: number,
  r: number,
): Float32Array {
  const d = new Float32Array(nx * ny * nz);
  for (let ix = 0; ix < nx; ix++) {
    for (let iy = 0; iy < ny; iy++) {
      for (let iz = 0; iz < nz; iz++) {
        const dist = Math.sqrt((ix - cx) ** 2 + (iy - cy) ** 2 + (iz - cz) ** 2);
        d[ix * ny * nz + iy * nz + iz] = dist - r;
      }
    }
  }
  return d;
}

describe("marchingCubes", () => {
  it("returns empty mesh for a uniform field above isoLevel", () => {
    const data = uniformField(4, 4, 4, 1.0);
    const { positions, indices } = marchingCubes(data, 4, 4, 4, ORIGIN_ZERO, UNIT_STEP, 0.5);
    expect(positions.length).toBe(0);
    expect(indices.length).toBe(0);
  });

  it("returns empty mesh for a uniform field below isoLevel", () => {
    const data = uniformField(4, 4, 4, -1.0);
    const { positions, indices } = marchingCubes(data, 4, 4, 4, ORIGIN_ZERO, UNIT_STEP, 0.5);
    expect(positions.length).toBe(0);
    expect(indices.length).toBe(0);
  });

  it("returns triangles for a gradient field crossing the isoLevel", () => {
    // field goes 0→1→2→3 along x; isoLevel=1.5 should cross somewhere.
    const data = xGradientField(4, 4, 4);
    const { positions, normals, indices } = marchingCubes(data, 4, 4, 4, ORIGIN_ZERO, UNIT_STEP, 1.5);
    expect(positions.length).toBeGreaterThan(0);
    expect(normals.length).toBe(positions.length);
    expect(indices.length).toBe(positions.length / 3);
  });

  it("positions length is a multiple of 9 (whole triangles)", () => {
    const data = xGradientField(4, 4, 4);
    const { positions } = marchingCubes(data, 4, 4, 4, ORIGIN_ZERO, UNIT_STEP, 1.5);
    expect(positions.length % 9).toBe(0);
  });

  it("normals are unit vectors", () => {
    const data = xGradientField(4, 4, 4);
    const { normals } = marchingCubes(data, 4, 4, 4, ORIGIN_ZERO, UNIT_STEP, 1.5);
    for (let i = 0; i < normals.length; i += 3) {
      const len = Math.sqrt(normals[i] ** 2 + normals[i + 1] ** 2 + normals[i + 2] ** 2);
      expect(len).toBeCloseTo(1, 5);
    }
  });

  it("indices are sequential [0, 1, 2, …]", () => {
    const data = xGradientField(4, 4, 4);
    const { indices } = marchingCubes(data, 4, 4, 4, ORIGIN_ZERO, UNIT_STEP, 1.5);
    for (let i = 0; i < indices.length; i++) {
      expect(indices[i]).toBe(i);
    }
  });

  it("vertex positions are interpolated between iso-crossing corners", () => {
    // Simple gradient field: value = ix. isoLevel = 1.5 → surface at x = 1.5.
    const data = xGradientField(3, 2, 2);
    const { positions } = marchingCubes(data, 3, 2, 2, ORIGIN_ZERO, UNIT_STEP, 1.5);
    // All x positions should be close to 1.5 (linear interpolation gives exact 1.5).
    for (let i = 0; i < positions.length; i += 3) {
      expect(positions[i]).toBeCloseTo(1.5, 4);
    }
  });

  it("respects the origin offset", () => {
    const data = xGradientField(3, 2, 2);
    const origin = new Float32Array([10, 20, 30]);
    const { positions } = marchingCubes(data, 3, 2, 2, origin, UNIT_STEP, 1.5);
    // x-surface at grid x=1.5, shifted by origin[0]=10 → world x ≈ 11.5.
    for (let i = 0; i < positions.length; i += 3) {
      expect(positions[i]).toBeCloseTo(11.5, 4);
    }
  });

  it("respects the step matrix scaling", () => {
    const data = xGradientField(3, 2, 2);
    // Scale x axis by 2 (step = 2 Å per grid unit).
    const step = new Float32Array([2, 0, 0, 0, 1, 0, 0, 0, 1]);
    const { positions } = marchingCubes(data, 3, 2, 2, ORIGIN_ZERO, step, 1.5);
    // Surface at grid x=1.5, with step[0]=2 → world x = 1.5 * 2 = 3.0.
    for (let i = 0; i < positions.length; i += 3) {
      expect(positions[i]).toBeCloseTo(3.0, 4);
    }
  });

  it("produces a closed mesh for a sphere-like SDF", () => {
    // 12×12×12 grid, sphere of radius 4 centered at (6,6,6).
    const n = 12;
    const data = sphereSdf(n, n, n, 6, 6, 6, 4);
    const { positions, indices } = marchingCubes(data, n, n, n, ORIGIN_ZERO, UNIT_STEP, 0);
    expect(positions.length).toBeGreaterThan(0);
    // The number of triangle vertices must be divisible by 9.
    expect(positions.length % 9).toBe(0);
    expect(indices.length * 3).toBe(positions.length);
  });

  it("works on a non-cubic grid (nx ≠ ny ≠ nz)", () => {
    const nx = 4, ny = 3, nz = 2;
    const data = xGradientField(nx, ny, nz);
    const { positions } = marchingCubes(data, nx, ny, nz, ORIGIN_ZERO, UNIT_STEP, 1.5);
    expect(positions.length).toBeGreaterThan(0);
    // All vertices are at x ≈ 1.5.
    for (let i = 0; i < positions.length; i += 3) {
      expect(positions[i]).toBeCloseTo(1.5, 4);
    }
  });

  it("handles a minimal 2×2×2 grid with one corner below threshold", () => {
    // Only corner (0,0,0) is below the isoLevel.
    const data = new Float32Array([
      0, 1, 1, 1, // iz=0: v0=0 < 0.5, rest above
      1, 1, 1, 1, // iz=1: all above
    ]);
    const { positions } = marchingCubes(data, 2, 2, 2, ORIGIN_ZERO, UNIT_STEP, 0.5);
    // Should produce exactly one triangle (3 vertices × 3 coords = 9 values).
    expect(positions.length).toBe(9);
  });
});
