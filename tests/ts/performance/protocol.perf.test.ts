import { describe, it, expect } from "vitest";
import {
  decodeSnapshot,
  decodeFrame,
  MSG_SNAPSHOT,
  MSG_FRAME,
} from "@/protocol/protocol";

const MAGIC = 0x4e47454d;

function buildSnapshotBuffer(nAtoms: number, nBonds: number): ArrayBuffer {
  const elemPadding = (4 - ((8 + 4 + 4 + nAtoms * 12 + nAtoms) % 4)) % 4;
  const size = 8 + 4 + 4 + nAtoms * 12 + nAtoms + elemPadding + nBonds * 8;
  const buf = new ArrayBuffer(size);
  const view = new DataView(buf);
  let offset = 0;

  // Header
  view.setUint32(offset, MAGIC, true); offset += 4;
  view.setUint8(offset, MSG_SNAPSHOT); offset += 1;
  view.setUint8(offset, 0); offset += 1;
  offset += 2; // reserved

  view.setUint32(offset, nAtoms, true); offset += 4;
  view.setUint32(offset, nBonds, true); offset += 4;

  // Random positions
  for (let i = 0; i < nAtoms * 3; i++) {
    view.setFloat32(offset, Math.random() * 100, true); offset += 4;
  }

  // Elements
  for (let i = 0; i < nAtoms; i++) {
    view.setUint8(offset, [1, 6, 7, 8][i % 4]); offset += 1;
  }
  offset += elemPadding;

  // Bonds
  for (let i = 0; i < nBonds; i++) {
    view.setUint32(offset, i % nAtoms, true); offset += 4;
    view.setUint32(offset, (i + 1) % nAtoms, true); offset += 4;
  }

  return buf;
}

function buildFrameBuffer(nAtoms: number, frameId: number): ArrayBuffer {
  const size = 8 + 4 + 4 + nAtoms * 12;
  const buf = new ArrayBuffer(size);
  const view = new DataView(buf);
  let offset = 0;

  view.setUint32(offset, MAGIC, true); offset += 4;
  view.setUint8(offset, MSG_FRAME); offset += 1;
  view.setUint8(offset, 0); offset += 1;
  offset += 2;

  view.setUint32(offset, frameId, true); offset += 4;
  view.setUint32(offset, nAtoms, true); offset += 4;

  for (let i = 0; i < nAtoms * 3; i++) {
    view.setFloat32(offset, Math.random() * 100, true); offset += 4;
  }

  return buf;
}

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

describe("performance: protocol decoding", () => {
  it("decodeSnapshot with 100,000 atoms under 200ms", () => {
    const buf = buildSnapshotBuffer(100_000, 50_000);
    const time = benchmark(() => {
      decodeSnapshot(buf);
    });
    console.log(`  decodeSnapshot 100k atoms: ${time.toFixed(1)}ms`);
    expect(time).toBeLessThan(200);
  });

  it("decode 1,000 frames (1000 atoms each) under 500ms", () => {
    const frames = Array.from({ length: 1_000 }, (_, i) =>
      buildFrameBuffer(1_000, i),
    );
    const time = benchmark(() => {
      for (const buf of frames) {
        decodeFrame(buf);
      }
    });
    console.log(`  decodeFrame 1000x1k atoms: ${time.toFixed(1)}ms`);
    expect(time).toBeLessThan(500);
  });

  it("decodeSnapshot with 10,000 atoms and bonds under 50ms", () => {
    const buf = buildSnapshotBuffer(10_000, 15_000);
    const time = benchmark(() => {
      decodeSnapshot(buf);
    });
    console.log(`  decodeSnapshot 10k atoms+bonds: ${time.toFixed(1)}ms`);
    expect(time).toBeLessThan(50);
  });
});
