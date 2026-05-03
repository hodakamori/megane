/// LAMMPS data file parser.
///
/// Supports atom_style: atomic, charge, and full (real).
/// Auto-detects style from comment hint (`Atoms # full`) or field count.
use std::collections::{HashMap, HashSet};

use crate::atomic::mass_to_atomic_num;
use crate::bonds;
use crate::parser::ParsedStructure;

// ── Atom style ────────────────────────────────────────────────────────────

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

// ── Header ────────────────────────────────────────────────────────────────

/// Parsed data from the header and section-start scan of a LAMMPS data file.
struct HeaderData {
    n_atoms: usize,
    has_box: bool,
    xlo: f32,
    xhi: f32,
    ylo: f32,
    yhi: f32,
    zlo: f32,
    zhi: f32,
    xy: f32,
    xz: f32,
    yz: f32,
    has_tilt: bool,
    masses_start: Option<usize>,
    atoms_start: Option<usize>,
    atoms_style_hint: Option<AtomStyle>,
    bonds_start: Option<usize>,
}

/// Scan all lines once to collect header counts, box bounds, and section positions.
fn parse_header(lines: &[&str]) -> HeaderData {
    let mut hd = HeaderData {
        n_atoms: 0,
        has_box: false,
        xlo: 0.0,
        xhi: 0.0,
        ylo: 0.0,
        yhi: 0.0,
        zlo: 0.0,
        zhi: 0.0,
        xy: 0.0,
        xz: 0.0,
        yz: 0.0,
        has_tilt: false,
        masses_start: None,
        atoms_start: None,
        atoms_style_hint: None,
        bonds_start: None,
    };

    for (i, line) in lines.iter().enumerate() {
        let trimmed = line.trim();
        if trimmed.is_empty() {
            continue;
        }
        let tokens: Vec<&str> = trimmed.split_whitespace().collect();

        // "N atoms" header line
        if tokens.len() == 2 && tokens[1] == "atoms" {
            if let Ok(n) = tokens[0].parse::<usize>() {
                hd.n_atoms = n;
            }
        }

        // Box bounds: "lo hi xlo xhi"
        if tokens.len() >= 4 {
            match (tokens[2], tokens[3]) {
                ("xlo", "xhi") => {
                    hd.xlo = tokens[0].parse().unwrap_or(0.0);
                    hd.xhi = tokens[1].parse().unwrap_or(0.0);
                    hd.has_box = true;
                }
                ("ylo", "yhi") => {
                    hd.ylo = tokens[0].parse().unwrap_or(0.0);
                    hd.yhi = tokens[1].parse().unwrap_or(0.0);
                }
                ("zlo", "zhi") => {
                    hd.zlo = tokens[0].parse().unwrap_or(0.0);
                    hd.zhi = tokens[1].parse().unwrap_or(0.0);
                }
                _ => {}
            }
        }

        // Tilt factors: "<xy> <xz> <yz> xy xz yz"
        if tokens.len() >= 6 && tokens[3] == "xy" && tokens[4] == "xz" && tokens[5] == "yz" {
            hd.xy = tokens[0].parse().unwrap_or(0.0);
            hd.xz = tokens[1].parse().unwrap_or(0.0);
            hd.yz = tokens[2].parse().unwrap_or(0.0);
            hd.has_tilt = true;
        }

        // Section headers
        if trimmed == "Masses" || trimmed.starts_with("Masses ") {
            hd.masses_start = Some(i);
        }
        if trimmed == "Atoms" || trimmed.starts_with("Atoms ") {
            hd.atoms_start = Some(i);
            hd.atoms_style_hint = parse_style_hint(trimmed);
        }
        if trimmed == "Bonds" || trimmed.starts_with("Bonds ") {
            hd.bonds_start = Some(i);
        }
    }

    hd
}

// ── Masses section ────────────────────────────────────────────────────────

/// Parse the Masses section and return a map from type_id → mass.
fn parse_masses_section(lines: &[&str], start: usize) -> HashMap<u32, f32> {
    let mut type_to_mass: HashMap<u32, f32> = HashMap::new();

    for line in lines.iter().skip(start + 1) {
        let trimmed = line.trim();
        if trimmed.is_empty() {
            continue;
        }
        let tokens: Vec<&str> = trimmed.split_whitespace().collect();
        if tokens.is_empty() {
            continue;
        }
        let type_id: u32 = match tokens[0].parse() {
            Ok(id) => id,
            Err(_) => break, // reached next section header
        };
        if tokens.len() >= 2 {
            if let Ok(mass) = tokens[1].parse::<f32>() {
                type_to_mass.insert(type_id, mass);
            }
        }
    }

    type_to_mass
}

// ── Atoms section ─────────────────────────────────────────────────────────

/// Data extracted from the Atoms section.
struct AtomsData {
    positions: Vec<f32>,
    elements: Vec<u8>,
    labels: Vec<String>,
    /// Maps LAMMPS 1-based atom IDs to 0-based indices.
    id_to_index: HashMap<u32, usize>,
    count: usize,
}

