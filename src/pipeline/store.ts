/**
 * Zustand store for pipeline state management.
 * Manages xyflow nodes/edges, pipeline execution, and serialization.
 */

import { create } from "zustand";
import type { Node, Edge, OnNodesChange, OnEdgesChange, Connection } from "@xyflow/react";
import { applyNodeChanges, applyEdgeChanges, addEdge } from "@xyflow/react";
import type { PipelineNodeData, PipelineExecutionContext, NodeSnapshotData } from "./execute";
import type { NodeStreamingData } from "./executors/streaming";
import type { Snapshot, Frame, TrajectoryMeta, VectorFrame } from "../types";
import type { PipelineNodeType, ViewportState, SerializedPipeline, NodeError } from "./types";
import {
  defaultParams,
  DEFAULT_VIEWPORT_STATE,
  canConnect,
  NODE_PORTS,
  GENERIC_NODE_ACCEPTS,
} from "./types";
import { executePipeline } from "./execute";
import { validatePipeline } from "./validate";
import { serializePipeline, deserializePipeline } from "./serialize";
import { createDefaultPipeline, createDemoPipeline, createEmptyPipeline } from "./defaults";
import { PIPELINE_TEMPLATES } from "./templates";
import { getLayoutedElements } from "./layout";

let nextNodeId = 1;

function generateNodeId(): string {
  return `node-${nextNodeId++}`;
}

export interface PipelineStore {
  // xyflow state
  nodes: Node<PipelineNodeData>[];
  edges: Edge[];
  viewportState: ViewportState;
  nodeErrors: Record<string, NodeError[]>;

  // Molecular data for pipeline execution context
  snapshot: Snapshot | null;
  atomLabels: string[] | null;
  structureFrames: Frame[] | null;
  structureMeta: TrajectoryMeta | null;
  fileFrames: Frame[] | null;
  fileMeta: TrajectoryMeta | null;
  fileVectors: VectorFrame[] | null;

  // Per-node snapshot storage (keyed by load_structure node ID)
  nodeSnapshots: Record<string, NodeSnapshotData>;
  nodeParseErrors: Record<string, string>;

  // Per-node streaming data (keyed by streaming node ID)
  nodeStreamingData: Record<string, NodeStreamingData>;

  setSnapshot: (s: Snapshot | null) => void;
  setAtomLabels: (labels: string[] | null) => void;
  setStructureFrames: (frames: Frame[] | null, meta: TrajectoryMeta | null) => void;
  setFileFrames: (frames: Frame[] | null, meta: TrajectoryMeta | null) => void;
  setFileVectors: (vectors: VectorFrame[] | null) => void;
  setNodeSnapshot: (nodeId: string, data: NodeSnapshotData) => void;
  removeNodeSnapshot: (nodeId: string) => void;
  setNodeParseError: (nodeId: string, message: string) => void;
  clearNodeParseError: (nodeId: string) => void;
  setNodeStreamingData: (nodeId: string, data: NodeStreamingData) => void;
  removeNodeStreamingData: (nodeId: string) => void;

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

  // Layout
  autoLayout: () => void;

  // Reset
  reset: () => void;
}

function getInitialPipeline() {
  const search = new URLSearchParams(globalThis.location?.search ?? "");
  if (search.has("demo")) return createDemoPipeline();
  if ((globalThis as any).__MEGANE_CONTEXT__ === "vscode") return createEmptyPipeline();
  return createDefaultPipeline();
}

const rawDefault = getInitialPipeline();
const defaultState = getLayoutedElements(rawDefault.nodes, rawDefault.edges);

