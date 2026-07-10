"""AMBER NetCDF trajectory reader backed by shared Rust megane-core via PyO3."""

from __future__ import annotations

import logging

from megane import megane_parser
from megane.parsers.common import InMemoryTrajectory, trajectory_from_traj_result

__all__ = ["load_netcdf"]

logger = logging.getLogger(__name__)


def load_netcdf(path: str) -> InMemoryTrajectory:
    """Load an AMBER NetCDF trajectory file (.nc).

    NetCDF files contain only coordinate frames — topology (elements, bonds)
    must be supplied separately (e.g. via a PDB or AMBER prmtop file). Use
    the ``LoadStructure`` + ``LoadTrajectory`` pipeline pair to combine them.

    Args:
        path: Path to .nc file.

    Returns:
        InMemoryTrajectory with frame-by-frame access.
    """
    logger.debug("Loading AMBER NetCDF trajectory: %s", path)

    with open(path, "rb") as f:
        data = f.read()

    result = megane_parser.parse_netcdf(data)
    trajectory = trajectory_from_traj_result(result)

    logger.info(
        "Loaded AMBER NetCDF trajectory: %d frames, %d atoms%s",
        trajectory.n_frames,
        trajectory.n_atoms,
        " (variable cell)" if trajectory.heterogeneous else "",
    )
    return trajectory
