"""XTC trajectory reader backed by shared Rust megane-core via PyO3."""

from __future__ import annotations

import logging

import numpy as np

from megane import megane_parser
from megane.parsers.common import InMemoryTrajectory

logger = logging.getLogger(__name__)


def load_trajectory(pdb_path: str, xtc_path: str) -> InMemoryTrajectory:
    """Load a trajectory from PDB topology + XTC coordinates.

    Uses the Rust XTC parser (megane-core) instead of MDAnalysis.

    Args:
        pdb_path: Path to PDB file (topology, used for atom count validation).
        xtc_path: Path to XTC file (trajectory).

    Returns:
        InMemoryTrajectory with frame-by-frame access.
    """
    logger.debug("Loading XTC trajectory: %s (topology: %s)", xtc_path, pdb_path)

    # Parse PDB for atom count validation
    with open(pdb_path) as f:
        pdb_text = f.read()
    pdb_result = megane_parser.parse_pdb(pdb_text)

    # Parse XTC binary
    with open(xtc_path, "rb") as f:
        xtc_bytes = f.read()
    result = megane_parser.parse_xtc(xtc_bytes)

    n_atoms = result.n_atoms
    n_frames = result.n_frames

    if n_atoms != pdb_result.n_atoms:
        raise ValueError(f"Atom count mismatch: PDB has {pdb_result.n_atoms} atoms, XTC has {n_atoms} atoms.")

    # Convert flat frame_positions (n_frames, n_atoms*3) to list of (n_atoms, 3)
    frame_data = np.asarray(result.frame_positions, dtype=np.float32)
    frames = [frame_data[i].reshape(n_atoms, 3) for i in range(n_frames)]

    box_matrix = np.asarray(result.box_matrix, dtype=np.float32)

    logger.info("Loaded XTC trajectory: %d frames, %d atoms", n_frames, n_atoms)

    return InMemoryTrajectory(
        _frames=frames,
        n_frames=n_frames,
        n_atoms=n_atoms,
        timestep_ps=result.timestep_ps,
        box=box_matrix,
    )
