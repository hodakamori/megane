"""LAMMPS dump trajectory (.lammpstrj) reader."""

from __future__ import annotations

from dataclasses import dataclass

import numpy as np

from megane.parsers.pdb import cell_params_to_matrix


@dataclass
class InMemoryTrajectory:
    """In-memory trajectory with frame-by-frame access.

    Compatible interface with :class:`megane.parsers.xtc.Trajectory`.
    """

    _frames: list[np.ndarray]  # list of (N, 3) float32 arrays
    n_frames: int
    n_atoms: int
    timestep_ps: float
    box: np.ndarray  # (3, 3) float32

    def get_frame(self, index: int) -> np.ndarray:
        """Get positions for a specific frame.

        Returns:
            (N, 3) float32 array of atom positions in Angstroms.
        """
        return self._frames[index]


def load_lammpstrj(dump_path: str) -> InMemoryTrajectory:
    """Load a LAMMPS dump trajectory file.

    Args:
        dump_path: Path to .lammpstrj / .dump file.

    Returns:
        InMemoryTrajectory with frame-by-frame access.
    """
    with open(dump_path) as f:
        lines = f.readlines()

    frames: list[np.ndarray] = []
    timesteps: list[float] = []
    n_atoms = 0
    box_matrix = np.zeros((3, 3), dtype=np.float32)
    i = 0

    while i < len(lines):
        line = lines[i].strip()

        if line != "ITEM: TIMESTEP":
            i += 1
            continue

        # Timestep value
        i += 1
        timesteps.append(float(lines[i].strip()))

        # NUMBER OF ATOMS
        i += 1  # "ITEM: NUMBER OF ATOMS"
        i += 1
        frame_n_atoms = int(lines[i].strip())
        if not frames:
            n_atoms = frame_n_atoms

        # BOX BOUNDS
        i += 1
        box_header = lines[i].strip()
        is_triclinic = "xy xz yz" in box_header

        lo = [0.0] * 3
        hi = [0.0] * 3
        tilt = [0.0] * 3
        for dim in range(3):
            i += 1
            parts = lines[i].split()
            lo[dim] = float(parts[0])
            hi[dim] = float(parts[1])
            if is_triclinic and len(parts) >= 3:
                tilt[dim] = float(parts[2])

        # Store box from first frame
        if len(frames) == 0:
            if is_triclinic:
                xy, xz, yz = tilt
                lx = float(hi[0] - lo[0])
                ly = float(hi[1] - lo[1])
                lz = float(hi[2] - lo[2])
                box_matrix = np.array([
                    [lx, 0.0, 0.0],
                    [xy, ly, 0.0],
                    [xz, yz, lz],
                ], dtype=np.float32)
            else:
                lx = float(hi[0] - lo[0])
                ly = float(hi[1] - lo[1])
                lz = float(hi[2] - lo[2])
                box_matrix = np.diag([lx, ly, lz]).astype(np.float32)

        # ATOMS header — detect columns
        i += 1
        header_parts = lines[i].split()
        # Skip "ITEM:" and "ATOMS"
        col_names = header_parts[2:]
        id_col = col_names.index("id")

        coord_type = "unscaled"
        if "x" in col_names:
            x_col = col_names.index("x")
            y_col = col_names.index("y")
            z_col = col_names.index("z")
        elif "xs" in col_names:
            x_col = col_names.index("xs")
            y_col = col_names.index("ys")
            z_col = col_names.index("zs")
            coord_type = "scaled"
        elif "xu" in col_names:
            x_col = col_names.index("xu")
            y_col = col_names.index("yu")
            z_col = col_names.index("zu")
        else:
            raise ValueError("Cannot find coordinate columns in ATOMS header")

        # Read atoms
        atoms = []
        lx_f = hi[0] - lo[0]
        ly_f = hi[1] - lo[1]
        lz_f = hi[2] - lo[2]
        for _ in range(frame_n_atoms):
            i += 1
            parts = lines[i].split()
            aid = int(parts[id_col])
            x = float(parts[x_col])
            y = float(parts[y_col])
            z = float(parts[z_col])
            if coord_type == "scaled":
                x = x * lx_f + lo[0]
                y = y * ly_f + lo[1]
                z = z * lz_f + lo[2]
            atoms.append((aid, x, y, z))

        # Sort by id
        atoms.sort(key=lambda a: a[0])
        positions = np.array(
            [[x, y, z] for _, x, y, z in atoms], dtype=np.float32
        )
        frames.append(positions)
        i += 1

    timestep_ps = 0.0
    if len(timesteps) >= 2:
        timestep_ps = float(abs(timesteps[1] - timesteps[0]))

    return InMemoryTrajectory(
        _frames=frames,
        n_frames=len(frames),
        n_atoms=n_atoms,
        timestep_ps=timestep_ps,
        box=box_matrix,
    )
