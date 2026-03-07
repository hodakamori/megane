/**
 * Zustand store for pipeline state management.
 * Manages xyflow nodes/edges, pipeline execution, and serialization.
 */

import { create } from "zustand";
import type { Node, Edge, OnNodesChange, OnEdgesChange, Connection } from "@xyflow/react";
import { applyNodeChanges, applyEdgeChanges, addEdge } from "@xyflow/react";
import type { PipelineNodeData } from "./execute";
import type { Snapshot } from "../types";
import type { PipelineNodeType, RenderState, SerializedPipeline } from "./types";
import { defaultParams, DEFAULT_RENDER_STATE, canConnect } from "./types";
import { executePipeline } from "./execute";
import { serializePipeline, deserializePipeline } from "./serialize";
import { createDefaultPipeline, createDemoPipeline } from "./defaults";

let nextNodeId = 1;

function generateNodeId(): string {
  return `node-${nextNodeId++}`;
}

export interface PipelineStore {
  // xyflow state
  nodes: Node<PipelineNodeData>[];
  edges: Edge[];
  renderState: RenderState;

  // Molecular data for selection queries
  snapshot: Snapshot | null;
  atomLabels: string[] | null;
  setSnapshot: (s: Snapshot | null) => void;
  setAtomLabels: (labels: string[] | null) => void;

  // xyflow change handlers
  onNodesChange: OnNodesChange<Node<PipelineNodeData>>;
  onEdgesChange: OnEdgesChange;
  onConnect: (connection: Connection) => void;

  // Node operations
  addNode: (type: PipelineNodeType, position?: { x: number; y: number }) => string;
  removeNode: (id: string) => void;
  updateNodeParams: (id: string, params: Record<string, unknown>) => void;
  toggleNode: (id: string) => void;

  // Pipeline execution
  execute: () => void;

  // Serialization
  serialize: () => SerializedPipeline;
  deserialize: (json: SerializedPipeline) => void;

  // Reset
  reset: () => void;
}

const defaultState = new URLSearchParams(globalThis.location?.search ?? "").has("demo")
  ? createDemoPipeline()
  : createDefaultPipeline();

export const usePipelineStore = create<PipelineStore>((set, get) => ({
  nodes: defaultState.nodes,
  edges: defaultState.edges,
  renderState: { ...DEFAULT_RENDER_STATE },
  snapshot: null,
  atomLabels: null,
  setSnapshot: (s) => {
    set({ snapshot: s });
    get().execute();
  },
  setAtomLabels: (labels) => {
    set({ atomLabels: labels });
    get().execute();
  },

  onNodesChange: (changes) => {
    set((state) => ({
      nodes: applyNodeChanges(changes, state.nodes),
    }));
    // Re-execute after position/selection changes
    get().execute();
  },

  onEdgesChange: (changes) => {
    set((state) => ({
      edges: applyEdgeChanges(changes, state.edges),
    }));
    get().execute();
  },

  onConnect: (connection) => {
    // Validate connection before adding edge
    const { nodes } = get();
    const sourceNode = nodes.find((n) => n.id === connection.source);
    const targetNode = nodes.find((n) => n.id === connection.target);
    if (!sourceNode?.type || !targetNode?.type) return;
    if (!canConnect(sourceNode.type as PipelineNodeType, targetNode.type as PipelineNodeType)) return;

    set((state) => ({
      edges: addEdge(
        { ...connection, id: `e-${connection.source}-${connection.target}` },
        state.edges,
      ),
    }));
    get().execute();
  },

  addNode: (type, position) => {
    const id = generateNodeId();
    const newNode: Node<PipelineNodeData> = {
      id,
      type,
      position: position ?? { x: 250, y: (get().nodes.length) * 200 + 50 },
      data: {
        params: defaultParams(type),
        enabled: true,
      },
    };
    set((state) => ({
      nodes: [...state.nodes, newNode],
    }));
    return id;
  },

  removeNode: (id) => {
    set((state) => ({
      nodes: state.nodes.filter((n) => n.id !== id),
      edges: state.edges.filter((e) => e.source !== id && e.target !== id),
    }));
    get().execute();
  },

  updateNodeParams: (id, params) => {
    set((state) => ({
      nodes: state.nodes.map((n) => {
        if (n.id !== id) return n;
        return {
          ...n,
          data: {
            ...n.data,
            params: { ...n.data.params, ...params },
          },
        };
      }),
    }));
    get().execute();
  },

  toggleNode: (id) => {
    set((state) => ({
      nodes: state.nodes.map((n) => {
        if (n.id !== id) return n;
        return {
          ...n,
          data: { ...n.data, enabled: !n.data.enabled },
        };
      }),
    }));
    get().execute();
  },

  execute: () => {
    const { nodes, edges, snapshot, atomLabels } = get();
    const renderState = executePipeline(nodes, edges, snapshot, atomLabels);
    set({ renderState });
  },

  serialize: () => {
    const { nodes, edges } = get();
    return serializePipeline(nodes, edges);
  },

  deserialize: (json) => {
    const { nodes, edges } = deserializePipeline(json);
    set({ nodes, edges });
    get().execute();
  },

  reset: () => {
    const def = createDefaultPipeline();
    set({
      nodes: def.nodes,
      edges: def.edges,
      renderState: { ...DEFAULT_RENDER_STATE },
    });
  },
}));
