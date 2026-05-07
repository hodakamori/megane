/**
 * Overlay panel that renders all PlotData items piped into the Viewport.
 * Positioned at the bottom-left of the viewer, collapsible per plot.
 */

import { useState } from "react";
import type { PlotData } from "../pipeline/types";
import { AnalysisPlot } from "./AnalysisPlot";

interface AnalysisPlotsPanelProps {
  plots: PlotData[];
}

const panelStyle: React.CSSProperties = {
  position: "absolute",
  bottom: 12,
  left: 12,
  display: "flex",
  flexDirection: "column",
  gap: 8,
  zIndex: 20,
  pointerEvents: "none",
};

const cardStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.93)",
  backdropFilter: "blur(6px)",
  border: "1px solid #e2e8f0",
  borderRadius: 12,
  boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
  overflow: "hidden",
  pointerEvents: "auto",
};

const cardHeaderStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "6px 12px",
  borderBottom: "1px solid #f1f5f9",
  cursor: "pointer",
  userSelect: "none",
};

const titleStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  color: "#334155",
};

const toggleBtnStyle: React.CSSProperties = {
  background: "none",
  border: "none",
  cursor: "pointer",
  fontSize: 12,
  color: "#94a3b8",
  padding: "0 4px",
  lineHeight: 1,
};

function PlotCard({ plot }: { plot: PlotData }) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div style={cardStyle}>
      <div style={cardHeaderStyle} onClick={() => setCollapsed((c) => !c)}>
        <span style={titleStyle}>{plot.title}</span>
        <button style={toggleBtnStyle} aria-label={collapsed ? "Expand" : "Collapse"}>
          {collapsed ? "▲" : "▼"}
        </button>
      </div>
      {!collapsed && (
        <div style={{ padding: 8 }}>
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
      {plots.map((plot, idx) => (
        <PlotCard key={idx} plot={plot} />
      ))}
    </div>
  );
}
