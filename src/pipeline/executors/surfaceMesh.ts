/**
 * Surface Mesh executor.
 * Generates an isosurface mesh around atom positions using Marching Cubes
 * on a Gaussian density field. Similar to OVITO's "Construct Surface Mesh".
 *
 * Algorithm:
 * 1. Compute bounding box with padding
 * 2. Build spatial cell list for fast neighbor lookup
 * 3. Evaluate Gaussian density on a 3D grid
 * 4. Extract isosurface via Marching Cubes
 * 5. Compute vertex normals
 * 6. Optional Laplacian smoothing
 */

import type { PipelineData, ParticleData, CellData, MeshData, SurfaceMeshParams } from "../types";
import { EDGE_TABLE, TRI_TABLE } from "./marchingCubesTables";

// ─── Density Field ───────────────────────────────────────────────────

/**
 * Build a spatial cell list for fast neighbor queries.
 * Returns a Map from linearized cell index to array of atom indices.
 */
function buildCellList(
  positions: Float32Array,
  nAtoms: number,
  origin: [number, number, number],
  cellSize: number,
  nCellsX: number,
  nCellsY: number,
  nCellsZ: number,
): Map<number, number[]> {
  const cells = new Map<number, number[]>();
  for (let i = 0; i < nAtoms; i++) {
    const cx = Math.floor((positions[i * 3] - origin[0]) / cellSize);
    const cy = Math.floor((positions[i * 3 + 1] - origin[1]) / cellSize);
    const cz = Math.floor((positions[i * 3 + 2] - origin[2]) / cellSize);
    // Clamp to grid bounds
    const ix = Math.max(0, Math.min(nCellsX - 1, cx));
    const iy = Math.max(0, Math.min(nCellsY - 1, cy));
    const iz = Math.max(0, Math.min(nCellsZ - 1, cz));
    const key = ix + iy * nCellsX + iz * nCellsX * nCellsY;
    let list = cells.get(key);
    if (!list) {
      list = [];
      cells.set(key, list);
    }
    list.push(i);
  }
  return cells;
}

/**
 * Compute the Gaussian density field on a 3D grid.
 * Uses a cell list to only iterate over nearby atoms.
 */
function computeDensityField(
  positions: Float32Array,
  nAtoms: number,
  gridOrigin: [number, number, number],
  gridSpacing: number,
  nx: number,
  ny: number,
  nz: number,
  sigma: number,
): Float32Array {
  const field = new Float32Array(nx * ny * nz);
  const cutoff = sigma * 3.0; // 3-sigma cutoff
  const invTwoSigmaSq = 1.0 / (2.0 * sigma * sigma);
  const cellSize = cutoff;

  // Build cell list for atoms
  const nCellsX = Math.max(1, Math.ceil((nx * gridSpacing) / cellSize));
  const nCellsY = Math.max(1, Math.ceil((ny * gridSpacing) / cellSize));
  const nCellsZ = Math.max(1, Math.ceil((nz * gridSpacing) / cellSize));
  const cellList = buildCellList(
    positions,
    nAtoms,
    gridOrigin,
    cellSize,
    nCellsX,
    nCellsY,
    nCellsZ,
  );

  const cutoffSq = cutoff * cutoff;

  for (let iz = 0; iz < nz; iz++) {
    const gz = gridOrigin[2] + iz * gridSpacing;
    for (let iy = 0; iy < ny; iy++) {
      const gy = gridOrigin[1] + iy * gridSpacing;
      for (let ix = 0; ix < nx; ix++) {
        const gx = gridOrigin[0] + ix * gridSpacing;

        // Determine which spatial cells to check
        const cxMin = Math.max(0, Math.floor((gx - cutoff - gridOrigin[0]) / cellSize));
        const cxMax = Math.min(nCellsX - 1, Math.floor((gx + cutoff - gridOrigin[0]) / cellSize));
        const cyMin = Math.max(0, Math.floor((gy - cutoff - gridOrigin[1]) / cellSize));
        const cyMax = Math.min(nCellsY - 1, Math.floor((gy + cutoff - gridOrigin[1]) / cellSize));
        const czMin = Math.max(0, Math.floor((gz - cutoff - gridOrigin[2]) / cellSize));
        const czMax = Math.min(nCellsZ - 1, Math.floor((gz + cutoff - gridOrigin[2]) / cellSize));

        let density = 0;
        for (let ccz = czMin; ccz <= czMax; ccz++) {
          for (let ccy = cyMin; ccy <= cyMax; ccy++) {
            for (let ccx = cxMin; ccx <= cxMax; ccx++) {
              const cellKey = ccx + ccy * nCellsX + ccz * nCellsX * nCellsY;
              const atomList = cellList.get(cellKey);
              if (!atomList) continue;
              for (let ai = 0; ai < atomList.length; ai++) {
                const idx = atomList[ai];
                const dx = gx - positions[idx * 3];
                const dy = gy - positions[idx * 3 + 1];
                const dz = gz - positions[idx * 3 + 2];
                const distSq = dx * dx + dy * dy + dz * dz;
                if (distSq < cutoffSq) {
                  density += Math.exp(-distSq * invTwoSigmaSq);
                }
              }
            }
          }
        }
        field[ix + iy * nx + iz * nx * ny] = density;
      }
    }
  }

  return field;
}

