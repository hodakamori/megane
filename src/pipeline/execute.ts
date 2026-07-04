/**
 * Pipeline execution engine.
 * Propagates typed data packets through the node graph.
 * ViewportNode collects all inputs and produces a ViewportState.
 */

import type { Node, Edge } from "@xyflow/react";
import type { Snapshot } from "../types";
import type {
  PipelineNodeParams,
  PipelineData,
  ViewportState,
  ViewportParams,
  LoadStructureParams,
  LoadTrajectoryParams,
  LoadVectorParams,
  AddBondParams,
  FilterParams,
  ModifyParams,
  ReplicateParams,
  ColorParams,
  RepresentationParams,
  LabelGeneratorParams,
  PolyhedronGeneratorParams,
  SurfaceMeshParams,
  VectorOverlayParams,
  LoadVolumetricParams,
  IsosurfaceParams,
  PipelineNodeType,
  NodeError,
  ParticleData,
  FrameProvider,
} from "./types";
import type { Frame, TrajectoryMeta, VectorFrame } from "../types";
import { executeStreaming, type NodeStreamingData } from "./executors/streaming";
import { DEFAULT_VIEWPORT_STATE, NODE_PORTS } from "./types";
import { topologicalSort, collectInputs, type EdgeOutputs } from "./graph";
import { executeLoadStructure } from "./executors/loadStructure";
import { executeLoadTrajectory } from "./executors/loadTrajectory";
import { executeAddBond } from "./executors/addBond";
import { executeFilter } from "./executors/filter";
import { executeModify } from "./executors/modify";
import { executeReplicate } from "./executors/replicate";
import { executeColor } from "./executors/color";
import { executeRepresentation } from "./executors/representation";
import { executeLabelGenerator } from "./executors/labelGenerator";
import { executePolyhedronGenerator } from "./executors/polyhedronGenerator";
import { executeSurfaceMesh } from "./executors/surfaceMesh";
import { executeLoadVector } from "./executors/loadVector";
import { executeVectorOverlay } from "./executors/vectorOverlay";
import { executeLoadVolumetric } from "./executors/loadVolumetric";
import { executeIsosurface } from "./executors/isosurface";
import { executeViewport } from "./executors/viewport";

export interface PipelineNodeData {
  params: PipelineNodeParams;
  enabled: boolean;
  [key: string]: unknown;
}

// ─── Main Execution ───────────────────────────────────────────────────

/**
 * Execute the pipeline and produce a ViewportState.
 * Returns DEFAULT_VIEWPORT_STATE if no viewport node exists.
 */
/** Per-node snapshot data stored for each load_structure node. */
export interface NodeSnapshotData {
  snapshot: Snapshot;
  frames: Frame[] | null;
  meta: TrajectoryMeta | null;
  labels: string[] | null;
}

export interface PipelineExecutionContext {
  snapshot?: Snapshot | null;
  atomLabels?: string[] | null;
  structureFrames?: Frame[] | null;
  structureMeta?: TrajectoryMeta | null;
  /** Pre-built lazy/streaming provider for a multi-frame structure file (takes precedence over structureFrames). */
  structureProvider?: FrameProvider | null;
  fileFrames?: Frame[] | null;
  fileMeta?: TrajectoryMeta | null;
  /** Pre-built lazy/streaming provider for the file trajectory (takes precedence over fileFrames). */
  fileProvider?: FrameProvider | null;
  fileVectors?: VectorFrame[] | null;
  /** Per-node snapshots keyed by load_structure node ID. */
  nodeSnapshots?: Record<string, NodeSnapshotData>;
  /** Per-node streaming data keyed by streaming node ID. */
  nodeStreamingData?: Record<string, NodeStreamingData>;
}

export interface PipelineExecutionResult {
  viewportState: ViewportState;
  nodeErrors: Map<string, NodeError[]>;
}

/**
 * Resolve the atom labels used for selection / coloring (e.g. `resname == "HOH"`,
 * color-by-residue). The user-selected *display* label source wins when set
 * (`ctx.atomLabels`); otherwise we fall back to the residue labels parsed from
 * the structure file and stored per load_structure node in `ctx.nodeSnapshots`.
 *
 * This keeps `resname` selections and residue coloring working out of the box
 * without forcing the user to switch the display label source — and without
 * turning on on-screen atom text labels, which are driven by a separate path
 * (the label_generator node / `LabelData`), not by these labels.
 *
 * Keying off the stream's `sourceNodeId` means multi-loader graphs each resolve
 * to their own structure's labels.
 */
