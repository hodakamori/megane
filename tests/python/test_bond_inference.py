"""Per-frame distance-based bond inference across a trajectory.

Demonstrates that ``bonds="distance"`` in :func:`megane.view_traj` yields
different bond sets when atoms move far enough apart: a bond is present at
the first frame and absent at the last frame of ``bond_change.traj``.
"""

from pathlib import Path

import numpy as np

from megane import megane_parser
from megane.parsers.traj import load_traj

FIXTURES = Path(__file__).parent.parent / "fixtures"


def _bond_set(elements: np.ndarray, positions: np.ndarray) -> set[tuple[int, int]]:
    bonds = megane_parser.infer_bonds_vdw(elements, positions)
    return {(int(a), int(b)) for a, b in bonds}


def test_bonds_change_across_trajectory():
    structure, trajectory = load_traj(str(FIXTURES / "bond_change.traj"))

    assert trajectory.n_frames == 5
    assert structure.n_atoms == 2

    elements = structure.elements

    first = _bond_set(elements, trajectory.get_frame(0))
    last = _bond_set(elements, trajectory.get_frame(trajectory.n_frames - 1))

    assert first == {(0, 1)}, "frame 0: H-H at 0.74 Å should produce one bond"
    assert last == set(), "last frame: H-H at 3.0 Å should produce no bonds"
    assert first != last, "bond set must differ between frames"


def test_bonds_monotonic_break():
    """As the H-H distance grows, the bond should disappear and not reappear."""
    structure, trajectory = load_traj(str(FIXTURES / "bond_change.traj"))
    elements = structure.elements

    had_bond = [
        bool(_bond_set(elements, trajectory.get_frame(i)))
        for i in range(trajectory.n_frames)
    ]
    assert had_bond[0] is True
    assert had_bond[-1] is False
    # Once the bond breaks, it stays broken for subsequent frames.
    broken_at = had_bond.index(False)
    assert all(b is False for b in had_bond[broken_at:])
