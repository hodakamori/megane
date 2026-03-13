"""Generate a small test .traj file for unit tests."""

import numpy as np
from ase import Atoms
from ase.io.trajectory import Trajectory

# Simple water molecule with 5 frames
positions_base = np.array([
    [0.0, 0.0, 0.0],     # O
    [0.96, 0.0, 0.0],    # H
    [-0.24, 0.93, 0.0],  # H
], dtype=np.float64)

cell = [[10.0, 0.0, 0.0],
        [0.0, 10.0, 0.0],
        [0.0, 0.0, 10.0]]

out_path = "tests/fixtures/water.traj"
with Trajectory(out_path, "w") as traj:
    for i in range(5):
        # Slightly perturb positions for each frame
        noise = np.random.RandomState(42 + i).randn(3, 3) * 0.05
        atoms = Atoms(
            "OH2",
            positions=positions_base + noise,
            cell=cell,
            pbc=True,
        )
        traj.write(atoms)

print(f"Wrote {out_path} with 5 frames, 3 atoms")
