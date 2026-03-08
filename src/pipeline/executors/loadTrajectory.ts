import type { Frame, TrajectoryMeta } from "../../types";
import type {
  PipelineData,
  TrajectoryData,
  LoadTrajectoryParams,
} from "../types";

export function executeLoadTrajectory(
  _params: LoadTrajectoryParams,
  _inputs: Map<string, PipelineData[]>,
  fileFrames: Frame[] | null,
  fileMeta: TrajectoryMeta | null,
): Map<string, PipelineData> {
  const outputs = new Map<string, PipelineData>();

  if (fileFrames && fileFrames.length > 0 && fileMeta) {
    const trajectory: TrajectoryData = {
      type: "trajectory",
      frames: fileFrames,
      meta: fileMeta,
      source: "file",
    };
    outputs.set("trajectory", trajectory);
  }

  return outputs;
}
