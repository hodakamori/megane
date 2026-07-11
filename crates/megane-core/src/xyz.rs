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
    // Frame-0 lattice (also the fallback cell carried into frames that omit one).
    let mut box_matrix: Option<[f32; 9]> = None;
    // Extra frames only (frame 0 lives in `first_positions`), frame-major flat.
    let mut frame_positions_flat: Vec<f32> = Vec::new();
    // Prefix-sum of atom counts over EXTRA frames (seeded with 0); only consumed
    // when the trajectory turns out to be heterogeneous.
    let mut atom_offsets: Vec<u32> = vec![0];
    // Heterogeneity flags + lazily-recorded per-extra-frame snapshots. Nothing is
    // recorded until a channel is first seen to vary, so a uniform multi-frame
    // XYZ allocates no side table and keeps the fixed-stride fast path.
    let mut varies_atoms = false;
    let mut varies_topology = false;
    let mut varies_cell = false;
    let mut max_atoms = 0usize;
    let mut per_frame_elements: Vec<Vec<u8>> = Vec::new();
    let mut per_frame_cells: Vec<[f32; 9]> = Vec::new();
    let mut recording_topo = false;
    let mut recording_cell = false;
    let mut extra_idx = 0usize;
    // Reused across every atom line so each line's split does not allocate a Vec.
    let mut parts: Vec<&str> = Vec::new();

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

        // Line 2: comment — parse this frame's lattice if present.
        let frame_lattice = parse_lattice(lines[offset + 1]);
        offset += 2;

        let mut positions = Vec::with_capacity(n_atoms * 3);
        let mut elements = Vec::with_capacity(n_atoms);
        let mut labels = Vec::with_capacity(n_atoms);

        for i in 0..n_atoms {
            let line = lines[offset + i];
            parts.clear();
            parts.extend(line.split_whitespace());
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
            max_atoms = n_atoms;
            box_matrix = frame_lattice;
            first_positions = Some(positions);
            first_elements = Some(elements);
            first_labels = Some(labels);
            continue;
        }

        // Extra frame: append positions (jagged — every frame is kept now, unlike
        // the old fixed-stride path that silently dropped mismatched frames).
        frame_positions_flat.extend_from_slice(&positions);
        let last = *atom_offsets.last().unwrap();
        atom_offsets.push(last + n_atoms as u32);
        max_atoms = max_atoms.max(n_atoms);

        // Classify this frame's variation against frame 0.
        let first_elems = first_elements.as_ref().unwrap();
        if n_atoms != first_n_atoms {
            varies_atoms = true;
        }
        if !varies_topology && elements != *first_elems {
            varies_topology = true;
        }
        // A frame that omits `Lattice=` inherits frame 0's cell (no variation);
        // only a present-and-different lattice counts as a change.
        if !varies_cell {
            if let Some(fl) = frame_lattice {
                if Some(fl) != box_matrix {
                    varies_cell = true;
                }
            }
        }

        // Lazily begin recording per-frame topology, backfilling the earlier
        // (uniform) extra frames with frame-0 elements the first time we diverge.
        if (varies_atoms || varies_topology) && !recording_topo {
            for _ in 0..extra_idx {
                per_frame_elements.push(first_elems.clone());
            }
            recording_topo = true;
        }
        if recording_topo {
            per_frame_elements.push(elements);
        }

        // Same lazy scheme for per-frame cells.
        if varies_cell && !recording_cell {
            for _ in 0..extra_idx {
                per_frame_cells.push(box_matrix.unwrap_or([0.0; 9]));
            }
            recording_cell = true;
        }
        if recording_cell {
            per_frame_cells.push(frame_lattice.or(box_matrix).unwrap_or([0.0; 9]));
        }

        extra_idx += 1;
    }

    let positions = first_positions.ok_or("XYZ file contains no atoms")?;
    // SAFETY: first_elements is always set when first_positions is set
    let elements = first_elements.ok_or("XYZ file contains no atoms")?;

    // Infer bonds from first frame
    let empty_bonds = HashSet::new();
    let bonds = bonds::infer_bonds(&positions, &elements, first_n_atoms, &empty_bonds);

    let atom_labels = first_labels.filter(|labels| labels.iter().any(|l| !l.is_empty()));

    // Assemble the heterogeneous side-table only when some channel varies; a
    // uniform multi-frame XYZ keeps `hetero: None` and the fast fixed-stride path.
    let hetero = if varies_atoms || varies_cell || varies_topology {
        let (elements_flat, bonds_flat, bond_offsets) = if varies_atoms || varies_topology {
            let mut elements_flat: Vec<u8> = Vec::new();
            let mut bonds_flat: Vec<u32> = Vec::new();
            let mut bond_offsets: Vec<u32> = Vec::with_capacity(per_frame_elements.len() + 1);
            bond_offsets.push(0);
            for (k, elems) in per_frame_elements.iter().enumerate() {
                let a = atom_offsets[k] as usize * 3;
                let b = atom_offsets[k + 1] as usize * 3;
                let fpos = &frame_positions_flat[a..b];
                let fbonds = bonds::infer_bonds(fpos, elems, elems.len(), &empty_bonds);
                for (u, v) in &fbonds {
                    bonds_flat.push(*u);
                    bonds_flat.push(*v);
                }
                let last = *bond_offsets.last().unwrap();
                bond_offsets.push(last + fbonds.len() as u32);
                elements_flat.extend_from_slice(elems);
            }
            (elements_flat, bonds_flat, bond_offsets)
        } else {
            (Vec::new(), Vec::new(), Vec::new())
        };
        let cells_flat = if varies_cell {
            let mut cf = Vec::with_capacity(per_frame_cells.len() * 9);
            for c in &per_frame_cells {
                cf.extend_from_slice(c);
            }
            cf
        } else {
            Vec::new()
        };
        Some(crate::parser::HeteroFrames {
            atom_offsets,
            elements_flat,
            cells_flat,
            bond_offsets,
            bonds_flat,
            varies_atoms,
            varies_cell,
            varies_topology,
            max_atoms: max_atoms as u32,
        })
    } else {
        None
    };

    Ok(crate::parser::ParsedStructure {
        n_atoms: first_n_atoms,
        positions,
        elements,
        bonds,
        n_file_bonds: 0,
        bond_orders: None,
        box_matrix,
        frame_positions_flat,
        atom_labels,
        chain_ids: None,
        bfactors: None,
        vector_channels: vec![],
        ca_indices: vec![],
        ca_chain_ids: vec![],
        ca_res_nums: vec![],
        ca_ss_type: vec![],
        symmetry_ops: Vec::new(),
        hetero,
    })
}

