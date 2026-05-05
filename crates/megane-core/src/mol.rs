/// MDL Molfile parser supporting both V2000 and V3000 (CTfile) formats.
///
/// V2000 format:
///   Lines 1-3: header (molecule name, program/timestamp, comment)
///   Line 4: counts line (natoms nbonds ...)
///   Lines 5..4+natoms: atom block (x y z symbol ...)
///   Lines 5+natoms..4+natoms+nbonds: bond block (atom1 atom2 bond_order ...)
///   M  END
///
/// V3000 format:
///   Lines 1-3: header (same as V2000)
///   Line 4: counts line with "V3000" version string (atom/bond counts are 0)
///   M  V30 BEGIN CTAB
///   M  V30 COUNTS na nb ...
///   M  V30 BEGIN ATOM / atom lines / M  V30 END ATOM
///   M  V30 BEGIN BOND / bond lines / M  V30 END BOND
///   M  V30 END CTAB
///   M  END
use crate::atomic::symbol_to_atomic_num;

/// Parse a V3000 CTAB block from lines starting after the V3000 counts line.
///
/// Handles line continuation (trailing ` -` on a V30 property line signals that
/// the next `M  V30` line continues the same logical record).
fn parse_v3000_ctab(lines: &[&str]) -> Result<crate::parser::ParsedStructure, String> {
    let mut n_atoms_expected = 0usize;
    let mut in_atom_block = false;
    let mut in_bond_block = false;
    let mut positions: Vec<f32> = Vec::new();
    let mut elements: Vec<u8> = Vec::new();
    let mut bonds: Vec<(u32, u32)> = Vec::new();
    let mut bond_orders: Vec<u8> = Vec::new();
    // Pending content from a continuation line (trailing ` -`).
    let mut pending: Option<String> = None;

    for &line in lines {
        let trimmed = line.trim_end();

        if trimmed.starts_with("M  END") || trimmed == "$$$$" {
            break;
        }
        if !trimmed.starts_with("M  V30") {
            continue;
        }

        // Content after the 7-char prefix "M  V30 "; empty for bare "M  V30".
        let content = if trimmed.len() > 7 { &trimmed[7..] } else { "" };

        // Merge with any pending continuation prefix.
        let mut full = match pending.take() {
            Some(prev) => format!("{} {}", prev, content),
            None => content.to_string(),
        };

        // A trailing " -" signals that the next V30 line continues this record.
        if full.trim_end().ends_with(" -") {
            let trim_len = full.trim_end().len();
            full.truncate(trim_len - 2); // strip " -"
            pending = Some(full);
            continue;
        }

        let parts: Vec<&str> = full.split_whitespace().collect();
        if parts.is_empty() {
            continue;
        }

        if parts[0] == "COUNTS" {
            if parts.len() < 3 {
                return Err("V3000 COUNTS line too short".into());
            }
            n_atoms_expected = parts[1]
                .parse()
                .map_err(|_| "bad atom count in V3000 COUNTS")?;
            let n_bonds_expected: usize = parts[2]
                .parse()
                .map_err(|_| "bad bond count in V3000 COUNTS")?;
            positions = Vec::with_capacity(n_atoms_expected * 3);
            elements = Vec::with_capacity(n_atoms_expected);
            bonds = Vec::with_capacity(n_bonds_expected);
            bond_orders = Vec::with_capacity(n_bonds_expected);
        } else if parts[0] == "BEGIN" {
            match parts.get(1).copied() {
                Some("ATOM") => {
                    in_atom_block = true;
                    in_bond_block = false;
                }
                Some("BOND") => {
                    in_bond_block = true;
                    in_atom_block = false;
                }
                _ => {}
            }
        } else if parts[0] == "END" {
            match parts.get(1).copied() {
                Some("ATOM") => in_atom_block = false,
                Some("BOND") => in_bond_block = false,
                _ => {}
            }
        } else if in_atom_block {
            // Atom line: index type x y z aamap [key=value...]
            // index is parts[0], type is parts[1], coords are parts[2..4]
            if parts.len() < 5 {
                continue;
            }
            let sym_raw = parts[1];
            // Strip query-atom list notation: [C,N] -> C
            let sym_str = if sym_raw.starts_with('[') {
                sym_raw
                    .trim_matches(|c| c == '[' || c == ']')
                    .split(',')
                    .next()
                    .unwrap_or("C")
            } else {
                sym_raw
            };
            let sym = crate::parser::capitalize(sym_str);
            let x: f32 = parts[2]
                .parse()
                .map_err(|_| "bad x coord in V3000 atom block")?;
            let y: f32 = parts[3]
                .parse()
                .map_err(|_| "bad y coord in V3000 atom block")?;
            let z: f32 = parts[4]
                .parse()
                .map_err(|_| "bad z coord in V3000 atom block")?;
            positions.push(x);
            positions.push(y);
            positions.push(z);
            elements.push(symbol_to_atomic_num(&sym));
        } else if in_bond_block {
            // Bond line: index type atom1 atom2 [key=value...]
            if parts.len() < 4 {
                continue;
            }
            let order: u8 = parts[1].parse().unwrap_or(1);
            let a: u32 = parts[2]
                .parse::<u32>()
                .map_err(|_| "bad bond atom1 in V3000 bond block")?
                - 1;
            let b: u32 = parts[3]
                .parse::<u32>()
                .map_err(|_| "bad bond atom2 in V3000 bond block")?
                - 1;
            bonds.push((a.min(b), a.max(b)));
            bond_orders.push(order);
        }
    }

    let n_atoms = positions.len() / 3;
    if n_atoms == 0 {
        return Err("V3000 CTAB contains no atoms".into());
    }
    if n_atoms_expected > 0 && n_atoms != n_atoms_expected {
        return Err(format!(
            "V3000 atom count mismatch: COUNTS says {n_atoms_expected}, parsed {n_atoms}"
        ));
    }

    let n_file_bonds = bond_orders.len();
    Ok(crate::parser::ParsedStructure {
        n_atoms,
        positions,
        elements,
        bonds,
        n_file_bonds,
        bond_orders: Some(bond_orders),
        box_matrix: None,
        frame_positions: Vec::new(),
        atom_labels: None,
        chain_ids: None,
        bfactors: None,
        vector_channels: vec![],
        ca_indices: vec![],
        ca_chain_ids: vec![],
        ca_res_nums: vec![],
        ca_ss_type: vec![],
    })
}

