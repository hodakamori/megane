import type { PlotData } from "../pipeline/types";
import { usePlaybackStore } from "../stores/usePlaybackStore";

interface AnalysisPlotProps {
  plot: PlotData;
  width?: number;
  height?: number;
  onFrameSeek?: (frame: number) => void;
}

const PADDING = { top: 16, right: 12, bottom: 36, left: 48 };

function minMax(arr: Float32Array): [number, number] {
  if (arr.length === 0) return [0, 1];
  let mn = arr[0];
  let mx = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < mn) mn = arr[i];
    if (arr[i] > mx) mx = arr[i];
  }
  if (mn === mx) {
    mn -= 0.5;
    mx += 0.5;
  }
  return [mn, mx];
}

export function AnalysisPlot({ plot, width = 300, height = 140, onFrameSeek }: AnalysisPlotProps) {
  const currentFrame = usePlaybackStore((s) => s.currentFrame);

  const innerW = width - PADDING.left - PADDING.right;
  const innerH = height - PADDING.top - PADDING.bottom;
  const n = plot.xValues.length;

  const [xMin, xMax] = minMax(plot.xValues);
  const [yMin, yMax] = minMax(plot.yValues);

  const toSvgX = (x: number) => PADDING.left + ((x - xMin) / (xMax - xMin)) * innerW;
  const toSvgY = (y: number) => PADDING.top + innerH - ((y - yMin) / (yMax - yMin)) * innerH;

  // Build polyline points
  const points: string[] = [];
  for (let i = 0; i < n; i++) {
    points.push(`${toSvgX(plot.xValues[i]).toFixed(1)},${toSvgY(plot.yValues[i]).toFixed(1)}`);
  }
  const polyline = points.join(" ");

  // Cursor x position for current frame (only for frame-indexed RMSD plots)
  const isFramePlot = plot.xLabel === "Frame";
  const cursorX = isFramePlot ? toSvgX(currentFrame) : null;

  // Y-axis ticks (3 ticks)
  const yTicks = [yMin, (yMin + yMax) / 2, yMax];

  function handleClick(e: React.MouseEvent<SVGSVGElement>) {
    if (!onFrameSeek || !isFramePlot) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = e.clientX - rect.left - PADDING.left;
    const frac = Math.max(0, Math.min(1, relX / innerW));
    const frame = Math.round(frac * (xMax - xMin) + xMin);
    onFrameSeek(frame);
  }

  return (
    <div style={{ userSelect: "none" }}>
      <div
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: "#334155",
          marginBottom: 2,
          textAlign: "center",
        }}
      >
        {plot.title}
      </div>
      <svg
        width={width}
        height={height}
        style={{ cursor: isFramePlot && onFrameSeek ? "crosshair" : "default" }}
        onClick={handleClick}
        data-testid="analysis-plot-svg"
      >
        {/* Y-axis */}
        <line
          x1={PADDING.left}
          y1={PADDING.top}
          x2={PADDING.left}
          y2={PADDING.top + innerH}
          stroke="#94a3b8"
          strokeWidth={1}
        />
        {/* X-axis */}
        <line
          x1={PADDING.left}
          y1={PADDING.top + innerH}
          x2={PADDING.left + innerW}
          y2={PADDING.top + innerH}
          stroke="#94a3b8"
          strokeWidth={1}
        />
        {/* Y-axis ticks and labels */}
        {yTicks.map((v, i) => (
          <g key={i}>
            <line
              x1={PADDING.left - 4}
              y1={toSvgY(v)}
              x2={PADDING.left}
              y2={toSvgY(v)}
              stroke="#94a3b8"
              strokeWidth={1}
            />
            <text
              x={PADDING.left - 6}
              y={toSvgY(v)}
              textAnchor="end"
              dominantBaseline="middle"
              fontSize={9}
              fill="#64748b"
            >
              {v.toFixed(2)}
            </text>
          </g>
        ))}
        {/* X-axis label */}
        <text
          x={PADDING.left + innerW / 2}
          y={height - 4}
          textAnchor="middle"
          fontSize={9}
          fill="#64748b"
        >
          {plot.xLabel}
        </text>
        {/* Y-axis label */}
        <text
          x={10}
          y={PADDING.top + innerH / 2}
          textAnchor="middle"
          fontSize={9}
          fill="#64748b"
          transform={`rotate(-90, 10, ${PADDING.top + innerH / 2})`}
        >
          {plot.yLabel}
        </text>
        {/* Data line */}
        {n > 1 && (
          <polyline
            points={polyline}
            fill="none"
            stroke="#06b6d4"
            strokeWidth={1.5}
            strokeLinejoin="round"
          />
        )}
        {/* Current frame cursor */}
        {cursorX !== null && (
          <line
            x1={cursorX}
            y1={PADDING.top}
            x2={cursorX}
            y2={PADDING.top + innerH}
            stroke="#f59e0b"
            strokeWidth={1.5}
            strokeDasharray="3,2"
          />
        )}
      </svg>
    </div>
  );
}
