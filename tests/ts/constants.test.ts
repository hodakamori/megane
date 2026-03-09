import { describe, it, expect } from "vitest";
import {
  getColor,
  getRadius,
  getElementSymbol,
  ELEMENT_COLORS,
  ELEMENT_SYMBOLS,
  VDW_RADII,
  DEFAULT_COLOR,
  DEFAULT_RADIUS,
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
