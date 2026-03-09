/**
 * Executor for the vector_overlay node.
 * Takes vector input and passes it through with scale applied.
 */

import type { VectorOverlayParams, PipelineData, VectorData } from "../types";

export function executeVectorOverlay(
  params: VectorOverlayParams,
  inputs: Map<string, PipelineData[]>,
): Map<string, PipelineData> {
  const outputs = new Map<string, PipelineData>();
  const vectorInputs = inputs.get("vector") as VectorData[] | undefined;
  if (!vectorInputs || vectorInputs.length === 0) return outputs;

  const vectorData = vectorInputs[0];
  const scaled: VectorData = {
    ...vectorData,
    scale: params.scale,
  };
  outputs.set("vector", scaled);
  return outputs;
}
