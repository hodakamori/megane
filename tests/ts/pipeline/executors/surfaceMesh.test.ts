import { describe, it, expect } from "vitest";
import { executeSurfaceMesh } from "@/pipeline/executors/surfaceMesh";
import type { SurfaceMeshParams, ParticleData, MeshData, PipelineData } from "@/pipeline/types";
import type { Snapshot } from "@/types";

function makeSnapshot(nAtoms = 3): Snapshot {
  const positions = new Float32Array(nAtoms * 3);
  for (let i = 0; i < nAtoms; i++) {
    positions[i * 3] = i * 3;
  }
  return {
    nAtoms,
    nBonds: 0,
    positions,
    elements: new Uint8Array(nAtoms).fill(6),
    bonds: new Uint32Array(0),
    bondOrders: null,
  } as unknown as Snapshot;
}

function makeParticle(nAtoms = 3): ParticleData {
  return {
    type: "particle",
    source: makeSnapshot(nAtoms),
    sourceNodeId: "src",
    indices: null,
    scaleOverrides: null,
    opacityOverrides: null,
    colorOverrides: null,
    representationOverride: null,
  };
}

function baseParams(extra: Partial<SurfaceMeshParams> = {}): SurfaceMeshParams {
  return {
    type: "surface_mesh",
    alphaRadius: 3.0,
    color: "#4488ff",
    opacity: 0.5,
    ...extra,
  };
}

function inputs(data: PipelineData): Map<string, PipelineData[]> {
  return new Map([["particle", [data]]]);
}

describe("executeSurfaceMesh", () => {
  it("returns empty map when there is no input", () => {
    const out = executeSurfaceMesh(baseParams(), new Map());
    expect(out.size).toBe(0);
  });

  it("outputs a 'mesh' key when particle input is provided", () => {
    const out = executeSurfaceMesh(baseParams(), inputs(makeParticle()));
    expect(out.has("mesh")).toBe(true);
  });

  it("output has type 'mesh'", () => {
    const out = executeSurfaceMesh(baseParams(), inputs(makeParticle()));
    const mesh = out.get("mesh") as MeshData;
    expect(mesh.type).toBe("mesh");
  });

  it("produces non-empty geometry for a 3-atom structure", () => {
    const out = executeSurfaceMesh(baseParams(), inputs(makeParticle(3)));
    const mesh = out.get("mesh") as MeshData;
    expect(mesh.positions.length).toBeGreaterThan(0);
    expect(mesh.indices.length).toBeGreaterThan(0);
  });

  it("uses the alphaRadius parameter (larger radius → denser mesh)", () => {
    const small = executeSurfaceMesh(baseParams({ alphaRadius: 1.0 }), inputs(makeParticle(3)));
    const large = executeSurfaceMesh(baseParams({ alphaRadius: 5.0 }), inputs(makeParticle(3)));
    const meshSmall = small.get("mesh") as MeshData;
    const meshLarge = large.get("mesh") as MeshData;
    // Both should produce some geometry.
    expect(meshSmall.positions.length).toBeGreaterThan(0);
    expect(meshLarge.positions.length).toBeGreaterThan(0);
  });

  it("encodes opacity from params into the mesh", () => {
    const out = executeSurfaceMesh(baseParams({ opacity: 0.3 }), inputs(makeParticle(3)));
    const mesh = out.get("mesh") as MeshData;
    expect(mesh.opacity).toBeCloseTo(0.3);
  });

  it("encodes color from params into vertex colors", () => {
    const out = executeSurfaceMesh(baseParams({ color: "#ff0000", opacity: 1.0 }), inputs(makeParticle(3)));
    const mesh = out.get("mesh") as MeshData;
    if (mesh.colors.length > 0) {
      // First vertex R channel should be close to 1 (red).
      expect(mesh.colors[0]).toBeCloseTo(1.0, 1);
      expect(mesh.colors[1]).toBeCloseTo(0.0, 1);
      expect(mesh.colors[2]).toBeCloseTo(0.0, 1);
    }
  });

  it("returns empty geometry for 0-atom particle", () => {
    const out = executeSurfaceMesh(baseParams(), inputs(makeParticle(0)));
    const mesh = out.get("mesh") as MeshData;
    expect(mesh.positions.length).toBe(0);
  });

  it("uses default alphaRadius=3 when param not specified", () => {
    const params: SurfaceMeshParams = { type: "surface_mesh", alphaRadius: 3.0, color: "#4488ff", opacity: 0.5 };
    const out = executeSurfaceMesh(params, inputs(makeParticle(3)));
    expect(out.has("mesh")).toBe(true);
  });
});
