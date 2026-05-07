import { describe, it, expect } from "vitest";
import { parseCube, BOHR_TO_ANGSTROM } from "@/pipeline/executors/parseCube";

/** Minimal valid CUBE file with a 2×2×2 grid and one atom. */
function makeCube(
  nx = 2,
  ny = 2,
  nz = 2,
  nAtoms = 1,
  dataValues?: number[],
): string {
  const lines: string[] = [
    "Comment line 1",
    "Comment line 2",
    // natoms origin (all in Bohr)
    `${nAtoms}  0.000000  0.000000  0.000000`,
    // Grid axes (1 Bohr step each)
    `${nx}  1.000000  0.000000  0.000000`,
    `${ny}  0.000000  1.000000  0.000000`,
    `${nz}  0.000000  0.000000  1.000000`,
  ];
  // Atom lines: Z=6 (carbon), charge=0, pos=(1,1,1) Bohr
  for (let a = 0; a < nAtoms; a++) {
    lines.push(`6  0.000000  1.000000  1.000000  1.000000`);
  }
  // Data values
  const total = nx * ny * nz;
  const vals = dataValues ?? Array.from({ length: total }, (_, i) => i * 0.1);
  // 6 per line as in the real format
  for (let i = 0; i < total; i += 6) {
    lines.push(vals.slice(i, i + 6).join("  "));
  }
  return lines.join("\n") + "\n";
}

describe("parseCube", () => {
  it("parses a minimal 2×2×2 CUBE file", () => {
    const result = parseCube(makeCube());
    expect(result.type).toBe("volumetric");
    expect(result.nx).toBe(2);
    expect(result.ny).toBe(2);
    expect(result.nz).toBe(2);
    expect(result.data.length).toBe(8);
  });

  it("converts origin from Bohr to Angstroms", () => {
    const result = parseCube(makeCube());
    // Origin is 0,0,0 in this fixture.
    expect(result.origin[0]).toBeCloseTo(0);
    expect(result.origin[1]).toBeCloseTo(0);
    expect(result.origin[2]).toBeCloseTo(0);
  });

  it("converts step vectors from Bohr to Angstroms", () => {
    const result = parseCube(makeCube());
    // stepX = (1 Bohr, 0, 0)
    expect(result.step[0]).toBeCloseTo(BOHR_TO_ANGSTROM);
    expect(result.step[1]).toBeCloseTo(0);
    expect(result.step[2]).toBeCloseTo(0);
    // stepY = (0, 1 Bohr, 0)
    expect(result.step[3]).toBeCloseTo(0);
    expect(result.step[4]).toBeCloseTo(BOHR_TO_ANGSTROM);
    // stepZ = (0, 0, 1 Bohr)
    expect(result.step[8]).toBeCloseTo(BOHR_TO_ANGSTROM);
  });

  it("parses atom positions from Bohr to Angstroms", () => {
    const result = parseCube(makeCube(2, 2, 2, 1));
    expect(result.nAtoms).toBe(1);
    expect(result.elements[0]).toBe(6);
    // position is (1, 1, 1) Bohr → × BOHR_TO_ANGSTROM
    expect(result.positions[0]).toBeCloseTo(BOHR_TO_ANGSTROM);
    expect(result.positions[1]).toBeCloseTo(BOHR_TO_ANGSTROM);
    expect(result.positions[2]).toBeCloseTo(BOHR_TO_ANGSTROM);
  });

  it("reads volumetric data values correctly", () => {
    const vals = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8];
    const result = parseCube(makeCube(2, 2, 2, 1, vals));
    for (let i = 0; i < 8; i++) {
      expect(result.data[i]).toBeCloseTo(vals[i]);
    }
  });

  it("computes dataMin and dataMax", () => {
    const vals = [0.1, -0.5, 0.3, 0.8, -1.0, 0.2, 0.6, 0.4];
    const result = parseCube(makeCube(2, 2, 2, 1, vals));
    expect(result.dataMin).toBeCloseTo(-1.0);
    expect(result.dataMax).toBeCloseTo(0.8);
  });

  it("handles multiple atoms", () => {
    const result = parseCube(makeCube(2, 2, 2, 3));
    expect(result.nAtoms).toBe(3);
    expect(result.elements.length).toBe(3);
    expect(result.positions.length).toBe(9);
  });

  it("handles a negative atom count (MO cube files)", () => {
    // Negative natoms = MO data; abs value is the atom count.
    const lines = [
      "Comment 1",
      "Comment 2",
      "-1  0.0  0.0  0.0",
      "2  1.0  0.0  0.0",
      "2  0.0  1.0  0.0",
      "2  0.0  0.0  1.0",
      "6  0.0  1.0  1.0  1.0",
      "0.1  0.2  0.3  0.4  0.5  0.6  0.7  0.8",
    ];
    const result = parseCube(lines.join("\n"));
    expect(result.nAtoms).toBe(1);
    expect(result.nx).toBe(2);
  });

  it("throws on insufficient data values", () => {
    const lines = [
      "C1",
      "C2",
      "1  0  0  0",
      "3  1  0  0",
      "3  0  1  0",
      "3  0  0  1",
      "6  0  1  1  1",
      "0.1  0.2",  // only 2 values, need 27
    ];
    expect(() => parseCube(lines.join("\n"))).toThrow(/expected 27/i);
  });

  it("throws on malformed atom count", () => {
    const lines = ["C1", "C2", "X  0  0  0", "2  1  0  0", "2  0  1  0", "2  0  0  1"];
    expect(() => parseCube(lines.join("\n"))).toThrow();
  });

  it("throws on malformed grid axis", () => {
    const lines = ["C1", "C2", "1  0  0  0", "0  1  0  0", "2  0  1  0", "2  0  0  1", "6  0  1  1  1"];
    expect(() => parseCube(lines.join("\n"))).toThrow();
  });

  it("throws on unexpected end of file", () => {
    expect(() => parseCube("")).toThrow(/unexpected end/i);
  });

  it("handles a 3×3×3 grid correctly", () => {
    const result = parseCube(makeCube(3, 3, 3));
    expect(result.nx).toBe(3);
    expect(result.ny).toBe(3);
    expect(result.nz).toBe(3);
    expect(result.data.length).toBe(27);
  });
});
