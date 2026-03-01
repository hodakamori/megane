/// MDL Molfile (V2000) parser.
///
/// Format:
///   Lines 1-3: header (molecule name, program/timestamp, comment)
///   Line 4: counts line (natoms nbonds ...)
///   Lines 5..4+natoms: atom block (x y z symbol ...)
///   Lines 5+natoms..4+natoms+nbonds: bond block (atom1 atom2 bond_order ...)
///   M  END

use crate::parser::symbol_to_atomic_num;

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
            let x: f32 = parts[0].parse().map_err(|_| format!("bad x at atom {}", i + 1))?;
            let y: f32 = parts[1].parse().map_err(|_| format!("bad y at atom {}", i + 1))?;
            let z: f32 = parts[2].parse().map_err(|_| format!("bad z at atom {}", i + 1))?;
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
            let a: u32 = parts[0].parse::<u32>().map_err(|_| format!("bad bond atom1 at bond {}", i + 1))? - 1;
            let b: u32 = parts[1].parse::<u32>().map_err(|_| format!("bad bond atom2 at bond {}", i + 1))? - 1;
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
    })
}

/// Parse an integer from a fixed-width field in a MOL file line.
fn parse_mol_int(line: &str, start: usize, end: usize) -> Result<usize, String> {
    let end = end.min(line.len());
    if start >= end {
        return Err(format!("field {}..{} out of range", start, end));
    }
    line[start..end]
        .trim()
        .parse()
        .map_err(|_| format!("cannot parse integer from '{}'", &line[start..end]))
}

