import { describe, it, expect, vi, beforeEach } from "vitest";
import * as THREE from "three";
import {
  getVdwRadius,
  buildSdf,
  sdfToGeometry,
  SurfaceRenderer,
  VDW_RADII,
  DEFAULT_VDW_RADIUS,
  DEFAULT_PROBE_RADIUS,
  DEFAULT_SURFACE_RESOLUTION,
} from "@/renderer/SurfaceRenderer";
import type { Snapshot } from "@/types";

// ── helpers ──────────────────────────────────────────────────────────────────

function makePositions(...coords: number[]): Float32Array {
  return new Float32Array(coords);
}

function makeElements(...atomicNumbers: number[]): Uint8Array {
  return new Uint8Array(atomicNumbers);
}

/** Minimal snapshot for a single atom at origin with given element. */
function singleAtomSnapshot(element = 6): Snapshot {
  return {
    nAtoms: 1,
    nBonds: 0,
    nFileBonds: 0,
    positions: makePositions(0, 0, 0),
    elements: makeElements(element),
    bonds: new Uint32Array(0),
    bondOrders: null,
    box: null,
  };
}

/** Minimal two-atom snapshot. */
function twoAtomSnapshot(): Snapshot {
  return {
    nAtoms: 2,
    nBonds: 0,
    nFileBonds: 0,
    // C at origin, O at (3, 0, 0)
    positions: makePositions(0, 0, 0, 3, 0, 0),
    elements: makeElements(6, 8), // C, O
    bonds: new Uint32Array(0),
    bondOrders: null,
    box: null,
  };
}

// ── getVdwRadius ─────────────────────────────────────────────────────────────

describe("getVdwRadius", () => {
  it("returns 1.2 for hydrogen (Z=1)", () => {
    expect(getVdwRadius(1)).toBe(1.2);
  });

  it("returns 1.7 for carbon (Z=6)", () => {
    expect(getVdwRadius(6)).toBe(1.7);
  });

  it("returns 1.52 for oxygen (Z=8)", () => {
    expect(getVdwRadius(8)).toBe(1.52);
  });

  it("returns 1.8 for sulfur (Z=16)", () => {
    expect(getVdwRadius(16)).toBe(1.8);
  });

  it("returns DEFAULT_VDW_RADIUS for unknown element (Z=99)", () => {
    expect(getVdwRadius(99)).toBe(DEFAULT_VDW_RADIUS);
  });

  it("returns DEFAULT_VDW_RADIUS for Z=0", () => {
    expect(getVdwRadius(0)).toBe(DEFAULT_VDW_RADIUS);
  });

  it("every radius in VDW_RADII is a positive number", () => {
    for (const [, r] of Object.entries(VDW_RADII)) {
      expect(r).toBeGreaterThan(0);
    }
  });
});

// ── buildSdf ─────────────────────────────────────────────────────────────────

describe("buildSdf – empty structure", () => {
  it("returns a grid of the requested resolution when nAtoms=0", () => {
    const res = 16;
    const result = buildSdf(new Float32Array(0), new Uint8Array(0), 0, DEFAULT_PROBE_RADIUS, res);
    expect(result.res).toBe(res);
    expect(result.sdf.length).toBe(res * res * res);
  });

  it("fills the empty grid with positive values (all outside)", () => {
    const result = buildSdf(new Float32Array(0), new Uint8Array(0), 0, 1.4, 8);
    expect(result.sdf.every((v) => v > 0)).toBe(true);
  });
});

