/**
 * Pipeline execution engine.
 * Propagates typed data packets through the node graph.
 * ViewportNode collects all inputs and produces a ViewportState.
 */

import type { Node, Edge } from "@xyflow/react";
import type { Snapshot } from "../types";
import type {
  PipelineNodeParams,
  PipelineData,
  ParticleData,
  BondData,
  CellData,
  LabelData,
  MeshData,
  ViewportState,
  ViewportParams,
  DataLoaderParams,
  FilterParams,
  ModifyParams,
  LabelGeneratorParams,
  PolyhedronGeneratorParams,
  PipelineDataType,
  PipelineNodeType,
} from "./types";
import { DEFAULT_VIEWPORT_STATE, NODE_PORTS } from "./types";
import { evaluateSelection } from "./selection";
import { getElementSymbol, getColor } from "../constants";
import { computeConvexHull } from "../logic/convexHull";

export interface PipelineNodeData {
  params: PipelineNodeParams;
  enabled: boolean;
  [key: string]: unknown;
}

// ─── Topological Sort ─────────────────────────────────────────────────

function topologicalSort(nodes: Node<PipelineNodeData>[], edges: Edge[]): string[] {
  const inDegree = new Map<string, number>();
  const adjacency = new Map<string, string[]>();

  for (const node of nodes) {
    inDegree.set(node.id, 0);
    adjacency.set(node.id, []);
  }

  for (const edge of edges) {
    const prev = inDegree.get(edge.target) ?? 0;
    inDegree.set(edge.target, prev + 1);
    adjacency.get(edge.source)?.push(edge.target);
  }

  const queue: string[] = [];
  for (const [id, deg] of inDegree) {
    if (deg === 0) queue.push(id);
  }

  const sorted: string[] = [];
  while (queue.length > 0) {
    const current = queue.shift()!;
    sorted.push(current);
    for (const next of adjacency.get(current) ?? []) {
      const newDeg = (inDegree.get(next) ?? 1) - 1;
      inDegree.set(next, newDeg);
      if (newDeg === 0) queue.push(next);
    }
  }

  return sorted;
}

// ─── Edge Data Map ────────────────────────────────────────────────────

/**
 * edgeOutputs[sourceNodeId][sourceHandle] = PipelineData
 * Multiple data can arrive at the same target port from different sources.
 */
type EdgeOutputs = Map<string, Map<string, PipelineData>>;

function collectInputs(
  nodeId: string,
  edges: Edge[],
  edgeOutputs: EdgeOutputs,
): Map<string, PipelineData[]> {
  const inputs = new Map<string, PipelineData[]>();
  for (const edge of edges) {
    if (edge.target !== nodeId) continue;
    const sourceHandle = edge.sourceHandle;
    const targetHandle = edge.targetHandle;
    if (!sourceHandle || !targetHandle) continue;

    const sourceOutputs = edgeOutputs.get(edge.source);
    if (!sourceOutputs) continue;
    const data = sourceOutputs.get(sourceHandle);
    if (!data) continue;

    if (!inputs.has(targetHandle)) {
      inputs.set(targetHandle, []);
    }
    inputs.get(targetHandle)!.push(data);
  }
  return inputs;
}

// ─── Node Execution ───────────────────────────────────────────────────

function executeDataLoader(
  params: DataLoaderParams,
  snapshot: Snapshot | null,
  atomLabels: string[] | null,
): Map<string, PipelineData> {
  const outputs = new Map<string, PipelineData>();
  if (!snapshot) return outputs;

  // Particle output (always present)
  const particle: ParticleData = {
    type: "particle",
    source: snapshot,
    indices: null,
    scaleOverrides: null,
    opacityOverrides: null,
    trajectory: null, // trajectory is managed externally for now
  };
  outputs.set("particle", particle);

  // Bond output (based on bondSource; actual bonds come from snapshot)
  if (params.bondSource !== "none" && snapshot.nBonds > 0) {
    const bond: BondData = {
      type: "bond",
      bondIndices: snapshot.bonds,
      bondOrders: snapshot.bondOrders,
      nBonds: snapshot.nBonds,
      scale: 1.0,
      opacity: 1.0,
    };
    outputs.set("bond", bond);
  }

  // Cell output
  if (snapshot.box) {
    const cell: CellData = {
      type: "cell",
      box: snapshot.box,
      visible: true,
      axesVisible: true,
    };
    outputs.set("cell", cell);
  }

  return outputs;
}

