/// Distance-based bond inference using cell-list spatial search.
use std::collections::HashSet;

use crate::atomic::covalent_radius;
// Re-export so that `megane_core::bonds::vdw_radius` continues to work.
pub use crate::atomic::vdw_radius;

const BOND_TOLERANCE: f32 = 1.3;
const MIN_BOND_DIST: f32 = 0.4;
const VDW_BOND_FACTOR: f32 = 0.6;

/// Generic cell-list spatial scan that iterates over all nearby atom pairs
/// and calls `check_pair(i, j)` for each. The closure returns `Some((a, b))`
/// if the pair should be recorded as a bond.
fn cell_list_scan<F>(
    positions: &[f32],
    n_atoms: usize,
    cell_size: f32,
    mut check_pair: F,
) -> Vec<(u32, u32)>
where
    F: FnMut(usize, usize) -> Option<(u32, u32)>,
{
    if n_atoms == 0 {
        return Vec::new();
    }

    // Bounding box
    let (mut min_x, mut min_y, mut min_z) = (f32::MAX, f32::MAX, f32::MAX);
    let (mut max_x, mut max_y, mut max_z) = (f32::MIN, f32::MIN, f32::MIN);

    for i in 0..n_atoms {
        let (x, y, z) = (positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
        min_x = min_x.min(x);
        min_y = min_y.min(y);
        min_z = min_z.min(z);
        max_x = max_x.max(x);
        max_y = max_y.max(y);
        max_z = max_z.max(z);
    }

    let nx = ((max_x - min_x) / cell_size).ceil().max(1.0) as usize;
    let ny = ((max_y - min_y) / cell_size).ceil().max(1.0) as usize;
    let nz = ((max_z - min_z) / cell_size).ceil().max(1.0) as usize;

    // Build cell lists
    let mut cells: Vec<Vec<usize>> = vec![Vec::new(); nx * ny * nz];

    for i in 0..n_atoms {
        let cx = (((positions[i * 3] - min_x) / cell_size) as usize).min(nx - 1);
        let cy = (((positions[i * 3 + 1] - min_y) / cell_size) as usize).min(ny - 1);
        let cz = (((positions[i * 3 + 2] - min_z) / cell_size) as usize).min(nz - 1);
        cells[cx * ny * nz + cy * nz + cz].push(i);
    }

    let mut bonds = Vec::new();

    // 13 neighbor offsets (half-shell to avoid double-counting)
    let offsets: [(isize, isize, isize); 13] = [
        (0, 0, 1),
        (0, 1, -1),
        (0, 1, 0),
        (0, 1, 1),
        (1, -1, -1),
        (1, -1, 0),
        (1, -1, 1),
        (1, 0, -1),
        (1, 0, 0),
        (1, 0, 1),
        (1, 1, -1),
        (1, 1, 0),
        (1, 1, 1),
    ];

    for cx in 0..nx {
        for cy in 0..ny {
            for cz in 0..nz {
                let cell_idx = cx * ny * nz + cy * nz + cz;
                let cell = &cells[cell_idx];

                // Pairs within the same cell
                for ii in 0..cell.len() {
                    let i = cell[ii];

                    for &j in &cell[(ii + 1)..] {
                        if let Some(bond) = check_pair(i, j) {
                            bonds.push(bond);
                        }
                    }

                    // Pairs with neighboring cells (half-shell)
                    for &(dx, dy, dz) in &offsets {
                        let ncx = cx as isize + dx;
                        let ncy = cy as isize + dy;
                        let ncz = cz as isize + dz;
                        if ncx < 0
                            || ncy < 0
                            || ncz < 0
                            || ncx >= nx as isize
                            || ncy >= ny as isize
                            || ncz >= nz as isize
                        {
                            continue;
                        }
                        let neighbor_idx =
                            ncx as usize * ny * nz + ncy as usize * nz + ncz as usize;
                        for &j in &cells[neighbor_idx] {
                            if let Some(bond) = check_pair(i, j) {
                                bonds.push(bond);
                            }
                        }
                    }
                }
            }
        }
    }

    bonds
}

/// Infer bonds using a cell-list (spatial hashing) approach.
pub fn infer_bonds(
    positions: &[f32],
    elements: &[u8],
    n_atoms: usize,
    existing_bonds: &HashSet<(u32, u32)>,
) -> Vec<(u32, u32)> {
    let cell_size: f32 = 2.5;

    cell_list_scan(positions, n_atoms, cell_size, |i, j| {
        let a = i.min(j) as u32;
        let b = i.max(j) as u32;
        if existing_bonds.contains(&(a, b)) {
            return None;
        }

        let ri = covalent_radius(elements[i]);
        let rj = covalent_radius(elements[j]);
        let threshold = (ri + rj) * BOND_TOLERANCE;

        let dx = positions[j * 3] - positions[i * 3];
        let dy = positions[j * 3 + 1] - positions[i * 3 + 1];
        let dz = positions[j * 3 + 2] - positions[i * 3 + 2];

        let dist_sq = dx * dx + dy * dy + dz * dz;
        if dist_sq > MIN_BOND_DIST * MIN_BOND_DIST && dist_sq <= threshold * threshold {
            Some((a, b))
        } else {
            None
        }
    })
}

/// Infer bonds using VDW radii: bond if distance <= (vdw_i + vdw_j) * 0.6.
pub fn infer_bonds_vdw(positions: &[f32], elements: &[u8], n_atoms: usize) -> Vec<(u32, u32)> {
    let cell_size: f32 = 2.0;

    cell_list_scan(positions, n_atoms, cell_size, |i, j| {
        let ri = vdw_radius(elements[i]);
        let rj = vdw_radius(elements[j]);
        let threshold = (ri + rj) * VDW_BOND_FACTOR;

        let dx = positions[j * 3] - positions[i * 3];
        let dy = positions[j * 3 + 1] - positions[i * 3 + 1];
        let dz = positions[j * 3 + 2] - positions[i * 3 + 2];

        let dist_sq = dx * dx + dy * dy + dz * dz;
        if dist_sq > MIN_BOND_DIST * MIN_BOND_DIST && dist_sq <= threshold * threshold {
            let a = i.min(j) as u32;
            let b = i.max(j) as u32;
            Some((a, b))
        } else {
            None
        }
    })
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::collections::HashSet;

    /// Build a water molecule: O at origin, H1 and H2 at ~0.96 Å.
    fn water_positions() -> (Vec<f32>, Vec<u8>) {
        let oh = 0.96f32;
        let half_angle = (104.5f32 / 2.0).to_radians();
        let positions = vec![
            0.0,
            0.0,
            0.0, // O
            oh * half_angle.sin(),
            oh * half_angle.cos(),
            0.0, // H1
            -oh * half_angle.sin(),
            oh * half_angle.cos(),
            0.0, // H2
        ];
        let elements = vec![8, 1, 1]; // O, H, H
        (positions, elements)
    }

    #[test]
    fn test_infer_bonds_empty() {
        let bonds = infer_bonds(&[], &[], 0, &HashSet::new());
        assert!(bonds.is_empty());
    }

    #[test]
    fn test_infer_bonds_water() {
        let (positions, elements) = water_positions();
        let bonds = infer_bonds(&positions, &elements, 3, &HashSet::new());
        assert_eq!(bonds.len(), 2);
        assert!(bonds.contains(&(0, 1)));
        assert!(bonds.contains(&(0, 2)));
    }

    #[test]
    fn test_infer_bonds_skips_existing() {
        let (positions, elements) = water_positions();
        let mut existing = HashSet::new();
        existing.insert((0u32, 1u32));
        let bonds = infer_bonds(&positions, &elements, 3, &existing);
        assert_eq!(bonds.len(), 1);
        assert!(bonds.contains(&(0, 2)));
    }

    #[test]
    fn test_infer_bonds_far_apart() {
        let positions = vec![0.0, 0.0, 0.0, 10.0, 0.0, 0.0];
        let elements = vec![6, 6];
        let bonds = infer_bonds(&positions, &elements, 2, &HashSet::new());
        assert!(bonds.is_empty());
    }

    #[test]
    fn test_infer_bonds_too_close() {
        let positions = vec![0.0, 0.0, 0.0, 0.3, 0.0, 0.0];
        let elements = vec![6, 6];
        let bonds = infer_bonds(&positions, &elements, 2, &HashSet::new());
        assert!(bonds.is_empty());
    }

    #[test]
    fn test_infer_bonds_vdw_water() {
        let (positions, elements) = water_positions();
        let bonds = infer_bonds_vdw(&positions, &elements, 3);
        assert!(bonds.len() >= 2);
        assert!(bonds.contains(&(0, 1)));
        assert!(bonds.contains(&(0, 2)));
    }

    #[test]
    fn test_infer_bonds_vdw_empty() {
        let bonds = infer_bonds_vdw(&[], &[], 0);
        assert!(bonds.is_empty());
    }

    #[test]
    fn test_infer_bonds_vdw_far_apart() {
        let positions = vec![0.0, 0.0, 0.0, 10.0, 0.0, 0.0];
        let elements = vec![6, 6];
        let bonds = infer_bonds_vdw(&positions, &elements, 2);
        assert!(bonds.is_empty());
    }
}
