/**
 * Render export modal – snapshot (PNG/EPS) and animation (GIF/MP4).
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { MoleculeRenderer } from "../renderer/MoleculeRenderer";
import { captureSnapshot, captureGif, captureVideo, downloadBlob } from "../renderer/RenderCapture";

type Mode = "snapshot" | "animation";
type SnapshotFormat = "png" | "eps";
type AnimationFormat = "gif" | "mp4";

interface RenderModalProps {
  open: boolean;
  onClose: () => void;
  rendererRef: React.RefObject<MoleculeRenderer | null>;
  totalFrames: number;
  currentFrame: number;
  onSeek: (frame: number) => void;
}

const backdropStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.3)",
  backdropFilter: "blur(4px)",
  zIndex: 1000,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const panelStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.97)",
  backdropFilter: "blur(16px)",
  borderRadius: 16,
  boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
  border: "1px solid rgba(226,232,240,0.6)",
  maxWidth: 440,
  width: "90vw",
  maxHeight: "85vh",
  overflow: "auto",
  padding: "20px 24px",
};

const labelStyle: React.CSSProperties = {
  fontSize: 10,
  fontWeight: 600,
  color: "#94a3b8",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  marginBottom: 6,
  marginTop: 14,
};

const inputStyle: React.CSSProperties = {
  border: "1px solid #e2e8f0",
  borderRadius: 8,
  padding: "6px 10px",
  fontSize: 13,
  width: "100%",
  boxSizing: "border-box",
  outline: "none",
};

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  cursor: "pointer",
  appearance: "auto" as const,
};

const tabContainerStyle: React.CSSProperties = {
  display: "flex",
  borderRadius: 10,
  overflow: "hidden",
  border: "1px solid #e2e8f0",
  marginBottom: 10,
};

function TabButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={active ? undefined : onClick}
      style={{
        flex: 1,
        background: active ? "rgba(59,130,246,0.08)" : "none",
        border: "none",
        padding: "7px 0",
        cursor: active ? "default" : "pointer",
        fontSize: 12,
        fontWeight: 600,
        color: active ? "#3b82f6" : "#94a3b8",
        transition: "all 0.15s",
      }}
    >
      {label}
    </button>
  );
}

export function RenderModal({
  open,
  onClose,
  rendererRef,
  totalFrames,
  currentFrame,
  onSeek,
}: RenderModalProps) {
  const [mode, setMode] = useState<Mode>("snapshot");
  const [snapshotFormat, setSnapshotFormat] = useState<SnapshotFormat>("png");
  const [animationFormat, setAnimationFormat] = useState<AnimationFormat>("gif");
  const [width, setWidth] = useState(1920);
  const [height, setHeight] = useState(1080);
  const [scaleFactor, setScaleFactor] = useState(1);
  const [lockAspect, setLockAspect] = useState(true);
  const [transparent, setTransparent] = useState(false);
  const [startFrame, setStartFrame] = useState(0);
  const [endFrame, setEndFrame] = useState(Math.max(0, totalFrames - 1));
  const [animFps, setAnimFps] = useState(30);
  const [exporting, setExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const aspectRef = useRef(1920 / 1080);

  // Sync resolution from viewport on open
  useEffect(() => {
    if (open && rendererRef.current) {
      const canvas = rendererRef.current.getCanvas();
      if (canvas) {
        const w = canvas.clientWidth;
        const h = canvas.clientHeight;
        setWidth(w);
        setHeight(h);
        aspectRef.current = w / h;
      }
    }
  }, [open, rendererRef]);

  // Sync frame range on open
  useEffect(() => {
    if (open) {
      setStartFrame(0);
      setEndFrame(Math.max(0, totalFrames - 1));
    }
  }, [open, totalFrames]);

  const handleWidthChange = useCallback(
    (newW: number) => {
      setWidth(newW);
      if (lockAspect) {
        setHeight(Math.round(newW / aspectRef.current));
      }
    },
    [lockAspect],
  );

  const handleHeightChange = useCallback(
    (newH: number) => {
      setHeight(newH);
      if (lockAspect) {
        setWidth(Math.round(newH * aspectRef.current));
      }
    },
    [lockAspect],
  );

  const handleExport = useCallback(async () => {
    const renderer = rendererRef.current;
    if (!renderer) return;

    setExporting(true);
    setProgress(0);

    try {
      const finalW = width * scaleFactor;
      const finalH = height * scaleFactor;

      if (mode === "snapshot") {
        const blob = await captureSnapshot(renderer, {
          width: finalW,
          height: finalH,
          transparent: transparent && snapshotFormat === "png",
          format: snapshotFormat,
        });
        const ext = snapshotFormat === "eps" ? "eps" : "png";
        downloadBlob(blob, `megane-render.${ext}`);
      } else {
        if (animationFormat === "gif") {
          const blob = await captureGif(renderer, {
            width: finalW,
            height: finalH,
            transparent,
            startFrame,
            endFrame,
            fps: animFps,
            seekFrame: onSeek,
            onProgress: setProgress,
          });
          downloadBlob(blob, "megane-render.gif");
        } else {
          const blob = await captureVideo(renderer, {
            width: finalW,
            height: finalH,
            transparent,
            startFrame,
            endFrame,
            fps: animFps,
            seekFrame: onSeek,
            onProgress: setProgress,
          });
          downloadBlob(blob, "megane-render.webm");
        }
        // Restore to the frame we were on
        onSeek(currentFrame);
      }
    } catch (err) {
      console.error("Export failed:", err);
      alert("Export failed: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setExporting(false);
      setProgress(0);
    }
  }, [
    rendererRef,
    mode,
    snapshotFormat,
    animationFormat,
    width,
    height,
    scaleFactor,
    transparent,
    startFrame,
    endFrame,
    animFps,
    onSeek,
    currentFrame,
  ]);

  if (!open) return null;

  const hasAnimation = totalFrames > 1;

  return createPortal(
    <div style={backdropStyle} onClick={exporting ? undefined : onClose}>
      <div style={panelStyle} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <span style={{ fontSize: 16, fontWeight: 700, color: "#1e293b" }}>Render</span>
          <button
            onClick={onClose}
            disabled={exporting}
            style={{
              background: "none",
              border: "none",
              cursor: exporting ? "default" : "pointer",
              fontSize: 18,
              color: "#94a3b8",
              padding: 4,
            }}
          >
            ✕
          </button>
        </div>

        {/* Mode tabs */}
        <div style={tabContainerStyle}>
          <TabButton
            label="Snapshot"
            active={mode === "snapshot"}
            onClick={() => setMode("snapshot")}
          />
          <TabButton
            label="Animation"
            active={mode === "animation"}
            onClick={() => {
              if (hasAnimation) setMode("animation");
            }}
          />
        </div>
        {!hasAnimation && mode === "snapshot" && (
          <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 8, fontStyle: "italic" }}>
            Load a trajectory for animation export.
          </div>
        )}

        {/* Format selector */}
        <div style={labelStyle}>Format</div>
        <div style={tabContainerStyle}>
          {mode === "snapshot" ? (
            <>
              <TabButton
                label="PNG"
                active={snapshotFormat === "png"}
                onClick={() => setSnapshotFormat("png")}
              />
              <TabButton
                label="EPS"
                active={snapshotFormat === "eps"}
                onClick={() => setSnapshotFormat("eps")}
              />
            </>
          ) : (
            <>
              <TabButton
                label="GIF"
                active={animationFormat === "gif"}
                onClick={() => setAnimationFormat("gif")}
              />
              <TabButton
                label="MP4"
                active={animationFormat === "mp4"}
                onClick={() => setAnimationFormat("mp4")}
              />
            </>
          )}
        </div>

        {/* Resolution */}
        <div style={labelStyle}>Resolution</div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input
            type="number"
            value={width}
            onChange={(e) => handleWidthChange(parseInt(e.target.value) || 1)}
            style={{ ...inputStyle, width: "auto", flex: 1 }}
            min={1}
            max={7680}
            disabled={exporting}
          />
          <span style={{ color: "#94a3b8", fontSize: 12, fontWeight: 600 }}>×</span>
          <input
            type="number"
            value={height}
            onChange={(e) => handleHeightChange(parseInt(e.target.value) || 1)}
            style={{ ...inputStyle, width: "auto", flex: 1 }}
            min={1}
            max={4320}
            disabled={exporting}
          />
        </div>

        {/* Scale factor + aspect lock */}
        <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 8 }}>
          <div style={{ flex: 1 }}>
            <div style={{ ...labelStyle, marginTop: 0, marginBottom: 4 }}>Scale</div>
            <select
              value={scaleFactor}
              onChange={(e) => setScaleFactor(parseInt(e.target.value))}
              style={selectStyle}
              disabled={exporting}
            >
              <option value={1}>1×</option>
              <option value={2}>2×</option>
              <option value={4}>4×</option>
            </select>
          </div>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 12,
              color: "#64748b",
              cursor: "pointer",
              paddingTop: 16,
            }}
          >
            <input
              type="checkbox"
              checked={lockAspect}
              onChange={(e) => setLockAspect(e.target.checked)}
              disabled={exporting}
            />
            Lock aspect
          </label>
        </div>

        {/* Output resolution preview */}
        <div
          style={{
            fontSize: 11,
            color: "#94a3b8",
            marginTop: 6,
          }}
        >
          Output: {width * scaleFactor} × {height * scaleFactor} px
        </div>

        {/* Transparent background (PNG only for snapshot) */}
        {(mode === "snapshot" ? snapshotFormat === "png" : true) && (
          <>
            <div style={labelStyle}>Options</div>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 12,
                color: "#64748b",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={transparent}
                onChange={(e) => setTransparent(e.target.checked)}
                disabled={exporting}
              />
              Transparent background
            </label>
          </>
        )}

        {/* Animation settings */}
        {mode === "animation" && (
          <>
            <div style={labelStyle}>Frame Range</div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input
                type="number"
                value={startFrame}
                onChange={(e) =>
                  setStartFrame(Math.max(0, Math.min(parseInt(e.target.value) || 0, endFrame)))
                }
                style={{ ...inputStyle, width: "auto", flex: 1 }}
                min={0}
                max={endFrame}
                disabled={exporting}
              />
              <span style={{ color: "#94a3b8", fontSize: 12, fontWeight: 600 }}>–</span>
              <input
                type="number"
                value={endFrame}
                onChange={(e) =>
                  setEndFrame(
                    Math.min(totalFrames - 1, Math.max(parseInt(e.target.value) || 0, startFrame)),
                  )
                }
                style={{ ...inputStyle, width: "auto", flex: 1 }}
                min={startFrame}
                max={totalFrames - 1}
                disabled={exporting}
              />
            </div>
            <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>
              {endFrame - startFrame + 1} frames (total: {totalFrames})
            </div>

            <div style={labelStyle}>FPS</div>
            <select
              value={animFps}
              onChange={(e) => setAnimFps(parseInt(e.target.value))}
              style={selectStyle}
              disabled={exporting}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
              <option value={60}>60</option>
            </select>
          </>
        )}

        {/* Progress bar */}
        {exporting && (
          <div style={{ marginTop: 16 }}>
            <div
              style={{
                height: 6,
                borderRadius: 3,
                background: "#e2e8f0",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${Math.round(progress * 100)}%`,
                  background: "#3b82f6",
                  borderRadius: 3,
                  transition: "width 0.2s",
                }}
              />
            </div>
            <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4, textAlign: "center" }}>
              Exporting... {Math.round(progress * 100)}%
            </div>
          </div>
        )}

        {/* Export button */}
        <button
          onClick={handleExport}
          disabled={exporting}
          style={{
            width: "100%",
            marginTop: 20,
            padding: "10px 0",
            borderRadius: 10,
            border: "none",
            background: exporting ? "#94a3b8" : "#3b82f6",
            color: "white",
            fontSize: 14,
            fontWeight: 600,
            cursor: exporting ? "default" : "pointer",
            transition: "all 0.15s",
          }}
        >
          {exporting
            ? "Exporting..."
            : mode === "snapshot"
              ? `Export ${snapshotFormat.toUpperCase()}`
              : `Export ${animationFormat.toUpperCase()}`}
        </button>
      </div>
    </div>,
    document.body,
  );
}