function executeFilter(
  params: FilterParams,
  inputs: Map<string, PipelineData[]>,
  atomLabels: string[] | null,
): Map<string, PipelineData> {
  const outputs = new Map<string, PipelineData>();
  const inData = inputs.get("in")?.[0];
  if (!inData) return outputs;

  if (inData.type === "particle") {
    const particle = inData as ParticleData;
    if (!params.query.trim()) {
      // Empty query = pass through
      outputs.set("out", particle);
      return outputs;
    }

    try {
      const selectionResult = evaluateSelection(
        params.query,
        particle.source,
        atomLabels,
      );

      if (selectionResult === null) {
        // "all" selected: pass through, but respect existing indices
        outputs.set("out", particle);
      } else {
        // Apply filter: intersect with existing indices
        let finalIndices: Uint32Array;
        if (particle.indices === null) {
          finalIndices = new Uint32Array(selectionResult);
        } else {
          const existing = new Set(particle.indices);
          const intersected = [...selectionResult].filter((i) => existing.has(i));
          finalIndices = new Uint32Array(intersected);
        }

        const filtered: ParticleData = {
          ...particle,
          indices: finalIndices,
          // Keep overrides from upstream (they reference source indices)
          scaleOverrides: particle.scaleOverrides,
          opacityOverrides: particle.opacityOverrides,
        };
        outputs.set("out", filtered);
      }
    } catch {
      // Invalid query: pass through unchanged
      outputs.set("out", particle);
    }
  } else if (inData.type === "bond") {
    // Bond filter: pass through for now (future: filter by bond order etc.)
    outputs.set("out", inData);
  }

  return outputs;
}

function executeModify(
  params: ModifyParams,
  inputs: Map<string, PipelineData[]>,
): Map<string, PipelineData> {
  const outputs = new Map<string, PipelineData>();
  const inData = inputs.get("in")?.[0];
  if (!inData) return outputs;

  if (inData.type === "particle") {
    const particle = inData as ParticleData;
    const nAtoms = particle.source.nAtoms;

    // Build scale overrides
    let scaleArr = particle.scaleOverrides;
    if (particle.indices !== null && particle.indices.length > 0) {
      // Per-atom overrides for the filtered subset
      if (!scaleArr) {
        scaleArr = new Float32Array(nAtoms).fill(1.0);
      } else {
        scaleArr = new Float32Array(scaleArr);
      }
      for (const idx of particle.indices) {
        scaleArr[idx] = params.scale;
      }
    } else if (particle.indices === null) {
      // Global: apply to all atoms
      if (params.scale !== 1.0) {
        scaleArr = new Float32Array(nAtoms).fill(params.scale);
      }
    }

    // Build opacity overrides
    let opacityArr = particle.opacityOverrides;
    if (particle.indices !== null && particle.indices.length > 0) {
      if (!opacityArr) {
        opacityArr = new Float32Array(nAtoms).fill(1.0);
      } else {
        opacityArr = new Float32Array(opacityArr);
      }
      for (const idx of particle.indices) {
        opacityArr[idx] = params.opacity;
      }
    } else if (particle.indices === null) {
      if (params.opacity !== 1.0) {
        opacityArr = new Float32Array(nAtoms).fill(params.opacity);
      }
    }

    const modified: ParticleData = {
      ...particle,
      scaleOverrides: scaleArr,
      opacityOverrides: opacityArr,
    };
    outputs.set("out", modified);
  } else if (inData.type === "bond") {
    const bond = inData as BondData;
    const modified: BondData = {
      ...bond,
      scale: params.scale,
      opacity: params.opacity,
    };
    outputs.set("out", modified);
  }

  return outputs;
}

function executeLabelGenerator(
  params: LabelGeneratorParams,
  inputs: Map<string, PipelineData[]>,
  atomLabels: string[] | null,
): Map<string, PipelineData> {
  const outputs = new Map<string, PipelineData>();
  const particleData = inputs.get("particle")?.[0] as ParticleData | undefined;
  if (!particleData) return outputs;

  const snapshot = particleData.source;
  let labels: string[];

  switch (params.source) {
    case "element":
      labels = Array.from(snapshot.elements).map((el) => getElementSymbol(el));
      break;
    case "resname":
      labels = atomLabels?.slice(0, snapshot.nAtoms) ?? [];
      break;
    case "index":
      labels = Array.from({ length: snapshot.nAtoms }, (_, i) => String(i));
      break;
    default:
      labels = [];
  }

  const labelData: LabelData = {
    type: "label",
    labels,
    particleRef: particleData,
  };
  outputs.set("label", labelData);
  return outputs;
}

/**
 * Invert a 3x3 row-major matrix. Returns null if singular.
 */
