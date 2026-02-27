/**
 * CPK color scheme and van der Waals radii for common elements.
 * Indexed by atomic number.
 */

// CPK colors as [r, g, b] in 0-1 range
export const ELEMENT_COLORS: Record<number, [number, number, number]> = {
  1: [1.0, 1.0, 1.0], // H  - white
  6: [0.33, 0.33, 0.33], // C  - dark gray
  7: [0.2, 0.3, 0.9], // N  - blue
  8: [0.9, 0.15, 0.15], // O  - red
  9: [0.56, 0.88, 0.31], // F  - green
  11: [0.67, 0.36, 0.95], // Na - purple
  12: [0.54, 1.0, 0.0], // Mg - green
  15: [1.0, 0.5, 0.0], // P  - orange
  16: [1.0, 0.78, 0.17], // S  - yellow
  17: [0.12, 0.94, 0.12], // Cl - green
  19: [0.56, 0.25, 0.83], // K  - purple
  20: [0.24, 1.0, 0.0], // Ca - green
  26: [0.88, 0.4, 0.2], // Fe - orange
  29: [0.78, 0.5, 0.2], // Cu - copper
  30: [0.49, 0.5, 0.69], // Zn - slate
};

// Default color for unknown elements
export const DEFAULT_COLOR: [number, number, number] = [0.75, 0.4, 0.75];

// Van der Waals radii in Angstroms
export const VDW_RADII: Record<number, number> = {
  1: 1.2,
  6: 1.7,
  7: 1.55,
  8: 1.52,
  9: 1.47,
  11: 2.27,
  12: 1.73,
  15: 1.8,
  16: 1.8,
  17: 1.75,
  19: 2.75,
  20: 2.31,
  26: 2.04,
  29: 1.4,
  30: 1.39,
};

export const DEFAULT_RADIUS = 1.5;

/** Ball-and-stick atom radius scale factor (fraction of vdW radius). */
export const BALL_STICK_ATOM_SCALE = 0.3;

/** Ball-and-stick bond radius in Angstroms. */
export const BOND_RADIUS = 0.15;

export function getColor(atomicNum: number): [number, number, number] {
  return ELEMENT_COLORS[atomicNum] ?? DEFAULT_COLOR;
}

export function getRadius(atomicNum: number): number {
  return VDW_RADII[atomicNum] ?? DEFAULT_RADIUS;
}
