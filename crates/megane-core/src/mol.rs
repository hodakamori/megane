/// MDL Molfile (V2000) parser.
///
/// Format:
///   Lines 1-3: header (molecule name, program/timestamp, comment)
///   Line 4: counts line (natoms nbonds ...)
///   Lines 5..4+natoms: atom block (x y z symbol ...)
///   Lines 5+natoms..4+natoms+nbonds: bond block (atom1 atom2 bond_order ...)
///   M  END
use crate::atomic::symbol_to_atomic_num;

pub fn parse(text: &str) -> Result<crate::parser::ParsedStructure, String> {
    let lines: Vec<&str> = text.lines().collect();
    if lines.len() < 5 {
        return Err("MOL file too short".into());
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
        b_factors: None,
        vector_channels: vec![],
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
