import { describe, it, expect } from "vitest";
import { computeConvexHull } from "@/logic/convexHull";

describe("computeConvexHull", () => {
  it("returns null for fewer than 4 points", () => {
    const pts = new Float32Array([0, 0, 0, 1, 0, 0, 0, 1, 0]);
    expect(computeConvexHull(pts, 3)).toBeNull();
  });

  it("returns null for collinear points", () => {
    const pts = new Float32Array([
      0, 0, 0,
      1, 0, 0,
      2, 0, 0,
      3, 0, 0,
    ]);
    expect(computeConvexHull(pts, 4)).toBeNull();
  });

  it("returns null for coplanar points", () => {
    const pts = new Float32Array([
      0, 0, 0,
      1, 0, 0,
      0, 1, 0,
      1, 1, 0,
    ]);
    expect(computeConvexHull(pts, 4)).toBeNull();
  });

  it("computes hull for a regular tetrahedron", () => {
    // Regular tetrahedron vertices
    const pts = new Float32Array([
      1, 1, 1,
      1, -1, -1,
      -1, 1, -1,
      -1, -1, 1,
    ]);

    const hull = computeConvexHull(pts, 4);
    expect(hull).not.toBeNull();
    expect(hull!.indices.length).toBe(12); // 4 faces * 3 indices
    expect(hull!.vertices.length).toBe(12); // 4 vertices * 3 coords
  });

  it("computes hull for a cube (8 vertices)", () => {
    const pts = new Float32Array([
      0, 0, 0,
      1, 0, 0,
      1, 1, 0,
      0, 1, 0,
      0, 0, 1,
      1, 0, 1,
      1, 1, 1,
      0, 1, 1,
    ]);

    const hull = computeConvexHull(pts, 8);
    expect(hull).not.toBeNull();
    // Cube has 6 faces, each triangulated = 12 triangles
    expect(hull!.indices.length).toBe(36); // 12 triangles * 3 indices
  });

  it("computes hull for an octahedron (6 vertices)", () => {
    const pts = new Float32Array([
      1, 0, 0,
      -1, 0, 0,
      0, 1, 0,
      0, -1, 0,
      0, 0, 1,
      0, 0, -1,
    ]);

    const hull = computeConvexHull(pts, 6);
    expect(hull).not.toBeNull();
    // Octahedron has 8 triangular faces
    expect(hull!.indices.length).toBe(24); // 8 faces * 3 indices
  });

  it("produces unit-length normals", () => {
    const pts = new Float32Array([
      1, 1, 1,
      1, -1, -1,
      -1, 1, -1,
      -1, -1, 1,
    ]);

    const hull = computeConvexHull(pts, 4)!;
    for (let i = 0; i < 4; i++) {
      const nx = hull.normals[i * 3];
      const ny = hull.normals[i * 3 + 1];
      const nz = hull.normals[i * 3 + 2];
      const len = Math.sqrt(nx * nx + ny * ny + nz * nz);
      expect(len).toBeCloseTo(1.0, 5);
    }
  });

  it("produces outward-facing normals", () => {
    // Tetrahedron centered near origin
    const pts = new Float32Array([
      1, 1, 1,
      1, -1, -1,
      -1, 1, -1,
      -1, -1, 1,
    ]);

    const hull = computeConvexHull(pts, 4)!;
    const centroid = [0, 0, 0];
    for (let i = 0; i < 4; i++) {
      centroid[0] += pts[i * 3] / 4;
      centroid[1] += pts[i * 3 + 1] / 4;
      centroid[2] += pts[i * 3 + 2] / 4;
    }

    // For each face, the normal should point away from the centroid
    const nFaces = hull.indices.length / 3;
    for (let f = 0; f < nFaces; f++) {
      const ia = hull.indices[f * 3];
      // Face midpoint
      const mx = (pts[hull.indices[f * 3] * 3] + pts[hull.indices[f * 3 + 1] * 3] + pts[hull.indices[f * 3 + 2] * 3]) / 3;
      const my = (pts[hull.indices[f * 3] * 3 + 1] + pts[hull.indices[f * 3 + 1] * 3 + 1] + pts[hull.indices[f * 3 + 2] * 3 + 1]) / 3;
      const mz = (pts[hull.indices[f * 3] * 3 + 2] + pts[hull.indices[f * 3 + 1] * 3 + 2] + pts[hull.indices[f * 3 + 2] * 3 + 2]) / 3;

      // Average normal at face vertices
      const nx = (hull.normals[hull.indices[f * 3] * 3] + hull.normals[hull.indices[f * 3 + 1] * 3] + hull.normals[hull.indices[f * 3 + 2] * 3]) / 3;
      const ny = (hull.normals[hull.indices[f * 3] * 3 + 1] + hull.normals[hull.indices[f * 3 + 1] * 3 + 1] + hull.normals[hull.indices[f * 3 + 2] * 3 + 1]) / 3;
      const nz = (hull.normals[hull.indices[f * 3] * 3 + 2] + hull.normals[hull.indices[f * 3 + 1] * 3 + 2] + hull.normals[hull.indices[f * 3 + 2] * 3 + 2]) / 3;

      // Direction from centroid to face midpoint
      const dx = mx - centroid[0];
      const dy = my - centroid[1];
      const dz = mz - centroid[2];

      // Dot product should be positive (normal points outward)
      const dot = nx * dx + ny * dy + nz * dz;
      expect(dot).toBeGreaterThan(0);
    }
  });

  it("produces unique edges for wireframe", () => {
    const pts = new Float32Array([
      1, 1, 1,
      1, -1, -1,
      -1, 1, -1,
      -1, -1, 1,
    ]);

    const hull = computeConvexHull(pts, 4)!;
    // Tetrahedron has 6 edges, each edge = 2 endpoints * 3 coords = 6 floats
    expect(hull.edges.length).toBe(36); // 6 edges * 2 verts * 3 coords
  });

  it("handles point inside existing hull (ignored)", () => {
    // Tetrahedron + a point inside it (at origin)
    const pts = new Float32Array([
      2, 2, 2,
      2, -2, -2,
      -2, 2, -2,
      -2, -2, 2,
      0, 0, 0, // interior point
    ]);

    const hull = computeConvexHull(pts, 5)!;
    // Should still be a tetrahedron (4 faces)
    expect(hull.indices.length).toBe(12);
  });
});
