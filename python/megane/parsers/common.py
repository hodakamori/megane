"""Shared trajectory types used by multiple parser modules."""

from __future__ import annotations

from dataclasses import dataclass

import numpy as np


@dataclass
class InMemoryTrajectory:
    """In-memory trajectory with frame-by-frame access."""

    _frames: np.ndarray  # (n_frames, n_atoms, 3) float32 array
    n_frames: int
    n_atoms: int
    timestep_ps: float
    box: np.ndarray  # (3, 3) float32

    def get_frame(self, index: int) -> np.ndarray:
        """Get positions for a specific frame.

        Args:
            index: Frame index (0-based).

        Returns:
            (N, 3) float32 array of atom positions in Angstroms.

        Raises:
            ValueError: If *index* is out of range.
        """
        if not (0 <= index < self.n_frames):
            raise ValueError(f"Frame index {index} is out of range for trajectory with {self.n_frames} frames.")
        return self._frames[index]
