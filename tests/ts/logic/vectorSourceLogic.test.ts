import { describe, it, expect } from "vitest";
import {
  getVectorsForFrame,
  generateDemoVectors,
} from "@/logic/vectorSourceLogic";
import type { VectorSourceRefs } from "@/logic/vectorSourceLogic";

describe("getVectorsForFrame", () => {
  it("returns null when fileVectors is null", () => {
    const refs: VectorSourceRefs = { fileVectors: null };
    expect(getVectorsForFrame(refs, 0)).toBeNull();
  });

  it("returns null when fileVectors is empty", () => {
    const refs: VectorSourceRefs = { fileVectors: [] };
    expect(getVectorsForFrame(refs, 0)).toBeNull();
  });

  it("returns single frame for any frame index", () => {
    const vectors = new Float32Array([1, 2, 3, 4, 5, 6]);
    const refs: VectorSourceRefs = {
      fileVectors: [{ frame: 0, vectors }],
    };
    expect(getVectorsForFrame(refs, 0)).toBe(vectors);
    expect(getVectorsForFrame(refs, 5)).toBe(vectors);
    expect(getVectorsForFrame(refs, 99)).toBe(vectors);
  });

  it("returns correct frame from multi-frame data", () => {
    const v0 = new Float32Array([1, 0, 0]);
    const v1 = new Float32Array([0, 1, 0]);
    const v2 = new Float32Array([0, 0, 1]);
    const refs: VectorSourceRefs = {
      fileVectors: [
        { frame: 0, vectors: v0 },
        { frame: 1, vectors: v1 },
        { frame: 2, vectors: v2 },
      ],
    };
    expect(getVectorsForFrame(refs, 0)).toBe(v0);
    expect(getVectorsForFrame(refs, 1)).toBe(v1);
    expect(getVectorsForFrame(refs, 2)).toBe(v2);
  });

  it("returns null for missing frame index", () => {
    const refs: VectorSourceRefs = {
      fileVectors: [
        { frame: 0, vectors: new Float32Array([1, 0, 0]) },
        { frame: 2, vectors: new Float32Array([0, 1, 0]) },
      ],
    };
    expect(getVectorsForFrame(refs, 1)).toBeNull();
    expect(getVectorsForFrame(refs, 5)).toBeNull();
  });
});

describe("generateDemoVectors", () => {
  it("returns correct number of frames", () => {
    const result = generateDemoVectors(10, 5);
    expect(result.length).toBe(5);
  });

  it("returns correct vector size per frame", () => {
    const nAtoms = 20;
    const result = generateDemoVectors(nAtoms, 3);
    for (const frame of result) {
      expect(frame.vectors.length).toBe(nAtoms * 3);
    }
  });

  it("has sequential frame indices", () => {
    const result = generateDemoVectors(5, 4);
    expect(result.map((f) => f.frame)).toEqual([0, 1, 2, 3]);
  });

  it("produces deterministic output", () => {
    const a = generateDemoVectors(10, 3);
    const b = generateDemoVectors(10, 3);
    for (let f = 0; f < 3; f++) {
      for (let i = 0; i < 30; i++) {
        expect(a[f].vectors[i]).toBe(b[f].vectors[i]);
      }
    }
  });

  it("handles single atom", () => {
    const result = generateDemoVectors(1, 2);
    expect(result.length).toBe(2);
    expect(result[0].vectors.length).toBe(3);
  });

  it("handles zero frames", () => {
    const result = generateDemoVectors(5, 0);
    expect(result.length).toBe(0);
  });
});