pub fn parse(text: &str) -> Result<crate::parser::ParsedStructure, String> {
    let lines: Vec<&str> = text.lines().collect();
    if lines.len() < 5 {
        return Err("MOL file too short".into());
    }

    // Detect V3000: line 4 (index 3) carries "V3000" in the version field.
    if lines[3].contains("V3000") {
        return parse_v3000_ctab(&lines[4..]);
    }

    // Line 4 (index 3): counts line
    let counts_line = lines[3];
    let n_atoms = parse_mol_int(counts_line, 0, 3)?;
    let n_bonds = parse_mol_int(counts_line, 3, 6)?;

    if n_atoms == 0 {
        return Err("MOL file has zero atoms".into());
    }

    let atom_start = 4;
    let bond_start = atom_start + n_atoms;

    if lines.len() < bond_start + n_bonds {
        return Err(format!(
            "MOL file too short: expected {} atom + {} bond lines",
            n_atoms, n_bonds
        ));
    }

    // Parse atom block
    let mut positions = Vec::with_capacity(n_atoms * 3);
    let mut elements = Vec::with_capacity(n_atoms);

    for i in 0..n_atoms {
        let line = lines[atom_start + i];
        // V2000 atom line: x(10.4) y(10.4) z(10.4) symbol(3) ...
        // Columns: 0-9 x, 10-19 y, 20-29 z, 31-33 symbol
        if line.len() < 34 {
            // Fall back to whitespace splitting for short/non-standard lines
            let parts: Vec<&str> = line.split_whitespace().collect();
            if parts.len() < 4 {
                return Err(format!("MOL atom line {} too short", i + 1));
            }
            let x: f32 = parts[0]
                .parse()
                .map_err(|_| format!("bad x at atom {}", i + 1))?;
            let y: f32 = parts[1]
                .parse()
                .map_err(|_| format!("bad y at atom {}", i + 1))?;
            let z: f32 = parts[2]
                .parse()
                .map_err(|_| format!("bad z at atom {}", i + 1))?;
            let sym = crate::parser::capitalize(parts[3]);
            positions.push(x);
            positions.push(y);
            positions.push(z);
            elements.push(symbol_to_atomic_num(&sym));
        } else {
            let x: f32 = line[0..10]
                .trim()
                .parse()
                .map_err(|_| format!("bad x at atom {}", i + 1))?;
            let y: f32 = line[10..20]
                .trim()
                .parse()
                .map_err(|_| format!("bad y at atom {}", i + 1))?;
            let z: f32 = line[20..30]
                .trim()
                .parse()
                .map_err(|_| format!("bad z at atom {}", i + 1))?;
            let sym = crate::parser::capitalize(line[31..34].trim());
            positions.push(x);
            positions.push(y);
            positions.push(z);
            elements.push(symbol_to_atomic_num(&sym));
        }
    }

    // Parse bond block
    let mut bonds = Vec::with_capacity(n_bonds);
    let mut bond_orders = Vec::with_capacity(n_bonds);

    for i in 0..n_bonds {
        let line = lines[bond_start + i];
        // V2000 bond line: atom1(3) atom2(3) bond_type(3) ...
        if line.len() < 9 {
            let parts: Vec<&str> = line.split_whitespace().collect();
            if parts.len() < 3 {
                return Err(format!("MOL bond line {} too short", i + 1));
            }
            let a: u32 = parts[0]
                .parse::<u32>()
                .map_err(|_| format!("bad bond atom1 at bond {}", i + 1))?
                - 1;
            let b: u32 = parts[1]
                .parse::<u32>()
                .map_err(|_| format!("bad bond atom2 at bond {}", i + 1))?
                - 1;
            let order: u8 = parts[2].parse().unwrap_or(1);
            bonds.push((a.min(b), a.max(b)));
            bond_orders.push(order);
        } else {
            let a = parse_mol_int(line, 0, 3)? as u32 - 1;
            let b = parse_mol_int(line, 3, 6)? as u32 - 1;
            let order = parse_mol_int(line, 6, 9).unwrap_or(1) as u8;
            bonds.push((a.min(b), a.max(b)));
            bond_orders.push(order);
        }
    }

    Ok(crate::parser::ParsedStructure {
        n_atoms,
        positions,
        elements,
        bonds,
        n_file_bonds: n_bonds,
        bond_orders: Some(bond_orders),
        box_matrix: None,
        frame_positions: Vec::new(),
        atom_labels: None,
        chain_ids: None,
        bfactors: None,
        vector_channels: vec![],
        ca_indices: vec![],
        ca_chain_ids: vec![],
        ca_res_nums: vec![],
        ca_ss_type: vec![],
    })
}

