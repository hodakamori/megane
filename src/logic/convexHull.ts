/**
 * 3D Convex Hull computation for small point sets (4-12 vertices).
 * Used for coordination polyhedra in crystal structure visualization.
 *
 * Implements an incremental convex hull algorithm:
 * 1. Build initial tetrahedron from 4 non-coplanar points
 * 2. For each remaining point, find visible faces, remove them,
 *    and stitch the point to the boundary edges.
 */

export interface ConvexHullResult {
  /** Flat xyz vertex positions (same as input). */
  vertices: Float32Array;
  /** Triangle indices into vertices (3 per face). */
  indices: Uint32Array;
  /** Per-vertex normals (flat, same length as vertices). */
  normals: Float32Array;
  /** Edge line segment pairs for wireframe (flat xyz, 2 vertices per edge). */
  edges: Float32Array;
}

interface HullFace {
  a: number;
  b: number;
  c: number;
  nx: number;
  ny: number;
  nz: number;
  d: number; // plane offset: nx*x + ny*y + nz*z + d = 0
}

function cross(
  ax: number,
  ay: number,
  az: number,
  bx: number,
  by: number,
  bz: number,
): [number, number, number] {
  return [ay * bz - az * by, az * bx - ax * bz, ax * by - ay * bx];
}

function dot3(ax: number, ay: number, az: number, bx: number, by: number, bz: number): number {
  return ax * bx + ay * by + az * bz;
}

function makeFace(
  a: number,
  b: number,
  c: number,
  pts: Float32Array,
  centroid: [number, number, number],
): HullFace {
  const ax = pts[a * 3],
    ay = pts[a * 3 + 1],
    az = pts[a * 3 + 2];
  const bx = pts[b * 3],
    by = pts[b * 3 + 1],
    bz = pts[b * 3 + 2];
  const cx = pts[c * 3],
    cy = pts[c * 3 + 1],
    cz = pts[c * 3 + 2];

  const abx = bx - ax,
    aby = by - ay,
    abz = bz - az;
  const acx = cx - ax,
    acy = cy - ay,
    acz = cz - az;
  let [nx, ny, nz] = cross(abx, aby, abz, acx, acy, acz);

  const len = Math.sqrt(nx * nx + ny * ny + nz * nz);
  if (len < 1e-12) {
    return { a, b, c, nx: 0, ny: 0, nz: 0, d: 0 };
  }
  nx /= len;
  ny /= len;
  nz /= len;

  const d = -(nx * ax + ny * ay + nz * az);

  // Ensure normal points outward (away from centroid)
  const distCentroid = nx * centroid[0] + ny * centroid[1] + nz * centroid[2] + d;
  if (distCentroid > 0) {
    nx = -nx;
    ny = -ny;
    nz = -nz;
    return { a, b: c, c: b, nx, ny, nz, d: -d };
  }

  return { a, b, c, nx, ny, nz, d };
}

function signedDistance(face: HullFace, px: number, py: number, pz: number): number {
  return face.nx * px + face.ny * py + face.nz * pz + face.d;
}

/**
 * Find 4 non-coplanar points to form the initial tetrahedron.
 * Returns indices or null if all points are coplanar.
 */
