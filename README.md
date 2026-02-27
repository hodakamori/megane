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
npm run build           # TypeScript build
```

## Project Structure

```
src/                     TypeScript frontend
  core/                  Three.js renderer, protocol, shaders
  components/            React UI components
  hooks/                 Custom React hooks
  stream/                WebSocket client
python/megane/           Python backend
  parsers/               PDB / XTC parsers
  protocol.py            Binary protocol encoder
  server.py              FastAPI WebSocket server
  widget.py              anywidget Jupyter widget
scripts/                 Benchmarks, headless rendering
tests/                   Tests
```
