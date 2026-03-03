"""Generate a PDB file with ~100,000 atoms of randomly placed water molecules.

Each water molecule consists of 3 atoms (O, H, H) with realistic geometry:
  - O-H bond length: 0.96 A
  - H-O-H angle: 104.5 degrees

Usage:
    python tests/fixtures/generate_water_100k.py
"""

import numpy as np

PDB_PATH = "tests/fixtures/water_100k.pdb"
N_MOLECULES = 33_334  # 33,334 * 3 = 100,002 atoms
SEED = 42

# Water geometry constants
OH_BOND_LENGTH = 0.96  # Angstroms
HOH_ANGLE = np.radians(104.5)

# Grid spacing to avoid overlapping molecules
SPACING = 3.5  # Angstroms between grid points


def make_water_positions(center: np.ndarray) -> np.ndarray:
    """Return (3, 3) array of O, H1, H2 positions for a water molecule."""
    o_pos = center
    h1_pos = center + np.array([
        OH_BOND_LENGTH * np.sin(HOH_ANGLE / 2),
        OH_BOND_LENGTH * np.cos(HOH_ANGLE / 2),
        0.0,
    ])
    h2_pos = center + np.array([
        -OH_BOND_LENGTH * np.sin(HOH_ANGLE / 2),
        OH_BOND_LENGTH * np.cos(HOH_ANGLE / 2),
        0.0,
    ])
    return np.array([o_pos, h1_pos, h2_pos], dtype=np.float32)


def main():
    rng = np.random.RandomState(SEED)

    side = int(np.ceil(N_MOLECULES ** (1 / 3)))

    with open(PDB_PATH, "w") as f:
        serial = 1
        mol_idx = 0

        for iz in range(side):
            for iy in range(side):
                for ix in range(side):
                    if mol_idx >= N_MOLECULES:
                        break

                    # Grid center with small random offset
                    cx = ix * SPACING + rng.uniform(-0.5, 0.5)
                    cy = iy * SPACING + rng.uniform(-0.5, 0.5)
                    cz = iz * SPACING + rng.uniform(-0.5, 0.5)
                    center = np.array([cx, cy, cz], dtype=np.float32)

                    positions = make_water_positions(center)
                    elements = ["O", "H", "H"]
                    res_seq = (mol_idx % 9999) + 1

                    for atom_idx, (pos, elem) in enumerate(
                        zip(positions, elements)
                    ):
                        atom_name = f" {elem}{atom_idx + 1:>2d}" if elem == "H" else f" {elem}  "
                        f.write(
                            f"HETATM{serial % 100000:5d} {atom_name}"
                            f" HOH A{res_seq:4d}    "
                            f"{pos[0]:8.3f}{pos[1]:8.3f}{pos[2]:8.3f}"
                            f"  1.00  0.00           {elem:>2s}\n"
                        )
                        serial += 1

                    mol_idx += 1
                if mol_idx >= N_MOLECULES:
                    break
            if mol_idx >= N_MOLECULES:
                break

        # Write CONECT records for intramolecular bonds (O-H1, O-H2)
        for m in range(N_MOLECULES):
            o_serial = (m * 3 + 1) % 100000
            h1_serial = (m * 3 + 2) % 100000
            h2_serial = (m * 3 + 3) % 100000
            f.write(f"CONECT{o_serial:5d}{h1_serial:5d}{h2_serial:5d}\n")

        f.write("END\n")

    n_atoms = N_MOLECULES * 3
    print(f"Generated {PDB_PATH}: {N_MOLECULES} water molecules, {n_atoms} atoms")


if __name__ == "__main__":
    main()
