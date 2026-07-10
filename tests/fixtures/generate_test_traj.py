"""Generate test .traj files for unit tests.

Produces one *uniform* fixture (``water.traj`` — constant atoms/cell/topology,
the fast path) plus three *heterogeneous* fixtures that each relax one of the
invariants the parser now supports:

- ``water_var_cell.traj``     — constant atoms/topology, unit cell changes.
- ``water_var_atoms.traj``    — atom count grows across frames.
- ``water_var_topology.traj`` — constant atom count, element identities change.
"""

import numpy as np
from ase import Atoms
from ase.io.trajectory import Trajectory

# ---------------------------------------------------------------------------
# Uniform fixture (unchanged): water, 5 frames, constant 3 atoms / cell.
# ---------------------------------------------------------------------------
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

# ---------------------------------------------------------------------------
# Heterogeneous fixture 1: constant atoms/topology, cell changes each frame
# (NPT / variable-cell relaxation).
# ---------------------------------------------------------------------------
var_cell_path = "tests/fixtures/water_var_cell.traj"
with Trajectory(var_cell_path, "w") as traj:
    for i in range(5):
        noise = np.random.RandomState(7 + i).randn(3, 3) * 0.03
        L = 10.0 + 0.5 * i  # cell isotropically expands
        atoms = Atoms(
            "OH2",
            positions=positions_base + noise,
            cell=[[L, 0.0, 0.0], [0.0, L, 0.0], [0.0, 0.0, L]],
            pbc=True,
        )
        traj.write(atoms)
print(f"Wrote {var_cell_path} with 5 frames, 3 atoms, expanding cell")

# ---------------------------------------------------------------------------
# Heterogeneous fixture 2: atom count grows across frames
# (adsorption / GCMC — extra water molecules appear).
# ---------------------------------------------------------------------------
var_atoms_path = "tests/fixtures/water_var_atoms.traj"
water_unit = np.array([
    [0.0, 0.0, 0.0],     # O
    [0.96, 0.0, 0.0],    # H
    [-0.24, 0.93, 0.0],  # H
], dtype=np.float64)
with Trajectory(var_atoms_path, "w") as traj:
    for i in range(5):
        n_mol = i + 1  # 1, 2, 3, 4, 5 water molecules → 3, 6, 9, 12, 15 atoms
        positions = []
        symbols = ""
        for m in range(n_mol):
            offset = np.array([3.0 * m, 0.0, 0.0])
            noise = np.random.RandomState(100 * i + m).randn(3, 3) * 0.03
            positions.append(water_unit + offset + noise)
            symbols += "OH2"
        atoms = Atoms(
            symbols,
            positions=np.concatenate(positions, axis=0),
            cell=cell,
            pbc=True,
        )
        traj.write(atoms)
print(f"Wrote {var_atoms_path} with 5 frames, 3..15 atoms")

# ---------------------------------------------------------------------------
# Heterogeneous fixture 3: constant atom count, element identities change
# (a toy "reaction" where species swap between frames).
# ---------------------------------------------------------------------------
var_topo_path = "tests/fixtures/water_var_topology.traj"
symbol_sets = ["OH2", "OHF", "NHF", "SH2", "OF2"]  # all 3 atoms, differing elements
with Trajectory(var_topo_path, "w") as traj:
    for i in range(5):
        noise = np.random.RandomState(21 + i).randn(3, 3) * 0.03
        atoms = Atoms(
            symbol_sets[i],
            positions=positions_base + noise,
            cell=cell,
            pbc=True,
        )
        traj.write(atoms)
print(f"Wrote {var_topo_path} with 5 frames, 3 atoms, changing elements")