export const usePipelineStore = create<PipelineStore>((set, get) => ({
  nodes: defaultState.nodes,
  edges: defaultState.edges,
  viewportState: { ...DEFAULT_VIEWPORT_STATE },
  nodeErrors: {},
  snapshot: null,
  atomLabels: null,
  structureFrames: null,
  structureMeta: null,
  fileFrames: null,
  fileMeta: null,
  fileVectors: null,
  nodeSnapshots: {},
  nodeParseErrors: {},
  nodeStreamingData: {},

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

  setNodeSnapshot: (nodeId, data) => {
    set((state) => ({
      nodeSnapshots: { ...state.nodeSnapshots, [nodeId]: data },
    }));
    get().execute();
  },

  removeNodeSnapshot: (nodeId) => {
    set((state) => {
      const { [nodeId]: _, ...rest } = state.nodeSnapshots;
      const { [nodeId]: __, ...restErrors } = state.nodeParseErrors;
      return { nodeSnapshots: rest, nodeParseErrors: restErrors };
    });
    get().execute();
  },

  setNodeParseError: (nodeId, message) => {
    set((state) => ({
      nodeParseErrors: { ...state.nodeParseErrors, [nodeId]: message },
    }));
    get().execute();
  },

  clearNodeParseError: (nodeId) => {
    set((state) => {
      const { [nodeId]: _, ...rest } = state.nodeParseErrors;
      return { nodeParseErrors: rest };
    });
  },

  setNodeStreamingData: (nodeId, data) => {
    set((state) => ({
      nodeStreamingData: { ...state.nodeStreamingData, [nodeId]: data },
    }));
    get().execute();
  },

  removeNodeStreamingData: (nodeId) => {
    set((state) => {
      const { [nodeId]: _, ...rest } = state.nodeStreamingData;
      return { nodeStreamingData: rest };
    });
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
    // Only re-execute pipeline for structural changes (node removal),
    // not for position/dimension/selection changes which don't affect pipeline logic.
    if (filtered.some((c) => c.type === "remove")) {
      get().execute();
    }
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
    let fallbackPosition = { x: 425, y: 50 };
    if (!position) {
      const currentNodes = get().nodes;
      if (currentNodes.length > 0) {
        const maxY = Math.max(...currentNodes.map((n) => n.position.y));
        fallbackPosition = { x: 425, y: maxY + 200 };
      }
    }
    const newNode: Node<PipelineNodeData> = {
      id,
      type,
      position: position ?? fallbackPosition,
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
    set((state) => {
      const { [id]: _, ...restSnapshots } = state.nodeSnapshots;
      const { [id]: __, ...restParseErrors } = state.nodeParseErrors;
      const { [id]: ___, ...restStreaming } = state.nodeStreamingData;
      return {
        nodes: state.nodes.filter((n) => n.id !== id),
        edges: state.edges.filter((e) => e.source !== id && e.target !== id),
        nodeSnapshots: restSnapshots,
        nodeParseErrors: restParseErrors,
        nodeStreamingData: restStreaming,
      };
    });
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
    const {
      nodes,
      edges,
      snapshot,
      atomLabels,
      structureFrames,
      structureMeta,
      fileFrames,
      fileMeta,
      fileVectors,
      nodeSnapshots,
      nodeParseErrors,
      nodeStreamingData,
    } = get();
    const ctx: PipelineExecutionContext = {
      snapshot,
      atomLabels,
      structureFrames,
      structureMeta,
      fileFrames,
      fileMeta,
      fileVectors,
      nodeSnapshots,
      nodeStreamingData,
    };

    // Run validation and execution
    const validationErrors = validatePipeline(nodes, edges);
    const { viewportState, nodeErrors: executionErrors } = executePipeline(nodes, edges, ctx);

    // Merge validation, execution, and parse errors
    const merged: Record<string, NodeError[]> = {};
    for (const [id, errs] of validationErrors) {
      merged[id] = [...errs];
    }
    for (const [id, errs] of executionErrors) {
      if (!merged[id]) merged[id] = [];
      merged[id].push(...errs);
    }
    for (const [id, message] of Object.entries(nodeParseErrors)) {
      if (!merged[id]) merged[id] = [];
      merged[id].push({ message, severity: "error" });
    }

    set({ viewportState, nodeErrors: merged });
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
    const raw = template.create();
    const { nodes, edges } = getLayoutedElements(raw.nodes, raw.edges);
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

  autoLayout: () => {
    const { nodes, edges } = get();
    const { nodes: layoutedNodes } = getLayoutedElements(nodes, edges);
    set({ nodes: layoutedNodes });
  },

  reset: () => {
    const def = getInitialPipeline();
    set({
      nodes: def.nodes,
      edges: def.edges,
      viewportState: { ...DEFAULT_VIEWPORT_STATE },
    });
  },
}));
