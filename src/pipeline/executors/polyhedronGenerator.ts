import type { CoordinationData, MeshData, PipelineData, PolyhedronGeneratorParams } from "../types";
import { getColor } from "../../constants";
import { computeConvexHull } from "../../logic/convexHull";

/**
 * Convert already-resolved center-neighbor relationships into convex-hull
 * meshes. Periodic atom display and completing neighbors outside the drawing
 * range are deliberately upstream responsibilities.
 */
export function executePolyhedronGenerator(
  params: PolyhedronGeneratorParams,
  inputs: Map<string, PipelineData[]>,
): Map<string, PipelineData> {
  const outputs = new Map<string, PipelineData>();
  const coordination = inputs.get("coordination")?.[0] as CoordinationData | undefined;
  if (!coordination) return outputs;

  const neighborsByCenter = new Map<number, number[]>();
  for (let relation = 0; relation < coordination.nBonds; relation++) {
    const center = coordination.bondIndices[relation * 2];
    const neighbor = coordination.bondIndices[relation * 2 + 1];
    const neighbors = neighborsByCenter.get(center) ?? [];
    if (!neighbors.includes(neighbor)) neighbors.push(neighbor);
    neighborsByCenter.set(center, neighbors);
  }

  const allPositions: number[] = [];
  const allIndices: number[] = [];
  const allNormals: number[] = [];
  const allColors: number[] = [];
  const allEdgePositions: number[] = [];
  let vertexOffset = 0;

  for (const [center, neighbors] of neighborsByCenter) {
    if (neighbors.length < 4) continue;
    const neighborPoints = new Float32Array(neighbors.length * 3);
    for (let neighbor = 0; neighbor < neighbors.length; neighbor++) {
      const source3 = neighbors[neighbor] * 3;
      const target3 = neighbor * 3;
      neighborPoints[target3] = coordination.positions[source3];
      neighborPoints[target3 + 1] = coordination.positions[source3 + 1];
      neighborPoints[target3 + 2] = coordination.positions[source3 + 2];
    }
    const hull = computeConvexHull(neighborPoints, neighbors.length);
    if (!hull) continue;

    const [red, green, blue] = getColor(coordination.elements[center]);
    const nVertices = hull.vertices.length / 3;
    for (let vertex = 0; vertex < nVertices; vertex++) {
      allPositions.push(
        hull.vertices[vertex * 3],
        hull.vertices[vertex * 3 + 1],
        hull.vertices[vertex * 3 + 2],
      );
      allNormals.push(
        hull.normals[vertex * 3],
        hull.normals[vertex * 3 + 1],
        hull.normals[vertex * 3 + 2],
      );
      allColors.push(red, green, blue, params.opacity);
    }
    for (const index of hull.indices) allIndices.push(index + vertexOffset);
    for (const edgePosition of hull.edges) allEdgePositions.push(edgePosition);
    vertexOffset += nVertices;
  }

  if (allIndices.length === 0) return outputs;
  const mesh: MeshData = {
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
  outputs.set("mesh", mesh);
  return outputs;
}