describe("buildSdf – single atom", () => {
  it("returns origin, cellSize, and res", () => {
    const result = buildSdf(makePositions(0, 0, 0), makeElements(6), 1, 1.4, 16);
    expect(result.res).toBe(16);
    expect(result.cellSize).toBeGreaterThan(0);
    expect(Number.isFinite(result.originX)).toBe(true);
    expect(Number.isFinite(result.originY)).toBe(true);
    expect(Number.isFinite(result.originZ)).toBe(true);
  });

  it("centre voxel is inside the SAS (negative SDF)", () => {
    // Carbon at origin with probe 1.4 → effective radius 1.7+1.4 = 3.1 Å.
    // The grid centre should be well inside the sphere.
    const res = 16;
    const result = buildSdf(makePositions(0, 0, 0), makeElements(6), 1, 1.4, res);
    const mid = Math.floor(res / 2);
    const idx = mid * res * res + mid * res + mid;
    expect(result.sdf[idx]).toBeLessThan(0);
  });

  it("corner voxels are outside the SAS (positive SDF)", () => {
    const res = 16;
    const result = buildSdf(makePositions(0, 0, 0), makeElements(6), 1, 1.4, res);
    const corner = 0 * res * res + 0 * res + 0;
    expect(result.sdf[corner]).toBeGreaterThan(0);
  });

  it("probe radius increases the effective radius (more negative SDF at centre)", () => {
    // The SDF value at the atom centre equals −effectiveRadius.
    // A larger probe gives a more negative centre value.
    const positions = makePositions(0, 0, 0);
    const elements = makeElements(6); // C, VDW=1.7
    const res = 32;

    const smallProbe = buildSdf(positions, elements, 1, 0.5, res);
    const largeProbe = buildSdf(positions, elements, 1, 3.0, res);

    // Find the voxel closest to the atom centre (originX + mid*cellSize ≈ 0).
    const mid = Math.floor(res / 2);
    const idxSmall = mid * res * res + mid * res + mid;
    const idxLarge = mid * res * res + mid * res + mid;

    // Centre SDF for large probe should be more negative than for small probe.
    expect(largeProbe.sdf[idxLarge]).toBeLessThan(smallProbe.sdf[idxSmall]);
  });
});

describe("buildSdf – two atoms", () => {
  it("merges two overlapping spheres into one region", () => {
    // Two carbon atoms 2 Å apart (they overlap with probe 1.4).
    const positions = makePositions(0, 0, 0, 2, 0, 0);
    const elements = makeElements(6, 6);
    const res = 32;
    const result = buildSdf(positions, elements, 2, 1.4, res);

    // The midpoint (1, 0, 0) should be inside both atoms' spheres.
    // Find the voxel closest to (1, 0, 0).
    const { originX, originY, originZ, cellSize } = result;
    const gx = Math.round((1 - originX) / cellSize);
    const gy = Math.round((0 - originY) / cellSize);
    const gz = Math.round((0 - originZ) / cellSize);
    const idx = gz * res * res + gy * res + gx;
    expect(result.sdf[idx]).toBeLessThan(0);
  });

  it("grid has at least some inside voxels", () => {
    const result = buildSdf(
      makePositions(0, 0, 0, 3, 0, 0),
      makeElements(6, 8),
      2,
      1.4,
      24,
    );
    const insideCount = Array.from(result.sdf).filter((v) => v < 0).length;
    expect(insideCount).toBeGreaterThan(0);
  });
});

// ── sdfToGeometry ─────────────────────────────────────────────────────────────

describe("sdfToGeometry", () => {
  it("returns a BufferGeometry", () => {
    const sdfResult = buildSdf(makePositions(0, 0, 0), makeElements(6), 1, 1.4, 16);
    const geom = sdfToGeometry(sdfResult);
    expect(geom).toBeInstanceOf(THREE.BufferGeometry);
  });

  it("has a position attribute for a non-empty structure", () => {
    const sdfResult = buildSdf(makePositions(0, 0, 0), makeElements(6), 1, 1.4, 24);
    const geom = sdfToGeometry(sdfResult);
    expect(geom.attributes.position).toBeDefined();
    expect(geom.attributes.position.count).toBeGreaterThan(0);
  });

  it("has a normal attribute (computed vertex normals)", () => {
    const sdfResult = buildSdf(makePositions(0, 0, 0), makeElements(6), 1, 1.4, 24);
    const geom = sdfToGeometry(sdfResult);
    expect(geom.attributes.normal).toBeDefined();
    expect(geom.attributes.normal.count).toBeGreaterThan(0);
  });

  it("geometry vertices are near the expected sphere radius in world space", () => {
    // Carbon at origin, probe 1.4 → SAS radius ≈ 1.7+1.4 = 3.1 Å.
    const sdfResult = buildSdf(makePositions(0, 0, 0), makeElements(6), 1, 1.4, 32);
    const geom = sdfToGeometry(sdfResult);

    const pos = geom.attributes.position;
    const expected = 1.7 + 1.4; // 3.1 Å
    const tolerance = 0.5; // allow ±0.5 Å rounding from the grid

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);
      const r = Math.sqrt(x * x + y * y + z * z);
      expect(r).toBeGreaterThan(expected - tolerance);
      expect(r).toBeLessThan(expected + tolerance);
    }
  });

  it("returns a non-empty geometry for two atoms", () => {
    const sdfResult = buildSdf(makePositions(0, 0, 0, 3, 0, 0), makeElements(6, 8), 2, 1.4, 24);
    const geom = sdfToGeometry(sdfResult);
    expect(geom.attributes.position.count).toBeGreaterThan(0);
  });
});

