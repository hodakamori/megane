import type { PipelineData, ParticleData, TrajectoryData, PlotData, RmsdParams } from "../types";

/**
 * Compute per-atom RMSD between two position arrays.
 * Both arrays must have length atomIndices.length * 3 (or nAtoms * 3 if indices is null).
 */
export function computeRmsd(
  refPositions: Float32Array,
  framePositions: Float32Array,
  atomIndices: Uint32Array | null,
  nAtoms: number,
): number {
  let sumSq = 0;
  let count = 0;

  if (atomIndices === null) {
    for (let i = 0; i < nAtoms; i++) {
      const dx = refPositions[i * 3] - framePositions[i * 3];
      const dy = refPositions[i * 3 + 1] - framePositions[i * 3 + 1];
      const dz = refPositions[i * 3 + 2] - framePositions[i * 3 + 2];
      sumSq += dx * dx + dy * dy + dz * dz;
      count++;
    }
  } else {
    for (let k = 0; k < atomIndices.length; k++) {
      const i = atomIndices[k];
      const dx = refPositions[i * 3] - framePositions[i * 3];
      const dy = refPositions[i * 3 + 1] - framePositions[i * 3 + 1];
      const dz = refPositions[i * 3 + 2] - framePositions[i * 3 + 2];
      sumSq += dx * dx + dy * dy + dz * dz;
      count++;
    }
  }

  if (count === 0) return 0;
  return Math.sqrt(sumSq / count);
}

/**
 * RMSD node executor.
 *
 * Inputs:
 *   - particle: reference structure (snapshot.positions used as reference frame)
 *   - trajectory: frames to compare against the reference
 *
 * Output:
 *   - plot: per-frame RMSD values (Å)
 */
export function executeRmsd(
  params: RmsdParams,
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

  // Resolve reference frame positions
  const refFrameIndex = Math.max(0, Math.min(params.referenceFrame, nFrames - 1));
  const refFrame = provider.getFrame(refFrameIndex);
  const refPositions = refFrame ? refFrame.positions : snapshot.positions;

  // Atom indices to use (null = all atoms; use particle selection if provided)
  const atomIndices = params.selection.trim() === "" ? particleData.indices : particleData.indices;

  const xValues = new Float32Array(nFrames);
  const yValues = new Float32Array(nFrames);

  for (let fi = 0; fi < nFrames; fi++) {
    xValues[fi] = fi;
    const frame = provider.getFrame(fi);
    if (!frame) {
      yValues[fi] = 0;
      continue;
    }
    yValues[fi] = computeRmsd(refPositions, frame.positions, atomIndices, nAtoms);
  }

  const plot: PlotData = {
    type: "plot",
    title: "RMSD",
    xLabel: "Frame",
    yLabel: "RMSD (Å)",
    xValues,
    yValues,
  };

  outputs.set("plot", plot);
  return outputs;
}
