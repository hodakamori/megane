/**
 * megane - Standalone web application entry point.
 * Supports two data modes:
 *   - "streaming": connects to Python backend via WebSocket
 *   - "local": parses structure files in-browser via WASM (no server needed)
 */

import { StrictMode, useState, useEffect, useRef, useCallback } from "react";
import { createRoot } from "react-dom/client";
import { MeganeViewer } from "./components/MeganeViewer";
import { useDataSource } from "./hooks/useDataSource";
import { usePipelineStore } from "./pipeline/store";
import defaultPDB from "../tests/fixtures/caffeine_water.pdb?raw";
import defaultXtcUrl from "../tests/fixtures/caffeine_water_vibration.xtc?url";
import perovskiteXYZ from "../tests/fixtures/perovskite_srtio3_3x3x3.xyz?raw";
import "./styles/megane.css";

import type { DataMode } from "./types";
export type { DataMode };

function App() {
  const [mode] = useState<DataMode>("local");
  const ds = useDataSource(mode);

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
      }
      clearPendingTemplate();
    })().catch(() => {});
  }, [pendingTemplateId]);

  // Push structure frames and file frames to the pipeline store
  useEffect(() => {
    if (ds.local.hasStructureFrames) {
      const snapshot = ds.local.snapshot;
      if (snapshot) {
        // Structure has frames - push to pipeline store
        // The frames/meta are managed internally by useMeganeLocal
        // We need to access them via the trajectory source
      }
    }
  }, [ds.local.hasStructureFrames, ds.local.snapshot]);

  const [playing, setPlaying] = useState(false);
  const [fps, setFps] = useState(30);
  const playingRef = useRef(false);

  // Playback loop
  useEffect(() => {
    playingRef.current = playing;
    if (!playing || !ds.meta) return;

    const interval = setInterval(() => {
      if (!playingRef.current) return;
      const nextFrame = (ds.currentFrameRef.current + 1) % ds.meta!.nFrames;
      ds.seekFrame(nextFrame);
    }, 1000 / fps);

    return () => clearInterval(interval);
  }, [playing, ds.meta, fps, ds.currentFrameRef, ds.seekFrame]);

  const handleSeek = useCallback(
    (frameIdx: number) => {
      ds.seekFrame(frameIdx);
    },
    [ds.seekFrame],
  );

  const handlePlayPause = useCallback(() => {
    setPlaying((p) => !p);
  }, []);

  const handleFpsChange = useCallback((newFps: number) => {
    setFps(newFps);
  }, []);

  const handleUploadStructure = useCallback(
    (file: File) => {
      setPlaying(false);
      ds.uploadStructure(file);
    },
    [ds.uploadStructure],
  );

  const handleUploadTrajectory = useCallback(
    (file: File) => {
      setPlaying(false);
      ds.uploadTrajectory(file);
    },
    [ds.uploadTrajectory],
  );

  return (
    <MeganeViewer
      snapshot={ds.snapshot}
      frame={ds.frame}
      currentFrame={ds.currentFrame}
      totalFrames={ds.meta?.nFrames ?? 0}
      playing={playing}
      fps={fps}
      onSeek={handleSeek}
      onPlayPause={handlePlayPause}
      onFpsChange={handleFpsChange}
      onUploadStructure={handleUploadStructure}
      onUploadTrajectory={handleUploadTrajectory}
      onBondSourceChange={ds.setBondSource as (s: string) => void}
      onLabelSourceChange={ds.setLabelSource as (s: string) => void}
      onLoadLabelFile={ds.loadLabelFile}
      onVectorSourceChange={ds.setVectorSource as (s: string) => void}
      onLoadVectorFile={ds.loadVectorFile}
      onLoadDemoVectors={ds.loadDemoVectors}
    />
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
