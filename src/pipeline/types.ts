/**
 * Pipeline type definitions for the typed data-flow architecture.
 * Each edge carries typed data (Particle, Bond, Cell, Label, Mesh).
 * Nodes declare typed input/output ports; only matching types can connect.
 */

import type { Snapshot, Frame, TrajectoryMeta, BondSource, VectorFrame } from "../types";

// ─── Pipeline Data Types ──────────────────────────────────────────────

/** The possible data types flowing through pipeline edges. */
export type PipelineDataType = "particle" | "bond" | "cell" | "label" | "mesh" | "trajectory" | "vector";

/** Colors for each data type (used for handles and edges). */
export const DATA_TYPE_COLORS: Record<PipelineDataType, string> = {
  particle: "#3b82f6", // blue
  bond: "#f59e0b",     // amber
  cell: "#10b981",     // emerald
  label: "#8b5cf6",    // violet
  mesh: "#6b7280",     // gray
  trajectory: "#ec4899", // pink
  vector: "#ef4444",     // red
};

/** Particle data flowing through the pipeline. */
export interface ParticleData {
  type: "particle";
  source: Snapshot;
  indices: Uint32Array | null;           // null = all atoms
  scaleOverrides: Float32Array | null;
  opacityOverrides: Float32Array | null;
}

/** Bond data flowing through the pipeline. */
export interface BondData {
  type: "bond";
  bondIndices: Uint32Array;  // pairs: [a0,b0, a1,b1, ...]
  bondOrders: Uint8Array | null;
  nBonds: number;
  scale: number;
  opacity: number;
  // Extended data for PBC half-bonds (ghost atoms appended)
  positions: Float32Array | null;  // null = use particle positions
  elements: Uint8Array | null;     // null = use particle elements
  nAtoms: number;                  // total atoms including ghosts (0 = use particle nAtoms)
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
  edgeColor: string;                // edge color as hex string (e.g. "#dddddd")
  edgeWidth: number;                // edge line width in pixels
}

/** Trajectory data flowing through the pipeline. */
export interface TrajectoryData {
  type: "trajectory";
  frames: Frame[];
  meta: TrajectoryMeta;
  source: "structure" | "file";
}

/** Per-atom vector data (e.g. forces) flowing through the pipeline. */
export interface VectorData {
  type: "vector";
  frames: VectorFrame[];
  nAtoms: number;
  scale: number;
}

/** Union of all pipeline data types. */
export type PipelineData = ParticleData | BondData | CellData | LabelData | MeshData | TrajectoryData | VectorData;

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
  | "load_structure"
  | "load_trajectory"
  | "load_vector"
  | "add_bond"
  | "viewport"
  | "filter"
  | "modify"
  | "label_generator"
  | "polyhedron_generator"
  | "vector_overlay";

/** Human-readable labels for node types. */
export const NODE_TYPE_LABELS: Record<PipelineNodeType, string> = {
  load_structure: "Load Structure",
  load_trajectory: "Load Trajectory",
  load_vector: "Load Vector",
  add_bond: "Add Bond",
  viewport: "Viewport",
  filter: "Filter",
  modify: "Modify",
  label_generator: "Labels",
  polyhedron_generator: "Polyhedra",
  vector_overlay: "Vectors",
};

// ─── Node Categories ──────────────────────────────────────────────────

/** Categories for visual grouping and color-coding. */
export type NodeCategory = "data_load" | "bond" | "filter" | "modify" | "overlay" | "viewport";

export const NODE_CATEGORY: Record<PipelineNodeType, NodeCategory> = {
  load_structure: "data_load",
  load_trajectory: "data_load",
  load_vector: "data_load",
  add_bond: "bond",
  filter: "filter",
  modify: "modify",
  label_generator: "overlay",
  polyhedron_generator: "overlay",
  vector_overlay: "overlay",
  viewport: "viewport",
};

export const NODE_CATEGORY_COLORS: Record<NodeCategory, string> = {
  data_load: "#3b82f6",  // blue
  bond: "#f59e0b",       // amber
  filter: "#10b981",     // green
  modify: "#8b5cf6",     // purple
  overlay: "#ec4899",    // pink
  viewport: "#64748b",   // slate
};

// ─── Port Definitions Per Node Type ───────────────────────────────────

export interface NodePortConfig {
  inputs: PortDefinition[];
  outputs: PortDefinition[];
}

