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
    // Extra frames only (frame 0 lives in `first_positions`), frame-major flat.
    let mut frame_positions_flat: Vec<f32> = Vec::new();
    let mut box_matrix: Option<[f32; 9]> = None;
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
            first_positions = Some(positions);
            first_elements = Some(elements);
            first_labels = Some(labels);
        } else if n_atoms == first_n_atoms {
            frame_positions_flat.extend_from_slice(&positions);
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
    })
}

/// Scan a multi-frame XYZ and record each EXTRA frame's byte offset without
/// decoding coordinates.
pub fn build_index(text: &str) -> Result<XyzIndex, String> {
    let lines: Vec<&str> = text.lines().collect();
    let starts = line_byte_starts(text);
    let mut offset = 0usize;
    let mut first_n_atoms: Option<usize> = None;
    let mut offsets: Vec<usize> = Vec::new();

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
        match first_n_atoms {
            None => {
                first_n_atoms = Some(n_atoms);
                // frame 0 is the eager snapshot — not an extra frame
            }
            Some(fn0) => {
                if n_atoms == fn0 {
                    offsets.push(starts[offset]);
                }
                // else: mismatched frame is dropped (matches eager)
            }
        }
        offset += 2 + n_atoms;
    }

    let n_atoms = first_n_atoms.ok_or("XYZ file contains no atoms")?;
    Ok(XyzIndex {
        n_atoms,
        n_extra_frames: offsets.len(),
        offsets,
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
    }

    #[test]
    fn test_multiframe_skips_mismatched_atom_count() {
        // Second frame has a different atom count and must be dropped.
        let text = "2\nframe 0\nH 0.0 0.0 0.0\nH 1.0 0.0 0.0\n\
                    1\nframe 1\nH 5.0 0.0 0.0\n";
        let result = parse(text).expect("parse XYZ");
        assert_eq!(result.n_atoms, 2);
        assert_eq!(result.extra_frame_count(), 0);
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
