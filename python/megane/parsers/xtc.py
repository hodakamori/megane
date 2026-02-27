"""XTC trajectory reader using MDAnalysis."""

from __future__ import annotations

from dataclasses import dataclass

import numpy as np


@dataclass
class Trajectory:
    """Trajectory data with frame-by-frame access."""

    _universe: object  # MDAnalysis.Universe
    n_frames: int
    n_atoms: int
    timestep_ps: float

    def get_frame(self, index: int) -> np.ndarray:
        """Get positions for a specific frame.

        Returns:
            (N, 3) float32 array of atom positions in Angstroms.
        """
        import MDAnalysis as mda

        universe: mda.Universe = self._universe  # type: ignore
        universe.trajectory[index]
        return universe.atoms.positions.astype(np.float32)


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

    return Trajectory(
        _universe=universe,
        n_frames=n_frames,
        n_atoms=n_atoms,
        timestep_ps=timestep_ps,
    )
