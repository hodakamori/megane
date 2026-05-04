import type { Snapshot, Frame, TrajectoryMeta } from "../../types";
import type {
  PipelineData,
  ParticleData,
  CellData,
  TrajectoryData,
  LoadStructureParams,
} from "../types";
import { MemoryFrameProvider } from "../types";

export function executeLoadStructure(
  params: LoadStructureParams,
  snapshot: Snapshot | null,
  structureFrames: Frame[] | null,
  structureMeta: TrajectoryMeta | null,
  sourceNodeId: string,
): Map<string, PipelineData> {
  const outputs = new Map<string, PipelineData>();
  if (!snapshot) return outputs;

  const particle: ParticleData = {
    type: "particle",
    source: snapshot,
    sourceNodeId,
    indices: null,
    scaleOverrides: null,
    opacityOverrides: null,
    colorOverrides: null,
    representationOverride: null,
  };
  outputs.set("particle", particle);

  if (structureFrames && structureFrames.length > 0 && structureMeta) {
    const provider = new MemoryFrameProvider(structureFrames, structureMeta, snapshot.positions);
    const trajectory: TrajectoryData = {
      type: "trajectory",
      provider,
      meta: structureMeta,
      source: "structure",
    };
    outputs.set("trajectory", trajectory);
  }

  if (snapshot.box) {
    const cell: CellData = {
      type: "cell",
      sourceNodeId,
      box: snapshot.box,
      visible: true,
      axesVisible: true,
    };
    outputs.set("cell", cell);
  }

  return outputs;
}
