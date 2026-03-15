"""Tests for Jupyter widget (Python side)."""

import struct
import warnings
from pathlib import Path

from megane.pipeline import Pipeline, LoadStructure, AddBonds
from megane.protocol import MAGIC, MSG_SNAPSHOT
from megane.widget import MolecularViewer

FIXTURES = Path(__file__).parent.parent / "fixtures"


def _make_pdb_pipeline(pdb_path: str) -> Pipeline:
    """Helper: create a Pipeline that loads a PDB with bonds."""
    pipe = Pipeline()
    s = pipe.add_node(LoadStructure(pdb_path))
    b = pipe.add_node(AddBonds(source="structure"))
    pipe.add_edge(s.out.particle, b.inp.particle)
    return pipe


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


def test_set_pipeline_populates_snapshot():
    """set_pipeline() sets _node_snapshots_data with valid binary."""
    v = MolecularViewer()
    pipe = _make_pdb_pipeline(str(FIXTURES / "1crn.pdb"))
    v.set_pipeline(pipe)

    assert v._pipeline_enabled is True
    assert v._pipeline_json != ""
    assert len(v._node_snapshots_data) > 0


def test_pipeline_snapshot_has_magic():
    """Pipeline node snapshot data starts with MEGN magic."""
    v = MolecularViewer()
    pipe = _make_pdb_pipeline(str(FIXTURES / "1crn.pdb"))
    v.set_pipeline(pipe)

    for data in v._node_snapshots_data.values():
        if len(data) > 4:
            assert data[:4] == MAGIC
            msg_type = struct.unpack("<B", data[4:5])[0]
            assert msg_type == MSG_SNAPSHOT


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


def test_set_pipeline_and_clear():
    """set_pipeline(None) clears the pipeline."""
    v = MolecularViewer()
    pipe = _make_pdb_pipeline(str(FIXTURES / "1crn.pdb"))
    v.set_pipeline(pipe)
    assert v._pipeline_enabled is True

    v.set_pipeline(None)
    assert v._pipeline_enabled is False
    assert v._pipeline_json == ""
    assert v._node_snapshots_data == {}


def test_deprecated_load_warns():
    """load() emits DeprecationWarning."""
    v = MolecularViewer()
    with warnings.catch_warnings(record=True) as w:
        warnings.simplefilter("always")
        v.load(str(FIXTURES / "1crn.pdb"))
    assert len(w) == 1
    assert issubclass(w[0].category, DeprecationWarning)
    assert "set_pipeline" in str(w[0].message)