// ---------- Lazy / streaming support ----------

/// Byte offset of each line, so the index scan can record where each frame
/// begins in the raw text (for lazy per-frame decode from that offset).
fn line_byte_starts(text: &str) -> Vec<usize> {
    let mut starts = Vec::new();
    let mut pos = 0usize;
    for line in text.split('\n') {
        starts.push(pos);
        pos += line.len() + 1;
    }
    starts
}

/// Lightweight index over a multi-frame XYZ: byte offset of each EXTRA frame
/// (frames 1..N; frame 0 is the eager snapshot), built without parsing
/// coordinates. Frames whose atom count differs from frame 0 are skipped, exactly
/// as the eager parser drops them.
pub struct XyzIndex {
    pub n_atoms: usize,
    /// Number of extra frames (excludes frame 0).
    pub n_extra_frames: usize,
    /// Byte offset of each extra frame's count line.
    pub offsets: Vec<usize>,
    /// True when the file is *heterogeneous* — some frame's atom count or
    /// per-frame `Lattice=` differs from frame 0. The lazy positions-only decode
    /// path cannot represent such frames, so the host falls back to an eager
    /// parse (which builds the full `HeteroFrames` side table). Detected cheaply
    /// from the count and comment lines without decoding any atom coordinates.
    /// (A same-atom-count frame that varies only in element identity is not
    /// detectable here without parsing atoms and is left to the eager path.)
    pub heterogeneous: bool,
}