// ─── Marching Cubes ──────────────────────────────────────────────────

/** Edge vertex indices: each edge connects two of the 8 cube corners. */
const EDGE_VERTICES: readonly [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 0],
  [4, 5], [5, 6], [6, 7], [7, 4],
  [0, 4], [1, 5], [2, 6], [3, 7],
];

/** Corner offsets in (ix, iy, iz) for the 8 cube vertices. */
const CORNER_OFFSETS: readonly [number, number, number][] = [
  [0, 0, 0], [1, 0, 0], [1, 1, 0], [0, 1, 0],
  [0, 0, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1],
];

interface MarchingCubesResult {
  positions: Float32Array;
  indices: Uint32Array;
}

function marchingCubes(
  field: Float32Array,
  nx: number,
  ny: number,
  nz: number,
  isovalue: number,
  gridOrigin: [number, number, number],
  gridSpacing: number,
): MarchingCubesResult {
  const outPositions: number[] = [];
  const outIndices: number[] = [];

  // Cache for edge vertex indices to avoid duplicate vertices.
  // Key: encoded edge position, Value: vertex index in outPositions.
  const edgeVertexCache = new Map<number, number>();

  // Encode an edge uniquely: edge is defined by its lower-corner grid position and edge ID (0-11).
  // We encode as: (iz * ny * nx + iy * nx + ix) * 12 + edgeId
  function encodeEdge(ix: number, iy: number, iz: number, edgeId: number): number {
    return (iz * ny * nx + iy * nx + ix) * 12 + edgeId;
  }

  function getFieldValue(ix: number, iy: number, iz: number): number {
    return field[ix + iy * nx + iz * nx * ny];
  }

  function interpolateEdge(
    ix: number,
    iy: number,
    iz: number,
    edgeId: number,
  ): number {
    const key = encodeEdge(ix, iy, iz, edgeId);
    const cached = edgeVertexCache.get(key);
    if (cached !== undefined) return cached;

    const [c0, c1] = EDGE_VERTICES[edgeId];
    const [ox0, oy0, oz0] = CORNER_OFFSETS[c0];
    const [ox1, oy1, oz1] = CORNER_OFFSETS[c1];

    const v0 = getFieldValue(ix + ox0, iy + oy0, iz + oz0);
    const v1 = getFieldValue(ix + ox1, iy + oy1, iz + oz1);

    let t = 0.5;
    const dv = v1 - v0;
    if (Math.abs(dv) > 1e-10) {
      t = (isovalue - v0) / dv;
    }

    const x = gridOrigin[0] + (ix + ox0 + t * (ox1 - ox0)) * gridSpacing;
    const y = gridOrigin[1] + (iy + oy0 + t * (oy1 - oy0)) * gridSpacing;
    const z = gridOrigin[2] + (iz + oz0 + t * (oz1 - oz0)) * gridSpacing;

    const vertexIndex = outPositions.length / 3;
    outPositions.push(x, y, z);
    edgeVertexCache.set(key, vertexIndex);
    return vertexIndex;
  }

  for (let iz = 0; iz < nz - 1; iz++) {
    for (let iy = 0; iy < ny - 1; iy++) {
      for (let ix = 0; ix < nx - 1; ix++) {
        // Determine cube configuration
        let cubeIndex = 0;
        for (let c = 0; c < 8; c++) {
          const [ox, oy, oz] = CORNER_OFFSETS[c];
          if (getFieldValue(ix + ox, iy + oy, iz + oz) >= isovalue) {
            cubeIndex |= 1 << c;
          }
        }

        const edges = EDGE_TABLE[cubeIndex];
        if (edges === 0) continue;

        const triangles = TRI_TABLE[cubeIndex];
        for (let t = 0; t < triangles.length; t += 3) {
          const a = interpolateEdge(ix, iy, iz, triangles[t]);
          const b = interpolateEdge(ix, iy, iz, triangles[t + 1]);
          const c = interpolateEdge(ix, iy, iz, triangles[t + 2]);
          outIndices.push(a, b, c);
        }
      }
    }
  }

  return {
    positions: new Float32Array(outPositions),
    indices: new Uint32Array(outIndices),
  };
}