/// Parse an integer from a fixed-width field in a MOL file line.
pub(crate) fn parse_mol_int(line: &str, start: usize, end: usize) -> Result<usize, String> {
    let end = end.min(line.len());
    if start >= end {
        return Err(format!("field {}..{} out of range", start, end));
    }
    line[start..end]
        .trim()
        .parse()
        .map_err(|_| format!("cannot parse integer from '{}'", &line[start..end]))
}

#[cfg(test)]
mod tests {
    use super::*;

    // ── V3000 tests ──────────────────────────────────────────────────────────

    const VALID_V3000: &str = "\
ethanol_v3k
  megane

  0  0  0  0  0  0            999 V3000
M  V30 BEGIN CTAB
M  V30 COUNTS 3 2 0 0 0
M  V30 BEGIN ATOM
M  V30 1 C 0.0000 1.0000 2.0000 0
M  V30 2 O 3.0000 4.0000 5.0000 0
M  V30 3 N 6.0000 7.0000 8.0000 0
M  V30 END ATOM
M  V30 BEGIN BOND
M  V30 1 1 1 2
M  V30 2 2 2 3
M  V30 END BOND
M  V30 END CTAB
M  END
";

    #[test]
    fn parse_valid_v3000() {
        let result = parse(VALID_V3000).unwrap();
        assert_eq!(result.n_atoms, 3);
        assert_eq!(result.n_file_bonds, 2);
        assert_eq!(
            result.positions,
            vec![0.0, 1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0]
        );
        assert_eq!(result.elements[0], 6); // C
        assert_eq!(result.elements[1], 8); // O
        assert_eq!(result.elements[2], 7); // N
        assert_eq!(result.bonds, vec![(0, 1), (1, 2)]);
        let orders = result.bond_orders.unwrap();
        assert_eq!(orders, vec![1, 2]);
    }