/// Parse only the first frame of an XYZ file into a `ParsedStructure` (topology,
/// elements, bonds, box, frame-0 coordinates), leaving `frame_positions_flat`
/// empty. Used to build the lazy snapshot without decoding every frame.
pub fn parse_frame0(text: &str) -> Result<crate::parser::ParsedStructure, String> {
    let lines: Vec<&str> = text.lines().collect();
    if lines.len() < 3 {
        return Err("XYZ file too short".into());
    }

    let mut offset = 0;
    // Skip leading blank count lines (matches the eager parser).
    while offset < lines.len() && lines[offset].trim().is_empty() {
        offset += 1;
    }
    if offset + 2 > lines.len() {
        return Err("XYZ file contains no atoms".into());
    }
    let n_atoms: usize = lines[offset]
        .trim()
        .parse()
        .map_err(|_| format!("cannot parse atom count at line {}", offset + 1))?;
    if offset + 2 + n_atoms > lines.len() {
        return Err("XYZ first frame incomplete".into());
    }

    let box_matrix = parse_lattice(lines[offset + 1]);
    offset += 2;

    let mut positions = Vec::with_capacity(n_atoms * 3);
    let mut elements = Vec::with_capacity(n_atoms);
    let mut labels = Vec::with_capacity(n_atoms);
    let mut parts: Vec<&str> = Vec::new();
    for i in 0..n_atoms {
        let line = lines[offset + i];
        parts.clear();
        parts.extend(line.split_whitespace());
        if parts.len() < 4 {
            return Err(format!("XYZ atom line {} too short", offset + i + 1));
        }
        let sym = crate::parser::capitalize(parts[0]);
        elements.push(symbol_to_atomic_num(&sym));
        let label = if parts.len() > 4 {
            parts[4..].join(" ")
        } else {
            String::new()
        };
        labels.push(label);
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

    let empty_bonds = HashSet::new();
    let bonds = bonds::infer_bonds(&positions, &elements, n_atoms, &empty_bonds);
    let atom_labels = if labels.iter().any(|l| !l.is_empty()) {
        Some(labels)
    } else {
        None
    };

    Ok(crate::parser::ParsedStructure {
        n_atoms,
        positions,
        elements,
        bonds,
        n_file_bonds: 0,
        bond_orders: None,
        box_matrix,
        frame_positions_flat: Vec::new(),
        atom_labels,
        chain_ids: None,
        bfactors: None,
        vector_channels: vec![],
        ca_indices: vec![],
        ca_chain_ids: vec![],
        ca_res_nums: vec![],
        ca_ss_type: vec![],
        symmetry_ops: Vec::new(),
        hetero: None,
    })
}

/// Scan a multi-frame XYZ and record each EXTRA frame's byte offset without
/// decoding coordinates.
pub fn build_index(text: &str) -> Result<XyzIndex, String> {
    let lines: Vec<&str> = text.lines().collect();
    let starts = line_byte_starts(text);
    let mut offset = 0usize;
    let mut first_n_atoms: Option<usize> = None;
    let mut first_lattice: Option<[f32; 9]> = None;
    let mut offsets: Vec<usize> = Vec::new();
    let mut heterogeneous = false;

    while offset < lines.len() {
        let count_line = lines[offset].trim();
        if count_line.is_empty() {
            offset += 1;
            continue;
        }
        let n_atoms: usize = match count_line.parse() {
            Ok(n) => n,
            Err(_) => return Err(format!("cannot parse atom count at line {}", offset + 1)),
        };
        if offset + 2 + n_atoms > lines.len() {
            break; // incomplete frame, matches eager
        }
        let frame_lattice = parse_lattice(lines[offset + 1]);
        match first_n_atoms {
            None => {
                first_n_atoms = Some(n_atoms);
                first_lattice = frame_lattice;
                // frame 0 is the eager snapshot — not an extra frame
            }
            Some(fn0) => {
                if n_atoms != fn0 {
                    heterogeneous = true;
                }
                // A present-and-different per-frame cell also makes the file
                // heterogeneous (a missing lattice inherits frame 0's cell).
                if let Some(fl) = frame_lattice {
                    if Some(fl) != first_lattice {
                        heterogeneous = true;
                    }
                }
                offsets.push(starts[offset]);
            }
        }
        offset += 2 + n_atoms;
    }

    let n_atoms = first_n_atoms.ok_or("XYZ file contains no atoms")?;
    Ok(XyzIndex {
        n_atoms,
        n_extra_frames: offsets.len(),
        offsets,
        heterogeneous,
    })
}

/// Decode a single XYZ frame's positions (Å) given its count-line byte offset.
pub fn decode_frame_at(
    text: &str,
    byte_offset: usize,
    expected_n_atoms: usize,
) -> Result<Vec<f32>, String> {
    if byte_offset > text.len() {
        return Err("frame offset past end of data".into());
    }
    let slice = &text[byte_offset..];
    let mut it = slice.lines();
    let count_line = it.next().ok_or("empty frame")?.trim();
    let n_atoms: usize = count_line
        .parse()
        .map_err(|_| "frame offset is not at a count-line boundary".to_string())?;
    if n_atoms != expected_n_atoms {
        return Err(format!(
            "frame atom count {} != expected {}",
            n_atoms, expected_n_atoms
        ));
    }
    let _comment = it.next().ok_or("missing comment line")?;
    let mut positions = Vec::with_capacity(n_atoms * 3);
    let mut parts: Vec<&str> = Vec::new();
    for _ in 0..n_atoms {
        let line = it.next().ok_or("truncated frame")?;
        parts.clear();
        parts.extend(line.split_whitespace());
        if parts.len() < 4 {
            return Err("XYZ atom line too short".into());
        }
        let x: f32 = parts[1].parse().map_err(|_| "bad x coord".to_string())?;
        let y: f32 = parts[2].parse().map_err(|_| "bad y coord".to_string())?;
        let z: f32 = parts[3].parse().map_err(|_| "bad z coord".to_string())?;
        positions.push(x);
        positions.push(y);
        positions.push(z);
    }
    Ok(positions)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_parse_multiframe_flat() {
        // Two frames of 2 atoms each; frame 0 lives in `positions`, frame 1 flat.
        let text = "2\nframe 0\nH 0.0 0.0 0.0\nH 1.0 0.0 0.0\n\
                    2\nframe 1\nH 0.0 0.0 0.0\nH 2.0 0.0 0.0\n";
        let result = parse(text).expect("parse multi-frame XYZ");
        assert_eq!(result.n_atoms, 2);
        // Frame 0 coordinates in `positions`.
        assert!((result.positions[3] - 1.0).abs() < 1e-5);
        // One extra frame stored flat.
        assert_eq!(result.extra_frame_count(), 1);
        let f1 = result.frame(0);
        assert_eq!(f1.len(), 6);
        assert!((f1[3] - 2.0).abs() < 1e-5); // second atom x moved to 2.0
                                             // Uniform trajectory: fast path, no side table allocated.
        assert!(result.hetero.is_none());
    }

    #[test]
    fn test_multiframe_variable_atom_count() {
        // The second frame has a different atom count. It used to be silently
        // dropped; now it is captured as a heterogeneous extra frame.
        let text = "2\nframe 0\nH 0.0 0.0 0.0\nH 1.0 0.0 0.0\n\
                    1\nframe 1\nO 5.0 0.0 0.0\n";
        let result = parse(text).expect("parse XYZ");
        assert_eq!(result.n_atoms, 2);
        assert_eq!(result.extra_frame_count(), 1);
        let h = result.hetero.as_ref().expect("heterogeneous side table");
        assert!(h.varies_atoms);
        assert!(h.varies_topology); // atom count change implies element change
        assert_eq!(h.max_atoms, 2);
        // Extra frame 0 (overall frame 1) has a single atom at x=5.
        assert_eq!(result.frame_atom_count(0), 1);
        let f0 = result.frame(0);
        assert_eq!(f0.len(), 3);
        assert!((f0[0] - 5.0).abs() < 1e-5);
        // Its per-frame element is oxygen (8), not the frame-0 hydrogens.
        let elems = result.frame_elements(0).expect("per-frame elements");
        assert_eq!(elems, &[8u8]);
    }

    #[test]
    fn test_multiframe_variable_cell() {
        // Constant 1-atom topology, per-frame Lattice= changes → varies_cell only.
        let text = "1\nLattice=\"10 0 0 0 10 0 0 0 10\"\nH 0 0 0\n\
                    1\nLattice=\"12 0 0 0 12 0 0 0 12\"\nH 0 0 0\n";
        let result = parse(text).expect("parse XYZ");
        let h = result.hetero.as_ref().expect("heterogeneous side table");
        assert!(h.varies_cell);
        assert!(!h.varies_atoms);
        assert!(!h.varies_topology);
        // Frame-0 cell is 10; extra frame 0 (overall frame 1) is 12.
        assert!((result.box_matrix.unwrap()[0] - 10.0).abs() < 1e-5);
        let cell = result.frame_cell(0).expect("per-frame cell");
        assert!((cell[0] - 12.0).abs() < 1e-5);
        // Topology unchanged → no per-frame elements table.
        assert!(result.frame_elements(0).is_none());
    }

    #[test]
    fn test_multiframe_variable_topology_same_count() {
        // Same atom count, element identity changes → varies_topology, not atoms.
        let text = "1\ncomment\nH 0 0 0\n\
                    1\ncomment\nO 0 0 0\n";
        let result = parse(text).expect("parse XYZ");
        let h = result.hetero.as_ref().expect("heterogeneous side table");
        assert!(h.varies_topology);
        assert!(!h.varies_atoms);
        let elems = result.frame_elements(0).expect("per-frame elements");
        assert_eq!(elems, &[8u8]);
    }

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

    #[test]
    fn lazy_frame0_and_decode_match_eager() {
        let text = std::fs::read_to_string(concat!(
            env!("CARGO_MANIFEST_DIR"),
            "/../../tests/fixtures/water_multiframe.xyz"
        ))
        .expect("read fixture");

        let eager = parse(&text).unwrap();
        let f0 = parse_frame0(&text).unwrap();
        let idx = build_index(&text).unwrap();

        // Frame-0 snapshot is byte-identical to the eager frame 0.
        assert_eq!(f0.positions, eager.positions);
        assert_eq!(f0.elements, eager.elements);
        assert_eq!(f0.n_atoms, eager.n_atoms);
        assert!(f0.frame_positions_flat.is_empty());

        assert_eq!(idx.n_atoms, eager.n_atoms);
        assert_eq!(idx.n_extra_frames, eager.extra_frame_count());

        // Every extra frame decoded lazily is byte-identical to the eager frame.
        for k in 0..idx.n_extra_frames {
            let p = decode_frame_at(&text, idx.offsets[k], idx.n_atoms).unwrap();
            assert_eq!(p, eager.frame(k).to_vec(), "extra frame {k}");
        }
    }
}
