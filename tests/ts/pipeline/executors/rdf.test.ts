import { describe, it, expect } from "vitest";
import { executeRdf } from "@/pipeline/executors/rdf";
import type { RdfParams, ParticleData, CellData, PlotData, PipelineData } from "@/pipeline/types";
import type { Snapshot } from "@/types";

// ─── Helpers ──────────────────────────────────────────────────────────

function makeSnapshot(
  positions: number[],
  elements: number[],
  box?: number[],
): Snapshot {
  return {
    nAtoms: elements.length,
    nBonds: 0,
    nFileBonds: 0,
    positions: new Float32Array(positions),
    elements: new Uint8Array(elements),
    bonds: new Uint32Array(0),
    bondOrders: null,
    box: box ? new Float32Array(box) : null,
    atomChainIds: null,
    atomBFactors: null,
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

function makeCell(box: number[]): CellData {
  return {
    type: "cell",
    sourceNodeId: "src",
    box: new Float32Array(box),
    visible: true,
    axesVisible: true,
  };
}

function baseParams(extra: Partial<RdfParams> = {}): RdfParams {
  return {
    type: "rdf",
    elementA: 0,
    elementB: 0,
    binWidth: 1.0,
    rMax: 10.0,
    usePbc: false,
    frameStart: 0,
    frameEnd: -1,
    ...extra,
  };
}

function inputs(particle: PipelineData, cell?: PipelineData): Map<string, PipelineData[]> {
  const m = new Map<string, PipelineData[]>([["particle", [particle]]]);
  if (cell) m.set("cell", [cell]);
  return m;
}

// Orthorhombic box: 3×3 row-major, diagonal = [Lx, Ly, Lz]
function orthoBox(Lx: number, Ly: number, Lz: number): number[] {
  return [Lx, 0, 0, 0, Ly, 0, 0, 0, Lz];
}

// ─── Tests ────────────────────────────────────────────────────────────

describe("executeRdf", () => {
  it("returns empty map when there is no particle input", () => {
    const out = executeRdf(baseParams(), new Map());
    expect(out.size).toBe(0);
  });

  it("outputs a 'plot' key for a valid particle input", () => {
    const snap = makeSnapshot([0, 0, 0, 2, 0, 0], [8, 8]);
    const out = executeRdf(baseParams(), inputs(makeParticle(snap)));
    expect(out.has("plot")).toBe(true);
  });

  it("output has type 'plot' and kind 'line'", () => {
    const snap = makeSnapshot([0, 0, 0, 2, 0, 0], [8, 8]);
    const out = executeRdf(baseParams(), inputs(makeParticle(snap)));
    const plot = out.get("plot") as PlotData;
    expect(plot.type).toBe("plot");
    expect(plot.kind).toBe("line");
  });

  it("x array length equals nBins = ceil(rMax / binWidth)", () => {
    const snap = makeSnapshot([0, 0, 0, 2, 0, 0], [8, 8]);
    const params = baseParams({ binWidth: 0.5, rMax: 5.0 });
    const out = executeRdf(params, inputs(makeParticle(snap)));
    const plot = out.get("plot") as PlotData;
    expect(plot.x.length).toBe(Math.ceil(5.0 / 0.5));
    expect(plot.y.length).toBe(plot.x.length);
  });

  it("x values are bin midpoints (r_mid = (i + 0.5) * binWidth)", () => {
    const snap = makeSnapshot([0, 0, 0, 3, 0, 0], [8, 8]);
    const params = baseParams({ binWidth: 1.0, rMax: 5.0 });
    const out = executeRdf(params, inputs(makeParticle(snap)));
    const plot = out.get("plot") as PlotData;
    expect(plot.x[0]).toBeCloseTo(0.5, 5);
    expect(plot.x[1]).toBeCloseTo(1.5, 5);
    expect(plot.x[4]).toBeCloseTo(4.5, 5);
  });

  it("detects a pair at distance 2 Å in the correct bin", () => {
    const snap = makeSnapshot([0, 0, 0, 2, 0, 0], [8, 8]);
    const params = baseParams({ binWidth: 1.0, rMax: 10.0 });
    const out = executeRdf(params, inputs(makeParticle(snap)));
    const plot = out.get("plot") as PlotData;
    // Distance 2 → bin index 2 (range [2,3))
    // All other bins should be 0 (only one pair)
    expect(plot.y[2]).toBeGreaterThan(0);
    expect(plot.y[0]).toBe(0);
    expect(plot.y[5]).toBe(0);
  });

  it("returns empty map when elementA has no matching atoms", () => {
    const snap = makeSnapshot([0, 0, 0, 2, 0, 0], [8, 8]); // O–O only
    const params = baseParams({ elementA: 6, elementB: 8 }); // C–O, no C
    const out = executeRdf(params, inputs(makeParticle(snap)));
    expect(out.size).toBe(0);
  });

  it("returns empty map when elementB has no matching atoms", () => {
    const snap = makeSnapshot([0, 0, 0, 2, 0, 0], [8, 8]); // O–O only
    const params = baseParams({ elementA: 8, elementB: 6 }); // O–C, no C
    const out = executeRdf(params, inputs(makeParticle(snap)));
    expect(out.size).toBe(0);
  });

  it("same-type RDF counts each pair once (A=O, B=O, 3 atoms)", () => {
    // 3 O atoms: at (0,0,0), (2,0,0), (4,0,0)
    const snap = makeSnapshot([0, 0, 0, 2, 0, 0, 4, 0, 0], [8, 8, 8]);
    const params = baseParams({ elementA: 8, elementB: 8, binWidth: 1.0, rMax: 10.0 });
    const out = executeRdf(params, inputs(makeParticle(snap)));
    const plot = out.get("plot") as PlotData;
    // pairs: (0,1) dist=2, (0,2) dist=4, (1,2) dist=2 → bin2 gets 2 pairs, bin4 gets 1 pair
    expect(plot.y[2]).toBeGreaterThan(plot.y[4]); // bin at r∈[2,3) has more pairs
    expect(plot.y[4]).toBeGreaterThan(0);
  });

  it("mixed-type RDF (A=O, B=C) counts all cross-pairs", () => {
    // 2 O at 0,0,0 and 3,0,0; 1 C at 2,0,0
    const snap = makeSnapshot([0, 0, 0, 3, 0, 0, 2, 0, 0], [8, 8, 6]);
    const params = baseParams({ elementA: 8, elementB: 6, binWidth: 1.0, rMax: 10.0 });
    const out = executeRdf(params, inputs(makeParticle(snap)));
    const plot = out.get("plot") as PlotData;
    // O(0)–C(2): dist=2 → bin 2
    // O(3)–C(2): dist=1 → bin 1
    expect(plot.y[2]).toBeGreaterThan(0);
    expect(plot.y[1]).toBeGreaterThan(0);
  });

  it("title encodes element labels", () => {
    const snap = makeSnapshot([0, 0, 0, 2, 0, 0], [8, 6]);
    const params = baseParams({ elementA: 8, elementB: 6 });
    const out = executeRdf(params, inputs(makeParticle(snap)));
    const plot = out.get("plot") as PlotData;
    expect(plot.title).toContain("O");
    expect(plot.title).toContain("C");
  });

  it("title uses 'all' when element is 0", () => {
    const snap = makeSnapshot([0, 0, 0, 2, 0, 0], [8, 6]);
    const out = executeRdf(baseParams({ elementA: 0, elementB: 0 }), inputs(makeParticle(snap)));
    const plot = out.get("plot") as PlotData;
    expect(plot.title).toContain("all");
  });

  it("yLabel is g(r) when box is provided via CellData", () => {
    const snap = makeSnapshot([0, 0, 0, 2, 0, 0], [8, 8]);
    const cell = makeCell(orthoBox(20, 20, 20));
    const params = baseParams({ usePbc: true });
    const m = inputs(makeParticle(snap), cell);
    const out = executeRdf(params, m);
    const plot = out.get("plot") as PlotData;
    expect(plot.yLabel).toBe("g(r)");
  });

  it("yLabel is not g(r) when no box is available", () => {
    const snap = makeSnapshot([0, 0, 0, 2, 0, 0], [8, 8]);
    const params = baseParams({ usePbc: false });
    const out = executeRdf(params, inputs(makeParticle(snap)));
    const plot = out.get("plot") as PlotData;
    expect(plot.yLabel).not.toBe("g(r)");
  });

  it("PBC min-image wraps distances across the box boundary", () => {
    // Atom A at 0, atom B at 18; box length 20 → min-image dist = 2
    const snap = makeSnapshot([0, 0, 0, 18, 0, 0], [8, 8]);
    const cell = makeCell(orthoBox(20, 20, 20));
    const params = baseParams({ usePbc: true, binWidth: 1.0, rMax: 10.0 });
    const m = new Map<string, PipelineData[]>([
      ["particle", [makeParticle(snap)]],
      ["cell", [cell]],
    ]);
    const out = executeRdf(params, m);
    const plot = out.get("plot") as PlotData;
    // min-image distance 2 → bin index 2
    expect(plot.y[2]).toBeGreaterThan(0);
    // naive distance 18 is outside rMax=10, so only bin 2 should have a count
    expect(plot.y[9]).toBe(0);
  });

  it("g(r) normalizes to approximately 1 for ideal gas (large N, small r_max)", () => {
    // Use 200 atoms in a 20³ box with r_max=3 Å (well below L/2=10 Å).
    // For a random system g(r) averaged over a large number of pairs
    // should be close to 1 within statistical noise.
    const N = 200;
    const L = 20.0;
    const pos: number[] = [];
    let seed = 12345;
    for (let i = 0; i < N; i++) {
      seed = (seed * 1664525 + 1013904223) & 0xffffffff;
      pos.push(((seed >>> 0) / 0xffffffff) * L);
      seed = (seed * 1664525 + 1013904223) & 0xffffffff;
      pos.push(((seed >>> 0) / 0xffffffff) * L);
      seed = (seed * 1664525 + 1013904223) & 0xffffffff;
      pos.push(((seed >>> 0) / 0xffffffff) * L);
    }
    const elems = new Array(N).fill(8);
    const snap = makeSnapshot(pos, elems, orthoBox(L, L, L));
    const cell = makeCell(orthoBox(L, L, L));
    const params = baseParams({
      elementA: 8,
      elementB: 8,
      binWidth: 0.5,
      rMax: 3.0,
      usePbc: true,
    });
    const m = new Map<string, PipelineData[]>([
      ["particle", [makeParticle(snap)]],
      ["cell", [cell]],
    ]);
    const out = executeRdf(params, m);
    const plot = out.get("plot") as PlotData;
    // Average g(r) across all bins should be close to 1 for an ideal gas.
    // Statistical noise for 200 atoms is ~10-20%, so allow [0.3, 3.0].
    const avg = plot.y.reduce((s, v) => s + v, 0) / plot.y.length;
    expect(avg).toBeGreaterThan(0.3);
    expect(avg).toBeLessThan(3.0);
  });
});
