---
sidebar_position: 4
---

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

## PipelineViewer (Docs / MDX Embed)

`PipelineViewer` is a self-contained React component designed for embedding molecular visualizations in documentation, blog posts, and MDX pages. Unlike `MeganeViewer`, it has **no dependency on global stores** — multiple instances on the same page are fully independent and each manages its own playback state.

### Key differences from `MeganeViewer`

| Feature | `MeganeViewer` | `PipelineViewer` |
|---------|---------------|-----------------|
| UI panels (sidebar, appearance) | Yes | No |
| Pipeline-driven rendering | No | Yes |
| Multiple instances per page | Conflicts | Fully independent |
| File loading | Upload / drag-drop | URL fetch via `fileUrl` |
| Trajectory playback | Yes | Yes (Timeline shown automatically) |

### Installation

```bash
npm install megane-viewer
```

### Usage

```tsx
import { PipelineViewer } from "megane-viewer";

<PipelineViewer
  width="100%"
  height={500}
  pipeline={{
    version: 3,
    nodes: [
      {
        id: "s1",
        type: "load_structure",
        fileName: "caffeine_water.pdb",
        fileUrl: "/structures/caffeine_water.pdb",
        hasTrajectory: false,
        hasCell: false,
        position: { x: 0, y: 0 },
      },
      {
        id: "b1",
        type: "add_bond",
        bondSource: "distance",
        position: { x: 200, y: 0 },
      },
      {
        id: "v1",
        type: "viewport",
        perspective: false,
        cellAxesVisible: true,
        pivotMarkerVisible: true,
        position: { x: 400, y: 0 },
      },
    ],
    edges: [
      { source: "s1", target: "b1", sourceHandle: "particle", targetHandle: "particle" },
      { source: "s1", target: "v1", sourceHandle: "particle", targetHandle: "particle" },
      { source: "b1", target: "v1", sourceHandle: "bond",     targetHandle: "bond" },
    ],
  }}
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `pipeline` | `SerializedPipeline` | *(required)* | Pipeline JSON describing the node graph |
| `width` | `string \| number` | `"100%"` | Component width |
| `height` | `string \| number` | `500` | Component height in pixels |

### `SerializedPipeline` format

```ts
import type { PipelineNodeParams, SerializedPipeline } from "megane-viewer";

// SerializedPipeline (exported from megane-viewer):
interface SerializedPipeline {
  version: 3;
  nodes: Array<PipelineNodeParams & {
    id: string;
    position: { x: number; y: number };
    enabled?: boolean;   // false = node is bypassed (default: true)
  }>;
  edges: Array<{
    source: string;
    target: string;
    sourceHandle: string;
    targetHandle: string;
  }>;
}
```

`PipelineNodeParams` is a discriminated union exported by `megane-viewer`. The `type` field on each node determines which parameters are required — see [Node Reference](/guide/pipeline/#node-reference) for the full list.

Each node's `type` field determines which parameters are required. See [Node Reference](/guide/pipeline/#node-reference) for the full list.

#### `load_structure` node — the `fileUrl` field

`PipelineViewer` cannot use a local file picker, so `load_structure` nodes need a `fileUrl` field pointing to a URL where the structure file can be fetched:

```ts
{
  id: "s1",
  type: "load_structure",
  fileName: "protein.pdb",        // displayed name (optional, inferred from URL)
  fileUrl: "/structures/protein.pdb",  // fetched at render time
  hasTrajectory: false,
  hasCell: false,
  position: { x: 0, y: 0 },
}
```

The component fetches all `fileUrl` values in parallel at mount time using the browser's `fetch()` API, then parses them with the WASM parser.

### Trajectory playback

When the pipeline includes time-dependent data — by loading a multi-frame structure file (such as a multi-frame XYZ or ASE `.traj`) — `PipelineViewer` automatically shows the Timeline bar at the bottom.

```tsx
<PipelineViewer
  height={500}
  pipeline={{
    version: 3,
    nodes: [
      {
        id: "s1",
        type: "load_structure",
        fileName: "simulation.traj",
        fileUrl: "/structures/simulation.traj",
        hasTrajectory: true,
        hasCell: false,
        position: { x: 0, y: 0 },
      },
      {
        id: "v1",
        type: "viewport",
        perspective: false,
        cellAxesVisible: false,
        pivotMarkerVisible: true,
        position: { x: 300, y: 0 },
      },
    ],
    edges: [
      { source: "s1", target: "v1", sourceHandle: "particle",   targetHandle: "particle" },
      { source: "s1", target: "v1", sourceHandle: "trajectory", targetHandle: "trajectory" },
    ],
  }}
/>
```

> **Note:** `PipelineViewer` does not currently support `load_trajectory` nodes. Trajectories must be embedded in the structure file (e.g. ASE `.traj`, multi-frame XYZ). External XTC trajectories require a `MeganeViewer` with a server-side pipeline.

### Usage in MDX (Next.js / VitePress)

`PipelineViewer` works in any MDX-based framework. Import it directly in your `.mdx` file:

```mdx
import { PipelineViewer } from "megane-viewer";

# Caffeine in Water

<PipelineViewer
  height={480}
  pipeline={{
    version: 3,
    nodes: [
      { id: "s1", type: "load_structure", fileName: "caffeine_water.pdb",
        fileUrl: "/structures/caffeine_water.pdb",
        hasTrajectory: false, hasCell: false, position: { x: 0, y: 0 } },
      { id: "b1", type: "add_bond", bondSource: "distance", position: { x: 200, y: 0 } },
      { id: "v1", type: "viewport", perspective: false, cellAxesVisible: false,
        pivotMarkerVisible: true, position: { x: 400, y: 0 } },
    ],
    edges: [
      { source: "s1", target: "b1", sourceHandle: "particle", targetHandle: "particle" },
      { source: "s1", target: "v1", sourceHandle: "particle", targetHandle: "particle" },
      { source: "b1", target: "v1", sourceHandle: "bond",     targetHandle: "bond" },
    ],
  }}
/>
```

For Next.js you also need WASM support in `next.config.mjs`:

```js
const nextConfig = {
  webpack: (config) => {
    config.experiments = { ...config.experiments, asyncWebAssembly: true };
    return config;
  },
};
export default nextConfig;
```

### Using a saved pipeline JSON

You can serialize a pipeline from the megane UI (Pipeline editor → Export) and load it directly:

```tsx
import pipelineJson from "./my-pipeline.json";
import { PipelineViewer } from "megane-viewer";

// Add fileUrl to each load_structure node before rendering
const pipeline = {
  ...pipelineJson,
  nodes: pipelineJson.nodes.map((n) =>
    n.type === "load_structure"
      ? { ...n, fileUrl: `/structures/${n.fileName}` }
      : n,
  ),
};

<PipelineViewer pipeline={pipeline} height={500} />
```

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
