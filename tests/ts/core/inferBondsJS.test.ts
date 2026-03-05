import { describe, it, expect } from "vitest";
import { inferBondsVdwJS } from "@/core/inferBondsJS";

describe("inferBondsVdwJS", () => {
  it("returns empty array for 0 atoms", () => {
    const result = inferBondsVdwJS(new Float32Array(0), new Uint8Array(0), 0);
    expect(result.length).toBe(0);
  });

  it("returns empty array for 1 atom", () => {
    const positions = new Float32Array([0, 0, 0]);
    const elements = new Uint8Array([6]); // carbon
    const result = inferBondsVdwJS(positions, elements, 1);
    expect(result.length).toBe(0);
  });

  it("finds O-H bonds in a water molecule", () => {
    // Water: O at origin, H1 at ~0.96 Å, H2 at ~0.96 Å
    const angle = (104.5 / 2) * (Math.PI / 180);
    const oh = 0.96;
    const positions = new Float32Array([
      0, 0, 0,                                        // O
      oh * Math.sin(angle), oh * Math.cos(angle), 0,  // H1
      -oh * Math.sin(angle), oh * Math.cos(angle), 0, // H2
    ]);
    const elements = new Uint8Array([8, 1, 1]); // O, H, H

    const bonds = inferBondsVdwJS(positions, elements, 3);

    // Should find at least 2 bonds (O-H1, O-H2)
    expect(bonds.length).toBeGreaterThanOrEqual(4); // 2 bonds × 2 indices each

    // Verify bond pairs exist (order: smaller index first)
    const bondPairs: [number, number][] = [];
    for (let i = 0; i < bonds.length; i += 2) {
      bondPairs.push([bonds[i], bonds[i + 1]]);
    }

    expect(bondPairs).toContainEqual([0, 1]); // O-H1
    expect(bondPairs).toContainEqual([0, 2]); // O-H2
  });

  it("does not bond atoms that are too far apart", () => {
    // Two carbons 10 Å apart — well beyond VDW threshold
    const positions = new Float32Array([
      0, 0, 0,
      10, 0, 0,
    ]);
    const elements = new Uint8Array([6, 6]);

    const bonds = inferBondsVdwJS(positions, elements, 2);
    expect(bonds.length).toBe(0);
  });

  it("does not bond atoms closer than MIN_BOND_DIST", () => {
    // Two atoms at 0.3 Å — below MIN_BOND_DIST (0.4)
    const positions = new Float32Array([
      0, 0, 0,
      0.3, 0, 0,
    ]);
    const elements = new Uint8Array([6, 6]);

    const bonds = inferBondsVdwJS(positions, elements, 2);
    expect(bonds.length).toBe(0);
  });

  it("handles multiple water molecules", () => {
    // 3 water molecules well separated
    const spacing = 5.0;
    const angle = (104.5 / 2) * (Math.PI / 180);
    const oh = 0.96;

    const positions = new Float32Array([
      // Molecule 1
      0, 0, 0,
      oh * Math.sin(angle), oh * Math.cos(angle), 0,
      -oh * Math.sin(angle), oh * Math.cos(angle), 0,
      // Molecule 2
      spacing, 0, 0,
      spacing + oh * Math.sin(angle), oh * Math.cos(angle), 0,
      spacing - oh * Math.sin(angle), oh * Math.cos(angle), 0,
      // Molecule 3
      0, spacing, 0,
      oh * Math.sin(angle), spacing + oh * Math.cos(angle), 0,
      -oh * Math.sin(angle), spacing + oh * Math.cos(angle), 0,
    ]);
    const elements = new Uint8Array([8, 1, 1, 8, 1, 1, 8, 1, 1]);

    const bonds = inferBondsVdwJS(positions, elements, 9);

    // Each water should have 2 O-H bonds = 6 total
    expect(bonds.length / 2).toBe(6);
  });

  it("bonds carbon atoms at covalent-like distance", () => {
    // Two carbons at 1.5 Å — within VDW threshold (1.7+1.7)*0.6 = 2.04
    const positions = new Float32Array([
      0, 0, 0,
      1.5, 0, 0,
    ]);
    const elements = new Uint8Array([6, 6]);

    const bonds = inferBondsVdwJS(positions, elements, 2);
    expect(bonds.length).toBe(2); // 1 bond pair
    expect(bonds[0]).toBe(0);
    expect(bonds[1]).toBe(1);
  });
});
