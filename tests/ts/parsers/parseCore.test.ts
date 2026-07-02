/**
 * Unit tests for the pure result-extraction logic in parseCore.
 *
 * These feed a hand-built mock WASM result object (no real WASM, no Worker) to
 * `parseWithFn` / `extractFrames` and assert the Snapshot / Frame[] / meta /
 * vectorChannels shapes. This locks the "results unchanged" invariant that the
 * worker and synchronous paths both depend on, and covers the frame striding,
 * has_box / has_bfactors gating, CA arrays, and free() call.
 */

import { describe, it, expect, vi } from "vitest";
import {
  parseWithFn,
  extractFrames,
  collectResultBuffers,
  type StructureParseResult,
  type XTCParseResult,
} from "@/parsers/parseCore";

interface MockStructureOpts {
  nAtoms: number;
  nFrames?: number;
  hasBox?: boolean;
  hasBfactors?: boolean;
  hasChainIds?: boolean;
  caCount?: number;
  labels?: string | null;
}

function makeStructureResult(opts: MockStructureOpts) {
  const { nAtoms, nFrames = 0, hasBox = false, hasBfactors = false, hasChainIds = false } = opts;
  const caCount = opts.caCount ?? 0;
  const positions = Float32Array.from({ length: nAtoms * 3 }, (_, i) => i);
  const frameData = Float32Array.from({ length: nFrames * nAtoms * 3 }, (_, i) => 1000 + i);
  const free = vi.fn();
  return {
    result: {
      n_atoms: nAtoms,
      n_bonds: 1,
      n_file_bonds: 0,
      n_frames: nFrames,
      has_box: hasBox,
      has_atom_labels: opts.labels != null,
      has_chain_ids: hasChainIds,
      has_bfactors: hasBfactors,
      atom_labels: opts.labels ?? "",
      vector_channel_count: 0,
      vector_channel_meta: "[]",
      ca_count: caCount,
      symmetry_op_count: 0,
      symmetry_ops: "",
      positions: () => positions,
      elements: () => Uint8Array.from({ length: nAtoms }, () => 6),
      bonds: () => Uint32Array.from([0, 1]),
      bond_orders: () => Uint8Array.from([1]),
      box_matrix: () => Float32Array.from({ length: 9 }, (_, i) => i),
      frame_data: () => frameData,
      chain_ids: () => Uint8Array.from({ length: nAtoms }, () => 65),
      bfactors: () => Float32Array.from({ length: nAtoms }, () => 1.5),
      vector_channel_data: () => new Float32Array(),
      ca_indices: () => Uint32Array.from({ length: caCount }, (_, i) => i),
      ca_chain_ids: () => Uint8Array.from({ length: caCount }, () => 65),
      ca_res_nums: () => Uint32Array.from({ length: caCount }, (_, i) => i + 1),
      ca_ss_type: () => Uint8Array.from({ length: caCount }, () => 1),
      free,
    },
    free,
  };
}

