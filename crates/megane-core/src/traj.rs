/// ASE .traj (ULM binary format) parser.
///
/// The ULM format stores frames as binary array data + JSON metadata.
/// Each frame contains atomic positions, elements, and optionally cell vectors.
use std::collections::HashSet;

use crate::bonds;
use crate::parser::ParsedStructure;

const ULM_MAGIC: &[u8; 8] = b"- of Ulm";

// ---------- Binary readers ----------

fn read_bytes<const N: usize>(data: &[u8], pos: usize, type_name: &str) -> Result<[u8; N], String> {
    data.get(pos..pos + N)
        .and_then(|s| s.try_into().ok())
        .ok_or_else(|| format!("unexpected EOF reading {} at offset {}", type_name, pos))
}

fn read_i64(data: &[u8], pos: usize, little_endian: bool) -> Result<i64, String> {
    let bytes = read_bytes::<8>(data, pos, "i64")?;
    Ok(if little_endian {
        i64::from_le_bytes(bytes)
    } else {
        i64::from_be_bytes(bytes)
    })
}

fn read_f64(data: &[u8], pos: usize, little_endian: bool) -> Result<f64, String> {
    let bytes = read_bytes::<8>(data, pos, "f64")?;
    Ok(if little_endian {
        f64::from_le_bytes(bytes)
    } else {
        f64::from_be_bytes(bytes)
    })
}

fn read_f32_raw(data: &[u8], pos: usize, little_endian: bool) -> Result<f32, String> {
    let bytes = read_bytes::<4>(data, pos, "f32")?;
    Ok(if little_endian {
        f32::from_le_bytes(bytes)
    } else {
        f32::from_be_bytes(bytes)
    })
}

fn read_i32(data: &[u8], pos: usize, little_endian: bool) -> Result<i32, String> {
    let bytes = read_bytes::<4>(data, pos, "i32")?;
    Ok(if little_endian {
        i32::from_le_bytes(bytes)
    } else {
        i32::from_be_bytes(bytes)
    })
}

// ---------- Array reading helpers ----------

/// Read an ndarray from binary data given shape, dtype, and file offset.
/// Returns values as Vec<f64> (converted from the source dtype).
fn read_ndarray_f64(
    data: &[u8],
    offset: usize,
    shape: &[usize],
    dtype: &str,
    little_endian: bool,
) -> Result<Vec<f64>, String> {
    let n_elements: usize = shape.iter().product();
    let mut result = Vec::with_capacity(n_elements);

    match dtype {
        "float64" => {
            for i in 0..n_elements {
                result.push(read_f64(data, offset + i * 8, little_endian)?);
            }
        }
        "float32" => {
            for i in 0..n_elements {
                result.push(read_f32_raw(data, offset + i * 4, little_endian)? as f64);
            }
        }
        _ => return Err(format!("unsupported float dtype: {}", dtype)),
    }
    Ok(result)
}

/// Read an ndarray as integers (for atomic numbers etc.)
fn read_ndarray_int(
    data: &[u8],
    offset: usize,
    shape: &[usize],
    dtype: &str,
    little_endian: bool,
) -> Result<Vec<i64>, String> {
    let n_elements: usize = shape.iter().product();
    let mut result = Vec::with_capacity(n_elements);

    match dtype {
        "int64" => {
            for i in 0..n_elements {
                result.push(read_i64(data, offset + i * 8, little_endian)?);
            }
        }
        "int32" => {
            for i in 0..n_elements {
                result.push(read_i32(data, offset + i * 4, little_endian)? as i64);
            }
        }
        "uint8" => {
            for i in 0..n_elements {
                if offset + i >= data.len() {
                    return Err("unexpected EOF reading uint8 array".into());
                }
                result.push(data[offset + i] as i64);
            }
        }
        "int8" => {
            for i in 0..n_elements {
                if offset + i >= data.len() {
                    return Err("unexpected EOF reading int8 array".into());
                }
                result.push(data[offset + i] as i8 as i64);
            }
        }
        "int16" => {
            for i in 0..n_elements {
                let pos = offset + i * 2;
                if pos + 2 > data.len() {
                    return Err("unexpected EOF reading int16 array".into());
                }
                let bytes: [u8; 2] = read_bytes::<2>(data, pos, "i16")?;
                let val = if little_endian {
                    i16::from_le_bytes(bytes)
                } else {
                    i16::from_be_bytes(bytes)
                };
                result.push(val as i64);
            }
        }
        _ => return Err(format!("unsupported integer dtype: {}", dtype)),
    }
    Ok(result)
}

// ---------- JSON metadata parsing ----------

