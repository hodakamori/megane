"""Tests for the shared trajectory-lane unpacking helper.

These exercise ``trajectory_from_traj_result`` with hand-built fake PyO3 results
(no binary fixture needed) to cover both the uniform fast path and the
heterogeneous per-frame-cell / variable-atom paths that XTC / DCD / NetCDF /
LAMMPS dump readers feed it.
"""

from __future__ import annotations

from types import SimpleNamespace

import numpy as np

from megane.parsers.common import trajectory_from_traj_result


def _uniform_result():
    # 2 frames, 2 atoms, rectangular frame_positions fast path.
    return SimpleNamespace(
        n_atoms=2,
        n_frames=2,
        timestep_ps=1.0,
        box_matrix=np.eye(3, dtype=np.float32) * 10.0,
        frame_positions=np.arange(2 * 2 * 3, dtype=np.float32),
        heterogeneous=False,
    )


def test_uniform_trajectory_fast_path():
    traj = trajectory_from_traj_result(_uniform_result())
    assert traj.heterogeneous is False
    assert traj.n_frames == 2
    assert traj.n_atoms == 2
    assert traj.get_frame(1).shape == (2, 3)


def test_variable_cell_trajectory():
    # Fixed atom count (frame_atom_offsets empty) but the cell changes per frame.
    flat = np.arange(2 * 2 * 3, dtype=np.float32)  # 2 frames × 2 atoms × 3
    cells = np.array(
        [
            [[10, 0, 0], [0, 10, 0], [0, 0, 10]],
            [[12, 0, 0], [0, 12, 0], [0, 0, 12]],
        ],
        dtype=np.float32,
    )
    result = SimpleNamespace(
        n_atoms=2,
        n_frames=2,
        timestep_ps=1.0,
        box_matrix=cells[0],
        frame_positions=np.empty((0, 0), dtype=np.float32),
        heterogeneous=True,
        varies_atoms=False,
        varies_cell=True,
        varies_topology=False,
        max_atoms=2,
        frame_positions_flat=flat,
        frame_atom_offsets=np.array([], dtype=np.uint32),
        frame_elements=np.array([], dtype=np.uint8),
        frame_cells=cells.reshape(-1),
    )
    traj = trajectory_from_traj_result(result)
    assert traj.heterogeneous is True
    # Fixed atom count → every frame has 2 atoms.
    assert traj.n_atoms_at(0) == 2
    assert traj.n_atoms_at(1) == 2
    # Per-frame cell grows 10 → 12; elements table absent (topology constant).
    assert traj.get_elements(0) is None
    assert traj.get_cell(0)[0, 0] == 10.0
    assert traj.get_cell(1)[0, 0] == 12.0


def test_variable_atom_trajectory():
    # Frame 0 has 2 atoms, frame 1 has 3 (LAMMPS-style growth), with per-frame types.
    flat = np.arange((2 + 3) * 3, dtype=np.float32)
    result = SimpleNamespace(
        n_atoms=2,
        n_frames=2,
        timestep_ps=1.0,
        box_matrix=np.eye(3, dtype=np.float32),
        frame_positions=np.empty((0, 0), dtype=np.float32),
        heterogeneous=True,
        varies_atoms=True,
        varies_cell=False,
        varies_topology=True,
        max_atoms=3,
        frame_positions_flat=flat,
        frame_atom_offsets=np.array([0, 2, 5], dtype=np.uint32),
        frame_elements=np.array([1, 1, 1, 6, 8], dtype=np.uint8),
        frame_cells=np.array([], dtype=np.float32),
    )
    traj = trajectory_from_traj_result(result)
    assert traj.n_atoms_at(0) == 2
    assert traj.n_atoms_at(1) == 3
    assert traj.max_atoms == 3
    assert traj.get_elements(1).tolist() == [1, 6, 8]
    assert traj.get_frame(1).shape == (3, 3)
