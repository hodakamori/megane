import { describe, it, expect } from "vitest";
import { executePipeline } from "@/pipeline/execute";
import type { PipelineNodeData } from "@/pipeline/execute";
import type { Node, Edge } from "@xyflow/react";
import type { Snapshot, Frame, TrajectoryMeta } from "@/types";
import type { ParticleData, BondData, ViewportState } from "@/pipeline/types";

// ─── Helpers ─────────────────────────────────────────────────────────

function makeSnapshot(opts: {
  nAtoms: number;
  positions: number[];
  elements: number[];
  bonds?: number[];
  bondOrders?: number[];
  box?: number[];
}): Snapshot {
  const nBonds = (opts.bonds?.length ?? 0) / 2;
  return {
    nAtoms: opts.nAtoms,
    nBonds,
    nFileBonds: nBonds,
    positions: new Float32Array(opts.positions),
    elements: new Uint8Array(opts.elements),
    bonds: new Uint32Array(opts.bonds ?? []),
    bondOrders: opts.bondOrders ? new Uint8Array(opts.bondOrders) : null,
    box: opts.box ? new Float32Array(opts.box) : null,
  };
}

function makeNode(
  id: string,
  type: string,
  params: Record<string, unknown>,
  enabled = true,
): Node<PipelineNodeData> {
  return {
    id,
    type,
    position: { x: 0, y: 0 },
    data: {
      params: { type, ...params } as any,
      enabled,
    },
  };
}

function makeEdge(
  source: string,
  sourceHandle: string,
  target: string,
  targetHandle: string,
): Edge {
  return {
    id: `e-${source}-${sourceHandle}-${target}-${targetHandle}`,
    source,
    target,
    sourceHandle,
    targetHandle,
  };
}

// Water molecule: O at origin, H nearby
const waterSnapshot = makeSnapshot({
  nAtoms: 3,
  positions: [0, 0, 0, 0.96, 0, 0, -0.96, 0, 0],
  elements: [8, 1, 1],
  bonds: [0, 1, 0, 2],
  bondOrders: [1, 1],
});

// 5-atom system: C, N, O, H, H at x = 0,1,2,3,4
const fiveAtomSnapshot = makeSnapshot({
  nAtoms: 5,
  positions: [0, 0, 0, 1, 0, 0, 2, 0, 0, 3, 0, 0, 4, 0, 0],
  elements: [6, 7, 8, 1, 1],
});

// ─── Tests ───────────────────────────────────────────────────────────

