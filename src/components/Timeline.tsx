/**
 * Trajectory playback timeline with play/pause and seek.
 */

interface TimelineProps {
  currentFrame: number;
  totalFrames: number;
  playing: boolean;
  fps: number;
  onSeek: (frame: number) => void;
  onPlayPause: () => void;
  onFpsChange: (fps: number) => void;
}

export function Timeline({
  currentFrame,
  totalFrames,
  playing,
  fps,
  onSeek,
  onPlayPause,
  onFpsChange,
}: TimelineProps) {
  if (totalFrames <= 1) return null;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        padding: "10px 20px 14px",
        background: "rgba(255, 255, 255, 0.88)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderTop: "1px solid rgba(226,232,240,0.6)",
        boxShadow: "0 -1px 8px rgba(0,0,0,0.04)",
        display: "flex",
        alignItems: "center",
        gap: 12,
        zIndex: 10,
        fontSize: 13,
        color: "#64748b",
      }}
    >
      {/* Play/Pause button */}
      <button
        onClick={onPlayPause}
        style={{
          background: "none",
          border: "1px solid #e2e8f0",
          borderRadius: 8,
          width: 32,
          height: 32,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 14,
          fontWeight: 500,
          color: "#64748b",
          flexShrink: 0,
          transition: "all 0.15s",
        }}
        title={playing ? "Pause" : "Play"}
      >
        {playing ? "\u23F8" : "\u25B6"}
      </button>

      {/* Frame counter */}
      <span
        style={{
          minWidth: 80,
          textAlign: "center",
          fontVariantNumeric: "tabular-nums",
          fontWeight: 500,
          color: "#64748b",
          flexShrink: 0,
        }}
      >
        {currentFrame + 1} / {totalFrames}
      </span>

      {/* Seek slider */}
      <input
        type="range"
        min={0}
        max={totalFrames - 1}
        value={currentFrame}
        onChange={(e) => onSeek(parseInt(e.target.value, 10))}
        style={{
          flex: 1,
          height: 4,
          cursor: "pointer",
          accentColor: "#3b82f6",
        }}
      />

      {/* FPS selector */}
      <select
        value={fps}
        onChange={(e) => onFpsChange(parseInt(e.target.value, 10))}
        style={{
          background: "rgba(255,255,255,0.8)",
          border: "1px solid #e2e8f0",
          borderRadius: 6,
          padding: "2px 6px",
          fontSize: 12,
          fontWeight: 500,
          color: "#64748b",
          cursor: "pointer",
          flexShrink: 0,
        }}
      >
        <option value={10}>10 fps</option>
        <option value={20}>20 fps</option>
        <option value={30}>30 fps</option>
        <option value={60}>60 fps</option>
      </select>
    </div>
  );
}
