/**
 * Pipeline type definitions for the typed data-flow architecture.
 * Each edge carries typed data (Particle, Bond, Cell, Label, Mesh).
 * Nodes declare typed input/output ports; only matching types can connect.
 */

import type { Snapshot, Frame, TrajectoryMeta, BondSource } from "../types";

// ─── Pipeline Data Types ──────────────────────────────────────────────

/** The possible data types flowing through pipeline edges. */
export type PipelineDataType = "particle" | "bond" | "cell" | "label" | "mesh";

/** Colors for each data type (used for handles and edges). */
export const DATA_TYPE_COLORS: Record<PipelineDataType, string> = {
  particle: "#3b82f6", // blue
  bond: "#f59e0b",     // amber
  cell: "#10b981",     // emerald
  label: "#8b5cf6",    // violet
  mesh: "#6b7280",     // gray
};

/** Particle data flowing through the pipeline. Trajectory is embedded. */
export interface ParticleData {
  type: "particle";
  source: Snapshot;
  indices: Uint32Array | null;           // null = all atoms
  scaleOverrides: Float32Array | null;
  opacityOverrides: Float32Array | null;
  trajectory: { frames: Frame[]; meta: TrajectoryMeta } | null;
}

/** Bond data flowing through the pipeline. */
export interface BondData {
  type: "bond";
  bondIndices: Uint32Array;  // pairs: [a0,b0, a1,b1, ...]
  bondOrders: Uint8Array | null;
  nBonds: number;
  scale: number;
  opacity: number;
}

/** Simulation cell data. */
export interface CellData {
  type: "cell";
  box: Float32Array; // 3x3 row-major
  visible: boolean;
  axesVisible: boolean;
}

/** Text labels positioned at atom locations. */
export interface LabelData {
  type: "label";
  labels: string[];
  particleRef: ParticleData;
}

/** Mesh data for polyhedron rendering. */
export interface MeshData {
  type: "mesh";
  positions: Float32Array;          // flat xyz vertex positions
  indices: Uint32Array;             // triangle indices
  normals: Float32Array;            // per-vertex normals
  colors: Float32Array;             // per-vertex RGBA (length = nVertices * 4)
  opacity: number;
  showEdges: boolean;
  edgePositions: Float32Array | null; // line segment pairs for wireframe
}

/** Union of all pipeline data types. */
export type PipelineData = ParticleData | BondData | CellData | LabelData | MeshData;

// ─── Port Definitions ─────────────────────────────────────────────────

/** A named port on a node (input or output). */
export interface PortDefinition {
  name: string;                    // xyflow Handle id
  dataType: PipelineDataType;
  label: string;                   // display label
}

/** For generic nodes (filter/modify): accepted input types. */
export type GenericPortAccepts = PipelineDataType[];

// ─── Node Types ───────────────────────────────────────────────────────

/** All pipeline node type identifiers. */
export type PipelineNodeType =
  | "data_loader"
  | "viewport"
  | "filter"
  | "modify"
  | "label_generator"
  | "polyhedron_generator";

/** Human-readable labels for node types. */
export const NODE_TYPE_LABELS: Record<PipelineNodeType, string> = {
  data_loader: "Data Loader",
  viewport: "Viewport",
  filter: "Filter",
  modify: "Modify",
  label_generator: "Labels",
  polyhedron_generator: "Polyhedra",
};

// ─── Port Definitions Per Node Type ───────────────────────────────────

export interface NodePortConfig {
  inputs: PortDefinition[];
  outputs: PortDefinition[];
}

/** Static port definitions for each node type. */
export const NODE_PORTS: Record<PipelineNodeType, NodePortConfig> = {
  data_loader: {
    inputs: [],
    outputs: [
      { name: "particle", dataType: "particle", label: "Particle" },
      { name: "bond", dataType: "bond", label: "Bond" },
      { name: "cell", dataType: "cell", label: "Cell" },
    ],
  },
  viewport: {
    inputs: [
      { name: "particle", dataType: "particle", label: "Particle" },
      { name: "bond", dataType: "bond", label: "Bond" },
      { name: "cell", dataType: "cell", label: "Cell" },
      { name: "label", dataType: "label", label: "Label" },
      { name: "mesh", dataType: "mesh", label: "Mesh" },
    ],
    outputs: [],
  },
  filter: {
    inputs: [{ name: "in", dataType: "particle", label: "In" }],
    outputs: [{ name: "out", dataType: "particle", label: "Out" }],
  },
  modify: {
    inputs: [{ name: "in", dataType: "particle", label: "In" }],
    outputs: [{ name: "out", dataType: "particle", label: "Out" }],
  },
  label_generator: {
    inputs: [{ name: "particle", dataType: "particle", label: "Particle" }],
    outputs: [{ name: "label", dataType: "label", label: "Label" }],
  },
  polyhedron_generator: {
    inputs: [{ name: "particle", dataType: "particle", label: "Particle" }],
    outputs: [{ name: "mesh", dataType: "mesh", label: "Mesh" }],
  },
};

