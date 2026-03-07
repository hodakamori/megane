# Web / React

megane can be embedded in React applications as a component library. It provides both high-level React components and a framework-agnostic imperative renderer.

## Installation

```bash
npm install megane-viewer
```

## Full-Featured Viewer

The easiest way to get started is the `MeganeViewer` component. It includes the 3D viewport, sidebar, appearance panel, timeline, tooltip, and measurement panel — everything you need in a single component.

```tsx
import { useState, useCallback, useMemo } from "react";
import { MeganeViewer, parseStructureFile } from "megane-viewer";
import type { Snapshot, BondSource } from "megane-viewer";

function App() {
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [pdbFileName, setPdbFileName] = useState<string | null>(null);
  const [bondSource, setBondSource] = useState<BondSource>("structure");

  const handleUpload = useCallback(async (file: File) => {
    const result = await parseStructureFile(file);
    setSnapshot(result.snapshot);
    setPdbFileName(file.name);
  }, []);

  const bonds = useMemo(() => ({
    source: bondSource,
    onSourceChange: setBondSource,
    onUploadFile: () => {},
    fileName: null,
    count: snapshot?.nBonds ?? 0,
  }), [bondSource, snapshot?.nBonds]);

  const trajectory = useMemo(() => ({
    source: "structure" as const,
    onSourceChange: () => {},
    hasStructureFrames: false,
    hasFileFrames: false,
    fileName: null,
    totalFrames: 0,
    timestepPs: 0,
    onUploadXtc: () => {},
  }), []);

  const labels = useMemo(() => ({
    source: "none" as const,
    onSourceChange: () => {},
    onUploadFile: () => {},
    fileName: null,
    hasStructureLabels: false,
  }), []);

  return (
    <MeganeViewer
      snapshot={snapshot}
      mode="local"
      onToggleMode={() => {}}
      onUploadStructure={handleUpload}
      pdbFileName={pdbFileName}
      bonds={bonds}
      trajectory={trajectory}
      labels={labels}
      width="100%"
      height="600px"
    />
  );
}
```

### `MeganeViewer` Props

| Prop | Type | Description |
|------|------|-------------|
| `snapshot` | `Snapshot \| null` | Parsed molecular structure data |
| `frame` | `Frame \| null` | Current trajectory frame |
| `currentFrame` | `number` | Current frame index |
| `totalFrames` | `number` | Total number of frames |
| `playing` | `boolean` | Playback state |
| `fps` | `number` | Playback speed |
| `mode` | `"streaming" \| "local"` | Data source mode |
| `onToggleMode` | `() => void` | Toggle streaming/local mode |
| `pdbFileName` | `string \| null` | Name of the loaded structure file |
| `bonds` | `BondConfig` | Bond display configuration |
| `trajectory` | `TrajectoryConfig` | Trajectory configuration |
| `labels` | `LabelConfig` | Atom label configuration |
| `vectors` | `VectorConfig` | Vector arrow configuration |
| `atomLabels` | `string[] \| null` | Resolved atom label strings |
| `atomVectors` | `Float32Array \| null` | Resolved vector arrow data |
| `width` / `height` | `string \| number` | Viewer dimensions |
| `onUploadStructure` | `(file: File) => void` | File upload handler |
| `onSeek` | `(frame: number) => void` | Frame seek handler |
| `onPlayPause` | `() => void` | Play/pause toggle |
| `onFpsChange` | `(fps: number) => void` | FPS change handler |

See the [TypeScript API Reference](/api/typescript/) for the complete interface.

---

## Individual Components

For custom layouts, megane exports each panel as a separate component. This gives you full control over placement and behavior.

### `Viewport` — 3D Canvas Only

The core rendering surface without any UI panels:

