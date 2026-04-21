import { describe, it, expect } from "vitest";
import { inferBondsVdwJS } from "@/parsers/inferBondsJS";

/** Generate random atoms in a cubic box. */
function generateAtoms(nAtoms: number, boxSize: number) {
  const positions = new Float32Array(nAtoms * 3);
  const elements = new Uint8Array(nAtoms);
  for (let i = 0; i < nAtoms; i++) {
    positions[i * 3] = Math.random() * boxSize;
    positions[i * 3 + 1] = Math.random() * boxSize;
    positions[i * 3 + 2] = Math.random() * boxSize;
    // Mix of C(6), N(7), O(8), H(1)
    elements[i] = [1, 6, 7, 8][i % 4];
  }
  return { positions, elements };
}

/** Run a function multiple times and return the median time in ms. */
function benchmark(fn: () => void, iterations: number = 5): number {
  const times: number[] = [];
  // Warmup
  fn();
  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    fn();
    times.push(performance.now() - start);
  }
  times.sort((a, b) => a - b);
  return times[Math.floor(times.length / 2)];
}

describe("performance: inferBondsVdwJS", () => {
  it("1,000 atoms completes under 200ms", () => {
    const { positions, elements } = generateAtoms(1_000, 20);
    const time = benchmark(() => inferBondsVdwJS(positions, elements, 1_000));
    console.log(`  inferBondsVdwJS 1k atoms: ${time.toFixed(1)}ms`);
    expect(time).toBeLessThan(200);
  });

  it("3,000 atoms with 44x44x44 PBC box stays within a 30fps frame budget", () => {
    // Matches the caffeine_water.pdb template (3024 atoms, 44A PBC box) that
    // the per-frame bond recalc runs for during trajectory playback.
    const { positions, elements } = generateAtoms(3_000, 44);
    const box = new Float32Array([44, 0, 0, 0, 44, 0, 0, 0, 44]);
    const time = benchmark(() => inferBondsVdwJS(positions, elements, 3_000, 0.6, box));
    console.log(`  inferBondsVdwJS 3k atoms (PBC 44A): ${time.toFixed(1)}ms`);
    expect(time).toBeLessThan(33);
  });

  it("10,000 atoms completes under 2000ms", () => {
    const { positions, elements } = generateAtoms(10_000, 40);
    const time = benchmark(() => inferBondsVdwJS(positions, elements, 10_000));
    console.log(`  inferBondsVdwJS 10k atoms: ${time.toFixed(1)}ms`);
    expect(time).toBeLessThan(2000);
  });

  it("100,000 atoms completes under 15000ms", () => {
    const { positions, elements } = generateAtoms(100_000, 100);
    const time = benchmark(() => inferBondsVdwJS(positions, elements, 100_000), 3);
    console.log(`  inferBondsVdwJS 100k atoms: ${time.toFixed(1)}ms`);
    expect(time).toBeLessThan(15000);
  });

  it("scales roughly linearly (cell-list O(N))", () => {
    const small = generateAtoms(5_000, 30);
    const large = generateAtoms(50_000, 70);

    const timeSmall = benchmark(() => inferBondsVdwJS(small.positions, small.elements, 5_000));
    const timeLarge = benchmark(() => inferBondsVdwJS(large.positions, large.elements, 50_000), 3);

    const ratio = timeLarge / timeSmall;
    console.log(`  Scaling: 5k=${timeSmall.toFixed(1)}ms, 50k=${timeLarge.toFixed(1)}ms, ratio=${ratio.toFixed(1)}x (expected ~10x)`);
    // With O(N) cell-list, ratio should be roughly 10x, allow up to 50x for CI overhead
    expect(ratio).toBeLessThan(50);
  });
});
