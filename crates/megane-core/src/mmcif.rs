/// mmCIF (PDBx/macromolecular CIF) text parser.
///
/// Handles the dot-notation tag scheme used by the PDB: `_atom_site.Cartn_x`
/// rather than the underscore-separated scheme of small-molecule CIF
/// (`_atom_site_Cartn_x`).  Extracts Cartesian coordinates, element symbols,
/// atom names, chain IDs, B-factors, and Cα backbone data for cartoon rendering.
use std::collections::HashSet;

use crate::atomic::{capitalize, symbol_to_atomic_num};
use crate::bonds;
use crate::parser::{cell_params_to_matrix, ParsedStructure};

// ---------------------------------------------------------------------------
// Detection
// ---------------------------------------------------------------------------

/// Return `true` when `text` looks like an mmCIF file.
///
/// Heuristic: the first 500 lines are scanned for `_atom_site.` (dot-notation)
/// or `_entry.id`, both of which are unique to the PDBx/mmCIF dictionary.
pub fn is_mmcif(text: &str) -> bool {
    for line in text.lines().take(500) {
        let t = line.trim();
        if t.starts_with('_') {
            let lower = t.to_ascii_lowercase();
            if lower.starts_with("_atom_site.")
                || lower.starts_with("_entry.id")
                || lower.starts_with("_struct.entry_id")
            {
                return true;
            }
        }
    }
    false
}

// ---------------------------------------------------------------------------
// Loop column tracking
// ---------------------------------------------------------------------------

/// Column indices for the `_atom_site` loop in mmCIF format.
struct AtomSiteColumns {
    group_pdb: Option<usize>,
    type_symbol: Option<usize>,
    label_atom_id: Option<usize>,
    label_asym_id: Option<usize>,
    auth_asym_id: Option<usize>,
    label_seq_id: Option<usize>,
    auth_seq_id: Option<usize>,
    cartn_x: Option<usize>,
    cartn_y: Option<usize>,
    cartn_z: Option<usize>,
    b_iso: Option<usize>,
    model_num: Option<usize>,
}

impl AtomSiteColumns {
    fn new() -> Self {
        Self {
            group_pdb: None,
            type_symbol: None,
            label_atom_id: None,
            label_asym_id: None,
            auth_asym_id: None,
            label_seq_id: None,
            auth_seq_id: None,
            cartn_x: None,
            cartn_y: None,
            cartn_z: None,
            b_iso: None,
            model_num: None,
        }
    }

    fn assign(&mut self, idx: usize, tag: &str) {
        let t = tag.to_ascii_lowercase();
        match t.as_str() {
            "_atom_site.group_pdb" => self.group_pdb = Some(idx),
            "_atom_site.type_symbol" => self.type_symbol = Some(idx),
            "_atom_site.label_atom_id" => self.label_atom_id = Some(idx),
            "_atom_site.label_asym_id" => self.label_asym_id = Some(idx),
            "_atom_site.auth_asym_id" => self.auth_asym_id = Some(idx),
            "_atom_site.label_seq_id" => self.label_seq_id = Some(idx),
            "_atom_site.auth_seq_id" => self.auth_seq_id = Some(idx),
            "_atom_site.cartn_x" => self.cartn_x = Some(idx),
            "_atom_site.cartn_y" => self.cartn_y = Some(idx),
            "_atom_site.cartn_z" => self.cartn_z = Some(idx),
            "_atom_site.b_iso_or_equiv" => self.b_iso = Some(idx),
            "_atom_site.pdbx_pdb_model_num" => self.model_num = Some(idx),
            _ => {}
        }
    }