```tsx
import { Viewport } from "megane-viewer";
import type { Snapshot, HoverInfo } from "megane-viewer";

function MinimalViewer({ snapshot }: { snapshot: Snapshot }) {
  return (
    <Viewport
      snapshot={snapshot}
      frame={null}
      onRendererReady={(renderer) => {
        renderer.setAtomScale(1.5);
      }}
      onHover={(info: HoverInfo) => {
        if (info?.kind === "atom") {
          console.log(`Atom ${info.atomIndex}: ${info.elementSymbol}`);
        }
      }}
      onAtomRightClick={(atomIndex) => {
        console.log("Selected:", atomIndex);
      }}
    />
  );
}
```

### `Sidebar`, `Timeline`, `AppearancePanel`

Combine individual panels for a custom layout:

```tsx
import { Viewport, Sidebar, Timeline, AppearancePanel } from "megane-viewer";

function CustomLayout({ snapshot, frame }) {
  const [renderer, setRenderer] = useState(null);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Left panel */}
      <Sidebar
        mode="local"
        onToggleMode={() => {}}
        structure={{ atomCount: snapshot?.nAtoms ?? 0, fileName: "protein.pdb" }}
        bonds={bondConfig}
        trajectory={trajectoryConfig}
        onUploadStructure={handleUpload}
        onResetView={() => renderer?.resetView()}
        hasCell={false}
        cellVisible={false}
        onToggleCell={() => {}}
      />

      {/* 3D viewport */}
      <div style={{ flex: 1 }}>
        <Viewport
          snapshot={snapshot}
          frame={frame}
          onRendererReady={setRenderer}
        />
      </div>

      {/* Right panel */}
      <AppearancePanel
        atomScale={1.0}
        onAtomScaleChange={(s) => renderer?.setAtomScale(s)}
        atomOpacity={1.0}
        onAtomOpacityChange={(o) => renderer?.setAtomOpacity(o)}
        bondScale={1.0}
        onBondScaleChange={(s) => renderer?.setBondScale(s)}
        bondOpacity={1.0}
        onBondOpacityChange={(o) => renderer?.setBondOpacity(o)}
        labels={labelConfig}
        perspective={false}
        onPerspectiveChange={(p) => renderer?.setPerspective(p)}
        hasCell={false}
        cellAxesVisible={false}
        onToggleCellAxes={() => {}}
      />
    </div>
  );
}
```

---

## Core Renderer (Framework-Agnostic)

For non-React applications (Vue, Svelte, vanilla JS), use `MoleculeRenderer` directly. This is the same Three.js renderer powering all megane components:

```ts
import { MoleculeRenderer } from "megane-viewer";
import type { Snapshot } from "megane-viewer";

// Create and mount
const renderer = new MoleculeRenderer();
renderer.mount(document.getElementById("viewer")!);

// Load data
renderer.loadSnapshot(snapshot);

// Update positions for animation
renderer.updateFrame(frame);

// Control appearance
renderer.setAtomScale(1.2);
renderer.setAtomOpacity(0.8);
renderer.setBondScale(0.5);
renderer.setPerspective(true);
renderer.setCellVisible(true);

// Cleanup
renderer.dispose();
```

### Atom Selection & Measurement

```ts
// Select atoms programmatically
renderer.toggleAtomSelection(0);
renderer.toggleAtomSelection(1);

// Get measurement (distance, angle, or dihedral based on # selected)
const measurement = renderer.getMeasurement();
// { type: 'distance', value: 3.82, label: '3.82 Å', atoms: [0, 1] }

// Clear selection
renderer.clearSelection();
```

### Picking (Hover & Click)

Screen-space picking for identifying atoms and bonds:

```ts
const hit = renderer.raycastAtPixel(mouseX, mouseY);
if (hit) {
  if (hit.kind === "atom") {
    console.log(`Atom ${hit.atomIndex}: ${hit.elementSymbol}`);
  } else if (hit.kind === "bond") {
    console.log(`Bond: ${hit.atomA}–${hit.atomB}, length=${hit.bondLength.toFixed(2)} Å`);
  }
}
```

---

## MDX Usage (Next.js)

