"""Shared trajectory types used by multiple parser modules."""

from __future__ import annotations

from dataclasses import dataclass

import numpy as np


@dataclass
class InMemoryTrajectory:
    """In-memory trajectory with frame-by-frame access.

    Supports both *uniform* trajectories (constant atom count/topology/cell —
    stored in the rectangular ``_frames`` ndarray, the fast path) and
    *heterogeneous* ones whose frames differ in atom count, cell, or elements.
    For a heterogeneous trajectory ``heterogeneous`` is True and the per-frame
    data lives in the ``*_list`` fields instead of ``_frames``.
    """

    _frames: np.ndarray  # (n_frames, n_atoms, 3) float32 array (uniform only)
    n_frames: int
    n_atoms: int  # frame-0 atom count (see ``n_atoms_at`` for per-frame counts)
    timestep_ps: float
    box: np.ndarray  # (3, 3) float32 (frame-0 cell)
    heterogeneous: bool = False
    max_atoms: int = 0
    # Populated only when ``heterogeneous`` is True:
    frames_list: list[np.ndarray] | None = None  # per-frame (Ni, 3) positions
    elements_list: list[np.ndarray] | None = None  # per-frame (Ni,) atomic numbers
    cells: np.ndarray | None = None  # (n_frames, 3, 3) per-frame cells

    def __post_init__(self) -> None:
        if self.max_atoms == 0:
            self.max_atoms = self.n_atoms

    def get_frame(self, index: int) -> np.ndarray:
        """Get positions for a specific frame.

        Args:
            index: Frame index (0-based).

        Returns:
            (N, 3) float32 array of atom positions in Angstroms. N may differ
            between frames when the trajectory is heterogeneous.

        Raises:
            ValueError: If *index* is out of range.
        """
        if not (0 <= index < self.n_frames):
            raise ValueError(f"Frame index {index} is out of range for trajectory with {self.n_frames} frames.")
        if self.heterogeneous and self.frames_list is not None:
            return self.frames_list[index]
        return self._frames[index]

    def n_atoms_at(self, index: int) -> int:
        """Atom count of frame *index* (constant for uniform trajectories)."""
        return int(self.get_frame(index).shape[0])

    def get_elements(self, index: int) -> np.ndarray | None:
        """Per-frame atomic numbers, or None when topology is constant across
        frames (in which case the structure's frame-0 elements apply to all)."""
        if self.heterogeneous and self.elements_list is not None:
            return self.elements_list[index]
        return None

    def get_cell(self, index: int) -> np.ndarray:
        """Per-frame (3, 3) unit cell. Falls back to the frame-0 cell when the
        cell is constant across the trajectory."""
        if self.heterogeneous and self.cells is not None:
            if not (0 <= index < self.n_frames):
                raise ValueError(f"Frame index {index} is out of range for trajectory with {self.n_frames} frames.")
            return self.cells[index]
        return self.box