// ─── Normals ─────────────────────────────────────────────────────────

function computeNormals(positions: Float32Array, indices: Uint32Array): Float32Array {
  const nVertices = positions.length / 3;
  const normals = new Float32Array(nVertices * 3);

  for (let i = 0; i < indices.length; i += 3) {
    const ia = indices[i], ib = indices[i + 1], ic = indices[i + 2];
    const ax = positions[ia * 3], ay = positions[ia * 3 + 1], az = positions[ia * 3 + 2];
    const bx = positions[ib * 3], by = positions[ib * 3 + 1], bz = positions[ib * 3 + 2];
    const cx = positions[ic * 3], cy = positions[ic * 3 + 1], cz = positions[ic * 3 + 2];

    const abx = bx - ax, aby = by - ay, abz = bz - az;
    const acx = cx - ax, acy = cy - ay, acz = cz - az;

    // Cross product (face normal, area-weighted)
    const nx = aby * acz - abz * acy;
    const ny = abz * acx - abx * acz;
    const nz = abx * acy - aby * acx;

    normals[ia * 3] += nx; normals[ia * 3 + 1] += ny; normals[ia * 3 + 2] += nz;
    normals[ib * 3] += nx; normals[ib * 3 + 1] += ny; normals[ib * 3 + 2] += nz;
    normals[ic * 3] += nx; normals[ic * 3 + 1] += ny; normals[ic * 3 + 2] += nz;
  }

  // Normalize
  for (let i = 0; i < nVertices; i++) {
    const x = normals[i * 3], y = normals[i * 3 + 1], z = normals[i * 3 + 2];
    const len = Math.sqrt(x * x + y * y + z * z);
    if (len > 1e-10) {
      normals[i * 3] /= len;
      normals[i * 3 + 1] /= len;
      normals[i * 3 + 2] /= len;
    }
  }

  return normals;
}

// ─── Laplacian Smoothing ─────────────────────────────────────────────

