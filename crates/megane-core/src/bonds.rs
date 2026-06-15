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

    let ncells = nx * ny * nz;

    // Compute each atom's flat cell index once.
    let cell_of = |i: usize| -> usize {
        let cx = (((positions[i * 3] - min_x) / cell_size) as usize).min(nx - 1);
        let cy = (((positions[i * 3 + 1] - min_y) / cell_size) as usize).min(ny - 1);
        let cz = (((positions[i * 3 + 2] - min_z) / cell_size) as usize).min(nz - 1);
        cx * ny * nz + cy * nz + cz
    };

    // Bucket atoms into a CSR (counting-sort) layout instead of a
    // `Vec<Vec<usize>>` to avoid one heap allocation per spatial cell.
    // `starts[c]..starts[c + 1]` is the slice of `cell_atoms` for cell `c`.
    let mut atom_cell = vec![0u32; n_atoms];
    let mut starts = vec![0u32; ncells + 1];
    for (i, slot) in atom_cell.iter_mut().enumerate() {
        let c = cell_of(i);
        *slot = c as u32;
        starts[c + 1] += 1;
    }
    for c in 0..ncells {
        starts[c + 1] += starts[c];
    }
    // Fill in ascending atom index order so within-cell ordering matches the
    // previous `Vec<Vec<usize>>` (each cell pushed atoms in `i` order), which
    // keeps the emitted bond order byte-for-byte identical.
    let mut cursor: Vec<u32> = starts[..ncells].to_vec();
    let mut cell_atoms = vec![0u32; n_atoms];
    for (i, &c) in atom_cell.iter().enumerate() {
        let c = c as usize;
        cell_atoms[cursor[c] as usize] = i as u32;
        cursor[c] += 1;
    }

    // Molecular systems carry roughly one bond per atom; reserve to avoid
    // repeated reallocation of the output vector.
    let mut bonds = Vec::with_capacity(n_atoms);

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
                let cell = &cell_atoms[starts[cell_idx] as usize..starts[cell_idx + 1] as usize];

                // Pairs within the same cell
                for ii in 0..cell.len() {
                    let i = cell[ii] as usize;

                    for &j in &cell[(ii + 1)..] {
                        if let Some(bond) = check_pair(i, j as usize) {
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
                        let neighbor = &cell_atoms
                            [starts[neighbor_idx] as usize..starts[neighbor_idx + 1] as usize];
                        for &j in neighbor {
                            if let Some(bond) = check_pair(i, j as usize) {
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

    #[test]
    fn test_infer_bonds_single_atom() {
        let bonds = infer_bonds(&[1.0, 2.0, 3.0], &[6], 1, &HashSet::new());
        assert!(bonds.is_empty());
    }

    #[test]
    fn test_infer_bonds_chain_ordering() {
        // A carbon chain spaced 1.5 Å along x spans several 2.5 Å cells.
        // Each atom bonds only to its immediate neighbour, and the CSR cell
        // list must emit the pairs in ascending (i, j) order.
        let positions = vec![
            0.0, 0.0, 0.0, // 0
            1.5, 0.0, 0.0, // 1
            3.0, 0.0, 0.0, // 2
            4.5, 0.0, 0.0, // 3
        ];
        let elements = vec![6, 6, 6, 6];
        let bonds = infer_bonds(&positions, &elements, 4, &HashSet::new());
        assert_eq!(bonds, vec![(0, 1), (1, 2), (2, 3)]);
    }
}
