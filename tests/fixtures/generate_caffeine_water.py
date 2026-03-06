"""Generate a caffeine molecule solvated in water for demo purposes.

Creates a PDB file with one caffeine molecule (24 atoms) surrounded by
1000 water molecules (3000 atoms) in a solvation shell, totaling 3024 atoms.
Coordinates are from PubChem CID 2519 (Conformer3D).
"""

import numpy as np

# Caffeine 3D coordinates from PubChem CID 2519
# fmt: off
CAFFEINE_ATOMS = [
    # (element, x, y, z)
    ("O",   0.4700,  2.5688,  0.0006),
    ("O",  -3.1271, -0.4436, -0.0003),
    ("N",  -0.9686, -1.3125,  0.0000),
    ("N",   2.2182,  0.1412, -0.0003),
    ("N",  -1.3477,  1.0797, -0.0001),
    ("N",   1.4119, -1.9372,  0.0002),
    ("C",   0.8579,  0.2592, -0.0008),
    ("C",   0.3897, -1.0264, -0.0004),
    ("C",   0.0307,  1.4220, -0.0006),
    ("C",  -1.9061, -0.2495, -0.0004),
    ("C",   2.5032, -1.1998,  0.0003),
    ("C",  -1.4276, -2.6960,  0.0008),
    ("C",   3.1926,  1.2061,  0.0003),
    ("C",  -2.2969,  2.1881,  0.0007),
    ("H",   3.5163, -1.5787,  0.0008),
    ("H",  -1.0451, -3.1973, -0.8937),
    ("H",  -2.5186, -2.7596,  0.0011),
    ("H",  -1.0447, -3.1963,  0.8957),
    ("H",   4.1992,  0.7801,  0.0002),
    ("H",   3.0468,  1.8092, -0.8992),
    ("H",   3.0466,  1.8083,  0.9004),
    ("H",  -1.8087,  3.1651, -0.0003),
    ("H",  -2.9322,  2.1027,  0.8881),
    ("H",  -2.9346,  2.1021, -0.8849),
]

# Bond table (1-indexed atom pairs, bond order) from PubChem
CAFFEINE_BONDS = [
    (1, 9, 2), (2, 10, 2), (3, 8, 1), (3, 10, 1), (3, 12, 1),
    (4, 7, 1), (4, 11, 1), (4, 13, 1), (5, 9, 1), (5, 10, 1),
    (5, 14, 1), (6, 8, 1), (6, 11, 2), (7, 8, 2), (7, 9, 1),
    (11, 15, 1), (12, 16, 1), (12, 17, 1), (12, 18, 1),
    (13, 19, 1), (13, 20, 1), (13, 21, 1),
    (14, 22, 1), (14, 23, 1), (14, 24, 1),
]
# fmt: on

# Water geometry: O-H bond length and H-O-H angle
WATER_OH = 0.9572  # Angstroms
WATER_ANGLE = np.radians(104.52)

N_WATERS = 1000
SHELL_INNER = 3.5  # Angstroms from any caffeine atom
SHELL_OUTER = 20.0  # Angstroms from center of mass
MIN_DIST = 2.6  # Minimum O-O or O-atom distance


def random_water(o_pos, rng):
    """Generate H positions for a water molecule given O position."""
    # Random orientation via random rotation
    axis = rng.randn(3)
    axis /= np.linalg.norm(axis)
    angle = rng.uniform(0, 2 * np.pi)

    # Rodrigues' rotation
    cos_a, sin_a = np.cos(angle), np.sin(angle)
    K = np.array([
        [0, -axis[2], axis[1]],
        [axis[2], 0, -axis[0]],
        [-axis[1], axis[0], 0],
    ])
    R = np.eye(3) * cos_a + (1 - cos_a) * np.outer(axis, axis) + sin_a * K

    # H positions in local frame
    half = WATER_ANGLE / 2
    h1_local = np.array([WATER_OH * np.sin(half), WATER_OH * np.cos(half), 0])
    h2_local = np.array([-WATER_OH * np.sin(half), WATER_OH * np.cos(half), 0])

    h1 = o_pos + R @ h1_local
    h2 = o_pos + R @ h2_local
    return h1, h2


