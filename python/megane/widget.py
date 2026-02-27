"""anywidget-based Jupyter widget for megane molecular viewer."""

from __future__ import annotations

import pathlib

import anywidget
import traitlets

from megane.parsers.pdb import load_pdb
from megane.protocol import encode_frame, encode_snapshot

_STATIC_DIR = pathlib.Path(__file__).parent / "static"


class MolecularViewer(anywidget.AnyWidget):
    """Interactive molecular viewer widget for Jupyter notebooks.

    Usage:
        >>> import megane
        >>> viewer = megane.MolecularViewer()
        >>> viewer.load("protein.pdb")
        >>> viewer  # displays in notebook cell

    With trajectory:
        >>> viewer.load("protein.pdb", xtc="trajectory.xtc")
        >>> viewer.frame_index = 50  # jump to frame 50
    """

    _esm = _STATIC_DIR / "widget.js"
    _css = ""

    # Binary data synced to JS (as DataView)
    _snapshot_data = traitlets.Bytes(b"").tag(sync=True)
    _frame_data = traitlets.Bytes(b"").tag(sync=True)

    # Trajectory state
    frame_index = traitlets.Int(0).tag(sync=True)
    total_frames = traitlets.Int(0).tag(sync=True)

    # Internal (not synced)
    _structure = None
    _trajectory = None

    def load(self, pdb_path: str, xtc: str | None = None) -> None:
        """Load a molecular structure, optionally with a trajectory.

        Args:
            pdb_path: Path to PDB file.
            xtc: Optional path to XTC trajectory file.
        """
        structure = load_pdb(pdb_path)
        self._structure = structure
        self._snapshot_data = encode_snapshot(structure)

        if xtc is not None:
            from megane.parsers.xtc import load_trajectory

            self._trajectory = load_trajectory(pdb_path, xtc)
            self.total_frames = self._trajectory.n_frames

    @traitlets.observe("frame_index")
    def _on_frame_change(self, change: dict) -> None:
        """Send new frame data when frame_index changes."""
        if self._trajectory is not None:
            idx = change["new"]
            if 0 <= idx < self._trajectory.n_frames:
                positions = self._trajectory.get_frame(idx)
                self._frame_data = encode_frame(idx, positions)
