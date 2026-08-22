import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { executeDrawingBoundary } from "@/pipeline/executors/drawingBoundary";
import { executeCoordinationGenerator } from "@/pipeline/executors/coordinationGenerator";
import { executePolyhedronGenerator } from "@/pipeline/executors/polyhedronGenerator";
import type {
  BondData,
  CoordinationData,
  MeshData,
  ParticleData,
  PipelineData,
} from "@/pipeline/types";
import type { Snapshot } from "@/types";

function readExtendedXyz(path: string): Snapshot {
  const lines = readFileSync(path, "utf8").trim().split(/\r?\n/);
  const nAtoms = Number(lines[0]);
  const lattice = lines[1]
    .match(/Lattice="([^"]+)"/)?.[1]
    .split(/\s+/)
    .map(Number);
  if (!lattice || lattice.length !== 9) throw new Error("Missing XYZ lattice");
  const positions = new Float32Array(nAtoms * 3);
  const elements = new Uint8Array(nAtoms);
  for (let atom = 0; atom < nAtoms; atom++) {
    const [symbol, x, y, z] = lines[atom + 2].trim().split(/\s+/);
    elements[atom] = symbol === "Al" ? 13 : symbol === "O" ? 8 : 0;
    positions.set([Number(x), Number(y), Number(z)], atom * 3);
  }
  return {
    nAtoms,
    nBonds: 0,
    nFileBonds: 0,
    positions,
    elements,
    bonds: new Uint32Array(),
    bondOrders: null,
    box: new Float32Array(lattice),
    boxOrigin: null,
    atomChainIds: null,
    atomBFactors: null,
  };
}

describe("alpha-Al2O3 drawing-boundary pipeline integration", () => {
  it("keeps structure atoms stable while copies, coordination, and meshes compose", async () => {
    const path = resolve(process.cwd(), "tests/fixtures/alpha_al2o3_aflow.xyz");
    const snapshot = readExtendedXyz(path);
    const particle: ParticleData = {
      type: "particle",
      source: snapshot,
      sourceNodeId: "alpha",
      indices: null,
      scaleOverrides: null,
      opacityOverrides: null,
      colorOverrides: null,
      representationOverride: null,
    };

    const boundaryParticle = executeDrawingBoundary(
      {
        type: "drawing_boundary",
        xMin: 0,
        xMax: 1,
        yMin: 0,
        yMax: 1,
        zMin: 0,
        zMax: 1,
      },
      new Map<string, PipelineData[]>([["particle", [particle]]]),
    ).get("particle") as ParticleData;
    const coordinationResult = executeCoordinationGenerator(
      {
        type: "coordination_generator",
        excludedCenters: [],
        excludedLigands: [],
        cutoffTolerance: 1.15,
        boundaryMode: "complete",
      },
      new Map<string, PipelineData[]>([["particle", [boundaryParticle]]]),
    );
    const coordination = coordinationResult.get("coordination") as CoordinationData;
    const bonds = coordinationResult.get("bond") as BondData;
    const mesh = executePolyhedronGenerator(
      {
        type: "polyhedron_generator",
        opacity: 0.2,
        showEdges: true,
        edgeColor: "#d6dce5",
        edgeWidth: 2,
      },
      new Map<string, PipelineData[]>([["coordination", [coordination]]]),
    ).get("mesh") as MeshData;

    expect(particle.source.nAtoms).toBe(30);
    expect(boundaryParticle.source).toBe(particle.source);
    expect(boundaryParticle.drawingBoundary?.images.sourceIndices.length).toBe(16);
    expect(coordination.nBonds).toBe(144);
    expect(bonds.nBonds).toBe(144);
    expect(coordination.outsideBoundaryImages?.sourceIndices.length).toBeGreaterThan(0);
    expect(bonds.periodicImages).toBe(coordination.outsideBoundaryImages);
    const centers = new Set<number>();
    for (let pair = 0; pair < coordination.nBonds; pair++) {
      centers.add(coordination.bondIndices[pair * 2]);
    }
    expect(centers.size).toBe(24);
    expect(mesh.indices.length).toBe(24 * 24); // 24 AlO6 octahedra × 8 triangular faces
  });
});
