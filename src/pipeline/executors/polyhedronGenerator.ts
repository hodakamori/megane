import type {
  PipelineData,
  ParticleData,
  MeshData,
  PolyhedronGeneratorParams,
} from "../types";
import { getColor } from "../../constants";
import { computeConvexHull } from "../../logic/convexHull";
import { invert3x3 } from "./mathUtils";

/**
 * Apply minimum-image convention to a displacement vector using cell matrix.
 */
function minimumImage(
  dx: number, dy: number, dz: number,
  box: Float32Array, boxInv: Float32Array,
): [number, number, number] {
  let sx = boxInv[0] * dx + boxInv[3] * dy + boxInv[6] * dz;
  let sy = boxInv[1] * dx + boxInv[4] * dy + boxInv[7] * dz;
  let sz = boxInv[2] * dx + boxInv[5] * dy + boxInv[8] * dz;

  sx -= Math.round(sx);
  sy -= Math.round(sy);
  sz -= Math.round(sz);

  return [
    box[0] * sx + box[3] * sy + box[6] * sz,
    box[1] * sx + box[4] * sy + box[7] * sz,
    box[2] * sx + box[5] * sy + box[8] * sz,
  ];
}

export function executePolyhedronGenerator(
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

  const centerIndices: number[] = [];
  const ligandIndices: number[] = [];
  for (let i = 0; i < nAtoms; i++) {
    if (centerSet.has(elements[i])) centerIndices.push(i);
    if (ligandSet.has(elements[i])) ligandIndices.push(i);
  }

  if (centerIndices.length === 0 || ligandIndices.length === 0) return outputs;

  const box = snapshot.box;
  let boxInv: Float32Array | null = null;
  if (box && box.some((v) => v !== 0)) {
    boxInv = invert3x3(box);
  }

  const maxDistSq = params.maxDistance * params.maxDistance;

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

    const ligandPoints: number[] = [];
    for (const li of ligandIndices) {
      let dx = positions[li * 3] - cx;
      let dy = positions[li * 3 + 1] - cy;
      let dz = positions[li * 3 + 2] - cz;

      if (boxInv && box) {
        [dx, dy, dz] = minimumImage(dx, dy, dz, box, boxInv);
      }

      const distSq = dx * dx + dy * dy + dz * dz;
      if (distSq <= maxDistSq && distSq > 0.01) {
        ligandPoints.push(cx + dx, cy + dy, cz + dz);
      }
    }

    const nLigands = ligandPoints.length / 3;
    if (nLigands < 4) continue;

    const pts = new Float32Array(ligandPoints);
    const hull = computeConvexHull(pts, nLigands);
    if (!hull) continue;

    const [cr, cg, cb] = getColor(elements[ci]);

    const nVerts = hull.vertices.length / 3;
    for (let v = 0; v < nVerts; v++) {
      allPositions.push(hull.vertices[v * 3], hull.vertices[v * 3 + 1], hull.vertices[v * 3 + 2]);
      allNormals.push(hull.normals[v * 3], hull.normals[v * 3 + 1], hull.normals[v * 3 + 2]);
      allColors.push(cr, cg, cb, params.opacity);
    }

    for (let i = 0; i < hull.indices.length; i++) {
      allIndices.push(hull.indices[i] + vertexOffset);
    }

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
    edgeColor: params.edgeColor,
    edgeWidth: params.edgeWidth,
  };

  outputs.set("mesh", meshData);
  return outputs;
}