    #[test]
    fn parse_v3000_bonds_sorted() {
        // Bond atom2 < atom1 should still produce a sorted (min, max) pair.
        let mol = "\
name
prog
comment
  0  0  0  0  0  0            999 V3000
M  V30 BEGIN CTAB
M  V30 COUNTS 2 1 0 0 0
M  V30 BEGIN ATOM
M  V30 1 C 0.0 1.0 2.0 0
M  V30 2 O 3.0 4.0 5.0 0
M  V30 END ATOM
M  V30 BEGIN BOND
M  V30 1 1 2 1
M  V30 END BOND
M  V30 END CTAB
M  END
";
        let result = parse(mol).unwrap();
        assert_eq!(result.bonds[0], (0, 1)); // sorted: min=0, max=1
    }

    #[test]
    fn parse_v3000_query_atom_list() {
        // Query atom lists like [C,N] should resolve to the first element.
        let mol = "\
name
prog
comment
  0  0  0  0  0  0            999 V3000
M  V30 BEGIN CTAB
M  V30 COUNTS 1 0 0 0 0
M  V30 BEGIN ATOM
M  V30 1 [C,N] 0.0 0.0 0.0 0
M  V30 END ATOM
M  V30 END BOND
M  V30 END CTAB
M  END
";
        let result = parse(mol).unwrap();
        assert_eq!(result.n_atoms, 1);
        assert_eq!(result.elements[0], 6); // C (first in [C,N])
    }

    #[test]
    fn parse_v3000_continuation_line() {
        // A trailing " -" on a V30 line means the next V30 line continues it.
        let mol = "\
name
prog
comment
  0  0  0  0  0  0            999 V3000
M  V30 BEGIN CTAB
M  V30 COUNTS 2 1 0 0 0
M  V30 BEGIN ATOM
M  V30 1 C 0.0 1.0 2.0 0 CHG=1 -
M  V30 VALENCE=4
M  V30 2 O 3.0 4.0 5.0 0
M  V30 END ATOM
M  V30 BEGIN BOND
M  V30 1 1 1 2
M  V30 END BOND
M  V30 END CTAB
M  END
";
        let result = parse(mol).unwrap();
        assert_eq!(result.n_atoms, 2);
        assert_eq!(result.elements[0], 6); // C
        assert_eq!(result.elements[1], 8); // O
    }

    #[test]
    fn parse_v3000_sdf_fixture() {
        let text = std::fs::read_to_string(concat!(
            env!("CARGO_MANIFEST_DIR"),
            "/../../tests/fixtures/caffeine_v3000.sdf"
        ))
        .expect("read V3000 SDF fixture");
        let result = parse(&text).expect("parse V3000 SDF fixture");
        assert_eq!(result.n_atoms, 24); // caffeine: C8H10N4O2
        assert!(!result.bonds.is_empty());
        assert!(result.elements.contains(&6)); // C
        assert!(result.elements.contains(&7)); // N
        assert!(result.elements.contains(&8)); // O
    }

    #[test]
    fn v2000_unaffected_by_v3000_path() {
        // V2000 files must still parse correctly after the V3000 detection was added.
        let text = std::fs::read_to_string(concat!(
            env!("CARGO_MANIFEST_DIR"),
            "/../../tests/fixtures/ethanol.sdf"
        ))
        .expect("read ethanol SDF fixture");
        let result = parse(&text).expect("parse ethanol SDF");
        assert_eq!(result.n_atoms, 9); // C2H5OH: 9 heavy+H atoms
        assert_eq!(result.n_file_bonds, 8);
    }

    #[test]
    fn parse_v3000_empty_ctab_errors() {
        let mol = "\
name
prog
comment
  0  0  0  0  0  0            999 V3000
M  V30 BEGIN CTAB
M  V30 COUNTS 0 0 0 0 0
M  V30 BEGIN ATOM
M  V30 END ATOM
M  V30 END CTAB
M  END
";
        assert!(parse(mol).is_err());
    }

    // ── V2000 tests (unchanged) ──────────────────────────────────────────────

