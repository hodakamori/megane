import { describe, expect, it } from "vitest";
import { generateDrawingBoundaryImages } from "@/logic/cellBoundaryImages";
import { executeCoordinationGenerator } from "@/pipeline/executors/coordinationGenerator";
import { executePolyhedronGenerator } from "@/pipeline/executors/polyhedronGenerator";
import type {
  BondData,
  CoordinationData,
  CoordinationGeneratorParams,
  MeshData,
  ParticleData,
  PipelineData,
  PolyhedronGeneratorParams,
} from "@/pipeline/types";
import type { Snapshot } from "@/types";

function makeSnapshot(elements: number[], positions: number[], box?: Float32Array): Snapshot {
  return {
    nAtoms: elements.length,
    nBonds: 0,
    nFileBonds: 0,
    positions: new Float32Array(positions),
    elements: new Uint8Array(elements),
    bonds: new Uint32Array(),
    bondOrders: null,
    box: box ?? null,
    boxOrigin: null,
    atomChainIds: null,
    atomBFactors: null,
  };
}

function makeParticle(elements: number[], positions: number[], box?: Float32Array): ParticleData {
  return {
    type: "particle",
    source: makeSnapshot(elements, positions, box),
    sourceNodeId: "src",
    indices: null,
    scaleOverrides: null,
    opacityOverrides: null,
    colorOverrides: null,
    representationOverride: null,
  };
}

function coordinationParams(
  extra: Partial<CoordinationGeneratorParams> = {},
): CoordinationGeneratorParams {
  return {
    type: "coordination_generator",
    excludedCenters: [],
    excludedLigands: [],
    cutoffTolerance: 1.15,
    boundaryMode: "complete",
    ...extra,
  };
}

function polyhedronParams(
  extra: Partial<PolyhedronGeneratorParams> = {},
): PolyhedronGeneratorParams {
  return {
    type: "polyhedron_generator",
    opacity: 0.5,
    showEdges: false,
    edgeColor: "#dddddd",
    edgeWidth: 3,
    ...extra,
  };
}

function coordinate(
  particle: ParticleData,
  params = coordinationParams(),
): Map<string, PipelineData> {
  return executeCoordinationGenerator(params, new Map([["particle", [particle]]]));
}

function polyhedra(coordination: CoordinationData): Map<string, PipelineData> {
  return executePolyhedronGenerator(
    polyhedronParams(),
    new Map([["coordination", [coordination]]]),
  );
}

/** Idealized TiO6 octahedron with 2 Å Ti-O distances. */
function tio6(): ParticleData {
  return makeParticle(
    [22, 8, 8, 8, 8, 8, 8],
    [0, 0, 0, 2, 0, 0, -2, 0, 0, 0, 2, 0, 0, -2, 0, 0, 0, 2, 0, 0, -2],
  );
}