    fn has_cartesian(&self) -> bool {
        self.cartn_x.is_some() && self.cartn_y.is_some() && self.cartn_z.is_some()
    }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/// Return `true` for mmCIF "missing value" tokens (`?` or `.`).
fn is_missing(s: &str) -> bool {
    s == "?" || s == "."
}

/// Parse a float field, returning `None` for missing values or parse errors.
fn parse_float_field(s: &str) -> Option<f32> {
    if is_missing(s) {
        None
    } else {
        s.parse().ok()
    }
}

/// Parse a u32 field, returning `None` for missing values or parse errors.
fn parse_u32_field(s: &str) -> Option<u32> {
    if is_missing(s) {
        None
    } else {
        s.parse().ok()
    }
}

/// Strip surrounding single- or double-quote characters from a CIF token.
fn strip_quotes(s: &str) -> &str {
    if (s.starts_with('\'') && s.ends_with('\'')) || (s.starts_with('"') && s.ends_with('"')) {
        &s[1..s.len() - 1]
    } else {
        s
    }
}

/// Extract element atomic number from a type_symbol field (`C`, `N`, `FE`, …).
fn element_from_type_symbol(s: &str) -> u8 {
    let cleaned: String = s.chars().take_while(|c| c.is_alphabetic()).collect();
    if cleaned.is_empty() {
        return 0;
    }
    let cap = capitalize(&cleaned);
    let z = symbol_to_atomic_num(&cap);
    if z > 0 {
        return z;
    }
    let first = capitalize(&cleaned[..1]);
    symbol_to_atomic_num(&first)
}

// ---------------------------------------------------------------------------
// Public parser
// ---------------------------------------------------------------------------

/// Parse an mmCIF text and return a `ParsedStructure`.
///
/// Only the first model (`_atom_site.pdbx_PDB_model_num == 1`, or whichever
/// model number appears first) is extracted.  Subsequent models are skipped.
pub fn parse(text: &str) -> Result<ParsedStructure, String> {
    let lines: Vec<&str> = text.lines().collect();

    // --- Cell parameters (dot-notation key-value) ---
    let mut cell_a: Option<f32> = None;
    let mut cell_b: Option<f32> = None;
    let mut cell_c: Option<f32> = None;
    let mut cell_alpha: Option<f32> = None;
    let mut cell_beta: Option<f32> = None;
    let mut cell_gamma: Option<f32> = None;

    for line in &lines {
        let trimmed = line.trim();
        if trimmed.starts_with('#') || trimmed.is_empty() {
            continue;
        }
        if trimmed.starts_with('_') {
            let parts: Vec<&str> = trimmed.splitn(2, char::is_whitespace).collect();
            if parts.len() >= 2 {
                let tag = parts[0].to_ascii_lowercase();
                let val = parts[1].trim();
                if !is_missing(val) {
                    let v: Option<f32> = val.parse().ok();
                    match tag.as_str() {
                        "_cell.length_a" => cell_a = v,
                        "_cell.length_b" => cell_b = v,
                        "_cell.length_c" => cell_c = v,
                        "_cell.angle_alpha" => cell_alpha = v,
                        "_cell.angle_beta" => cell_beta = v,
                        "_cell.angle_gamma" => cell_gamma = v,
                        _ => {}
                    }
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

    // --- Atom site data ---
    let mut positions: Vec<f32> = Vec::new();
    let mut elements: Vec<u8> = Vec::new();
    let mut atom_labels: Vec<String> = Vec::new();
    let mut chain_ids: Vec<u8> = Vec::new();
    let mut bfactors: Vec<f32> = Vec::new();
    let mut ca_indices: Vec<u32> = Vec::new();
    let mut ca_chain_ids: Vec<u8> = Vec::new();
    let mut ca_res_nums: Vec<u32> = Vec::new();
    let mut ca_ss_type: Vec<u8> = Vec::new();

    let mut first_model: Option<u32> = None;

    let mut i = 0;
    while i < lines.len() {
        let trimmed = lines[i].trim();

        if trimmed == "loop_" {
            i += 1;
            let mut cols = AtomSiteColumns::new();
            let mut col_count = 0usize;
            let mut is_atom_site = false;

            // Read loop header (all lines starting with `_`)
            while i < lines.len() {
                let t = lines[i].trim();
                if t.starts_with('#') {
                    i += 1;
                    continue;
                }
                if t.starts_with('_') {
                    let lower = t.to_ascii_lowercase();
                    // Strip inline comments after the tag name
                    let tag = lower.split_whitespace().next().unwrap_or("");
                    if tag.starts_with("_atom_site.") {
                        is_atom_site = true;
                        cols.assign(col_count, tag);
                    }
                    col_count += 1;
                    i += 1;
                } else {
                    break;
                }
            }

            if !is_atom_site || !cols.has_cartesian() || col_count == 0 {
                continue;
            }

            // Read data rows
            while i < lines.len() {
                let t = lines[i].trim();

                // End of loop conditions
                if t.is_empty()
                    || t.starts_with("loop_")
                    || t.starts_with("data_")
                    || t.starts_with('#')
                    || t.starts_with('_')
                {
                    break;
                }

                // Handle semicolon-delimited multi-line strings (skip the whole block)
                if t.starts_with(';') {
                    i += 1;
                    while i < lines.len() && !lines[i].trim().starts_with(';') {
                        i += 1;
                    }
                    i += 1; // skip closing ';'
                    continue;
                }

                let raw_fields: Vec<&str> = t.split_whitespace().collect();
                if raw_fields.len() < col_count {
                    i += 1;
                    continue;
                }

                // Model number gate — only use first model
                if let Some(mc) = cols.model_num {
                    if let Some(ms) = raw_fields.get(mc) {
                        if let Some(m) = parse_u32_field(ms) {
                            match first_model {
                                None => first_model = Some(m),
                                Some(fm) if m != fm => {
                                    i += 1;
                                    continue;
                                }
                                _ => {}
                            }
                        }
                    }
                }

                // Coordinates
                let x = cols
                    .cartn_x
                    .and_then(|c| raw_fields.get(c))
                    .and_then(|s| parse_float_field(s));
                let y = cols
                    .cartn_y
                    .and_then(|c| raw_fields.get(c))
                    .and_then(|s| parse_float_field(s));
                let z = cols
                    .cartn_z
                    .and_then(|c| raw_fields.get(c))
                    .and_then(|s| parse_float_field(s));

                let (x, y, z) = match (x, y, z) {
                    (Some(x), Some(y), Some(z)) => (x, y, z),
                    _ => {
                        i += 1;
                        continue;
                    }
                };

                // Element
                let elem = cols
                    .type_symbol
                    .and_then(|c| raw_fields.get(c))
                    .map(|s| element_from_type_symbol(strip_quotes(s)))
                    .unwrap_or(0);

                // Atom name
                let atom_name = cols
                    .label_atom_id
                    .and_then(|c| raw_fields.get(c))
                    .map(|s| strip_quotes(s))
                    .filter(|s| !is_missing(s))
                    .map(|s| s.to_string())
                    .unwrap_or_default();

                // Chain ID: label_asym_id preferred, auth_asym_id as fallback
                let chain_byte = cols
                    .label_asym_id
                    .and_then(|c| raw_fields.get(c))
                    .map(|s| strip_quotes(s))
                    .filter(|s| !is_missing(s))
                    .and_then(|s| s.as_bytes().first().copied())
                    .or_else(|| {
                        cols.auth_asym_id
                            .and_then(|c| raw_fields.get(c))
                            .map(|s| strip_quotes(s))
                            .filter(|s| !is_missing(s))
                            .and_then(|s| s.as_bytes().first().copied())
                    })
                    .unwrap_or(b' ');

                // B-factor
                let bfac = cols
                    .b_iso
                    .and_then(|c| raw_fields.get(c))
                    .and_then(|s| parse_float_field(s))
                    .unwrap_or(0.0);

                // Cα tracking (ATOM records only, atom name == "CA")
                let is_atom = cols
                    .group_pdb
                    .and_then(|c| raw_fields.get(c))
                    .map(|s| strip_quotes(s).eq_ignore_ascii_case("ATOM"))
                    .unwrap_or(true); // assume ATOM if column absent

                if is_atom && atom_name == "CA" {
                    let atom_idx = elements.len() as u32;
                    ca_indices.push(atom_idx);
                    ca_chain_ids.push(chain_byte);

                    let res_num = cols
                        .label_seq_id
                        .and_then(|c| raw_fields.get(c))
                        .and_then(|s| parse_u32_field(s))
                        .or_else(|| {
                            cols.auth_seq_id
                                .and_then(|c| raw_fields.get(c))
                                .and_then(|s| parse_u32_field(s))
                        })
                        .unwrap_or(0);

                    ca_res_nums.push(res_num);
                    ca_ss_type.push(0); // coil; secondary structure via _struct_conf is future work
                }

                elements.push(elem);
                atom_labels.push(atom_name);
                chain_ids.push(chain_byte);
                bfactors.push(bfac);
                positions.push(x);
                positions.push(y);
                positions.push(z);

                i += 1;
            }

            // Stop after first atom_site block that yielded atoms
            if !elements.is_empty() {
                break;
            }
        } else {
            i += 1;
        }
    }

    let n_atoms = elements.len();
    if n_atoms == 0 {
        return Err("mmCIF file contains no atom sites with Cartesian coordinates".to_string());
    }

    let empty_bonds = HashSet::new();
    let bonds = bonds::infer_bonds(&positions, &elements, n_atoms, &empty_bonds);

    let has_chain_ids = chain_ids.iter().any(|&c| c != b' ');
    let has_bfactors = bfactors.iter().any(|&b| b != 0.0);
    let has_labels = atom_labels.iter().any(|l| !l.is_empty());

    Ok(ParsedStructure {
        n_atoms,
        positions,
        elements,
        bonds,
        n_file_bonds: 0,
        bond_orders: None,
        box_matrix,
        frame_positions_flat: Vec::new(),
        atom_labels: if has_labels { Some(atom_labels) } else { None },
        chain_ids: if has_chain_ids { Some(chain_ids) } else { None },
        bfactors: if has_bfactors { Some(bfactors) } else { None },
        vector_channels: vec![],
        ca_indices,
        ca_chain_ids,
        ca_res_nums,
        ca_ss_type,
        symmetry_ops: crate::cif::extract_symmetry_ops(text),
        hetero: None,
    })
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

#[cfg(test)]
mod tests {
    use super::*;

    const MINIMAL_MMCIF: &str = r#"data_1ALA
_entry.id   1ALA
_cell.length_a   40.000
_cell.length_b   40.000
_cell.length_c   40.000
_cell.angle_alpha   90.000
_cell.angle_beta    90.000
_cell.angle_gamma   90.000
#
loop_
_atom_site.group_PDB
_atom_site.id
_atom_site.type_symbol
_atom_site.label_atom_id
_atom_site.label_comp_id
_atom_site.label_asym_id
_atom_site.label_seq_id
_atom_site.Cartn_x
_atom_site.Cartn_y
_atom_site.Cartn_z
_atom_site.B_iso_or_equiv
_atom_site.pdbx_PDB_model_num
ATOM 1 N N ALA A 1 1.000 2.000 3.000 10.00 1
ATOM 2 C CA ALA A 1 2.000 3.000 4.000 12.00 1
ATOM 3 C C ALA A 1 3.000 4.000 5.000 11.00 1
ATOM 4 O O ALA A 1 4.000 5.000 6.000  9.00 1
ATOM 5 C CB ALA A 1 2.500 2.500 5.000 13.00 1
#
"#;

    #[test]
    fn test_is_mmcif_positive() {
        assert!(is_mmcif(MINIMAL_MMCIF));
    }

    #[test]
    fn test_is_mmcif_negative_small_mol_cif() {
        let cif = r#"data_NaCl
_cell_length_a   5.6402
loop_
_atom_site_label
_atom_site_type_symbol
_atom_site_fract_x
_atom_site_fract_y
_atom_site_fract_z
Na1 Na 0.0 0.0 0.0
"#;
        assert!(!is_mmcif(cif));
    }

    #[test]
    fn test_parse_minimal_mmcif() {
        let result = parse(MINIMAL_MMCIF).expect("parse failed");
        assert_eq!(result.n_atoms, 5);
        assert_eq!(result.elements[0], 7); // N
        assert_eq!(result.elements[1], 6); // C (CA)
        assert_eq!(result.elements[2], 6); // C
        assert_eq!(result.elements[3], 8); // O
        assert_eq!(result.elements[4], 6); // CB
    }

    #[test]
    fn test_parse_cell_parameters() {
        let result = parse(MINIMAL_MMCIF).expect("parse failed");
        assert!(result.box_matrix.is_some());
        let bm = result.box_matrix.unwrap();
        assert!((bm[0] - 40.0).abs() < 0.01);
    }

    #[test]
    fn test_parse_cartesian_coords() {
        let result = parse(MINIMAL_MMCIF).expect("parse failed");
        // First atom N at (1, 2, 3)
        assert!((result.positions[0] - 1.0).abs() < 1e-4);
        assert!((result.positions[1] - 2.0).abs() < 1e-4);
        assert!((result.positions[2] - 3.0).abs() < 1e-4);
    }

    #[test]
    fn test_parse_chain_ids() {
        let result = parse(MINIMAL_MMCIF).expect("parse failed");
        let chain_ids = result.chain_ids.expect("no chain IDs");
        assert!(chain_ids.iter().all(|&c| c == b'A'));
    }

    #[test]
    fn test_parse_bfactors() {
        let result = parse(MINIMAL_MMCIF).expect("parse failed");
        let bfacs = result.bfactors.expect("no B-factors");
        assert!((bfacs[0] - 10.0).abs() < 0.01); // N
        assert!((bfacs[1] - 12.0).abs() < 0.01); // CA
    }

    #[test]
    fn test_parse_ca_backbone() {
        let result = parse(MINIMAL_MMCIF).expect("parse failed");
        assert_eq!(result.ca_indices.len(), 1);
        assert_eq!(result.ca_indices[0], 1); // CA is atom index 1
        assert_eq!(result.ca_chain_ids[0], b'A');
        assert_eq!(result.ca_res_nums[0], 1);
        assert_eq!(result.ca_ss_type[0], 0); // coil
    }

    #[test]
    fn test_parse_atom_labels() {
        let result = parse(MINIMAL_MMCIF).expect("parse failed");
        let labels = result.atom_labels.expect("no atom labels");
        assert_eq!(labels[0], "N");
        assert_eq!(labels[1], "CA");
        assert_eq!(labels[4], "CB");
    }

    #[test]
    fn test_model_filtering() {
        let mmcif = r#"data_multi
_entry.id   multi
loop_
_atom_site.group_PDB
_atom_site.id
_atom_site.type_symbol
_atom_site.label_atom_id
_atom_site.label_asym_id
_atom_site.label_seq_id
_atom_site.Cartn_x
_atom_site.Cartn_y
_atom_site.Cartn_z
_atom_site.pdbx_PDB_model_num
ATOM 1 N N A 1 1.0 2.0 3.0 1
ATOM 2 N N A 1 4.0 5.0 6.0 2
#
"#;
        let result = parse(mmcif).expect("parse failed");
        // Only model 1 should be parsed
        assert_eq!(result.n_atoms, 1);
        assert!((result.positions[0] - 1.0).abs() < 1e-4);
    }

    #[test]
    fn test_missing_values() {
        let mmcif = r#"data_missing
_entry.id   missing
loop_
_atom_site.group_PDB
_atom_site.id
_atom_site.type_symbol
_atom_site.label_atom_id
_atom_site.label_asym_id
_atom_site.label_seq_id
_atom_site.Cartn_x
_atom_site.Cartn_y
_atom_site.Cartn_z
_atom_site.B_iso_or_equiv
_atom_site.pdbx_PDB_model_num
ATOM 1 O O A 1 1.0 2.0 3.0 ? 1
ATOM 2 H H A 2 4.0 5.0 6.0 . 1
#
"#;
        let result = parse(mmcif).expect("parse failed");
        assert_eq!(result.n_atoms, 2);
        // B-factors should be 0.0 for missing values
        assert!(result.bfactors.is_none() || result.bfactors.as_ref().map(|b| b[0]) == Some(0.0));
    }

    #[test]
    fn test_empty_mmcif_error() {
        let result = parse("data_empty\n_entry.id empty\n");
        assert!(result.is_err());
    }

    #[test]
    fn test_hetatm_excluded_from_ca() {
        let mmcif = r#"data_hetatm
_entry.id   hetatm
loop_
_atom_site.group_PDB
_atom_site.id
_atom_site.type_symbol
_atom_site.label_atom_id
_atom_site.label_asym_id
_atom_site.label_seq_id
_atom_site.Cartn_x
_atom_site.Cartn_y
_atom_site.Cartn_z
_atom_site.pdbx_PDB_model_num
ATOM   1 C CA A 1 1.0 2.0 3.0 1
HETATM 2 C CA A 2 4.0 5.0 6.0 1
#
"#;
        let result = parse(mmcif).expect("parse failed");
        assert_eq!(result.n_atoms, 2);
        // Only the ATOM record should contribute a Cα
        assert_eq!(result.ca_indices.len(), 1);
        assert_eq!(result.ca_indices[0], 0);
    }

    #[test]
    fn test_no_cell_is_ok() {
        let mmcif = r#"data_nocell
_entry.id   nocell
loop_
_atom_site.group_PDB
_atom_site.id
_atom_site.type_symbol
_atom_site.label_atom_id
_atom_site.label_asym_id
_atom_site.label_seq_id
_atom_site.Cartn_x
_atom_site.Cartn_y
_atom_site.Cartn_z
_atom_site.pdbx_PDB_model_num
ATOM 1 N N A 1 0.0 0.0 0.0 1
#
"#;
        let result = parse(mmcif).expect("parse without cell failed");
        assert!(result.box_matrix.is_none());
        assert_eq!(result.n_atoms, 1);
    }

    #[test]
    fn test_parse_mmcif_fixture() {
        let text = std::fs::read_to_string(concat!(
            env!("CARGO_MANIFEST_DIR"),
            "/../../tests/fixtures/1ala.mmcif"
        ))
        .expect("read fixture");
        let result = parse(&text).expect("parse failed");
        assert!(result.n_atoms > 0);
        assert!(!result.ca_indices.is_empty());
        assert!(result.chain_ids.is_some());
        assert!(result.bfactors.is_some());
    }

    #[test]
    fn test_strip_quotes() {
        assert_eq!(strip_quotes("'THR'"), "THR");
        assert_eq!(strip_quotes("\"CA\""), "CA");
        assert_eq!(strip_quotes("THR"), "THR");
        assert_eq!(strip_quotes("?"), "?");
    }

    #[test]
    fn test_is_missing() {
        assert!(is_missing("?"));
        assert!(is_missing("."));
        assert!(!is_missing("A"));
        assert!(!is_missing("1.0"));
    }

    #[test]
    fn test_element_from_type_symbol() {
        assert_eq!(element_from_type_symbol("C"), 6);
        assert_eq!(element_from_type_symbol("N"), 7);
        assert_eq!(element_from_type_symbol("O"), 8);
        assert_eq!(element_from_type_symbol("S"), 16);
        assert_eq!(element_from_type_symbol("FE"), 26);
        assert_eq!(element_from_type_symbol("ZN"), 30);
    }
}