    const VALID_MOL: &str = "\
Molecule Name
  Program   timestamp
Comment line
  3  2  0  0  0  0  0  0  0  0999 V2000
    0.0000    1.0000    2.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    3.0000    4.0000    5.0000 O   0  0  0  0  0  0  0  0  0  0  0  0
    6.0000    7.0000    8.0000 N   0  0  0  0  0  0  0  0  0  0  0  0
  1  2  1  0  0  0  0
  2  3  2  0  0  0  0
M  END
";

    #[test]
    fn parse_valid_v2000() {
        let result = parse(VALID_MOL).unwrap();
        assert_eq!(result.n_atoms, 3);
        assert_eq!(result.n_file_bonds, 2);
        assert_eq!(
            result.positions,
            vec![0.0, 1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0]
        );
        assert_eq!(result.elements[0], 6); // C
        assert_eq!(result.elements[1], 8); // O
        assert_eq!(result.elements[2], 7); // N
        assert_eq!(result.bonds, vec![(0, 1), (1, 2)]);
        let orders = result.bond_orders.unwrap();
        assert_eq!(orders, vec![1, 2]);
    }

    #[test]
    fn parse_whitespace_delimited_fallback() {
        // Counts line must be fixed-width (3-char fields), but atom/bond lines can be short
        let mol = "\
name
prog
comment
  3  2  0  0  0  0  0  0  0  0999 V2000
0.0 1.0 2.0 C
3.0 4.0 5.0 O
6.0 7.0 8.0 N
1 2 1
2 3 2
M  END
";
        let result = parse(mol).unwrap();
        assert_eq!(result.n_atoms, 3);
        assert_eq!(result.n_file_bonds, 2);
        assert_eq!(
            result.positions,
            vec![0.0, 1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0]
        );
        assert_eq!(result.elements[0], 6);
        assert_eq!(result.bonds, vec![(0, 1), (1, 2)]);
    }

    #[test]
    fn error_too_short() {
        let mol = "line1\nline2\nline3\n";
        let Err(msg) = parse(mol) else {
            panic!("expected parse to fail for too-short input")
        };
        assert!(
            msg.contains("too short"),
            "expected 'too short' in error: {}",
            msg
        );
    }

    #[test]
    fn error_zero_atoms() {
        let mol = "\
name
prog
comment
  0  0  0  0  0  0  0  0  0  0999 V2000
M  END
";
        let Err(msg) = parse(mol) else {
            panic!("expected parse to fail for zero atoms")
        };
        assert!(
            msg.contains("zero atoms"),
            "expected 'zero atoms' in error: {}",
            msg
        );
    }

    #[test]
    fn error_malformed_counts() {
        let mol = "\
name
prog
comment
 xx  2
0.0 1.0 2.0 C
";
        assert!(parse(mol).is_err());
    }

    #[test]
    fn error_too_few_atom_lines() {
        let mol = "\
name
prog
comment
  3  0  0  0  0  0  0  0  0  0999 V2000
    0.0000    1.0000    2.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
M  END
";
        assert!(parse(mol).is_err());
    }

    #[test]
    fn error_malformed_atom_line() {
        let mol = "\
name
prog
comment
  1  0  0  0  0  0  0  0  0  0999 V2000
bad
";
        let Err(msg) = parse(mol) else {
            panic!("expected parse to fail for malformed atom line")
        };
        assert!(
            msg.contains("atom line") || msg.contains("bad"),
            "unexpected error message: {}",
            msg
        );
    }

    #[test]
    fn parse_mol_int_valid() {
        assert_eq!(parse_mol_int("  3  2", 0, 3).unwrap(), 3);
        assert_eq!(parse_mol_int("  3  2", 3, 6).unwrap(), 2);
    }

    #[test]
    fn parse_mol_int_out_of_range() {
        let result = parse_mol_int("ab", 5, 3);
        assert!(result.is_err());
    }

    #[test]
    fn parse_mol_int_non_numeric() {
        let result = parse_mol_int("abc", 0, 3);
        assert!(result.is_err());
        assert!(result.unwrap_err().contains("cannot parse integer"));
    }

    #[test]
    fn bond_order_sorted() {
        // Bonds should always be stored as (min, max)
        let mol = "\
name
prog
comment
  2  1  0  0  0  0  0  0  0  0999 V2000
0.0 1.0 2.0 C
3.0 4.0 5.0 O
2 1 1
M  END
";
        let result = parse(mol).unwrap();
        assert_eq!(result.bonds[0], (0, 1)); // sorted: min=0, max=1
    }
}