/// Parse the Atoms section.
///
/// `atoms_line` is the line index of the "Atoms" header.
fn parse_atoms_section(
    lines: &[&str],
    atoms_line: usize,
    style_hint: Option<AtomStyle>,
    type_to_mass: &HashMap<u32, f32>,
    n_atoms: usize,
) -> Result<AtomsData, String> {
    // Skip blank lines after the "Atoms" header
    let mut data_start = atoms_line + 1;
    while data_start < lines.len() && lines[data_start].trim().is_empty() {
        data_start += 1;
    }

    // Resolve atom style: use hint if present, else detect from first data line
    let style = if let Some(hint) = style_hint {
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
    let mut id_to_index: HashMap<u32, usize> = HashMap::new();
    let mut count = 0usize;

    for line in lines.iter().skip(data_start) {
        let trimmed = line.trim();
        if trimmed.is_empty() {
            continue;
        }
        let tokens: Vec<&str> = trimmed.split_whitespace().collect();
        if tokens.is_empty() {
            continue;
        }
        // Non-numeric first token signals a new section header
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
                // tokens[2] = charge (ignored)
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
                // tokens[3] = charge (ignored)
                let x: f32 = tokens[4].parse().map_err(|_| "bad x")?;
                let y: f32 = tokens[5].parse().map_err(|_| "bad y")?;
                let z: f32 = tokens[6].parse().map_err(|_| "bad z")?;
                (aid, tid, x, y, z)
            }
        };

        id_to_index.insert(atom_id, count);
        count += 1;

        positions.push(x);
        positions.push(y);
        positions.push(z);

        let elem = type_to_mass
            .get(&type_id)
            .map(|&m| mass_to_atomic_num(m))
            .unwrap_or(0);
        elements.push(elem);
        labels.push(format!("{}", type_id));
    }

    Ok(AtomsData {
        positions,
        elements,
        labels,
        id_to_index,
        count,
    })
}

// ── Bonds section ─────────────────────────────────────────────────────────

/// Parse the Bonds section and return unique (a, b) index pairs (0-based).
fn parse_bonds_section(
    lines: &[&str],
    start: usize,
    id_to_index: &HashMap<u32, usize>,
) -> Vec<(u32, u32)> {
    let mut file_bonds: Vec<(u32, u32)> = Vec::new();
    let mut bond_set: HashSet<(u32, u32)> = HashSet::new();

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
            break; // reached next section header
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
        // Convert from LAMMPS 1-based IDs to 0-based indices
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

    file_bonds
}

// ── Public API ────────────────────────────────────────────────────────────

pub fn parse(text: &str) -> Result<ParsedStructure, String> {
    let lines: Vec<&str> = text.lines().collect();

    let hd = parse_header(&lines);

    if hd.n_atoms == 0 {
        return Err("LAMMPS data file contains no atoms".into());
    }
    let atoms_line = hd
        .atoms_start
        .ok_or("No Atoms section found in LAMMPS data file")?;

    let type_to_mass = hd
        .masses_start
        .map(|s| parse_masses_section(&lines, s))
        .unwrap_or_default();

    let atoms = parse_atoms_section(
        &lines,
        atoms_line,
        hd.atoms_style_hint,
        &type_to_mass,
        hd.n_atoms,
    )?;

    if atoms.count == 0 {
        return Err("No atoms parsed from Atoms section".into());
    }

    let mut file_bonds = hd
        .bonds_start
        .map(|s| parse_bonds_section(&lines, s, &atoms.id_to_index))
        .unwrap_or_default();

    let n_file_bonds = file_bonds.len();
    let bond_set: HashSet<(u32, u32)> = file_bonds.iter().copied().collect();
    let inferred = bonds::infer_bonds(&atoms.positions, &atoms.elements, atoms.count, &bond_set);
    file_bonds.extend(inferred);

    let box_matrix = if hd.has_box {
        let lx = hd.xhi - hd.xlo;
        let ly = hd.yhi - hd.ylo;
        let lz = hd.zhi - hd.zlo;
        if hd.has_tilt {
            Some([lx, 0.0, 0.0, hd.xy, ly, 0.0, hd.xz, hd.yz, lz])
        } else {
            Some([lx, 0.0, 0.0, 0.0, ly, 0.0, 0.0, 0.0, lz])
        }
    } else {
        None
    };

    let atom_labels = if atoms.labels.iter().any(|l| !l.is_empty()) {
        Some(atoms.labels)
    } else {
        None
    };

    Ok(ParsedStructure {
        n_atoms: atoms.count,
        positions: atoms.positions,
        elements: atoms.elements,
        bonds: file_bonds,
        n_file_bonds,
        bond_orders: None,
        box_matrix,
        frame_positions: Vec::new(),
        atom_labels,
        vector_channels: vec![],
        ca_indices: vec![],
        ca_chain_ids: vec![],
        ca_res_nums: vec![],
        ca_ss_type: vec![],
    })
}

#[cfg(test)]
mod tests {
    use super::*;

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