/**
 * For filter and modify nodes, the accepted input types.
 * Their port dataType is dynamically resolved from the connected edge.
 */
export const GENERIC_NODE_ACCEPTS: Record<string, PipelineDataType[]> = {
  filter: ["particle", "bond"],
  modify: ["particle", "bond"],
};

// ─── Node Parameters ──────────────────────────────────────────────────

export interface DataLoaderParams {
  type: "data_loader";
  fileName: string | null;
  bondSource: BondSource;
}

export interface ViewportParams {
  type: "viewport";
  perspective: boolean;
  cellAxesVisible: boolean;
}

export interface FilterParams {
  type: "filter";
  query: string;
}

export interface ModifyParams {
  type: "modify";
  scale: number;
  opacity: number;
}

export interface LabelGeneratorParams {
  type: "label_generator";
  source: "element" | "resname" | "index";
}

export interface PolyhedronGeneratorParams {
  type: "polyhedron_generator";
  centerElements: number[];      // atomic numbers of center atoms
  ligandElements: number[];      // atomic numbers of ligand atoms
  maxDistance: number;            // max bond distance in Angstroms
  opacity: number;               // face opacity 0-1
  showEdges: boolean;            // wireframe edges
}

/** Discriminated union of all node parameter types. */
export type PipelineNodeParams =
  | DataLoaderParams
  | ViewportParams
  | FilterParams
  | ModifyParams
  | LabelGeneratorParams
  | PolyhedronGeneratorParams;

/** Default parameters for each node type. */
export function defaultParams(type: PipelineNodeType): PipelineNodeParams {
  switch (type) {
    case "data_loader":
      return { type, fileName: null, bondSource: "structure" };
    case "viewport":
      return { type, perspective: false, cellAxesVisible: true };
    case "filter":
      return { type, query: "" };
    case "modify":
      return { type, scale: 1.0, opacity: 1.0 };
    case "label_generator":
      return { type, source: "element" };
    case "polyhedron_generator":
      return {
        type,
        centerElements: [],
        ligandElements: [8], // oxygen by default
        maxDistance: 2.5,
        opacity: 0.5,
        showEdges: false,
      };
  }
}

// ─── Connection Validation ────────────────────────────────────────────

/**
 * Check whether a connection between two ports is valid.
 * For static ports: source dataType must match target dataType.
 * For generic ports (filter/modify in): accepts particle or bond.
 */
export function canConnect(
  sourceNodeType: PipelineNodeType,
  sourceHandle: string | null,
  targetNodeType: PipelineNodeType,
  targetHandle: string | null,
): boolean {
  if (!sourceHandle || !targetHandle) return false;

  const sourcePorts = NODE_PORTS[sourceNodeType];
  const targetPorts = NODE_PORTS[targetNodeType];

  const sourcePort = sourcePorts.outputs.find((p) => p.name === sourceHandle);
  const targetPort = targetPorts.inputs.find((p) => p.name === targetHandle);

  if (!sourcePort || !targetPort) return false;

  // For generic nodes, check the accepted types list
  const acceptedTypes = GENERIC_NODE_ACCEPTS[targetNodeType];
  if (acceptedTypes) {
    return acceptedTypes.includes(sourcePort.dataType);
  }

  return sourcePort.dataType === targetPort.dataType;
}

/**
 * Resolve the effective data type for a generic node's input,
 * based on what is actually connected to it.
 */
export function resolveGenericPortType(
  sourceDataType: PipelineDataType,
): PipelineDataType {
  return sourceDataType;
}

// ─── Viewport State (output of pipeline execution) ────────────────────

/**
 * The collected data for rendering, produced by ViewportNode.
 */
export interface ViewportState {
  particles: ParticleData[];
  bonds: BondData[];
  cells: CellData[];
  labels: LabelData[];
  meshes: MeshData[];
  perspective: boolean;
  cellAxesVisible: boolean;
}

export const DEFAULT_VIEWPORT_STATE: ViewportState = {
  particles: [],
  bonds: [],
  cells: [],
  labels: [],
  meshes: [],
  perspective: false,
  cellAxesVisible: true,
};

// ─── Serialization Format ─────────────────────────────────────────────

export interface SerializedPipeline {
  version: 2;
  nodes: Array<
    PipelineNodeParams & {
      id: string;
      position: { x: number; y: number };
      enabled?: boolean;
    }
  >;
  edges: Array<{
    source: string;
    target: string;
    sourceHandle: string;
    targetHandle: string;
  }>;
}
