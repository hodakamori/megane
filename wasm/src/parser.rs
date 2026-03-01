/// PDB text parser.
///
/// Handles ATOM/HETATM, CRYST1, CONECT, and MODEL/ENDMDL records.

use std::collections::{HashMap, HashSet};

/// Parsed atom data from a single ATOM/HETATM line.
pub struct Atom {
    pub x: f32,
    pub y: f32,
    pub z: f32,
    pub element: u8,
}

/// Common result type for all structure format parsers.
pub struct ParsedStructure {
    pub n_atoms: usize,
    pub positions: Vec<f32>,
    pub elements: Vec<u8>,
    pub bonds: Vec<(u32, u32)>,
    pub n_file_bonds: usize,
    pub bond_orders: Option<Vec<u8>>,
    pub box_matrix: Option<[f32; 9]>,
    pub frame_positions: Vec<Vec<f32>>,
}

/// Element symbol → atomic number lookup.
pub fn symbol_to_atomic_num(sym: &str) -> u8 {
    match sym {
        "H" => 1, "He" => 2,
        "Li" => 3, "Be" => 4, "B" => 5, "C" => 6, "N" => 7, "O" => 8, "F" => 9, "Ne" => 10,
        "Na" => 11, "Mg" => 12, "Al" => 13, "Si" => 14, "P" => 15, "S" => 16, "Cl" => 17, "Ar" => 18,
        "K" => 19, "Ca" => 20,
        "Sc" => 21, "Ti" => 22, "V" => 23, "Cr" => 24, "Mn" => 25,
        "Fe" => 26, "Co" => 27, "Ni" => 28, "Cu" => 29, "Zn" => 30,
        "Ga" => 31, "Ge" => 32, "As" => 33, "Se" => 34, "Br" => 35, "Kr" => 36,
        "Rb" => 37, "Sr" => 38, "Y" => 39, "Zr" => 40,
        "Mo" => 42, "Ru" => 44, "Rh" => 45, "Pd" => 46, "Ag" => 47, "Cd" => 48,
        "In" => 49, "Sn" => 50, "Sb" => 51, "Te" => 52, "I" => 53, "Xe" => 54,
        "Cs" => 55, "Ba" => 56, "La" => 57,
        "Ce" => 58, "Nd" => 60, "Sm" => 62, "Eu" => 63, "Gd" => 64,
        "Tb" => 65, "Dy" => 66, "Ho" => 67, "Er" => 68, "Yb" => 70, "Lu" => 71,
        "Hf" => 72, "Ta" => 73, "W" => 74, "Re" => 75, "Os" => 76,
        "Ir" => 77, "Pt" => 78, "Au" => 79, "Hg" => 80,
        "Tl" => 81, "Pb" => 82, "Bi" => 83,
        "Th" => 90, "U" => 92,
        _ => 0,
    }
}

/// Parse the element from a PDB ATOM/HETATM line.
///
/// First tries columns 76-78 (element symbol field).
/// Falls back to deriving from the atom name (columns 12-16).
fn parse_element(line: &str) -> u8 {
    let bytes = line.as_bytes();

    // Try element symbol field (columns 77-78, 0-indexed: 76-77)
    if bytes.len() >= 78 {
        let elem_str = line[76..78].trim();
        if !elem_str.is_empty() {
            // Capitalize: first char uppercase, rest lowercase
            let capitalized = capitalize(elem_str);
            let z = symbol_to_atomic_num(&capitalized);
            if z > 0 {
                return z;
            }
        }
    }

    // Fallback: derive from atom name (columns 13-16, 0-indexed: 12-15)
    if bytes.len() >= 16 {
        let atom_name = &line[12..16];
        // Strip digits and spaces, take first alpha characters
        let alpha: String = atom_name.chars().filter(|c| c.is_alphabetic()).collect();
        if !alpha.is_empty() {
            // Try two-char element first, then single char
            if alpha.len() >= 2 {
                let two_char = capitalize(&alpha[..2]);
                let z = symbol_to_atomic_num(&two_char);
                if z > 0 {
                    return z;
                }
            }
            let one_char = alpha[..1].to_uppercase().to_string();
            let z = symbol_to_atomic_num(&one_char);
            if z > 0 {
                return z;
            }
        }
    }

    0 // unknown
}

