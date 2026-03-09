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
  LabelGeneratorParams,
  PolyhedronGeneratorParams,
  VectorOverlayParams,
  PipelineNodeType,
} from "./types";
import type { Frame, TrajectoryMeta, VectorFrame } from "../types";
import { DEFAULT_VIEWPORT_STATE, NODE_PORTS } from "./types";
import { topologicalSort, collectInputs, type EdgeOutputs } from "./graph";
import { executeLoadStructure } from "./executors/loadStructure";
import { executeLoadTrajectory } from "./executors/loadTrajectory";
import { executeAddBond } from "./executors/addBond";
import { executeFilter } from "./executors/filter";
import { executeModify } from "./executors/modify";
import { executeLabelGenerator } from "./executors/labelGenerator";
import { executePolyhedronGenerator } from "./executors/polyhedronGenerator";
import { executeLoadVector } from "./executors/loadVector";
import { executeVectorOverlay } from "./executors/vectorOverlay";
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
export interface PipelineExecutionContext {
  snapshot?: Snapshot | null;
  atomLabels?: string[] | null;
  structureFrames?: Frame[] | null;
  structureMeta?: TrajectoryMeta | null;
  fileFrames?: Frame[] | null;
  fileMeta?: TrajectoryMeta | null;
  fileVectors?: VectorFrame[] | null;
}

export function executePipeline(
  nodes: Node<PipelineNodeData>[],
  edges: Edge[],
  ctx: PipelineExecutionContext = {},
): ViewportState {
  const sortedIds = topologicalSort(nodes, edges);
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  const edgeOutputs: EdgeOutputs = new Map();

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
        const outputs = executeLoadStructure(
          data.params as LoadStructureParams,
          ctx.snapshot ?? null,
          ctx.structureFrames ?? null,
          ctx.structureMeta ?? null,
        );
        edgeOutputs.set(id, outputs);
        break;
      }
      case "load_vector": {
        const outputs = executeLoadVector(
          data.params as LoadVectorParams,
          ctx.fileVectors ?? null,
        );
        edgeOutputs.set(id, outputs);
        break;
      }
      case "load_trajectory": {
        const outputs = executeLoadTrajectory(
          data.params as LoadTrajectoryParams,
          inputs,
          ctx.fileFrames ?? null,
          ctx.fileMeta ?? null,
        );
        edgeOutputs.set(id, outputs);
        break;
      }
      case "add_bond": {
        const outputs = executeAddBond(
          data.params as AddBondParams,
          inputs,
        );
        edgeOutputs.set(id, outputs);
        break;
      }
      case "filter": {
        const outputs = executeFilter(
          data.params as FilterParams,
          inputs,
          ctx.atomLabels ?? null,
        );
        edgeOutputs.set(id, outputs);
        break;
      }
      case "modify": {
        const outputs = executeModify(
          data.params as ModifyParams,
          inputs,
        );
        edgeOutputs.set(id, outputs);
        break;
      }
      case "label_generator": {
        const outputs = executeLabelGenerator(
          data.params as LabelGeneratorParams,
          inputs,
          ctx.atomLabels ?? null,
        );
        edgeOutputs.set(id, outputs);
        break;
      }
      case "polyhedron_generator": {
        const outputs = executePolyhedronGenerator(
          data.params as PolyhedronGeneratorParams,
          inputs,
        );
        edgeOutputs.set(id, outputs);
        break;
      }
      case "vector_overlay": {
        const outputs = executeVectorOverlay(
          data.params as VectorOverlayParams,
          inputs,
        );
        edgeOutputs.set(id, outputs);
        break;
      }
      case "viewport": {
        viewportState = executeViewport(
          data.params as ViewportParams,
          inputs,
        );
        break;
      }
    }
  }

  return viewportState;
}
