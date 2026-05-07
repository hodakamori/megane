import type {
  PipelineData,
  ParticleData,
  TrajectoryData,
  PlotData,
  ContactMapParams,
} from "../types";

/**
 * Compute a Cα–Cα distance matrix for the structure.
 * Each entry [i,j] holds the Euclidean distance (Å) between Cα of residue i
 * and Cα of residue j. Uses the caIndices / caResNums arrays stored on the
 * snapshot; returns null when no backbone data is available.
 */
function computeDistanceMatrix(positions: Float32Array, caIndices: Uint32Array): Float32Array {
  const n = caIndices.length;
  const matrix = new Float32Array(n * n);
  for (let i = 0; i < n; i++) {
    const ai = caIndices[i];
    const xi = positions[ai * 3];
    const yi = positions[ai * 3 + 1];
    const zi = positions[ai * 3 + 2];
    for (let j = i + 1; j < n; j++) {
      const aj = caIndices[j];
      const dx = xi - positions[aj * 3];
      const dy = yi - positions[aj * 3 + 1];
      const dz = zi - positions[aj * 3 + 2];
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
      matrix[i * n + j] = dist;
      matrix[j * n + i] = dist;
    }
  }
  return matrix;
}

export function executeContactMap(
  params: ContactMapParams,
  inputs: Map<string, PipelineData[]>,
): Map<string, PipelineData> {
  const outputs = new Map<string, PipelineData>();

  const particleList = inputs.get("particle") ?? [];
  const particle = particleList[0] as ParticleData | undefined;
  if (!particle) return outputs;

  const snapshot = particle.source;
  const caIndices = snapshot.caIndices;
  if (!caIndices || caIndices.length === 0) return outputs;

  const trajectoryList = inputs.get("trajectory") ?? [];
  const trajectory = trajectoryList[0] as TrajectoryData | undefined;

  let positions = snapshot.positions;

  if (trajectory && params.frameIndex >= 0) {
    const frame = trajectory.provider.getFrame(params.frameIndex);
    if (frame) positions = frame.positions;
  }

  const nResidues = caIndices.length;
  let matrix: Float32Array;

  if (trajectory && params.frameIndex === -1) {
    // Average over all available frames
    const nFrames = trajectory.meta.nFrames;
    const accum = new Float32Array(nResidues * nResidues);
    let count = 0;
    for (let f = 0; f < nFrames; f++) {
      const frame = trajectory.provider.getFrame(f);
      if (!frame) continue;
      const m = computeDistanceMatrix(frame.positions, caIndices);
      for (let k = 0; k < accum.length; k++) accum[k] += m[k];
      count++;
    }
    if (count > 0) {
      for (let k = 0; k < accum.length; k++) accum[k] /= count;
    }
    matrix = accum;
  } else {
    matrix = computeDistanceMatrix(positions, caIndices);
  }

  const caResNums = snapshot.caResNums;
  const residueLabels: string[] = caResNums
    ? Array.from(caResNums).map(String)
    : Array.from({ length: nResidues }, (_, i) => String(i + 1));

  const plot: PlotData = {
    type: "plot",
    kind: "heatmap",
    title: "Contact Map",
    matrix,
    nResidues,
    residueLabels,
    threshold: params.distanceCutoff,
  };

  outputs.set("plot", plot);
  return outputs;
}
