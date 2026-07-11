"""Shared trajectory types used by multiple parser modules."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any

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


def encode_trajectory_frame(traj: InMemoryTrajectory, idx: int) -> bytes:
    """Encode frame ``idx`` of a trajectory as a binary MSG_FRAME message.

    For a *uniform* trajectory this is positions-only and byte-identical to the
    original wire format. For a *heterogeneous* trajectory it additionally carries
    the frame's per-atom elements (when the topology varies) and unit cell (when
    the cell varies), so the host viewer can swap atoms / cell as it plays back.
    """
    from megane.protocol import encode_frame

    positions = traj.get_frame(idx)
    elements = traj.get_elements(idx) if traj.heterogeneous else None
    box = traj.get_cell(idx) if (traj.heterogeneous and traj.cells is not None) else None
    return encode_frame(idx, positions, elements=elements, box=box)


def trajectory_from_structure_result(
    result: Any,
    positions: np.ndarray,
    elements: np.ndarray,
    box_3x3: np.ndarray,
    n_atoms: int,
    timestep_ps: float = 0.0,
) -> InMemoryTrajectory:
    """Build an :class:`InMemoryTrajectory` from a PyO3 ``PyStructure`` result.

    Handles both *uniform* multi-frame structures (rectangular ``frame_positions``
    fast path) and *heterogeneous* ones whose extra frames vary in atom count,
    cell, or elements (flat, jagged buffers sliced by ``frame_atom_offsets``).
    Frame 0 lives in ``positions``/``elements``/``box_3x3`` and is prepended so
    all frames are playable. Shared by every structure-lane trajectory loader
    (.traj, multi-frame XYZ, multi-MODEL PDB) so the unpacking stays in one place.

    Args:
        result: PyO3 structure parse result (``megane_parser.parse_*`` output).
        positions: Frame-0 positions, shape ``(n_atoms, 3)`` or flat ``(n_atoms*3,)``.
        elements: Frame-0 atomic numbers, shape ``(n_atoms,)``.
        box_3x3: Frame-0 unit cell, shape ``(3, 3)``.
        n_atoms: Frame-0 atom count.
        timestep_ps: Playback timestep in ps (formats without one pass 0.0).

    Returns:
        An :class:`InMemoryTrajectory` covering every frame.
    """
    positions = np.asarray(positions, dtype=np.float32).reshape(n_atoms, 3)
    elements = np.asarray(elements, dtype=np.uint8)
    box_3x3 = np.asarray(box_3x3, dtype=np.float32).reshape(3, 3)
    extra = int(result.n_frames)

    if getattr(result, "heterogeneous", False):
        # Heterogeneous: slice the flat, jagged extra-frame buffers by offset.
        offsets = np.asarray(result.frame_atom_offsets, dtype=np.int64)  # len extra+1
        flat = np.asarray(result.frame_positions_flat, dtype=np.float32)
        max_atoms = int(getattr(result, "max_atoms", n_atoms))

        frames_list: list[np.ndarray] = [positions]
        for i in range(extra):
            a, b = int(offsets[i]) * 3, int(offsets[i + 1]) * 3
            frames_list.append(flat[a:b].reshape(-1, 3))

        # Per-frame elements: empty when topology is constant → reuse frame 0.
        frame_elem_flat = np.asarray(result.frame_elements, dtype=np.uint8)
        if frame_elem_flat.size > 0:
            elements_list: list[np.ndarray] | None = [elements]
            for i in range(extra):
                a, b = int(offsets[i]), int(offsets[i + 1])
                elements_list.append(frame_elem_flat[a:b])
        else:
            elements_list = None

        # Per-frame cells: empty when the cell is constant → reuse frame 0.
        frame_cells_flat = np.asarray(result.frame_cells, dtype=np.float32)
        if frame_cells_flat.size > 0:
            extra_cells = frame_cells_flat.reshape(extra, 3, 3)
            cells = np.concatenate([box_3x3.reshape(1, 3, 3), extra_cells], axis=0)
        else:
            cells = None

        return InMemoryTrajectory(
            _frames=np.empty((0, 0, 3), dtype=np.float32),
            n_frames=len(frames_list),
            n_atoms=n_atoms,
            timestep_ps=timestep_ps,
            box=box_3x3,
            heterogeneous=True,
            max_atoms=max_atoms,
            frames_list=frames_list,
            elements_list=elements_list,
            cells=cells,
        )

    # Uniform fast path: rectangular reshape + concatenate.
    if extra > 0:
        extras = np.asarray(result.frame_positions, dtype=np.float32).reshape(extra, n_atoms, 3)
        frames = np.concatenate([positions.reshape(1, n_atoms, 3), extras], axis=0)
    else:
        frames = positions.reshape(1, n_atoms, 3).copy()

    return InMemoryTrajectory(
        _frames=frames,
        n_frames=frames.shape[0],
        n_atoms=n_atoms,
        timestep_ps=timestep_ps,
        box=box_3x3,
    )


def trajectory_from_traj_result(result: Any) -> InMemoryTrajectory:
    """Build an :class:`InMemoryTrajectory` from a PyO3 ``PyTrajectoryData``.

    Handles both *uniform* trajectory-lane formats (rectangular ``frame_positions``
    fast path) and *heterogeneous* ones whose frames vary in unit cell (XTC / DCD /
    NetCDF) or atom count / element type (LAMMPS dump). Unlike the structure lane,
    frame 0 lives *inside* the flat buffer, so ``frame_atom_offsets`` (when present)
    addresses all frames. Shared by every trajectory-lane reader.

    Args:
        result: PyO3 trajectory parse result (``megane_parser.parse_{xtc,dcd,
            lammpstrj,netcdf}`` output).

    Returns:
        An :class:`InMemoryTrajectory` covering every frame.
    """
    n_atoms = int(result.n_atoms)
    n_frames = int(result.n_frames)
    box_3x3 = np.asarray(result.box_matrix, dtype=np.float32).reshape(3, 3)

    if not getattr(result, "heterogeneous", False):
        frames = np.asarray(result.frame_positions, dtype=np.float32).reshape(n_frames, n_atoms, 3)
        return InMemoryTrajectory(
            _frames=frames,
            n_frames=n_frames,
            n_atoms=n_atoms,
            timestep_ps=float(result.timestep_ps),
            box=box_3x3,
        )

    flat = np.asarray(result.frame_positions_flat, dtype=np.float32)
    offsets = np.asarray(result.frame_atom_offsets, dtype=np.int64)  # empty ⇒ fixed atom count
    max_atoms = int(getattr(result, "max_atoms", n_atoms))

    frames_list: list[np.ndarray] = []
    if offsets.size > 0:
        for i in range(n_frames):
            a, b = int(offsets[i]) * 3, int(offsets[i + 1]) * 3
            frames_list.append(flat[a:b].reshape(-1, 3))
    else:
        stride = n_atoms * 3
        for i in range(n_frames):
            frames_list.append(flat[i * stride : (i + 1) * stride].reshape(n_atoms, 3))

    # Per-frame elements (LAMMPS type/element ids), empty when topology constant.
    frame_elem_flat = np.asarray(result.frame_elements, dtype=np.uint8)
    if frame_elem_flat.size > 0 and offsets.size > 0:
        elements_list: list[np.ndarray] | None = [
            frame_elem_flat[int(offsets[i]) : int(offsets[i + 1])] for i in range(n_frames)
        ]
    else:
        elements_list = None

    # Per-frame cells; frame 0 is `box_3x3`. In the trajectory lane the flat cells
    # cover ALL frames (frame 0 included), unlike the structure lane.
    frame_cells_flat = np.asarray(result.frame_cells, dtype=np.float32)
    if frame_cells_flat.size > 0:
        cells = frame_cells_flat.reshape(n_frames, 3, 3)
    else:
        cells = None

    return InMemoryTrajectory(
        _frames=np.empty((0, 0, 3), dtype=np.float32),
        n_frames=n_frames,
        n_atoms=n_atoms,
        timestep_ps=float(result.timestep_ps),
        box=box_3x3,
        heterogeneous=True,
        max_atoms=max_atoms,
        frames_list=frames_list,
        elements_list=elements_list,
        cells=cells,
    )
