"""FastAPI WebSocket server for megane molecular viewer."""

from __future__ import annotations

import logging
from pathlib import Path

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from megane.parsers.pdb import load_pdb
from megane.protocol import encode_snapshot

logger = logging.getLogger(__name__)

app = FastAPI(title="megane")

# Global state for the currently loaded structure
_state: dict = {}


def configure(pdb_path: str, xtc_path: str | None = None) -> None:
    """Configure the server with a molecular structure to serve."""
    structure = load_pdb(pdb_path)
    _state["structure"] = structure
    _state["snapshot_bytes"] = encode_snapshot(structure)
    _state["xtc_path"] = xtc_path
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

        # Keep connection alive, handle future commands
        while True:
            data = await websocket.receive_text()
            # Phase 2: handle frame requests, streaming commands
            logger.debug("Received: %s", data)

    except WebSocketDisconnect:
        logger.info("Client disconnected")


# Try to serve static files for the built web app
_static_dir = Path(__file__).parent / "static" / "app"
if _static_dir.exists():
    app.mount("/", StaticFiles(directory=str(_static_dir), html=True), name="app")
