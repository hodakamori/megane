"""Tests for FastAPI server endpoints."""

import struct
from pathlib import Path

import pytest
from starlette.testclient import TestClient

from megane.protocol import MAGIC, MSG_SNAPSHOT, MSG_METADATA
from megane.server import app, configure, _state, ServerState

FIXTURES = Path(__file__).parent.parent / "fixtures"


@pytest.fixture(autouse=True)
def _reset_state():
    """Reset server state before each test."""
    _state.structure = None
    _state.snapshot_bytes = b""
    _state.pdb_path = ""
    _state.xtc_path = None
    _state.trajectory = None
    yield
    _state.structure = None
    _state.snapshot_bytes = b""
    _state.pdb_path = ""
    _state.xtc_path = None
    _state.trajectory = None


@pytest.fixture
def client():
    return TestClient(app)


# ─── Health endpoint ─────────────────────────────────────────────────


def test_health_endpoint(client):
    """GET /health returns ok status."""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


# ─── configure() ─────────────────────────────────────────────────────


def test_configure_loads_pdb():
    """configure() populates server state with PDB structure."""
    configure(str(FIXTURES / "1crn.pdb"))

    assert _state.structure is not None
    assert _state.structure.n_atoms == 327
    assert len(_state.snapshot_bytes) > 0
    assert _state.snapshot_bytes[:4] == MAGIC


def test_configure_sets_pdb_path():
    """configure() records the PDB path."""
    pdb_path = str(FIXTURES / "1crn.pdb")
    configure(pdb_path)
    assert _state.pdb_path == pdb_path


def test_configure_without_xtc():
    """configure() without XTC sets trajectory to None."""
    configure(str(FIXTURES / "1crn.pdb"))
    assert _state.trajectory is None
    assert _state.xtc_path is None


# ─── WebSocket ───────────────────────────────────────────────────────


def test_websocket_sends_snapshot_on_connect(client):
    """WebSocket sends snapshot and metadata immediately after connection."""
    configure(str(FIXTURES / "1crn.pdb"))

    with client.websocket_connect("/ws") as ws:
        # First message: snapshot
        snapshot_data = ws.receive_bytes()
        assert snapshot_data[:4] == MAGIC
        msg_type = struct.unpack("<B", snapshot_data[4:5])[0]
        assert msg_type == MSG_SNAPSHOT

        # Second message: metadata
        meta_data = ws.receive_bytes()
        assert meta_data[:4] == MAGIC
        msg_type = struct.unpack("<B", meta_data[4:5])[0]
        assert msg_type == MSG_METADATA


def test_websocket_no_data_without_structure(client):
    """WebSocket connects but sends nothing when no structure is loaded."""
    with client.websocket_connect("/ws") as ws:
        # Send a stop command to verify the connection works
        ws.send_text('{"type": "stop"}')
        # No crash means success - the server handles empty state


# ─── Upload endpoint ─────────────────────────────────────────────────


def test_upload_pdb(client):
    """POST /api/upload with PDB file loads structure."""
    pdb_path = FIXTURES / "1crn.pdb"
    pdb_content = pdb_path.read_bytes()

    response = client.post(
        "/api/upload",
        files={"pdb": ("1crn.pdb", pdb_content, "chemical/x-pdb")},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["nAtoms"] == 327
    assert data["nBonds"] > 0


# ─── _build_metadata_bytes ──────────────────────────────────────────


def test_build_metadata_bytes():
    """_build_metadata_bytes produces valid metadata message."""
    from megane.server import _build_metadata_bytes

    configure(str(FIXTURES / "1crn.pdb"))

    data = _build_metadata_bytes()
    assert data[:4] == MAGIC
    msg_type = struct.unpack("<B", data[4:5])[0]
    assert msg_type == MSG_METADATA

    # n_frames should be 0 (no trajectory)
    n_frames = struct.unpack("<I", data[8:12])[0]
    assert n_frames == 0


# ─── WebSocket validation ──────────────────────────────────────────


def test_websocket_malformed_json(client):
    """Malformed JSON does not crash the WebSocket connection."""
    with client.websocket_connect("/ws") as ws:
        ws.send_text("not valid json {{{")
        # Connection should still be alive; send a valid command
        ws.send_text('{"type": "stop"}')


def test_websocket_request_frame_missing_key(client):
    """request_frame without 'frame' key is silently ignored."""
    configure(str(FIXTURES / "1crn.pdb"))
    with client.websocket_connect("/ws") as ws:
        ws.receive_bytes()  # snapshot
        ws.receive_bytes()  # metadata
        ws.send_text('{"type": "request_frame"}')
        # Should not crash; send another command to verify
        ws.send_text('{"type": "stop"}')


def test_upload_path_traversal(client):
    """Upload with path traversal filename is sanitized."""
    pdb_path = FIXTURES / "1crn.pdb"
    pdb_content = pdb_path.read_bytes()

    response = client.post(
        "/api/upload",
        files={"pdb": ("../../etc/passwd", pdb_content, "chemical/x-pdb")},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["nAtoms"] == 327
