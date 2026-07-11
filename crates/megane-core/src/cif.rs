/// CIF (Crystallographic Information File) text parser.
///
/// Parses cell parameters (_cell_length_a/b/c, _cell_angle_alpha/beta/gamma)
/// and atom sites (_atom_site loop) with fractional or Cartesian coordinates.
use std::collections::HashSet;

use crate::atomic::{capitalize, symbol_to_atomic_num};
use crate::bonds;
use crate::crystal;
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

/// CIF/mmCIF loop tags whose column holds a symmetry operation string.
const SYMOP_TAGS: [&str; 2] = [
    "_symmetry_equiv_pos_as_xyz",
    "_space_group_symop_operation_xyz",
];

fn is_symop_tag(tag: &str) -> bool {
    SYMOP_TAGS.contains(&tag)
}

/// Strip a single pair of surrounding single/double quotes from a CIF value.
fn strip_quotes(s: &str) -> &str {
    let s = s.trim();
    let b = s.as_bytes();
    if b.len() >= 2
        && ((b[0] == b'\'' && b[b.len() - 1] == b'\'') || (b[0] == b'"' && b[b.len() - 1] == b'"'))
    {
        return &s[1..s.len() - 1];
    }
    s
}

/// Split a `_tag value` line into (tag, value-remainder).
fn split_tag_value(line: &str) -> Option<(&str, &str)> {
    line.trim().split_once(char::is_whitespace)
}

/// Extract the symop field from a single data row of a symmetry loop.
fn extract_symop_field(line: &str, col: usize, col_count: usize) -> Option<String> {
    let line = line.trim();
    // Single-column loop: the entire (possibly quoted) line is the symop.
    if col_count == 1 {
        let v = strip_quotes(line);
        return (!v.is_empty()).then(|| v.to_string());
    }
    let fields: Vec<&str> = line.split_whitespace().collect();
    if fields.len() < col_count {
        // Quoted symop containing spaces desynced the column count — fall back
        // to the first token that looks like an `x,y,z` operation.
        return fields
            .iter()
            .find(|f| f.contains(','))
            .map(|f| strip_quotes(f).to_string());
    }
    fields.get(col).map(|f| strip_quotes(f).to_string())
}

