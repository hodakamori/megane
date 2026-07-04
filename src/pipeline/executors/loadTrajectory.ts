import type { Frame, TrajectoryMeta } from "../../types";
import type { PipelineData, TrajectoryData, LoadTrajectoryParams, FrameProvider } from "../types";
import { MemoryFrameProvider } from "../types";

export function executeLoadTrajectory(
  _params: LoadTrajectoryParams,
  _inputs: Map<string, PipelineData[]>,
  fileFrames: Frame[] | null,
  fileMeta: TrajectoryMeta | null,
  fileProvider: FrameProvider | null = null,
): Map<string, PipelineData> {
  const outputs = new Map<string, PipelineData>();

  // A pre-built provider (lazy/streaming XTC) takes precedence over eager frames.
  if (fileProvider) {
    const trajectory: TrajectoryData = {
      type: "trajectory",
      provider: fileProvider,
      meta: fileProvider.meta,
      source: "file",
    };
    outputs.set("trajectory", trajectory);
  } else if (fileFrames && fileFrames.length > 0 && fileMeta) {
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