/** Static port definitions for each node type. */
export const NODE_PORTS: Record<PipelineNodeType, NodePortConfig> = {
  load_structure: {
    inputs: [],
    outputs: [
      { name: "particle", dataType: "particle", label: "Particle" },
      { name: "trajectory", dataType: "trajectory", label: "Trajectory" },
      { name: "cell", dataType: "cell", label: "Cell" },
    ],
  },
  load_trajectory: {
    inputs: [
      { name: "particle", dataType: "particle", label: "Particle" },
    ],
    outputs: [
      { name: "trajectory", dataType: "trajectory", label: "Trajectory" },
    ],
  },
  load_vector: {
    inputs: [],
    outputs: [
      { name: "vector", dataType: "vector", label: "Vector" },
    ],
  },
  add_bond: {
    inputs: [
      { name: "particle", dataType: "particle", label: "Particle" },
    ],
    outputs: [
      { name: "bond", dataType: "bond", label: "Bond" },
    ],
  },
  viewport: {
    inputs: [
      { name: "particle", dataType: "particle", label: "Particle" },
      { name: "bond", dataType: "bond", label: "Bond" },
      { name: "cell", dataType: "cell", label: "Cell" },
      { name: "trajectory", dataType: "trajectory", label: "Trajectory" },
      { name: "label", dataType: "label", label: "Label" },
      { name: "mesh", dataType: "mesh", label: "Mesh" },
      { name: "vector", dataType: "vector", label: "Vector" },
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
  vector_overlay: {
    inputs: [{ name: "vector", dataType: "vector", label: "Vector" }],
    outputs: [{ name: "vector", dataType: "vector", label: "Vector" }],
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

export interface LoadStructureParams {
  type: "load_structure";
  fileName: string | null;
  /** Which output ports have data (determined by the loaded file). */
  hasTrajectory: boolean;
  hasCell: boolean;
}

export interface LoadTrajectoryParams {
  type: "load_trajectory";
  fileName: string | null;
}

export interface AddBondParams {
  type: "add_bond";
  bondSource: BondSource;
}

export interface ViewportParams {
  type: "viewport";
  perspective: boolean;
  cellAxesVisible: boolean;
  /** Tone mapping exposure (0.1–3.0, default 1.0). */
  toneMappingExposure: number;
  /** SSAO kernel radius (0–2, default 0.5). */
  ssaoKernelRadius: number;
  /** Bloom strength (0–1, default 0.15). */
  bloomStrength: number;
  /** Bloom threshold (0–1, default 0.85). Higher = only brightest areas bloom. */
  bloomThreshold: number;
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

export interface LoadVectorParams {
  type: "load_vector";
  fileName: string | null;
}

export interface VectorOverlayParams {
  type: "vector_overlay";
  scale: number;
}

export interface PolyhedronGeneratorParams {
  type: "polyhedron_generator";
  centerElements: number[];      // atomic numbers of center atoms
  ligandElements: number[];      // atomic numbers of ligand atoms
  maxDistance: number;            // max bond distance in Angstroms
  opacity: number;               // face opacity 0-1
  showEdges: boolean;            // wireframe edges
  edgeColor: string;             // edge color as hex string
  edgeWidth: number;             // edge line width in pixels
}

/** Discriminated union of all node parameter types. */
export type PipelineNodeParams =
  | LoadStructureParams
  | LoadTrajectoryParams
  | LoadVectorParams
  | AddBondParams
  | ViewportParams
  | FilterParams
  | ModifyParams
  | LabelGeneratorParams
  | PolyhedronGeneratorParams
  | VectorOverlayParams;

/** Default parameters for each node type. */
export function defaultParams(type: PipelineNodeType): PipelineNodeParams {
  switch (type) {
    case "load_structure":
      return { type, fileName: null, hasTrajectory: false, hasCell: false };
    case "load_trajectory":
      return { type, fileName: null };
    case "load_vector":
      return { type, fileName: null };
    case "add_bond":
      return { type, bondSource: "distance" };
    case "viewport":
      return {
        type,
        perspective: false,
        cellAxesVisible: true,
        toneMappingExposure: 1.0,
        ssaoKernelRadius: 0.5,
        bloomStrength: 0.15,
        bloomThreshold: 0.85,
      };
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
        edgeColor: "#dddddd",
        edgeWidth: 3,
      };
    case "vector_overlay":
      return { type, scale: 1.0 };
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
  trajectories: TrajectoryData[];
  labels: LabelData[];
  meshes: MeshData[];
  vectors: VectorData[];
  perspective: boolean;
  cellAxesVisible: boolean;
  toneMappingExposure: number;
  ssaoKernelRadius: number;
  bloomStrength: number;
  bloomThreshold: number;
}

export const DEFAULT_VIEWPORT_STATE: ViewportState = {
  particles: [],
  bonds: [],
  cells: [],
  trajectories: [],
  labels: [],
  meshes: [],
  vectors: [],
  perspective: false,
  cellAxesVisible: true,
  toneMappingExposure: 1.0,
  ssaoKernelRadius: 0.5,
  bloomStrength: 0.15,
  bloomThreshold: 0.85,
};

// ─── Serialization Format ─────────────────────────────────────────────

export interface SerializedPipeline {
  version: 3;
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