// ── SurfaceRenderer class ─────────────────────────────────────────────────────

describe("SurfaceRenderer", () => {
  it("constructs with a THREE.Group mesh that starts hidden", () => {
    const sr = new SurfaceRenderer();
    expect(sr.mesh).toBeInstanceOf(THREE.Group);
    expect(sr.mesh.visible).toBe(false);
  });

  it("setVisible(true) makes the mesh visible", () => {
    const sr = new SurfaceRenderer();
    sr.setVisible(true);
    expect(sr.mesh.visible).toBe(true);
  });

  it("setVisible(false) hides the mesh", () => {
    const sr = new SurfaceRenderer();
    sr.setVisible(true);
    sr.setVisible(false);
    expect(sr.mesh.visible).toBe(false);
  });

  it("loadSnapshot builds geometry and adds a child mesh", () => {
    const sr = new SurfaceRenderer();
    const snap = singleAtomSnapshot();
    sr.loadSnapshot(snap);
    expect(sr.mesh.children.length).toBeGreaterThan(0);
  });

  it("loadSnapshot replaces geometry on second call", () => {
    const sr = new SurfaceRenderer();
    sr.loadSnapshot(singleAtomSnapshot());
    const count1 = sr.mesh.children.length;
    sr.loadSnapshot(twoAtomSnapshot());
    expect(sr.mesh.children.length).toBe(count1);
  });

  it("setColor changes the material color", () => {
    const sr = new SurfaceRenderer({ color: 0xff0000 });
    sr.setColor(0x00ff00);
    // Access the child mesh's material to verify (after loading a snapshot)
    sr.loadSnapshot(singleAtomSnapshot());
    const child = sr.mesh.children[0] as THREE.Mesh;
    expect((child.material as THREE.MeshPhongMaterial).color.getHex()).toBe(0x00ff00);
  });

  it("setOpacity changes the material opacity", () => {
    const sr = new SurfaceRenderer();
    sr.setOpacity(0.3);
    sr.loadSnapshot(singleAtomSnapshot());
    const child = sr.mesh.children[0] as THREE.Mesh;
    expect((child.material as THREE.MeshPhongMaterial).opacity).toBeCloseTo(0.3);
  });

  it("dispose removes child meshes and clears the group", () => {
    const sr = new SurfaceRenderer();
    sr.loadSnapshot(singleAtomSnapshot());
    expect(sr.mesh.children.length).toBeGreaterThan(0);
    sr.dispose();
    expect(sr.mesh.children.length).toBe(0);
  });

  it("updatePositions with no snapshot is a no-op", () => {
    const sr = new SurfaceRenderer();
    expect(() => sr.updatePositions(new Float32Array(3))).not.toThrow();
  });

  it("updatePositions rebuilds the surface with new positions", () => {
    const sr = new SurfaceRenderer();
    sr.loadSnapshot(twoAtomSnapshot());
    expect(() => sr.updatePositions(makePositions(0, 0, 0, 5, 0, 0))).not.toThrow();
    expect(sr.mesh.children.length).toBeGreaterThan(0);
  });

  it("setProbeRadius rebuilds the surface with different radius", () => {
    const sr = new SurfaceRenderer();
    sr.loadSnapshot(singleAtomSnapshot());
    const countBefore = sr.mesh.children.length;
    expect(() => sr.setProbeRadius(2.0)).not.toThrow();
    expect(sr.mesh.children.length).toBe(countBefore);
  });

  it("accepts custom color and opacity via constructor options", () => {
    const sr = new SurfaceRenderer({ color: 0xff0000, opacity: 0.8 });
    sr.loadSnapshot(singleAtomSnapshot());
    const child = sr.mesh.children[0] as THREE.Mesh;
    const mat = child.material as THREE.MeshPhongMaterial;
    expect(mat.color.getHex()).toBe(0xff0000);
    expect(mat.opacity).toBeCloseTo(0.8);
  });
});

// ── constants ─────────────────────────────────────────────────────────────────

describe("module constants", () => {
  it("DEFAULT_PROBE_RADIUS is 1.4", () => {
    expect(DEFAULT_PROBE_RADIUS).toBe(1.4);
  });

  it("DEFAULT_VDW_RADIUS is 1.7", () => {
    expect(DEFAULT_VDW_RADIUS).toBe(1.7);
  });

  it("DEFAULT_SURFACE_RESOLUTION is positive", () => {
    expect(DEFAULT_SURFACE_RESOLUTION).toBeGreaterThan(0);
  });
});
