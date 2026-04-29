"""Generate small test trajectories showing a bond breaking across frames.

Two hydrogen atoms start bonded at ~0.74 Å and separate to ~3.0 Å over
5 frames. Two output formats are emitted from the same geometry:

- ``bond_change.traj`` — ASE binary trajectory; consumed by Python tests
  (``tests/python/test_bond_inference.py``).
- ``bond_change.xyz`` — multi-frame XYZ; consumed by the cross-host E2E
  suite (``tests/e2e/trajectory-bonds.spec.ts``). Multi-frame XYZ is the
  only trajectory format natively openable on every megane host.
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


def _distance_for_frame(i: int) -> float:
    t = i / (N_FRAMES - 1)
    return START_DIST + (END_DIST - START_DIST) * t


traj_path = "tests/fixtures/bond_change.traj"
with Trajectory(traj_path, "w") as traj:
    for i in range(N_FRAMES):
        d = _distance_for_frame(i)
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

print(f"Wrote {traj_path} with {N_FRAMES} frames, H-H dist {START_DIST}->{END_DIST} Å")

xyz_path = "tests/fixtures/bond_change.xyz"
with open(xyz_path, "w") as f:
    for i in range(N_FRAMES):
        d = _distance_for_frame(i)
        f.write("2\n")
        f.write(f"Frame {i} d={d:.3f}\n")
        f.write("H 0.000 0.000 0.000\n")
        f.write(f"H {d:.3f} 0.000 0.000\n")

print(f"Wrote {xyz_path} with {N_FRAMES} frames, H-H dist {START_DIST}->{END_DIST} Å")
