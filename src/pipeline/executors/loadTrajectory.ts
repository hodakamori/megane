import type { Frame, TrajectoryMeta } from "../../types";
import type {
  PipelineData,
  TrajectoryData,
  LoadTrajectoryParams,
  FrameProvider,
} from "../types";
import { MemoryFrameProvider } from "../types";

export function executeLoadTrajectory(
  params: LoadTrajectoryParams,
  _inputs: Map<string, PipelineData[]>,
  fileFrames: Frame[] | null,
  fileMeta: TrajectoryMeta | null,
  streamProvider?: FrameProvider | null,
): Map<string, PipelineData> {
  const outputs = new Map<string, PipelineData>();

  // Stream mode: use the provided stream frame provider
  if (params.sourceMode === "stream" && streamProvider) {
    const trajectory: TrajectoryData = {
      type: "trajectory",
      provider: streamProvider,
      meta: streamProvider.meta,
      source: "stream",
    };
    outputs.set("trajectory", trajectory);
    return outputs;
  }

  // File mode: wrap in-memory frames in MemoryFrameProvider
  if (fileFrames && fileFrames.length > 0 && fileMeta) {
    const provider = new MemoryFrameProvider(fileFrames, fileMeta);
    const trajectory: TrajectoryData = {
      type: "trajectory",
      provider,
      meta: fileMeta,
      source: "file",
    };
    outputs.set("trajectory", trajectory);
  }

  return outputs;
}
