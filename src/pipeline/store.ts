/**
 * Zustand store for pipeline state management.
 * Manages xyflow nodes/edges, pipeline execution, and serialization.
 */

import { create, type StateCreator, type StoreApi } from "zustand";
import { createStore } from "zustand/vanilla";
import type { Node, Edge, OnNodesChange, OnEdgesChange, Connection } from "@xyflow/react";
import { applyNodeChanges, applyEdgeChanges, addEdge } from "@xyflow/react";
import type { PipelineNodeData, PipelineExecutionContext, NodeSnapshotData } from "./execute";
import type { NodeStreamingData } from "./executors/streaming";
import type { Snapshot, Frame, TrajectoryMeta, VectorFrame } from "../types";
import type { PipelineNodeType, ViewportState, SerializedPipeline, NodeError } from "./types";
import { defaultParams, DEFAULT_VIEWPORT_STATE, canConnect } from "./types";
import { executePipeline } from "./execute";
import { validatePipeline } from "./validate";
import { serializePipeline, deserializePipeline } from "./serialize";
import { createDefaultPipeline, createDemoPipeline, createEmptyPipeline } from "./defaults";
import { PIPELINE_TEMPLATES } from "./templates";
import { getLayoutedElements } from "./layout";
import { performOpenFile, type OpenFileOptions } from "./openFile";

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

  // Drop any LoadTrajectory nodes and rewire their downstream `trajectory`
  // consumers to read directly from the LoadStructure node's `trajectory`
  // output. Used after loading a multi-frame structure file (.traj,
  // multi-frame .xyz, multi-MODEL .pdb, etc.) where the embedded frames flow
  // through the LoadStructure node, leaving LoadTrajectory redundant.
  removeLoadTrajectoryAndRewire: () => void;

  // Pipeline execution
  execute: () => void;

  // Single canonical file ingestion entry. Classifies by extension and
  // configures the pipeline accordingly. See openFile.ts for details.
  openFile: (file: File, opts?: OpenFileOptions) => Promise<void>;

  // Serialization
  serialize: () => SerializedPipeline;
  deserialize: (json: SerializedPipeline) => void;

  // Atomically replace the graph and per-node snapshots. Used by anywidget
  // hosts (Jupyter widget, VSCode webview) when Python pushes a new pipeline
  // alongside the per-node binary snapshot blobs. `deserialize` alone wipes
  // `nodeSnapshots` (so that opening a new .megane.json doesn't bleed state
  // across documents in JupyterLab); calling `setNodeSnapshot` *before*
  // `deserialize` therefore loses the snapshot. `loadPipeline` performs both
  // updates inside a single store transaction so the post-deserialize
  // execute() sees the matching per-node snapshots.
  loadPipeline: (json: SerializedPipeline, nodeSnapshots: Record<string, NodeSnapshotData>) => void;

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

const CLEARED_EXECUTION_CONTEXT = {
  snapshot: null,
  atomLabels: null,
  structureFrames: null,
  structureMeta: null,
  fileFrames: null,
  fileMeta: null,
  fileVectors: null,
  nodeSnapshots: {} as Record<string, NodeSnapshotData>,
  nodeParseErrors: {} as Record<string, string>,
  nodeStreamingData: {} as Record<string, NodeStreamingData>,
} as const;

