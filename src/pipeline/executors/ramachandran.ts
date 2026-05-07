import type {
  PipelineData,
  ParticleData,
  TrajectoryData,
  PlotData,
  RamachandranParams,
} from "../types";

/** Compute dihedral angle (radians) for four atom positions given by their flat indices. */
function dihedralAngle(
  positions: Float32Array,
  i1: number,
  i2: number,
  i3: number,
  i4: number,
): number {
  const ax = positions[i1 * 3],
    ay = positions[i1 * 3 + 1],
    az = positions[i1 * 3 + 2];
  const bx = positions[i2 * 3],
    by = positions[i2 * 3 + 1],
    bz = positions[i2 * 3 + 2];
  const cx = positions[i3 * 3],
    cy = positions[i3 * 3 + 1],
    cz = positions[i3 * 3 + 2];
  const dx = positions[i4 * 3],
    dy = positions[i4 * 3 + 1],
    dz = positions[i4 * 3 + 2];

  // Bond vectors
  const v1x = bx - ax,
    v1y = by - ay,
    v1z = bz - az;
  const v2x = cx - bx,
    v2y = cy - by,
    v2z = cz - bz;
  const v3x = dx - cx,
    v3y = dy - cy,
    v3z = dz - cz;

  // Normal planes
  const n1x = v1y * v2z - v1z * v2y;
  const n1y = v1z * v2x - v1x * v2z;
  const n1z = v1x * v2y - v1y * v2x;

  const n2x = v2y * v3z - v2z * v3y;
  const n2y = v2z * v3x - v2x * v3z;
  const n2z = v2x * v3y - v2y * v3x;

  // Normalise v2 for the m1 cross
  const v2len = Math.sqrt(v2x * v2x + v2y * v2y + v2z * v2z);
  if (v2len < 1e-10) return NaN;
  const uv2x = v2x / v2len,
    uv2y = v2y / v2len,
    uv2z = v2z / v2len;

  const m1x = n1y * uv2z - n1z * uv2y;
  const m1y = n1z * uv2x - n1x * uv2z;
  const m1z = n1x * uv2y - n1y * uv2x;

  const xComp = n1x * n2x + n1y * n2y + n1z * n2z;
  const yComp = m1x * n2x + m1y * n2y + m1z * n2z;

  return Math.atan2(yComp, xComp);
}

/**
 * For each Cα in caIndices, attempt to find the backbone N (at caIdx-1) and
 * C (at caIdx+1) by checking atomic numbers (N=7, C=6). Returns per-residue
 * backbone atom tuples or null when the element pattern does not match.
 */
function findBackboneTriples(
  caIndices: Uint32Array,
  elements: Uint8Array,
): Array<{ nIdx: number; caIdx: number; cIdx: number } | null> {
  return Array.from(caIndices).map((caIdx) => {
    const nIdx = caIdx - 1;
    const cIdx = caIdx + 1;
    if (
      nIdx < 0 ||
      cIdx >= elements.length ||
      elements[nIdx] !== 7 || // N
      elements[cIdx] !== 6 // C
    ) {
      return null;
    }
    return { nIdx, caIdx, cIdx };
  });
}

/**
 * Compute φ/ψ angles (degrees) for all residues that have complete backbone
 * context (not first/last residue, valid N–Cα–C atoms). Returns parallel
 * xValues (φ) and yValues (ψ) arrays along with per-point labels.
 */
function computePhiPsi(
  positions: Float32Array,
  triples: Array<{ nIdx: number; caIdx: number; cIdx: number } | null>,
  caResNums: Uint32Array | undefined,
): { xValues: Float32Array; yValues: Float32Array; pointLabels: string[] } {
  const phi: number[] = [];
  const psi: number[] = [];
  const labels: string[] = [];
  const n = triples.length;

  for (let i = 1; i < n - 1; i++) {
    const prev = triples[i - 1];
    const curr = triples[i];
    const next = triples[i + 1];
    if (!prev || !curr || !next) continue;

    const phiAngle = dihedralAngle(positions, prev.cIdx, curr.nIdx, curr.caIdx, curr.cIdx);
    const psiAngle = dihedralAngle(positions, curr.nIdx, curr.caIdx, curr.cIdx, next.nIdx);

    if (isNaN(phiAngle) || isNaN(psiAngle)) continue;

    phi.push((phiAngle * 180) / Math.PI);
    psi.push((psiAngle * 180) / Math.PI);
    labels.push(caResNums ? String(caResNums[i]) : String(i + 1));
  }

  return {
    xValues: new Float32Array(phi),
    yValues: new Float32Array(psi),
    pointLabels: labels,
  };
}

export function executeRamachandran(
  params: RamachandranParams,
  inputs: Map<string, PipelineData[]>,
): Map<string, PipelineData> {
  const outputs = new Map<string, PipelineData>();

  const particleList = inputs.get("particle") ?? [];
  const particle = particleList[0] as ParticleData | undefined;
  if (!particle) return outputs;

  const snapshot = particle.source;
  const caIndices = snapshot.caIndices;
  if (!caIndices || caIndices.length < 3) return outputs;

  const triples = findBackboneTriples(caIndices, snapshot.elements);

  const trajectoryList = inputs.get("trajectory") ?? [];
  const trajectory = trajectoryList[0] as TrajectoryData | undefined;

  let positions = snapshot.positions;
  if (trajectory) {
    const frameIdx = Math.max(0, params.frameIndex);
    const frame = trajectory.provider.getFrame(frameIdx);
    if (frame) positions = frame.positions;
  }

  const { xValues, yValues, pointLabels } = computePhiPsi(positions, triples, snapshot.caResNums);

  const plot: PlotData = {
    type: "plot",
    kind: "scatter",
    title: "Ramachandran Plot",
    xValues,
    yValues,
    pointLabels,
    xLabel: "φ (°)",
    yLabel: "ψ (°)",
    xRange: [-180, 180],
    yRange: [-180, 180],
  };

  outputs.set("plot", plot);
  return outputs;
}
