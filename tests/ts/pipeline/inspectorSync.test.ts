import { describe, it, expect } from "vitest";
import type { Node, Edge } from "@xyflow/react";
import type { PipelineNodeData } from "@/pipeline/execute";
import {
  reconcileInspectorLayers,
  layersFromGraph,
  defaultInspectorAppearance,
  isInspectorId,
  type InspectorLayer,
} from "@/pipeline/inspectorSync";
import type { ColorParams, ModifyParams, FilterParams } from "@/pipeline/types";

/** A tiny base graph: replicate feeds viewport.particle. */
function baseGraph(): { nodes: Node<PipelineNodeData>[]; edges: Edge[] } {
  const nodes: Node<PipelineNodeData>[] = [
    {
      id: "replicate-1",
      type: "replicate",
      position: { x: 0, y: 0 },
      data: { params: { type: "replicate", nx: 1, ny: 1, nz: 1 }, enabled: true },
    },
    {
      id: "viewport-1",
      type: "viewport",
      position: { x: 0, y: 300 },
      data: {
        params: {
          type: "viewport",
          perspective: false,
          cellAxesVisible: true,
          pivotMarkerVisible: true,
        },
        enabled: true,
      },
    },
  ];
  const edges: Edge[] = [
    {
      id: "e-base",
      source: "replicate-1",
      target: "viewport-1",
      sourceHandle: "particle",
      targetHandle: "particle",
    },
  ];
  return { nodes, edges };
}

const SOURCE = { nodeId: "replicate-1", handle: "particle" };
const VP = "viewport-1";

function layer(overrides: Partial<InspectorLayer> = {}): InspectorLayer {
  return {
    id: "L1",
    name: "Layer 1",
    query: 'element == "C"',
    appearance: defaultInspectorAppearance(),
    ...overrides,
  };
}

