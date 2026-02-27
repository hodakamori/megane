"""Generate a synthetic XTC trajectory for testing.

Creates a trajectory where atoms vibrate around their PDB positions.
"""

import numpy as np
import MDAnalysis as mda
from MDAnalysis.coordinates.XTC import XTCWriter

PDB_PATH = "tests/fixtures/1crn.pdb"
XTC_PATH = "tests/fixtures/1crn_vibration.xtc"
N_FRAMES = 100
AMPLITUDE = 0.3  # Angstroms


def main():
    u = mda.Universe(PDB_PATH)
    base_positions = u.atoms.positions.copy()

    with XTCWriter(XTC_PATH, n_atoms=len(u.atoms)) as writer:
        for frame_idx in range(N_FRAMES):
            t = frame_idx / N_FRAMES * 2 * np.pi
            # Sinusoidal vibration with random per-atom phase
            rng = np.random.RandomState(42)
            phases = rng.uniform(0, 2 * np.pi, size=(len(u.atoms), 1))
            displacement = AMPLITUDE * np.sin(t + phases) * rng.uniform(
                0.5, 1.0, size=(len(u.atoms), 3)
            )
            u.atoms.positions = base_positions + displacement.astype(np.float32)
            u.trajectory.ts.frame = frame_idx
            writer.write(u.atoms)

    print(f"Generated {XTC_PATH}: {N_FRAMES} frames, {len(u.atoms)} atoms")


if __name__ == "__main__":
    main()
