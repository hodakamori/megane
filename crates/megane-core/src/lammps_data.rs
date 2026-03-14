/// LAMMPS data file parser.
///
/// Supports atom_style: atomic, charge, and full (real).
/// Auto-detects style from comment hint (`Atoms # full`) or field count.
use std::collections::{HashMap, HashSet};

use crate::bonds;
use crate::parser::ParsedStructure;

/// Map atomic mass (in amu) to atomic number.
/// Uses closest match within tolerance of 0.5 amu.
fn mass_to_atomic_num(mass: f32) -> u8 {
    const TABLE: &[(f32, u8)] = &[
        (1.008, 1),   // H
        (4.003, 2),   // He
        (6.941, 3),   // Li
        (9.012, 4),   // Be
        (10.81, 5),   // B
        (12.011, 6),  // C
        (14.007, 7),  // N
        (15.999, 8),  // O
        (18.998, 9),  // F
        (20.180, 10), // Ne
        (22.990, 11), // Na
        (24.305, 12), // Mg
        (26.982, 13), // Al
        (28.086, 14), // Si
        (30.974, 15), // P
        (32.065, 16), // S
        (35.453, 17), // Cl
        (39.948, 18), // Ar
        (39.098, 19), // K
        (40.078, 20), // Ca
        (44.956, 21), // Sc
        (47.867, 22), // Ti
        (50.942, 23), // V
        (51.996, 24), // Cr
        (54.938, 25), // Mn
        (55.845, 26), // Fe
        (58.933, 27), // Co
        (58.693, 28), // Ni
        (63.546, 29), // Cu
        (65.380, 30), // Zn
        (69.723, 31), // Ga
        (72.630, 32), // Ge
        (74.922, 33), // As
        (78.971, 34), // Se
        (79.904, 35), // Br
        (83.798, 36), // Kr
        (85.468, 37), // Rb
        (87.620, 38), // Sr
        (88.906, 39), // Y
        (91.224, 40), // Zr
        (95.950, 42), // Mo
        (101.07, 44), // Ru
        (102.91, 45), // Rh
        (106.42, 46), // Pd
        (107.87, 47), // Ag
        (112.41, 48), // Cd
        (114.82, 49), // In
        (118.71, 50), // Sn
        (121.76, 51), // Sb
        (127.60, 52), // Te
        (126.90, 53), // I
        (131.29, 54), // Xe
        (132.91, 55), // Cs
        (137.33, 56), // Ba
        (138.91, 57), // La
        (140.12, 58), // Ce
        (144.24, 60), // Nd
        (150.36, 62), // Sm
        (151.96, 63), // Eu
        (157.25, 64), // Gd
        (158.93, 65), // Tb
        (162.50, 66), // Dy
        (164.93, 67), // Ho
        (167.26, 68), // Er
        (173.05, 70), // Yb
        (174.97, 71), // Lu
        (178.49, 72), // Hf
        (180.95, 73), // Ta
        (183.84, 74), // W
        (186.21, 75), // Re
        (190.23, 76), // Os
        (192.22, 77), // Ir
        (195.08, 78), // Pt
        (196.97, 79), // Au
        (200.59, 80), // Hg
        (204.38, 81), // Tl
        (207.20, 82), // Pb
        (208.98, 83), // Bi
        (232.04, 90), // Th
        (238.03, 92), // U
    ];

    let mut best_z: u8 = 0;
    let mut best_diff = 0.5_f32;

    for &(m, z) in TABLE {
        let diff = (mass - m).abs();
        if diff < best_diff {
            best_diff = diff;
            best_z = z;
        }
    }

    best_z
}

/// Detected atom_style for the Atoms section.
#[derive(Debug, Clone, Copy, PartialEq)]
enum AtomStyle {
    /// atom_id type x y z
    Atomic,
    /// atom_id type charge x y z
    Charge,
    /// atom_id mol_id type charge x y z
    Full,
}

/// Try to detect atom style from the comment after `Atoms` keyword.
/// e.g. `Atoms # full` → Some(Full)
fn parse_style_hint(line: &str) -> Option<AtomStyle> {
    let hash_pos = line.find('#')?;
    let hint = line[hash_pos + 1..].trim().to_lowercase();
    match hint.as_str() {
        "atomic" => Some(AtomStyle::Atomic),
        "charge" => Some(AtomStyle::Charge),
        "full" | "real" => Some(AtomStyle::Full),
        _ => None,
    }
}

