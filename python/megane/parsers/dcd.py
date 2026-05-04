"""DCD trajectory reader backed by shared Rust megane-core via PyO3."""

from __future__ import annotations

import logging

import numpy as np

from megane import megane_parser
from megane.parsers.common import InMemoryTrajectory

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

    n_atoms = result.n_atoms
    n_frames = result.n_frames
    frames = np.asarray(result.frame_positions, dtype=np.float32).reshape(n_frames, n_atoms, 3)
    box_matrix = np.asarray(result.box_matrix, dtype=np.float32)

    logger.info("Loaded DCD trajectory: %d frames, %d atoms", n_frames, n_atoms)

    return InMemoryTrajectory(
        _frames=frames,
        n_frames=n_frames,
        n_atoms=n_atoms,
        timestep_ps=result.timestep_ps,
        box=box_matrix,
    )
