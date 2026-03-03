"""Tests for Jupyter widget (Python side)."""

import struct
from pathlib import Path

from megane.protocol import MAGIC, MSG_SNAPSHOT
from megane.widget import MolecularViewer

FIXTURES = Path(__file__).parent.parent / "fixtures"


def test_widget_instantiation():
    """Widget can be created without errors."""
    v = MolecularViewer()
    assert v is not None
    assert v.frame_index == 0
    assert v.total_frames == 0
    assert v._snapshot_data == b""
    assert v._frame_data == b""


def test_esm_is_valid_js():
    """_esm resolves to non-empty JS string containing the render export."""
    v = MolecularViewer()
    esm = v._esm
    assert isinstance(esm, str)
    assert len(esm) > 1000  # widget.js is ~670KB
    assert "render" in esm
    assert "export" in esm


def test_esm_has_default_export():
    """_esm has a valid ESM default export."""
    v = MolecularViewer()
    esm = v._esm
    # Built by vite as: export { n_ as default }
    assert "as default" in esm


def test_load_populates_snapshot():
    """load() sets _snapshot_data to valid binary starting with MEGN magic."""
    v = MolecularViewer()
    v.load(str(FIXTURES / "1crn.pdb"))

    data = v._snapshot_data
    assert len(data) > 0
    assert data[:4] == MAGIC

    msg_type = struct.unpack("<B", data[4:5])[0]
    assert msg_type == MSG_SNAPSHOT


def test_snapshot_atom_count_matches():
    """Encoded snapshot contains the correct atom count."""
    v = MolecularViewer()
    v.load(str(FIXTURES / "1crn.pdb"))

    data = v._snapshot_data
    n_atoms = struct.unpack("<I", data[8:12])[0]
    assert n_atoms == v._structure.n_atoms
    assert n_atoms == 327


def test_widget_state_keys():
    """get_state() contains all required widget keys."""
    v = MolecularViewer()
    state = v.get_state()

    required_keys = {
        "_esm",
        "_snapshot_data",
        "_frame_data",
        "frame_index",
        "total_frames",
    }
    assert required_keys.issubset(set(state.keys()))


def test_model_metadata():
    """Widget uses anywidget model/view names."""
    v = MolecularViewer()
    assert v._model_name == "AnyModel"
    assert v._view_name == "AnyView"
    assert "anywidget" in v._model_module


def test_structure_accessible():
    """Loaded structure is accessible via _structure attribute."""
    v = MolecularViewer()
    v.load(str(FIXTURES / "1crn.pdb"))

    s = v._structure
    assert s is not None
    assert s.n_atoms == 327
    assert s.positions.shape == (327, 3)
    assert len(s.bonds) > 0