describe("Coordination -> Polyhedra responsibility split", () => {
  it("requires coordination input; Polyhedra never searches particles itself", () => {
    expect(executePolyhedronGenerator(polyhedronParams(), new Map()).size).toBe(0);
    expect(
      executePolyhedronGenerator(polyhedronParams(), new Map([["particle", [tio6()]]])).size,
    ).toBe(0);
  });

  it("auto-detects center-neighbor pairs in Coordination and only builds the hull in Polyhedra", () => {
    const coordination = coordinate(tio6()).get("coordination") as CoordinationData;
    const mesh = polyhedra(coordination).get("mesh") as MeshData;
    expect(coordination.nBonds).toBe(6);
    expect(mesh.indices.length).toBeGreaterThan(0);
  });

  it("never treats H, noble gases, or carbon as default neighbor atoms", () => {
    const positions: number[] = [0, 0, 0];
    const elements: number[] = [22];
    let offset = 0;
    for (const z of [1, 18, 6]) {
      for (let k = 0; k < 4; k++) {
        const angle = (k / 4) * Math.PI * 2;
        positions.push(Math.cos(angle) * 2, Math.sin(angle) * 2, offset * 0.5);
        elements.push(z);
        offset++;
      }
    }
    expect(coordinate(makeParticle(elements, positions)).size).toBe(0);
  });

  it("owns element exclusions and cutoff tolerance in Coordination", () => {
    expect(coordinate(tio6(), coordinationParams({ excludedCenters: [22] })).size).toBe(0);
    expect(coordinate(tio6(), coordinationParams({ excludedLigands: [8] })).size).toBe(0);
    expect(coordinate(tio6(), coordinationParams({ cutoffTolerance: 0.7 })).size).toBe(0);
  });

  it("does not build a polyhedron with fewer than four coordinated neighbor sites", () => {
    const coordination = coordinate(
      makeParticle([22, 8, 8, 8], [0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 2]),
    ).get("coordination") as CoordinationData;
    expect(coordination.nBonds).toBe(3);
    expect(polyhedra(coordination).size).toBe(0);
  });

  it("applies minimum-image PBC in Coordination, not Polyhedra", () => {
    const box = new Float32Array([4, 0, 0, 0, 4, 0, 0, 0, 4]);
    const particle = makeParticle(
      [22, 8, 8, 8, 8, 8, 8],
      [2, 2, 2, 0.5, 2, 2, 3.5, 2, 2, 2, 0.5, 2, 2, 3.5, 2, 2, 2, 0.5, 2, 2, 3.5],
      box,
    );
    const coordination = coordinate(particle).get("coordination") as CoordinationData;
    expect(coordination.nBonds).toBe(6);
    expect(polyhedra(coordination).has("mesh")).toBe(true);
  });

  it("completes visible centers on the coordination/bond stream without Polyhedra", () => {
    const box = new Float32Array([4, 0, 0, 0, 4, 0, 0, 0, 4]);
    const particle = makeParticle(
      [22, 8, 8, 8, 8, 8, 8],
      [0.25, 2, 2, 3.75, 2, 2, 1.75, 2, 2, 0.25, 0.5, 2, 0.25, 3.5, 2, 0.25, 2, 0.5, 0.25, 2, 3.5],
      box,
    );
    particle.drawingBoundary = generateDrawingBoundaryImages(particle.source);

    const result = coordinate(particle);
    const coordination = result.get("coordination") as CoordinationData;
    const bonds = result.get("bond") as BondData;
    expect(coordination.outsideBoundaryImages?.elements).toEqual(new Uint8Array([8]));
    expect(Array.from(coordination.outsideBoundaryImages!.positions)).toEqual([-0.25, 2, 2]);
    expect(Array.from(coordination.outsideBoundaryImages!.sourceIndices)).toEqual([1]);
    expect(bonds.periodicImages).toBe(coordination.outsideBoundaryImages);
    expect(bonds.nBonds).toBe(6);
    // This assertion intentionally does not execute Polyhedra: completing
    // outside-boundary neighbors is an independently renderable result.
  });

  it("builds polyhedra for center copies supplied by Drawing Boundary", () => {
    const box = new Float32Array([10, 0, 0, 0, 10, 0, 0, 0, 10]);
    const particle = makeParticle(
      [22, 8, 8, 8, 8, 8, 8],
      [0, 0, 0, 2, 0, 0, 8, 0, 0, 0, 2, 0, 0, 8, 0, 0, 0, 2, 0, 0, 8],
      box,
    );
    particle.drawingBoundary = generateDrawingBoundaryImages(particle.source);
    const coordination = coordinate(particle).get("coordination") as CoordinationData;
    const mesh = polyhedra(coordination).get("mesh") as MeshData;
    expect(coordination.nBonds).toBe(8 * 6);
    expect(Array.from(coordination.elements).filter((z) => z === 22)).toHaveLength(8);
    expect(mesh.indices.length).toBe(8 * 24);
  });

  it("the inside policy searches only the Drawing Boundary atom collection", () => {
    const box = new Float32Array([4, 0, 0, 0, 4, 0, 0, 0, 4]);
    const particle = makeParticle(
      [22, 8, 8, 8, 8, 8, 8],
      [0.25, 2, 2, 3.75, 2, 2, 1.75, 2, 2, 0.25, 0.5, 2, 0.25, 3.5, 2, 0.25, 2, 0.5, 0.25, 2, 3.5],
      box,
    );
    particle.drawingBoundary = generateDrawingBoundaryImages(particle.source);
    const result = coordinate(particle, coordinationParams({ boundaryMode: "inside" }));
    const coordination = result.get("coordination") as CoordinationData;
    const bonds = result.get("bond") as BondData;
    expect(coordination.outsideBoundaryImages).toBeNull();
    expect(bonds.periodicImages).toBeNull();
    expect(coordination.nBonds).toBe(5);
  });
});
