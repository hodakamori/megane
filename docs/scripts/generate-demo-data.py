#!/usr/bin/env python3
"""Generate pre-parsed demo data (JSON snapshot) from PDB files.

Outputs Snapshot-compatible JSON for the VitePress live demos.
Uses a minimal pure-Python PDB parser with covalent bond inference.
No Rust/WASM dependency required.
"""

import json
import math
from pathlib import Path

# Element symbol → atomic number lookup
ELEMENT_TO_ATOMIC_NUM = {
    "H": 1, "HE": 2, "LI": 3, "BE": 4, "B": 5, "C": 6, "N": 7, "O": 8,
    "F": 9, "NE": 10, "NA": 11, "MG": 12, "AL": 13, "SI": 14, "P": 15,
    "S": 16, "CL": 17, "AR": 18, "K": 19, "CA": 20, "FE": 26, "ZN": 30,
    "SE": 34, "BR": 35, "I": 53,
}

# Covalent radii in Angstroms (matching crates/megane-core/src/bonds.rs)
COVALENT_RADII = {
    1: 0.31, 5: 0.84, 6: 0.76, 7: 0.71, 8: 0.66, 9: 0.57, 11: 1.66,
    12: 1.41, 14: 1.11, 15: 1.07, 16: 1.05, 17: 1.02, 19: 2.03, 20: 1.76,
    25: 1.39, 26: 1.32, 27: 1.26, 28: 1.24, 29: 1.32, 30: 1.22, 34: 1.20,
    35: 1.20, 53: 1.39,
}
DEFAULT_COVALENT_RADIUS = 0.77

BOND_TOLERANCE = 1.3
MIN_BOND_DIST = 0.4


def guess_element(atom_name: str) -> str:
    """Guess element symbol from PDB atom name."""
    name = atom_name.strip()
    if len(name) >= 2 and name[:2].upper() in ELEMENT_TO_ATOMIC_NUM:
        return name[:2].upper()
    if name and name[0].upper() in ELEMENT_TO_ATOMIC_NUM:
        return name[0].upper()
    return "C"


def infer_bonds(positions: list[float], elements: list[int]) -> list[list[int]]:
    """Infer covalent bonds using distance-based cell-list search.

    Matches the algorithm in crates/megane-core/src/bonds.rs.
    """
    n_atoms = len(elements)
    if n_atoms == 0:
        return []

    cell_size = 2.5
    min_dist_sq = MIN_BOND_DIST * MIN_BOND_DIST

    # Bounding box
    xs = positions[0::3]
    ys = positions[1::3]
    zs = positions[2::3]
    min_x, max_x = min(xs), max(xs)
    min_y, max_y = min(ys), max(ys)
    min_z, max_z = min(zs), max(zs)

    nx = max(1, math.ceil((max_x - min_x) / cell_size))
    ny = max(1, math.ceil((max_y - min_y) / cell_size))
    nz = max(1, math.ceil((max_z - min_z) / cell_size))

    # Build cell lists
    cells: dict[int, list[int]] = {}
    for i in range(n_atoms):
        cx = min(int((positions[i * 3] - min_x) / cell_size), nx - 1)
        cy = min(int((positions[i * 3 + 1] - min_y) / cell_size), ny - 1)
        cz = min(int((positions[i * 3 + 2] - min_z) / cell_size), nz - 1)
        key = cx * ny * nz + cy * nz + cz
        cells.setdefault(key, []).append(i)

    # Half-shell neighbor offsets
    offsets = [
        (0, 0, 1), (0, 1, -1), (0, 1, 0), (0, 1, 1),
        (1, -1, -1), (1, -1, 0), (1, -1, 1),
        (1, 0, -1), (1, 0, 0), (1, 0, 1),
        (1, 1, -1), (1, 1, 0), (1, 1, 1),
    ]

    bonds = []
    for cx in range(nx):
        for cy in range(ny):
            for cz in range(nz):
                key = cx * ny * nz + cy * nz + cz
                cell = cells.get(key, [])

                for ii in range(len(cell)):
                    i = cell[ii]
                    ri = COVALENT_RADII.get(elements[i], DEFAULT_COVALENT_RADIUS)

                    # Same cell pairs
                    for jj in range(ii + 1, len(cell)):
                        j = cell[jj]
                        rj = COVALENT_RADII.get(elements[j], DEFAULT_COVALENT_RADIUS)
                        threshold = (ri + rj) * BOND_TOLERANCE
                        dx = positions[j * 3] - positions[i * 3]
                        dy = positions[j * 3 + 1] - positions[i * 3 + 1]
                        dz = positions[j * 3 + 2] - positions[i * 3 + 2]
                        dist_sq = dx * dx + dy * dy + dz * dz
                        if dist_sq > min_dist_sq and dist_sq <= threshold * threshold:
                            a, b = min(i, j), max(i, j)
                            bonds.append([a, b])

                    # Neighbor cell pairs
                    for dx_, dy_, dz_ in offsets:
                        ncx, ncy, ncz = cx + dx_, cy + dy_, cz + dz_
                        if ncx < 0 or ncy < 0 or ncz < 0:
                            continue
                        if ncx >= nx or ncy >= ny or ncz >= nz:
                            continue
                        nkey = ncx * ny * nz + ncy * nz + ncz
                        for j in cells.get(nkey, []):
                            rj = COVALENT_RADII.get(elements[j], DEFAULT_COVALENT_RADIUS)
                            threshold = (ri + rj) * BOND_TOLERANCE
                            dx = positions[j * 3] - positions[i * 3]
                            dy = positions[j * 3 + 1] - positions[i * 3 + 1]
                            dz = positions[j * 3 + 2] - positions[i * 3 + 2]
                            dist_sq = dx * dx + dy * dy + dz * dz
                            if dist_sq > min_dist_sq and dist_sq <= threshold * threshold:
                                a, b = min(i, j), max(i, j)
                                bonds.append([a, b])

    # Deduplicate
    bonds = sorted(set(tuple(b) for b in bonds))
    return [list(b) for b in bonds]