function invert3x3(m: Float32Array): Float32Array | null {
  const [a, b, c, d, e, f, g, h, i] = m;
  const det = a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g);
  if (Math.abs(det) < 1e-20) return null;
  const invDet = 1 / det;
  return new Float32Array([
    (e * i - f * h) * invDet, (c * h - b * i) * invDet, (b * f - c * e) * invDet,
    (f * g - d * i) * invDet, (a * i - c * g) * invDet, (c * d - a * f) * invDet,
    (d * h - e * g) * invDet, (b * g - a * h) * invDet, (a * e - b * d) * invDet,
  ]);
}

/**
 * Apply minimum-image convention to a displacement vector using cell matrix.
 * Returns the PBC-corrected displacement [dx, dy, dz].
 */
function minimumImage(
  dx: number, dy: number, dz: number,
  box: Float32Array, boxInv: Float32Array,
): [number, number, number] {
  // Convert to fractional coordinates
  let sx = boxInv[0] * dx + boxInv[1] * dy + boxInv[2] * dz;
  let sy = boxInv[3] * dx + boxInv[4] * dy + boxInv[5] * dz;
  let sz = boxInv[6] * dx + boxInv[7] * dy + boxInv[8] * dz;

  // Wrap to [-0.5, 0.5)
  sx -= Math.round(sx);
  sy -= Math.round(sy);
  sz -= Math.round(sz);

  // Convert back to Cartesian
  return [
    box[0] * sx + box[3] * sy + box[6] * sz,
    box[1] * sx + box[4] * sy + box[7] * sz,
    box[2] * sx + box[5] * sy + box[8] * sz,
  ];
}

function executePolyhedronGenerator(
  params: PolyhedronGeneratorParams,
  inputs: Map<string, PipelineData[]>,
): Map<string, PipelineData> {
  const outputs = new Map<string, PipelineData>();
  const particleData = inputs.get("particle")?.[0] as ParticleData | undefined;
  if (!particleData) return outputs;

  const snapshot = particleData.source;
  const { positions, elements, nAtoms } = snapshot;
  const centerSet = new Set(params.centerElements);
  const ligandSet = new Set(params.ligandElements);

  if (centerSet.size === 0 || ligandSet.size === 0) return outputs;

  // Classify atoms
  const centerIndices: number[] = [];
  const ligandIndices: number[] = [];
  for (let i = 0; i < nAtoms; i++) {
    if (centerSet.has(elements[i])) centerIndices.push(i);
    if (ligandSet.has(elements[i])) ligandIndices.push(i);
  }

  if (centerIndices.length === 0 || ligandIndices.length === 0) return outputs;

  // PBC setup
  const box = snapshot.box;
  let boxInv: Float32Array | null = null;
  if (box && box.some((v) => v !== 0)) {
    boxInv = invert3x3(box);
  }

  const maxDistSq = params.maxDistance * params.maxDistance;

  // Collect all polyhedra geometry
  const allPositions: number[] = [];
  const allIndices: number[] = [];
  const allNormals: number[] = [];
  const allColors: number[] = [];
  const allEdgePositions: number[] = [];
  let vertexOffset = 0;

  for (const ci of centerIndices) {
    const cx = positions[ci * 3];
    const cy = positions[ci * 3 + 1];
    const cz = positions[ci * 3 + 2];

    // Find coordinated ligands
    const ligandPoints: number[] = []; // flat xyz of PBC-corrected ligand positions
    for (const li of ligandIndices) {
      let dx = positions[li * 3] - cx;
      let dy = positions[li * 3 + 1] - cy;
      let dz = positions[li * 3 + 2] - cz;

      if (boxInv && box) {
        [dx, dy, dz] = minimumImage(dx, dy, dz, box, boxInv);
      }

      const distSq = dx * dx + dy * dy + dz * dz;
      if (distSq <= maxDistSq && distSq > 0.01) {
        // Store PBC-corrected absolute position
        ligandPoints.push(cx + dx, cy + dy, cz + dz);
      }
    }

    const nLigands = ligandPoints.length / 3;
    if (nLigands < 4) continue; // Need at least 4 for a polyhedron

    const pts = new Float32Array(ligandPoints);
    const hull = computeConvexHull(pts, nLigands);
    if (!hull) continue;

    // Get color from center element
    const [cr, cg, cb] = getColor(elements[ci]);

    // Add vertices
    const nVerts = hull.vertices.length / 3;
    for (let v = 0; v < nVerts; v++) {
      allPositions.push(hull.vertices[v * 3], hull.vertices[v * 3 + 1], hull.vertices[v * 3 + 2]);
      allNormals.push(hull.normals[v * 3], hull.normals[v * 3 + 1], hull.normals[v * 3 + 2]);
      allColors.push(cr, cg, cb, params.opacity);
    }

    // Add indices (offset by current vertex count)
    for (let i = 0; i < hull.indices.length; i++) {
      allIndices.push(hull.indices[i] + vertexOffset);
    }

    // Add edge positions
    for (let i = 0; i < hull.edges.length; i++) {
      allEdgePositions.push(hull.edges[i]);
    }

    vertexOffset += nVerts;
  }

  if (allIndices.length === 0) return outputs;

  const meshData: MeshData = {
    type: "mesh",
    positions: new Float32Array(allPositions),
    indices: new Uint32Array(allIndices),
    normals: new Float32Array(allNormals),
    colors: new Float32Array(allColors),
    opacity: params.opacity,
    showEdges: params.showEdges,
    edgePositions: params.showEdges ? new Float32Array(allEdgePositions) : null,
  };

  outputs.set("mesh", meshData);
  return outputs;
}

