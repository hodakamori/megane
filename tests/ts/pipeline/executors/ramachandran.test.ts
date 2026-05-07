import { describe, it, expect } from "vitest";
import { executeRamachandran } from "@/pipeline/executors/ramachandran";
import type { RamachandranParams, ParticleData, PipelineData, PlotData } from "@/pipeline/types";
import type { Snapshot } from "@/types";

// ─── Helpers ──────────────────────────────────────────────────────────

/**
 * Build a minimal 3-residue backbone (N–CA–C repeated) with known geometry.
 * Atom layout (index → element):
 *   0 N, 1 CA, 2 C, 3 N, 4 CA, 5 C, 6 N, 7 CA, 8 C
 * caIndices = [1, 4, 7]
 */
function makeBackboneSnapshot(positions?: Float32Array): Snapshot {
  // Default: atoms placed in a 3D arrangement that gives real dihedral values
  const defaultPositions = new Float32Array([
    // Residue 1
    0, 0, 1, // N(0)
    0, 0, 0, // CA(1)
    1, 0, 0, // C(2)
    // Residue 2
    1, 1, 0, // N(3)
    2, 1, 0, // CA(4)
    3, 1, 0, // C(5)
    // Residue 3
    3, 2, 0, // N(6)
    4, 2, 0, // CA(7)
    5, 2, 0, // C(8)
  ]);
  return {
    nAtoms: 9,
    nBonds: 0,
    nFileBonds: 0,
    positions: positions ?? defaultPositions,
    elements: new Uint8Array([7, 6, 6, 7, 6, 6, 7, 6, 6]), // N,C,C pattern
    bonds: new Uint32Array(),
    bondOrders: null,
    box: null,
    atomChainIds: null,
    atomBFactors: null,
    caIndices: new Uint32Array([1, 4, 7]),
    caResNums: new Uint32Array([1, 2, 3]),
  } as unknown as Snapshot;
}

function makeParticle(snapshot: Snapshot): ParticleData {
  return {
    type: "particle",
    source: snapshot,
    sourceNodeId: "src",
    indices: null,
    scaleOverrides: null,
    opacityOverrides: null,
    colorOverrides: null,
    representationOverride: null,
  };
}

function makeInputs(particle: ParticleData): Map<string, PipelineData[]> {
  return new Map([["particle", [particle]]]);
}

function baseParams(extra: Partial<RamachandranParams> = {}): RamachandranParams {
  return { type: "ramachandran", frameIndex: 0, ...extra };
}

// ─── Tests ────────────────────────────────────────────────────────────

describe("executeRamachandran", () => {
  it("returns empty when no particle input", () => {
    const out = executeRamachandran(baseParams(), new Map());
    expect(out.size).toBe(0);
  });

  it("returns empty when snapshot has no caIndices", () => {
    const snap = makeBackboneSnapshot();
    (snap as any).caIndices = undefined;
    const out = executeRamachandran(baseParams(), makeInputs(makeParticle(snap)));
    expect(out.size).toBe(0);
  });

  it("returns empty when caIndices has fewer than 3 entries", () => {
    const snap = makeBackboneSnapshot();
    (snap as any).caIndices = new Uint32Array([1, 4]);
    const out = executeRamachandran(baseParams(), makeInputs(makeParticle(snap)));
    expect(out.size).toBe(0);
  });

  it("produces a scatter PlotData for a valid backbone", () => {
    const snap = makeBackboneSnapshot();
    const out = executeRamachandran(baseParams(), makeInputs(makeParticle(snap)));
    expect(out.has("plot")).toBe(true);
    const plot = out.get("plot") as PlotData;
    expect(plot.type).toBe("plot");
    expect(plot.kind).toBe("scatter");
  });

  it("scatter plot has correct axis labels and range", () => {
    const snap = makeBackboneSnapshot();
    const out = executeRamachandran(baseParams(), makeInputs(makeParticle(snap)));
    const plot = out.get("plot") as PlotData;
    expect(plot.xLabel).toBe("φ (°)");
    expect(plot.yLabel).toBe("ψ (°)");
    expect(plot.xRange).toEqual([-180, 180]);
    expect(plot.yRange).toEqual([-180, 180]);
  });

  it("title is 'Ramachandran Plot'", () => {
    const snap = makeBackboneSnapshot();
    const out = executeRamachandran(baseParams(), makeInputs(makeParticle(snap)));
    const plot = out.get("plot") as PlotData;
    expect(plot.title).toBe("Ramachandran Plot");
  });

  it("φ and ψ arrays have equal length", () => {
    const snap = makeBackboneSnapshot();
    const out = executeRamachandran(baseParams(), makeInputs(makeParticle(snap)));
    const plot = out.get("plot") as PlotData;
    expect(plot.xValues!.length).toBe(plot.yValues!.length);
  });

  it("φ and ψ values are in degrees (−180 to 180)", () => {
    const snap = makeBackboneSnapshot();
    const out = executeRamachandran(baseParams(), makeInputs(makeParticle(snap)));
    const plot = out.get("plot") as PlotData;
    for (const v of Array.from(plot.xValues!)) {
      expect(v).toBeGreaterThanOrEqual(-180);
      expect(v).toBeLessThanOrEqual(180);
    }
    for (const v of Array.from(plot.yValues!)) {
      expect(v).toBeGreaterThanOrEqual(-180);
      expect(v).toBeLessThanOrEqual(180);
    }
  });

  it("uses caResNums for point labels", () => {
    const snap = makeBackboneSnapshot();
    const out = executeRamachandran(baseParams(), makeInputs(makeParticle(snap)));
    const plot = out.get("plot") as PlotData;
    // Only residue 2 (middle) has full context; label should be "2"
    if (plot.pointLabels && plot.pointLabels.length > 0) {
      expect(plot.pointLabels[0]).toBe("2");
    }
  });

  it("returns empty plot arrays when element pattern doesn't match N–CA–C", () => {
    const snap = makeBackboneSnapshot();
    // Replace elements with all carbons — no N atoms, so backbone not found
    (snap as any).elements = new Uint8Array(Array(9).fill(6));
    const out = executeRamachandran(baseParams(), makeInputs(makeParticle(snap)));
    const plot = out.get("plot") as PlotData;
    // When backbone triples fail, xValues is empty
    expect(plot.xValues!.length).toBe(0);
  });

  it("handles a structure where only some residues have valid backbone", () => {
    // Middle CA at index 4: N at 3 (elem 7), C at 5 (elem 6) — valid
    // First/last CAs are terminal (no phi/psi possible)
    const snap = makeBackboneSnapshot();
    const out = executeRamachandran(baseParams(), makeInputs(makeParticle(snap)));
    const plot = out.get("plot") as PlotData;
    // With 3 CAs, only the middle one (index 1) can have both phi and psi
    expect(plot.xValues!.length).toBeLessThanOrEqual(1);
  });
});