function laplacianSmooth(
  positions: Float32Array,
  indices: Uint32Array,
  iterations: number,
  lambda: number = 0.5,
): void {
  if (iterations <= 0) return;

  const nVertices = positions.length / 3;

  // Build adjacency: for each vertex, list of neighbor vertex indices
  const adjacency: number[][] = new Array(nVertices);
  for (let i = 0; i < nVertices; i++) adjacency[i] = [];

  const edgeSeen = new Set<number>();
  for (let i = 0; i < indices.length; i += 3) {
    const a = indices[i], b = indices[i + 1], c = indices[i + 2];
    const pairs: [number, number][] = [[a, b], [b, c], [c, a]];
    for (const [u, v] of pairs) {
      const key = Math.min(u, v) * nVertices + Math.max(u, v);
      if (!edgeSeen.has(key)) {
        edgeSeen.add(key);
        adjacency[u].push(v);
        adjacency[v].push(u);
      }
    }
  }

  const temp = new Float32Array(nVertices * 3);

  for (let iter = 0; iter < iterations; iter++) {
    temp.set(positions);
    for (let v = 0; v < nVertices; v++) {
      const neighbors = adjacency[v];
      if (neighbors.length === 0) continue;
      let avgX = 0, avgY = 0, avgZ = 0;
      for (let n = 0; n < neighbors.length; n++) {
        const ni = neighbors[n];
        avgX += temp[ni * 3];
        avgY += temp[ni * 3 + 1];
        avgZ += temp[ni * 3 + 2];
      }
      const inv = 1.0 / neighbors.length;
      avgX *= inv; avgY *= inv; avgZ *= inv;
      positions[v * 3] = temp[v * 3] + lambda * (avgX - temp[v * 3]);
      positions[v * 3 + 1] = temp[v * 3 + 1] + lambda * (avgY - temp[v * 3 + 1]);
      positions[v * 3 + 2] = temp[v * 3 + 2] + lambda * (avgZ - temp[v * 3 + 2]);
    }
  }
}

// ─── Edge Extraction ─────────────────────────────────────────────────

function extractEdges(positions: Float32Array, indices: Uint32Array): Float32Array {
  const nVertices = positions.length / 3;
  const edgeSet = new Set<number>();
  const edgePositions: number[] = [];

  for (let i = 0; i < indices.length; i += 3) {
    const a = indices[i], b = indices[i + 1], c = indices[i + 2];
    const pairs: [number, number][] = [[a, b], [b, c], [c, a]];
    for (const [u, v] of pairs) {
      const key = Math.min(u, v) * nVertices + Math.max(u, v);
      if (!edgeSet.has(key)) {
        edgeSet.add(key);
        edgePositions.push(
          positions[u * 3], positions[u * 3 + 1], positions[u * 3 + 2],
          positions[v * 3], positions[v * 3 + 1], positions[v * 3 + 2],
        );
      }
    }
  }

  return new Float32Array(edgePositions);
}

// ─── Hex Color Parsing ───────────────────────────────────────────────

function parseHexColor(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16) / 255;
  const g = parseInt(h.substring(2, 4), 16) / 255;
  const b = parseInt(h.substring(4, 6), 16) / 255;
  return [r, g, b];
}

// ─── Main Executor ───────────────────────────────────────────────────

