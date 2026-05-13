import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import type { Node, Edge } from "@xyflow/react";
import { usePipelineStore } from "@/pipeline/store";
import { PolyhedronGeneratorNode } from "@/components/nodes/PolyhedronGeneratorNode";
import type { PolyhedronGeneratorParams } from "@/pipeline/types";
import { defaultParams } from "@/pipeline/types";
import type { PipelineNodeData, NodeSnapshotData } from "@/pipeline/execute";
import type { Snapshot } from "@/types";

vi.mock("@xyflow/react", () => import("./_xyflowMock"));

function nodeProps(id: string, params: PolyhedronGeneratorParams, enabled = true) {
  return {
    id,
    type: "polyhedron_generator" as const,
    data: { params, enabled },
    selected: false,
    isConnectable: true,
    xPos: 0,
    yPos: 0,
    zIndex: 0,
    dragging: false,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;
}

function makeSnapshot(elements: number[]): Snapshot {
  const n = elements.length;
  return {
    nAtoms: n,
    nBonds: 0,
    nFileBonds: 0,
    positions: new Float32Array(n * 3),
    elements: new Uint8Array(elements),
    bonds: new Uint32Array(0),
    bondOrders: null,
    box: null,
    atomChainIds: null,
    atomBFactors: null,
  };
}

/**
 * Seed the pipeline store with a polyhedra node, optionally wired to a
 * load_structure node whose snapshot contains the supplied elements.
 */
function seed({
  id = "pg1",
  params,
  upstreamElements,
}: {
  id?: string;
  params?: Partial<PolyhedronGeneratorParams>;
  upstreamElements?: number[];
}): PolyhedronGeneratorParams {
  const fullParams = {
    ...(defaultParams("polyhedron_generator") as PolyhedronGeneratorParams),
    ...params,
  };
  const polyNode: Node<PipelineNodeData> = {
    id,
    type: "polyhedron_generator",
    position: { x: 0, y: 0 },
    data: { params: fullParams, enabled: true },
  };
  const nodes: Node<PipelineNodeData>[] = [polyNode];
  const edges: Edge[] = [];
  const nodeSnapshots: Record<string, NodeSnapshotData> = {};

  if (upstreamElements) {
    const loadId = "loader-1";
    nodes.push({
      id: loadId,
      type: "load_structure",
      position: { x: 0, y: 0 },
      data: {
        params: { type: "load_structure", fileName: null, hasTrajectory: false, hasCell: false },
        enabled: true,
      },
    });
    edges.push({
      id: `${loadId}-${id}`,
      source: loadId,
      target: id,
      sourceHandle: "particle",
      targetHandle: "particle",
    });
    nodeSnapshots[loadId] = {
      snapshot: makeSnapshot(upstreamElements),
      frames: null,
      meta: null,
      labels: null,
    };
  }

  usePipelineStore.setState({ nodes, edges, nodeSnapshots, nodeErrors: {} });
  return fullParams;
}

describe("PolyhedronGeneratorNode", () => {
  beforeEach(() => {
    cleanup();
  });

  it("shows placeholder text when no upstream load_structure is connected", () => {
    const params = seed({});
    render(<PolyhedronGeneratorNode {...nodeProps("pg1", params)} />);
    const placeholders = screen.getAllByText(/Connect a structure to detect elements/);
    expect(placeholders.length).toBe(2); // one for centers, one for ligands
  });

  it("renders a checkbox per detected metal center and per detected ligand", () => {
    const params = seed({ upstreamElements: [22, 22, 8, 8, 8] }); // Ti + O
    render(<PolyhedronGeneratorNode {...nodeProps("pg1", params)} />);
    expect(screen.getByLabelText("Ti")).toBeInTheDocument();
    expect(screen.getByLabelText("O")).toBeInTheDocument();
  });

  it("does not surface H or noble gases as ligand candidates", () => {
    const params = seed({ upstreamElements: [22, 8, 1, 18] }); // Ti, O, H, Ar
    render(<PolyhedronGeneratorNode {...nodeProps("pg1", params)} />);
    expect(screen.queryByLabelText("H")).toBeNull();
    expect(screen.queryByLabelText("Ar")).toBeNull();
  });

  it("does not surface non-metals as center candidates", () => {
    const params = seed({ upstreamElements: [22, 8, 6] }); // Ti center, O ligand, C is excluded entirely
    render(<PolyhedronGeneratorNode {...nodeProps("pg1", params)} />);
    expect(screen.getByLabelText("Ti")).toBeInTheDocument();
    // C is not a center, not a default ligand → no checkbox at all.
    expect(screen.queryByLabelText("C")).toBeNull();
  });

  it("checkboxes are checked by default for elements not in the exclude list", () => {
    const params = seed({ upstreamElements: [22, 26, 8] }); // Ti, Fe, O
    render(<PolyhedronGeneratorNode {...nodeProps("pg1", params)} />);
    expect((screen.getByLabelText("Ti") as HTMLInputElement).checked).toBe(true);
    expect((screen.getByLabelText("Fe") as HTMLInputElement).checked).toBe(true);
    expect((screen.getByLabelText("O") as HTMLInputElement).checked).toBe(true);
  });

  it("a center already in excludedCenters renders unchecked", () => {
    const params = seed({
      upstreamElements: [22, 26, 8],
      params: { excludedCenters: [22] },
    });
    render(<PolyhedronGeneratorNode {...nodeProps("pg1", params)} />);
    expect((screen.getByLabelText("Ti") as HTMLInputElement).checked).toBe(false);
    expect((screen.getByLabelText("Fe") as HTMLInputElement).checked).toBe(true);
  });

  it("unchecking a center adds its Z to excludedCenters", () => {
    const updateNodeParams = vi.fn();
    const params = seed({ upstreamElements: [22, 26, 8] });
    usePipelineStore.setState({ updateNodeParams });
    render(<PolyhedronGeneratorNode {...nodeProps("pg1", params)} />);

    fireEvent.click(screen.getByLabelText("Ti"));
    expect(updateNodeParams).toHaveBeenCalledWith("pg1", { excludedCenters: [22] });
  });

  it("re-checking a center removes its Z from excludedCenters", () => {
    const updateNodeParams = vi.fn();
    const params = seed({
      upstreamElements: [22, 26, 8],
      params: { excludedCenters: [22, 26] },
    });
    usePipelineStore.setState({ updateNodeParams });
    render(<PolyhedronGeneratorNode {...nodeProps("pg1", params)} />);

    fireEvent.click(screen.getByLabelText("Ti"));
    expect(updateNodeParams).toHaveBeenCalledWith("pg1", { excludedCenters: [26] });
  });

  it("unchecking a ligand adds its Z to excludedLigands", () => {
    const updateNodeParams = vi.fn();
    const params = seed({ upstreamElements: [22, 8, 9] }); // Ti center, O+F ligands
    usePipelineStore.setState({ updateNodeParams });
    render(<PolyhedronGeneratorNode {...nodeProps("pg1", params)} />);

    fireEvent.click(screen.getByLabelText("O"));
    expect(updateNodeParams).toHaveBeenCalledWith("pg1", { excludedLigands: [8] });
  });

  it("cutoff tolerance slider commits a parsed float", () => {
    const updateNodeParams = vi.fn();
    const params = seed({});
    usePipelineStore.setState({ updateNodeParams });
    render(<PolyhedronGeneratorNode {...nodeProps("pg1", params)} />);

    fireEvent.change(screen.getByLabelText("Cutoff tolerance"), { target: { value: "1.30" } });
    expect(updateNodeParams).toHaveBeenCalledWith("pg1", { cutoffTolerance: 1.3 });
  });

  it("displays cutoff tolerance with 2-decimal precision", () => {
    const params = seed({ params: { cutoffTolerance: 1.23 } });
    render(<PolyhedronGeneratorNode {...nodeProps("pg1", params)} />);
    expect(screen.getByText("1.23")).toBeInTheDocument();
  });

  it("opacity slider commits a parsed float and shows percentage", () => {
    const updateNodeParams = vi.fn();
    const params = seed({ params: { opacity: 0.4 } });
    usePipelineStore.setState({ updateNodeParams });
    render(<PolyhedronGeneratorNode {...nodeProps("pg1", params)} />);

    expect(screen.getByText("40%")).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Opacity"), { target: { value: "0.75" } });
    expect(updateNodeParams).toHaveBeenCalledWith("pg1", { opacity: 0.75 });
  });

  it("toggling Show edges flips the showEdges param", () => {
    const updateNodeParams = vi.fn();
    const params = seed({});
    usePipelineStore.setState({ updateNodeParams });
    render(<PolyhedronGeneratorNode {...nodeProps("pg1", params)} />);

    fireEvent.click(screen.getByLabelText(/Show edges/));
    expect(updateNodeParams).toHaveBeenCalledWith("pg1", { showEdges: true });
  });

  it("hides the edge color and edge width controls when showEdges is false", () => {
    const params = seed({ params: { showEdges: false } });
    render(<PolyhedronGeneratorNode {...nodeProps("pg1", params)} />);
    expect(screen.queryByText("Edge color")).toBeNull();
    expect(screen.queryByText("Edge width")).toBeNull();
  });

  it("shows the edge color picker and edge width slider when showEdges is true", () => {
    const params = seed({ params: { showEdges: true, edgeColor: "#abcdef", edgeWidth: 4 } });
    render(<PolyhedronGeneratorNode {...nodeProps("pg1", params)} />);
    expect(screen.getByText("Edge color")).toBeInTheDocument();
    expect(screen.getByText("Edge width")).toBeInTheDocument();
    expect(screen.getByText("4.0")).toBeInTheDocument();
  });

  it("changing the edge color input dispatches updateNodeParams with the new color", () => {
    const updateNodeParams = vi.fn();
    const params = seed({ params: { showEdges: true, edgeColor: "#dddddd" } });
    usePipelineStore.setState({ updateNodeParams });
    render(<PolyhedronGeneratorNode {...nodeProps("pg1", params)} />);

    const colorInput = screen
      .getByText("Edge color")
      .parentElement!.querySelector('input[type="color"]') as HTMLInputElement;
    fireEvent.change(colorInput, { target: { value: "#abcdef" } });
    expect(updateNodeParams).toHaveBeenCalledWith("pg1", { edgeColor: "#abcdef" });
  });

  it("renders the Polyhedra title", () => {
    const params = seed({});
    render(<PolyhedronGeneratorNode {...nodeProps("pg1", params)} />);
    expect(screen.getByText("Polyhedra")).toBeInTheDocument();
  });
});
