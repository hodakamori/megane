import { describe, it, expect, beforeEach, vi } from "vitest";

// Mock the WASM-backed parsers so this test exercises only the orchestration
// logic (file classification, graph install, store updates). The actual
// parsing is covered by Rust tests and E2E specs.
vi.mock("@/parsers/structure", () => ({
  parseStructureFile: vi.fn(),
}));
vi.mock("@/parsers/xtc", () => ({
  parseXTCFile: vi.fn(),
  parseLammpstrjFile: vi.fn(),
}));

import { parseStructureFile } from "@/parsers/structure";
import { parseXTCFile, parseLammpstrjFile } from "@/parsers/xtc";
import { usePipelineStore } from "@/pipeline/store";
import type { Snapshot, Frame, TrajectoryMeta } from "@/types";

const mockParseStructureFile = vi.mocked(parseStructureFile);
const mockParseXTCFile = vi.mocked(parseXTCFile);
const mockParseLammpstrjFile = vi.mocked(parseLammpstrjFile);

function makeSnapshot(nAtoms = 3, withBox = false): Snapshot {
  return {
    nAtoms,
    nBonds: 0,
    nFileBonds: 0,
    positions: new Float32Array(nAtoms * 3),
    elements: new Uint8Array(nAtoms),
    bonds: new Uint32Array(0),
    bondOrders: new Uint8Array(0),
    box: withBox ? new Float32Array([10, 0, 0, 0, 10, 0, 0, 0, 10]) : null,
  };
}

function makeFrame(frameId: number, nAtoms = 3): Frame {
  return {
    frameId,
    nAtoms,
    positions: new Float32Array(nAtoms * 3),
  };
}

function makeMeta(nFrames: number, nAtoms = 3): TrajectoryMeta {
  return { nFrames, timestepPs: 1, nAtoms };
}

beforeEach(() => {
  // Reset store to a clean state for each test. `reset()` reinstalls the
  // host-default pipeline; we then explicitly start each test from a known
  // graph by either calling `reset()` or installing a fresh minimal one via
  // `openFile`.
  usePipelineStore.getState().reset();
  mockParseStructureFile.mockReset();
  mockParseXTCFile.mockReset();
  mockParseLammpstrjFile.mockReset();
});

describe("usePipelineStore.openFile — single structure file", () => {
  it("populates the load_structure node fileName and snapshot for .pdb", async () => {
    mockParseStructureFile.mockResolvedValueOnce({
      snapshot: makeSnapshot(5, true),
      frames: [],
      meta: null,
      labels: null,
      vectorChannels: [],
    });

    const file = new File(["<pdb>"], "water_wrapped.pdb");
    await usePipelineStore.getState().openFile(file, { mode: "replace" });

    const state = usePipelineStore.getState();
    const loader = state.nodes.find((n) => n.type === "load_structure");
    expect(loader).toBeDefined();
    expect((loader!.data.params as { fileName: string }).fileName).toBe("water_wrapped.pdb");
    expect((loader!.data.params as { hasCell: boolean }).hasCell).toBe(true);
    expect((loader!.data.params as { hasTrajectory: boolean }).hasTrajectory).toBe(false);
    expect(state.nodeSnapshots[loader!.id]?.snapshot.nAtoms).toBe(5);
  });

  it("drops the redundant load_trajectory node and rewires for multi-frame .traj", async () => {
    mockParseStructureFile.mockResolvedValueOnce({
      snapshot: makeSnapshot(8),
      frames: [makeFrame(1), makeFrame(2), makeFrame(3)],
      meta: makeMeta(4),
      labels: null,
      vectorChannels: [],
    });

    const file = new File([new Uint8Array([0, 1, 2])], "bond_change.traj");
    await usePipelineStore.getState().openFile(file, { mode: "replace" });

    const state = usePipelineStore.getState();
    const loader = state.nodes.find((n) => n.type === "load_structure")!;
    expect((loader.data.params as { fileName: string }).fileName).toBe("bond_change.traj");
    expect((loader.data.params as { hasTrajectory: boolean }).hasTrajectory).toBe(true);
    expect(state.nodeSnapshots[loader.id]?.frames?.length).toBe(3);
    // Multi-frame structure files carry their trajectory in the structure
    // node itself, so the seed LoadTrajectory node should be removed and
    // its downstream consumers rewired to LoadStructure.trajectory.
    expect(state.nodes.find((n) => n.type === "load_trajectory")).toBeUndefined();
    const viewport = state.nodes.find((n) => n.type === "viewport")!;
    const trajEdge = state.edges.find(
      (e) =>
        e.source === loader.id &&
        e.sourceHandle === "trajectory" &&
        e.target === viewport.id &&
        e.targetHandle === "trajectory",
    );
    expect(trajEdge).toBeDefined();
    expect(state.fileFrames).toBeNull();
  });

  it("uses an existing load_structure node in merge mode without replacing the graph", async () => {
    mockParseStructureFile.mockResolvedValueOnce({
      snapshot: makeSnapshot(3),
      frames: [],
      meta: null,
      labels: null,
      vectorChannels: [],
    });

    const before = usePipelineStore.getState();
    const beforeNodeIds = before.nodes.map((n) => n.id).sort();

    const file = new File(["<gro>"], "water.gro");
    await usePipelineStore.getState().openFile(file, { mode: "merge" });

    const after = usePipelineStore.getState();
    expect(after.nodes.map((n) => n.id).sort()).toEqual(beforeNodeIds);
    const loader = after.nodes.find((n) => n.type === "load_structure")!;
    expect((loader.data.params as { fileName: string }).fileName).toBe("water.gro");
  });
});

