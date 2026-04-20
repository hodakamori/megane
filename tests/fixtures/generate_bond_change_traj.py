"""Generate a small test .traj file showing a bond breaking across frames.

Two hydrogen atoms start bonded at ~0.74 Å and separate to ~3.0 Å over
5 frames.  Used by ``tests/python/test_bond_inference.py`` to verify that
per-frame distance-based bond inference yields different bond sets.
"""

import numpy as np
from ase import Atoms
from ase.io.trajectory import Trajectory

N_FRAMES = 5
START_DIST = 0.74  # bonded H-H distance (Å)
END_DIST = 3.0     # clearly unbonded (Å)

cell = [[10.0, 0.0, 0.0],
        [0.0, 10.0, 0.0],
        [0.0, 0.0, 10.0]]

out_path = "tests/fixtures/bond_change.traj"
with Trajectory(out_path, "w") as traj:
    for i in range(N_FRAMES):
        t = i / (N_FRAMES - 1)
        d = START_DIST + (END_DIST - START_DIST) * t
        positions = np.array([
            [0.0, 0.0, 0.0],
            [d, 0.0, 0.0],
        ], dtype=np.float64)
        atoms = Atoms(
            "H2",
            positions=positions,
            cell=cell,
            pbc=True,
        )
        traj.write(atoms)

print(f"Wrote {out_path} with {N_FRAMES} frames, H-H dist {START_DIST}->{END_DIST} Å")
