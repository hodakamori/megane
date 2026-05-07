/**
 * Lightweight SVG chart component for pipeline analysis output.
 * Renders a heatmap (contact map) or scatter plot (Ramachandran) using SVG
 * so that no external charting library is required.
 */

import type { PlotData } from "../pipeline/types";

const PLOT_W = 260;
const PLOT_H = 220;
const MARGIN = { top: 24, right: 12, bottom: 36, left: 40 };

// ─── Colour helpers ───────────────────────────────────────────────────

/** Contact colour: teal for contact, pale for non-contact. */
function contactColor(dist: number, threshold: number): string {
  return dist > 0 && dist <= threshold ? "#0d9488" : "#e2e8f0";
}

// ─── Heatmap (contact map) ────────────────────────────────────────────

function HeatmapPlot({ plot }: { plot: PlotData }) {
  const { matrix, nResidues, residueLabels, threshold } = plot;
  if (!matrix || !nResidues || nResidues === 0) {
    return <NoData title={plot.title} />;
  }

  const innerW = PLOT_W - MARGIN.left - MARGIN.right;
  const innerH = PLOT_H - MARGIN.top - MARGIN.bottom;
  const cellW = innerW / nResidues;
  const cellH = innerH / nResidues;

  // Axis tick count: at most 5 evenly spaced
  const tickCount = Math.min(5, nResidues);
  const tickStep = Math.max(1, Math.floor(nResidues / tickCount));
  const ticks: number[] = [];
  for (let i = 0; i < nResidues; i += tickStep) ticks.push(i);

  const cutoff = threshold ?? 8;

  return (
    <svg
      width={PLOT_W}
      height={PLOT_H}
      style={{ display: "block" }}
      role="img"
      aria-label={plot.title}
    >
      <text x={PLOT_W / 2} y={14} textAnchor="middle" fontSize={11} fontWeight={600} fill="#334155">
        {plot.title}
      </text>
      <g transform={`translate(${MARGIN.left},${MARGIN.top})`}>
        {/* Cells */}
        {Array.from({ length: nResidues }, (_, row) =>
          Array.from({ length: nResidues }, (_, col) => {
            const dist = matrix[row * nResidues + col];
            const fill = contactColor(dist, cutoff);
            return (
              <rect
                key={`${row}-${col}`}
                x={col * cellW}
                y={row * cellH}
                width={cellW}
                height={cellH}
                fill={fill}
              />
            );
          }),
        )}

        {/* X axis ticks */}
        {ticks.map((i) => (
          <text
            key={`xt-${i}`}
            x={i * cellW + cellW / 2}
            y={innerH + 14}
            fontSize={9}
            textAnchor="middle"
            fill="#64748b"
          >
            {residueLabels?.[i] ?? i + 1}
          </text>
        ))}

        {/* Y axis ticks */}
        {ticks.map((i) => (
          <text
            key={`yt-${i}`}
            x={-4}
            y={i * cellH + cellH / 2 + 4}
            fontSize={9}
            textAnchor="end"
            fill="#64748b"
          >
            {residueLabels?.[i] ?? i + 1}
          </text>
        ))}

        {/* Legend: contact threshold label */}
        <text x={0} y={innerH + 30} fontSize={9} fill="#64748b">
          {`Contact ≤ ${cutoff} Å`}
        </text>
      </g>
    </svg>
  );
}

// ─── Scatter plot (Ramachandran) ──────────────────────────────────────