function executeViewport(
  params: ViewportParams,
  inputs: Map<string, PipelineData[]>,
): ViewportState {
  const particles = (inputs.get("particle") ?? []) as ParticleData[];
  const bonds = (inputs.get("bond") ?? []) as BondData[];
  const cells = (inputs.get("cell") ?? []) as CellData[];
  const labels = (inputs.get("label") ?? []) as LabelData[];
  const meshes = (inputs.get("mesh") ?? []) as MeshData[];

  // Auto-filter bonds: drop bonds referencing atoms not in any particle stream
  const filteredBonds = filterBondsByParticles(bonds, particles);

  return {
    particles,
    bonds: filteredBonds,
    cells,
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

  // Build the set of valid atom indices from all particle streams
  let allIndices: Set<number> | null = null;
  for (const p of particles) {
    if (p.indices === null) {
      // At least one particle stream includes all atoms → no filtering needed
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
    if (validBondPairs.length === bond.nBonds * 2) return bond; // No change
    return {
      ...bond,
      bondIndices: new Uint32Array(validBondPairs),
      bondOrders: bond.bondOrders ? new Uint8Array(validOrders) : null,
      nBonds: validBondPairs.length / 2,
    };
  });
}

// ─── Main Execution ───────────────────────────────────────────────────

/**
 * Execute the pipeline and produce a ViewportState.
 * Returns DEFAULT_VIEWPORT_STATE if no viewport node exists.
 */
export function executePipeline(
  nodes: Node<PipelineNodeData>[],
  edges: Edge[],
  snapshot?: Snapshot | null,
  atomLabels?: string[] | null,
): ViewportState {
  const sortedIds = topologicalSort(nodes, edges);
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  const edgeOutputs: EdgeOutputs = new Map();

  let viewportState: ViewportState = { ...DEFAULT_VIEWPORT_STATE };

  for (const id of sortedIds) {
    const node = nodeMap.get(id);
    if (!node) continue;
    const data = node.data;

    if (!data.enabled) {
      // Disabled nodes: pass through inputs as outputs (for filter/modify)
      const inputs = collectInputs(id, edges, edgeOutputs);
      const passthrough = new Map<string, PipelineData>();
      const nodeType = data.params.type as PipelineNodeType;
      const ports = NODE_PORTS[nodeType];
      // Map first input to first output of matching type
      for (const [portName, dataList] of inputs) {
        if (dataList.length > 0) {
          const matchingOutput = ports.outputs.find((o) => {
            const inputPort = ports.inputs.find((i) => i.name === portName);
            return inputPort && o.dataType === inputPort.dataType;
          });
          if (matchingOutput) {
            passthrough.set(matchingOutput.name, dataList[0]);
          }
        }
      }
      edgeOutputs.set(id, passthrough);
      continue;
    }

    const inputs = collectInputs(id, edges, edgeOutputs);

    switch (data.params.type) {
      case "data_loader": {
        const outputs = executeDataLoader(
          data.params as DataLoaderParams,
          snapshot ?? null,
          atomLabels ?? null,
        );
        edgeOutputs.set(id, outputs);
        break;
      }
      case "filter": {
        const outputs = executeFilter(
          data.params as FilterParams,
          inputs,
          atomLabels ?? null,
        );
        edgeOutputs.set(id, outputs);
        break;
      }
      case "modify": {
        const outputs = executeModify(
          data.params as ModifyParams,
          inputs,
        );
        edgeOutputs.set(id, outputs);
        break;
      }
      case "label_generator": {
        const outputs = executeLabelGenerator(
          data.params as LabelGeneratorParams,
          inputs,
          atomLabels ?? null,
        );
        edgeOutputs.set(id, outputs);
        break;
      }
      case "polyhedron_generator": {
        const outputs = executePolyhedronGenerator(
          data.params as PolyhedronGeneratorParams,
          inputs,
        );
        edgeOutputs.set(id, outputs);
        break;
      }
      case "viewport": {
        viewportState = executeViewport(
          data.params as ViewportParams,
          inputs,
        );
        break;
      }
    }
  }

  return viewportState;
}
