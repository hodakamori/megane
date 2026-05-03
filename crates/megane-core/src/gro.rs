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

use crate::atomic::element_from_atom_name;
use crate::bonds;
use crate::trajectory::{VectorChannel, VectorFrame};

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
    let mut labels = Vec::with_capacity(n_atoms);
    // Velocity buffer: filled only when ALL atoms have velocity columns (line.len() >= 68).
    let mut velocities: Vec<f32> = Vec::with_capacity(n_atoms * 3);
    let mut has_velocities = true;

    for i in 0..n_atoms {
        let line = lines[i + 2];
        if line.len() < 44 {
            return Err(format!("GRO atom line {} too short", i + 1));
        }

        // Residue number (cols 0-5) and residue name (cols 5-10)
        let res_num = if line.len() >= 5 {
            line[0..5].trim()
        } else {
            ""
        };
        let res_name = if line.len() >= 10 {
            line[5..10].trim()
        } else {
            ""
        };
        labels.push(format!("{}{}", res_name, res_num));

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

        // Optional velocity columns (nm/ps): cols 44-52, 52-60, 60-68
        if has_velocities {
            let parsed = if line.len() >= 68 {
                let vx: Option<f32> = line[44..52].trim().parse().ok();
                let vy: Option<f32> = line[52..60].trim().parse().ok();
                let vz: Option<f32> = line[60..68].trim().parse().ok();
                vx.zip(vy).zip(vz).map(|((x, y), z)| (x, y, z))
            } else {
                None
            };
            if let Some((vx, vy, vz)) = parsed {
                velocities.push(vx);
                velocities.push(vy);
                velocities.push(vz);
            } else {
                // Atom lacks velocity columns or has unparseable values — disable channel.
                has_velocities = false;
                velocities.clear();
            }
        }
    }

    // Last line: box vectors
    let box_line = lines[n_atoms + 2].trim();
    let box_matrix = parse_box_line(box_line);

    // Infer bonds
    let empty_bonds = HashSet::new();
    let bonds = bonds::infer_bonds(&positions, &elements, n_atoms, &empty_bonds);

    let atom_labels = if labels.iter().any(|l| !l.is_empty()) {
        Some(labels)
    } else {
        None
    };

    // Build velocity channel when all atoms had valid velocity data.
    let vector_channels = if has_velocities && !velocities.is_empty() {
        vec![VectorChannel {
            name: "velocity".to_string(),
            frames: vec![VectorFrame {
                frame: 0,
                vectors: velocities,
            }],
        }]
    } else {
        vec![]
    };

    Ok(crate::parser::ParsedStructure {
        n_atoms,
        positions,
        elements,
        bonds,
        n_file_bonds: 0,
        bond_orders: None,
        box_matrix,
        frame_positions: Vec::new(),
        atom_labels,
        chain_ids: None,
        bfactors: None,
        vector_channels,
        ca_indices: vec![],
        ca_chain_ids: vec![],
        ca_res_nums: vec![],
        ca_ss_type: vec![],
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

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_parse_simple_gro() {
        let gro = "Water\n3\n    1SOL     OW    1   0.100   0.200   0.300\n    1SOL    HW1    2   0.150   0.250   0.350\n    1SOL    HW2    3   0.050   0.150   0.250\n   1.00000   1.00000   1.00000\n";
        let result = parse(gro).expect("parse failed");
        assert_eq!(result.n_atoms, 3);
        // Positions should be in Angstroms (nm * 10)
        assert!((result.positions[0] - 1.0).abs() < 0.01); // 0.100 nm → 1.0 Å
        assert!((result.positions[1] - 2.0).abs() < 0.01); // 0.200 nm → 2.0 Å
        assert!((result.positions[2] - 3.0).abs() < 0.01); // 0.300 nm → 3.0 Å
                                                           // Elements
        assert_eq!(result.elements[0], 8); // O
        assert_eq!(result.elements[1], 1); // H
        assert_eq!(result.elements[2], 1); // H
    }

    #[test]
    fn test_parse_gro_box() {
        let gro = "test\n1\n    1ALA      N    1   0.100   0.200   0.300\n   2.50000   3.00000   3.50000\n";
        let result = parse(gro).expect("parse failed");
        assert!(result.box_matrix.is_some());
        let bm = result.box_matrix.unwrap();
        assert!((bm[0] - 25.0).abs() < 0.01); // 2.5 nm → 25.0 Å
        assert!((bm[4] - 30.0).abs() < 0.01); // 3.0 nm → 30.0 Å
        assert!((bm[8] - 35.0).abs() < 0.01); // 3.5 nm → 35.0 Å
    }

    #[test]
    fn test_parse_gro_too_short() {
        let result = parse("title\n");
        assert!(result.is_err());
    }

    #[test]
    fn test_parse_box_line() {
        let m = parse_box_line("   1.00000   2.00000   3.00000").unwrap();
        assert!((m[0] - 10.0).abs() < 0.01);
        assert!((m[4] - 20.0).abs() < 0.01);
        assert!((m[8] - 30.0).abs() < 0.01);
    }

    #[test]
    fn test_parse_gro_no_velocities() {
        // Lines without velocity columns → no vector channels.
        let gro = "Water\n1\n    1SOL     OW    1   0.100   0.200   0.300\n   1.00000   1.00000   1.00000\n";
        let result = parse(gro).expect("parse failed");
        assert!(result.vector_channels.is_empty());
    }

    #[test]
    fn test_parse_gro_with_velocities() {
        // Atom line is exactly 68 chars or more → velocity channel produced.
        // GRO format: resnum(5) resname(5) atomname(5) atomnum(5) x(8) y(8) z(8) vx(8) vy(8) vz(8)
        let gro = "MD run\n2\n    1SOL     OW    1   0.100   0.200   0.300   0.010   0.020   0.030\n    1SOL    HW1    2   0.150   0.250   0.350  -0.005   0.015  -0.025\n   1.00000   1.00000   1.00000\n";
        let result = parse(gro).expect("parse failed");
        assert_eq!(result.vector_channels.len(), 1);
        let ch = &result.vector_channels[0];
        assert_eq!(ch.name, "velocity");
        assert_eq!(ch.frames.len(), 1);
        assert_eq!(ch.frames[0].frame, 0);
        let v = &ch.frames[0].vectors;
        assert_eq!(v.len(), 6); // 2 atoms × 3
        assert!((v[0] - 0.010).abs() < 0.001); // vx of atom 0
        assert!((v[1] - 0.020).abs() < 0.001); // vy of atom 0
        assert!((v[2] - 0.030).abs() < 0.001); // vz of atom 0
        assert!((v[3] - (-0.005)).abs() < 0.001); // vx of atom 1
    }

    #[test]
    fn test_parse_gro_partial_velocities_ignored() {
        // First atom has velocity columns, second does not → no channel emitted.
        let gro = "test\n2\n    1SOL     OW    1   0.100   0.200   0.300   0.010   0.020   0.030\n    1SOL    HW1    2   0.150   0.250   0.350\n   1.00000   1.00000   1.00000\n";
        let result = parse(gro).expect("parse failed");
        assert!(result.vector_channels.is_empty());
    }
}
