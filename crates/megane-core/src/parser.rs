/// PDB text parser.
///
/// Handles ATOM/HETATM, CRYST1, CONECT, and MODEL/ENDMDL records.
use std::collections::{HashMap, HashSet};

// Re-export element utilities that were historically part of this module.
// New code should import from `crate::atomic` directly.
pub use crate::atomic::{capitalize, symbol_to_atomic_num};

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
    pub atom_labels: Option<Vec<String>>,
    /// Embedded vector channels (e.g. GRO velocities).
    /// Empty for formats that carry no per-atom vector quantities.
    pub vector_channels: Vec<crate::trajectory::VectorChannel>,
    /// Indices of Cα (alpha-carbon) atoms in the positions array.
    /// Empty for non-protein or formats that do not carry atom names.
    pub ca_indices: Vec<u32>,
    /// Per-Cα chain identifier (ASCII byte, e.g. b'A').
    pub ca_chain_ids: Vec<u8>,
    /// Per-Cα residue sequence number.
    pub ca_res_nums: Vec<u32>,
    /// Per-Cα secondary-structure type: 0 = coil, 1 = helix, 2 = sheet.
    pub ca_ss_type: Vec<u8>,
}

/// Secondary-structure range from a PDB HELIX or SHEET record.
struct SsRange {
    chain_id: u8,
    start: u32,
    end: u32,
    ss_type: u8, // 1 = helix, 2 = sheet
}

/// Parse a PDB HELIX record and return a secondary-structure range.
fn parse_helix_range(line: &str) -> Option<SsRange> {
    if line.len() < 37 {
        return None;
    }
    let chain_id = line.as_bytes().get(19).copied().unwrap_or(b' ');
    let start: u32 = line[21..25].trim().parse().ok()?;
    let end: u32 = line[33..37].trim().parse().ok()?;
    Some(SsRange {
        chain_id,
        start,
        end,
        ss_type: 1,
    })
}

/// Parse a PDB SHEET record and return a secondary-structure range.
fn parse_sheet_range(line: &str) -> Option<SsRange> {
    if line.len() < 37 {
        return None;
    }
    let chain_id = line.as_bytes().get(21).copied().unwrap_or(b' ');
    let start: u32 = line[22..26].trim().parse().ok()?;
    let end: u32 = line[33..37].trim().parse().ok()?;
    Some(SsRange {
        chain_id,
        start,
        end,
        ss_type: 2,
    })
}

