"""FastAPI WebSocket server for megane molecular viewer."""

from __future__ import annotations

import asyncio
import json
import logging
from pathlib import Path

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.staticfiles import StaticFiles

from megane.parsers.pdb import load_pdb
from megane.protocol import encode_frame, encode_metadata, encode_snapshot

logger = logging.getLogger(__name__)

app = FastAPI(title="megane")

# Global state for the currently loaded structure
_state: dict = {}


def configure(pdb_path: str, xtc_path: str | None = None) -> None:
    """Configure the server with a molecular structure to serve."""
    structure = load_pdb(pdb_path)
    _state["structure"] = structure
    _state["snapshot_bytes"] = encode_snapshot(structure)
    _state["pdb_path"] = pdb_path
    _state["xtc_path"] = xtc_path
    _state["trajectory"] = None

    if xtc_path:
        from megane.parsers.xtc import load_trajectory

        traj = load_trajectory(pdb_path, xtc_path)
        _state["trajectory"] = traj
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


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket) -> None:
    """WebSocket endpoint for streaming molecular data."""
    await websocket.accept()
    try:
        # Send snapshot immediately on connection
        if "snapshot_bytes" in _state:
            await websocket.send_bytes(_state["snapshot_bytes"])

        # Send trajectory metadata if available
        traj = _state.get("trajectory")
        if traj is not None:
            meta_bytes = encode_metadata(traj.n_frames, traj.timestep_ps, traj.n_atoms)
            await websocket.send_bytes(meta_bytes)

        # Handle client commands
        while True:
            data = await websocket.receive_text()
            msg = json.loads(data)
            cmd = msg.get("type")

            if cmd == "request_frame" and traj is not None:
                frame_idx = msg["frame"]
                if 0 <= frame_idx < traj.n_frames:
                    positions = traj.get_frame(frame_idx)
                    await websocket.send_bytes(encode_frame(frame_idx, positions))

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


# Try to serve static files for the built web app
_static_dir = Path(__file__).parent / "static" / "app"
if _static_dir.exists():
    app.mount("/", StaticFiles(directory=str(_static_dir), html=True), name="app")
