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

/** Snapshot with bonds forming many small "water-like" 3-atom molecules. */
function generateSnapshotWithBonds(nAtoms: number): Snapshot {
  const snapshot = generateSnapshot(nAtoms);
  const bondPairs: number[] = [];
  for (let i = 0; i + 2 < nAtoms; i += 3) {
    bondPairs.push(i, i + 1, i, i + 2);
  }
  return { ...snapshot, bonds: new Uint32Array(bondPairs), nBonds: bondPairs.length / 2 };
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

  it("simple element query on 100k atoms completes under 500ms", () => {
    const time = benchmark(() => {
      evaluateSelection('element == "C"', snapshot, null);
    });
    console.log(`  selection simple query 100k: ${time.toFixed(1)}ms`);
    expect(time).toBeLessThan(500);
  });

  it("compound query on 100k atoms completes under 1500ms", () => {
    const time = benchmark(() => {
      evaluateSelection(
        '(element == "C" or element == "N") and x > 50 and not index < 1000',
        snapshot,
        null,
      );
    });
    console.log(`  selection compound query 100k: ${time.toFixed(1)}ms`);
    expect(time).toBeLessThan(1500);
  });

  it("index range query on 100k atoms completes under 500ms", () => {
    const time = benchmark(() => {
      evaluateSelection("index >= 10000 and index < 50000", snapshot, null);
    });
    console.log(`  selection index range 100k: ${time.toFixed(1)}ms`);
    expect(time).toBeLessThan(500);
  });
});

describe("performance: molecule_id", () => {
  it("molecule_id query on 100k atoms with a fresh bonds array completes under 1000ms", () => {
    // A new Uint32Array each call defeats memoization, exercising the cold
    // connected-component computation (union-find over 100k atoms).
    const time = benchmark(() => {
      const snapshot = generateSnapshotWithBonds(100_000);
      evaluateSelection("molecule_id == 0", snapshot, null);
    });
    console.log(`  molecule_id cold (100k): ${time.toFixed(1)}ms`);
    expect(time).toBeLessThan(1000);
  });

  it("molecule_id query on 100k atoms with a shared bonds array (repeated frames) completes under 50ms", () => {
    const snapshot = generateSnapshotWithBonds(100_000);
    evaluateSelection("molecule_id == 0", snapshot, null); // warm the cache
    const time = benchmark(() => {
      evaluateSelection("molecule_id == 0", snapshot, null);
    });
    console.log(`  molecule_id memoized (100k): ${time.toFixed(1)}ms`);
    expect(time).toBeLessThan(50);
  });
});