def main():
    rng = np.random.RandomState(42)

    caffeine_coords = np.array([(x, y, z) for _, x, y, z in CAFFEINE_ATOMS])
    com = caffeine_coords.mean(axis=0)

    # Collect all placed atom positions for clash checking
    all_positions = caffeine_coords.copy()
    waters = []  # list of (O, H1, H2) positions

    attempts = 0
    max_attempts = N_WATERS * 200

    while len(waters) < N_WATERS and attempts < max_attempts:
        attempts += 1

        # Random point in sphere
        r = SHELL_OUTER * rng.uniform(0, 1) ** (1 / 3)
        theta = np.arccos(2 * rng.uniform() - 1)
        phi = rng.uniform(0, 2 * np.pi)
        o_pos = com + r * np.array([
            np.sin(theta) * np.cos(phi),
            np.sin(theta) * np.sin(phi),
            np.cos(theta),
        ])

        # Check minimum distance from caffeine atoms
        dists_caffeine = np.linalg.norm(caffeine_coords - o_pos, axis=1)
        if dists_caffeine.min() < SHELL_INNER:
            continue

        # Check minimum distance from all placed O atoms
        if len(waters) > 0:
            water_os = np.array([w[0] for w in waters])
            dists_water = np.linalg.norm(water_os - o_pos, axis=1)
            if dists_water.min() < MIN_DIST:
                continue

        h1, h2 = random_water(o_pos, rng)
        waters.append((o_pos, h1, h2))

    if len(waters) < N_WATERS:
        print(f"Warning: only placed {len(waters)} waters out of {N_WATERS}")

    # Compute bounding box for CRYST1 record
    all_atoms = list(caffeine_coords)
    for o, h1, h2 in waters:
        all_atoms.extend([o, h1, h2])
    all_atoms = np.array(all_atoms)
    box_min = all_atoms.min(axis=0) - 2.0
    box_max = all_atoms.max(axis=0) + 2.0
    box_size = box_max - box_min
    # Shift everything so minimum is at (2, 2, 2)
    offset = -box_min

    # Write PDB
    out_path = "tests/fixtures/caffeine_water.pdb"
    with open(out_path, "w") as f:
        f.write(
            f"CRYST1{box_size[0]:9.3f}{box_size[1]:9.3f}{box_size[2]:9.3f}"
            f"  90.00  90.00  90.00 P 1           1\n"
        )

        atom_serial = 1

        # Write caffeine atoms
        for i, (elem, x, y, z) in enumerate(CAFFEINE_ATOMS):
            pos = np.array([x, y, z]) + offset
            name = f" {elem}{i + 1}" if len(elem) == 1 else f"{elem}{i + 1}"
            name = name[:4].ljust(4)
            f.write(
                f"HETATM{atom_serial:5d} {name} CAF A   1    "
                f"{pos[0]:8.3f}{pos[1]:8.3f}{pos[2]:8.3f}"
                f"  1.00  0.00          {elem:>2s}\n"
            )
            atom_serial += 1

        # Write water molecules
        for wi, (o, h1, h2) in enumerate(waters):
            res_num = wi + 2  # residue 1 is caffeine
            if res_num > 9999:
                res_num = res_num % 10000

            o_pos = o + offset
            h1_pos = h1 + offset
            h2_pos = h2 + offset

            f.write(
                f"HETATM{atom_serial:5d}  O   HOH W{res_num:4d}    "
                f"{o_pos[0]:8.3f}{o_pos[1]:8.3f}{o_pos[2]:8.3f}"
                f"  1.00  0.00           O\n"
            )
            atom_serial += 1
            f.write(
                f"HETATM{atom_serial:5d}  H1  HOH W{res_num:4d}    "
                f"{h1_pos[0]:8.3f}{h1_pos[1]:8.3f}{h1_pos[2]:8.3f}"
                f"  1.00  0.00           H\n"
            )
            atom_serial += 1
            f.write(
                f"HETATM{atom_serial:5d}  H2  HOH W{res_num:4d}    "
                f"{h2_pos[0]:8.3f}{h2_pos[1]:8.3f}{h2_pos[2]:8.3f}"
                f"  1.00  0.00           H\n"
            )
            atom_serial += 1

        # Write CONECT records for caffeine bonds
        for a1, a2, _order in CAFFEINE_BONDS:
            f.write(f"CONECT{a1:5d}{a2:5d}\n")

        f.write("END\n")

    total_atoms = len(CAFFEINE_ATOMS) + len(waters) * 3
    print(f"Generated {out_path}: {total_atoms} atoms "
          f"({len(CAFFEINE_ATOMS)} caffeine + {len(waters)} waters)")


if __name__ == "__main__":
    main()
