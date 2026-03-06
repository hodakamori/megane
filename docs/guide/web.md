# Web / React

megane can be embedded in React applications as a component library.

## Installation

```bash
npm install megane
```

## Quick Start

```tsx
import { MeganeViewer } from "megane";
import type { Snapshot, BondConfig, TrajectoryConfig, LabelConfig } from "megane";

function App() {
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);

  // ... load snapshot data via WebSocket or local file

  return (
    <MeganeViewer
      snapshot={snapshot}
      mode="local"
      onToggleMode={() => {}}
      onUploadStructure={(file) => { /* handle file upload */ }}
      pdbFileName="protein.pdb"
      bonds={{ source: "file" }}
      trajectory={{ source: "none" }}
      labels={{ show: false, field: "element" }}
      width="100%"
      height="600px"
    />
  );
}
```

## Components

### `MeganeViewer`

The main viewer component. Combines the 3D viewport, sidebar, timeline, and measurement panels.

```tsx
import { MeganeViewer } from "megane";
```

See the [TypeScript API Reference](/api/typescript/) for the full props interface.

### `Viewport`

The 3D rendering viewport only, without UI panels. Use this for custom layouts.

```tsx
import { Viewport } from "megane";
```

### `Sidebar`, `Timeline`

Individual UI panel components for building custom viewer layouts.

```tsx
import { Sidebar, Timeline } from "megane";
```

## Core Renderer

For framework-agnostic usage, the `MoleculeRenderer` class provides direct access to the Three.js rendering engine.

```ts
import { MoleculeRenderer } from "megane";

const renderer = new MoleculeRenderer();
renderer.mount(document.getElementById("canvas")!);
renderer.loadSnapshot(snapshot);

// Update positions for animation
renderer.updatePositions(newPositions);

// Cleanup
renderer.dispose();
```

## Protocol Utilities

Decode binary messages from the megane WebSocket server:

```ts
import {
  decodeSnapshot,
  decodeFrame,
  decodeMetadata,
  decodeHeader,
  MSG_SNAPSHOT,
  MSG_FRAME,
  MSG_METADATA,
} from "megane";

const header = decodeHeader(buffer);
if (header.msgType === MSG_SNAPSHOT) {
  const snapshot = decodeSnapshot(buffer);
}
```

## Worker Pool

Offload decoding to Web Workers for better performance:

```ts
import { WorkerPool } from "megane";

const pool = new WorkerPool(navigator.hardwareConcurrency);
const snapshot = await pool.decode(buffer);
```

## Types

Key TypeScript types exported by megane:

```ts
import type {
  Snapshot,        // Parsed molecular structure
  Frame,           // Single trajectory frame
  TrajectoryMeta,  // Trajectory metadata
  HoverInfo,       // Atom/bond hover information
  SelectionState,  // Current selection
  Measurement,     // Distance/angle/dihedral result
  BondSource,      // "file" | "distance" | "none"
} from "megane";
```