function findInitialTetrahedron(
  pts: Float32Array,
  n: number,
): [number, number, number, number] | null {
  if (n < 4) return null;

  // Find two most distant points along any axis
  let i0 = 0,
    i1 = 1;
  let maxDist = -1;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const dx = pts[j * 3] - pts[i * 3];
      const dy = pts[j * 3 + 1] - pts[i * 3 + 1];
      const dz = pts[j * 3 + 2] - pts[i * 3 + 2];
      const d = dx * dx + dy * dy + dz * dz;
      if (d > maxDist) {
        maxDist = d;
        i0 = i;
        i1 = j;
      }
    }
  }

  if (maxDist < 1e-20) return null;

  // Find the point most distant from line (i0, i1)
  const ex = pts[i1 * 3] - pts[i0 * 3];
  const ey = pts[i1 * 3 + 1] - pts[i0 * 3 + 1];
  const ez = pts[i1 * 3 + 2] - pts[i0 * 3 + 2];
  const eLen = Math.sqrt(ex * ex + ey * ey + ez * ez);
  const ux = ex / eLen,
    uy = ey / eLen,
    uz = ez / eLen;

  let i2 = -1;
  let maxLineDist = -1;
  for (let i = 0; i < n; i++) {
    if (i === i0 || i === i1) continue;
    const dx = pts[i * 3] - pts[i0 * 3];
    const dy = pts[i * 3 + 1] - pts[i0 * 3 + 1];
    const dz = pts[i * 3 + 2] - pts[i0 * 3 + 2];
    const proj = dx * ux + dy * uy + dz * uz;
    const perpX = dx - proj * ux;
    const perpY = dy - proj * uy;
    const perpZ = dz - proj * uz;
    const d = perpX * perpX + perpY * perpY + perpZ * perpZ;
    if (d > maxLineDist) {
      maxLineDist = d;
      i2 = i;
    }
  }

  if (i2 < 0 || maxLineDist < 1e-20) return null;

  // Find the point most distant from the plane (i0, i1, i2)
  const abx = pts[i1 * 3] - pts[i0 * 3];
  const aby = pts[i1 * 3 + 1] - pts[i0 * 3 + 1];
  const abz = pts[i1 * 3 + 2] - pts[i0 * 3 + 2];
  const acx = pts[i2 * 3] - pts[i0 * 3];
  const acy = pts[i2 * 3 + 1] - pts[i0 * 3 + 1];
  const acz = pts[i2 * 3 + 2] - pts[i0 * 3 + 2];
  let [nx, ny, nz] = cross(abx, aby, abz, acx, acy, acz);
  const nLen = Math.sqrt(nx * nx + ny * ny + nz * nz);
  if (nLen < 1e-12) return null;
  nx /= nLen;
  ny /= nLen;
  nz /= nLen;
  const planeD = -(nx * pts[i0 * 3] + ny * pts[i0 * 3 + 1] + nz * pts[i0 * 3 + 2]);

  let i3 = -1;
  let maxPlaneDist = -1;
  for (let i = 0; i < n; i++) {
    if (i === i0 || i === i1 || i === i2) continue;
    const d = Math.abs(nx * pts[i * 3] + ny * pts[i * 3 + 1] + nz * pts[i * 3 + 2] + planeD);
    if (d > maxPlaneDist) {
      maxPlaneDist = d;
      i3 = i;
    }
  }

  if (i3 < 0 || maxPlaneDist < 1e-10) return null;

  return [i0, i1, i2, i3];
}

/**
 * Compute the 3D convex hull of a set of points.
 * Designed for small point sets (4-12 vertices) typical of coordination polyhedra.
 *
 * @param points Flat xyz array of point coordinates
 * @param nPoints Number of points
 * @returns ConvexHullResult or null if degenerate (fewer than 4 non-coplanar points)
 */