describe("usePipelineStore.openFile — trajectory files", () => {
  it("rejects when no load_structure snapshot has been loaded yet", async () => {
    // Reset clears nodeSnapshots, so even though the default graph has a
    // load_structure node, opening a trajectory should fail.
    const file = new File(["<xtc>"], "trajectory.xtc");
    await expect(usePipelineStore.getState().openFile(file)).rejects.toThrow(
      /load a structure file first/i,
    );
  });

  it("attaches frames to fileFrames and updates the load_trajectory fileName", async () => {
    // First load a structure so the trajectory has a known atom count.
    mockParseStructureFile.mockResolvedValueOnce({
      snapshot: makeSnapshot(4),
      frames: [],
      meta: null,
      labels: null,
      vectorChannels: [],
    });
    await usePipelineStore.getState().openFile(new File(["<gro>"], "water.gro"), {
      mode: "replace",
    });

    mockParseXTCFile.mockResolvedValueOnce({
      frames: [makeFrame(1, 4), makeFrame(2, 4)],
      meta: makeMeta(2, 4),
      vectorChannels: null,
    });

    const xtc = new File([new Uint8Array([9, 9])], "vibration.xtc");
    await usePipelineStore.getState().openFile(xtc);

    const state = usePipelineStore.getState();
    const traj = state.nodes.find((n) => n.type === "load_trajectory")!;
    expect((traj.data.params as { fileName: string }).fileName).toBe("vibration.xtc");
    expect(state.fileFrames?.length).toBe(2);
    expect(mockParseXTCFile).toHaveBeenCalled();
  });

  it("uses the LAMMPS trajectory parser for .lammpstrj", async () => {
    mockParseStructureFile.mockResolvedValueOnce({
      snapshot: makeSnapshot(3),
      frames: [],
      meta: null,
      labels: null,
      vectorChannels: [],
    });
    await usePipelineStore.getState().openFile(new File(["<lammps>"], "water.lammps"), {
      mode: "replace",
    });

    mockParseLammpstrjFile.mockResolvedValueOnce({
      frames: [makeFrame(1, 3)],
      meta: makeMeta(1, 3),
      vectorChannels: null,
    });

    const dump = new File(["<dump>"], "trajectory.lammpstrj");
    await usePipelineStore.getState().openFile(dump);

    expect(mockParseLammpstrjFile).toHaveBeenCalled();
    expect(mockParseXTCFile).not.toHaveBeenCalled();
  });
});

describe("usePipelineStore.openFile — pipeline files", () => {
  it("deserializes a .megane.json with no companions", async () => {
    const pipeline = {
      version: 3 as const,
      nodes: [
        {
          id: "load-1",
          type: "load_structure",
          fileName: "water.pdb",
          hasTrajectory: false,
          hasCell: false,
          position: { x: 0, y: 0 },
          enabled: true,
        },
        {
          id: "viewport-1",
          type: "viewport",
          perspective: false,
          cellAxesVisible: false,
          pivotMarkerVisible: false,
          position: { x: 400, y: 0 },
          enabled: true,
        },
      ],
      edges: [
        {
          source: "load-1",
          target: "viewport-1",
          sourceHandle: "particle",
          targetHandle: "particle",
        },
      ],
    };

    const file = new File([JSON.stringify(pipeline)], "test.megane.json");
    await usePipelineStore.getState().openFile(file);

    const state = usePipelineStore.getState();
    expect(state.nodes.map((n) => n.id).sort()).toEqual(["load-1", "viewport-1"]);
  });

  it("attaches companion structure files by basename and applies per-node snapshots", async () => {
    mockParseStructureFile.mockResolvedValueOnce({
      snapshot: makeSnapshot(7),
      frames: [],
      meta: null,
      labels: null,
      vectorChannels: [],
    });

    const pipeline = {
      version: 3 as const,
      nodes: [
        {
          id: "load-1",
          type: "load_structure",
          fileName: "water.pdb",
          hasTrajectory: false,
          hasCell: false,
          position: { x: 0, y: 0 },
          enabled: true,
        },
      ],
      edges: [],
    };

    const meganeFile = new File([JSON.stringify(pipeline)], "deck.megane.json");
    const companion = new File(["<pdb>"], "water.pdb");

    await usePipelineStore.getState().openFile(meganeFile, { companions: [companion] });

    const state = usePipelineStore.getState();
    expect(state.nodeSnapshots["load-1"]?.snapshot.nAtoms).toBe(7);
    expect(
      (state.nodes.find((n) => n.id === "load-1")!.data.params as { fileName: string }).fileName,
    ).toBe("water.pdb");
  });

  it("rejects pipeline files with unsupported version", async () => {
    const pipeline = { version: 99, nodes: [], edges: [] };
    const file = new File([JSON.stringify(pipeline)], "old.megane.json");
    await expect(usePipelineStore.getState().openFile(file)).rejects.toThrow(/version 3/i);
  });
});

describe("usePipelineStore.openFile — error cases", () => {
  it("rejects unsupported extensions", async () => {
    const file = new File(["random"], "notes.txt");
    await expect(usePipelineStore.getState().openFile(file)).rejects.toThrow(
      /unsupported file type/i,
    );
  });
});
