/**
 * megane - Standalone web application entry point.
 * Supports two data modes:
 *   - "streaming": connects to Python backend via WebSocket
 *   - "local": parses structure files in-browser via WASM (no server needed)
 *
 * Playback is managed by the playback zustand store (usePlaybackStore).
 * The pipeline produces TrajectoryData with a FrameProvider; MeganeViewer
 * wires it to the playback store which drives frame delivery.
 */

import { StrictMode, useState, useEffect, useCallback } from "react";
import { createRoot } from "react-dom/client";
import { MeganeViewer } from "./components/MeganeViewer";
import { useDataSource } from "./hooks/useDataSource";
import { usePipelineStore } from "./pipeline/store";
import { usePlaybackStore } from "./stores/usePlaybackStore";
import { parseStructureFile } from "./parsers/structure";
import { parseXTCFile, parseLammpstrjFile } from "./parsers/xtc";
import { MemoryFrameProvider } from "./pipeline/types";
import type { SerializedPipeline } from "./pipeline/types";
import type { MeganeLocalState } from "./hooks/useMeganeLocal";
import defaultPDB from "../tests/fixtures/caffeine_water.pdb?raw";
import defaultXtcUrl from "../tests/fixtures/caffeine_water_vibration.xtc?url";
import perovskiteXYZ from "../tests/fixtures/perovskite_srtio3_3x3x3.xyz?raw";
import "./styles/megane.css";

import type { DataMode } from "./types";
export type { DataMode };

/**
 * Load a .megane.json pipeline file along with its companion data files.
 *
 * The .megane.json is the standard SerializedPipeline (version 3) format.
 * For each load_structure / load_trajectory node whose fileName matches a
 * companion file by basename, the file is automatically parsed and loaded.
 * Any unmatched nodes will show a "no data" warning — the user can still
 * load those files manually via the node's file picker.
 */
async function loadMeganeFile(
  meganeFile: File,
  companionFiles: File[],
  local: MeganeLocalState,
): Promise<void> {
  const text = await meganeFile.text();
  const pipeline = JSON.parse(text) as SerializedPipeline;
  if (pipeline.version !== 3) {
    throw new Error(`Not a valid megane pipeline file (version 3 required, got ${pipeline.version})`);
  }

  const store = usePipelineStore.getState();
  const fileMap = new Map(companionFiles.map((f) => [f.name, f]));
  const basename = (p: string) => p.split(/[\\/]/).pop() ?? p;

  // Restore the full pipeline configuration (nodes, edges, viewport settings, etc.)
  store.deserialize(pipeline);

  // Phase 1: Parse structure files and collect results
  let firstFile: File | null = null;
  const nodeEntries: Array<{
    nodeId: string;
    file: File;
    result: Awaited<ReturnType<typeof parseStructureFile>>;
    name: string;
  }> = [];

  for (const node of pipeline.nodes) {
    if (node.type !== "load_structure" || !(node as { fileName?: unknown }).fileName) continue;
    const name = basename(String((node as { fileName: string }).fileName));
    const file = fileMap.get(name);
    if (!file) continue;
    const result = await parseStructureFile(file);
    nodeEntries.push({ nodeId: (node as { id: string }).id, file, result, name });
    if (!firstFile) firstFile = file;
  }

  // Update useMeganeLocal so MeganeViewer props (atom selection, measurements) work
  if (firstFile) {
    await local.loadFile(firstFile);
  }

  // Re-apply per-node snapshots (local.loadFile triggers execute() before these are set)
  for (const { nodeId, result, name } of nodeEntries) {
    store.setNodeSnapshot(nodeId, {
      snapshot: result.snapshot,
      frames: result.frames.length > 0 ? result.frames : null,
      meta: result.meta,
      labels: result.labels,
    });
    store.updateNodeParams(nodeId, {
      fileName: name,
      hasTrajectory: result.frames.length > 0,
      hasCell: !!result.snapshot.box,
    });
  }

  // Phase 2: Load trajectory files
  for (const node of pipeline.nodes) {
    if (node.type !== "load_trajectory" || !(node as { fileName?: unknown }).fileName) continue;
    const name = basename(String((node as { fileName: string }).fileName));
    const file = fileMap.get(name);
    if (!file) continue;
    await local.loadXtc(file);
    store.updateNodeParams((node as { id: string }).id, { fileName: name });
  }
}