pub fn capitalize(s: &str) -> String {
    let mut chars = s.chars();
    match chars.next() {
        None => String::new(),
        Some(c) => {
            let upper: String = c.to_uppercase().collect();
            let lower: String = chars.flat_map(|c| c.to_lowercase()).collect();
            format!("{}{}", upper, lower)
        }
    }
}

/// Parse an ATOM/HETATM line to extract coordinates and element.
fn parse_atom_line(line: &str) -> Option<(i32, Atom)> {
    if line.len() < 54 {
        return None;
    }

    let serial: i32 = line[6..11].trim().parse().ok()?;
    let x: f32 = line[30..38].trim().parse().ok()?;
    let y: f32 = line[38..46].trim().parse().ok()?;
    let z: f32 = line[46..54].trim().parse().ok()?;
    let element = parse_element(line);

    Some((serial, Atom { x, y, z, element }))
}

/// Parse CRYST1 record and convert cell parameters to a 3x3 matrix.
fn parse_cryst1(line: &str) -> Option<[f32; 9]> {
    if line.len() < 54 {
        return None;
    }

    let a: f32 = line[6..15].trim().parse().ok()?;
    let b: f32 = line[15..24].trim().parse().ok()?;
    let c: f32 = line[24..33].trim().parse().ok()?;
    let alpha: f32 = line[33..40].trim().parse().ok()?;
    let beta: f32 = line[40..47].trim().parse().ok()?;
    let gamma: f32 = line[47..54].trim().parse().ok()?;

    if a <= 0.0 || b <= 0.0 || c <= 0.0 {
        return None;
    }

    Some(cell_params_to_matrix(a, b, c, alpha, beta, gamma))
}

/// Convert crystallographic cell parameters to a 3x3 matrix (row-major).
fn cell_params_to_matrix(a: f32, b: f32, c: f32, alpha: f32, beta: f32, gamma: f32) -> [f32; 9] {
    let to_rad = std::f32::consts::PI / 180.0;
    let alpha_r = alpha * to_rad;
    let beta_r = beta * to_rad;
    let gamma_r = gamma * to_rad;

    let cos_a = alpha_r.cos();
    let cos_b = beta_r.cos();
    let cos_g = gamma_r.cos();
    let sin_g = gamma_r.sin();

    let cx = c * cos_b;
    let cy = c * (cos_a - cos_b * cos_g) / sin_g;
    let cz = (c * c - cx * cx - cy * cy).max(0.0).sqrt();

    [
        a,        0.0,      0.0,      // va
        b * cos_g, b * sin_g, 0.0,    // vb
        cx,       cy,        cz,      // vc
    ]
}

/// Parse CONECT record to extract bond pairs.
fn parse_conect_line(line: &str, serial_to_index: &HashMap<i32, usize>) -> Vec<(u32, u32)> {
    let mut bonds = Vec::new();

    let source_str = line.get(6..11).unwrap_or("").trim();
    let source_serial: i32 = match source_str.parse() {
        Ok(s) => s,
        Err(_) => return bonds,
    };
    let source_idx = match serial_to_index.get(&source_serial) {
        Some(&idx) => idx,
        None => return bonds,
    };

    // Up to 4 bonded atoms per CONECT record (columns 11-31, 5 chars each)
    for col_start in (11..31).step_by(5) {
        if col_start + 5 > line.len() {
            break;
        }
        let target_str = line[col_start..col_start + 5].trim();
        if target_str.is_empty() {
            continue;
        }
        let target_serial: i32 = match target_str.parse() {
            Ok(s) => s,
            Err(_) => continue,
        };
        let target_idx = match serial_to_index.get(&target_serial) {
            Some(&idx) => idx,
            None => continue,
        };

        let a = source_idx.min(target_idx) as u32;
        let b = source_idx.max(target_idx) as u32;
        bonds.push((a, b));
    }

    bonds
}

