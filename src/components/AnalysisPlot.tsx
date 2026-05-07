/**
 * Lightweight SVG line chart for analysis plot data (RDF, RMSD, etc.).
 * No third-party chart library — pure SVG with React.
 */

import type { PlotData } from "../pipeline/types";

const CHART_W = 280;
const CHART_H = 160;
const PAD = { top: 20, right: 12, bottom: 36, left: 44 };
const INNER_W = CHART_W - PAD.left - PAD.right;
const INNER_H = CHART_H - PAD.top - PAD.bottom;

function niceTicks(min: number, max: number): number[] {
  const range = max - min || 1;
  const rough = range / 4;
  const magnitude = Math.pow(10, Math.floor(Math.log10(rough)));
  const nice = [1, 2, 2.5, 5, 10].map((f) => f * magnitude);
  const step = nice.find((s) => range / s <= 5) ?? magnitude;
  const start = Math.ceil(min / step) * step;
  const ticks: number[] = [];
  for (let t = start; t <= max + 1e-9; t += step) {
    ticks.push(parseFloat(t.toPrecision(6)));
  }
  return ticks;
}

interface AnalysisPlotProps {
  plot: PlotData;
}

export function AnalysisPlot({ plot }: AnalysisPlotProps) {
  const { x, y, title, xLabel, yLabel } = plot;
  if (x.length === 0) return null;

  const xMin = x[0];
  const xMax = x[x.length - 1];
  const yMin = 0;
  const rawYMax = Math.max(...y, 0.001);
  const yMax = rawYMax * 1.05;

  const toSvgX = (v: number) => PAD.left + ((v - xMin) / (xMax - xMin)) * INNER_W;
  const toSvgY = (v: number) => PAD.top + INNER_H - ((v - yMin) / (yMax - yMin)) * INNER_H;

  // Build SVG path
  const pathPoints = x
    .map((xi, i) => `${i === 0 ? "M" : "L"}${toSvgX(xi).toFixed(1)},${toSvgY(y[i]).toFixed(1)}`)
    .join(" ");

  const xTicks = niceTicks(xMin, xMax);
  const yTicks = niceTicks(yMin, yMax);

  const fmt = (v: number) => {
    if (Math.abs(v) >= 100 || (Math.abs(v) < 0.01 && v !== 0)) return v.toExponential(1);
    return v.toPrecision(3).replace(/\.?0+$/, "");
  };

  return (
    <svg
      width={CHART_W}
      height={CHART_H}
      style={{ display: "block", overflow: "visible" }}
      aria-label={title}
    >
      {/* Title */}
      <text
        x={PAD.left + INNER_W / 2}
        y={PAD.top - 6}
        textAnchor="middle"
        fontSize={10}
        fill="rgba(255,255,255,0.9)"
        fontWeight="600"
      >
        {title}
      </text>

      {/* Plot area background */}
      <rect
        x={PAD.left}
        y={PAD.top}
        width={INNER_W}
        height={INNER_H}
        fill="rgba(0,0,0,0.25)"
        rx={2}
      />

      {/* X-axis ticks and labels */}
      {xTicks.map((t) => {
        const sx = toSvgX(t);
        if (sx < PAD.left - 1 || sx > PAD.left + INNER_W + 1) return null;
        return (
          <g key={`xt-${t}`}>
            <line
              x1={sx}
              y1={PAD.top + INNER_H}
              x2={sx}
              y2={PAD.top + INNER_H + 4}
              stroke="rgba(255,255,255,0.5)"
              strokeWidth={1}
            />
            <text
              x={sx}
              y={PAD.top + INNER_H + 13}
              textAnchor="middle"
              fontSize={8}
              fill="rgba(255,255,255,0.7)"
            >
              {fmt(t)}
            </text>
          </g>
        );
      })}

      {/* Y-axis ticks and labels */}
      {yTicks.map((t) => {
        const sy = toSvgY(t);
        if (sy < PAD.top - 1 || sy > PAD.top + INNER_H + 1) return null;
        return (
          <g key={`yt-${t}`}>
            <line
              x1={PAD.left - 4}
              y1={sy}
              x2={PAD.left}
              y2={sy}
              stroke="rgba(255,255,255,0.5)"
              strokeWidth={1}
            />
            <text
              x={PAD.left - 6}
              y={sy + 3}
              textAnchor="end"
              fontSize={8}
              fill="rgba(255,255,255,0.7)"
            >
              {fmt(t)}
            </text>
          </g>
        );
      })}

      {/* Axes */}
      <line
        x1={PAD.left}
        y1={PAD.top}
        x2={PAD.left}
        y2={PAD.top + INNER_H}
        stroke="rgba(255,255,255,0.4)"
        strokeWidth={1}
      />
      <line
        x1={PAD.left}
        y1={PAD.top + INNER_H}
        x2={PAD.left + INNER_W}
        y2={PAD.top + INNER_H}
        stroke="rgba(255,255,255,0.4)"
        strokeWidth={1}
      />

      {/* Data line */}
      <path d={pathPoints} fill="none" stroke="#14b8a6" strokeWidth={1.5} />

      {/* Axis labels */}
      <text
        x={PAD.left + INNER_W / 2}
        y={CHART_H - 3}
        textAnchor="middle"
        fontSize={9}
        fill="rgba(255,255,255,0.7)"
      >
        {xLabel}
      </text>
      <text
        x={0}
        y={0}
        transform={`translate(10,${PAD.top + INNER_H / 2}) rotate(-90)`}
        textAnchor="middle"
        fontSize={9}
        fill="rgba(255,255,255,0.7)"
      >
        {yLabel}
      </text>
    </svg>
  );
}