function ScatterPlot({ plot }: { plot: PlotData }) {
  const { xValues, yValues, xRange, yRange, xLabel, yLabel } = plot;
  if (!xValues || !yValues || xValues.length === 0) {
    return <NoData title={plot.title} />;
  }

  const innerW = PLOT_W - MARGIN.left - MARGIN.right;
  const innerH = PLOT_H - MARGIN.top - MARGIN.bottom;

  const xMin = xRange?.[0] ?? -180;
  const xMax = xRange?.[1] ?? 180;
  const yMin = yRange?.[0] ?? -180;
  const yMax = yRange?.[1] ?? 180;

  const toX = (v: number) => ((v - xMin) / (xMax - xMin)) * innerW;
  const toY = (v: number) => innerH - ((v - yMin) / (yMax - yMin)) * innerH;

  // Axis ticks at −180, −90, 0, 90, 180
  const axisTicks = [-180, -90, 0, 90, 180];

  return (
    <svg
      width={PLOT_W}
      height={PLOT_H}
      style={{ display: "block" }}
      role="img"
      aria-label={plot.title}
    >
      <text x={PLOT_W / 2} y={14} textAnchor="middle" fontSize={11} fontWeight={600} fill="#334155">
        {plot.title}
      </text>
      <g transform={`translate(${MARGIN.left},${MARGIN.top})`}>
        {/* Background reference lines */}
        <line x1={toX(0)} y1={0} x2={toX(0)} y2={innerH} stroke="#e2e8f0" strokeWidth={1} />
        <line x1={0} y1={toY(0)} x2={innerW} y2={toY(0)} stroke="#e2e8f0" strokeWidth={1} />

        {/* Border */}
        <rect
          x={0}
          y={0}
          width={innerW}
          height={innerH}
          fill="none"
          stroke="#cbd5e1"
          strokeWidth={1}
        />

        {/* Data points */}
        {Array.from(xValues).map((phi, idx) => {
          const psi = yValues[idx];
          return (
            <circle
              key={idx}
              cx={toX(phi)}
              cy={toY(psi)}
              r={2.5}
              fill="#0d9488"
              fillOpacity={0.7}
            />
          );
        })}

        {/* X axis ticks */}
        {axisTicks.map((v) => (
          <g key={`xt-${v}`}>
            <line
              x1={toX(v)}
              y1={innerH}
              x2={toX(v)}
              y2={innerH + 4}
              stroke="#94a3b8"
              strokeWidth={1}
            />
            <text x={toX(v)} y={innerH + 14} fontSize={9} textAnchor="middle" fill="#64748b">
              {v}
            </text>
          </g>
        ))}

        {/* Y axis ticks */}
        {axisTicks.map((v) => (
          <g key={`yt-${v}`}>
            <line x1={0} y1={toY(v)} x2={-4} y2={toY(v)} stroke="#94a3b8" strokeWidth={1} />
            <text x={-6} y={toY(v) + 4} fontSize={9} textAnchor="end" fill="#64748b">
              {v}
            </text>
          </g>
        ))}

        {/* Axis labels */}
        {xLabel && (
          <text x={innerW / 2} y={innerH + 30} fontSize={10} textAnchor="middle" fill="#475569">
            {xLabel}
          </text>
        )}
        {yLabel && (
          <text
            x={-innerH / 2}
            y={-28}
            fontSize={10}
            textAnchor="middle"
            fill="#475569"
            transform="rotate(-90)"
          >
            {yLabel}
          </text>
        )}
      </g>
    </svg>
  );
}

// ─── Placeholder ──────────────────────────────────────────────────────

function NoData({ title }: { title: string }) {
  return (
    <svg width={PLOT_W} height={PLOT_H} style={{ display: "block" }} role="img" aria-label={title}>
      <text x={PLOT_W / 2} y={14} textAnchor="middle" fontSize={11} fontWeight={600} fill="#334155">
        {title}
      </text>
      <text x={PLOT_W / 2} y={PLOT_H / 2} textAnchor="middle" fontSize={11} fill="#94a3b8">
        No data available
      </text>
    </svg>
  );
}

// ─── Public component ─────────────────────────────────────────────────

export function AnalysisPlot({ plot }: { plot: PlotData }) {
  if (plot.kind === "heatmap") return <HeatmapPlot plot={plot} />;
  return <ScatterPlot plot={plot} />;
}