describe("executePipeline", () => {
  describe("LoadStructure node", () => {
    it("produces particle output from snapshot", () => {
      const nodes = [
        makeNode("ls", "load_structure", { fileName: null, hasTrajectory: false, hasCell: false }),
        makeNode("vp", "viewport", { perspective: false, cellAxesVisible: true }),
      ];
      const edges = [makeEdge("ls", "particle", "vp", "particle")];

      const result = executePipeline(nodes, edges, { snapshot: waterSnapshot });
      expect(result.particles).toHaveLength(1);
      expect(result.particles[0].source).toBe(waterSnapshot);
      expect(result.particles[0].indices).toBeNull();
    });

    it("produces cell output when box is present", () => {
      const boxSnapshot = makeSnapshot({
        nAtoms: 1,
        positions: [0, 0, 0],
        elements: [6],
        box: [10, 0, 0, 0, 10, 0, 0, 0, 10],
      });
      const nodes = [
        makeNode("ls", "load_structure", { fileName: null, hasTrajectory: false, hasCell: true }),
        makeNode("vp", "viewport", { perspective: false, cellAxesVisible: true }),
      ];
      const edges = [
        makeEdge("ls", "particle", "vp", "particle"),
        makeEdge("ls", "cell", "vp", "cell"),
      ];

      const result = executePipeline(nodes, edges, { snapshot: boxSnapshot });
      expect(result.cells).toHaveLength(1);
      expect(result.cells[0].box[0]).toBe(10);
    });

    it("produces trajectory output when frames exist", () => {
      const frames: Frame[] = [
        { frameId: 0, nAtoms: 3, positions: new Float32Array(9) },
      ];
      const meta: TrajectoryMeta = { nFrames: 1, timestepPs: 1.0, nAtoms: 3 };

      const nodes = [
        makeNode("ls", "load_structure", { fileName: null, hasTrajectory: true, hasCell: false }),
        makeNode("vp", "viewport", { perspective: false, cellAxesVisible: true }),
      ];
      const edges = [
        makeEdge("ls", "particle", "vp", "particle"),
        makeEdge("ls", "trajectory", "vp", "trajectory"),
      ];

      const result = executePipeline(nodes, edges, {
        snapshot: waterSnapshot,
        structureFrames: frames,
        structureMeta: meta,
      });
      expect(result.trajectories).toHaveLength(1);
      expect(result.trajectories[0].source).toBe("structure");
    });

    it("returns default state when no snapshot", () => {
      const nodes = [
        makeNode("ls", "load_structure", { fileName: null, hasTrajectory: false, hasCell: false }),
        makeNode("vp", "viewport", { perspective: false, cellAxesVisible: true }),
      ];
      const edges = [makeEdge("ls", "particle", "vp", "particle")];

      const result = executePipeline(nodes, edges, { snapshot: null });
      expect(result.particles).toHaveLength(0);
    });
  });

  describe("Filter node", () => {
    it("passes through on empty query", () => {
      const nodes = [
        makeNode("ls", "load_structure", { fileName: null, hasTrajectory: false, hasCell: false }),
        makeNode("f", "filter", { query: "" }),
        makeNode("vp", "viewport", { perspective: false, cellAxesVisible: true }),
      ];
      const edges = [
        makeEdge("ls", "particle", "f", "in"),
        makeEdge("f", "out", "vp", "particle"),
      ];

      const result = executePipeline(nodes, edges, { snapshot: fiveAtomSnapshot });
      expect(result.particles).toHaveLength(1);
      expect(result.particles[0].indices).toBeNull(); // all atoms
    });

    it("filters by element", () => {
      const nodes = [
        makeNode("ls", "load_structure", { fileName: null, hasTrajectory: false, hasCell: false }),
        makeNode("f", "filter", { query: 'element == "H"' }),
        makeNode("vp", "viewport", { perspective: false, cellAxesVisible: true }),
      ];
      const edges = [
        makeEdge("ls", "particle", "f", "in"),
        makeEdge("f", "out", "vp", "particle"),
      ];

      const result = executePipeline(nodes, edges, { snapshot: fiveAtomSnapshot });
      expect(result.particles).toHaveLength(1);
      const indices = Array.from(result.particles[0].indices!);
      expect(indices).toEqual([3, 4]);
    });

    it("passes through on invalid query", () => {
      const nodes = [
        makeNode("ls", "load_structure", { fileName: null, hasTrajectory: false, hasCell: false }),
        makeNode("f", "filter", { query: "invalid_syntax!!!" }),
        makeNode("vp", "viewport", { perspective: false, cellAxesVisible: true }),
      ];
      const edges = [
        makeEdge("ls", "particle", "f", "in"),
        makeEdge("f", "out", "vp", "particle"),
      ];

      const result = executePipeline(nodes, edges, { snapshot: fiveAtomSnapshot });
      expect(result.particles).toHaveLength(1);
      // Should pass through unchanged on parse error
      expect(result.particles[0].indices).toBeNull();
    });
  });

  describe("Modify node", () => {
    it("applies global scale override", () => {
      const nodes = [
        makeNode("ls", "load_structure", { fileName: null, hasTrajectory: false, hasCell: false }),
        makeNode("m", "modify", { scale: 0.5, opacity: 1.0 }),
        makeNode("vp", "viewport", { perspective: false, cellAxesVisible: true }),
      ];
      const edges = [
        makeEdge("ls", "particle", "m", "in"),
        makeEdge("m", "out", "vp", "particle"),
      ];

      const result = executePipeline(nodes, edges, { snapshot: fiveAtomSnapshot });
      const p = result.particles[0];
      expect(p.scaleOverrides).not.toBeNull();
      expect(p.scaleOverrides!.length).toBe(5);
      for (let i = 0; i < 5; i++) {
        expect(p.scaleOverrides![i]).toBe(0.5);
      }
    });

    it("applies scale only to filtered indices", () => {
      const nodes = [
        makeNode("ls", "load_structure", { fileName: null, hasTrajectory: false, hasCell: false }),
        makeNode("f", "filter", { query: 'element == "H"' }),
        makeNode("m", "modify", { scale: 2.0, opacity: 1.0 }),
        makeNode("vp", "viewport", { perspective: false, cellAxesVisible: true }),
      ];
      const edges = [
        makeEdge("ls", "particle", "f", "in"),
        makeEdge("f", "out", "m", "in"),
        makeEdge("m", "out", "vp", "particle"),
      ];

      const result = executePipeline(nodes, edges, { snapshot: fiveAtomSnapshot });
      const p = result.particles[0];
      expect(p.scaleOverrides).not.toBeNull();
      // H atoms at indices 3,4 should be 2.0; others 1.0
      expect(p.scaleOverrides![0]).toBe(1.0); // C
      expect(p.scaleOverrides![3]).toBe(2.0); // H
      expect(p.scaleOverrides![4]).toBe(2.0); // H
    });
  });

  describe("AddBond node", () => {
    it("uses structure bonds when bondSource is 'structure'", () => {
      const nodes = [
        makeNode("ls", "load_structure", { fileName: null, hasTrajectory: false, hasCell: false }),
        makeNode("ab", "add_bond", { bondSource: "structure" }),
        makeNode("vp", "viewport", { perspective: false, cellAxesVisible: true }),
      ];
      const edges = [
        makeEdge("ls", "particle", "ab", "particle"),
        makeEdge("ab", "bond", "vp", "bond"),
      ];

      const result = executePipeline(nodes, edges, { snapshot: waterSnapshot });
      expect(result.bonds).toHaveLength(1);
      expect(result.bonds[0].nBonds).toBe(2);
    });

    it("computes distance-based bonds", () => {
      // Two carbons at 1.5 Å
      const closeAtoms = makeSnapshot({
        nAtoms: 2,
        positions: [0, 0, 0, 1.5, 0, 0],
        elements: [6, 6],
      });
      const nodes = [
        makeNode("ls", "load_structure", { fileName: null, hasTrajectory: false, hasCell: false }),
        makeNode("ab", "add_bond", { bondSource: "distance" }),
        makeNode("vp", "viewport", { perspective: false, cellAxesVisible: true }),
      ];
      const edges = [
        makeEdge("ls", "particle", "ab", "particle"),
        makeEdge("ab", "bond", "vp", "bond"),
      ];

      const result = executePipeline(nodes, edges, { snapshot: closeAtoms });
      expect(result.bonds).toHaveLength(1);
      expect(result.bonds[0].nBonds).toBe(1);
    });

    it("processes PBC bonds with ghost atoms", () => {
      // Water molecule where one H is wrapped to the opposite side of a 4 Å box
      // O at (0.5, 2, 2), H1 at (1.4, 2, 2) (normal), H2 at (3.6, 2, 2) (wrapped)
      // O-H1 distance = 0.9 Å (keep), O-H2 distance = 3.1 Å > 4/2 = 2.0 Å (PBC bond)
      const wrappedWater = makeSnapshot({
        nAtoms: 3,
        positions: [0.5, 2, 2, 1.4, 2, 2, 3.6, 2, 2],
        elements: [8, 1, 1],
        bonds: [0, 1, 0, 2],
        bondOrders: [1, 1],
        box: [4, 0, 0, 0, 4, 0, 0, 0, 4],
      });
      const nodes = [
        makeNode("ls", "load_structure", { fileName: null, hasTrajectory: false, hasCell: true }),
        makeNode("ab", "add_bond", { bondSource: "structure" }),
        makeNode("vp", "viewport", { perspective: false, cellAxesVisible: true }),
      ];
      const edges = [
        makeEdge("ls", "particle", "ab", "particle"),
        makeEdge("ab", "bond", "vp", "bond"),
      ];

      const result = executePipeline(nodes, edges, { snapshot: wrappedWater });
      expect(result.bonds).toHaveLength(1);
      const bond = result.bonds[0];
      // 1 normal bond (O-H1) + 2 half-bonds for PBC bond (O-H2)
      expect(bond.nBonds).toBe(3);
      // First bond: O-H1 (normal, indices 0,1)
      expect(bond.bondIndices[0]).toBe(0);
      expect(bond.bondIndices[1]).toBe(1);
      // Second bond: O → ghost_H2 (index 3, first ghost atom)
      expect(bond.bondIndices[2]).toBe(0);
      expect(bond.bondIndices[3]).toBe(3);
      // Third bond: H2 → ghost_O (index 4, second ghost atom)
      expect(bond.bondIndices[4]).toBe(2);
      expect(bond.bondIndices[5]).toBe(4);
      // Extended positions/elements include ghost atoms
      expect(bond.positions).not.toBeNull();
      expect(bond.elements).not.toBeNull();
      expect(bond.nAtoms).toBe(5); // 3 original + 2 ghosts
      // Ghost_H2 should be near O (minimum-image of H2 near O)
      // O at (0.5, 2, 2), H2 at (3.6, 2, 2), min-image displacement = -0.4-0.5 = -0.9? No...
      // dx = 3.6 - 0.5 = 3.1, fractional = 3.1/4 = 0.775, wrapped = 0.775 - 1 = -0.225
      // dxMin = -0.225 * 4 = -0.9, ghost_H2 = 0.5 + (-0.9) = -0.4
      expect(bond.positions![3 * 3]).toBeCloseTo(-0.4, 1);  // ghost_H2 x
      expect(bond.positions![3 * 3 + 1]).toBeCloseTo(2, 1); // ghost_H2 y
      // ghost_O = H2 - dMin = 3.6 - (-0.9) = 4.5
      expect(bond.positions![4 * 3]).toBeCloseTo(4.5, 1);   // ghost_O x
    });

    it("PBC processing keeps all bonds when no box", () => {
      const nodes = [
        makeNode("ls", "load_structure", { fileName: null, hasTrajectory: false, hasCell: false }),
        makeNode("ab", "add_bond", { bondSource: "structure" }),
        makeNode("vp", "viewport", { perspective: false, cellAxesVisible: true }),
      ];
      const edges = [
        makeEdge("ls", "particle", "ab", "particle"),
        makeEdge("ab", "bond", "vp", "bond"),
      ];

      const result = executePipeline(nodes, edges, { snapshot: waterSnapshot });
      expect(result.bonds).toHaveLength(1);
      expect(result.bonds[0].nBonds).toBe(2);
    });

    it("distance-based bond detection finds bonds across PBC boundaries", () => {
      // Two H atoms at opposite edges of a 3 Å box
      // H1 at (0.1, 1.5, 1.5), H2 at (2.9, 1.5, 1.5)
      // Cartesian distance = 2.8 Å (too far for H-H bond)
      // PBC minimum-image distance = 0.2 Å... too close (< MIN_BOND_DIST=0.4)
      // Let's use: H1 at (0.2, 1.5, 1.5), H2 at (2.5, 1.5, 1.5) in a 3 Å box
      // Cartesian distance = 2.3 Å, PBC min-image distance = 0.7 Å
      // VDW_RADII[H] = 1.2, threshold = (1.2+1.2)*0.6 = 1.44 Å
      // 0.7 < 1.44 so bond should be found via PBC
      const pbcAtoms = makeSnapshot({
        nAtoms: 2,
        positions: [0.2, 1.5, 1.5, 2.5, 1.5, 1.5],
        elements: [1, 1],
        bonds: [],
        bondOrders: [],
        box: [3, 0, 0, 0, 3, 0, 0, 0, 3],
      });
      const nodes = [
        makeNode("ls", "load_structure", { fileName: null, hasTrajectory: false, hasCell: true }),
        makeNode("ab", "add_bond", { bondSource: "distance" }),
        makeNode("vp", "viewport", { perspective: false, cellAxesVisible: true }),
      ];
      const edges = [
        makeEdge("ls", "particle", "ab", "particle"),
        makeEdge("ab", "bond", "vp", "bond"),
      ];

      const result = executePipeline(nodes, edges, { snapshot: pbcAtoms });
      expect(result.bonds).toHaveLength(1);
      // Bond should be found (PBC minimum-image distance ~0.7 Å < 1.44 Å threshold)
      expect(result.bonds[0].nBonds).toBeGreaterThanOrEqual(1);
    });

    it("returns no bonds for 'none' source", () => {
      const nodes = [
        makeNode("ls", "load_structure", { fileName: null, hasTrajectory: false, hasCell: false }),
        makeNode("ab", "add_bond", { bondSource: "none" }),
        makeNode("vp", "viewport", { perspective: false, cellAxesVisible: true }),
      ];
      const edges = [
        makeEdge("ls", "particle", "ab", "particle"),
        makeEdge("ab", "bond", "vp", "bond"),
      ];

      const result = executePipeline(nodes, edges, { snapshot: waterSnapshot });
      expect(result.bonds).toHaveLength(0);
    });
  });

  describe("LabelGenerator node", () => {
    it("generates element labels", () => {
      const nodes = [
        makeNode("ls", "load_structure", { fileName: null, hasTrajectory: false, hasCell: false }),
        makeNode("lg", "label_generator", { source: "element" }),
        makeNode("vp", "viewport", { perspective: false, cellAxesVisible: true }),
      ];
      const edges = [
        makeEdge("ls", "particle", "lg", "particle"),
        makeEdge("lg", "label", "vp", "label"),
      ];

      const result = executePipeline(nodes, edges, { snapshot: waterSnapshot });
      expect(result.labels).toHaveLength(1);
      expect(result.labels[0].labels).toEqual(["O", "H", "H"]);
    });

    it("generates index labels", () => {
      const nodes = [
        makeNode("ls", "load_structure", { fileName: null, hasTrajectory: false, hasCell: false }),
        makeNode("lg", "label_generator", { source: "index" }),
        makeNode("vp", "viewport", { perspective: false, cellAxesVisible: true }),
      ];
      const edges = [
        makeEdge("ls", "particle", "lg", "particle"),
        makeEdge("lg", "label", "vp", "label"),
      ];

      const result = executePipeline(nodes, edges, { snapshot: waterSnapshot });
      expect(result.labels[0].labels).toEqual(["0", "1", "2"]);
    });
  });

  describe("Viewport node", () => {
    it("sets perspective and cellAxesVisible from params", () => {
      const nodes = [
        makeNode("ls", "load_structure", { fileName: null, hasTrajectory: false, hasCell: false }),
        makeNode("vp", "viewport", { perspective: true, cellAxesVisible: false }),
      ];
      const edges = [makeEdge("ls", "particle", "vp", "particle")];

      const result = executePipeline(nodes, edges, { snapshot: waterSnapshot });
      expect(result.perspective).toBe(true);
      expect(result.cellAxesVisible).toBe(false);
    });

    it("prioritizes file trajectory over structure trajectory", () => {
      const structFrames: Frame[] = [
        { frameId: 0, nAtoms: 3, positions: new Float32Array(9) },
      ];
      const fileFrames: Frame[] = [
        { frameId: 0, nAtoms: 3, positions: new Float32Array(9) },
        { frameId: 1, nAtoms: 3, positions: new Float32Array(9) },
      ];
      const structMeta: TrajectoryMeta = { nFrames: 1, timestepPs: 1.0, nAtoms: 3 };
      const fileMeta: TrajectoryMeta = { nFrames: 2, timestepPs: 1.0, nAtoms: 3 };

      const nodes = [
        makeNode("ls", "load_structure", { fileName: null, hasTrajectory: true, hasCell: false }),
        makeNode("lt", "load_trajectory", { fileName: null }),
        makeNode("vp", "viewport", { perspective: false, cellAxesVisible: true }),
      ];
      const edges = [
        makeEdge("ls", "particle", "vp", "particle"),
        makeEdge("ls", "trajectory", "vp", "trajectory"),
        makeEdge("lt", "trajectory", "vp", "trajectory"),
      ];

      const result = executePipeline(nodes, edges, {
        snapshot: waterSnapshot,
        structureFrames: structFrames,
        structureMeta: structMeta,
        fileFrames: fileFrames,
        fileMeta: fileMeta,
      });
      expect(result.trajectories).toHaveLength(2);
      // File trajectory should come first
      expect(result.trajectories[0].source).toBe("file");
    });
  });

  describe("Disabled nodes", () => {
    it("passes through data when node is disabled", () => {
      const nodes = [
        makeNode("ls", "load_structure", { fileName: null, hasTrajectory: false, hasCell: false }),
        makeNode("f", "filter", { query: 'element == "H"' }, false), // disabled
        makeNode("vp", "viewport", { perspective: false, cellAxesVisible: true }),
      ];
      const edges = [
        makeEdge("ls", "particle", "f", "in"),
        makeEdge("f", "out", "vp", "particle"),
      ];

      const result = executePipeline(nodes, edges, { snapshot: fiveAtomSnapshot });
      expect(result.particles).toHaveLength(1);
      // Should pass through all atoms (filter disabled)
      expect(result.particles[0].indices).toBeNull();
    });
  });

  describe("Full pipeline", () => {
    it("executes LoadStructure → Filter → Modify → Viewport", () => {
      const nodes = [
        makeNode("ls", "load_structure", { fileName: null, hasTrajectory: false, hasCell: false }),
        makeNode("f", "filter", { query: 'element == "C" or element == "N"' }),
        makeNode("m", "modify", { scale: 0.3, opacity: 0.8 }),
        makeNode("vp", "viewport", { perspective: false, cellAxesVisible: true }),
      ];
      const edges = [
        makeEdge("ls", "particle", "f", "in"),
        makeEdge("f", "out", "m", "in"),
        makeEdge("m", "out", "vp", "particle"),
      ];

      const result = executePipeline(nodes, edges, { snapshot: fiveAtomSnapshot });
      expect(result.particles).toHaveLength(1);

      const p = result.particles[0];
      // Filter should select C(0) and N(1)
      const indices = Array.from(p.indices!);
      expect(indices).toEqual([0, 1]);

      // Modify should set scale for indices 0,1
      expect(p.scaleOverrides![0]).toBeCloseTo(0.3);
      expect(p.scaleOverrides![1]).toBeCloseTo(0.3);
      // Others should be 1.0
      expect(p.scaleOverrides![2]).toBeCloseTo(1.0);
    });
  });

  describe("bond filtering by particles", () => {
    it("filters bonds when particle stream has filtered indices", () => {
      // Snapshot with bonds 0-1 and 0-2
      const snapshot = makeSnapshot({
        nAtoms: 3,
        positions: [0, 0, 0, 1, 0, 0, 2, 0, 0],
        elements: [6, 1, 1], // C, H, H
        bonds: [0, 1, 0, 2],
        bondOrders: [1, 1],
      });

      const nodes = [
        makeNode("ls", "load_structure", { fileName: null, hasTrajectory: false, hasCell: false }),
        makeNode("f", "filter", { query: 'element == "C" or index == 1' }), // only C(0) and H(1)
        makeNode("ab", "add_bond", { bondSource: "structure" }),
        makeNode("vp", "viewport", { perspective: false, cellAxesVisible: true }),
      ];
      const edges = [
        makeEdge("ls", "particle", "f", "in"),
        makeEdge("f", "out", "vp", "particle"),
        makeEdge("ls", "particle", "ab", "particle"),
        makeEdge("ab", "bond", "vp", "bond"),
      ];

      const result = executePipeline(nodes, edges, { snapshot });
      // Both particle streams: filtered (indices 0,1) and unfiltered (from ab→particle)
      // Since ab gets unfiltered particle (all), bonds should pass through
      // The unfiltered particle stream has indices=null, so no bond filtering
      expect(result.bonds).toHaveLength(1);
    });
  });
});
