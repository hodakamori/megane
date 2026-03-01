/// XYZ text format parser.
///
/// Format (repeating blocks for multi-frame):
///   Line 1: number of atoms
///   Line 2: comment
///   Lines 3..n+2: element x y z (Angstrom)

use std::collections::HashSet;
use crate::bonds;
use crate::parser::symbol_to_atomic_num;

pub struct XyzData {
    pub n_atoms: usize,
    pub positions: Vec<f32>,
    pub elements: Vec<u8>,
    pub bonds: Vec<(u32, u32)>,
    pub frame_positions: Vec<Vec<f32>>,
}

pub fn parse(text: &str) -> Result<XyzData, String> {
    let lines: Vec<&str> = text.lines().collect();
    if lines.len() < 3 {
        return Err("XYZ file too short".into());
    }

    let mut offset = 0;
    let mut first_positions: Option<Vec<f32>> = None;
    let mut first_elements: Option<Vec<u8>> = None;
    let mut first_n_atoms = 0usize;
    let mut frame_positions: Vec<Vec<f32>> = Vec::new();

    while offset < lines.len() {
        // Line 1: atom count
        let count_line = lines[offset].trim();
        if count_line.is_empty() {
            offset += 1;
            continue;
        }
        let n_atoms: usize = count_line
            .parse()
            .map_err(|_| format!("cannot parse atom count at line {}", offset + 1))?;

        if offset + 2 + n_atoms > lines.len() {
            break; // incomplete frame, skip
        }

        // Line 2: comment (skip)
        offset += 2;

        let mut positions = Vec::with_capacity(n_atoms * 3);
        let mut elements = Vec::with_capacity(n_atoms);

        for i in 0..n_atoms {
            let line = lines[offset + i];
            let parts: Vec<&str> = line.split_whitespace().collect();
            if parts.len() < 4 {
                return Err(format!("XYZ atom line {} too short", offset + i + 1));
            }

            // Element symbol
            let sym = capitalize_symbol(parts[0]);
            elements.push(symbol_to_atomic_num(&sym));

            // Coordinates (already in Angstrom)
            let x: f32 = parts[1]
                .parse()
                .map_err(|_| format!("bad x coord at line {}", offset + i + 1))?;
            let y: f32 = parts[2]
                .parse()
                .map_err(|_| format!("bad y coord at line {}", offset + i + 1))?;
            let z: f32 = parts[3]
                .parse()
                .map_err(|_| format!("bad z coord at line {}", offset + i + 1))?;

            positions.push(x);
            positions.push(y);
            positions.push(z);
        }

        offset += n_atoms;

        if first_positions.is_none() {
            first_n_atoms = n_atoms;
            first_positions = Some(positions);
            first_elements = Some(elements);
        } else if n_atoms == first_n_atoms {
            frame_positions.push(positions);
        }
    }

    let positions = first_positions.ok_or("XYZ file contains no atoms")?;
    let elements = first_elements.unwrap();

    // Infer bonds from first frame
    let empty_bonds = HashSet::new();
    let bonds = bonds::infer_bonds(&positions, &elements, first_n_atoms, &empty_bonds);

    Ok(XyzData {
        n_atoms: first_n_atoms,
        positions,
        elements,
        bonds,
        frame_positions,
    })
}

/// Capitalize element symbol: first char upper, rest lower.
fn capitalize_symbol(s: &str) -> String {
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
