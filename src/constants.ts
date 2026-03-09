/**
 * Hybrid CPK/VESTA color scheme and van der Waals radii for elements Z=1-92.
 * Major elements use Molstar/CPK colors; others use VESTA defaults.
 * Indexed by atomic number.
 */

// Element colors as [r, g, b] in 0-1 range.
// Major elements: Molstar/CPK scheme. Others: VESTA defaults.
export const ELEMENT_COLORS: Record<number, [number, number, number]> = {
  1: [1.0, 1.0, 1.0], // H  - white (CPK)
  2: [0.851, 1.0, 1.0], // He - light cyan (CPK)
  3: [0.527, 0.880, 0.457], // Li (VESTA)
  4: [0.371, 0.846, 0.483], // Be (VESTA)
  5: [1.0, 0.710, 0.710], // B  - pink (CPK)
  6: [0.565, 0.565, 0.565], // C  - gray (CPK)
  7: [0.188, 0.314, 0.973], // N  - blue (CPK)
  8: [1.0, 0.051, 0.051], // O  - red (CPK)
  9: [0.565, 0.878, 0.314], // F  - green (CPK)
  10: [1.0, 0.218, 0.710], // Ne (VESTA)
  11: [0.671, 0.361, 0.949], // Na - purple (CPK)
  12: [0.541, 1.0, 0.0], // Mg - green (CPK)
  13: [0.749, 0.651, 0.651], // Al - gray-pink (CPK)
  14: [0.941, 0.784, 0.627], // Si - tan (CPK)
  15: [1.0, 0.502, 0.0], // P  - orange (CPK)
  16: [1.0, 1.0, 0.188], // S  - yellow (CPK)
  17: [0.122, 0.941, 0.122], // Cl - green (CPK)
  18: [0.502, 0.820, 0.890], // Ar - light blue (CPK)
  19: [0.561, 0.251, 0.831], // K  - purple (CPK)
  20: [0.239, 1.0, 0.0], // Ca - green (CPK)
  21: [0.712, 0.389, 0.673], // Sc (VESTA)
  22: [0.472, 0.794, 1.0], // Ti (VESTA)
  23: [0.900, 0.100, 0.000], // V  (VESTA)
  24: [0.000, 0.000, 0.620], // Cr (VESTA)
  25: [0.661, 0.034, 0.620], // Mn (VESTA)
  26: [0.878, 0.400, 0.200], // Fe - orange (CPK)
  27: [0.000, 0.000, 0.687], // Co (VESTA)
  28: [0.720, 0.736, 0.743], // Ni (VESTA)
  29: [0.784, 0.502, 0.200], // Cu - copper (CPK)
  30: [0.490, 0.502, 0.690], // Zn - slate (CPK)
  31: [0.623, 0.893, 0.455], // Ga (VESTA)
  32: [0.496, 0.435, 0.652], // Ge (VESTA)
  33: [0.458, 0.817, 0.342], // As (VESTA)
  34: [1.0, 0.631, 0.0], // Se - orange (CPK)
  35: [0.651, 0.161, 0.161], // Br - dark red (CPK)
  36: [0.981, 0.758, 0.954], // Kr (VESTA)
  37: [1.000, 0.000, 0.600], // Rb (VESTA)
  38: [0.000, 1.000, 0.153], // Sr (VESTA)
  39: [0.403, 0.597, 0.558], // Y  (VESTA)
  40: [0.000, 1.000, 0.000], // Zr (VESTA)
  41: [0.300, 0.700, 0.465], // Nb (VESTA)
  42: [0.706, 0.526, 0.689], // Mo (VESTA)
  43: [0.806, 0.687, 0.795], // Tc (VESTA)
  44: [0.812, 0.721, 0.681], // Ru (VESTA)
  45: [0.807, 0.822, 0.671], // Rh (VESTA)
  46: [0.760, 0.768, 0.725], // Pd (VESTA)
  47: [0.753, 0.753, 0.753], // Ag - silver
  48: [0.951, 0.121, 0.864], // Cd (VESTA)
  49: [0.844, 0.504, 0.735], // In (VESTA)
  50: [0.608, 0.561, 0.729], // Sn (VESTA)
  51: [0.846, 0.515, 0.313], // Sb (VESTA)
  52: [0.680, 0.636, 0.320], // Te (VESTA)
  53: [0.580, 0.0, 0.580], // I  - purple (CPK)
  54: [0.607, 0.632, 0.973], // Xe (VESTA)
  55: [0.059, 0.999, 0.726], // Cs (VESTA)
  56: [0.118, 0.940, 0.176], // Ba (VESTA)
  57: [0.353, 0.771, 0.287], // La (VESTA)
  58: [0.821, 0.991, 0.024], // Ce (VESTA)
  59: [0.991, 0.886, 0.023], // Pr (VESTA)
  60: [0.987, 0.556, 0.027], // Nd (VESTA)
  61: [0.000, 0.000, 0.960], // Pm (VESTA)
  62: [0.990, 0.024, 0.492], // Sm (VESTA)
  63: [0.984, 0.031, 0.836], // Eu (VESTA)
  64: [0.753, 0.014, 1.000], // Gd (VESTA)
  65: [0.443, 0.017, 0.998], // Tb (VESTA)
  66: [0.194, 0.024, 0.991], // Dy (VESTA)
  67: [0.028, 0.259, 0.986], // Ho (VESTA)
  68: [0.287, 0.451, 0.230], // Er (VESTA)
  69: [0.000, 0.000, 0.880], // Tm (VESTA)
  70: [0.153, 0.992, 0.958], // Yb (VESTA)
  71: [0.151, 0.994, 0.710], // Lu (VESTA)
  72: [0.707, 0.706, 0.351], // Hf (VESTA)
  73: [0.720, 0.607, 0.338], // Ta (VESTA)
  74: [0.556, 0.543, 0.502], // W  (VESTA)
  75: [0.703, 0.694, 0.558], // Re (VESTA)
  76: [0.787, 0.695, 0.474], // Os (VESTA)
  77: [0.790, 0.810, 0.450], // Ir (VESTA)
  78: [0.800, 0.775, 0.751], // Pt (VESTA)
  79: [0.996, 0.701, 0.221], // Au (VESTA)
  80: [0.829, 0.721, 0.798], // Hg (VESTA)
  81: [0.588, 0.539, 0.426], // Tl (VESTA)
  82: [0.324, 0.326, 0.357], // Pb (VESTA)
  83: [0.824, 0.187, 0.972], // Bi (VESTA)
  84: [0.000, 0.000, 1.000], // Po (VESTA)
  85: [0.300, 0.200, 0.800], // At (adjusted from VESTA to avoid Po duplicate)
  86: [1.000, 1.000, 0.000], // Rn (VESTA)
  87: [0.000, 0.000, 0.000], // Fr (VESTA)
  88: [0.430, 0.667, 0.348], // Ra (VESTA)
  89: [0.393, 0.621, 0.450], // Ac (VESTA)
  90: [0.149, 0.996, 0.471], // Th (VESTA)
  91: [0.161, 0.984, 0.209], // Pa (VESTA)
  92: [0.478, 0.634, 0.667], // U  (VESTA)
};