/// If `line` is an ATOM record for a Cα atom, return (chain_id, res_num).
fn parse_ca_info(line: &str) -> Option<(u8, u32)> {
    if line.len() < 27 {
        return None;
    }
    let atom_name = line[12..16].trim();
    if atom_name != "CA" {
        return None;
    }
    let chain_id = line.as_bytes().get(21).copied().unwrap_or(b' ');
    let res_num: u32 = line[22..26].trim().parse().ok()?;
    Some((chain_id, res_num))
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
pub fn cell_params_to_matrix(
    a: f32,
    b: f32,
    c: f32,
    alpha: f32,
    beta: f32,
    gamma: f32,
) -> [f32; 9] {
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
        a,
        0.0,
        0.0, // va
        b * cos_g,
        b * sin_g,
        0.0, // vb
        cx,
        cy,
        cz, // vc
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
    let mut current_labels: Vec<String> = Vec::new();
    let mut first_model_labels: Vec<String> = Vec::new();
    let mut has_model_record = false;
    let mut model_count: usize = 0;

    // Secondary-structure ranges from HELIX/SHEET records.
    let mut ss_ranges: Vec<SsRange> = Vec::new();
    // Backbone Cα data collected from the first model only.
    let mut raw_ca: Vec<(usize, u8, u32)> = Vec::new(); // (atom_index, chain_id, res_num)

    for line in text.lines() {
        let record = if line.len() >= 6 {
            line[..6].trim_end()
        } else {
            line.trim_end()
        };

        match record {
            "HELIX" => {
                if let Some(r) = parse_helix_range(line) {
                    ss_ranges.push(r);
                }
            }
            "SHEET" => {
                if let Some(r) = parse_sheet_range(line) {
                    ss_ranges.push(r);
                }
            }
            "MODEL" => {
                has_model_record = true;
                current_model = Vec::new();
                current_labels = Vec::new();
            }
            "ENDMDL" => {
                if model_count == 0 {
                    first_model_labels = std::mem::take(&mut current_labels);
                }
                all_models.push(std::mem::take(&mut current_model));
                model_count += 1;
            }
            "CRYST1" if box_matrix.is_none() => {
                box_matrix = parse_cryst1(line);
            }
            "ATOM" | "HETATM" => {
                if let Some((serial, atom)) = parse_atom_line(line) {
                    // Build serial→index map from first model only
                    if !has_model_record || model_count == 0 {
                        serial_to_index.insert(serial, current_model.len());
                    }
                    // Collect Cα info from first model
                    if !has_model_record || model_count == 0 {
                        if let Some((chain_id, res_num)) = parse_ca_info(line) {
                            raw_ca.push((current_model.len(), chain_id, res_num));
                        }
                    }
                    // Extract residue label: resName (cols 17-20) + resSeq (cols 22-26)
                    let res_name = if line.len() >= 20 {
                        line[17..20].trim()
                    } else {
                        ""
                    };
                    let res_seq = if line.len() >= 26 {
                        line[22..26].trim()
                    } else {
                        ""
                    };
                    current_labels.push(format!("{}{}", res_name, res_seq));
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
        first_model_labels = current_labels;
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

    // Check if any labels are non-empty
    let atom_labels = if first_model_labels.iter().any(|l| !l.is_empty()) {
        Some(first_model_labels)
    } else {
        None
    };

    // Build Cα backbone arrays with SS type annotation.
    let mut ca_indices = Vec::with_capacity(raw_ca.len());
    let mut ca_chain_ids = Vec::with_capacity(raw_ca.len());
    let mut ca_res_nums = Vec::with_capacity(raw_ca.len());
    let mut ca_ss_type = Vec::with_capacity(raw_ca.len());
    for (idx, chain_id, res_num) in raw_ca {
        let ss = ss_ranges
            .iter()
            .find(|r| r.chain_id == chain_id && res_num >= r.start && res_num <= r.end)
            .map(|r| r.ss_type)
            .unwrap_or(0);
        ca_indices.push(idx as u32);
        ca_chain_ids.push(chain_id);
        ca_res_nums.push(res_num);
        ca_ss_type.push(ss);
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
        atom_labels,
        vector_channels: vec![],
        ca_indices,
        ca_chain_ids,
        ca_res_nums,
        ca_ss_type,
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_parse_minimal_pdb() {
        let pdb = "CRYST1   40.960   18.650   22.520  90.00  90.77  90.00 P 21          4\nATOM      1  N   THR A   1      17.047  14.099   3.625  1.00 13.79           N  \nATOM      2  CA  THR A   1      16.967  12.784   4.338  1.00 10.80           C  \nATOM      3  C   THR A   1      15.685  12.755   5.133  1.00  9.19           C  \nEND\n";
        let result = parse(pdb).expect("parse failed");
        assert_eq!(result.n_atoms, 3);
        assert_eq!(result.elements[0], 7); // N
        assert_eq!(result.elements[1], 6); // C
        assert_eq!(result.elements[2], 6); // C
        assert!((result.positions[0] - 17.047).abs() < 0.01);
        assert!((result.positions[1] - 14.099).abs() < 0.01);
        assert!(result.box_matrix.is_some());
        let bm = result.box_matrix.unwrap();
        assert!((bm[0] - 40.96).abs() < 0.1);
    }

    #[test]
    fn test_parse_pdb_with_conect() {
        let pdb = "ATOM      1  O   HOH     1       0.000   0.000   0.000  1.00  0.00           O  \nATOM      2  H1  HOH     1       0.757   0.587   0.000  1.00  0.00           H  \nATOM      3  H2  HOH     1      -0.757   0.587   0.000  1.00  0.00           H  \nCONECT    1    2    3\nEND\n";
        let result = parse(pdb).expect("parse failed");
        assert_eq!(result.n_atoms, 3);
        assert!(result.n_file_bonds >= 2);
    }

    #[test]
    fn test_parse_pdb_multi_model() {
        let pdb = "MODEL        1\nATOM      1  CA  ALA A   1       1.000   2.000   3.000  1.00  0.00           C  \nENDMDL\nMODEL        2\nATOM      1  CA  ALA A   1       4.000   5.000   6.000  1.00  0.00           C  \nENDMDL\n";
        let result = parse(pdb).expect("parse failed");
        assert_eq!(result.n_atoms, 1);
        assert_eq!(result.frame_positions.len(), 1);
        assert!((result.frame_positions[0][0] - 4.0).abs() < 0.01);
    }

    #[test]
    fn test_parse_empty_pdb_errors() {
        let result = parse("REMARK test\nEND\n");
        assert!(result.is_err());
    }

    #[test]
    fn test_parse_1crn_fixture() {
        let text = std::fs::read_to_string(concat!(
            env!("CARGO_MANIFEST_DIR"),
            "/../../tests/fixtures/1crn.pdb"
        ))
        .expect("read fixture");
        let result = parse(&text).expect("parse failed");
        assert_eq!(result.n_atoms, 327);
        assert!(!result.bonds.is_empty());
        assert!(result.elements.contains(&6)); // C
        assert!(result.elements.contains(&7)); // N
        assert!(result.elements.contains(&8)); // O
        assert!(result.elements.contains(&16)); // S
    }

    #[test]
    fn test_parse_helix_range() {
        // HELIX record: initChainID at col 19, initSeqNum at cols 21-25, endChainID at 31, endSeqNum at 33-37
        let line = "HELIX    1   1 SER A    7  GLY A   18  1                                  12";
        let r = parse_helix_range(line).expect("should parse");
        assert_eq!(r.chain_id, b'A');
        assert_eq!(r.start, 7);
        assert_eq!(r.end, 18);
        assert_eq!(r.ss_type, 1); // helix
    }

    #[test]
    fn test_parse_sheet_range() {
        // SHEET record: initChainID at col 21, initSeqNum at cols 22-26, endChainID at 32, endSeqNum at 33-37
        let line = "SHEET    1   A 2 GLY A  20  TYR A  24  0";
        let r = parse_sheet_range(line).expect("should parse");
        assert_eq!(r.chain_id, b'A');
        assert_eq!(r.start, 20);
        assert_eq!(r.end, 24);
        assert_eq!(r.ss_type, 2); // sheet
    }

    #[test]
    fn test_parse_ca_info_detects_alpha_carbon() {
        let line =
            "ATOM      2  CA  THR A   1      16.967  12.784   4.338  1.00 10.80           C  ";
        let info = parse_ca_info(line).expect("should detect Cα");
        assert_eq!(info.0, b'A'); // chain ID
        assert_eq!(info.1, 1); // residue number
    }

    #[test]
    fn test_parse_ca_info_rejects_non_ca() {
        let line =
            "ATOM      1  N   THR A   1      17.047  14.099   3.625  1.00 13.79           N  ";
        assert!(parse_ca_info(line).is_none());
    }

    #[test]
    fn test_pdb_with_helix_and_sheet() {
        // Minimal PDB with HELIX/SHEET records and a few backbone atoms.
        let pdb = "\
HELIX    1   1 THR A    1  ALA A    2  1                                   2
SHEET    1   A 1 GLY A   3  GLY A   4  0
ATOM      1  N   THR A   1       1.000   0.000   0.000  1.00  0.00           N
ATOM      2  CA  THR A   1       2.000   0.000   0.000  1.00  0.00           C
ATOM      3  N   ALA A   2       3.000   0.000   0.000  1.00  0.00           N
ATOM      4  CA  ALA A   2       4.000   0.000   0.000  1.00  0.00           C
ATOM      5  N   GLY A   3       5.000   0.000   0.000  1.00  0.00           N
ATOM      6  CA  GLY A   3       6.000   0.000   0.000  1.00  0.00           C
ATOM      7  N   GLY A   4       7.000   0.000   0.000  1.00  0.00           N
ATOM      8  CA  GLY A   4       8.000   0.000   0.000  1.00  0.00           C
END
";
        let result = parse(pdb).expect("parse failed");
        assert_eq!(result.n_atoms, 8);
        // Cα atoms: indices 1 (THR 1), 3 (ALA 2), 5 (GLY 3), 7 (GLY 4)
        assert_eq!(result.ca_indices.len(), 4);
        assert_eq!(result.ca_indices[0], 1); // THR A 1 → index 1
        assert_eq!(result.ca_indices[1], 3); // ALA A 2 → index 3
        assert_eq!(result.ca_indices[2], 5); // GLY A 3 → index 5
        assert_eq!(result.ca_indices[3], 7); // GLY A 4 → index 7
                                             // SS types: THR 1 → helix(1), ALA 2 → helix(1), GLY 3 → sheet(2), GLY 4 → sheet(2)
        assert_eq!(result.ca_ss_type[0], 1); // helix
        assert_eq!(result.ca_ss_type[1], 1); // helix
        assert_eq!(result.ca_ss_type[2], 2); // sheet
        assert_eq!(result.ca_ss_type[3], 2); // sheet
                                             // All chain IDs should be b'A'
        assert!(result.ca_chain_ids.iter().all(|&c| c == b'A'));
    }

    #[test]
    fn test_pdb_no_helix_sheet_all_coil() {
        // PDB with Cα but no HELIX/SHEET → all coil (0)
        let pdb = "\
ATOM      1  CA  ALA A   1       1.000   0.000   0.000  1.00  0.00           C
ATOM      2  CA  GLY A   2       2.000   0.000   0.000  1.00  0.00           C
END
";
        let result = parse(pdb).expect("parse failed");
        assert_eq!(result.ca_indices.len(), 2);
        assert!(result.ca_ss_type.iter().all(|&t| t == 0)); // all coil
    }

    #[test]
    fn test_parse_ca_info_cb_is_not_ca() {
        // CB (beta carbon) should not be detected as Cα
        let line =
            "ATOM      5  CB  THR A   1      16.000  12.000   4.000  1.00  0.00           C  ";
        assert!(parse_ca_info(line).is_none());
    }
}
