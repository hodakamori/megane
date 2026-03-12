"""anywidget-based Jupyter widget for megane molecular viewer."""

from __future__ import annotations

import json
import pathlib
from collections import defaultdict
from typing import Callable

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

    External event triggers:
        >>> # Set atom selection programmatically
        >>> viewer.selected_atoms = [10, 20, 30, 40]
        >>> print(viewer.measurement)  # dihedral angle result

        >>> # React to events
        >>> @viewer.on_event("measurement")
        ... def on_measurement(data):
        ...     print(f"Measured: {data}")

        >>> # Plotly integration example
        >>> fig = go.FigureWidget(data=[go.Scatter(x=times, y=energies)])
        >>> def on_click(trace, points, state):
        ...     viewer.frame_index = points.point_inds[0]
        >>> fig.data[0].on_click(on_click)
    """

    _esm = _STATIC_DIR / "widget.js"
    _css = ""

    # Binary data synced to JS (as DataView)
    _snapshot_data = traitlets.Bytes(b"").tag(sync=True)
    _frame_data = traitlets.Bytes(b"").tag(sync=True)

    # Trajectory state
    frame_index = traitlets.Int(0).tag(sync=True)
    total_frames = traitlets.Int(0).tag(sync=True)

    # External event triggers (Python → JS)
    selected_atoms = traitlets.List(traitlets.Int(), []).tag(sync=True)

    # Measurement result (JS → Python)
    _measurement_json = traitlets.Unicode("").tag(sync=True)

    # Pipeline
    pipeline = traitlets.Bool(False).tag(sync=True)
    _pipeline_json = traitlets.Unicode("").tag(sync=True)

    # Internal (not synced)
    _structure = None
    _trajectory = None

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._event_handlers: dict[str, list[Callable]] = defaultdict(list)

    def load(
        self,
        pdb_path: str,
        xtc: str | None = None,
        traj: str | None = None,
    ) -> None:
        """Load a molecular structure, optionally with a trajectory.

        Args:
            pdb_path: Path to PDB file.
            xtc: Optional path to XTC trajectory file.
            traj: Optional path to ASE .traj file.  When provided,
                *pdb_path* is ignored and both structure and trajectory
                are read from the .traj file.
        """
        if traj is not None:
            from megane.parsers.traj import load_traj

            structure, trajectory = load_traj(traj)
            self._structure = structure
            self._snapshot_data = encode_snapshot(structure)
            self._trajectory = trajectory
            self.total_frames = trajectory.n_frames
            return

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
        self._fire_event("frame_change", {
            "frame_index": change["new"],
        })

    @traitlets.observe("_measurement_json")
    def _on_measurement_change(self, change: dict) -> None:
        """Fire measurement event when JS sends measurement data."""
        raw = change["new"]
        if not raw:
            self._fire_event("measurement", None)
            return
        data = json.loads(raw)
        self._fire_event("measurement", data)

    @traitlets.observe("selected_atoms")
    def _on_selected_atoms_change(self, change: dict) -> None:
        """Fire selection_change event."""
        self._fire_event("selection_change", {
            "atoms": list(change["new"]),
        })

    @property
    def measurement(self) -> dict | None:
        """Current measurement result, or None if fewer than 2 atoms selected.

        Returns a dict with keys: type, value, label, atoms.
        Example: {'type': 'dihedral', 'value': 120.5, 'label': '120.5°',
                  'atoms': [10, 20, 30, 40]}
        """
        if not self._measurement_json:
            return None
        return json.loads(self._measurement_json)

    def on_event(self, event_name: str, callback: Callable | None = None):
        """Register a callback for an event.

        Can be used as a decorator or a method call:

            @viewer.on_event("measurement")
            def on_measurement(data):
                print(data)

            # or equivalently:
            viewer.on_event("measurement", on_measurement)

        Supported events:
            - "frame_change": fired when frame_index changes.
              Data: {"frame_index": int}
            - "selection_change": fired when selected_atoms changes.
              Data: {"atoms": list[int]}
            - "measurement": fired when a measurement is computed.
              Data: {"type": str, "value": float, "label": str,
                     "atoms": list[int]} or None

        Args:
            event_name: Name of the event.
            callback: Callable to invoke. If None, returns a decorator.

        Returns:
            The callback (for decorator usage).
        """
        if callback is not None:
            self._event_handlers[event_name].append(callback)
            return callback

        # Decorator usage
        def decorator(fn: Callable) -> Callable:
            self._event_handlers[event_name].append(fn)
            return fn
        return decorator

    def off_event(self, event_name: str, callback: Callable | None = None):
        """Remove event callback(s).

        Args:
            event_name: Name of the event.
            callback: Specific callback to remove. If None, removes all
                callbacks for the event.
        """
        if callback is None:
            self._event_handlers.pop(event_name, None)
        else:
            handlers = self._event_handlers.get(event_name, [])
            self._event_handlers[event_name] = [
                h for h in handlers if h is not callback
            ]

    def load_pipeline(self, config: dict | str) -> None:
        """Load a pipeline configuration.

        Args:
            config: Pipeline configuration as a dict or JSON string.
        """
        if isinstance(config, dict):
            config = json.dumps(config)
        self._pipeline_json = config

    @property
    def pipeline_config(self) -> dict | None:
        """Current pipeline configuration, or None if not set."""
        if not self._pipeline_json:
            return None
        return json.loads(self._pipeline_json)

    def _fire_event(self, event_name: str, data) -> None:
        """Invoke all registered callbacks for an event."""
        for handler in self._event_handlers.get(event_name, []):
            handler(data)
