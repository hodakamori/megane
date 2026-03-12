# CLI Server

megane includes a command-line tool to serve molecular structures in a local web viewer.

## Quick Start with Docker

```bash
docker build -t megane .
docker run --rm -p 8080:8080 megane
```

Open http://localhost:8080 in your browser.

To view your own files, mount them into the container:

```bash
docker run --rm -p 8080:8080 -v ./mydata:/data megane \
  megane serve /data/protein.pdb --port 8080 --no-browser
```

## Running from Source

### Prerequisites

- Python 3.10+
- Node.js 18+
- Rust
- [wasm-pack](https://rustwasm.github.io/wasm-pack/installer/)
- [uv](https://docs.astral.sh/uv/)

### Build and Run

```bash
# Install wasm-pack (if not already installed)
cargo install wasm-pack

# Install dependencies and build frontend
uv sync --extra dev
npm install
npm run build

# Install the package
maturin develop --release

# Start the server
megane serve protein.pdb
```

## Usage

```bash
megane serve [PDB_FILE] [OPTIONS]
```

## Arguments

| Argument | Description |
|----------|-------------|
| `PDB_FILE` | Path to a PDB file (optional; can upload from the browser) |

## Options

| Option | Default | Description |
|--------|---------|-------------|
| `--xtc PATH` | — | Path to an XTC trajectory file |
| `--port PORT` | `8765` | Server port |
| `--no-browser` | `false` | Don't automatically open the browser |
| `--dev` | `false` | Development mode (use Vite dev server for frontend) |

## Examples

### View a PDB file

```bash
megane serve protein.pdb
```

Opens `http://localhost:8765` in your browser with the structure loaded.

### View with trajectory

```bash
megane serve protein.pdb --xtc trajectory.xtc
```

The viewer will show trajectory controls (timeline, play/pause, FPS) for frame-by-frame playback.

### Upload from browser

```bash
megane serve
```

Start the server without a file. You can then drag-and-drop or upload a PDB file from the browser UI.

### Custom port

```bash
megane serve protein.pdb --port 3000
```

### Development mode

```bash
megane serve protein.pdb --dev
```

In development mode, the frontend is served by the Vite dev server (typically on port 5173) with hot module replacement. The Python backend provides the WebSocket API at the specified port.

## Architecture

The CLI starts a [FastAPI](https://fastapi.tiangolo.com/) server with:

- **Static file serving** — The built frontend from `megane/static/app/`
- **WebSocket endpoint** (`/ws`) — Binary protocol streaming for molecular data

Data is encoded using megane's binary protocol for efficient transfer:

| Message Type | Content |
|-------------|---------|
| Snapshot | Atom positions, elements, bonds, bond orders, unit cell |
| Frame | Updated positions for a trajectory frame |
| Metadata | Frame count, timestep, file names |
