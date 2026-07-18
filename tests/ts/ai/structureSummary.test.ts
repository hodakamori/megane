import { describe, it, expect } from "vitest";
import { summarizeStructure, getStructureFacts } from "@/ai/structureSummary";
import type { Snapshot } from "@/types";

/** Build a minimal Snapshot for testing. Carbon=6, Hydrogen=1, Oxygen=8. */
function makeSnapshot(elements: number[], opts: Partial<Snapshot> = {}): Snapshot {
  const nAtoms = elements.length;
  return {
    nAtoms,
    nBonds: 0,
    nFileBonds: 0,
    positions: new Float32Array(nAtoms * 3),
    elements: new Uint8Array(elements),
    bonds: new Uint32Array(0),
    bondOrders: null,
    box: null,
    atomChainIds: null,
    atomBFactors: null,
    ...opts,
  };
}

describe("summarizeStructure", () => {
  it("returns null when no structure is loaded", () => {
    expect(summarizeStructure(null, null)).toBeNull();
  });

  it("returns null for an empty structure", () => {
    expect(summarizeStructure(makeSnapshot([]), null)).toBeNull();
  });

  it("reports atom count and index range", () => {
    const summary = summarizeStructure(makeSnapshot([6, 6, 1]), null);
    expect(summary).toContain("Atoms: 3 (index 0..2)");
  });

  it("lists elements with counts, sorted by descending count", () => {
    const summary = summarizeStructure(makeSnapshot([6, 6, 6, 1, 1, 8]), null);
    // C(3) should come before H(2) before O(1).
    expect(summary).toContain("Elements present: C (3), H (2), O (1)");
  });

  it("lists unique residue names from atom labels", () => {
    const snap = makeSnapshot([6, 6, 8, 8]);
    const labels = ["ALA1", "ALA1", "HOH2", "HOH3"];
    const summary = summarizeStructure(snap, labels);
    expect(summary).toContain("Residue names present: ALA, HOH");
  });

  it("caps the residue name list and notes how many were omitted", () => {
    const n = 60;
    const elements = new Array(n).fill(6);
    // parseResname keeps only the leading letters, so give each atom a unique
    // two-letter prefix ("AA1", "AB1", …) to produce 60 distinct resnames.
    const labels = Array.from({ length: n }, (_, i) => {
      const a = String.fromCharCode(65 + Math.floor(i / 26));
      const b = String.fromCharCode(65 + (i % 26));
      return `${a}${b}1`;
    });
    const summary = summarizeStructure(makeSnapshot(elements), labels);
    expect(summary).toContain("more)");
    expect(summary).toContain("(10 more)"); // 60 resnames, capped at 50
  });

  it("omits the residue line when no labels are provided", () => {
    const summary = summarizeStructure(makeSnapshot([6, 1]), null);
    expect(summary).not.toContain("Residue names");
  });

  it("lists chain IDs when present", () => {
    const snap = makeSnapshot([6, 6, 6], {
      atomChainIds: new Uint8Array([65, 65, 66]), // 'A', 'A', 'B'
    });
    const summary = summarizeStructure(snap, null);
    expect(summary).toContain("Chains present: A, B");
  });

  it("reports unit cell and bond presence", () => {
    const withCell = makeSnapshot([6], { box: new Float32Array(9), nBonds: 2 });
    const summary = summarizeStructure(withCell, null);
    expect(summary).toContain("Unit cell: yes");
    expect(summary).toContain("Bonds: 2");

    const withoutCell = summarizeStructure(makeSnapshot([6]), null);
    expect(withoutCell).toContain("Unit cell: no");
  });
});

describe("getStructureFacts", () => {
  it("returns null for no / empty structure", () => {
    expect(getStructureFacts(null, null)).toBeNull();
    expect(getStructureFacts(makeSnapshot([]), null)).toBeNull();
  });

  it("returns elements with counts, sorted descending", () => {
    const facts = getStructureFacts(makeSnapshot([6, 6, 6, 1, 1, 8]), null)!;
    expect(facts.nAtoms).toBe(6);
    expect(facts.elements).toEqual([
      { symbol: "C", count: 3 },
      { symbol: "H", count: 2 },
      { symbol: "O", count: 1 },
    ]);
  });

  it("returns unique sorted resnames from labels", () => {
    const facts = getStructureFacts(makeSnapshot([6, 6, 8, 8]), ["HOH2", "ALA1", "ALA1", "HOH3"])!;
    expect(facts.resnames).toEqual(["ALA", "HOH"]);
  });

  it("returns empty resnames when labels are absent", () => {
    const facts = getStructureFacts(makeSnapshot([6, 1]), null)!;
    expect(facts.resnames).toEqual([]);
  });

  it("returns unique sorted chains, ignoring code 0", () => {
    const snap = makeSnapshot([6, 6, 6, 6], {
      atomChainIds: new Uint8Array([66, 65, 65, 0]), // 'B','A','A', none
    });
    const facts = getStructureFacts(snap, null)!;
    expect(facts.chains).toEqual(["A", "B"]);
  });

  it("reports cell and bond presence", () => {
    const facts = getStructureFacts(
      makeSnapshot([6], { box: new Float32Array(9), nBonds: 3 }),
      null,
    )!;
    expect(facts.hasCell).toBe(true);
    expect(facts.nBonds).toBe(3);
  });
});
