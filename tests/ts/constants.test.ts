import { describe, it, expect } from "vitest";
import {
  getColor,
  getRadius,
  getElementSymbol,
  ELEMENT_COLORS,
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
    expect(getElementSymbol(99)).toBe("#99");
    expect(getElementSymbol(200)).toBe("#200");
  });
});
