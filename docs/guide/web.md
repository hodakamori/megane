# Web / React

megane can be embedded in React applications as a component library. It provides both high-level React components and a framework-agnostic imperative renderer.

## Installation

```bash
npm install megane
```

## Quick Start

The simplest way to embed megane is the `MeganeViewer` component, which includes the 3D viewport, sidebar, timeline, and measurement panels:

```tsx
import { useState } from "react";
import { MeganeViewer } from "megane";
import type { Snapshot, BondConfig, TrajectoryConfig, LabelConfig } from "megane";

function App() {
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);

  return (
    <MeganeViewer
      snapshot={snapshot}
      mode="local"
      onToggleMode={() => {}}
      onUploadStructure={(file) => handleUpload(file)}
      pdbFileName="protein.pdb"
      bonds={{
        source: "structure",
        onSourceChange: () => {},
        onUploadFile: () => {},
        fileName: null,
        count: 0,
      }}
      trajectory={{
        source: "structure",
        onSourceChange: () => {},
        hasStructureFrames: false,
        hasFileFrames: false,
        fileName: null,
        totalFrames: 0,
        timestepPs: 0,
        onUploadXtc: () => {},
      }}
      labels={{
        source: "none",
        onSourceChange: () => {},
        onUploadFile: () => {},
        fileName: null,
        hasStructureLabels: false,
      }}
      width="100%"
      height="600px"
    />
  );
}
```

Here's the viewer component in action:

<MoleculeDemo src="/megane/data/1crn.json" height="400px" />

## Components

megane exports individual components for building custom layouts.

### `MeganeViewer`

The full-featured viewer with all panels. See the [TypeScript API Reference](/api/typescript/) for the complete props interface.

```tsx
import { MeganeViewer } from "megane";
```

Key props:

| Prop | Type | Description |
|------|------|-------------|
| `snapshot` | `Snapshot \| null` | Parsed molecular structure data |
| `frame` | `Frame \| null` | Current trajectory frame |
| `currentFrame` | `number` | Current frame index |
| `totalFrames` | `number` | Total number of frames |
| `mode` | `"streaming" \| "local"` | Data source mode |
| `bonds` | `BondConfig` | Bond display configuration |
| `trajectory` | `TrajectoryConfig` | Trajectory configuration |
| `width` / `height` | `string \| number` | Viewer dimensions |

### `Viewport`

The 3D rendering canvas only, without UI panels. Use this for custom layouts where you want full control:

```tsx
import { Viewport } from "megane";
import type { Snapshot, Frame, HoverInfo } from "megane";

function CustomViewer({ snapshot }: { snapshot: Snapshot }) {
  return (
    <Viewport
      snapshot={snapshot}
      frame={null}
      onRendererReady={(renderer) => {
        // Access the MoleculeRenderer instance directly
        renderer.setAtomScale(1.5);
      }}
      onHover={(info) => {
        // Handle atom/bond hover
        if (info) console.log("Hovering:", info);
      }}
      onAtomRightClick={(atomIndex) => {
        console.log("Selected atom:", atomIndex);
      }}
    />
  );
}
```

### `Sidebar` and `Timeline`

Individual UI panel components:

```tsx
import { Sidebar, Timeline } from "megane";
```

## Core Renderer (Framework-Agnostic)

For non-React applications (Vue, Svelte, vanilla JS), use `MoleculeRenderer` directly. This is the same Three.js renderer used by all megane components:

```ts
import { MoleculeRenderer } from "megane";
import type { Snapshot } from "megane";

// Create and mount
const renderer = new MoleculeRenderer();
renderer.mount(document.getElementById("viewer")!);

// Load data
renderer.loadSnapshot(snapshot);

// Update positions for animation
renderer.updatePositions(newPositions);

// Control appearance
renderer.setAtomScale(1.2);
renderer.setAtomOpacity(0.8);
renderer.setBondScale(0.5);
renderer.setPerspective(true);
renderer.setCellVisible(true);

// Cleanup
renderer.dispose();
```

<MoleculeDemo src="/megane/data/1crn.json" height="350px" />

### Atom Selection & Measurement

The renderer supports interactive atom selection and measurement:

```ts
// Select atoms programmatically
renderer.toggleAtomSelection(0);  // Toggle selection on atom 0
renderer.toggleAtomSelection(1);  // Add atom 1

// Get current selection state
const selection = renderer.getSelectionState();
// { atoms: [0, 1], measurement: { type: 'distance', value: 3.82, label: '3.82 Å' } }

// Clear selection
renderer.clearSelection();
```

### Picking (Hover & Click)

Screen-space picking for identifying atoms and bonds:

```ts
// Identify what's under a pixel coordinate
const hit = renderer.raycastAtPixel(mouseX, mouseY);
if (hit) {
  if (hit.kind === "atom") {
    console.log(`Atom ${hit.index}, element ${hit.element}`);
  } else {
    console.log(`Bond between atoms ${hit.atomA} and ${hit.atomB}`);
  }
}
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

// Handle incoming WebSocket messages
ws.onmessage = (event) => {
  const buffer = event.data as ArrayBuffer;
  const header = decodeHeader(buffer);

  switch (header.msgType) {
    case MSG_SNAPSHOT:
      const snapshot = decodeSnapshot(buffer);
      renderer.loadSnapshot(snapshot);
      break;
    case MSG_FRAME:
      const frame = decodeFrame(buffer);
      renderer.updatePositions(frame.positions);
      break;
    case MSG_METADATA:
      const meta = decodeMetadata(buffer);
      console.log(`${meta.nFrames} frames, ${meta.timestepPs} ps/step`);
      break;
  }
};
```

## Worker Pool

Offload decoding to Web Workers for better performance with large structures:

```ts
import { WorkerPool } from "megane";

const pool = new WorkerPool(navigator.hardwareConcurrency);
const snapshot = await pool.decode(buffer);
```

## Types

Key TypeScript types exported by megane:

```ts
import type {
  Snapshot,        // Parsed molecular structure (positions, elements, bonds)
  Frame,           // Single trajectory frame (frameId, positions)
  TrajectoryMeta,  // Trajectory metadata (nFrames, timestepPs)
  HoverInfo,       // Atom/bond hover information
  SelectionState,  // Current atom selection
  Measurement,     // Distance/angle/dihedral result
  BondSource,      // "structure" | "file" | "distance" | "none"
  BondConfig,      // Bond panel configuration
  TrajectoryConfig,// Trajectory panel configuration
} from "megane";
```