// Default color for unknown elements
export const DEFAULT_COLOR: [number, number, number] = [0.75, 0.4, 0.75];

// Van der Waals radii in Angstroms (from VESTA elements.ini)
export const VDW_RADII: Record<number, number> = {
  1: 1.20, 2: 1.40, 3: 1.40, 4: 1.40, 5: 1.40,
  6: 1.70, 7: 1.55, 8: 1.52, 9: 1.47, 10: 1.54,
  11: 1.54, 12: 1.54, 13: 1.54, 14: 2.10, 15: 1.80,
  16: 1.80, 17: 1.75, 18: 1.88, 19: 1.88, 20: 1.88,
  21: 1.88, 22: 1.88, 23: 1.88, 24: 1.88, 25: 1.88,
  26: 1.88, 27: 1.88, 28: 1.88, 29: 1.88, 30: 1.88,
  31: 1.88, 32: 1.88, 33: 1.85, 34: 1.90, 35: 1.85,
  36: 2.02, 37: 2.02, 38: 2.02, 39: 2.02, 40: 2.02,
  41: 2.02, 42: 2.02, 43: 2.02, 44: 2.02, 45: 2.02,
  46: 2.02, 47: 2.02, 48: 2.02, 49: 2.02, 50: 2.02,
  51: 2.00, 52: 2.06, 53: 1.98, 54: 2.16, 55: 2.16,
  56: 2.16, 57: 2.16, 58: 2.16, 59: 2.16, 60: 2.16,
  61: 2.16, 62: 2.16, 63: 2.16, 64: 2.16, 65: 2.16,
  66: 2.16, 67: 2.16, 68: 2.16, 69: 2.16, 70: 2.16,
  71: 2.16, 72: 2.16, 73: 2.16, 74: 2.16, 75: 2.16,
  76: 2.16, 77: 2.16, 78: 2.16, 79: 2.16, 80: 2.16,
  81: 2.16, 82: 2.16, 83: 2.16, 84: 2.16, 85: 2.16,
  86: 2.16, 87: 2.16, 88: 2.16, 89: 2.16, 90: 2.16,
  91: 2.16, 92: 2.16,
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

// Element symbols indexed by atomic number (Z=1-92)
export const ELEMENT_SYMBOLS: Record<number, string> = {
  1: "H", 2: "He", 3: "Li", 4: "Be", 5: "B", 6: "C", 7: "N", 8: "O", 9: "F", 10: "Ne",
  11: "Na", 12: "Mg", 13: "Al", 14: "Si", 15: "P", 16: "S", 17: "Cl", 18: "Ar", 19: "K", 20: "Ca",
  21: "Sc", 22: "Ti", 23: "V", 24: "Cr", 25: "Mn", 26: "Fe", 27: "Co", 28: "Ni", 29: "Cu", 30: "Zn",
  31: "Ga", 32: "Ge", 33: "As", 34: "Se", 35: "Br", 36: "Kr", 37: "Rb", 38: "Sr", 39: "Y", 40: "Zr",
  41: "Nb", 42: "Mo", 43: "Tc", 44: "Ru", 45: "Rh", 46: "Pd", 47: "Ag", 48: "Cd", 49: "In", 50: "Sn",
  51: "Sb", 52: "Te", 53: "I", 54: "Xe", 55: "Cs", 56: "Ba", 57: "La", 58: "Ce", 59: "Pr", 60: "Nd",
  61: "Pm", 62: "Sm", 63: "Eu", 64: "Gd", 65: "Tb", 66: "Dy", 67: "Ho", 68: "Er", 69: "Tm", 70: "Yb",
  71: "Lu", 72: "Hf", 73: "Ta", 74: "W", 75: "Re", 76: "Os", 77: "Ir", 78: "Pt", 79: "Au", 80: "Hg",
  81: "Tl", 82: "Pb", 83: "Bi", 84: "Po", 85: "At", 86: "Rn", 87: "Fr", 88: "Ra", 89: "Ac", 90: "Th",
  91: "Pa", 92: "U",
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

// Atomic masses in daltons (IUPAC standard atomic weights, Z=1-92)
export const ATOMIC_MASSES: Record<number, number> = {
  1: 1.008, 2: 4.003, 3: 6.941, 4: 9.012, 5: 10.81, 6: 12.011, 7: 14.007, 8: 15.999, 9: 18.998, 10: 20.180,
  11: 22.990, 12: 24.305, 13: 26.982, 14: 28.086, 15: 30.974, 16: 32.06, 17: 35.45, 18: 39.948, 19: 39.098, 20: 40.078,
  21: 44.956, 22: 47.867, 23: 50.942, 24: 51.996, 25: 54.938, 26: 55.845, 27: 58.933, 28: 58.693, 29: 63.546, 30: 65.38,
  31: 69.723, 32: 72.630, 33: 74.922, 34: 78.96, 35: 79.904, 36: 83.798, 37: 85.468, 38: 87.62, 39: 88.906, 40: 91.224,
  41: 92.906, 42: 95.95, 43: 98.0, 44: 101.07, 45: 102.906, 46: 106.42, 47: 107.868, 48: 112.411, 49: 114.818, 50: 118.710,
  51: 121.760, 52: 127.60, 53: 126.904, 54: 131.293, 55: 132.905, 56: 137.327, 57: 138.905, 58: 140.116, 59: 140.908, 60: 144.242,
  61: 145.0, 62: 150.36, 63: 151.964, 64: 157.25, 65: 158.925, 66: 162.500, 67: 164.930, 68: 167.259, 69: 168.934, 70: 173.045,
  71: 174.967, 72: 178.49, 73: 180.948, 74: 183.84, 75: 186.207, 76: 190.23, 77: 192.217, 78: 195.084, 79: 196.967, 80: 200.592,
  81: 204.38, 82: 207.2, 83: 208.980, 84: 209.0, 85: 210.0, 86: 222.0, 87: 223.0, 88: 226.0, 89: 227.0, 90: 232.038,
  91: 231.036, 92: 238.029,
};

export function getElementSymbol(atomicNum: number): string {
  return ELEMENT_SYMBOLS[atomicNum] ?? `#${atomicNum}`;
}

export function getAtomicMass(atomicNum: number): number {
  return ATOMIC_MASSES[atomicNum] ?? 0;
}