def parse_pdb(text: str) -> dict:
    """Parse PDB text into a Snapshot-compatible dict."""
    positions: list[float] = []
    elements: list[int] = []
    conect_bonds: set[tuple[int, int]] = set()
    serial_to_idx: dict[int, int] = {}

    for line in text.splitlines():
        rec = line[:6].strip()
        if rec in ("ATOM", "HETATM"):
            serial = int(line[6:11].strip())
            atom_name = line[12:16]
            x = float(line[30:38])
            y = float(line[38:46])
            z = float(line[46:54])

            elem_str = line[76:78].strip() if len(line) >= 78 else ""
            if not elem_str:
                elem_str = guess_element(atom_name)

            atomic_num = ELEMENT_TO_ATOMIC_NUM.get(elem_str.upper(), 6)

            idx = len(elements)
            serial_to_idx[serial] = idx
            positions.extend([x, y, z])
            elements.append(atomic_num)

        elif rec == "CONECT":
            parts = line[6:].split()
            if len(parts) >= 2:
                src_serial = int(parts[0])
                for p in parts[1:]:
                    dst_serial = int(p)
                    src_idx = serial_to_idx.get(src_serial)
                    dst_idx = serial_to_idx.get(dst_serial)
                    if src_idx is not None and dst_idx is not None:
                        a, b = min(src_idx, dst_idx), max(src_idx, dst_idx)
                        conect_bonds.add((a, b))

    # Infer covalent bonds
    inferred = infer_bonds(positions, elements)

    # Merge CONECT + inferred, CONECT bonds first
    all_bonds = sorted(conect_bonds)
    n_file_bonds = len(all_bonds)
    inferred_set = set(tuple(b) for b in inferred)
    for b in sorted(inferred_set - conect_bonds):
        all_bonds.append(b)

    n_bonds = len(all_bonds)
    bonds_flat: list[int] = []
    for a, b in all_bonds:
        bonds_flat.extend([a, b])

    return {
        "nAtoms": len(elements),
        "nBonds": n_bonds,
        "nFileBonds": n_file_bonds,
        "positions": [round(v, 3) for v in positions],
        "elements": elements,
        "bonds": bonds_flat,
        "bondOrders": [1] * n_bonds,
        "box": None,
    }


def main():
    repo_root = Path(__file__).resolve().parent.parent.parent
    pdb_path = repo_root / "tests" / "fixtures" / "caffeine_water.pdb"
    out_dir = repo_root / "docs" / "public" / "data"
    out_dir.mkdir(parents=True, exist_ok=True)

    text = pdb_path.read_text()
    snapshot = parse_pdb(text)

    out_path = out_dir / "caffeine_water.json"
    with open(out_path, "w") as f:
        json.dump(snapshot, f, separators=(",", ":"))

    size_kb = out_path.stat().st_size / 1024
    print(
        f"Generated {out_path} "
        f"({snapshot['nAtoms']} atoms, {snapshot['nBonds']} bonds, {size_kb:.1f} KB)"
    )


if __name__ == "__main__":
    main()
