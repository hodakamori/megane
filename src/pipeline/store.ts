/**
 * Zustand store for pipeline state management.
 * Manages xyflow nodes/edges, pipeline execution, and serialization.
 */

import { create } from "zustand";
import type { Node, Edge, OnNodesChange, OnEdgesChange, Connection } from "@xyflow/react";
import { applyNodeChanges, applyEdgeChanges, addEdge } from "@xyflow/react";
import type { PipelineNodeData, PipelineExecutionContext } from "./execute";
import type { Snapshot, Frame, TrajectoryMeta, VectorFrame } from "../types";
import type { PipelineNodeType, ViewportState, SerializedPipeline } from "./types";
import { defaultParams, DEFAULT_VIEWPORT_STATE, canConnect, NODE_PORTS, GENERIC_NODE_ACCEPTS } from "./types";
import { executePipeline } from "./execute";
import { serializePipeline, deserializePipeline } from "./serialize";
import { createDefaultPipeline, createDemoPipeline } from "./defaults";
import { PIPELINE_TEMPLATES } from "./templates";

let nextNodeId = 1;

function generateNodeId(): string {
  return `node-${nextNodeId++}`;
}

export interface PipelineStore {
  // xyflow state
  nodes: Node<PipelineNodeData>[];
  edges: Edge[];
  viewportState: ViewportState;

  // Molecular data for pipeline execution context
  snapshot: Snapshot | null;
  atomLabels: string[] | null;
  structureFrames: Frame[] | null;
  structureMeta: TrajectoryMeta | null;
  fileFrames: Frame[] | null;
  fileMeta: TrajectoryMeta | null;
  fileVectors: VectorFrame[] | null;

  setSnapshot: (s: Snapshot | null) => void;
  setAtomLabels: (labels: string[] | null) => void;
  setStructureFrames: (frames: Frame[] | null, meta: TrajectoryMeta | null) => void;
  setFileFrames: (frames: Frame[] | null, meta: TrajectoryMeta | null) => void;
  setFileVectors: (vectors: VectorFrame[] | null) => void;

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

  // Templates
  pendingTemplateId: string | null;
  applyTemplate: (templateId: string) => void;
  clearPendingTemplate: () => void;

  // Reset
  reset: () => void;
}

const defaultState = new URLSearchParams(globalThis.location?.search ?? "").has("demo")
  ? createDemoPipeline()
  : createDefaultPipeline();

export const usePipelineStore = create<PipelineStore>((set, get) => ({
  nodes: defaultState.nodes,
  edges: defaultState.edges,
  viewportState: { ...DEFAULT_VIEWPORT_STATE },
  snapshot: null,
  atomLabels: null,
  structureFrames: null,
  structureMeta: null,
  fileFrames: null,
  fileMeta: null,
  fileVectors: null,

  setSnapshot: (s) => {
    set({ snapshot: s });
    get().execute();
  },
  setAtomLabels: (labels) => {
    set({ atomLabels: labels });
    get().execute();
  },
  setStructureFrames: (frames, meta) => {
    set({ structureFrames: frames, structureMeta: meta });
    get().execute();
  },
  setFileFrames: (frames, meta) => {
    set({ fileFrames: frames, fileMeta: meta });
    get().execute();
  },
  setFileVectors: (vectors) => {
    set({ fileVectors: vectors });
    get().execute();
  },

  onNodesChange: (changes) => {
    // Prevent viewport nodes from being deleted (via keyboard Delete etc.)
    const { nodes } = get();
    const filtered = changes.filter((change) => {
      if (change.type === "remove") {
        const node = nodes.find((n) => n.id === change.id);
        if (node?.type === "viewport") return false;
      }
      return true;
    });
    if (filtered.length === 0) return;
    set((state) => ({
      nodes: applyNodeChanges(filtered, state.nodes),
    }));
    get().execute();
  },

  onEdgesChange: (changes) => {
    set((state) => ({
      edges: applyEdgeChanges(changes, state.edges),
    }));
    get().execute();
  },

  onConnect: (connection) => {
    const { nodes } = get();
    const sourceNode = nodes.find((n) => n.id === connection.source);
    const targetNode = nodes.find((n) => n.id === connection.target);
    if (!sourceNode?.type || !targetNode?.type) return;

    if (
      !canConnect(
        sourceNode.type as PipelineNodeType,
        connection.sourceHandle ?? null,
        targetNode.type as PipelineNodeType,
        connection.targetHandle ?? null,
      )
    ) {
      return;
    }

    set((state) => ({
      edges: addEdge(
        {
          ...connection,
          id: `e-${connection.source}-${connection.sourceHandle}-${connection.target}-${connection.targetHandle}`,
        },
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
      position: position ?? { x: 425, y: get().nodes.length * 340 + 50 },
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
    const { nodes, edges, snapshot, atomLabels, structureFrames, structureMeta, fileFrames, fileMeta, fileVectors } = get();
    const ctx: PipelineExecutionContext = {
      snapshot,
      atomLabels,
      structureFrames,
      structureMeta,
      fileFrames,
      fileMeta,
      fileVectors,
    };
    const viewportState = executePipeline(nodes, edges, ctx);
    set({ viewportState });
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

  pendingTemplateId: null,

  applyTemplate: (templateId) => {
    const template = PIPELINE_TEMPLATES.find((t) => t.id === templateId);
    if (!template) return;
    const { nodes, edges } = template.create();
    set({
      nodes,
      edges,
      viewportState: { ...DEFAULT_VIEWPORT_STATE },
      pendingTemplateId: templateId,
    });
    get().execute();
  },

  clearPendingTemplate: () => {
    set({ pendingTemplateId: null });
  },

  reset: () => {
    const def = createDefaultPipeline();
    set({
      nodes: def.nodes,
      edges: def.edges,
      viewportState: { ...DEFAULT_VIEWPORT_STATE },
    });
  },
}));
