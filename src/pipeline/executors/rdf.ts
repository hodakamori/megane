import type {
  PipelineData,
  ParticleData,
  CellData,
  TrajectoryData,
  PlotData,
  RdfParams,
} from "../types";

/** Atomic symbols for common elements (atomic number → symbol). */
const ELEMENT_SYMBOLS: Record<number, string> = {
  1: "H",
  6: "C",
  7: "N",
  8: "O",
  15: "P",
  16: "S",
  17: "Cl",
  26: "Fe",
  30: "Zn",
};

function elementLabel(z: number): string {
  return z === 0 ? "all" : (ELEMENT_SYMBOLS[z] ?? `Z${z}`);
}

/** Compute the volume of a 3×3 row-major box matrix (|det|). */
function boxVolume(box: Float32Array): number {
  const [ax, ay, az, bx, by, bz, cx, cy, cz] = box;
  return Math.abs(ax * (by * cz - bz * cy) - ay * (bx * cz - bz * cx) + az * (bx * cy - by * cx));
}

/**
 * Minimum-image distance for an orthorhombic box.
 * The box matrix is 3×3 row-major; diagonal elements are [0],[4],[8].
 */
function minImageDist(dx: number, dy: number, dz: number, box: Float32Array): number {
  const Lx = box[0],
    Ly = box[4],
    Lz = box[8];
  dx -= Math.round(dx / Lx) * Lx;
  dy -= Math.round(dy / Ly) * Ly;
  dz -= Math.round(dz / Lz) * Lz;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

/**
 * Accumulate pair-distance histogram from a single set of positions.
 * When elementA === elementB we skip the ib <= ia pairs to avoid
 * double-counting; the caller compensates with a factor of 2.
 */
function accumulateHistogram(
  positions: Float32Array,
  indicesA: number[],
  indicesB: number[],
  sameType: boolean,
  binWidth: number,
  nBins: number,
  rMax: number,
  box: Float32Array | null,
  histogram: Float64Array,
): void {
  for (const ia of indicesA) {
    const ax = positions[ia * 3];
    const ay = positions[ia * 3 + 1];
    const az = positions[ia * 3 + 2];

    for (const ib of indicesB) {
      if (sameType && ib <= ia) continue;

      const dx = positions[ib * 3] - ax;
      const dy = positions[ib * 3 + 1] - ay;
      const dz = positions[ib * 3 + 2] - az;

      const r = box ? minImageDist(dx, dy, dz, box) : Math.sqrt(dx * dx + dy * dy + dz * dz);

      if (r > 0 && r < rMax) {
        const bin = Math.floor(r / binWidth);
        if (bin < nBins) histogram[bin]++;
      }
    }
  }
}

/**
 * Execute the RDF (radial distribution function) node.
 *
 * Inputs: `particle` (required), `trajectory` (optional), `cell` (optional).
 * Output: `plot` (PlotData with g(r) or raw pair count when no box is available).
 */
export function executeRdf(
  params: RdfParams,
  inputs: Map<string, PipelineData[]>,
): Map<string, PipelineData> {
  const outputs = new Map<string, PipelineData>();

  const particleData = inputs.get("particle")?.[0] as ParticleData | undefined;
  if (!particleData) return outputs;

  const cellData = inputs.get("cell")?.[0] as CellData | undefined;
  const trajectoryData = inputs.get("trajectory")?.[0] as TrajectoryData | undefined;

  const { elementA, elementB, binWidth, rMax, usePbc, frameStart, frameEnd } = params;
  const nBins = Math.max(1, Math.ceil(rMax / binWidth));
  const histogram = new Float64Array(nBins);

  const source = particleData.source;
  const elements = source.elements;
  const nAtoms = source.nAtoms;

  // Build atom-index lists for element A and B
  const indicesA: number[] = [];
  const indicesB: number[] = [];
  for (let i = 0; i < nAtoms; i++) {
    if (elementA === 0 || elements[i] === elementA) indicesA.push(i);
    if (elementB === 0 || elements[i] === elementB) indicesB.push(i);
  }

  if (indicesA.length === 0 || indicesB.length === 0) return outputs;

  // Same-element pairs: skip lower-triangle to avoid double-counting
  const sameType = elementA === elementB || (elementA === 0 && elementB === 0);

  // Resolve box for PBC
  let box: Float32Array | null = null;
  if (usePbc) {
    box = cellData?.box ?? source.box ?? null;
  }

  // Resolve trajectory provider and frame range
  const provider = trajectoryData?.provider ?? null;
  const totalFrames = provider ? provider.meta.nFrames : 1;
  const fi0 = Math.max(0, frameStart);
  const fi1 = frameEnd < 0 ? totalFrames - 1 : Math.min(frameEnd, totalFrames - 1);
  const framesUsed = Math.max(1, fi1 - fi0 + 1);

  for (let fi = fi0; fi <= fi1; fi++) {
    const positions = provider
      ? (provider.getFrame(fi)?.positions ?? source.positions)
      : source.positions;
    accumulateHistogram(
      positions,
      indicesA,
      indicesB,
      sameType,
      binWidth,
      nBins,
      rMax,
      box,
      histogram,
    );
  }

  // Normalize to g(r) or raw pair distribution
  const volume = box ? boxVolume(box) : 0;
  const nA = indicesA.length;
  const nB = indicesB.length;
  const pairFactor = sameType ? 2.0 : 1.0;
  const normBase = nA * nB * framesUsed;

  const x: number[] = new Array(nBins);
  const y: number[] = new Array(nBins);

  for (let i = 0; i < nBins; i++) {
    const rMid = (i + 0.5) * binWidth;
    x[i] = rMid;
    const shellVolume = 4 * Math.PI * rMid * rMid * binWidth;
    if (volume > 0) {
      // Standard g(r): normalize by ideal-gas reference density
      // g(r) = count × pairFactor × V / (N_A × N_B × frames × 4πr²Δr)
      y[i] = (histogram[i] * pairFactor * volume) / (normBase * shellVolume);
    } else {
      // No box: output raw pair distribution (pairs per shell per atom pair)
      y[i] = (histogram[i] * pairFactor) / (normBase * shellVolume);
    }
  }

  const labelA = elementLabel(elementA);
  const labelB = elementLabel(elementB);

  const plot: PlotData = {
    type: "plot",
    kind: "line",
    title: `RDF: ${labelA}–${labelB}`,
    xLabel: "r (Å)",
    yLabel: volume > 0 ? "g(r)" : "pairs/Å³",
    x,
    y,
  };

  outputs.set("plot", plot);
  return outputs;
}
