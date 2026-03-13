/// LAMMPS dump trajectory (.lammpstrj) parser.
///
/// Text-based multi-frame format. Returns trajectory data (positions + box)
/// without topology — element/bond info comes from a separate structure file.
///
/// Supports coordinate columns: x/y/z (unscaled), xs/ys/zs (scaled),
/// xu/yu/zu (unwrapped). Atoms are sorted by id within each frame.

/// Parsed LAMMPS dump trajectory data.
pub struct LammpstrjData {
    pub n_atoms: usize,
    pub n_frames: usize,
    pub timestep_ps: f32,
    pub box_matrix: Option<[f32; 9]>,
    pub frame_positions: Vec<Vec<f32>>,
}

/// Detected coordinate type.
#[derive(Clone, Copy)]
enum CoordType {
    /// Unscaled Cartesian (x, y, z)
    Unscaled,
    /// Scaled/fractional (xs, ys, zs)
    Scaled,
    /// Unwrapped Cartesian (xu, yu, zu)
    Unwrapped,
}

/// Column indices for atom data.
struct ColumnLayout {
    id_col: usize,
    x_col: usize,
    y_col: usize,
    z_col: usize,
    coord_type: CoordType,
}

fn parse_column_layout(header: &str) -> Result<ColumnLayout, String> {
    // Header looks like: "ITEM: ATOMS id type x y z" or "ITEM: ATOMS id type xs ys zs"
    let cols: Vec<&str> = header.split_whitespace().collect();
    // Skip "ITEM:" and "ATOMS"
    let col_names: Vec<&str> = if cols.len() > 2 && cols[0] == "ITEM:" && cols[1] == "ATOMS" {
        cols[2..].to_vec()
    } else {
        return Err("Invalid ITEM: ATOMS header".to_string());
    };

    let find = |name: &str| -> Option<usize> {
        col_names.iter().position(|&c| c == name)
    };

    let id_col = find("id").ok_or("Missing 'id' column in ATOMS header")?;

    // Try unscaled first, then scaled, then unwrapped
    let (x_col, y_col, z_col, coord_type) =
        if let (Some(x), Some(y), Some(z)) = (find("x"), find("y"), find("z")) {
            (x, y, z, CoordType::Unscaled)
        } else if let (Some(x), Some(y), Some(z)) = (find("xs"), find("ys"), find("zs")) {
            (x, y, z, CoordType::Scaled)
        } else if let (Some(x), Some(y), Some(z)) = (find("xu"), find("yu"), find("zu")) {
            (x, y, z, CoordType::Unwrapped)
        } else {
            return Err("Cannot find x/y/z, xs/ys/zs, or xu/yu/zu columns in ATOMS header".to_string());
        };

    Ok(ColumnLayout {
        id_col,
        x_col,
        y_col,
        z_col,
        coord_type,
    })
}

