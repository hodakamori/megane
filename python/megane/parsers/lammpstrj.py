"""LAMMPS dump trajectory (.lammpstrj) reader backed by shared Rust megane-core."""

from __future__ import annotations

import logging

from megane import megane_parser
from megane.parsers.common import InMemoryTrajectory, trajectory_from_traj_result

__all__ = ["load_lammpstrj", "InMemoryTrajectory"]

logger = logging.getLogger(__name__)


def load_lammpstrj(dump_path: str) -> InMemoryTrajectory:
    """Load a LAMMPS dump trajectory file.

    Uses the shared Rust LAMMPS-dump parser (megane-core) so behavior matches the
    WASM frontend, including support for *heterogeneous* dumps whose atom count,
    box, or atom type varies between frames (GCMC / deposition runs).

    Args:
        dump_path: Path to .lammpstrj / .dump file.

    Returns:
        InMemoryTrajectory with frame-by-frame access.
    """
    logger.debug("Loading LAMMPS dump file: %s", dump_path)
    with open(dump_path) as f:
        text = f.read()

    result = megane_parser.parse_lammpstrj(text)
    trajectory = trajectory_from_traj_result(result)

    if trajectory.heterogeneous:
        counts = [f.shape[0] for f in (trajectory.frames_list or [])]
        logger.info(
            "Loaded heterogeneous LAMMPS dump: %d frames, %d..%d atoms",
            trajectory.n_frames,
            min(counts),
            max(counts),
        )
    else:
        logger.info(
            "Loaded LAMMPS dump: %d frames, %d atoms",
            trajectory.n_frames,
            trajectory.n_atoms,
        )
    return trajectory
