import type { PipelineData, ParticleData, TrajectoryData, PlotData, RmsfParams } from "../types";

/**
 * Compute per-atom RMSF (Root Mean Square Fluctuation) over all trajectory frames.
 *
 * Returns a Float32Array of length nAtoms with RMSF values in Å.
 * Atoms are indexed 0..nAtoms-1; atomIndices restricts the calculation to a subset.
 */
export function computeRmsf(
  frames: Float32Array[],
  atomIndices: Uint32Array | null,
  nAtoms: number,
): Float32Array {
  const result = new Float32Array(nAtoms);
  if (frames.length === 0) return result;

  const nFrames = frames.length;
  const indices = atomIndices ?? buildAllIndices(nAtoms);

  // Compute mean position for each selected atom
  const meanX = new Float32Array(nAtoms);
  const meanY = new Float32Array(nAtoms);
  const meanZ = new Float32Array(nAtoms);

  for (const frame of frames) {
    for (const i of indices) {
      meanX[i] += frame[i * 3];
      meanY[i] += frame[i * 3 + 1];
      meanZ[i] += frame[i * 3 + 2];
    }
  }

  for (const i of indices) {
    meanX[i] /= nFrames;
    meanY[i] /= nFrames;
    meanZ[i] /= nFrames;
  }

  // Compute mean square deviation from mean position
  const sumSq = new Float32Array(nAtoms);
  for (const frame of frames) {
    for (const i of indices) {
      const dx = frame[i * 3] - meanX[i];
      const dy = frame[i * 3 + 1] - meanY[i];
      const dz = frame[i * 3 + 2] - meanZ[i];
      sumSq[i] += dx * dx + dy * dy + dz * dz;
    }
  }

  for (const i of indices) {
    result[i] = Math.sqrt(sumSq[i] / nFrames);
  }

  return result;
}

function buildAllIndices(nAtoms: number): Uint32Array {
  const arr = new Uint32Array(nAtoms);
  for (let i = 0; i < nAtoms; i++) arr[i] = i;
  return arr;
}

/**
 * RMSF node executor.
 *
 * Inputs:
 *   - particle: reference structure (provides nAtoms and optional atom selection)
 *   - trajectory: frames over which fluctuation is computed
 *
 * Output:
 *   - plot: per-atom RMSF values (Å), x = atom index, y = RMSF
 */
export function executeRmsf(
  params: RmsfParams,
  inputs: Map<string, PipelineData[]>,
): Map<string, PipelineData> {
  const outputs = new Map<string, PipelineData>();

  const particleData = inputs.get("particle")?.[0] as ParticleData | undefined;
  const trajectoryData = inputs.get("trajectory")?.[0] as TrajectoryData | undefined;

  if (!particleData || !trajectoryData) return outputs;

  const snapshot = particleData.source;
  const nAtoms = snapshot.nAtoms;
  const { meta, provider } = trajectoryData;
  const nFrames = meta.nFrames;

  if (nFrames === 0) return outputs;

  // Collect all frame position arrays
  const framePositions: Float32Array[] = [];
  for (let fi = 0; fi < nFrames; fi++) {
    const frame = provider.getFrame(fi);
    if (frame) framePositions.push(frame.positions);
  }

  if (framePositions.length === 0) return outputs;

  const atomIndices = params.selection.trim() === "" ? particleData.indices : particleData.indices;
  const rmsfValues = computeRmsf(framePositions, atomIndices, nAtoms);

  // Build per-atom x/y arrays (restricted to selected atoms if applicable)
  const selectedIndices = atomIndices ?? buildAllIndicesArr(nAtoms);
  const n = selectedIndices.length;
  const xValues = new Float32Array(n);
  const yValues = new Float32Array(n);
  for (let k = 0; k < n; k++) {
    xValues[k] = selectedIndices[k];
    yValues[k] = rmsfValues[selectedIndices[k]];
  }

  const plot: PlotData = {
    type: "plot",
    title: "RMSF",
    xLabel: "Atom Index",
    yLabel: "RMSF (Å)",
    xValues,
    yValues,
  };

  outputs.set("plot", plot);
  return outputs;
}

function buildAllIndicesArr(nAtoms: number): Uint32Array {
  const arr = new Uint32Array(nAtoms);
  for (let i = 0; i < nAtoms; i++) arr[i] = i;
  return arr;
}
