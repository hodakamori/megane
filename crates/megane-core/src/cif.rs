/// CIF (Crystallographic Information File) text parser.
///
/// Parses cell parameters (_cell_length_a/b/c, _cell_angle_alpha/beta/gamma)
/// and atom sites (_atom_site loop) with fractional or Cartesian coordinates.
use std::collections::HashSet;

use crate::atomic::{capitalize, symbol_to_atomic_num};
use crate::bonds;
use crate::parser::{cell_params_to_matrix, ParsedStructure};

/// Strip trailing parenthesized uncertainty from a CIF numeric value.
/// e.g. "5.6402(1)" → "5.6402", "90.000(0)" → "90.000"
fn strip_su(s: &str) -> &str {
    match s.find('(') {
        Some(i) => &s[..i],
        None => s,
    }
}

/// Parse a CIF numeric field, stripping standard uncertainty if present.
fn parse_cif_float(s: &str) -> Option<f32> {
    strip_su(s.trim()).parse().ok()
}

/// Determine column indices from the loop_ header tags.
struct AtomSiteColumns {
    type_symbol: Option<usize>,
    label: Option<usize>,
    fract_x: Option<usize>,
    fract_y: Option<usize>,
    fract_z: Option<usize>,
    cartn_x: Option<usize>,
    cartn_y: Option<usize>,
    cartn_z: Option<usize>,
}

impl AtomSiteColumns {
    fn new() -> Self {
        Self {
            type_symbol: None,
            label: None,
            fract_x: None,
            fract_y: None,
            fract_z: None,
            cartn_x: None,
            cartn_y: None,
            cartn_z: None,
        }
    }

    fn assign(&mut self, idx: usize, tag: &str) {
        let tag_lower = tag.to_ascii_lowercase();
        match tag_lower.as_str() {
            "_atom_site_type_symbol" => self.type_symbol = Some(idx),
            "_atom_site_label" => self.label = Some(idx),
            "_atom_site_fract_x" => self.fract_x = Some(idx),
            "_atom_site_fract_y" => self.fract_y = Some(idx),
            "_atom_site_fract_z" => self.fract_z = Some(idx),
            "_atom_site_cartn_x" => self.cartn_x = Some(idx),
            "_atom_site_cartn_y" => self.cartn_y = Some(idx),
            "_atom_site_cartn_z" => self.cartn_z = Some(idx),
            _ => {}
        }
    }

    fn has_fractional(&self) -> bool {
        self.fract_x.is_some() && self.fract_y.is_some() && self.fract_z.is_some()
    }

    fn has_cartesian(&self) -> bool {
        self.cartn_x.is_some() && self.cartn_y.is_some() && self.cartn_z.is_some()
    }
}

/// Convert fractional coordinates to Cartesian using the cell matrix (row-major 3x3).
/// matrix rows: va, vb, vc
/// Cartesian = frac_a * va + frac_b * vb + frac_c * vc
fn fract_to_cart(fx: f32, fy: f32, fz: f32, matrix: &[f32; 9]) -> (f32, f32, f32) {
    let x = fx * matrix[0] + fy * matrix[3] + fz * matrix[6];
    let y = fx * matrix[1] + fy * matrix[4] + fz * matrix[7];
    let z = fx * matrix[2] + fy * matrix[5] + fz * matrix[8];
    (x, y, z)
}

/// Extract element symbol from a CIF type_symbol or label field.
/// type_symbol may contain charge like "Fe2+" or "O2-"; label may be "Na1", "O2".
fn element_from_symbol(s: &str) -> u8 {
    // Strip charge suffixes like "2+", "3-", "+", "-"
    let cleaned: String = s.chars().take_while(|c| c.is_alphabetic()).collect();
    if cleaned.is_empty() {
        return 0;
    }
    let capitalized = capitalize(&cleaned);
    let z = symbol_to_atomic_num(&capitalized);
    if z > 0 {
        return z;
    }
    // Try first character only
    let first = capitalize(&cleaned[..1]);
    symbol_to_atomic_num(&first)
}

