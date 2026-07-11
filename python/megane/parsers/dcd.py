"""DCD trajectory reader backed by shared Rust megane-core via PyO3."""

from __future__ import annotations

import logging

from megane import megane_parser
from megane.parsers.common import InMemoryTrajectory, trajectory_from_traj_result

__all__ = ["load_dcd"]

logger = logging.getLogger(__name__)


def load_dcd(path: str) -> InMemoryTrajectory:
    """Load a DCD trajectory file (CHARMM/NAMD/X-PLOR format).

    DCD files contain only coordinate frames — topology (elements, bonds)
    must be supplied separately (e.g. via a PSF or PDB file). Use the
    ``LoadStructure`` + ``LoadTrajectory`` pipeline pair to combine them.

    Args:
        path: Path to .dcd file.

    Returns:
        InMemoryTrajectory with frame-by-frame access.
    """
    logger.debug("Loading DCD trajectory: %s", path)

    with open(path, "rb") as f:
        data = f.read()

    result = megane_parser.parse_dcd(data)
    trajectory = trajectory_from_traj_result(result)

    logger.info(
        "Loaded DCD trajectory: %d frames, %d atoms%s",
        trajectory.n_frames,
        trajectory.n_atoms,
        " (variable cell)" if trajectory.heterogeneous else "",
    )
    return trajectory
