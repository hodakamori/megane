/**
 * Pipeline type definitions for the typed data-flow architecture.
 * Each edge carries typed data (Particle, Bond, Cell, Label, Mesh).
 * Nodes declare typed input/output ports; only matching types can connect.
 */

import type { Snapshot, Frame, TrajectoryMeta, BondSource, VectorFrame } from "../types";

// ─── Pipeline Data Types ──────────────────────────────────────────────

/** The possible data types flowing through pipeline edges. */
export type PipelineDataType =
  | "particle"
  | "bond"
  | "cell"
  | "label"
  | "mesh"
  | "trajectory"
  | "vector";

/** Colors for each data type (used for handles and edges). */
export const DATA_TYPE_COLORS: Record<PipelineDataType, string> = {
  particle: "#3b82f6", // blue
  bond: "#f59e0b", // amber
  cell: "#10b981", // emerald
  label: "#8b5cf6", // violet
  mesh: "#6b7280", // gray
  trajectory: "#ec4899", // pink
  vector: "#ef4444", // red
};

/** Particle data flowing through the pipeline. */
export interface ParticleData {
  type: "particle";
  source: Snapshot;
  sourceNodeId: string; // load_structure node that produced this
  indices: Uint32Array | null; // null = all atoms
  scaleOverrides: Float32Array | null;
  opacityOverrides: Float32Array | null;
  /**
   * Per-atom RGB overrides in [0,1]. length === nAtoms * 3 (interleaved r,g,b).
   * NaN in the r channel for an atom signals "no override; fall through to base".
   * null = this stream carries no color overrides at all.
   */
  colorOverrides: Float32Array | null;
}

/** Bond data flowing through the pipeline. */
export interface BondData {
  type: "bond";
  sourceNodeId: string; // load_structure node that produced the particles
  bondIndices: Uint32Array; // pairs: [a0,b0, a1,b1, ...]
  bondOrders: Uint8Array | null;
  nBonds: number;
  scale: number;
  opacity: number;
  // Extended data for PBC half-bonds (ghost atoms appended)
  positions: Float32Array | null; // null = use particle positions
  elements: Uint8Array | null; // null = use particle elements
  nAtoms: number; // total atoms including ghosts (0 = use particle nAtoms)
  // Base atom elements (non-ghost), used by bond filter for element/atom_index queries
  atomElements: Uint8Array | null;
  // Bond selection (set by filter node with bond_query)
  selectedBondIndices: Uint32Array | null; // null = all bonds selected
  // Per-bond opacity overrides (set by modify node when selectedBondIndices is non-null)
  bondOpacityOverrides: Float32Array | null; // length = nBonds
}

/** Simulation cell data. */
export interface CellData {
  type: "cell";
  sourceNodeId: string; // load_structure node that produced this
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
  positions: Float32Array; // flat xyz vertex positions
  indices: Uint32Array; // triangle indices
  normals: Float32Array; // per-vertex normals
  colors: Float32Array; // per-vertex RGBA (length = nVertices * 4)
  opacity: number;
  showEdges: boolean;
  edgePositions: Float32Array | null; // line segment pairs for wireframe
  edgeColor: string; // edge color as hex string (e.g. "#dddddd")
  edgeWidth: number; // edge line width in pixels
}

// ─── Frame Provider ──────────────────────────────────────────────────

/** Abstract interface for frame delivery (memory or streaming). */
export interface FrameProvider {
  readonly kind: "memory" | "stream";
  /** Get a frame by index. Returns null if not yet available (streaming). */
  getFrame(index: number): Frame | null;
  readonly meta: TrajectoryMeta;
}

/** In-memory frame provider wrapping a Frame[]. */
export class MemoryFrameProvider implements FrameProvider {
  readonly kind = "memory" as const;
  readonly meta: TrajectoryMeta;
  private readonly frames: Frame[];
  private readonly basePositions: Float32Array | null;

  constructor(frames: Frame[], meta: TrajectoryMeta, basePositions?: Float32Array | null) {
    this.frames = frames;
    this.meta = meta;
    this.basePositions = basePositions ?? null;
  }

  getFrame(index: number): Frame | null {
    if (index === 0 && this.basePositions) {
      return {
        frameId: 0,
        nAtoms: this.meta.nAtoms,
        positions: this.basePositions,
      };
    }
    const f = this.frames[index - (this.basePositions ? 1 : 0)];
    return f ?? null;
  }
}

/** Trajectory data flowing through the pipeline. */
export interface TrajectoryData {
  type: "trajectory";
  provider: FrameProvider;
  meta: TrajectoryMeta;
  source: "structure" | "file" | "stream";
}

/** Per-atom vector data (e.g. forces) flowing through the pipeline. */
export interface VectorData {
  type: "vector";
  frames: VectorFrame[];
  nAtoms: number;
  scale: number;
}

/** Union of all pipeline data types. */
export type PipelineData =
  | ParticleData
  | BondData
  | CellData
  | LabelData
  | MeshData
  | TrajectoryData
  | VectorData;

// ─── Port Definitions ─────────────────────────────────────────────────

/** A named port on a node (input or output). */
export interface PortDefinition {
  name: string; // xyflow Handle id
  dataType: PipelineDataType;
  label: string; // display label
}

