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
    assert v._pipeline_json != ""

    v.set_pipeline(None)
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


# ── File drop (drag-and-drop) tests ──────────────────────────────────────


def test_file_drop_traitlets_exist():
    """_drop_file_name and _drop_file_b64 traitlets are present and synced."""
    v = MolecularViewer()
    state = v.get_state()
    assert "_drop_file_name" in state
    assert "_drop_file_b64" in state
    assert v._drop_file_name == ""
    assert v._drop_file_b64 == ""


def test_file_drop_loads_pdb(tmp_path):
    """Dropping a PDB file populates the pipeline and fires file_drop event."""
    import base64

    v = MolecularViewer()
    events = []
    v.on_event("file_drop", lambda d: events.append(d))

    pdb_bytes = (FIXTURES / "1crn.pdb").read_bytes()
    b64 = base64.b64encode(pdb_bytes).decode()

    v._drop_file_name = "1crn.pdb"
    v._drop_file_b64 = b64

    assert len(events) == 1
    assert events[0]["name"] == "1crn.pdb"
    assert "error" not in events[0]
    assert v._pipeline_json != ""
    assert len(v._node_snapshots_data) > 0


def test_file_drop_loads_xyz():
    """Dropping an XYZ file populates the pipeline."""
    import base64

    v = MolecularViewer()
    events = []
    v.on_event("file_drop", lambda d: events.append(d))

    xyz_bytes = (FIXTURES / "perovskite_srtio3.xyz").read_bytes()
    b64 = base64.b64encode(xyz_bytes).decode()

    v._drop_file_name = "perovskite_srtio3.xyz"
    v._drop_file_b64 = b64

    assert len(events) == 1
    assert "error" not in events[0]
    assert v._pipeline_json != ""


def test_file_drop_unknown_extension_fires_error():
    """Dropping an unsupported format fires file_drop with error key."""
    import base64

    v = MolecularViewer()
    events = []
    v.on_event("file_drop", lambda d: events.append(d))

    b64 = base64.b64encode(b"not a real file").decode()
    v._drop_file_name = "structure.unknownfmt"
    v._drop_file_b64 = b64

    assert len(events) == 1
    assert events[0]["name"] == "structure.unknownfmt"
    assert "error" in events[0]


def test_file_drop_invalid_base64_fires_error():
    """Invalid base64 payload fires file_drop event with error."""
    v = MolecularViewer()
    events = []
    v.on_event("file_drop", lambda d: events.append(d))

    v._drop_file_name = "test.pdb"
    v._drop_file_b64 = "!!!not-valid-base64!!!"

    assert len(events) == 1
    assert "error" in events[0]


def test_file_drop_empty_b64_does_nothing():
    """Setting _drop_file_b64 to empty string is ignored."""
    v = MolecularViewer()
    events = []
    v.on_event("file_drop", lambda d: events.append(d))

    v._drop_file_name = "test.pdb"
    v._drop_file_b64 = ""

    assert len(events) == 0
    assert v._pipeline_json == ""


def test_file_drop_empty_name_does_nothing():
    """Setting _drop_file_b64 without a filename is ignored."""
    import base64

    v = MolecularViewer()
    events = []
    v.on_event("file_drop", lambda d: events.append(d))

    b64 = base64.b64encode(b"ATOM  1  N   ALA A   1\n").decode()
    v._drop_file_name = ""
    v._drop_file_b64 = b64

    assert len(events) == 0


def test_file_drop_successive_files():
    """Two successive file drops each load correctly."""
    import base64

    v = MolecularViewer()
    events = []
    v.on_event("file_drop", lambda d: events.append(d))

    for pdb in ("1crn.pdb", "1ubq.pdb"):
        b64 = base64.b64encode((FIXTURES / pdb).read_bytes()).decode()
        v._drop_file_name = pdb
        v._drop_file_b64 = b64

    assert len(events) == 2
    assert all("error" not in e for e in events)
    assert events[0]["name"] == "1crn.pdb"
    assert events[1]["name"] == "1ubq.pdb"
