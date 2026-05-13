import { describe, it, expect } from "vitest";
import { executePolyhedronGenerator } from "@/pipeline/executors/polyhedronGenerator";
import type {
  PolyhedronGeneratorParams,
  ParticleData,
  PipelineData,
  MeshData,
} from "@/pipeline/types";
import type { Snapshot } from "@/types";

function makeSnapshot(elements: number[], positions: number[], box?: Float32Array): Snapshot {
  return {
    nAtoms: elements.length,
    nBonds: 0,
    nFileBonds: 0,
    positions: new Float32Array(positions),
    elements: new Uint8Array(elements),
    bonds: new Uint32Array(0),
    bondOrders: null,
    box: box ?? null,
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

function baseParams(extra: Partial<PolyhedronGeneratorParams> = {}): PolyhedronGeneratorParams {
  return {
    type: "polyhedron_generator",
    excludedCenters: [],
    excludedLigands: [],
    cutoffTolerance: 1.15,
    opacity: 0.5,
    showEdges: false,
    edgeColor: "#dddddd",
    edgeWidth: 3,
    ...extra,
  };
}

function inputs(particle: ParticleData): Map<string, PipelineData[]> {
  return new Map([["particle", [particle]]]);
}

/**
 * One Ti at origin surrounded by six O atoms at +/-2 Å along each axis (an
 * idealised TiO6 octahedron). Ti–O = 2.0 Å sits inside the default
 * (r_cov(Ti) + r_cov(O)) * 1.15 ≈ 2.6 Å cutoff but outside the 0.7-tolerance
 * cutoff of ≈ 1.58 Å.
 */
function tio6() {
  const elements = [22, 8, 8, 8, 8, 8, 8];
  const positions = [
    0, 0, 0, // Ti
    2, 0, 0, // O
    -2, 0, 0, // O
    0, 2, 0, // O
    0, -2, 0, // O
    0, 0, 2, // O
    0, 0, -2, // O
  ];
  return makeParticle(elements, positions);
}

describe("executePolyhedronGenerator (VESTA-style auto-detect)", () => {
  it("returns no output when no particle input is provided", () => {
    const out = executePolyhedronGenerator(baseParams(), new Map());
    expect(out.size).toBe(0);
  });

  it("auto-detects metal centers and anion-former ligands", () => {
    const out = executePolyhedronGenerator(baseParams(), inputs(tio6()));
    const mesh = out.get("mesh") as MeshData | undefined;
    expect(mesh).toBeDefined();
    expect(mesh!.indices.length).toBeGreaterThan(0);
  });

  it("never treats H, noble gases, or carbon as ligand candidates", () => {
    // Ti center, surrounded by 4 H + 4 Ar + 4 C only — nothing should qualify
    // as a default ligand, so no polyhedron is generated.
    const positions: number[] = [0, 0, 0];
    const elements: number[] = [22];
    const decoys = [1, 18, 6];
    let i = 0;
    for (const z of decoys) {
      for (let k = 0; k < 4; k++) {
        const angle = (k / 4) * Math.PI * 2;
        positions.push(Math.cos(angle) * 2.0, Math.sin(angle) * 2.0, i * 0.5);
        elements.push(z);
        i++;
      }
    }
    const out = executePolyhedronGenerator(baseParams(), inputs(makeParticle(elements, positions)));
    expect(out.size).toBe(0);
  });

  it("excludes a center when its Z is in excludedCenters", () => {
    const out = executePolyhedronGenerator(
      baseParams({ excludedCenters: [22] }),
      inputs(tio6()),
    );
    expect(out.size).toBe(0);
  });

  it("excludes a ligand when its Z is in excludedLigands", () => {
    const out = executePolyhedronGenerator(
      baseParams({ excludedLigands: [8] }),
      inputs(tio6()),
    );
    expect(out.size).toBe(0);
  });

  it("respects covalent-radius × tolerance cutoff (tightening to 0.7 drops all neighbours)", () => {
    const out = executePolyhedronGenerator(
      baseParams({ cutoffTolerance: 0.7 }),
      inputs(tio6()),
    );
    // 0.7 × (1.6 + 0.66) = 1.58 Å, but Ti–O is 2.0 Å, so no ligand qualifies.
    expect(out.size).toBe(0);
  });

  it("generates no polyhedron when fewer than 4 ligands are within range", () => {
    // Same Ti, but only three O atoms in plane.
    const elements = [22, 8, 8, 8];
    const positions = [
      0, 0, 0,
      2, 0, 0,
      0, 2, 0,
      0, 0, 2,
    ];
    const out = executePolyhedronGenerator(
      baseParams(),
      inputs(makeParticle(elements, positions)),
    );
    expect(out.size).toBe(0);
  });

  it("applies minimum-image PBC when a unit cell is supplied", () => {
    // 4 Å cubic cell, Ti in the middle, six O atoms wrapped through the
    // boundary. Without minimum-image they sit ~3.5 Å away (outside cutoff
    // for many pairs); with PBC they collapse back to ~2 Å.
    const box = new Float32Array([4, 0, 0, 0, 4, 0, 0, 0, 4]);
    const elements = [22, 8, 8, 8, 8, 8, 8];
    const positions = [
      2, 2, 2, // Ti at cell centre
      0.5, 2, 2, // O at -1.5 Å under PBC = wraps to 2.5 Å on the other side
      3.5, 2, 2,
      2, 0.5, 2,
      2, 3.5, 2,
      2, 2, 0.5,
      2, 2, 3.5,
    ];
    const out = executePolyhedronGenerator(
      baseParams(),
      inputs(makeParticle(elements, positions, box)),
    );
    expect(out.size).toBe(1);
  });
});