function App() {
  const [mode] = useState<DataMode>("local");
  const ds = useDataSource(mode);

  // Playback store state
  const playing = usePlaybackStore((s) => s.playing);
  const fps = usePlaybackStore((s) => s.fps);
  const totalFrames = usePlaybackStore((s) => s.totalFrames);
  const togglePlayPause = usePlaybackStore((s) => s.togglePlayPause);
  const setFps = usePlaybackStore((s) => s.setFps);
  const seekFrame = usePlaybackStore((s) => s.seekFrame);

  // Load bundled demo PDB + XTC on first mount
  useEffect(() => {
    (async () => {
      await ds.local.loadText(defaultPDB);
      ds.local.loadDemoVectors();
      // Load demo trajectory
      const resp = await fetch(defaultXtcUrl);
      const blob = await resp.blob();
      const xtcFile = new File([blob], "caffeine_water_vibration.xtc");
      await ds.local.loadXtc(xtcFile);
    })().catch(() => {});
  }, []);

  // Load data when a pipeline template is applied
  const pendingTemplateId = usePipelineStore((s) => s.pendingTemplateId);
  const clearPendingTemplate = usePipelineStore((s) => s.clearPendingTemplate);

  useEffect(() => {
    if (!pendingTemplateId) return;
    (async () => {
      if (pendingTemplateId === "molecule") {
        await ds.local.loadText(defaultPDB, "caffeine_water.pdb");
        const resp = await fetch(defaultXtcUrl);
        const blob = await resp.blob();
        const xtcFile = new File([blob], "caffeine_water_vibration.xtc");
        await ds.local.loadXtc(xtcFile);
      } else if (pendingTemplateId === "solid") {
        await ds.local.loadText(perovskiteXYZ, "perovskite_srtio3_3x3x3.xyz");
      } else if (pendingTemplateId === "streaming") {
        // Load via ds.local so ds.snapshot updates → Viewport.loadSnapshot uses caffeine atoms
        const result = await ds.local.loadText(defaultPDB, "caffeine_water.pdb");
        const resp = await fetch(defaultXtcUrl);
        const blob = await resp.blob();
        const xtcFile = new File([blob], "caffeine_water_vibration.xtc");
        const { frames, meta } = await parseXTCFile(xtcFile, result.snapshot.nAtoms);
        const store = usePipelineStore.getState();
        const streamNode = store.nodes.find((n) => n.type === "streaming");
        if (streamNode) {
          const provider = meta
            ? new MemoryFrameProvider(frames, meta, result.snapshot.positions)
            : null;
          store.setNodeStreamingData(streamNode.id, {
            snapshot: result.snapshot,
            streamProvider: provider,
          });
          store.updateNodeParams(streamNode.id, { connected: true });
        }
      }
      clearPendingTemplate();
    })().catch(() => {});
  }, [pendingTemplateId]);

  const handleSeek = useCallback(
    (frameIdx: number) => {
      seekFrame(frameIdx);
      // Also update legacy data source for backward compat
      ds.seekFrame(frameIdx);
    },
    [seekFrame, ds.seekFrame],
  );

  const handlePlayPause = useCallback(() => {
    togglePlayPause();
  }, [togglePlayPause]);

  const handleFpsChange = useCallback(
    (newFps: number) => {
      setFps(newFps);
    },
    [setFps],
  );

  const handleUploadStructure = useCallback(
    (file: File) => {
      usePlaybackStore.getState().pause();
      ds.uploadStructure(file);
    },
    [ds.uploadStructure],
  );

  const handleUploadTrajectory = useCallback(
    (file: File) => {
      usePlaybackStore.getState().pause();
      ds.uploadTrajectory(file);
    },
    [ds.uploadTrajectory],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      const files = Array.from(e.dataTransfer.files);
      const meganeFile = files.find((f) => f.name.endsWith(".megane.json"));
      if (meganeFile) {
        usePlaybackStore.getState().pause();
        const companions = files.filter((f) => f !== meganeFile);
        await loadMeganeFile(meganeFile, companions, ds.local).catch((err) => {
          console.error("Failed to load .megane.json:", err);
        });
      }
    },
    [ds.local],
  );

  return (
    <div
      style={{ width: "100%", height: "100%" }}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
    <MeganeViewer
      snapshot={ds.snapshot}
      frame={ds.frame}
      currentFrame={ds.currentFrame}
      totalFrames={totalFrames}
      playing={playing}
      fps={fps}
      onSeek={handleSeek}
      onPlayPause={handlePlayPause}
      onFpsChange={handleFpsChange}
      onUploadStructure={handleUploadStructure}
      onUploadTrajectory={handleUploadTrajectory}
      onBondSourceChange={ds.setBondSource}
      onLabelSourceChange={ds.setLabelSource}
      onLoadLabelFile={ds.loadLabelFile}
      onVectorSourceChange={ds.setVectorSource}
      onLoadVectorFile={ds.loadVectorFile}
      onLoadDemoVectors={ds.loadDemoVectors}
    />
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
