"""XTC trajectory reader using MDAnalysis."""

from __future__ import annotations

from dataclasses import dataclass

import numpy as np

from megane.parsers.pdb import cell_params_to_matrix


@dataclass
class Trajectory:
    """Trajectory data with frame-by-frame access."""

    _universe: object  # MDAnalysis.Universe
    n_frames: int
    n_atoms: int
    timestep_ps: float
    box: np.ndarray  # (3, 3) float32 - cell vectors as rows

    def get_frame(self, index: int) -> np.ndarray:
        """Get positions for a specific frame.

        Returns:
            (N, 3) float32 array of atom positions in Angstroms.
        """
        import MDAnalysis as mda

        universe: mda.Universe = self._universe  # type: ignore
        universe.trajectory[index]
        return universe.atoms.positions.astype(np.float32)


def _box_from_dimensions(dimensions: np.ndarray | None) -> np.ndarray:
    """Convert MDAnalysis dimensions [a, b, c, alpha, beta, gamma] to 3x3 matrix."""
    if dimensions is None:
        return np.zeros((3, 3), dtype=np.float32)
    a, b, c, alpha, beta, gamma = dimensions
    if a == 0 and b == 0 and c == 0:
        return np.zeros((3, 3), dtype=np.float32)
    return cell_params_to_matrix(float(a), float(b), float(c),
                                 float(alpha), float(beta), float(gamma))


def load_trajectory(pdb_path: str, xtc_path: str) -> Trajectory:
    """Load a trajectory from PDB topology + XTC coordinates.

    Args:
        pdb_path: Path to PDB file (topology).
        xtc_path: Path to XTC file (trajectory).

    Returns:
        Trajectory object with frame-by-frame access.
    """
    import MDAnalysis as mda

    universe = mda.Universe(pdb_path, xtc_path)
    n_frames = len(universe.trajectory)
    n_atoms = len(universe.atoms)
    timestep_ps = universe.trajectory.dt
    box = _box_from_dimensions(universe.dimensions)

    return Trajectory(
        _universe=universe,
        n_frames=n_frames,
        n_atoms=n_atoms,
        timestep_ps=timestep_ps,
        box=box,
    )
