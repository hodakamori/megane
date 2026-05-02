use crate::bonds;
use crate::parser::symbol_to_atomic_num;
/// XYZ text format parser.
///
/// Format (repeating blocks for multi-frame):
///   Line 1: number of atoms
///   Line 2: comment
///   Lines 3..n+2: element x y z [extra_fields...] (Angstrom)
use std::collections::HashSet;

/// Parse `Lattice="ax ay az bx by bz cx cy cz"` from an extended XYZ comment line.
fn parse_lattice(comment: &str) -> Option<[f32; 9]> {
    let idx = comment.find("Lattice=")?;
    let rest = &comment[idx + 8..];
    let quote_char = rest.chars().next()?;
    if quote_char != '"' && quote_char != '\'' {
        return None;
    }
    let inner_start = quote_char.len_utf8();
    let inner_end = rest[inner_start..].find(quote_char)?;
    let inner = &rest[inner_start..inner_start + inner_end];
    let vals: Vec<f32> = inner
        .split_whitespace()
        .filter_map(|s| s.parse().ok())
        .collect();
    if vals.len() == 9 {
        let mut m = [0.0f32; 9];
        m.copy_from_slice(&vals);
        Some(m)
    } else {
        None
    }
}

pub fn parse(text: &str) -> Result<crate::parser::ParsedStructure, String> {
    let lines: Vec<&str> = text.lines().collect();
    if lines.len() < 3 {
        return Err("XYZ file too short".into());
    }

    let mut offset = 0;
    let mut first_positions: Option<Vec<f32>> = None;
    let mut first_elements: Option<Vec<u8>> = None;
    let mut first_labels: Option<Vec<String>> = None;
    let mut first_n_atoms = 0usize;
    let mut frame_positions: Vec<Vec<f32>> = Vec::new();
    let mut box_matrix: Option<[f32; 9]> = None;

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

        // Line 2: comment — parse lattice if present
        let comment_line = lines[offset + 1];
        if box_matrix.is_none() {
            box_matrix = parse_lattice(comment_line);
        }
        offset += 2;

        let mut positions = Vec::with_capacity(n_atoms * 3);
        let mut elements = Vec::with_capacity(n_atoms);
        let mut labels = Vec::with_capacity(n_atoms);

        for i in 0..n_atoms {
            let line = lines[offset + i];
            let parts: Vec<&str> = line.split_whitespace().collect();
            if parts.len() < 4 {
                return Err(format!("XYZ atom line {} too short", offset + i + 1));
            }

            // Element symbol
            let sym = crate::parser::capitalize(parts[0]);
            elements.push(symbol_to_atomic_num(&sym));

            // Extra fields after x y z as label
            let label = if parts.len() > 4 {
                parts[4..].join(" ")
            } else {
                String::new()
            };
            labels.push(label);

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
            first_labels = Some(labels);
        } else if n_atoms == first_n_atoms {
            frame_positions.push(positions);
        }
    }

    let positions = first_positions.ok_or("XYZ file contains no atoms")?;
    // SAFETY: first_elements is always set when first_positions is set
    let elements = first_elements.ok_or("XYZ file contains no atoms")?;

    // Infer bonds from first frame
    let empty_bonds = HashSet::new();
    let bonds = bonds::infer_bonds(&positions, &elements, first_n_atoms, &empty_bonds);

    let atom_labels = first_labels.and_then(|labels| {
        if labels.iter().any(|l| !l.is_empty()) {
            Some(labels)
        } else {
            None
        }
    });

    Ok(crate::parser::ParsedStructure {
        n_atoms: first_n_atoms,
        positions,
        elements,
        bonds,
        n_file_bonds: 0,
        bond_orders: None,
        box_matrix,
        frame_positions,
        atom_labels,
        chain_ids: None,
        b_factors: None,
        vector_channels: vec![],
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_parse_lattice_double_quotes() {
        let comment = r#"Lattice="5.44 0.0 0.0 0.0 5.44 0.0 0.0 0.0 5.44""#;
        let m = parse_lattice(comment).unwrap();
        assert!((m[0] - 5.44).abs() < 1e-5);
        assert!((m[4] - 5.44).abs() < 1e-5);
        assert!((m[8] - 5.44).abs() < 1e-5);
        assert!((m[1]).abs() < 1e-5);
    }

    #[test]
    fn test_parse_lattice_single_quotes() {
        let comment = "Lattice='10.0 0.0 0.0 0.0 10.0 0.0 0.0 0.0 10.0'";
        let m = parse_lattice(comment).unwrap();
        assert!((m[0] - 10.0).abs() < 1e-5);
    }

    #[test]
    fn test_parse_lattice_with_other_keys() {
        let comment = r#"Lattice="5.44 0.0 0.0 0.0 5.44 0.0 0.0 0.0 5.44" Properties=species:S:1:pos:R:3 pbc="T T T""#;
        let m = parse_lattice(comment).unwrap();
        assert!((m[0] - 5.44).abs() < 1e-5);
        assert!((m[8] - 5.44).abs() < 1e-5);
    }

    #[test]
    fn test_parse_lattice_missing() {
        assert!(parse_lattice("just a comment").is_none());
        assert!(parse_lattice("").is_none());
    }

    #[test]
    fn test_parse_lattice_incomplete() {
        let comment = r#"Lattice="1.0 2.0 3.0""#;
        assert!(parse_lattice(comment).is_none());
    }

    #[test]
    fn test_parse_xyz_with_lattice() {
        let xyz = r#"2
Lattice="10.0 0.0 0.0 0.0 10.0 0.0 0.0 0.0 10.0"
H 0.0 0.0 0.0
O 1.0 0.0 0.0
"#;
        let result = parse(xyz).expect("parse failed");
        assert_eq!(result.n_atoms, 2);
        let bm = result.box_matrix.expect("box_matrix should be Some");
        assert!((bm[0] - 10.0).abs() < 1e-5);
        assert!((bm[4] - 10.0).abs() < 1e-5);
        assert!((bm[8] - 10.0).abs() < 1e-5);
    }

    #[test]
    fn test_parse_xyz_without_lattice() {
        let xyz = "2\nwater molecule\nH 0.0 0.0 0.0\nO 1.0 0.0 0.0\n";
        let result = parse(xyz).expect("parse failed");
        assert!(result.box_matrix.is_none());
    }

    #[test]
    fn test_parse_xyz_fixture() {
        let text = std::fs::read_to_string(concat!(
            env!("CARGO_MANIFEST_DIR"),
            "/../../tests/fixtures/si_diamond.xyz"
        ))
        .expect("read fixture");
        let result = parse(&text).expect("parse failed");
        assert_eq!(result.n_atoms, 8);
        assert!(result.elements.iter().all(|&e| e == 14)); // Si = 14
        let bm = result.box_matrix.expect("box_matrix should be Some");
        assert!((bm[0] - 5.44).abs() < 1e-5);
        assert!((bm[4] - 5.44).abs() < 1e-5);
        assert!((bm[8] - 5.44).abs() < 1e-5);
    }
}