/// Parse a PDB file text into structured data.
pub fn parse(text: &str) -> Result<ParsedStructure, String> {
    let mut box_matrix: Option<[f32; 9]> = None;
    let mut serial_to_index: HashMap<i32, usize> = HashMap::new();
    let mut conect_bonds: Vec<(u32, u32)> = Vec::new();

    let mut all_models: Vec<Vec<Atom>> = Vec::new();
    let mut current_model: Vec<Atom> = Vec::new();
    let mut has_model_record = false;
    let mut model_count: usize = 0;

    for line in text.lines() {
        let record = if line.len() >= 6 { line[..6].trim_end() } else { line.trim_end() };

        match record {
            "MODEL" => {
                has_model_record = true;
                current_model = Vec::new();
            }
            "ENDMDL" => {
                all_models.push(std::mem::take(&mut current_model));
                model_count += 1;
            }
            "CRYST1" => {
                if box_matrix.is_none() {
                    box_matrix = parse_cryst1(line);
                }
            }
            "ATOM" | "HETATM" => {
                if let Some((serial, atom)) = parse_atom_line(line) {
                    // Build serial→index map from first model only
                    if !has_model_record || model_count == 0 {
                        serial_to_index.insert(serial, current_model.len());
                    }
                    current_model.push(atom);
                }
            }
            "CONECT" => {
                let bonds = parse_conect_line(line, &serial_to_index);
                conect_bonds.extend(bonds);
            }
            _ => {}
        }
    }

    // If no MODEL/ENDMDL, treat all atoms as a single model
    if !has_model_record && !current_model.is_empty() {
        all_models.push(current_model);
    }

    if all_models.is_empty() || all_models[0].is_empty() {
        return Err("PDB file contains no ATOM or HETATM records".to_string());
    }

    let first_model = &all_models[0];
    let n_atoms = first_model.len();

    // Build positions and elements from first model
    let mut positions = Vec::with_capacity(n_atoms * 3);
    let mut elements = Vec::with_capacity(n_atoms);
    for atom in first_model {
        positions.push(atom.x);
        positions.push(atom.y);
        positions.push(atom.z);
        elements.push(atom.element);
    }

    // Deduplicate CONECT bonds
    let mut bond_set: HashSet<(u32, u32)> = HashSet::new();
    let mut unique_bonds: Vec<(u32, u32)> = Vec::new();
    for (a, b) in &conect_bonds {
        if bond_set.insert((*a, *b)) {
            unique_bonds.push((*a, *b));
        }
    }
    let n_file_bonds = unique_bonds.len();

    // Infer bonds using cell-list spatial search
    let inferred = crate::bonds::infer_bonds(&positions, &elements, n_atoms, &bond_set);
    unique_bonds.extend(inferred);

    // Build frame positions from additional models
    let mut frame_positions: Vec<Vec<f32>> = Vec::new();
    for model in all_models.iter().skip(1) {
        if model.len() != n_atoms {
            continue; // Skip models with different atom counts
        }
        let mut frame_pos = Vec::with_capacity(n_atoms * 3);
        for atom in model {
            frame_pos.push(atom.x);
            frame_pos.push(atom.y);
            frame_pos.push(atom.z);
        }
        frame_positions.push(frame_pos);
    }

    Ok(ParsedStructure {
        n_atoms,
        positions,
        elements,
        bonds: unique_bonds,
        n_file_bonds,
        bond_orders: None,
        box_matrix,
        frame_positions,
    })
}
