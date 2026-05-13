import { describe, it, expect } from "vitest";
import {
  getColor,
  getRadius,
  getElementSymbol,
  getCovalentRadius,
  isMetalLike,
  isDefaultLigand,
  ELEMENT_COLORS,
  ELEMENT_SYMBOLS,
  VDW_RADII,
  COVALENT_RADII,
  DEFAULT_COLOR,
  DEFAULT_RADIUS,
  DEFAULT_COVALENT_RADIUS,
} from "@/constants";

describe("getColor", () => {
  it("returns correct color for carbon (6)", () => {
    const color = getColor(6);
    expect(color).toEqual(ELEMENT_COLORS[6]);
    expect(color).toEqual([0.565, 0.565, 0.565]);
  });

  it("returns correct color for oxygen (8)", () => {
    const color = getColor(8);
    expect(color).toEqual(ELEMENT_COLORS[8]);
    expect(color).toEqual([1.0, 0.051, 0.051]);
  });

  it("returns correct color for nitrogen (7)", () => {
    const color = getColor(7);
    expect(color).toEqual(ELEMENT_COLORS[7]);
  });

  it("returns default color for unknown element", () => {
    const color = getColor(999);
    expect(color).toEqual(DEFAULT_COLOR);
  });

  it("has entries for all natural elements Z=1-92", () => {
    for (let z = 1; z <= 92; z++) {
      expect(ELEMENT_COLORS[z]).toBeDefined();
      expect(ELEMENT_COLORS[z]).toHaveLength(3);
    }
  });

  it("Ti(22) and Sr(38) have distinct colors", () => {
    const ti = getColor(22);
    const sr = getColor(38);
    const dist = Math.sqrt(
      (ti[0] - sr[0]) ** 2 + (ti[1] - sr[1]) ** 2 + (ti[2] - sr[2]) ** 2,
    );
    expect(dist).toBeGreaterThan(0.1);
  });
});

describe("getRadius", () => {
  it("returns correct radius for hydrogen (1)", () => {
    expect(getRadius(1)).toBe(1.2);
  });

  it("returns correct radius for carbon (6)", () => {
    expect(getRadius(6)).toBe(1.7);
  });

  it("returns correct radius for oxygen (8)", () => {
    expect(getRadius(8)).toBe(1.52);
  });

  it("returns default radius for unknown element", () => {
    expect(getRadius(999)).toBe(DEFAULT_RADIUS);
  });
});

describe("getElementSymbol", () => {
  it("returns H for hydrogen (1)", () => {
    expect(getElementSymbol(1)).toBe("H");
  });

  it("returns C for carbon (6)", () => {
    expect(getElementSymbol(6)).toBe("C");
  });

  it("returns Na for sodium (11)", () => {
    expect(getElementSymbol(11)).toBe("Na");
  });

  it("returns #N fallback for unknown element", () => {
    expect(getElementSymbol(200)).toBe("#200");
  });

  it("has entries for all natural elements Z=1-92", () => {
    for (let z = 1; z <= 92; z++) {
      expect(ELEMENT_SYMBOLS[z]).toBeDefined();
      expect(typeof ELEMENT_SYMBOLS[z]).toBe("string");
    }
  });

  it("returns correct symbols for newly added elements", () => {
    expect(getElementSymbol(22)).toBe("Ti");
    expect(getElementSymbol(38)).toBe("Sr");
    expect(getElementSymbol(79)).toBe("Au");
    expect(getElementSymbol(92)).toBe("U");
  });
});

describe("getCovalentRadius", () => {
  it("returns Cordero values for representative elements", () => {
    expect(getCovalentRadius(1)).toBeCloseTo(0.31, 2); // H
    expect(getCovalentRadius(6)).toBeCloseTo(0.76, 2); // C
    expect(getCovalentRadius(8)).toBeCloseTo(0.66, 2); // O
    expect(getCovalentRadius(22)).toBeCloseTo(1.6, 2); // Ti
  });

  it("falls back to DEFAULT_COVALENT_RADIUS for unknown elements", () => {
    expect(getCovalentRadius(200)).toBe(DEFAULT_COVALENT_RADIUS);
  });

  it("has entries up to Cm (Z=96)", () => {
    expect(COVALENT_RADII[96]).toBeDefined();
  });
});

describe("isMetalLike", () => {
  it("returns true for typical center elements", () => {
    expect(isMetalLike(13)).toBe(true); // Al
    expect(isMetalLike(22)).toBe(true); // Ti
    expect(isMetalLike(26)).toBe(true); // Fe
    expect(isMetalLike(40)).toBe(true); // Zr
  });

  it("classifies metalloids B, Si, Ge, As, Sb, Te as centers (VESTA convention)", () => {
    expect(isMetalLike(5)).toBe(true); // B
    expect(isMetalLike(14)).toBe(true); // Si
    expect(isMetalLike(32)).toBe(true); // Ge
    expect(isMetalLike(33)).toBe(true); // As
    expect(isMetalLike(51)).toBe(true); // Sb
    expect(isMetalLike(52)).toBe(true); // Te
  });

  it("returns false for non-metals and noble gases", () => {
    expect(isMetalLike(1)).toBe(false); // H
    expect(isMetalLike(6)).toBe(false); // C
    expect(isMetalLike(7)).toBe(false); // N
    expect(isMetalLike(8)).toBe(false); // O
    expect(isMetalLike(17)).toBe(false); // Cl
    expect(isMetalLike(18)).toBe(false); // Ar
  });
});

describe("isDefaultLigand", () => {
  it("returns true for the canonical anion-formers", () => {
    expect(isDefaultLigand(7)).toBe(true); // N
    expect(isDefaultLigand(8)).toBe(true); // O
    expect(isDefaultLigand(9)).toBe(true); // F
    expect(isDefaultLigand(15)).toBe(true); // P
    expect(isDefaultLigand(16)).toBe(true); // S
    expect(isDefaultLigand(17)).toBe(true); // Cl
    expect(isDefaultLigand(35)).toBe(true); // Br
    expect(isDefaultLigand(53)).toBe(true); // I
  });

  it("excludes carbon by default to avoid spurious organic polyhedra", () => {
    expect(isDefaultLigand(6)).toBe(false);
  });

  it("excludes H, noble gases, and metals", () => {
    expect(isDefaultLigand(1)).toBe(false); // H
    expect(isDefaultLigand(2)).toBe(false); // He
    expect(isDefaultLigand(18)).toBe(false); // Ar
    expect(isDefaultLigand(22)).toBe(false); // Ti
  });
});
