/// GROMACS GRO text format parser.
///
/// Format:
///   Line 1: title / comment
///   Line 2: number of atoms
///   Lines 3..n+2: fixed-width atom records
///     columns 1-5:  residue number
///     columns 6-10: residue name
///     columns 11-15: atom name
///     columns 16-20: atom number
///     columns 21-28: x (nm)
///     columns 29-36: y (nm)
///     columns 37-44: z (nm)
///   Last line: box vectors (v1x v2y v3z [v1y v1z v2x v2z v3x v3y])

use std::collections::HashSet;
use crate::bonds;
use crate::parser::symbol_to_atomic_num;

/// Guess atomic number from GRO atom name (e.g. "CA", "OW", "HW1").
fn element_from_atom_name(name: &str) -> u8 {
    let name = name.trim();
    if name.is_empty() {
        return 0;
    }

    // Try first non-digit character(s) as element symbol
    let clean: String = name.chars().filter(|c| c.is_alphabetic()).collect();
    if clean.is_empty() {
        return 0;
    }

    // Try two-char symbol first (e.g. "CL", "BR", "FE")
    if clean.len() >= 2 {
        let two = format!(
            "{}{}",
            clean.chars().next().unwrap().to_uppercase().next().unwrap(),
            clean.chars().nth(1).unwrap().to_lowercase().next().unwrap()
        );
        let num = symbol_to_atomic_num(&two);
        if num != 0 {
            return num;
        }
    }

    // Fall back to single-char
    let one = clean.chars().next().unwrap().to_uppercase().next().unwrap().to_string();
    symbol_to_atomic_num(&one)
}

pub fn parse(text: &str) -> Result<crate::parser::ParsedStructure, String> {
    let lines: Vec<&str> = text.lines().collect();
    if lines.len() < 3 {
        return Err("GRO file too short".into());
    }

    // Line 2: atom count
    let n_atoms: usize = lines[1]
        .trim()
        .parse()
        .map_err(|_| "cannot parse atom count in GRO")?;

    if lines.len() < n_atoms + 3 {
        return Err(format!(
            "GRO file has {} lines but expected at least {}",
            lines.len(),
            n_atoms + 3
        ));
    }

    let mut positions = Vec::with_capacity(n_atoms * 3);
    let mut elements = Vec::with_capacity(n_atoms);

    for i in 0..n_atoms {
        let line = lines[i + 2];
        if line.len() < 44 {
            return Err(format!("GRO atom line {} too short", i + 1));
        }

        // Atom name: columns 11-15 (0-indexed: 10..15)
        let atom_name = if line.len() >= 15 { &line[10..15] } else { "" };
        elements.push(element_from_atom_name(atom_name));

        // Positions in nm → Angstrom (×10)
        let x: f32 = line[20..28]
            .trim()
            .parse()
            .map_err(|_| format!("bad x coord at atom {}", i + 1))?;
        let y: f32 = line[28..36]
            .trim()
            .parse()
            .map_err(|_| format!("bad y coord at atom {}", i + 1))?;
        let z: f32 = line[36..44]
            .trim()
            .parse()
            .map_err(|_| format!("bad z coord at atom {}", i + 1))?;

        positions.push(x * 10.0);
        positions.push(y * 10.0);
        positions.push(z * 10.0);
    }

    // Last line: box vectors
    let box_line = lines[n_atoms + 2].trim();
    let box_matrix = parse_box_line(box_line);

    // Infer bonds
    let empty_bonds = HashSet::new();
    let bonds = bonds::infer_bonds(&positions, &elements, n_atoms, &empty_bonds);

    Ok(crate::parser::ParsedStructure {
        n_atoms,
        positions,
        elements,
        bonds,
        n_file_bonds: 0,
        bond_orders: None,
        box_matrix,
        frame_positions: Vec::new(),
    })
}

fn parse_box_line(line: &str) -> Option<[f32; 9]> {
    let vals: Vec<f32> = line
        .split_whitespace()
        .filter_map(|s| s.parse().ok())
        .collect();

    if vals.len() >= 3 {
        // nm → Angstrom
        let mut m = [0.0f32; 9];
        m[0] = vals[0] * 10.0; // v1x
        m[4] = vals[1] * 10.0; // v2y
        m[8] = vals[2] * 10.0; // v3z
        if vals.len() >= 9 {
            m[1] = vals[3] * 10.0; // v1y
            m[2] = vals[4] * 10.0; // v1z
            m[3] = vals[5] * 10.0; // v2x
            m[5] = vals[6] * 10.0; // v2z
            m[6] = vals[7] * 10.0; // v3x
            m[7] = vals[8] * 10.0; // v3y
        }
        Some(m)
    } else {
        None
    }
}
