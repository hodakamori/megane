"""FastAPI WebSocket server for megane molecular viewer."""

from __future__ import annotations

import asyncio
import json
import logging
import tempfile
from dataclasses import dataclass
from pathlib import Path
from typing import Optional

from fastapi import FastAPI, UploadFile, WebSocket, WebSocketDisconnect
from fastapi.staticfiles import StaticFiles

from megane.parsers.pdb import Structure, load_pdb
from megane.protocol import encode_frame, encode_metadata, encode_snapshot

logger = logging.getLogger(__name__)

app = FastAPI(title="megane")

# Track connected WebSocket clients for broadcasting
_clients: set[WebSocket] = set()


@dataclass
class ServerState:
    """Typed state for the currently loaded structure."""

    structure: Optional[Structure] = None
    snapshot_bytes: bytes = b""
    pdb_path: str = ""
    xtc_path: Optional[str] = None
    trajectory: object = None  # Optional[Trajectory] - lazy import


_state = ServerState()


def configure(pdb_path: str, xtc_path: str | None = None) -> None:
    """Configure the server with a molecular structure to serve."""
    structure = load_pdb(pdb_path)
    _state.structure = structure
    _state.snapshot_bytes = encode_snapshot(structure)
    _state.pdb_path = pdb_path
    _state.xtc_path = xtc_path
    _state.trajectory = None

    if xtc_path:
        from megane.parsers.xtc import load_trajectory

        traj = load_trajectory(pdb_path, xtc_path)
        _state.trajectory = traj
        logger.info(
            "Loaded trajectory: %d frames, %d atoms",
            traj.n_frames,
            traj.n_atoms,
        )

    logger.info(
        "Loaded %s: %d atoms, %d bonds",
        pdb_path,
        structure.n_atoms,
        len(structure.bonds),
    )


def _build_metadata_bytes() -> bytes:
    """Build metadata message bytes including file names."""
    traj = _state.trajectory
    pdb_name = Path(_state.pdb_path).name if _state.pdb_path else ""
    xtc_name = Path(_state.xtc_path).name if _state.xtc_path else ""
    return encode_metadata(
        n_frames=traj.n_frames if traj else 0,
        timestep_ps=traj.timestep_ps if traj else 0.0,
        n_atoms=traj.n_atoms if traj else (_state.structure.n_atoms if _state.structure else 0),
        pdb_name=pdb_name,
        xtc_name=xtc_name,
    )


async def _broadcast_snapshot() -> None:
    """Send snapshot and metadata to all connected clients."""
    meta_bytes = _build_metadata_bytes()
    for ws in list(_clients):
        try:
            await ws.send_bytes(_state.snapshot_bytes)
            await ws.send_bytes(meta_bytes)
        except Exception:
            _clients.discard(ws)


@app.get("/health")
async def health() -> dict:
    """Health check endpoint for load balancers and container orchestrators."""
    return {"status": "ok"}


@app.post("/api/upload")
async def upload_file(
    pdb: UploadFile,
    xtc: UploadFile | None = None,
) -> dict:
    """Upload a PDB file (and optional XTC) to load in the viewer."""
    with tempfile.TemporaryDirectory() as tmpdir:
        # Save PDB
        pdb_path = Path(tmpdir) / (pdb.filename or "upload.pdb")
        pdb_path.write_bytes(await pdb.read())

        # Save XTC if provided
        xtc_path = None
        if xtc is not None:
            xtc_path_obj = Path(tmpdir) / (xtc.filename or "upload.xtc")
            xtc_path_obj.write_bytes(await xtc.read())
            xtc_path = str(xtc_path_obj)

        configure(str(pdb_path), xtc_path)

    # Broadcast to all connected clients
    await _broadcast_snapshot()

    return {
        "nAtoms": _state.structure.n_atoms,
        "nBonds": len(_state.structure.bonds),
    }


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket) -> None:
    """WebSocket endpoint for streaming molecular data."""
    await websocket.accept()
    _clients.add(websocket)
    try:
        # Send snapshot and metadata immediately on connection
        if _state.structure is not None:
            await websocket.send_bytes(_state.snapshot_bytes)
            await websocket.send_bytes(_build_metadata_bytes())

        # Handle client commands
        while True:
            data = await websocket.receive_text()
            msg = json.loads(data)
            cmd = msg.get("type")
            traj = _state.trajectory

            if cmd == "request_frame" and traj is not None:
                frame_idx = msg["frame"]
                if 0 <= frame_idx < traj.n_frames:
                    positions = traj.get_frame(frame_idx)
                    await websocket.send_bytes(
                        encode_frame(frame_idx, positions)
                    )

            elif cmd == "stream" and traj is not None:
                start = msg.get("start", 0)
                end = msg.get("end", traj.n_frames)
                stride = msg.get("stride", 1)
                fps = msg.get("fps", 30)
                delay = 1.0 / fps

                for i in range(start, end, stride):
                    positions = traj.get_frame(i)
                    await websocket.send_bytes(encode_frame(i, positions))
                    await asyncio.sleep(delay)

            elif cmd == "stop":
                pass  # Stream cancellation handled by new commands

    except WebSocketDisconnect:
        logger.info("Client disconnected")
    finally:
        _clients.discard(websocket)


# Try to serve static files for the built web app
_static_dir = Path(__file__).parent / "static" / "app"
if _static_dir.exists():
    app.mount(
        "/", StaticFiles(directory=str(_static_dir), html=True), name="app"
    )
else:
    logger.warning(
        "Static app directory not found at %s. "
        "The web UI will not be available. "
        "Build the frontend with 'npm run build' first.",
        _static_dir,
    )