function resolveEffectiveLabels(
  ctx: PipelineExecutionContext,
  sourceNodeId: string | undefined,
): string[] | null {
  if (ctx.atomLabels) return ctx.atomLabels;
  if (sourceNodeId) return ctx.nodeSnapshots?.[sourceNodeId]?.labels ?? null;
  return null;
}

/** Read the source load_structure node id from a node's incoming particle stream. */
function particleSourceNodeId(inputs: Map<string, PipelineData[]>): string | undefined {
  const inData = inputs.get("in")?.[0];
  return inData?.type === "particle" ? (inData as ParticleData).sourceNodeId : undefined;
}

export function executePipeline(
  nodes: Node<PipelineNodeData>[],
  edges: Edge[],
  ctx: PipelineExecutionContext = {},
): PipelineExecutionResult {
  const sortedIds = topologicalSort(nodes, edges);
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  const edgeOutputs: EdgeOutputs = new Map();
  const nodeErrors = new Map<string, NodeError[]>();

  const addError = (nodeId: string, error: NodeError) => {
    if (!nodeErrors.has(nodeId)) nodeErrors.set(nodeId, []);
    nodeErrors.get(nodeId)!.push(error);
  };

  let viewportState: ViewportState = { ...DEFAULT_VIEWPORT_STATE };

  for (const id of sortedIds) {
    const node = nodeMap.get(id);
    if (!node) continue;
    const data = node.data;

    if (!data.enabled) {
      // Disabled nodes: pass through inputs as outputs (for filter/modify)
      const inputs = collectInputs(id, edges, edgeOutputs);
      const passthrough = new Map<string, PipelineData>();
      const nodeType = data.params.type as PipelineNodeType;
      const ports = NODE_PORTS[nodeType];
      for (const [portName, dataList] of inputs) {
        if (dataList.length > 0) {
          const matchingOutput = ports.outputs.find((o) => {
            const inputPort = ports.inputs.find((i) => i.name === portName);
            return inputPort && o.dataType === inputPort.dataType;
          });
          if (matchingOutput) {
            passthrough.set(matchingOutput.name, dataList[0]);
          }
        }
      }
      edgeOutputs.set(id, passthrough);
      continue;
    }

    const inputs = collectInputs(id, edges, edgeOutputs);

    switch (data.params.type) {
      case "load_structure": {
        // Per-node snapshot takes priority; fall back to global snapshot for backward compat
        const nodeData = ctx.nodeSnapshots?.[id];
        const snapshot = nodeData?.snapshot ?? ctx.snapshot ?? null;
        const frames = nodeData?.frames ?? ctx.structureFrames ?? null;
        const meta = nodeData?.meta ?? ctx.structureMeta ?? null;
        // A lazy structure provider applies only when this node has no eager
        // frames of its own (mirrors executeLoadTrajectory's provider precedence).
        const provider = nodeData?.frames ? null : (ctx.structureProvider ?? null);
        const outputs = executeLoadStructure(
          data.params as LoadStructureParams,
          snapshot,
          frames,
          meta,
          id,
          provider,
        );
        edgeOutputs.set(id, outputs);
        if (!snapshot) {
          addError(id, { message: "No structure data available", severity: "warning" });
        }
        break;
      }
      case "load_vector": {
        const outputs = executeLoadVector(data.params as LoadVectorParams, ctx.fileVectors ?? null);
        edgeOutputs.set(id, outputs);
        break;
      }
      case "load_trajectory": {
        const outputs = executeLoadTrajectory(
          data.params as LoadTrajectoryParams,
          inputs,
          ctx.fileFrames ?? null,
          ctx.fileMeta ?? null,
          ctx.fileProvider ?? null,
        );
        edgeOutputs.set(id, outputs);
        break;
      }
      case "streaming": {
        const streamingData = ctx.nodeStreamingData?.[id];
        const outputs = executeStreaming(id, streamingData);
        edgeOutputs.set(id, outputs);
        if (!streamingData?.snapshot) {
          addError(id, { message: "No streaming data available", severity: "warning" });
        }
        break;
      }
      case "add_bond": {
        const outputs = executeAddBond(data.params as AddBondParams, inputs);
        edgeOutputs.set(id, outputs);
        if (inputs.get("particle")?.length && !outputs.has("bond")) {
          addError(id, { message: "No bonds found", severity: "warning" });
        } else if (!inputs.get("particle")?.length) {
          addError(id, { message: "No input data (check upstream nodes)", severity: "warning" });
        }
        break;
      }
      case "filter": {
        const labels = resolveEffectiveLabels(ctx, particleSourceNodeId(inputs));
        const outputs = executeFilter(data.params as FilterParams, inputs, labels);
        edgeOutputs.set(id, outputs);
        const outData = outputs.get("out");
        if (!inputs.get("in")?.length) {
          addError(id, { message: "No input data (check upstream nodes)", severity: "warning" });
        } else if (outData && outData.type === "particle") {
          const particle = outData as ParticleData;
          if (particle.indices !== null && particle.indices.length === 0) {
            addError(id, { message: "Filter returned 0 atoms", severity: "warning" });
          }
        }
        break;
      }
      case "modify": {
        const outputs = executeModify(data.params as ModifyParams, inputs);
        edgeOutputs.set(id, outputs);
        if (!inputs.get("in")?.length) {
          addError(id, { message: "No input data (check upstream nodes)", severity: "warning" });
        }
        break;
      }
      case "replicate": {
        const replicateParams = data.params as ReplicateParams;
        const outputs = executeReplicate(replicateParams, inputs);
        edgeOutputs.set(id, outputs);
        const particleIn = inputs.get("particle")?.[0] as ParticleData | undefined;
        const counts = [replicateParams.nx, replicateParams.ny, replicateParams.nz];
        const wantsReplication = counts.some((n) => Math.floor(n) > 1);
        if (!particleIn) {
          addError(id, { message: "No input data (check upstream nodes)", severity: "warning" });
        } else if (wantsReplication && !particleIn.source.box) {
          addError(id, { message: "Replicate requires a unit cell", severity: "warning" });
        }
        break;
      }
      case "color": {
        const labels = resolveEffectiveLabels(ctx, particleSourceNodeId(inputs));
        const outputs = executeColor(data.params as ColorParams, inputs, labels);
        edgeOutputs.set(id, outputs);
        if (!inputs.get("in")?.length) {
          addError(id, { message: "No input data (check upstream nodes)", severity: "warning" });
        }
        break;
      }
      case "representation": {
        const outputs = executeRepresentation(data.params as RepresentationParams, inputs);
        edgeOutputs.set(id, outputs);
        if (!inputs.get("in")?.length) {
          addError(id, { message: "No input data (check upstream nodes)", severity: "warning" });
        }
        break;
      }
      case "label_generator": {
        const outputs = executeLabelGenerator(
          data.params as LabelGeneratorParams,
          inputs,
          ctx.atomLabels ?? null,
        );
        edgeOutputs.set(id, outputs);
        if (!inputs.get("particle")?.length) {
          addError(id, { message: "No input data (check upstream nodes)", severity: "warning" });
        }
        break;
      }
      case "polyhedron_generator": {
        const outputs = executePolyhedronGenerator(
          data.params as PolyhedronGeneratorParams,
          inputs,
        );
        edgeOutputs.set(id, outputs);
        if (!inputs.get("particle")?.length) {
          addError(id, { message: "No input data (check upstream nodes)", severity: "warning" });
        } else if (!outputs.has("mesh")) {
          addError(id, { message: "No polyhedra matched the criteria", severity: "warning" });
        }
        break;
      }
      case "surface_mesh": {
        const outputs = executeSurfaceMesh(data.params as SurfaceMeshParams, inputs);
        edgeOutputs.set(id, outputs);
        if (!inputs.get("particle")?.length) {
          addError(id, { message: "No input data (check upstream nodes)", severity: "warning" });
        }
        break;
      }
      case "vector_overlay": {
        const outputs = executeVectorOverlay(data.params as VectorOverlayParams, inputs);
        edgeOutputs.set(id, outputs);
        if (!inputs.get("vector")?.length) {
          addError(id, { message: "No input data (check upstream nodes)", severity: "warning" });
        }
        break;
      }
      case "load_volumetric": {
        const outputs = executeLoadVolumetric(data.params as LoadVolumetricParams);
        edgeOutputs.set(id, outputs);
        if (!outputs.has("volumetric")) {
          addError(id, { message: "No volumetric data loaded", severity: "warning" });
        }
        break;
      }
      case "isosurface": {
        const outputs = executeIsosurface(data.params as IsosurfaceParams, inputs);
        edgeOutputs.set(id, outputs);
        if (!inputs.get("volumetric")?.length) {
          addError(id, { message: "No volumetric input", severity: "warning" });
        }
        break;
      }
      case "viewport": {
        viewportState = executeViewport(data.params as ViewportParams, inputs);
        break;
      }
    }
  }

  return { viewportState, nodeErrors };
}