/// Extract ndarray info from a JSON value like {"ndarray": [shape, dtype, offset]}
fn parse_ndarray_ref(value: &serde_json::Value) -> Option<(Vec<usize>, String, usize)> {
    let obj = value.as_object()?;
    let arr = obj.get("ndarray")?.as_array()?;
    if arr.len() != 3 {
        return None;
    }

    // shape can be a single int or array of ints
    let shape = match &arr[0] {
        serde_json::Value::Array(dims) => dims
            .iter()
            .filter_map(|d| d.as_u64().map(|v| v as usize))
            .collect(),
        serde_json::Value::Number(n) => vec![n.as_u64()? as usize],
        _ => return None,
    };

    let dtype = arr[1].as_str()?.to_string();
    let offset = arr[2].as_u64()? as usize;

    Some((shape, dtype, offset))
}

/// Read JSON metadata section at the given file offset.
/// Returns the parsed JSON value.
fn read_json_metadata(
    data: &[u8],
    offset: usize,
    little_endian: bool,
) -> Result<serde_json::Value, String> {
    let json_len = read_i64(data, offset, little_endian)? as usize;
    let json_start = offset + 8;
    let json_end = json_start + json_len;
    if json_end > data.len() {
        return Err(format!(
            "JSON metadata extends past EOF: {}+{} > {}",
            json_start,
            json_len,
            data.len()
        ));
    }
    let json_str = std::str::from_utf8(&data[json_start..json_end])
        .map_err(|e| format!("invalid UTF-8 in JSON: {}", e))?;
    serde_json::from_str(json_str).map_err(|e| format!("JSON parse error: {}", e))
}

/// Extract positions (float array) from a frame's JSON metadata.
fn extract_positions(
    data: &[u8],
    json: &serde_json::Value,
    little_endian: bool,
) -> Result<Vec<f32>, String> {
    // Try "positions." key (ndarray reference)
    if let Some(val) = json.get("positions.") {
        if let Some((shape, dtype, offset)) = parse_ndarray_ref(val) {
            let raw = read_ndarray_f64(data, offset, &shape, &dtype, little_endian)?;
            return Ok(raw.iter().map(|&v| v as f32).collect());
        }
    }

    // Try "positions" as inline list
    if let Some(arr) = json.get("positions").and_then(|v| v.as_array()) {
        let mut positions = Vec::new();
        for row in arr {
            if let Some(coords) = row.as_array() {
                for c in coords {
                    positions.push(c.as_f64().unwrap_or(0.0) as f32);
                }
            }
        }
        if !positions.is_empty() {
            return Ok(positions);
        }
    }

    Err("no positions found in frame".into())
}

/// Extract atomic numbers from a frame's JSON metadata.
fn extract_numbers(
    data: &[u8],
    json: &serde_json::Value,
    little_endian: bool,
) -> Result<Vec<u8>, String> {
    // Try "numbers." key (ndarray reference)
    if let Some(val) = json.get("numbers.") {
        if let Some((shape, dtype, offset)) = parse_ndarray_ref(val) {
            let raw = read_ndarray_int(data, offset, &shape, &dtype, little_endian)?;
            return Ok(raw.iter().map(|&v| v.clamp(0, 255) as u8).collect());
        }
    }

    // Try "numbers" as inline list
    if let Some(arr) = json.get("numbers").and_then(|v| v.as_array()) {
        return Ok(arr
            .iter()
            .map(|v| v.as_u64().unwrap_or(0).clamp(0, 255) as u8)
            .collect());
    }

    Err("no atomic numbers found in frame".into())
}

/// Extract cell matrix from a frame's JSON metadata.
fn extract_cell(data: &[u8], json: &serde_json::Value, little_endian: bool) -> Option<[f32; 9]> {
    // Try "cell." key (ndarray reference)
    if let Some(val) = json.get("cell.") {
        if let Some((shape, dtype, offset)) = parse_ndarray_ref(val) {
            if let Ok(raw) = read_ndarray_f64(data, offset, &shape, &dtype, little_endian) {
                if raw.len() >= 9 {
                    let mut mat = [0f32; 9];
                    for (i, &v) in raw.iter().take(9).enumerate() {
                        mat[i] = v as f32;
                    }
                    // Check if cell is non-zero
                    if mat.iter().any(|&v| v.abs() > 1e-10) {
                        return Some(mat);
                    }
                }
            }
        }
    }

    // Try "cell" as inline list (3x3)
    if let Some(arr) = json.get("cell").and_then(|v| v.as_array()) {
        let mut mat = [0f32; 9];
        let mut idx = 0;
        for row in arr {
            if let Some(cols) = row.as_array() {
                for c in cols {
                    if idx < 9 {
                        mat[idx] = c.as_f64().unwrap_or(0.0) as f32;
                        idx += 1;
                    }
                }
            }
        }
        if idx == 9 && mat.iter().any(|&v| v.abs() > 1e-10) {
            return Some(mat);
        }
    }

    None
}

// ---------- Public API ----------

