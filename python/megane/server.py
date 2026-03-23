"""FastAPI WebSocket server for megane molecular viewer."""

from __future__ import annotations

import asyncio
import json
import logging
import os
import tempfile
from dataclasses import dataclass
from pathlib import Path
from typing import TYPE_CHECKING, Optional

from fastapi import FastAPI, UploadFile, WebSocket, WebSocketDisconnect
from fastapi.staticfiles import StaticFiles

from megane.parsers.pdb import Structure, load_pdb
from megane.protocol import encode_frame, encode_metadata, encode_snapshot

if TYPE_CHECKING:
    from megane.parsers.common import InMemoryTrajectory

__all__ = ["app", "configure"]

logger = logging.getLogger(__name__)

app = FastAPI(title="megane")

# Track connected WebSocket clients for broadcasting
_clients: set[WebSocket] = set()
_clients_lock = asyncio.Lock()


@dataclass
class ServerState:
    """Typed state for the currently loaded structure."""

    structure: Optional[Structure] = None
    snapshot_bytes: bytes = b""
    pdb_path: str = ""
    xtc_path: Optional[str] = None
    trajectory: Optional[InMemoryTrajectory] = None


_state = ServerState()


def configure(
    pdb_path: str,
    xtc_path: str | None = None,
    traj_path: str | None = None,
) -> None:
    """Configure the server with a molecular structure to serve."""
    _state.xtc_path = xtc_path
    _state.trajectory = None

    if traj_path is not None:
        from megane.parsers.traj import load_traj

        structure, traj = load_traj(traj_path)
        _state.structure = structure
        _state.snapshot_bytes = encode_snapshot(structure)
        _state.pdb_path = traj_path
        _state.trajectory = traj
        logger.info(
            "Loaded .traj: %d frames, %d atoms, %d bonds",
            traj.n_frames,
            traj.n_atoms,
            len(structure.bonds),
        )
        return

    structure = load_pdb(pdb_path)
    _state.structure = structure
    _state.snapshot_bytes = encode_snapshot(structure)
    _state.pdb_path = pdb_path

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
    async with _clients_lock:
        clients_snapshot = list(_clients)
    for ws in clients_snapshot:
        try:
            await ws.send_bytes(_state.snapshot_bytes)
            await ws.send_bytes(meta_bytes)
        except (WebSocketDisconnect, RuntimeError):
            async with _clients_lock:
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
        pdb_path = Path(tmpdir) / Path(pdb.filename or "upload.pdb").name
        pdb_path.write_bytes(await pdb.read())

        # Save XTC if provided
        xtc_path = None
        if xtc is not None:
            xtc_path_obj = Path(tmpdir) / Path(xtc.filename or "upload.xtc").name
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
    async with _clients_lock:
        _clients.add(websocket)
    try:
        # Send snapshot and metadata immediately on connection
        if _state.structure is not None:
            await websocket.send_bytes(_state.snapshot_bytes)
            await websocket.send_bytes(_build_metadata_bytes())

        # Handle client commands
        stream_task: asyncio.Task | None = None

        async def _run_stream(traj, start: int, end: int, stride: int, fps: int) -> None:
            """Stream frames at the given FPS. Runs as a cancellable task."""
            delay = 1.0 / max(fps, 1)
            for i in range(start, end, max(stride, 1)):
                positions = traj.get_frame(i)
                await websocket.send_bytes(encode_frame(i, positions))
                await asyncio.sleep(delay)

        while True:
            data = await websocket.receive_text()
            try:
                msg = json.loads(data)
            except json.JSONDecodeError:
                logger.warning("Ignoring malformed JSON from client")
                continue
            cmd = msg.get("type")
            traj = _state.trajectory

            if cmd == "request_frame" and traj is not None:
                frame_idx = msg.get("frame")
                if isinstance(frame_idx, int) and 0 <= frame_idx < traj.n_frames:
                    positions = traj.get_frame(frame_idx)
                    await websocket.send_bytes(encode_frame(frame_idx, positions))

            elif cmd == "stream" and traj is not None:
                # Cancel any existing stream
                if stream_task and not stream_task.done():
                    stream_task.cancel()
                try:
                    start = max(int(msg.get("start", 0)), 0)
                    end = min(int(msg.get("end", traj.n_frames)), traj.n_frames)
                    stride = max(int(msg.get("stride", 1)), 1)
                    fps = max(int(msg.get("fps", 30)), 1)
                except (TypeError, ValueError):
                    logger.warning("Ignoring stream command with invalid parameters")
                    continue
                stream_task = asyncio.create_task(_run_stream(traj, start, end, stride, fps))

            elif cmd == "stop":
                if stream_task and not stream_task.done():
                    stream_task.cancel()

    except WebSocketDisconnect:
        logger.info("Client disconnected")
    finally:
        async with _clients_lock:
            _clients.discard(websocket)


# Resolve static files directory: override via MEGANE_STATIC_DIR env var.
# Empty or whitespace values are treated as unset to avoid accidentally
# exposing the current working directory via StaticFiles.
_default_static_dir = Path(__file__).parent / "static" / "app"
_env_static_dir = os.environ.get("MEGANE_STATIC_DIR", "").strip()
_static_dir = Path(_env_static_dir).resolve() if _env_static_dir else _default_static_dir
if _static_dir.exists():
    app.mount("/", StaticFiles(directory=str(_static_dir), html=True), name="app")
else:
    logger.warning(
        "Static app directory not found at %s. "
        "The web UI will not be available. "
        "Build the frontend with 'npm run build' first.",
        _static_dir,
    )

    @app.get("/{path:path}")
    async def _fallback(path: str):
        from fastapi.responses import HTMLResponse

        return HTMLResponse(
            "<h1>megane</h1>"
            "<p>The web UI is not available.</p>"
            "<p>Build the frontend first:</p>"
            "<pre>npm run build</pre>"
            "<p>Then restart <code>megane serve</code>.</p>",
            status_code=200,
        )
