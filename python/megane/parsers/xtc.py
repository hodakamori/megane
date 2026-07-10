"""XTC trajectory reader backed by shared Rust megane-core via PyO3."""

from __future__ import annotations

import logging

from megane import megane_parser
from megane.parsers.common import InMemoryTrajectory, trajectory_from_traj_result

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
    if n_atoms != pdb_result.n_atoms:
        raise ValueError(f"Atom count mismatch: PDB has {pdb_result.n_atoms} atoms, XTC has {n_atoms} atoms.")

    trajectory = trajectory_from_traj_result(result)
    logger.info(
        "Loaded XTC trajectory: %d frames, %d atoms%s",
        trajectory.n_frames,
        n_atoms,
        " (variable cell)" if trajectory.heterogeneous else "",
    )
    return trajectory