export function computeConvexHull(points: Float32Array, nPoints: number): ConvexHullResult | null {
  if (nPoints < 4) return null;

  const tet = findInitialTetrahedron(points, nPoints);
  if (!tet) return null;

  const [i0, i1, i2, i3] = tet;

  // Centroid of initial tetrahedron
  const centroid: [number, number, number] = [
    (points[i0 * 3] + points[i1 * 3] + points[i2 * 3] + points[i3 * 3]) / 4,
    (points[i0 * 3 + 1] + points[i1 * 3 + 1] + points[i2 * 3 + 1] + points[i3 * 3 + 1]) / 4,
    (points[i0 * 3 + 2] + points[i1 * 3 + 2] + points[i2 * 3 + 2] + points[i3 * 3 + 2]) / 4,
  ];

  // Build initial 4 faces of tetrahedron
  const faces: HullFace[] = [
    makeFace(i0, i1, i2, points, centroid),
    makeFace(i0, i1, i3, points, centroid),
    makeFace(i0, i2, i3, points, centroid),
    makeFace(i1, i2, i3, points, centroid),
  ];

  const usedInTet = new Set([i0, i1, i2, i3]);

  // Incrementally add remaining points
  for (let p = 0; p < nPoints; p++) {
    if (usedInTet.has(p)) continue;

    const px = points[p * 3];
    const py = points[p * 3 + 1];
    const pz = points[p * 3 + 2];

    // Find visible faces
    const visible: number[] = [];
    for (let f = 0; f < faces.length; f++) {
      if (signedDistance(faces[f], px, py, pz) > 1e-10) {
        visible.push(f);
      }
    }

    if (visible.length === 0) continue; // Point inside hull

    // Find boundary edges of the visible region
    const boundaryEdges: [number, number][] = [];
    const visibleSet = new Set(visible);

    for (const fi of visible) {
      const face = faces[fi];
      const faceEdges: [number, number][] = [
        [face.a, face.b],
        [face.b, face.c],
        [face.c, face.a],
      ];

      for (const [ea, eb] of faceEdges) {
        // Check if the neighboring face (sharing this edge reversed) is NOT visible
        let shared = false;
        for (let fj = 0; fj < faces.length; fj++) {
          if (fj === fi || visibleSet.has(fj)) continue;
          const other = faces[fj];
          // Check if other face contains edge (eb, ea) — reversed
          if (
            (other.a === eb && other.b === ea) ||
            (other.b === eb && other.c === ea) ||
            (other.c === eb && other.a === ea)
          ) {
            shared = true;
            break;
          }
        }
        if (shared) {
          boundaryEdges.push([ea, eb]);
        }
      }
    }

    // Remove visible faces (in reverse order to preserve indices)
    const sortedVisible = [...visible].sort((a, b) => b - a);
    for (const fi of sortedVisible) {
      faces.splice(fi, 1);
    }

    // Create new faces connecting the point to boundary edges
    for (const [ea, eb] of boundaryEdges) {
      faces.push(makeFace(ea, eb, p, points, centroid));
    }
  }

  // Build output buffers
  const nFaces = faces.length;
  const indices = new Uint32Array(nFaces * 3);
  const normals = new Float32Array(nPoints * 3);
  const normalCounts = new Float32Array(nPoints);

  // Accumulate per-vertex normals from face normals
  for (let f = 0; f < nFaces; f++) {
    const face = faces[f];
    indices[f * 3] = face.a;
    indices[f * 3 + 1] = face.b;
    indices[f * 3 + 2] = face.c;

    for (const vi of [face.a, face.b, face.c]) {
      normals[vi * 3] += face.nx;
      normals[vi * 3 + 1] += face.ny;
      normals[vi * 3 + 2] += face.nz;
      normalCounts[vi]++;
    }
  }

  // Normalize per-vertex normals
  for (let i = 0; i < nPoints; i++) {
    if (normalCounts[i] > 0) {
      const len = Math.sqrt(
        normals[i * 3] ** 2 + normals[i * 3 + 1] ** 2 + normals[i * 3 + 2] ** 2,
      );
      if (len > 1e-12) {
        normals[i * 3] /= len;
        normals[i * 3 + 1] /= len;
        normals[i * 3 + 2] /= len;
      }
    }
  }

  // Extract unique edges for wireframe
  const edgeSet = new Set<string>();
  const edgePairs: number[] = [];
  for (let f = 0; f < nFaces; f++) {
    const face = faces[f];
    const faceEdges: [number, number][] = [
      [face.a, face.b],
      [face.b, face.c],
      [face.c, face.a],
    ];
    for (const [ea, eb] of faceEdges) {
      const key = ea < eb ? `${ea}-${eb}` : `${eb}-${ea}`;
      if (!edgeSet.has(key)) {
        edgeSet.add(key);
        edgePairs.push(ea, eb);
      }
    }
  }

  // Build edge positions (flat xyz for each endpoint)
  const edgePositions = new Float32Array(edgePairs.length * 3);
  for (let i = 0; i < edgePairs.length; i++) {
    const vi = edgePairs[i];
    edgePositions[i * 3] = points[vi * 3];
    edgePositions[i * 3 + 1] = points[vi * 3 + 1];
    edgePositions[i * 3 + 2] = points[vi * 3 + 2];
  }

  return {
    vertices: new Float32Array(points.buffer, points.byteOffset, nPoints * 3),
    indices,
    normals,
    edges: edgePositions,
  };
}
