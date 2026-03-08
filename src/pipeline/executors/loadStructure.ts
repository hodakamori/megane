import type { Snapshot, Frame, TrajectoryMeta } from "../../types";
import type {
  PipelineData,
  ParticleData,
  CellData,
  TrajectoryData,
  LoadStructureParams,
} from "../types";

export function executeLoadStructure(
  params: LoadStructureParams,
  snapshot: Snapshot | null,
  structureFrames: Frame[] | null,
  structureMeta: TrajectoryMeta | null,
): Map<string, PipelineData> {
  const outputs = new Map<string, PipelineData>();
  if (!snapshot) return outputs;

  const particle: ParticleData = {
    type: "particle",
    source: snapshot,
    indices: null,
    scaleOverrides: null,
    opacityOverrides: null,
  };
  outputs.set("particle", particle);

  if (structureFrames && structureFrames.length > 0 && structureMeta) {
    const trajectory: TrajectoryData = {
      type: "trajectory",
      frames: structureFrames,
      meta: structureMeta,
      source: "structure",
    };
    outputs.set("trajectory", trajectory);
  }

  if (snapshot.box) {
    const cell: CellData = {
      type: "cell",
      box: snapshot.box,
      visible: true,
      axesVisible: true,
    };
    outputs.set("cell", cell);
  }

  return outputs;
}
