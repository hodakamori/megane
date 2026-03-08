import { describe, it, expect } from "vitest";
import { evaluateSelection } from "@/pipeline/selection";
import type { Snapshot } from "@/types";

function generateSnapshot(nAtoms: number): Snapshot {
  const positions = new Float32Array(nAtoms * 3);
  const elements = new Uint8Array(nAtoms);
  for (let i = 0; i < nAtoms; i++) {
    positions[i * 3] = Math.random() * 100;
    positions[i * 3 + 1] = Math.random() * 100;
    positions[i * 3 + 2] = Math.random() * 100;
    elements[i] = [1, 6, 7, 8][i % 4];
  }
  return {
    nAtoms,
    nBonds: 0,
    nFileBonds: 0,
    positions,
    elements,
    bonds: new Uint32Array(0),
    bondOrders: null,
    box: null,
  };
}

function benchmark(fn: () => void, iterations: number = 5): number {
  const times: number[] = [];
  fn(); // warmup
  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    fn();
    times.push(performance.now() - start);
  }
  times.sort((a, b) => a - b);
  return times[Math.floor(times.length / 2)];
}

describe("performance: evaluateSelection", () => {
  const snapshot = generateSnapshot(100_000);

  it("simple element query on 100k atoms completes under 200ms", () => {
    const time = benchmark(() => {
      evaluateSelection('element == "C"', snapshot, null);
    });
    console.log(`  selection simple query 100k: ${time.toFixed(1)}ms`);
    expect(time).toBeLessThan(200);
  });

  it("compound query on 100k atoms completes under 500ms", () => {
    const time = benchmark(() => {
      evaluateSelection(
        '(element == "C" or element == "N") and x > 50 and not index < 1000',
        snapshot,
        null,
      );
    });
    console.log(`  selection compound query 100k: ${time.toFixed(1)}ms`);
    expect(time).toBeLessThan(500);
  });

  it("index range query on 100k atoms completes under 200ms", () => {
    const time = benchmark(() => {
      evaluateSelection("index >= 10000 and index < 50000", snapshot, null);
    });
    console.log(`  selection index range 100k: ${time.toFixed(1)}ms`);
    expect(time).toBeLessThan(200);
  });
});