pub fn parse(text: &str) -> Result<ParsedStructure, String> {
    let lines: Vec<&str> = text.lines().collect();

    // --- Parse cell parameters ---
    let mut cell_a: Option<f32> = None;
    let mut cell_b: Option<f32> = None;
    let mut cell_c: Option<f32> = None;
    let mut cell_alpha: Option<f32> = None;
    let mut cell_beta: Option<f32> = None;
    let mut cell_gamma: Option<f32> = None;

    // First pass: extract cell parameters (simple key-value lines)
    for line in &lines {
        let trimmed = line.trim();
        if trimmed.starts_with('_') {
            let parts: Vec<&str> = trimmed.split_whitespace().collect();
            if parts.len() >= 2 {
                let tag = parts[0].to_ascii_lowercase();
                let val = parts[1];
                match tag.as_str() {
                    "_cell_length_a" => cell_a = parse_cif_float(val),
                    "_cell_length_b" => cell_b = parse_cif_float(val),
                    "_cell_length_c" => cell_c = parse_cif_float(val),
                    "_cell_angle_alpha" => cell_alpha = parse_cif_float(val),
                    "_cell_angle_beta" => cell_beta = parse_cif_float(val),
                    "_cell_angle_gamma" => cell_gamma = parse_cif_float(val),
                    _ => {}
                }
            }
        }
    }

    let box_matrix = match (cell_a, cell_b, cell_c, cell_alpha, cell_beta, cell_gamma) {
        (Some(a), Some(b), Some(c), Some(alpha), Some(beta), Some(gamma))
            if a > 0.0 && b > 0.0 && c > 0.0 =>
        {
            Some(cell_params_to_matrix(a, b, c, alpha, beta, gamma))
        }
        _ => None,
    };

    // --- Parse atom_site loop ---
    let mut positions: Vec<f32> = Vec::new();
    let mut elements: Vec<u8> = Vec::new();
    let mut atom_labels: Vec<String> = Vec::new();

    let mut i = 0;
    while i < lines.len() {
        let trimmed = lines[i].trim();

        // Look for loop_ that contains _atom_site tags
        if trimmed == "loop_" {
            i += 1;
            let mut cols = AtomSiteColumns::new();
            let mut col_count = 0;
            let mut is_atom_site_loop = false;

            // Read loop header tags
            while i < lines.len() {
                let t = lines[i].trim();
                if t.starts_with('_') {
                    if t.to_ascii_lowercase().starts_with("_atom_site") {
                        is_atom_site_loop = true;
                        cols.assign(col_count, t);
                    }
                    col_count += 1;
                    i += 1;
                } else {
                    break;
                }
            }

            if !is_atom_site_loop || col_count == 0 {
                continue;
            }

            let use_fractional = cols.has_fractional() && box_matrix.is_some();
            let use_cartesian = cols.has_cartesian();

            if !use_fractional && !use_cartesian {
                i += 1;
                continue;
            }

            // Read data rows
            while i < lines.len() {
                let t = lines[i].trim();
                // Stop at empty line, another loop_, data_ block, or tag
                if t.is_empty()
                    || t.starts_with("loop_")
                    || t.starts_with("data_")
                    || t.starts_with('#')
                {
                    break;
                }
                // Also stop if line starts with _ (new tag outside loop)
                if t.starts_with('_') {
                    break;
                }

                let fields: Vec<&str> = t.split_whitespace().collect();
                if fields.len() < col_count {
                    i += 1;
                    continue;
                }

                // Extract coordinates first to avoid desyncing
                // elements/atom_labels from positions on missing coords
                let coords = if let (true, Some(fx_col), Some(fy_col), Some(fz_col), Some(bm)) = (
                    use_fractional,
                    cols.fract_x,
                    cols.fract_y,
                    cols.fract_z,
                    box_matrix.as_ref(),
                ) {
                    let fx = parse_cif_float(fields[fx_col]).unwrap_or(0.0);
                    let fy = parse_cif_float(fields[fy_col]).unwrap_or(0.0);
                    let fz = parse_cif_float(fields[fz_col]).unwrap_or(0.0);
                    Some(fract_to_cart(fx, fy, fz, bm))
                } else if let (Some(cx), Some(cy), Some(cz)) =
                    (cols.cartn_x, cols.cartn_y, cols.cartn_z)
                {
                    let x = parse_cif_float(fields[cx]).unwrap_or(0.0);
                    let y = parse_cif_float(fields[cy]).unwrap_or(0.0);
                    let z = parse_cif_float(fields[cz]).unwrap_or(0.0);
                    Some((x, y, z))
                } else {
                    None
                };

                let (x, y, z) = match coords {
                    Some(c) => c,
                    None => {
                        i += 1;
                        continue;
                    }
                };

                // Extract element
                let elem = if let Some(ci) = cols.type_symbol {
                    element_from_symbol(fields[ci])
                } else if let Some(ci) = cols.label {
                    element_from_symbol(fields[ci])
                } else {
                    0
                };
                elements.push(elem);

                // Extract label
                let label = if let Some(ci) = cols.label {
                    fields[ci].to_string()
                } else {
                    String::new()
                };
                atom_labels.push(label);

                positions.push(x);
                positions.push(y);
                positions.push(z);

                i += 1;
            }

            // Only parse the first atom_site loop
            if !elements.is_empty() {
                break;
            }
        } else {
            i += 1;
        }
    }

    let n_atoms = elements.len();
    if n_atoms == 0 {
        return Err("CIF file contains no atom sites".to_string());
    }

    // Infer bonds
    let empty_bonds = HashSet::new();
    let bonds = bonds::infer_bonds(&positions, &elements, n_atoms, &empty_bonds);

    let labels = if atom_labels.iter().any(|l| !l.is_empty()) {
        Some(atom_labels)
    } else {
        None
    };

    Ok(ParsedStructure {
        n_atoms,
        positions,
        elements,
        bonds,
        n_file_bonds: 0,
        bond_orders: None,
        box_matrix,
        frame_positions: Vec::new(),
        atom_labels: labels,
        chain_ids: vec![],
        bfactors: vec![],
        vector_channels: vec![],
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_strip_su() {
        assert_eq!(strip_su("5.6402(1)"), "5.6402");
        assert_eq!(strip_su("90.000"), "90.000");
        assert_eq!(strip_su("1.234(56)"), "1.234");
    }

    #[test]
    fn test_element_from_symbol() {
        assert_eq!(element_from_symbol("Na"), 11);
        assert_eq!(element_from_symbol("Cl"), 17);
        assert_eq!(element_from_symbol("Fe2+"), 26);
        assert_eq!(element_from_symbol("O2-"), 8);
        assert_eq!(element_from_symbol("Si"), 14);
        assert_eq!(element_from_symbol("Na1"), 11);
    }

    #[test]
    fn test_fract_to_cart_cubic() {
        // Simple cubic cell: a=b=c=10, alpha=beta=gamma=90
        let matrix = cell_params_to_matrix(10.0, 10.0, 10.0, 90.0, 90.0, 90.0);
        let (x, y, z) = fract_to_cart(0.5, 0.5, 0.5, &matrix);
        assert!((x - 5.0).abs() < 1e-3);
        assert!((y - 5.0).abs() < 1e-3);
        assert!((z - 5.0).abs() < 1e-3);
    }

    #[test]
    fn test_parse_nacl_cif() {
        let cif = r#"data_NaCl
_cell_length_a   5.6402
_cell_length_b   5.6402
_cell_length_c   5.6402
_cell_angle_alpha   90.000
_cell_angle_beta    90.000
_cell_angle_gamma   90.000

loop_
_atom_site_label
_atom_site_type_symbol
_atom_site_fract_x
_atom_site_fract_y
_atom_site_fract_z
Na1 Na 0.0 0.0 0.0
Cl1 Cl 0.5 0.5 0.5
"#;
        let result = parse(cif).expect("parse failed");
        assert_eq!(result.n_atoms, 2);
        assert_eq!(result.elements[0], 11); // Na
        assert_eq!(result.elements[1], 17); // Cl
        assert!(result.box_matrix.is_some());
        let bm = result.box_matrix.unwrap();
        assert!((bm[0] - 5.6402).abs() < 0.01);
        // Na at origin
        assert!(result.positions[0].abs() < 0.01);
        assert!(result.positions[1].abs() < 0.01);
        assert!(result.positions[2].abs() < 0.01);
        // Cl at (0.5, 0.5, 0.5) → ~(2.82, 2.82, 2.82)
        assert!((result.positions[3] - 2.82).abs() < 0.1);
    }

    #[test]
    fn test_parse_cif_with_su() {
        let cif = r#"data_test
_cell_length_a   5.6402(1)
_cell_length_b   5.6402(1)
_cell_length_c   5.6402(1)
_cell_angle_alpha   90.000(0)
_cell_angle_beta    90.000(0)
_cell_angle_gamma   90.000(0)

loop_
_atom_site_label
_atom_site_type_symbol
_atom_site_fract_x
_atom_site_fract_y
_atom_site_fract_z
Na1 Na 0.0 0.0 0.0
"#;
        let result = parse(cif).expect("parse failed");
        assert_eq!(result.n_atoms, 1);
        let bm = result.box_matrix.unwrap();
        assert!((bm[0] - 5.6402).abs() < 0.01);
    }

    #[test]
    fn test_parse_cif_cartesian() {
        let cif = r#"data_test
loop_
_atom_site_label
_atom_site_type_symbol
_atom_site_Cartn_x
_atom_site_Cartn_y
_atom_site_Cartn_z
O1 O 1.0 2.0 3.0
H1 H 1.5 2.5 3.5
"#;
        let result = parse(cif).expect("parse failed");
        assert_eq!(result.n_atoms, 2);
        assert_eq!(result.elements[0], 8); // O
        assert_eq!(result.elements[1], 1); // H
        assert!((result.positions[0] - 1.0).abs() < 1e-5);
        assert!((result.positions[1] - 2.0).abs() < 1e-5);
        assert!((result.positions[2] - 3.0).abs() < 1e-5);
        assert!(result.box_matrix.is_none());
    }

    #[test]
    fn test_parse_empty_cif_errors() {
        let result = parse("data_empty\n");
        assert!(result.is_err());
    }

    #[test]
    fn test_parse_cif_fixture() {
        let text = std::fs::read_to_string(concat!(
            env!("CARGO_MANIFEST_DIR"),
            "/../../tests/fixtures/nacl.cif"
        ))
        .expect("read fixture");
        let result = parse(&text).expect("parse failed");
        assert_eq!(result.n_atoms, 8);
        assert!(result.elements.contains(&11)); // Na
        assert!(result.elements.contains(&17)); // Cl
        assert!(result.box_matrix.is_some());
    }
}
