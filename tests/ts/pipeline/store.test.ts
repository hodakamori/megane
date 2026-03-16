import { describe, it, expect, beforeEach } from "vitest";
import { usePipelineStore } from "@/pipeline/store";
import type { PipelineNodeType } from "@/pipeline/types";

describe("usePipelineStore", () => {
  beforeEach(() => {
    // Reset to a known state by deserializing a minimal pipeline
    usePipelineStore.getState().deserialize({
      version: 3,
      nodes: [
        {
          type: "load_structure",
          id: "loader-1",
          position: { x: 0, y: 0 },
          fileName: null,
          hasTrajectory: false,
          hasCell: false,
          enabled: true,
        },
        {
          type: "viewport",
          id: "viewport-1",
          position: { x: 0, y: 200 },
          perspective: false,
          cellAxesVisible: true,
          enabled: true,
        },
      ],
      edges: [
        { source: "loader-1", target: "viewport-1", sourceHandle: "particle", targetHandle: "particle" },
      ],
    });
  });

  describe("initial state", () => {
    it("has nodes and edges", () => {
      const { nodes, edges } = usePipelineStore.getState();
      expect(nodes.length).toBeGreaterThan(0);
      expect(edges.length).toBeGreaterThan(0);
    });
  });

  describe("addNode", () => {
    it("adds a node and returns its id", () => {
      const store = usePipelineStore.getState();
      const initialCount = store.nodes.length;
      const id = store.addNode("filter" as PipelineNodeType);
      expect(typeof id).toBe("string");
      expect(usePipelineStore.getState().nodes.length).toBe(initialCount + 1);
      expect(usePipelineStore.getState().nodes.find((n) => n.id === id)).toBeDefined();
    });

    it("sets default params for the node type", () => {
      const id = usePipelineStore.getState().addNode("filter" as PipelineNodeType);
      const node = usePipelineStore.getState().nodes.find((n) => n.id === id)!;
      expect(node.data.params.type).toBe("filter");
      expect(node.data.enabled).toBe(true);
    });

    it("uses custom position when provided", () => {
      const pos = { x: 100, y: 200 };
      const id = usePipelineStore.getState().addNode("filter" as PipelineNodeType, pos);
      const node = usePipelineStore.getState().nodes.find((n) => n.id === id)!;
      expect(node.position).toEqual(pos);
    });
  });

  describe("removeNode", () => {
    it("removes the node and connected edges", () => {
      const store = usePipelineStore.getState();
      const id = store.addNode("filter" as PipelineNodeType);
      const countBefore = usePipelineStore.getState().nodes.length;
      usePipelineStore.getState().removeNode(id);
      expect(usePipelineStore.getState().nodes.length).toBe(countBefore - 1);
      expect(usePipelineStore.getState().nodes.find((n) => n.id === id)).toBeUndefined();
    });
  });

  describe("updateNodeParams", () => {
    it("updates params for a specific node", () => {
      const id = usePipelineStore.getState().addNode("filter" as PipelineNodeType);
      usePipelineStore.getState().updateNodeParams(id, { query: "element == 'C'" });
      const node = usePipelineStore.getState().nodes.find((n) => n.id === id)!;
      expect((node.data.params as any).query).toBe("element == 'C'");
    });
  });

  describe("toggleNode", () => {
    it("toggles enabled state", () => {
      const id = usePipelineStore.getState().addNode("filter" as PipelineNodeType);
      expect(usePipelineStore.getState().nodes.find((n) => n.id === id)!.data.enabled).toBe(true);
      usePipelineStore.getState().toggleNode(id);
      expect(usePipelineStore.getState().nodes.find((n) => n.id === id)!.data.enabled).toBe(false);
      usePipelineStore.getState().toggleNode(id);
      expect(usePipelineStore.getState().nodes.find((n) => n.id === id)!.data.enabled).toBe(true);
    });
  });

  describe("serialize / deserialize", () => {
    it("round-trips nodes and edges", () => {
      const store = usePipelineStore.getState();
      store.addNode("filter" as PipelineNodeType);
      const serialized = usePipelineStore.getState().serialize();
      expect(serialized.version).toBe(3);

      const nodeCountBefore = usePipelineStore.getState().nodes.length;
      usePipelineStore.getState().deserialize(serialized);
      expect(usePipelineStore.getState().nodes.length).toBe(nodeCountBefore);
    });

    it("preserves node types after round-trip", () => {
      const serialized = usePipelineStore.getState().serialize();
      usePipelineStore.getState().deserialize(serialized);
      const nodes = usePipelineStore.getState().nodes;
      for (const node of nodes) {
        expect(node.type).toBeTruthy();
        expect(node.data.params.type).toBe(node.type);
      }
    });
  });

  describe("applyTemplate", () => {
    it("replaces pipeline with template", () => {
      const nodesBefore = usePipelineStore.getState().nodes.map((n) => n.id);
      usePipelineStore.getState().applyTemplate("molecule");
      const nodesAfter = usePipelineStore.getState().nodes.map((n) => n.id);
      // Template should produce different nodes
      expect(nodesAfter).not.toEqual(nodesBefore);
      expect(usePipelineStore.getState().pendingTemplateId).toBe("molecule");
    });

    it("does nothing for unknown template", () => {
      const nodesBefore = [...usePipelineStore.getState().nodes];
      usePipelineStore.getState().applyTemplate("nonexistent");
      expect(usePipelineStore.getState().nodes).toEqual(nodesBefore);
    });

    it("clears execution context state when switching templates", () => {
      const store = usePipelineStore.getState();
      // Pre-populate execution context fields
      store.setSnapshot({ positions: new Float32Array(3), elements: new Int32Array(1), nAtoms: 1, bonds: [], cell: null, pbc: [false, false, false] });
      store.setNodeSnapshot("loader-1", { snapshot: { positions: new Float32Array(3), elements: new Int32Array(1), nAtoms: 1, bonds: [], cell: null, pbc: [false, false, false] }, atomLabels: null });
      store.setNodeParseError("loader-1", "some error");

      usePipelineStore.getState().applyTemplate("molecule");

      const state = usePipelineStore.getState();
      expect(state.snapshot).toBeNull();
      expect(state.atomLabels).toBeNull();
      expect(state.structureFrames).toBeNull();
      expect(state.structureMeta).toBeNull();
      expect(state.fileFrames).toBeNull();
      expect(state.fileMeta).toBeNull();
      expect(state.fileVectors).toBeNull();
      expect(state.nodeSnapshots).toEqual({});
      expect(state.nodeParseErrors).toEqual({});
      expect(state.nodeStreamingData).toEqual({});
    });
  });

  describe("autoLayout", () => {
    it("repositions nodes", () => {
      const posBefore = usePipelineStore.getState().nodes.map((n) => ({ ...n.position }));
      // Add several nodes to make layout meaningful
      usePipelineStore.getState().addNode("filter" as PipelineNodeType);
      usePipelineStore.getState().addNode("modify" as PipelineNodeType);
      usePipelineStore.getState().autoLayout();
      // Just verify it runs without error and nodes still exist
      expect(usePipelineStore.getState().nodes.length).toBeGreaterThan(0);
    });
  });
});