/// Detect atom style from number of whitespace-separated fields.
fn detect_style_from_fields(n_fields: usize) -> Option<AtomStyle> {
    match n_fields {
        5 => Some(AtomStyle::Atomic),
        6 => Some(AtomStyle::Charge),
        7.. => Some(AtomStyle::Full),
        _ => None,
    }
}

pub fn parse(text: &str) -> Result<ParsedStructure, String> {
    let lines: Vec<&str> = text.lines().collect();

    // --- Header parsing ---
    let mut n_atoms: usize = 0;
    let mut xlo: f32 = 0.0;
    let mut xhi: f32 = 0.0;
    let mut ylo: f32 = 0.0;
    let mut yhi: f32 = 0.0;
    let mut zlo: f32 = 0.0;
    let mut zhi: f32 = 0.0;
    let mut xy: f32 = 0.0;
    let mut xz: f32 = 0.0;
    let mut yz: f32 = 0.0;
    let mut has_tilt = false;
    let mut has_box = false;

    // Section start indices
    let mut masses_start: Option<usize> = None;
    let mut atoms_start: Option<usize> = None;
    let mut atoms_style_hint: Option<AtomStyle> = None;
    let mut bonds_start: Option<usize> = None;
    let mut _n_bonds_expected: usize = 0;

    for (i, line) in lines.iter().enumerate() {
        let trimmed = line.trim();
        if trimmed.is_empty() {
            continue;
        }

        let tokens: Vec<&str> = trimmed.split_whitespace().collect();

        // Header lines: "N atoms", "N bonds", "N atom types"
        if tokens.len() >= 2 {
            if tokens[1] == "atoms" && tokens.len() == 2 {
                if let Ok(n) = tokens[0].parse::<usize>() {
                    n_atoms = n;
                }
            }
            if tokens[1] == "bonds" && tokens.len() == 2 {
                if let Ok(n) = tokens[0].parse::<usize>() {
                    _n_bonds_expected = n;
                }
            }
        }

        // Box bounds
        if tokens.len() >= 4 && tokens[2] == "xlo" && tokens[3] == "xhi" {
            xlo = tokens[0].parse().unwrap_or(0.0);
            xhi = tokens[1].parse().unwrap_or(0.0);
            has_box = true;
        }
        if tokens.len() >= 4 && tokens[2] == "ylo" && tokens[3] == "yhi" {
            ylo = tokens[0].parse().unwrap_or(0.0);
            yhi = tokens[1].parse().unwrap_or(0.0);
        }
        if tokens.len() >= 4 && tokens[2] == "zlo" && tokens[3] == "zhi" {
            zlo = tokens[0].parse().unwrap_or(0.0);
            zhi = tokens[1].parse().unwrap_or(0.0);
        }

        // Tilt factors
        if tokens.len() >= 6 && tokens[3] == "xy" && tokens[4] == "xz" && tokens[5] == "yz" {
            xy = tokens[0].parse().unwrap_or(0.0);
            xz = tokens[1].parse().unwrap_or(0.0);
            yz = tokens[2].parse().unwrap_or(0.0);
            has_tilt = true;
        }

        // Section headers
        if trimmed == "Masses" || trimmed.starts_with("Masses ") {
            masses_start = Some(i);
        }
        if trimmed == "Atoms" || trimmed.starts_with("Atoms ") {
            atoms_start = Some(i);
            atoms_style_hint = parse_style_hint(trimmed);
        }
        if trimmed == "Bonds" || trimmed.starts_with("Bonds ") {
            bonds_start = Some(i);
        }
    }

    if n_atoms == 0 {
        return Err("LAMMPS data file contains no atoms".into());
    }

    let atoms_line = atoms_start.ok_or("No Atoms section found in LAMMPS data file")?;

    // --- Parse Masses section ---
    let mut type_to_mass: HashMap<u32, f32> = HashMap::new();
    if let Some(start) = masses_start {
        for line in lines.iter().skip(start + 1) {
            let trimmed = line.trim();
            if trimmed.is_empty() {
                continue;
            }
            // Stop at next section header (non-numeric first token)
            let tokens: Vec<&str> = trimmed.split_whitespace().collect();
            if tokens.is_empty() {
                continue;
            }
            let type_id: u32 = match tokens[0].parse() {
                Ok(id) => id,
                Err(_) => break, // section header
            };
            if tokens.len() >= 2 {
                if let Ok(mass) = tokens[1].parse::<f32>() {
                    type_to_mass.insert(type_id, mass);
                }
            }
        }
    }

    // --- Parse Atoms section ---
    // Skip blank lines after "Atoms" header
    let mut data_start = atoms_line + 1;
    while data_start < lines.len() && lines[data_start].trim().is_empty() {
        data_start += 1;
    }

    // Detect style from first data line if no hint
    let style = if let Some(hint) = atoms_style_hint {
        hint
    } else if data_start < lines.len() {
        let first_tokens: Vec<&str> = lines[data_start].split_whitespace().collect();
        detect_style_from_fields(first_tokens.len())
            .ok_or("Cannot detect atom_style: unexpected number of fields")?
    } else {
        return Err("Atoms section is empty".into());
    };

    let mut positions = Vec::with_capacity(n_atoms * 3);
    let mut elements = Vec::with_capacity(n_atoms);
    let mut labels = Vec::with_capacity(n_atoms);
    // Map from LAMMPS atom_id (1-based) to 0-based index
    let mut id_to_index: HashMap<u32, usize> = HashMap::new();
    let mut atom_count = 0usize;

    for line in lines.iter().skip(data_start) {
        let trimmed = line.trim();
        if trimmed.is_empty() {
            continue;
        }
        // Stop at next section header
        let tokens: Vec<&str> = trimmed.split_whitespace().collect();
        if tokens.is_empty() {
            continue;
        }
        // If first token is not numeric, it's a section header
        if tokens[0].parse::<u32>().is_err() {
            break;
        }

        let (atom_id, type_id, x, y, z) = match style {
            AtomStyle::Atomic => {
                // atom_id type x y z
                if tokens.len() < 5 {
                    continue;
                }
                let aid: u32 = tokens[0].parse().map_err(|_| "bad atom_id")?;
                let tid: u32 = tokens[1].parse().map_err(|_| "bad type")?;
                let x: f32 = tokens[2].parse().map_err(|_| "bad x")?;
                let y: f32 = tokens[3].parse().map_err(|_| "bad y")?;
                let z: f32 = tokens[4].parse().map_err(|_| "bad z")?;
                (aid, tid, x, y, z)
            }
            AtomStyle::Charge => {
                // atom_id type charge x y z
                if tokens.len() < 6 {
                    continue;
                }
                let aid: u32 = tokens[0].parse().map_err(|_| "bad atom_id")?;
                let tid: u32 = tokens[1].parse().map_err(|_| "bad type")?;
                // tokens[2] = charge (ignored for now)
                let x: f32 = tokens[3].parse().map_err(|_| "bad x")?;
                let y: f32 = tokens[4].parse().map_err(|_| "bad y")?;
                let z: f32 = tokens[5].parse().map_err(|_| "bad z")?;
                (aid, tid, x, y, z)
            }
            AtomStyle::Full => {
                // atom_id mol_id type charge x y z
                if tokens.len() < 7 {
                    continue;
                }
                let aid: u32 = tokens[0].parse().map_err(|_| "bad atom_id")?;
                // tokens[1] = mol_id (ignored)
                let tid: u32 = tokens[2].parse().map_err(|_| "bad type")?;
                // tokens[3] = charge (ignored for now)
                let x: f32 = tokens[4].parse().map_err(|_| "bad x")?;
                let y: f32 = tokens[5].parse().map_err(|_| "bad y")?;
                let z: f32 = tokens[6].parse().map_err(|_| "bad z")?;
                (aid, tid, x, y, z)
            }
        };

        id_to_index.insert(atom_id, atom_count);
        atom_count += 1;

        positions.push(x);
        positions.push(y);
        positions.push(z);

        // Resolve element from mass table
        let elem = type_to_mass
            .get(&type_id)
            .map(|&m| mass_to_atomic_num(m))
            .unwrap_or(0);
        elements.push(elem);

        labels.push(format!("{}", type_id));
    }

    if atom_count == 0 {
        return Err("No atoms parsed from Atoms section".into());
    }

    // --- Parse Bonds section ---
    let mut file_bonds: Vec<(u32, u32)> = Vec::new();
    let mut bond_set: HashSet<(u32, u32)> = HashSet::new();

    if let Some(start) = bonds_start {
        let mut bond_data_start = start + 1;
        while bond_data_start < lines.len() && lines[bond_data_start].trim().is_empty() {
            bond_data_start += 1;
        }

        for line in lines.iter().skip(bond_data_start) {
            let trimmed = line.trim();
            if trimmed.is_empty() {
                continue;
            }
            let tokens: Vec<&str> = trimmed.split_whitespace().collect();
            if tokens.is_empty() {
                continue;
            }
            if tokens[0].parse::<u32>().is_err() {
                break; // section header
            }
            // bond_id bond_type atom_i atom_j
            if tokens.len() < 4 {
                continue;
            }
            let ai: u32 = match tokens[2].parse() {
                Ok(v) => v,
                Err(_) => continue,
            };
            let aj: u32 = match tokens[3].parse() {
                Ok(v) => v,
                Err(_) => continue,
            };
            // Convert from LAMMPS 1-based atom IDs to 0-based indices
            let idx_i = match id_to_index.get(&ai) {
                Some(&idx) => idx as u32,
                None => continue,
            };
            let idx_j = match id_to_index.get(&aj) {
                Some(&idx) => idx as u32,
                None => continue,
            };
            let a = idx_i.min(idx_j);
            let b = idx_i.max(idx_j);
            if bond_set.insert((a, b)) {
                file_bonds.push((a, b));
            }
        }
    }

    let n_file_bonds = file_bonds.len();

    // Infer additional bonds
    let inferred = bonds::infer_bonds(&positions, &elements, atom_count, &bond_set);
    let mut all_bonds = file_bonds;
    all_bonds.extend(inferred);

    // --- Box matrix ---
    let box_matrix = if has_box {
        let lx = xhi - xlo;
        let ly = yhi - ylo;
        let lz = zhi - zlo;
        if has_tilt {
            Some([lx, 0.0, 0.0, xy, ly, 0.0, xz, yz, lz])
        } else {
            Some([lx, 0.0, 0.0, 0.0, ly, 0.0, 0.0, 0.0, lz])
        }
    } else {
        None
    };

    let atom_labels = if labels.iter().any(|l| !l.is_empty()) {
        Some(labels)
    } else {
        None
    };

    Ok(ParsedStructure {
        n_atoms: atom_count,
        positions,
        elements,
        bonds: all_bonds,
        n_file_bonds,
        bond_orders: None,
        box_matrix,
        frame_positions: Vec::new(),
        atom_labels,
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_mass_to_atomic_num() {
        assert_eq!(mass_to_atomic_num(1.008), 1); // H
        assert_eq!(mass_to_atomic_num(12.011), 6); // C
        assert_eq!(mass_to_atomic_num(14.007), 7); // N
        assert_eq!(mass_to_atomic_num(15.999), 8); // O
        assert_eq!(mass_to_atomic_num(55.845), 26); // Fe
        assert_eq!(mass_to_atomic_num(196.97), 79); // Au
        assert_eq!(mass_to_atomic_num(999.0), 0); // unknown
    }

    #[test]
    fn test_parse_style_hint() {
        assert_eq!(parse_style_hint("Atoms # atomic"), Some(AtomStyle::Atomic));
        assert_eq!(parse_style_hint("Atoms # charge"), Some(AtomStyle::Charge));
        assert_eq!(parse_style_hint("Atoms # full"), Some(AtomStyle::Full));
        assert_eq!(parse_style_hint("Atoms # real"), Some(AtomStyle::Full));
        assert_eq!(parse_style_hint("Atoms"), None);
    }

    #[test]
    fn test_detect_style_from_fields() {
        assert_eq!(detect_style_from_fields(5), Some(AtomStyle::Atomic));
        assert_eq!(detect_style_from_fields(6), Some(AtomStyle::Charge));
        assert_eq!(detect_style_from_fields(7), Some(AtomStyle::Full));
        assert_eq!(detect_style_from_fields(10), Some(AtomStyle::Full));
        assert_eq!(detect_style_from_fields(3), None);
    }

    #[test]
    fn test_parse_atomic_style() {
        let data = "\
LAMMPS data file

3 atoms
1 atom types

0.0 10.0 xlo xhi
0.0 10.0 ylo yhi
0.0 10.0 zlo zhi

Masses

1 12.011

Atoms # atomic

1 1 1.0 2.0 3.0
2 1 4.0 5.0 6.0
3 1 7.0 8.0 9.0
";
        let result = parse(data).expect("parse failed");
        assert_eq!(result.n_atoms, 3);
        assert_eq!(result.elements[0], 6); // C
        assert!((result.positions[0] - 1.0).abs() < 1e-5);
        assert!((result.positions[1] - 2.0).abs() < 1e-5);
        assert!((result.positions[2] - 3.0).abs() < 1e-5);
        let bm = result.box_matrix.unwrap();
        assert!((bm[0] - 10.0).abs() < 1e-5);
        assert!((bm[4] - 10.0).abs() < 1e-5);
        assert!((bm[8] - 10.0).abs() < 1e-5);
    }

    #[test]
    fn test_parse_charge_style() {
        let data = "\
LAMMPS data file

2 atoms
2 atom types

0.0 5.0 xlo xhi
0.0 5.0 ylo yhi
0.0 5.0 zlo zhi

Masses

1 15.999
2 1.008

Atoms # charge

1 1 -0.8476 2.5 2.5 2.5
2 2 0.4238 3.0 2.5 2.5
";
        let result = parse(data).expect("parse failed");
        assert_eq!(result.n_atoms, 2);
        assert_eq!(result.elements[0], 8); // O
        assert_eq!(result.elements[1], 1); // H
        assert!((result.positions[0] - 2.5).abs() < 1e-5);
    }

    #[test]
    fn test_parse_full_style() {
        let data = "\
LAMMPS data file

2 atoms
2 atom types
1 bonds
1 bond types

0.0 20.0 xlo xhi
0.0 20.0 ylo yhi
0.0 20.0 zlo zhi

Masses

1 15.999
2 1.008

Atoms # full

1 1 1 -0.8476 10.0 10.0 10.0
2 1 2 0.4238 10.757 10.587 10.0

Bonds

1 1 1 2
";
        let result = parse(data).expect("parse failed");
        assert_eq!(result.n_atoms, 2);
        assert_eq!(result.elements[0], 8); // O
        assert_eq!(result.elements[1], 1); // H
        assert_eq!(result.n_file_bonds, 1);
        // Verify the bond exists
        assert!(result.bonds.contains(&(0, 1)));
    }

    #[test]
    fn test_parse_auto_detect_atomic() {
        let data = "\
LAMMPS data file

2 atoms
1 atom types

0.0 10.0 xlo xhi
0.0 10.0 ylo yhi
0.0 10.0 zlo zhi

Masses

1 26.982

Atoms

1 1 0.0 0.0 0.0
2 1 2.5 2.5 2.5
";
        let result = parse(data).expect("parse failed");
        assert_eq!(result.n_atoms, 2);
        assert_eq!(result.elements[0], 13); // Al
    }

    #[test]
    fn test_parse_triclinic() {
        let data = "\
LAMMPS data file

1 atoms
1 atom types

0.0 10.0 xlo xhi
0.0 10.0 ylo yhi
0.0 10.0 zlo zhi
1.0 0.5 0.0 xy xz yz

Masses

1 12.011

Atoms # atomic

1 1 5.0 5.0 5.0
";
        let result = parse(data).expect("parse failed");
        let bm = result.box_matrix.unwrap();
        assert!((bm[0] - 10.0).abs() < 1e-5); // lx
        assert!((bm[3] - 1.0).abs() < 1e-5); // xy
        assert!((bm[4] - 10.0).abs() < 1e-5); // ly
        assert!((bm[6] - 0.5).abs() < 1e-5); // xz
        assert!((bm[7] - 0.0).abs() < 1e-5); // yz
        assert!((bm[8] - 10.0).abs() < 1e-5); // lz
    }

    #[test]
    fn test_parse_no_atoms_error() {
        let data = "LAMMPS data file\n\n0 atoms\n";
        assert!(parse(data).is_err());
    }

    #[test]
    fn test_parse_no_atoms_section_error() {
        let data = "\
LAMMPS data file

2 atoms
1 atom types

0.0 10.0 xlo xhi
0.0 10.0 ylo yhi
0.0 10.0 zlo zhi
";
        assert!(parse(data).is_err());
    }

    #[test]
    fn test_parse_fixture() {
        let text = std::fs::read_to_string(concat!(
            env!("CARGO_MANIFEST_DIR"),
            "/../../tests/fixtures/water.lammps"
        ));
        // Skip test if fixture doesn't exist
        if text.is_err() {
            return;
        }
        let result = parse(&text.unwrap()).expect("parse failed");
        assert!(result.n_atoms > 0);
    }
}
