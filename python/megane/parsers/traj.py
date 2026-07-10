"""ASE .traj file reader backed by shared Rust megane-core via PyO3."""

from __future__ import annotations

import logging

import numpy as np

from megane import megane_parser
from megane.parsers.common import InMemoryTrajectory
from megane.parsers.pdb import Structure

__all__ = ["load_traj", "InMemoryTrajectory"]

logger = logging.getLogger(__name__)


def load_traj(path: str) -> tuple[Structure, InMemoryTrajectory]:
    """Load an ASE .traj file as structure + trajectory.

    Uses the Rust .traj parser (megane-core) instead of ASE.
    The first frame defines the topology (elements, bonds). All frames
    are read into memory.

    Args:
        path: Path to .traj file.

    Returns:
        Tuple of (Structure, InMemoryTrajectory).
    """
    logger.debug("Loading ASE .traj file: %s", path)

    with open(path, "rb") as f:
        data = f.read()

    result = megane_parser.parse_traj(data)

    n_atoms = result.n_atoms
    positions = np.asarray(result.positions, dtype=np.float32)
    elements = np.asarray(result.elements, dtype=np.uint8)
    bonds = np.asarray(result.bonds, dtype=np.uint32)
    bond_orders = np.asarray(result.bond_orders, dtype=np.uint8)
    box_matrix = np.asarray(result.box_matrix, dtype=np.float32)

    structure = Structure(
        n_atoms=n_atoms,
        positions=positions,
        elements=elements,
        bonds=bonds,
        bond_orders=bond_orders,
        box=box_matrix,
    )

    # Rust returns frame 0 in `positions` and additional (extra) frames either
    # rectangular (uniform) or jagged (heterogeneous). Prepend frame 0 so all
    # frames are playable.
    extra = result.n_frames
    box_3x3 = box_matrix.reshape(3, 3)

    if getattr(result, "heterogeneous", False):
        # Heterogeneous: slice the flat, jagged extra-frame buffers by offset.
        offsets = np.asarray(result.frame_atom_offsets, dtype=np.int64)  # len extra+1
        flat = np.asarray(result.frame_positions_flat, dtype=np.float32)
        max_atoms = int(getattr(result, "max_atoms", n_atoms))

        frames_list: list[np.ndarray] = [positions.reshape(n_atoms, 3)]
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

        n_frames = len(frames_list)
        trajectory = InMemoryTrajectory(
            _frames=np.empty((0, 0, 3), dtype=np.float32),
            n_frames=n_frames,
            n_atoms=n_atoms,
            timestep_ps=0.0,
            box=box_3x3,
            heterogeneous=True,
            max_atoms=max_atoms,
            frames_list=frames_list,
            elements_list=elements_list,
            cells=cells,
        )
        logger.info(
            "Loaded heterogeneous .traj: %d frames, %d..%d atoms",
            n_frames,
            min(f.shape[0] for f in frames_list),
            max(f.shape[0] for f in frames_list),
        )
        return structure, trajectory

    # Uniform fast path (unchanged): rectangular reshape + concatenate.
    if extra > 0:
        extras = np.asarray(result.frame_positions, dtype=np.float32).reshape(extra, n_atoms, 3)
        frames = np.concatenate([positions.reshape(1, n_atoms, 3), extras], axis=0)
    else:
        frames = positions.reshape(1, n_atoms, 3).copy()
    n_frames = frames.shape[0]

    trajectory = InMemoryTrajectory(
        _frames=frames,
        n_frames=n_frames,
        n_atoms=n_atoms,
        timestep_ps=0.0,
        box=box_3x3,
    )

    logger.info("Loaded .traj: %d frames, %d atoms, %d bonds", n_frames, n_atoms, len(bonds))
    return structure, trajectory
