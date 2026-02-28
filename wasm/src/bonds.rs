/// Distance-based bond inference using cell-list spatial search.

use std::collections::HashSet;

/// Covalent radii in Angstroms, indexed by atomic number.
fn covalent_radius(atomic_num: u8) -> f32 {
    match atomic_num {
        1 => 0.31,   // H
        5 => 0.84,   // B
        6 => 0.76,   // C
        7 => 0.71,   // N
        8 => 0.66,   // O
        9 => 0.57,   // F
        11 => 1.66,  // Na
        12 => 1.41,  // Mg
        14 => 1.11,  // Si
        15 => 1.07,  // P
        16 => 1.05,  // S
        17 => 1.02,  // Cl
        19 => 2.03,  // K
        20 => 1.76,  // Ca
        25 => 1.39,  // Mn
        26 => 1.32,  // Fe
        27 => 1.26,  // Co
        28 => 1.24,  // Ni
        29 => 1.32,  // Cu
        30 => 1.22,  // Zn
        34 => 1.20,  // Se
        35 => 1.20,  // Br
        53 => 1.39,  // I
        _ => 0.77,
    }
}

const BOND_TOLERANCE: f32 = 1.3;
const MIN_BOND_DIST: f32 = 0.4;

/// Infer bonds using a cell-list (spatial hashing) approach.
pub fn infer_bonds(
    positions: &[f32],
    elements: &[u8],
    n_atoms: usize,
    existing_bonds: &HashSet<(u32, u32)>,
) -> Vec<(u32, u32)> {
    if n_atoms == 0 {
        return Vec::new();
    }

    let cell_size: f32 = 2.5;

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
                    let ri = covalent_radius(elements[i]);
                    let (ix, iy, iz) = (positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);

                    for jj in (ii + 1)..cell.len() {
                        let j = cell[jj];
                        check_bond(
                            i, j, ri, ix, iy, iz, positions, elements, existing_bonds, &mut bonds,
                        );
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
                            check_bond(
                                i, j, ri, ix, iy, iz, positions, elements, existing_bonds,
                                &mut bonds,
                            );
                        }
                    }
                }
            }
        }
    }

    bonds
}

#[inline]
fn check_bond(
    i: usize,
    j: usize,
    ri: f32,
    ix: f32,
    iy: f32,
    iz: f32,
    positions: &[f32],
    elements: &[u8],
    existing_bonds: &HashSet<(u32, u32)>,
    bonds: &mut Vec<(u32, u32)>,
) {
    let a = i.min(j) as u32;
    let b = i.max(j) as u32;
    if existing_bonds.contains(&(a, b)) {
        return;
    }

    let rj = covalent_radius(elements[j]);
    let threshold = (ri + rj) * BOND_TOLERANCE;

    let dx = positions[j * 3] - ix;
    let dy = positions[j * 3 + 1] - iy;
    let dz = positions[j * 3 + 2] - iz;

    let dist_sq = dx * dx + dy * dy + dz * dz;
    if dist_sq > MIN_BOND_DIST * MIN_BOND_DIST && dist_sq <= threshold * threshold {
        bonds.push((a, b));
    }
}
