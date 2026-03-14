# Streaming Mode Redesign Plan

## Problem

Current streaming is bolted onto existing file-based nodes:
- `load_structure` was designed for file loading, but streaming forces snapshot data through it via global context
- `load_trajectory` has an awkward "File/Stream" toggle with `sourceMode` parameter
- `streamProvider` is passed as a global pipeline execution context parameter, not a first-class node
- In streaming mode, there's no real "load" operation — data is continuously delivered from the server

## Design

Create a new **`streaming`** node type that is a single source node for all WebSocket-streamed data. This replaces the current pattern of load_structure + load_trajectory(stream mode).

### New Node: `streaming`

```
┌──────────────────────┐
│     Streaming        │
│                      │
│  ● Connected (ws://) │
│  Server: /ws         │
│                      │
│         particle ──○ │
│        trajectory ──○ │
│              cell ──○ │
└──────────────────────┘
```

- **Category**: `data_load`
- **Inputs**: none (source node)
- **Outputs**: `particle`, `trajectory`, `cell` (same as load_structure + load_trajectory combined)
- **Parameters**: `StreamingParams { type: "streaming", url: string | null, connected: boolean }`
- Data comes from a per-node streaming context keyed by node ID (similar to how `nodeSnapshots` works for `load_structure`)

### Changes

#### 1. Pipeline Types (`src/pipeline/types.ts`)
- Add `"streaming"` to `PipelineNodeType`
- Add `StreamingParams` interface
- Add `NODE_PORTS` entry for streaming (outputs: particle, trajectory, cell)
- Add to `NODE_TYPE_LABELS`, `NODE_CATEGORY`
- Remove `sourceMode` from `LoadTrajectoryParams` (file-only now)

#### 2. New Executor (`src/pipeline/executors/streaming.ts`)
- Creates `ParticleData` from snapshot, `TrajectoryData` from stream provider, `CellData` from box
- Gets data from a per-node streaming context in `PipelineExecutionContext`

#### 3. New Node UI (`src/components/nodes/StreamingNode.tsx`)
- Shows connection status (connected/disconnected indicator)
- Shows server URL
- Grayed-out ports when no data available (similar to LoadStructureNode)

#### 4. Pipeline Execution (`src/pipeline/execute.ts`)
- Add `streaming` case using new executor
- Add `nodeStreamingData` to `PipelineExecutionContext` (keyed by node ID, holds snapshot + streamProvider)

#### 5. Pipeline Store (`src/pipeline/store.ts`)
- Add `nodeStreamingData` state (similar to `nodeSnapshots`)
- Add `setNodeStreamingData` / `removeNodeStreamingData` actions
- Remove `streamProvider` from global state (now per-node)

#### 6. WebSocket Hook (`src/hooks/useMeganeWebSocket.ts`)
- Instead of setting global `streamProvider`, set per-node streaming data via `setNodeStreamingData`
- Need a way to associate WebSocket data with a specific streaming node ID

#### 7. LoadTrajectoryNode cleanup
- Remove "File/Stream" toggle from UI
- Remove `sourceMode` from params
- loadTrajectory executor: remove stream branch, file-only

#### 8. Defaults/Templates (`src/pipeline/defaults.ts`, `src/pipeline/templates.ts`)
- Add streaming template if useful (or just register in node palette)

#### 9. Serialization (`src/pipeline/serialize.ts`)
- Add `"streaming"` to `VALID_NODE_TYPES`

#### 10. Validation (`src/pipeline/validate.ts`)
- Add streaming node validation (warn if not connected)

#### 11. PipelineEditor (`src/components/PipelineEditor.tsx`)
- Register `StreamingNode` in `nodeTypes` map

### Data Flow (New Design)

```
WebSocket /ws
    │
    ▼
useMeganeWebSocket hook
    │
    ├─ MSG_SNAPSHOT → nodeStreamingData[nodeId].snapshot
    ├─ MSG_METADATA → nodeStreamingData[nodeId].streamProvider (StreamFrameProvider)
    └─ MSG_FRAME   → streamProvider.receiveFrame()

Pipeline Execution:
    streaming node → reads nodeStreamingData[nodeId]
                   → outputs particle, trajectory, cell
                        │
                        ▼
                 filter, modify, add_bond, etc.
                        │
                        ▼
                    viewport
```

### What stays the same
- `WebSocketClient`, `StreamFrameProvider`, `protocol.ts` — unchanged
- `useDataSource` — still handles mode switching
- `usePlaybackStore` — unchanged
- Python backend — unchanged
