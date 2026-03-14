import { describe, it, expect, vi } from "vitest";

// Mock the WASM-dependent parsers/structure module before importing bondSourceLogic
vi.mock("@/parsers/structure", () => ({
  inferBondsVdw: vi.fn().mockResolvedValue(new Uint32Array([0, 1])),
  parseTopBonds: vi.fn().mockResolvedValue(new Uint32Array([])),
  parsePdbBonds: vi.fn().mockResolvedValue(new Uint32Array([])),
}));

import { withBonds, computeBondsForSource } from "@/logic/bondSourceLogic";
import type { BondSourceRefs } from "@/logic/bondSourceLogic";
import type { Snapshot } from "@/types";

function makeSnapshot(): Snapshot {
  return {
    nAtoms: 3,
    nBonds: 1,
    nFileBonds: 1,
    positions: new Float32Array([0, 0, 0, 1, 0, 0, 2, 0, 0]),
    elements: new Uint8Array([6, 8, 1]),
    bonds: new Uint32Array([0, 1]),
    bondOrders: new Uint8Array([1]),
    box: null,
  };
}

function makeRefs(overrides: Partial<BondSourceRefs> = {}): BondSourceRefs {
  return {
    baseSnapshot: makeSnapshot(),
    fileBonds: null,
    vdwBonds: null,
    ...overrides,
  };
}

describe("withBonds", () => {
  it("replaces bonds in snapshot", () => {
    const base = makeSnapshot();
    const newBonds = new Uint32Array([0, 2, 1, 2]);
    const result = withBonds(base, newBonds, new Uint8Array([1, 2]));
    expect(result.nBonds).toBe(2);
    expect(result.bonds).toEqual(newBonds);
    expect(result.bondOrders).toEqual(new Uint8Array([1, 2]));
    expect(result.positions).toBe(base.positions);
  });

  it("handles null bondOrders", () => {
    const base = makeSnapshot();
    const result = withBonds(base, new Uint32Array([0, 1]), null);
    expect(result.bondOrders).toBeNull();
    expect(result.nBonds).toBe(1);
  });

  it("handles empty bonds", () => {
    const base = makeSnapshot();
    const result = withBonds(base, new Uint32Array(0), null);
    expect(result.nBonds).toBe(0);
  });
});

describe("computeBondsForSource", () => {
  it("returns null when no base snapshot", async () => {
    const refs = makeRefs({ baseSnapshot: null });
    const result = await computeBondsForSource("structure", refs);
    expect(result).toBeNull();
  });

  it('returns null for "none"', async () => {
    const result = await computeBondsForSource("none", makeRefs());
    expect(result).toBeNull();
  });

  it('returns base snapshot for "structure"', async () => {
    const refs = makeRefs();
    const result = await computeBondsForSource("structure", refs);
    expect(result).toBe(refs.baseSnapshot);
  });

  it('returns file bonds for "file" when available', async () => {
    const fileBonds = new Uint32Array([0, 2, 1, 2]);
    const refs = makeRefs({ fileBonds });
    const result = await computeBondsForSource("file", refs);
    expect(result).not.toBeNull();
    expect(result!.bonds).toBe(fileBonds);
    expect(result!.bondOrders).toBeNull();
  });

  it('returns empty bonds for "file" when no file bonds', async () => {
    const refs = makeRefs({ fileBonds: null });
    const result = await computeBondsForSource("file", refs);
    expect(result).not.toBeNull();
    expect(result!.nBonds).toBe(0);
  });

  it('uses cached vdwBonds for "distance" when available', async () => {
    const vdwBonds = new Uint32Array([0, 1, 1, 2]);
    const refs = makeRefs({ vdwBonds });
    const result = await computeBondsForSource("distance", refs);
    expect(result).not.toBeNull();
    expect(result!.bonds).toBe(vdwBonds);
  });
});
