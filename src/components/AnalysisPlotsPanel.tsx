import { usePipelineStore } from "../pipeline/store";
import { usePlaybackStore } from "../stores/usePlaybackStore";
import { AnalysisPlot } from "./AnalysisPlot";

/**
 * Overlay panel that renders RMSD/RMSF plots when analysis nodes are present
 * in the pipeline. Positioned at the bottom-left above the timeline.
 */
export function AnalysisPlotsPanel({ onSeek }: { onSeek?: (frame: number) => void }) {
  const plots = usePipelineStore((s) => s.viewportState.plots);
  const seekFrame = usePlaybackStore((s) => s.seekFrame);

  if (plots.length === 0) return null;

  const handleFrameSeek = (frame: number) => {
    seekFrame(frame);
    onSeek?.(frame);
  };

  return (
    <div
      data-testid="analysis-plots-panel"
      style={{
        position: "absolute",
        bottom: 60,
        left: 8,
        display: "flex",
        flexDirection: "column",
        gap: 4,
        pointerEvents: "none",
        zIndex: 15,
      }}
    >
      {plots.map((plot, i) => (
        <div
          key={i}
          style={{
            background: "rgba(255,255,255,0.92)",
            border: "1px solid rgba(0,0,0,0.12)",
            borderRadius: 6,
            padding: "6px 8px",
            backdropFilter: "blur(4px)",
            boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
            pointerEvents: "auto",
          }}
        >
          <AnalysisPlot plot={plot} onFrameSeek={handleFrameSeek} />
        </div>
      ))}
    </div>
  );
}