/// Extract crystallographic symmetry operations from CIF/mmCIF text.
///
/// Recognizes both the loop form (`loop_ _symmetry_equiv_pos_as_xyz ...`) with
/// an optional id column, and the single key-value form
/// (`_symmetry_equiv_pos_as_xyz 'x,y,z'`). Returns the raw operation strings
/// (e.g. `"-x+1/2,y+1/2,-z"`) without applying them.
pub fn extract_symmetry_ops(text: &str) -> Vec<String> {
    let lines: Vec<&str> = text.lines().collect();
    let mut ops: Vec<String> = Vec::new();
    let mut i = 0;
    while i < lines.len() {
        let trimmed = lines[i].trim();
        if trimmed == "loop_" {
            i += 1;
            // Read loop header tags (tolerate blank/comment lines).
            let mut tags: Vec<String> = Vec::new();
            while i < lines.len() {
                let t = lines[i].trim();
                if t.is_empty() || t.starts_with('#') {
                    i += 1;
                    continue;
                }
                if t.starts_with('_') {
                    tags.push(t.to_ascii_lowercase());
                    i += 1;
                } else {
                    break;
                }
            }
            if let Some(col) = tags.iter().position(|t| is_symop_tag(t)) {
                let col_count = tags.len();
                while i < lines.len() {
                    let t = lines[i].trim();
                    if t.is_empty() || t.starts_with('#') {
                        i += 1;
                        continue;
                    }
                    if t.starts_with("loop_")
                        || t.starts_with("data_")
                        || t.starts_with("save_")
                        || t.starts_with("global_")
                        || t.starts_with('_')
                    {
                        break;
                    }
                    if let Some(op) = extract_symop_field(t, col, col_count) {
                        ops.push(op);
                    }
                    i += 1;
                }
            }
            // `i` already advanced past this loop's header/data; keep scanning.
        } else {
            if trimmed.starts_with('_') {
                if let Some((tag, rest)) = split_tag_value(trimmed) {
                    if is_symop_tag(&tag.to_ascii_lowercase()) {
                        let v = strip_quotes(rest.trim());
                        if !v.is_empty() {
                            ops.push(v.to_string());
                        }
                    }
                }
            }
            i += 1;
        }
    }
    ops
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

            // Read loop header tags. Tolerate blank lines and `#` comment
            // lines between `loop_` and the first tag, and between tags.
            while i < lines.len() {
                let t = lines[i].trim();
                if t.is_empty() || t.starts_with('#') {
                    i += 1;
                    continue;
                }
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

            // Read data rows. Per CIF semantics a loop's data is only
            // terminated by EOF or the next reserved word (`loop_`,
            // `data_`, `save_`, `global_`, `_tag`). Blank lines and `#`
            // comment lines must be tolerated inside the loop body — many
            // CCDC/COD CIFs put a blank line between the header and the
            // first data row (see Issue #458).
            while i < lines.len() {
                let t = lines[i].trim();
                if t.is_empty() || t.starts_with('#') {
                    i += 1;
                    continue;
                }
                if t.starts_with("loop_")
                    || t.starts_with("data_")
                    || t.starts_with("save_")
                    || t.starts_with("global_")
                    || t.starts_with('_')
                {
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

    // Make molecules whole before inferring bonds. CIFs frequently list every
    // atom wrapped into the [0,1) cell, which splits a molecule that straddles
    // a face; since bond inference is not periodic, the cross-boundary bonds
    // would otherwise be dropped (Issue #558). Unwrapping is a no-op when the
    // asymmetric unit is already contiguous.
    if let Some(bm) = box_matrix.as_ref() {
        bonds::unwrap_molecules(&mut positions, &elements, bm);
    }

    // Infer bonds on the (now whole) asymmetric unit.
    let empty_bonds = HashSet::new();
    let bonds = bonds::infer_bonds(&positions, &elements, n_atoms, &empty_bonds);

    let labels = if atom_labels.iter().any(|l| !l.is_empty()) {
        Some(atom_labels)
    } else {
        None
    };

    // Apply space-group symmetry to fill the unit cell (VESTA-style packing).
    // A CIF lists only the asymmetric unit; expansion is the standard way to
    // recover the full cell. No-op for CIFs without (non-identity) operations.
    let symmetry_ops = extract_symmetry_ops(text);
    let (positions, elements, bonds, labels) = match box_matrix.as_ref().and_then(|bm| {
        crystal::expand_symmetry(
            &positions,
            &elements,
            &bonds,
            labels.as_deref(),
            bm,
            &symmetry_ops,
        )
    }) {
        Some((p, e, b, l)) => (p, e, b, l),
        None => (positions, elements, bonds, labels),
    };
    let n_atoms = elements.len();

    Ok(ParsedStructure {
        n_atoms,
        positions,
        elements,
        bonds,
        n_file_bonds: 0,
        bond_orders: None,
        box_matrix,
        frame_positions_flat: Vec::new(),
        atom_labels: labels,
        chain_ids: None,
        bfactors: None,
        vector_channels: vec![],
        ca_indices: vec![],
        ca_chain_ids: vec![],
        ca_res_nums: vec![],
        ca_ss_type: vec![],
        symmetry_ops,
        hetero: None,
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    /// Regression test for Issue #558. `pbc_bond_split.cif` lists a single
    /// molecule wrapped into the cell so the carbonyl oxygen sits on the far
    /// side of the a-face from the carbon. The parser must unwrap the molecule
    /// and recover the C–O bond that non-periodic inference would otherwise drop.
    #[test]
    fn test_parse_recovers_bond_across_periodic_boundary() {
        let text = std::fs::read_to_string(concat!(
            env!("CARGO_MANIFEST_DIR"),
            "/../../tests/fixtures/pbc_bond_split.cif"
        ))
        .expect("read fixture");
        let s = parse(&text).unwrap();
        assert_eq!(s.n_atoms, 4);
        // C–O (the boundary-crossing bond) plus the two C–H bonds.
        assert_eq!(s.bonds.len(), 3);
        let has = |a: u32, b: u32| s.bonds.contains(&(a, b)) || s.bonds.contains(&(b, a));
        assert!(
            has(0, 1),
            "C–O bond across the periodic boundary must exist"
        );
        assert!(has(0, 2));
        assert!(has(0, 3));
    }

    #[test]
    fn test_extract_symmetry_ops_single_column_loop() {
        let cif = r#"data_x
loop_
_symmetry_equiv_pos_as_xyz
x,y,z
-x,-y,-z
-x+1/2,y+1/2,-z
x+1/2,-y+1/2,z

loop_
_atom_site_label
_atom_site_type_symbol
_atom_site_fract_x
_atom_site_fract_y
_atom_site_fract_z
Na1 Na 0.0 0.0 0.0
"#;
        let ops = extract_symmetry_ops(cif);
        assert_eq!(
            ops,
            vec!["x,y,z", "-x,-y,-z", "-x+1/2,y+1/2,-z", "x+1/2,-y+1/2,z"]
        );
    }

    #[test]
    fn test_extract_symmetry_ops_id_column_and_space_group_tag() {
        let cif = r#"data_x
loop_
_space_group_symop_id
_space_group_symop_operation_xyz
1 x,y,z
2 -x,-y,-z
"#;
        let ops = extract_symmetry_ops(cif);
        assert_eq!(ops, vec!["x,y,z", "-x,-y,-z"]);
    }

    #[test]
    fn test_extract_symmetry_ops_quoted_keyvalue() {
        let cif = "data_x\n_symmetry_equiv_pos_as_xyz 'x,y,z'\n";
        let ops = extract_symmetry_ops(cif);
        assert_eq!(ops, vec!["x,y,z"]);
    }

    #[test]
    fn test_extract_symmetry_ops_double_quoted() {
        // Single-column loop with a double-quoted operation.
        let cif = "data_x\nloop_\n_symmetry_equiv_pos_as_xyz\n\"x,y,z\"\n\"-x,-y,-z\"\n";
        let ops = extract_symmetry_ops(cif);
        assert_eq!(ops, vec!["x,y,z", "-x,-y,-z"]);
    }

    #[test]
    fn test_extract_symmetry_ops_fewer_fields_than_columns() {
        // A multi-column symmetry loop whose data row collapses to a single
        // quoted token (fewer whitespace fields than header tags) exercises the
        // comma-token fallback in extract_symop_field.
        let cif = r#"data_x
loop_
_symmetry_equiv_pos_site_id
_symmetry_equiv_pos_as_xyz
_symmetry_extra_flag
'x,y,z'
'-x,-y,-z'
"#;
        let ops = extract_symmetry_ops(cif);
        assert_eq!(ops, vec!["x,y,z", "-x,-y,-z"]);
    }

    #[test]
    fn test_extract_symmetry_ops_absent() {
        let cif = "data_x\n_cell_length_a 5.0\n";
        assert!(extract_symmetry_ops(cif).is_empty());
    }

    /// The Issue #460 CIF carries the P2_1/a equivalent positions.
    #[test]
    fn test_parse_cif_captures_symmetry_ops() {
        let cif = r#"data_degly19
_cell_length_a 11.156
_cell_length_b 5.8644
_cell_length_c 5.3417
_cell_angle_alpha 90
_cell_angle_beta 125.83
_cell_angle_gamma 90
loop_
_symmetry_equiv_pos_as_xyz
x,y,z
-x,-y,-z
-x+1/2,y+1/2,-z
x+1/2,-y+1/2,z
loop_
_atom_site_label
_atom_site_type_symbol
_atom_site_fract_x
_atom_site_fract_y
_atom_site_fract_z
O1 O 0.7229 0.8423 0.8321
"#;
        let result = parse(cif).expect("parse failed");
        // The single asymmetric-unit atom is expanded by the 4 P2_1/a
        // operations into 4 symmetry-equivalent atoms filling the cell.
        assert_eq!(result.n_atoms, 4);
        assert_eq!(result.symmetry_ops.len(), 4);
        assert_eq!(result.symmetry_ops[2], "-x+1/2,y+1/2,-z");
    }

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

    /// Regression test for Issue #458: CCDC-style CIFs put a blank line
    /// between the `_atom_site_*` loop header and the first data row.
    /// The parser used to break on that blank line and report no atoms.
    #[test]
    fn test_parse_cif_blank_line_before_data() {
        let cif = r#"data_blanks
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
        assert_eq!(result.elements[0], 11);
        assert_eq!(result.elements[1], 17);
    }

    /// Blank lines and comment lines should be tolerated *between* data rows too.
    #[test]
    fn test_parse_cif_blank_and_comment_lines_inside_loop() {
        let cif = r#"data_blanks_mid
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

# spacer comment between data rows
Cl1 Cl 0.5 0.5 0.5
"#;
        let result = parse(cif).expect("parse failed");
        assert_eq!(result.n_atoms, 2);
        assert_eq!(result.elements[0], 11);
        assert_eq!(result.elements[1], 17);
    }

    /// Regression test for Issue #458 against the exact CCDC glycine fixture.
    #[test]
    fn test_parse_glycine_csd_fixture() {
        let text = std::fs::read_to_string(concat!(
            env!("CARGO_MANIFEST_DIR"),
            "/../../tests/fixtures/glycine_csd.cif"
        ))
        .expect("read fixture");
        let result = parse(&text).expect("parse failed");
        // The 10-atom asymmetric unit is symmetry-expanded by the 4 space-group
        // operations into a full unit cell of 4 glycine molecules (40 atoms).
        assert_eq!(result.n_atoms, 40);
        assert!(result.elements.contains(&1)); // H
        assert!(result.elements.contains(&6)); // C
        assert!(result.elements.contains(&7)); // N
        assert!(result.elements.contains(&8)); // O
        let bm = result.box_matrix.expect("box matrix");
        assert!((bm[0] - 5.0999).abs() < 0.01);
        let n_o = result.elements.iter().filter(|&&e| e == 8).count();
        let n_c = result.elements.iter().filter(|&&e| e == 6).count();
        let n_n = result.elements.iter().filter(|&&e| e == 7).count();
        let n_h = result.elements.iter().filter(|&&e| e == 1).count();
        assert_eq!(n_o, 8);
        assert_eq!(n_c, 8);
        assert_eq!(n_n, 4);
        assert_eq!(n_h, 20);
        // First atom O1 fract=(0.30478, 0.09443, 0.23515) → Cartesian non-zero
        assert!(result.positions[0].abs() > 0.1);
        // Labels are tiled across symmetry images; the first image preserves the
        // original asymmetric-unit labels.
        let labels = result.atom_labels.as_ref().expect("labels");
        assert_eq!(labels[0], "O1");
        assert_eq!(labels[9], "H10");
    }
}
