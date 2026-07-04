import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import type { StructureParseResult } from "@/parsers/structure";

const parseMock = vi.hoisted(() => vi.fn());

vi.mock("@/parsers/structure", () => ({
  parseStructureFile: parseMock,
  parseStructureText: vi.fn(),
  // Lazy structure streaming is disabled here so loadFile takes the eager path.
  shouldUseLazyStructure: () => false,
  indexStructureLazy: vi.fn(async () => null),
}));

import { useMeganeLocal } from "@/hooks/useMeganeLocal";

function makeResult(overrides: Partial<StructureParseResult> = {}): StructureParseResult {
  return {
    snapshot: {
      nAtoms: 3,
      positions: new Float32Array([0, 0, 0, 1, 0, 0, 0, 1, 0]),
      elements: new Uint8Array([6, 1, 1]),
      bonds: new Uint32Array(0),
      box: null,
    },
    frames: [],
    meta: null,
    labels: null,
    vectorChannels: [],
    ...overrides,
  } as unknown as StructureParseResult;
}

describe("useMeganeLocal.applyStructureResult", () => {
  beforeEach(() => {
    parseMock.mockReset();
  });

  it("applies an already-parsed result WITHOUT re-parsing the file", async () => {
    const { result } = renderHook(() => useMeganeLocal());
    const res = makeResult();

    await act(async () => {
      await result.current.applyStructureResult(res, "test.pdb");
    });

    // The key guarantee: no second file read / WASM parse.
    expect(parseMock).not.toHaveBeenCalled();
    expect(result.current.snapshot).toBe(res.snapshot);
    expect(result.current.pdbFileName).toBe("test.pdb");
  });

  it("loadFile parses exactly once and then applies the result", async () => {
    const res = makeResult();
    parseMock.mockResolvedValue(res);
    const { result } = renderHook(() => useMeganeLocal());

    await act(async () => {
      await result.current.loadFile(new File(["dummy"], "mol.pdb"));
    });

    expect(parseMock).toHaveBeenCalledTimes(1);
    expect(result.current.snapshot).toBe(res.snapshot);
    expect(result.current.pdbFileName).toBe("mol.pdb");
  });
});
