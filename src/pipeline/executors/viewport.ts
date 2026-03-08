import type {
  ParticleData,
  BondData,
  CellData,
  TrajectoryData,
  LabelData,
  MeshData,
  ViewportParams,
  ViewportState,
  PipelineData,
} from "../types";

export function executeViewport(
  params: ViewportParams,
  inputs: Map<string, PipelineData[]>,
): ViewportState {
  const particles = (inputs.get("particle") ?? []) as ParticleData[];
  const bonds = (inputs.get("bond") ?? []) as BondData[];
  const cells = (inputs.get("cell") ?? []) as CellData[];
  const trajectories = (inputs.get("trajectory") ?? []) as TrajectoryData[];
  const labels = (inputs.get("label") ?? []) as LabelData[];
  const meshes = (inputs.get("mesh") ?? []) as MeshData[];

  const filteredBonds = filterBondsByParticles(bonds, particles);

  const sortedTrajectories = [...trajectories].sort((a, b) => {
    if (a.source === "file" && b.source !== "file") return -1;
    if (a.source !== "file" && b.source === "file") return 1;
    return 0;
  });

  return {
    particles,
    bonds: filteredBonds,
    cells,
    trajectories: sortedTrajectories,
    labels,
    meshes,
    perspective: params.perspective,
    cellAxesVisible: params.cellAxesVisible,
  };
}

/**
 * Drop bonds whose atoms are not present in any connected particle stream.
 */
function filterBondsByParticles(
  bonds: BondData[],
  particles: ParticleData[],
): BondData[] {
  if (bonds.length === 0 || particles.length === 0) return bonds;

  let allIndices: Set<number> | null = null;
  for (const p of particles) {
    if (p.indices === null) {
      return bonds;
    }
    if (!allIndices) {
      allIndices = new Set(p.indices);
    } else {
      for (const idx of p.indices) {
        allIndices.add(idx);
      }
    }
  }

  if (!allIndices) return bonds;

  return bonds.map((bond) => {
    const validBondPairs: number[] = [];
    const validOrders: number[] = [];
    for (let i = 0; i < bond.nBonds; i++) {
      const a = bond.bondIndices[i * 2];
      const b = bond.bondIndices[i * 2 + 1];
      if (allIndices!.has(a) && allIndices!.has(b)) {
        validBondPairs.push(a, b);
        if (bond.bondOrders) validOrders.push(bond.bondOrders[i]);
      }
    }
    if (validBondPairs.length === bond.nBonds * 2) return bond;
    return {
      ...bond,
      bondIndices: new Uint32Array(validBondPairs),
      bondOrders: bond.bondOrders ? new Uint8Array(validOrders) : null,
      nBonds: validBondPairs.length / 2,
    };
  });
}
