import { describe, it, expect } from "vitest";
import { computeConvexHull } from "@/logic/convexHull";

function benchmark(fn: () => void, iterations: number = 5): number {
  const times: number[] = [];
  fn();
  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    fn();
    times.push(performance.now() - start);
  }
  times.sort((a, b) => a - b);
  return times[Math.floor(times.length / 2)];
}

describe("performance: computeConvexHull", () => {
  it("12-point hull (typical coordination polyhedron) under 5ms", () => {
    // Icosahedron-like 12 vertices
    const pts = new Float32Array(12 * 3);
    const phi = (1 + Math.sqrt(5)) / 2;
    const verts = [
      [-1, phi, 0], [1, phi, 0], [-1, -phi, 0], [1, -phi, 0],
      [0, -1, phi], [0, 1, phi], [0, -1, -phi], [0, 1, -phi],
      [phi, 0, -1], [phi, 0, 1], [-phi, 0, -1], [-phi, 0, 1],
    ];
    for (let i = 0; i < 12; i++) {
      pts[i * 3] = verts[i][0];
      pts[i * 3 + 1] = verts[i][1];
      pts[i * 3 + 2] = verts[i][2];
    }

    const time = benchmark(() => {
      computeConvexHull(pts, 12);
    }, 100);
    console.log(`  convexHull 12 points: ${time.toFixed(3)}ms`);
    expect(time).toBeLessThan(5);
  });

  it("1000 iterations of 6-point hull under 200ms total", () => {
    // Octahedron vertices
    const pts = new Float32Array([
      1, 0, 0, -1, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, 1, 0, 0, -1,
    ]);

    const start = performance.now();
    for (let i = 0; i < 1000; i++) {
      computeConvexHull(pts, 6);
    }
    const elapsed = performance.now() - start;
    console.log(`  convexHull 1000x octahedron: ${elapsed.toFixed(1)}ms`);
    expect(elapsed).toBeLessThan(200);
  });

  it("8-point cube hull is consistently fast", () => {
    const pts = new Float32Array([
      0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0,
      0, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1,
    ]);

    const time = benchmark(() => {
      computeConvexHull(pts, 8);
    }, 100);
    console.log(`  convexHull 8-point cube: ${time.toFixed(3)}ms`);
    expect(time).toBeLessThan(5);
  });
});