const pipelineStateCreator: StateCreator<PipelineStore> = (set, get, api) => ({
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

  removeLoadTrajectoryAndRewire: () => {
    let mutated = false;
    set((state) => {
      const trajNodes = state.nodes.filter((n) => n.type === "load_trajectory");
      if (trajNodes.length === 0) return state;
      const loader = state.nodes.find((n) => n.type === "load_structure");
      if (!loader) return state;
      const trajIds = new Set(trajNodes.map((n) => n.id));

      const replacements: Edge[] = [];
      const hasEdge = (
        list: Edge[],
        target: string,
        targetHandle: string | null | undefined,
      ): boolean =>
        list.some(
          (x) =>
            x.source === loader.id &&
            x.sourceHandle === "trajectory" &&
            x.target === target &&
            (x.targetHandle ?? null) === (targetHandle ?? null),
        );

      for (const e of state.edges) {
        if (!trajIds.has(e.source)) continue;
        if (e.sourceHandle !== "trajectory" && e.sourceHandle != null) continue;
        if (hasEdge(state.edges, e.target, e.targetHandle)) continue;
        if (hasEdge(replacements, e.target, e.targetHandle)) continue;
        replacements.push({
          ...e,
          id: `e-${loader.id}-trajectory-${e.target}-${e.targetHandle ?? "trajectory"}`,
          source: loader.id,
          sourceHandle: "trajectory",
        });
      }

      const remainingNodes = state.nodes.filter((n) => !trajIds.has(n.id));
      const remainingEdges = state.edges.filter(
        (e) => !trajIds.has(e.source) && !trajIds.has(e.target),
      );

      const nextSnapshots = { ...state.nodeSnapshots };
      const nextParseErrors = { ...state.nodeParseErrors };
      const nextStreamingData = { ...state.nodeStreamingData };
      for (const id of trajIds) {
        delete nextSnapshots[id];
        delete nextParseErrors[id];
        delete nextStreamingData[id];
      }

      mutated = true;
      return {
        nodes: remainingNodes,
        edges: [...remainingEdges, ...replacements],
        nodeSnapshots: nextSnapshots,
        nodeParseErrors: nextParseErrors,
        nodeStreamingData: nextStreamingData,
      };
    });
    if (mutated) get().execute();
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

  openFile: async (file, opts) => {
    await performOpenFile(api, file, opts);
  },

  serialize: () => {
    const { nodes, edges } = get();
    return serializePipeline(nodes, edges);
  },

  deserialize: (json) => {
    const { nodes, edges } = deserializePipeline(json);
    // Clear all execution context tied to the previous graph: per-node
    // snapshots are keyed by node ID and would orphan across opens, but
    // worse, the global snapshot/frames/vectors fields would silently
    // bleed into the new pipeline's execution. Hosts (JupyterLab,
    // VSCode) reuse this singleton store across documents, so every
    // .megane.json open must start from a clean slate.
    set({
      nodes,
      edges,
      viewportState: { ...DEFAULT_VIEWPORT_STATE },
      ...CLEARED_EXECUTION_CONTEXT,
    });
    get().execute();
  },

  loadPipeline: (json, nodeSnapshots) => {
    const { nodes, edges } = deserializePipeline(json);
    // Pick a primary snapshot for the legacy `snapshot` field so the
    // Viewport's loadSnapshot path still has data to render. Iterate in
    // node-id order to be deterministic across hosts.
    const sortedIds = Object.keys(nodeSnapshots).sort();
    const primarySnapshot = sortedIds.length > 0 ? nodeSnapshots[sortedIds[0]].snapshot : null;
    set({
      nodes,
      edges,
      viewportState: { ...DEFAULT_VIEWPORT_STATE },
      ...CLEARED_EXECUTION_CONTEXT,
      nodeSnapshots: { ...nodeSnapshots },
      snapshot: primarySnapshot,
    });
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
      ...CLEARED_EXECUTION_CONTEXT,
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
      ...CLEARED_EXECUTION_CONTEXT,
    });
  },
});

// Default app-wide singleton — used by the webapp, PipelineEditor, node
// components, and any host that wants a shared global pipeline. The Jupyter
// widget intentionally does NOT use this: each MolecularViewer needs an
// isolated store so that two viewers in the same notebook don't stomp on
// each other's pipeline (loadPipeline replaces nodes/edges/snapshot).
export const usePipelineStore = create<PipelineStore>(pipelineStateCreator);

// Factory for hosts that need a private pipeline store (e.g. each Jupyter
// widget instance). Returns a vanilla Zustand store; consume with `useStore`
// from "zustand" inside React.
export function createPipelineStore(): StoreApi<PipelineStore> {
  return createStore<PipelineStore>(pipelineStateCreator);
}

// ── Test-only window hook ──────────────────────────────────────────────
// When testMode is detected we expose the Zustand store on the global so
// Playwright specs (under tests/e2e/lib/pipeline.ts) can drive
// addNode / removeNode / connectEdge / updateNodeParams without scripting
// React Flow mouse interactions. No-op outside testMode.
(() => {
  if (typeof window === "undefined") return;
  try {
    const g = globalThis as { __MEGANE_TEST__?: boolean };
    let testMode = g.__MEGANE_TEST__ === true;
    if (!testMode) {
      const params = new URLSearchParams(window.location?.search ?? "");
      if (params.get("test") === "1") testMode = true;
    }
    if (!testMode && window.parent && window.parent !== window) {
      const pg = (window.parent as Window & { __MEGANE_TEST__?: boolean }).__MEGANE_TEST__;
      if (pg) testMode = true;
    }
    if (!testMode) return;
    (
      window as Window & { __megane_test_pipeline_store?: typeof usePipelineStore }
    ).__megane_test_pipeline_store = usePipelineStore;
  } catch {
    /* noop — same-origin checks may throw inside cross-origin frames */
  }
})();
