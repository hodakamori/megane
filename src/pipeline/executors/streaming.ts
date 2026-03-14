/**
 * Streaming node executor.
 * Source node for WebSocket-streamed molecular data.
 * Outputs particle, trajectory, and cell data from the streaming connection.
 */

import type { Snapshot } from "../../types";
import type {
  PipelineData,
  ParticleData,
  CellData,
  TrajectoryData,
  FrameProvider,
} from "../types";

export interface NodeStreamingData {
  snapshot: Snapshot;
  streamProvider: FrameProvider | null;
}

export function executeStreaming(
  nodeId: string,
  streamingData: NodeStreamingData | undefined,
): Map<string, PipelineData> {
  const outputs = new Map<string, PipelineData>();
  if (!streamingData) return outputs;

  const { snapshot, streamProvider } = streamingData;

  // Output particle data
  const particle: ParticleData = {
    type: "particle",
    source: snapshot,
    sourceNodeId: nodeId,
    indices: null,
    scaleOverrides: null,
    opacityOverrides: null,
  };
  outputs.set("particle", particle);

  // Output trajectory data if stream provider is available
  if (streamProvider) {
    const trajectory: TrajectoryData = {
      type: "trajectory",
      provider: streamProvider,
      meta: streamProvider.meta,
      source: "stream",
    };
    outputs.set("trajectory", trajectory);
  }

  // Output cell data if box is available
  if (snapshot.box) {
    const cell: CellData = {
      type: "cell",
      sourceNodeId: nodeId,
      box: snapshot.box,
      visible: true,
      axesVisible: true,
    };
    outputs.set("cell", cell);
  }

  return outputs;
}
