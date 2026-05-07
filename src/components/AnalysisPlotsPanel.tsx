/**
 * Collapsible overlay panel that renders analysis plots (RDF, etc.)
 * in the bottom-left corner of the viewer.
 */

import { useState } from "react";
import type { PlotData } from "../pipeline/types";
import { AnalysisPlot } from "./AnalysisPlot";

interface AnalysisPlotsPanelProps {
  plots: PlotData[];
}

const panelStyle: React.CSSProperties = {
  position: "absolute",
  bottom: 80,
  left: 12,
  zIndex: 20,
  display: "flex",
  flexDirection: "column",
  gap: 6,
  pointerEvents: "auto",
};

const cardStyle: React.CSSProperties = {
  background: "rgba(15,23,42,0.82)",
  backdropFilter: "blur(6px)",
  borderRadius: 8,
  border: "1px solid rgba(255,255,255,0.1)",
  overflow: "hidden",
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "4px 8px",
  cursor: "pointer",
  userSelect: "none",
};

const titleStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  color: "rgba(255,255,255,0.8)",
};

const chevronStyle = (open: boolean): React.CSSProperties => ({
  fontSize: 10,
  color: "rgba(255,255,255,0.5)",
  transform: open ? "rotate(0deg)" : "rotate(-90deg)",
  transition: "transform 0.15s",
});

function PlotCard({ plot }: { plot: PlotData }) {
  const [open, setOpen] = useState(true);
  return (
    <div style={cardStyle} data-testid="analysis-plot-card">
      <div style={headerStyle} onClick={() => setOpen((o) => !o)}>
        <span style={titleStyle}>{plot.title}</span>
        <span style={chevronStyle(open)}>▼</span>
      </div>
      {open && (
        <div style={{ padding: "0 4px 6px" }}>
          <AnalysisPlot plot={plot} />
        </div>
      )}
    </div>
  );
}

export function AnalysisPlotsPanel({ plots }: AnalysisPlotsPanelProps) {
  if (plots.length === 0) return null;
  return (
    <div style={panelStyle} data-testid="analysis-plots-panel">
      {plots.map((p, i) => (
        <PlotCard key={`${p.title}-${i}`} plot={p} />
      ))}
    </div>
  );
}
