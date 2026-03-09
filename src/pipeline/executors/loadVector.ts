/**
 * Executor for the load_vector node.
 * Outputs vector data from externally loaded vector frames.
 */

import type { LoadVectorParams, PipelineData, VectorData } from "../types";
import type { VectorFrame } from "../../types";

export function executeLoadVector(
  params: LoadVectorParams,
  fileVectors: VectorFrame[] | null,
): Map<string, PipelineData> {
  const outputs = new Map<string, PipelineData>();

  if (!params.fileName || !fileVectors || fileVectors.length === 0) {
    return outputs;
  }

  const nAtoms = fileVectors[0].vectors.length / 3;
  const vectorData: VectorData = {
    type: "vector",
    frames: fileVectors,
    nAtoms,
    scale: 1.0,
  };
  outputs.set("vector", vectorData);
  return outputs;
}