describe("reconcileInspectorLayers", () => {
  it("emits only a filter node when appearance needs nothing else", () => {
    const a = defaultInspectorAppearance();
    a.colorEnabled = false; // default has color on; turn it off
    const { nodes, edges } = baseGraph();
    const out = reconcileInspectorLayers(nodes, edges, [layer({ appearance: a })], SOURCE, VP);

    const insp = out.nodes.filter((n) => isInspectorId(n.id));
    expect(insp.map((n) => n.id)).toEqual(["insp-L1-filter"]);
    // src → filter, filter → viewport
    const inspEdges = out.edges.filter(
      (e) => e.source === "insp-L1-filter" || e.target === "insp-L1-filter",
    );
    expect(inspEdges).toHaveLength(2);
    expect((insp[0].data.params as FilterParams).query).toBe('element == "C"');
    expect((insp[0].data as { inspectorLayerId?: string }).inspectorLayerId).toBe("L1");
  });

  it("chains filter → color when color is enabled", () => {
    const { nodes, edges } = baseGraph();
    const out = reconcileInspectorLayers(nodes, edges, [layer()], SOURCE, VP);
    const ids = out.nodes.filter((n) => isInspectorId(n.id)).map((n) => n.id);
    expect(ids).toContain("insp-L1-filter");
    expect(ids).toContain("insp-L1-color");
    // color node terminates at the viewport
    const toVp = out.edges.find((e) => e.source === "insp-L1-color" && e.target === VP);
    expect(toVp?.targetHandle).toBe("particle");
    // filter feeds color
    expect(
      out.edges.some((e) => e.source === "insp-L1-filter" && e.target === "insp-L1-color"),
    ).toBe(true);
  });

  it("adds a modify node when scale/opacity/visibility change, with opacity 0 when hidden", () => {
    const a = defaultInspectorAppearance();
    a.visible = false;
    const { nodes, edges } = baseGraph();
    const out = reconcileInspectorLayers(nodes, edges, [layer({ appearance: a })], SOURCE, VP);
    const modify = out.nodes.find((n) => n.id === "insp-L1-modify");
    expect(modify).toBeDefined();
    expect((modify!.data.params as ModifyParams).opacity).toBe(0);
  });

  it("uses the uniform color on the emitted color node", () => {
    const a = defaultInspectorAppearance();
    a.uniformColor = "#123456";
    const { nodes, edges } = baseGraph();
    const out = reconcileInspectorLayers(nodes, edges, [layer({ appearance: a })], SOURCE, VP);
    const color = out.nodes.find((n) => n.id === "insp-L1-color");
    expect((color!.data.params as ColorParams).uniformColor).toBe("#123456");
  });

  it("is idempotent: re-running yields the same node ids", () => {
    const g0 = baseGraph();
    const g1 = reconcileInspectorLayers(g0.nodes, g0.edges, [layer()], SOURCE, VP);
    const g2 = reconcileInspectorLayers(g1.nodes, g1.edges, [layer()], SOURCE, VP);
    const ids1 = g1.nodes.map((n) => n.id).sort();
    const ids2 = g2.nodes.map((n) => n.id).sort();
    expect(ids2).toEqual(ids1);
    // No duplication of inspector nodes.
    expect(g2.nodes.filter((n) => n.id === "insp-L1-filter")).toHaveLength(1);
  });

  it("removes a layer's nodes/edges when the layer is dropped", () => {
    const g0 = baseGraph();
    const two = [layer({ id: "L1" }), layer({ id: "L2", query: 'element == "N"' })];
    const g1 = reconcileInspectorLayers(g0.nodes, g0.edges, two, SOURCE, VP);
    expect(g1.nodes.some((n) => n.id === "insp-L2-filter")).toBe(true);

    const g2 = reconcileInspectorLayers(g1.nodes, g1.edges, [layer({ id: "L1" })], SOURCE, VP);
    expect(g2.nodes.some((n) => isInspectorId(n.id) && n.id.includes("L2"))).toBe(false);
    expect(g2.edges.some((e) => e.source.includes("L2") || e.target.includes("L2"))).toBe(false);
    // L1 survives; base graph untouched.
    expect(g2.nodes.some((n) => n.id === "insp-L1-filter")).toBe(true);
    expect(g2.nodes.some((n) => n.id === "replicate-1")).toBe(true);
    expect(g2.edges.some((e) => e.id === "e-base")).toBe(true);
  });

  it("leaves non-inspector nodes and edges untouched", () => {
    const g0 = baseGraph();
    const g1 = reconcileInspectorLayers(g0.nodes, g0.edges, [layer()], SOURCE, VP);
    expect(
      g1.nodes
        .filter((n) => !isInspectorId(n.id))
        .map((n) => n.id)
        .sort(),
    ).toEqual(["replicate-1", "viewport-1"]);
    expect(g1.edges.filter((e) => e.id === "e-base")).toHaveLength(1);
  });
});

describe("layersFromGraph", () => {
  it("round-trips layers authored by reconcile", () => {
    const a = defaultInspectorAppearance();
    a.representationEnabled = true;
    a.representation = "licorice";
    a.scale = 1.5;
    const input = layer({ id: "L1", query: 'resname == "HOH"', appearance: a });

    const g0 = baseGraph();
    const g1 = reconcileInspectorLayers(g0.nodes, g0.edges, [input], SOURCE, VP);
    const recovered = layersFromGraph(g1.nodes);

    expect(recovered).toHaveLength(1);
    expect(recovered[0].id).toBe("L1");
    expect(recovered[0].query).toBe('resname == "HOH"');
    expect(recovered[0].appearance.representationEnabled).toBe(true);
    expect(recovered[0].appearance.representation).toBe("licorice");
    expect(recovered[0].appearance.scale).toBe(1.5);
    expect(recovered[0].appearance.colorEnabled).toBe(true);
  });

  it("recovers a hidden layer as visible=false", () => {
    const a = defaultInspectorAppearance();
    a.visible = false;
    const g0 = baseGraph();
    const g1 = reconcileInspectorLayers(g0.nodes, g0.edges, [layer({ appearance: a })], SOURCE, VP);
    const recovered = layersFromGraph(g1.nodes);
    expect(recovered[0].appearance.visible).toBe(false);
  });

  it("returns nothing for a graph with no inspector nodes", () => {
    expect(layersFromGraph(baseGraph().nodes)).toEqual([]);
  });
});