export function executeSurfaceMesh(
  params: SurfaceMeshParams,
  inputs: Map<string, PipelineData[]>,
): Map<string, PipelineData> {
  const outputs = new Map<string, PipelineData>();
  const particleData = inputs.get("particle")?.[0] as ParticleData | undefined;
  if (!particleData) return outputs;

  const snapshot = particleData.source;
  const { positions, nAtoms } = snapshot;
  if (nAtoms === 0) return outputs;

  // Use only selected atoms if filter is applied
  const indices = particleData.indices;
  let activePositions: Float32Array;
  let activeCount: number;
  if (indices) {
    activeCount = indices.length;
    activePositions = new Float32Array(activeCount * 3);
    for (let i = 0; i < activeCount; i++) {
      const src = indices[i] * 3;
      activePositions[i * 3] = positions[src];
      activePositions[i * 3 + 1] = positions[src + 1];
      activePositions[i * 3 + 2] = positions[src + 2];
    }
  } else {
    activePositions = positions;
    activeCount = nAtoms;
  }

  if (activeCount < 3) return outputs;

  // Compute bounding box
  let xMin = Infinity, yMin = Infinity, zMin = Infinity;
  let xMax = -Infinity, yMax = -Infinity, zMax = -Infinity;

  // Optionally use cell data for bounds
  const cellData = inputs.get("cell")?.[0] as CellData | undefined;
  if (cellData && cellData.box.some((v) => v !== 0)) {
    // Use cell box for bounds (assuming origin at 0)
    const box = cellData.box;
    // Compute cell extent from the 3x3 matrix columns
    for (let corner = 0; corner < 8; corner++) {
      const a = corner & 1 ? 1 : 0;
      const b = corner & 2 ? 1 : 0;
      const c = corner & 4 ? 1 : 0;
      const x = a * box[0] + b * box[3] + c * box[6];
      const y = a * box[1] + b * box[4] + c * box[7];
      const z = a * box[2] + b * box[5] + c * box[8];
      xMin = Math.min(xMin, x); xMax = Math.max(xMax, x);
      yMin = Math.min(yMin, y); yMax = Math.max(yMax, y);
      zMin = Math.min(zMin, z); zMax = Math.max(zMax, z);
    }
  } else {
    for (let i = 0; i < activeCount; i++) {
      const x = activePositions[i * 3];
      const y = activePositions[i * 3 + 1];
      const z = activePositions[i * 3 + 2];
      xMin = Math.min(xMin, x); xMax = Math.max(xMax, x);
      yMin = Math.min(yMin, y); yMax = Math.max(yMax, y);
      zMin = Math.min(zMin, z); zMax = Math.max(zMax, z);
    }
  }

  // Add padding
  const padding = params.probeRadius * 2;
  xMin -= padding; yMin -= padding; zMin -= padding;
  xMax += padding; yMax += padding; zMax += padding;

  // Grid dimensions
  const gridSpacing = 1.0 / params.gridResolution;
  const nx = Math.max(2, Math.ceil((xMax - xMin) / gridSpacing) + 1);
  const ny = Math.max(2, Math.ceil((yMax - yMin) / gridSpacing) + 1);
  const nz = Math.max(2, Math.ceil((zMax - zMin) / gridSpacing) + 1);

  // Safety: limit grid size to prevent memory explosion
  const totalCells = nx * ny * nz;
  if (totalCells > 8_000_000) return outputs; // ~32MB for Float32Array

  const gridOrigin: [number, number, number] = [xMin, yMin, zMin];
  const sigma = params.probeRadius / 2.5;

  // Step 1: Compute density field
  const field = computeDensityField(
    activePositions,
    activeCount,
    gridOrigin,
    gridSpacing,
    nx,
    ny,
    nz,
    sigma,
  );

  // Step 2: Marching Cubes
  const isovalue = 0.5;
  const mcResult = marchingCubes(field, nx, ny, nz, isovalue, gridOrigin, gridSpacing);

  if (mcResult.indices.length === 0) return outputs;

  // Step 3: Laplacian smoothing (mutates positions in place)
  if (params.smoothingLevel > 0) {
    laplacianSmooth(mcResult.positions, mcResult.indices, params.smoothingLevel);
  }

  // Step 4: Compute normals (after smoothing)
  const normals = computeNormals(mcResult.positions, mcResult.indices);

  // Step 5: Build colors (uniform color)
  const [cr, cg, cb] = parseHexColor(params.color);
  const nVertices = mcResult.positions.length / 3;
  const colors = new Float32Array(nVertices * 4);
  for (let i = 0; i < nVertices; i++) {
    colors[i * 4] = cr;
    colors[i * 4 + 1] = cg;
    colors[i * 4 + 2] = cb;
    colors[i * 4 + 3] = params.opacity;
  }

  // Step 6: Edge extraction (only if needed)
  let edgePositions: Float32Array | null = null;
  if (params.showEdges) {
    edgePositions = extractEdges(mcResult.positions, mcResult.indices);
  }

  const meshData: MeshData = {
    type: "mesh",
    positions: mcResult.positions,
    indices: mcResult.indices,
    normals,
    colors,
    opacity: params.opacity,
    showEdges: params.showEdges,
    edgePositions,
    edgeColor: params.edgeColor,
    edgeWidth: params.edgeWidth,
  };

  outputs.set("mesh", meshData);
  return outputs;
}