/// Parse an ASE .traj file (ULM binary format) and return a ParsedStructure.
///
/// The first frame defines the topology (elements, bonds). All frame positions
/// are collected into `frame_positions`.
pub fn parse_traj(data: &[u8]) -> Result<ParsedStructure, String> {
    if data.len() < 48 {
        return Err("file too small for ULM header".into());
    }

    // Validate magic
    if &data[0..8] != ULM_MAGIC {
        return Err("not a ULM file (bad magic)".into());
    }

    // Determine endianness: ULM header integers are written in the machine's
    // native byte order.  We try little-endian first (the common case) and
    // fall back to big-endian if the values look unreasonable.
    let (little_endian_header, version, nitems, pos0) = {
        let hdr_v = read_bytes::<8>(data, 24, "version")?;
        let hdr_n = read_bytes::<8>(data, 32, "nitems")?;
        let hdr_p = read_bytes::<8>(data, 40, "pos0")?;

        let v_le = i64::from_le_bytes(hdr_v);
        let n_le = i64::from_le_bytes(hdr_n);
        let p_le = i64::from_le_bytes(hdr_p);

        if v_le > 0 && v_le <= 10 && n_le > 0 && n_le < 1_000_000_000 && p_le > 0 {
            (true, v_le, n_le as usize, p_le as usize)
        } else {
            let v_be = i64::from_be_bytes(hdr_v);
            let n_be = i64::from_be_bytes(hdr_n);
            let p_be = i64::from_be_bytes(hdr_p);
            if v_be > 0 && v_be <= 10 && n_be > 0 {
                (false, v_be, n_be as usize, p_be as usize)
            } else {
                return Err(format!(
                    "cannot determine ULM endianness (version_le={}, version_be={})",
                    v_le, v_be
                ));
            }
        }
    };

    let _ = version; // We support all known versions

    // Read offset table
    if pos0 + nitems * 8 > data.len() {
        return Err("offset table extends past EOF".into());
    }
    let mut offsets = Vec::with_capacity(nitems);
    for i in 0..nitems {
        let off = read_i64(data, pos0 + i * 8, little_endian_header)? as usize;
        offsets.push(off);
    }

    if offsets.is_empty() {
        return Err("no frames in .traj file".into());
    }

    // Parse first frame to get element info
    let first_json = read_json_metadata(data, offsets[0], little_endian_header)?;

    // Check _little_endian flag in JSON (may differ from header endianness)
    let array_le = first_json
        .get("_little_endian")
        .and_then(|v| v.as_bool())
        .unwrap_or(true);

    let elements = extract_numbers(data, &first_json, array_le)?;
    let n_atoms = elements.len();

    if n_atoms == 0 {
        return Err("zero atoms in first frame".into());
    }

    let box_matrix = extract_cell(data, &first_json, array_le);

    // Collect positions from all frames
    let mut all_positions: Vec<Vec<f32>> = Vec::with_capacity(nitems);
    for (i, &off) in offsets.iter().enumerate() {
        let json = if i == 0 {
            first_json.clone()
        } else {
            read_json_metadata(data, off, little_endian_header)?
        };
        let frame_le = json
            .get("_little_endian")
            .and_then(|v| v.as_bool())
            .unwrap_or(true);
        let pos = extract_positions(data, &json, frame_le)?;
        if pos.len() != n_atoms * 3 {
            return Err(format!(
                "frame {} has {} coordinates, expected {}",
                i,
                pos.len(),
                n_atoms * 3
            ));
        }
        all_positions.push(pos);
    }

    // First frame positions go into `positions`, rest into `frame_positions`
    let positions = all_positions.remove(0);
    let frame_positions = all_positions;

    // Infer bonds from first frame
    let empty_bonds: HashSet<(u32, u32)> = HashSet::new();
    let bonds = bonds::infer_bonds(&positions, &elements, n_atoms, &empty_bonds);

    Ok(ParsedStructure {
        n_atoms,
        positions,
        elements,
        bonds,
        n_file_bonds: 0,
        bond_orders: None,
        box_matrix,
        frame_positions,
        atom_labels: None,
        chain_ids: None,
        b_factors: None,
        vector_channels: vec![],
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_parse_traj() {
        let path = concat!(
            env!("CARGO_MANIFEST_DIR"),
            "/../../tests/fixtures/water.traj"
        );
        let data = match std::fs::read(path) {
            Ok(d) => d,
            Err(_) => {
                eprintln!("skipping test: water.traj not found (run generate_test_traj.py)");
                return;
            }
        };
        let result = parse_traj(&data).expect("parse traj");
        assert_eq!(result.n_atoms, 3); // water: O + 2H
        assert!(!result.frame_positions.is_empty()); // at least 1 frame
        assert_eq!(result.positions.len(), 9); // 3 atoms * 3 coords
        assert!(result.elements.contains(&8)); // oxygen
        assert!(result.elements.contains(&1)); // hydrogen
    }
}