/// Parse a LAMMPS dump trajectory text.
pub fn parse_lammpstrj(text: &str) -> Result<LammpstrjData, String> {
    let lines: Vec<&str> = text.lines().collect();
    let n_lines = lines.len();
    if n_lines == 0 {
        return Err("Empty file".to_string());
    }

    let mut frame_positions: Vec<Vec<f32>> = Vec::new();
    let mut timesteps: Vec<f64> = Vec::new();
    let mut n_atoms: usize = 0;
    let mut box_matrix: Option<[f32; 9]> = None;
    let mut i = 0;

    while i < n_lines {
        let line = lines[i].trim();

        if line != "ITEM: TIMESTEP" {
            i += 1;
            continue;
        }

        // Read timestep value
        i += 1;
        if i >= n_lines {
            break;
        }
        let ts: f64 = lines[i]
            .trim()
            .parse()
            .map_err(|_| format!("Cannot parse timestep at line {}", i + 1))?;
        timesteps.push(ts);

        // ITEM: NUMBER OF ATOMS
        i += 1;
        if i >= n_lines || lines[i].trim() != "ITEM: NUMBER OF ATOMS" {
            return Err(format!("Expected ITEM: NUMBER OF ATOMS at line {}", i + 1));
        }
        i += 1;
        if i >= n_lines {
            return Err("Unexpected end of file after NUMBER OF ATOMS".to_string());
        }
        let frame_n_atoms: usize = lines[i]
            .trim()
            .parse()
            .map_err(|_| format!("Cannot parse number of atoms at line {}", i + 1))?;

        if frame_positions.is_empty() {
            n_atoms = frame_n_atoms;
        } else if frame_n_atoms != n_atoms {
            return Err(format!(
                "Inconsistent atom count: expected {}, got {} at frame {}",
                n_atoms,
                frame_n_atoms,
                frame_positions.len() + 1
            ));
        }

        // ITEM: BOX BOUNDS
        i += 1;
        if i >= n_lines {
            return Err("Unexpected end of file before BOX BOUNDS".to_string());
        }
        let box_header = lines[i].trim();
        if !box_header.starts_with("ITEM: BOX BOUNDS") {
            return Err(format!("Expected ITEM: BOX BOUNDS at line {}", i + 1));
        }
        let is_triclinic = box_header.contains("xy xz yz");

        // Read 3 lines of box bounds
        let mut lo = [0.0f64; 3];
        let mut hi = [0.0f64; 3];
        let mut tilt = [0.0f64; 3]; // xy, xz, yz
        for dim in 0..3 {
            i += 1;
            if i >= n_lines {
                return Err("Unexpected end of file in BOX BOUNDS".to_string());
            }
            let parts: Vec<f64> = lines[i]
                .split_whitespace()
                .filter_map(|s| s.parse().ok())
                .collect();
            if is_triclinic {
                if parts.len() < 3 {
                    return Err(format!("Expected 3 values for triclinic box at line {}", i + 1));
                }
                lo[dim] = parts[0];
                hi[dim] = parts[1];
                tilt[dim] = parts[2];
            } else {
                if parts.len() < 2 {
                    return Err(format!("Expected 2 values for box bounds at line {}", i + 1));
                }
                lo[dim] = parts[0];
                hi[dim] = parts[1];
            }
        }

        // Build box matrix (store from first frame only)
        if box_matrix.is_none() {
            if is_triclinic {
                let xy = tilt[0] as f32;
                let xz = tilt[1] as f32;
                let yz = tilt[2] as f32;
                // For triclinic, lo/hi include tilt adjustments
                let xlo_bound = lo[0] as f32;
                let xhi_bound = hi[0] as f32;
                let ylo_bound = lo[1] as f32;
                let yhi_bound = hi[1] as f32;
                let zlo = lo[2] as f32;
                let zhi = hi[2] as f32;
                let xlo = xlo_bound - xy.min(0.0) - xz.min(0.0) - (xy + xz).min(0.0).min(0.0);
                let xhi = xhi_bound - xy.max(0.0) - xz.max(0.0) - (xy + xz).max(0.0).max(0.0);
                let ylo = ylo_bound - yz.min(0.0);
                let yhi = yhi_bound - yz.max(0.0);
                let lx = xhi - xlo;
                let ly = yhi - ylo;
                let lz = zhi - zlo;
                box_matrix = Some([
                    lx, 0.0, 0.0,
                    xy, ly,  0.0,
                    xz, yz,  lz,
                ]);
            } else {
                let lx = (hi[0] - lo[0]) as f32;
                let ly = (hi[1] - lo[1]) as f32;
                let lz = (hi[2] - lo[2]) as f32;
                box_matrix = Some([
                    lx, 0.0, 0.0,
                    0.0, ly, 0.0,
                    0.0, 0.0, lz,
                ]);
            }
        }

        // Box dimensions for scaled coordinate conversion
        let lx = (hi[0] - lo[0]) as f32;
        let ly = (hi[1] - lo[1]) as f32;
        let lz = (hi[2] - lo[2]) as f32;
        let xlo_f = lo[0] as f32;
        let ylo_f = lo[1] as f32;
        let zlo_f = lo[2] as f32;

        // ITEM: ATOMS header
        i += 1;
        if i >= n_lines {
            return Err("Unexpected end of file before ATOMS header".to_string());
        }
        let layout = parse_column_layout(lines[i])?;

        // Read atom lines
        let mut atoms: Vec<(usize, f32, f32, f32)> = Vec::with_capacity(n_atoms);
        for _ in 0..n_atoms {
            i += 1;
            if i >= n_lines {
                return Err("Unexpected end of file in atom data".to_string());
            }
            let parts: Vec<&str> = lines[i].split_whitespace().collect();
            let max_col = [layout.id_col, layout.x_col, layout.y_col, layout.z_col]
                .iter()
                .copied()
                .max()
                .unwrap();
            if parts.len() <= max_col {
                return Err(format!(
                    "Not enough columns at line {} (expected at least {}, got {})",
                    i + 1,
                    max_col + 1,
                    parts.len()
                ));
            }

            let id: usize = parts[layout.id_col]
                .parse()
                .map_err(|_| format!("Cannot parse atom id at line {}", i + 1))?;
            let mut x: f32 = parts[layout.x_col]
                .parse()
                .map_err(|_| format!("Cannot parse x at line {}", i + 1))?;
            let mut y: f32 = parts[layout.y_col]
                .parse()
                .map_err(|_| format!("Cannot parse y at line {}", i + 1))?;
            let mut z: f32 = parts[layout.z_col]
                .parse()
                .map_err(|_| format!("Cannot parse z at line {}", i + 1))?;

            // Convert scaled coordinates to Cartesian
            if let CoordType::Scaled = layout.coord_type {
                x = x * lx + xlo_f;
                y = y * ly + ylo_f;
                z = z * lz + zlo_f;
            }

            atoms.push((id, x, y, z));
        }

        // Sort by atom id for consistent ordering
        atoms.sort_by_key(|a| a.0);

        // Flatten to [x0, y0, z0, x1, y1, z1, ...]
        let mut positions = Vec::with_capacity(n_atoms * 3);
        for (_, x, y, z) in &atoms {
            positions.push(*x);
            positions.push(*y);
            positions.push(*z);
        }
        frame_positions.push(positions);

        i += 1;
    }

    if frame_positions.is_empty() {
        return Err("No frames found in file".to_string());
    }

    // Calculate timestep in ps from first two frames
    let timestep_ps = if timesteps.len() >= 2 {
        let dt = (timesteps[1] - timesteps[0]).abs();
        // LAMMPS timestep units vary by unit system; store raw value
        // User's structure file determines units. Just use the step difference.
        dt as f32
    } else {
        0.0
    };

    let n_frames = frame_positions.len();

    Ok(LammpstrjData {
        n_atoms,
        n_frames,
        timestep_ps,
        box_matrix,
        frame_positions,
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    fn sample_dump() -> &'static str {
        "ITEM: TIMESTEP\n\
         0\n\
         ITEM: NUMBER OF ATOMS\n\
         3\n\
         ITEM: BOX BOUNDS pp pp pp\n\
         0.0 10.0\n\
         0.0 10.0\n\
         0.0 10.0\n\
         ITEM: ATOMS id type x y z\n\
         1 1 1.0 2.0 3.0\n\
         3 2 7.0 8.0 9.0\n\
         2 2 4.0 5.0 6.0\n\
         ITEM: TIMESTEP\n\
         100\n\
         ITEM: NUMBER OF ATOMS\n\
         3\n\
         ITEM: BOX BOUNDS pp pp pp\n\
         0.0 10.0\n\
         0.0 10.0\n\
         0.0 10.0\n\
         ITEM: ATOMS id type x y z\n\
         2 2 4.1 5.1 6.1\n\
         1 1 1.1 2.1 3.1\n\
         3 2 7.1 8.1 9.1\n"
    }

    #[test]
    fn test_parse_basic() {
        let data = parse_lammpstrj(sample_dump()).unwrap();
        assert_eq!(data.n_atoms, 3);
        assert_eq!(data.n_frames, 2);
        assert_eq!(data.timestep_ps, 100.0);
    }

    #[test]
    fn test_atom_sorting() {
        let data = parse_lammpstrj(sample_dump()).unwrap();
        // Frame 0: atoms sorted by id (1, 2, 3)
        let f0 = &data.frame_positions[0];
        assert_eq!(f0[0], 1.0); // atom 1 x
        assert_eq!(f0[1], 2.0); // atom 1 y
        assert_eq!(f0[2], 3.0); // atom 1 z
        assert_eq!(f0[3], 4.0); // atom 2 x
        assert_eq!(f0[6], 7.0); // atom 3 x

        // Frame 1: also sorted by id
        let f1 = &data.frame_positions[1];
        assert_eq!(f1[0], 1.1); // atom 1 x
        assert_eq!(f1[3], 4.1); // atom 2 x
        assert_eq!(f1[6], 7.1); // atom 3 x
    }

    #[test]
    fn test_box_matrix() {
        let data = parse_lammpstrj(sample_dump()).unwrap();
        let bm = data.box_matrix.unwrap();
        assert_eq!(bm[0], 10.0); // lx
        assert_eq!(bm[4], 10.0); // ly
        assert_eq!(bm[8], 10.0); // lz
    }

    #[test]
    fn test_scaled_coords() {
        let text = "ITEM: TIMESTEP\n\
                    0\n\
                    ITEM: NUMBER OF ATOMS\n\
                    2\n\
                    ITEM: BOX BOUNDS pp pp pp\n\
                    0.0 10.0\n\
                    0.0 20.0\n\
                    0.0 30.0\n\
                    ITEM: ATOMS id type xs ys zs\n\
                    1 1 0.5 0.5 0.5\n\
                    2 1 0.0 0.0 0.0\n";
        let data = parse_lammpstrj(text).unwrap();
        let f0 = &data.frame_positions[0];
        // atom 1: 0.5*10+0 = 5.0, 0.5*20+0 = 10.0, 0.5*30+0 = 15.0
        assert!((f0[0] - 5.0).abs() < 1e-5);
        assert!((f0[1] - 10.0).abs() < 1e-5);
        assert!((f0[2] - 15.0).abs() < 1e-5);
        // atom 2: 0.0
        assert!((f0[3]).abs() < 1e-5);
    }

    #[test]
    fn test_triclinic_box() {
        let text = "ITEM: TIMESTEP\n\
                    0\n\
                    ITEM: NUMBER OF ATOMS\n\
                    1\n\
                    ITEM: BOX BOUNDS xy xz yz pp pp pp\n\
                    0.0 10.0 1.0\n\
                    0.0 10.0 0.5\n\
                    0.0 10.0 0.0\n\
                    ITEM: ATOMS id type x y z\n\
                    1 1 5.0 5.0 5.0\n";
        let data = parse_lammpstrj(text).unwrap();
        let bm = data.box_matrix.unwrap();
        // xy=1.0, xz=0.5, yz=0.0
        assert!((bm[3] - 1.0).abs() < 1e-5); // xy
        assert!((bm[6] - 0.5).abs() < 1e-5); // xz
    }

    #[test]
    fn test_empty_file() {
        let result = parse_lammpstrj("");
        assert!(result.is_err());
    }

    #[test]
    fn test_single_frame() {
        let text = "ITEM: TIMESTEP\n\
                    0\n\
                    ITEM: NUMBER OF ATOMS\n\
                    1\n\
                    ITEM: BOX BOUNDS pp pp pp\n\
                    0.0 10.0\n\
                    0.0 10.0\n\
                    0.0 10.0\n\
                    ITEM: ATOMS id type x y z\n\
                    1 1 5.0 5.0 5.0\n";
        let data = parse_lammpstrj(text).unwrap();
        assert_eq!(data.n_frames, 1);
        assert_eq!(data.timestep_ps, 0.0); // single frame → no dt
    }
}