/** For generic nodes (filter/modify): accepted input types. */
export type GenericPortAccepts = PipelineDataType[];

// ─── Node Types ───────────────────────────────────────────────────────

/** All pipeline node type identifiers. */
export type PipelineNodeType =
  | "load_structure"
  | "load_trajectory"
  | "load_vector"
  | "streaming"
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
  streaming: "Streaming",
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
  streaming: "data_load",
  add_bond: "bond",
  filter: "filter",
  modify: "modify",
  label_generator: "overlay",
  polyhedron_generator: "overlay",
  vector_overlay: "overlay",
  viewport: "viewport",
};

export const NODE_CATEGORY_COLORS: Record<NodeCategory, string> = {
  data_load: "#3b82f6", // blue
  bond: "#f59e0b", // amber
  filter: "#10b981", // green
  modify: "#8b5cf6", // purple
  overlay: "#ec4899", // pink
  viewport: "#64748b", // slate
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
    inputs: [{ name: "particle", dataType: "particle", label: "Particle" }],
    outputs: [{ name: "trajectory", dataType: "trajectory", label: "Trajectory" }],
  },
  streaming: {
    inputs: [],
    outputs: [
      { name: "particle", dataType: "particle", label: "Particle" },
      { name: "bond", dataType: "bond", label: "Bond" },
      { name: "trajectory", dataType: "trajectory", label: "Trajectory" },
      { name: "cell", dataType: "cell", label: "Cell" },
    ],
  },
  load_vector: {
    inputs: [],
    outputs: [{ name: "vector", dataType: "vector", label: "Vector" }],
  },
  add_bond: {
    inputs: [{ name: "particle", dataType: "particle", label: "Particle" }],
    outputs: [{ name: "bond", dataType: "bond", label: "Bond" }],
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
  /** URL for PipelineViewer to fetch (relative or absolute). Not used by the execution engine. */
  fileUrl?: string;
  /** Which output ports have data (determined by the loaded file). */
  hasTrajectory: boolean;
  hasCell: boolean;
}

export interface LoadTrajectoryParams {
  type: "load_trajectory";
  fileName: string | null;
}

export interface StreamingParams {
  type: "streaming";
  connected: boolean;
}

export interface AddBondParams {
  type: "add_bond";
  bondSource: BondSource;
  bondFileName?: string | null;
  /** Ephemeral: parsed bond indices from topology file. Not serialized. */
  bondFileData?: Uint32Array | null;
}

/** Visual representation mode selectable in the Viewport node. */
export type RepresentationMode = "atoms" | "cartoon" | "both" | "surface";

export interface ViewportParams {
  type: "viewport";
  perspective: boolean;
  cellAxesVisible: boolean;
  pivotMarkerVisible: boolean;
  /** Visual representation: "atoms" (default), "cartoon", or "both". */
  representationMode: RepresentationMode;
}

export interface FilterParams {
  type: "filter";
  query: string;
  bond_query?: string; // bond selection query (empty/undefined = no filtering)
}

/** Per-atom palette modes for the Modify node's color section. */
export type ColorMode =
  | "uniform"
  | "byElement"
  | "byResidue"
  | "byChain"
  | "byBFactor"
  | "byProperty";

export interface ModifyParams {
  type: "modify";
  scale: number;
  opacity: number;
  /** When true, recolor the upstream selection using colorMode. */
  colorEnabled: boolean;
  colorMode: ColorMode;
  /** Hex color string used when colorMode === "uniform" (e.g. "#ff8800"). */
  uniformColor: string;
  /** Optional explicit range for byBFactor / byProperty. Undefined = auto. */
  colorRange?: [number, number];
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
  centerElements: number[]; // atomic numbers of center atoms
  ligandElements: number[]; // atomic numbers of ligand atoms
  maxDistance: number; // max bond distance in Angstroms
  opacity: number; // face opacity 0-1
  showEdges: boolean; // wireframe edges
  edgeColor: string; // edge color as hex string
  edgeWidth: number; // edge line width in pixels
}

/** Discriminated union of all node parameter types. */
export type PipelineNodeParams =
  | LoadStructureParams
  | LoadTrajectoryParams
  | LoadVectorParams
  | StreamingParams
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
    case "streaming":
      return { type, connected: false };
    case "load_vector":
      return { type, fileName: null };
    case "add_bond":
      return { type, bondSource: "distance" };
    case "viewport":
      return {
        type,
        perspective: false,
        cellAxesVisible: true,
        pivotMarkerVisible: true,
        representationMode: "atoms" as RepresentationMode,
      };
    case "filter":
      return { type, query: "", bond_query: "" };
    case "modify":
      return {
        type,
        scale: 1.0,
        opacity: 1.0,
        colorEnabled: false,
        colorMode: "uniform",
        uniformColor: "#ff8800",
      };
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
export function resolveGenericPortType(sourceDataType: PipelineDataType): PipelineDataType {
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
  pivotMarkerVisible: boolean;
  representationMode: RepresentationMode;
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
  pivotMarkerVisible: true,
  representationMode: "atoms",
};

// ─── Node Errors ──────────────────────────────────────────────────────

export type NodeErrorSeverity = "error" | "warning";

export interface NodeError {
  message: string;
  severity: NodeErrorSeverity;
}

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
