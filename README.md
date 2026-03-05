# megane

A fast, simple molecular viewer. Renders PDB structures and XTC trajectories in real time in the browser.

- Scales to 1M atoms with Three.js InstancedMesh + Billboard Impostor
- High-quality InstancedMesh for <=5,000 atoms; auto-switches to Impostor above that
- Binary streaming from Python to browser via FastAPI WebSocket
- Jupyter widget powered by anywidget

## Setup

### Prerequisites

- Python 3.10+
- [uv](https://docs.astral.sh/uv/)
- Node.js 18+

### Installation

```bash
# Python
uv sync --extra dev --extra trajectory

# Node.js
npm install
npm run build
```

## Usage

### CLI (Standalone)

```bash
uv run megane serve protein.pdb
uv run megane serve protein.pdb --xtc trajectory.xtc
uv run megane serve protein.pdb --port 9000
```

### Development Mode

```bash
# Terminal 1: Vite dev server
npm run dev

# Terminal 2: Python backend
uv run megane serve protein.pdb --dev --no-browser
```

Open `http://localhost:5173` in your browser.

### Jupyter

```python
import megane

viewer = megane.MolecularViewer()
viewer.load("protein.pdb")
viewer  # display in cell

# With trajectory
viewer.load("protein.pdb", xtc="trajectory.xtc")
viewer.frame_index = 50
```

## Tests

```bash
uv run pytest           # Python tests
npm test                # TypeScript unit tests
cargo test -p megane-core  # Rust tests
make test-all           # All tests
```

## Project Structure

```
src/                     TypeScript frontend
  renderer/              Three.js rendering (impostor, mesh, shaders)
  protocol/              Binary protocol decoder + web workers
  parsers/               WASM-based file parsers (PDB, GRO, XYZ, MOL, XTC)
  logic/                 Bond / label / vector source logic
  components/            React UI components
  hooks/                 Custom React hooks
  stream/                WebSocket client
crates/                  Rust workspace
  megane-core/           Core parsers and bond inference
  megane-python/         PyO3 Python extension
  megane-wasm/           WASM bindings (wasm-bindgen)
python/megane/           Python backend
  parsers/               PDB / XTC parsers
  protocol.py            Binary protocol encoder
  server.py              FastAPI WebSocket server
  widget.py              anywidget Jupyter widget
tests/                   Tests (Python, TypeScript, E2E)
```
