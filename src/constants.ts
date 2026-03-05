/**
 * CPK color scheme and van der Waals radii for common elements.
 * Indexed by atomic number.
 */

// Molstar element-symbol color scheme as [r, g, b] in 0-1 range
export const ELEMENT_COLORS: Record<number, [number, number, number]> = {
  1: [1.0, 1.0, 1.0], // H  - white
  2: [0.851, 1.0, 1.0], // He - light cyan
  5: [1.0, 0.710, 0.710], // B  - pink
  6: [0.565, 0.565, 0.565], // C  - gray
  7: [0.188, 0.314, 0.973], // N  - blue
  8: [1.0, 0.051, 0.051], // O  - red
  9: [0.565, 0.878, 0.314], // F  - green
  11: [0.671, 0.361, 0.949], // Na - purple
  12: [0.541, 1.0, 0.0], // Mg - green
  13: [0.749, 0.651, 0.651], // Al - gray-pink
  14: [0.941, 0.784, 0.627], // Si - tan
  15: [1.0, 0.502, 0.0], // P  - orange
  16: [1.0, 1.0, 0.188], // S  - yellow
  17: [0.122, 0.941, 0.122], // Cl - green
  18: [0.502, 0.820, 0.890], // Ar - light blue
  19: [0.561, 0.251, 0.831], // K  - purple
  20: [0.239, 1.0, 0.0], // Ca - green
  26: [0.878, 0.400, 0.200], // Fe - orange
  29: [0.784, 0.502, 0.200], // Cu - copper
  30: [0.490, 0.502, 0.690], // Zn - slate
  34: [1.0, 0.631, 0.0], // Se - orange
  35: [0.651, 0.161, 0.161], // Br - dark red
  53: [0.580, 0.0, 0.580], // I  - purple
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

/** Bond order constants (matches Python encoding). */
export const BOND_SINGLE = 1;
export const BOND_DOUBLE = 2;
export const BOND_TRIPLE = 3;
export const BOND_AROMATIC = 4;

/** Bond order rendering parameters. */
export const DOUBLE_BOND_OFFSET = 0.18;
export const DOUBLE_BOND_RADIUS = 0.10;
export const TRIPLE_BOND_OFFSET = 0.20;
export const TRIPLE_BOND_RADIUS = 0.08;
export const AROMATIC_BOND_RADIUS = 0.10;
export const AROMATIC_DASH_RADIUS = 0.06;

// Element symbols indexed by atomic number
export const ELEMENT_SYMBOLS: Record<number, string> = {
  1: "H", 6: "C", 7: "N", 8: "O", 9: "F",
  11: "Na", 12: "Mg", 15: "P", 16: "S", 17: "Cl",
  19: "K", 20: "Ca", 26: "Fe", 29: "Cu", 30: "Zn",
};

// Bond order display names
export const BOND_ORDER_NAMES: Record<number, string> = {
  1: "Single", 2: "Double", 3: "Triple", 4: "Aromatic",
};

export function getColor(atomicNum: number): [number, number, number] {
  return ELEMENT_COLORS[atomicNum] ?? DEFAULT_COLOR;
}

export function getRadius(atomicNum: number): number {
  return VDW_RADII[atomicNum] ?? DEFAULT_RADIUS;
}

export function getElementSymbol(atomicNum: number): string {
  return ELEMENT_SYMBOLS[atomicNum] ?? `#${atomicNum}`;
}
