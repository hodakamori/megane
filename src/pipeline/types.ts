/**
 * Pipeline type definitions.
 * Defines node types, parameters, render state, and serialization format.
 */

import type { BondSource, TrajectorySource, LabelSource, VectorSource } from "../types";

/** All possible pipeline node type identifiers. */
export type PipelineNodeType =
  | "load_structure"
  | "set_atom_scale"
  | "set_atom_opacity"
  | "set_bond_source"
  | "set_bond_scale"
  | "set_bond_opacity"
  | "set_labels"
  | "set_vectors"
  | "set_display"
  | "set_cell_visibility";

/** Human-readable labels for node types. */
export const NODE_TYPE_LABELS: Record<PipelineNodeType, string> = {
  load_structure: "Load Structure",
  set_atom_scale: "Atom Scale",
  set_atom_opacity: "Atom Opacity",
  set_bond_source: "Bond Source",
  set_bond_scale: "Bond Scale",
  set_bond_opacity: "Bond Opacity",
  set_labels: "Labels",
  set_vectors: "Vectors",
  set_display: "Display",
  set_cell_visibility: "Cell Visibility",
};

// --- Node parameter interfaces ---

export interface LoadStructureParams {
  type: "load_structure";
  fileName: string | null;
  bondSource: BondSource;
  trajectorySource: TrajectorySource;
}

export interface SetAtomScaleParams {
  type: "set_atom_scale";
  scale: number;
}

export interface SetAtomOpacityParams {
  type: "set_atom_opacity";
  opacity: number;
}

export interface SetBondSourceParams {
  type: "set_bond_source";
  source: BondSource;
  vdwScale: number;
}

export interface SetBondScaleParams {
  type: "set_bond_scale";
  scale: number;
}

export interface SetBondOpacityParams {
  type: "set_bond_opacity";
  opacity: number;
}

export interface SetLabelsParams {
  type: "set_labels";
  source: LabelSource;
  fileName: string | null;
}

export interface SetVectorsParams {
  type: "set_vectors";
  source: VectorSource;
  scale: number;
  fileName: string | null;
}

export interface SetDisplayParams {
  type: "set_display";
  perspective: boolean;
  cellAxesVisible: boolean;
}

export interface SetCellVisibilityParams {
  type: "set_cell_visibility";
  cellVisible: boolean;
}

/** Discriminated union of all node parameter types. */
export type PipelineNodeParams =
  | LoadStructureParams
  | SetAtomScaleParams
  | SetAtomOpacityParams
  | SetBondSourceParams
  | SetBondScaleParams
  | SetBondOpacityParams
  | SetLabelsParams
  | SetVectorsParams
  | SetDisplayParams
  | SetCellVisibilityParams;

/** Default parameters for each node type. */
export function defaultParams(type: PipelineNodeType): PipelineNodeParams {
  switch (type) {
    case "load_structure":
      return { type, fileName: null, bondSource: "structure", trajectorySource: "structure" };
    case "set_atom_scale":
      return { type, scale: 1.0 };
    case "set_atom_opacity":
      return { type, opacity: 1.0 };
    case "set_bond_source":
      return { type, source: "structure", vdwScale: 0.6 };
    case "set_bond_scale":
      return { type, scale: 1.0 };
    case "set_bond_opacity":
      return { type, opacity: 1.0 };
    case "set_labels":
      return { type, source: "none", fileName: null };
    case "set_vectors":
      return { type, source: "none", scale: 1.0, fileName: null };
    case "set_display":
      return { type, perspective: false, cellAxesVisible: true };
    case "set_cell_visibility":
      return { type, cellVisible: true };
  }
}

/**
 * The accumulated visual state produced by executing the pipeline.
 * This is NOT the data itself (Snapshot/Frame), but instructions for the renderer.
 */
export interface RenderState {
  bondSource: BondSource;
  trajectorySource: TrajectorySource;
  vdwScale: number;
  atomScale: number;
  atomOpacity: number;
  bondScale: number;
  bondOpacity: number;
  labelSource: LabelSource;
  vectorSource: VectorSource;
  vectorScale: number;
  perspective: boolean;
  cellVisible: boolean;
  cellAxesVisible: boolean;
  bondsVisible: boolean;
}

/** Default render state (matches current defaults in MeganeViewer.tsx). */
export const DEFAULT_RENDER_STATE: RenderState = {
  bondSource: "structure",
  trajectorySource: "structure",
  vdwScale: 0.6,
  atomScale: 1.0,
  atomOpacity: 1.0,
  bondScale: 1.0,
  bondOpacity: 1.0,
  labelSource: "none",
  vectorSource: "none",
  vectorScale: 1.0,
  perspective: false,
  cellVisible: true,
  cellAxesVisible: true,
  bondsVisible: true,
};

/**
 * JSON-serializable pipeline format for LLM generation and import/export.
 *
 * Example:
 * ```json
 * {
 *   "version": 1,
 *   "nodes": [
 *     { "id": "n1", "type": "load_structure", "bondSource": "distance", "position": { "x": 0, "y": 0 } },
 *     { "id": "n2", "type": "set_atom_scale", "scale": 1.5, "position": { "x": 0, "y": 200 } }
 *   ],
 *   "edges": [
 *     { "source": "n1", "target": "n2" }
 *   ]
 * }
 * ```
 */
export interface SerializedPipeline {
  version: 1;
  nodes: Array<PipelineNodeParams & { id: string; position: { x: number; y: number }; enabled?: boolean }>;
  edges: Array<{ source: string; target: string }>;
}