megane works in MDX-based documentation frameworks like Next.js. Here's how to embed the viewer in an `.mdx` file:

```mdx
---
title: Protein Visualization
---

import { useState, useEffect } from "react";
import { MeganeViewer, parseStructureFile } from "megane-viewer";

export function ProteinDemo() {
  const [snapshot, setSnapshot] = useState(null);

  useEffect(() => {
    fetch("/data/protein.pdb")
      .then((r) => r.text())
      .then(async (text) => {
        const { parseStructureText } = await import("megane");
        const result = await parseStructureText(text);
        setSnapshot(result.snapshot);
      });
  }, []);

  return (
    <MeganeViewer
      snapshot={snapshot}
      mode="local"
      onToggleMode={() => {}}
      onUploadStructure={() => {}}
      pdbFileName="protein.pdb"
      bonds={{ source: "structure", onSourceChange: () => {}, onUploadFile: () => {}, fileName: null, count: snapshot?.nBonds ?? 0 }}
      trajectory={{ source: "structure", onSourceChange: () => {}, hasStructureFrames: false, hasFileFrames: false, fileName: null, totalFrames: 0, timestepPs: 0, onUploadXtc: () => {} }}
      labels={{ source: "none", onSourceChange: () => {}, onUploadFile: () => {}, fileName: null, hasStructureLabels: false }}
      width="100%"
      height="500px"
    />
  );
}

# Caffeine in Water

A caffeine molecule solvated by water — 3024 atoms rendered in real time.

<ProteinDemo />

The viewer above uses WASM-powered parsing and billboard impostor rendering
to display all 3024 atoms with bonds inferred from van der Waals radii.
```

### Viewport-Only in MDX

For a simpler embed without panels:

```mdx
import { useState, useEffect } from "react";
import { Viewport, parseStructureText } from "megane-viewer";

export function SimpleViewer() {
  const [snapshot, setSnapshot] = useState(null);

  useEffect(() => {
    fetch("/data/caffeine_water.pdb")
      .then((r) => r.text())
      .then(async (text) => {
        const result = await parseStructureText(text);
        setSnapshot(result.snapshot);
      });
  }, []);

  return (
    <div style={{ height: "400px" }}>
      <Viewport snapshot={snapshot} frame={null} />
    </div>
  );
}

<SimpleViewer />
```

### Next.js Configuration

Add megane to `next.config.mjs` for WASM support:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.experiments = { ...config.experiments, asyncWebAssembly: true };
    return config;
  },
};

export default nextConfig;
```

---

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
} from "megane-viewer";

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
      renderer.updateFrame(frame);
      break;
    case MSG_METADATA:
      const meta = decodeMetadata(buffer);
      console.log(`${meta.nFrames} frames, ${meta.timestepPs} ps/step`);
      break;
  }
};
```

## Types

Key TypeScript types exported by megane:

```ts
import type {
  Snapshot,            // Parsed molecular structure (positions, elements, bonds)
  Frame,               // Single trajectory frame (frameId, positions)
  TrajectoryMeta,      // Trajectory metadata (nFrames, timestepPs)
  HoverInfo,           // Atom/bond hover information
  SelectionState,      // Current atom selection
  Measurement,         // Distance/angle/dihedral result
  BondSource,          // "structure" | "file" | "distance" | "none"
  BondConfig,          // Bond panel configuration
  TrajectoryConfig,    // Trajectory panel configuration
  LabelConfig,         // Label panel configuration
  VectorConfig,        // Vector arrow configuration
  StructureParseResult,// Parse result from parseStructureFile/Text
} from "megane-viewer";
```

### Parser Functions

```ts
import { parseStructureFile, parseStructureText } from "megane-viewer";

// Parse from File object (drag-and-drop, file input)
const result = await parseStructureFile(file);
// result.snapshot, result.frames, result.labels

// Parse from text string (fetched content)
const result = await parseStructureText(pdbText);
```
