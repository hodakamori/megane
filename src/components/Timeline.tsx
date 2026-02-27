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
        padding: "8px 16px 12px",
        background: "rgba(255, 255, 255, 0.85)",
        backdropFilter: "blur(8px)",
        borderTop: "1px solid rgba(0,0,0,0.06)",
        display: "flex",
        alignItems: "center",
        gap: 12,
        zIndex: 10,
        fontFamily: "system-ui, -apple-system, sans-serif",
        fontSize: 13,
        color: "#495057",
      }}
    >
      {/* Play/Pause button */}
      <button
        onClick={onPlayPause}
        style={{
          background: "none",
          border: "1px solid #dee2e6",
          borderRadius: 6,
          width: 32,
          height: 32,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 14,
          color: "#495057",
          flexShrink: 0,
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
          accentColor: "#495057",
        }}
      />

      {/* FPS selector */}
      <select
        value={fps}
        onChange={(e) => onFpsChange(parseInt(e.target.value, 10))}
        style={{
          background: "white",
          border: "1px solid #dee2e6",
          borderRadius: 4,
          padding: "2px 6px",
          fontSize: 12,
          color: "#495057",
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