describe("parseWithFn", () => {
  it("builds a Snapshot and calls free()", () => {
    const { result, free } = makeStructureResult({ nAtoms: 2 });
    const out: StructureParseResult = parseWithFn(() => result as never, "");
    expect(out.snapshot.nAtoms).toBe(2);
    expect(out.snapshot.positions).toEqual(Float32Array.from([0, 1, 2, 3, 4, 5]));
    expect(out.snapshot.box).toBeNull();
    expect(out.snapshot.atomBFactors).toBeNull();
    expect(out.snapshot.atomChainIds).toBeNull();
    expect(out.frames).toHaveLength(0);
    expect(out.meta).toBeNull();
    expect(free).toHaveBeenCalledOnce();
  });

  it("exposes optional box / bfactors / chainIds / CA arrays when present", () => {
    const { result } = makeStructureResult({
      nAtoms: 2,
      hasBox: true,
      hasBfactors: true,
      hasChainIds: true,
      caCount: 1,
    });
    const out = parseWithFn(() => result as never, "");
    expect(out.snapshot.box).toEqual(Float32Array.from([0, 1, 2, 3, 4, 5, 6, 7, 8]));
    expect(out.snapshot.atomBFactors).toEqual(Float32Array.from([1.5, 1.5]));
    expect(out.snapshot.atomChainIds).toEqual(Uint8Array.from([65, 65]));
    expect(out.snapshot.caIndices).toEqual(Uint32Array.from([0]));
    expect(out.snapshot.caSsType).toEqual(Uint8Array.from([1]));
  });

  it("slices extra frames from one shared backing buffer (frame striding)", () => {
    const { result } = makeStructureResult({ nAtoms: 2, nFrames: 2 });
    const out = parseWithFn(() => result as never, "");
    expect(out.frames).toHaveLength(2);
    // frame N is a view starting at 1000 + N*6
    expect(out.frames[0].frameId).toBe(1);
    expect(Array.from(out.frames[0].positions)).toEqual([1000, 1001, 1002, 1003, 1004, 1005]);
    expect(Array.from(out.frames[1].positions)).toEqual([1006, 1007, 1008, 1009, 1010, 1011]);
    // Both frames share the single frame_data buffer.
    expect(out.frames[0].positions.buffer).toBe(out.frames[1].positions.buffer);
    expect(out.meta).toEqual({ nFrames: 3, timestepPs: 1.0, nAtoms: 2 });
  });

  it("splits atom labels when present", () => {
    const { result } = makeStructureResult({ nAtoms: 2, labels: "A\nB" });
    const out = parseWithFn(() => result as never, "");
    expect(out.labels).toEqual(["A", "B"]);
  });
});

function makeXtcResult(nAtoms: number, nFrames: number) {
  const frameData = Float32Array.from({ length: nFrames * nAtoms * 3 }, (_, i) => i);
  const free = vi.fn();
  return {
    result: {
      n_atoms: nAtoms,
      n_frames: nFrames,
      timestep_ps: 2.0,
      has_box: false,
      vector_channel_count: 0,
      vector_channel_meta: "[]",
      box_matrix: () => new Float32Array(9),
      frame_data: () => frameData,
      vector_channel_data: () => new Float32Array(),
      free,
    },
    free,
  };
}

describe("extractFrames", () => {
  it("returns all frames as views with correct meta", () => {
    const { result, free } = makeXtcResult(2, 3);
    const out: XTCParseResult = extractFrames(result as never, 2, "XTC");
    expect(out.frames).toHaveLength(3);
    expect(out.frames[0].frameId).toBe(0);
    expect(Array.from(out.frames[2].positions)).toEqual([12, 13, 14, 15, 16, 17]);
    expect(out.meta).toEqual({ nFrames: 3, timestepPs: 2.0, nAtoms: 2 });
    expect(free).toHaveBeenCalledOnce();
  });

  it("throws and frees on atom-count mismatch", () => {
    const { result, free } = makeXtcResult(2, 1);
    expect(() => extractFrames(result as never, 5, "XTC")).toThrow(/atom count/);
    expect(free).toHaveBeenCalledOnce();
  });
});

describe("collectResultBuffers", () => {
  it("deduplicates the shared frame buffer for a structure result", () => {
    const { result } = makeStructureResult({ nAtoms: 2, nFrames: 3, hasBox: true });
    const out = parseWithFn(() => result as never, "");
    const buffers = collectResultBuffers(out);
    // positions, elements, bonds, bondOrders, box, and ONE shared frame buffer.
    const frameBuffer = out.frames[0].positions.buffer;
    expect(buffers.filter((b) => b === frameBuffer)).toHaveLength(1);
    // No duplicates overall.
    expect(new Set(buffers).size).toBe(buffers.length);
  });

  it("collects the shared trajectory buffer once", () => {
    const { result } = makeXtcResult(2, 4);
    const out = extractFrames(result as never, 2, "XTC");
    const buffers = collectResultBuffers(out);
    expect(buffers).toHaveLength(1);
    expect(buffers[0]).toBe(out.frames[0].positions.buffer);
  });
});
