/**
 * Shared collapsible panel with frosted glass styling.
 * Used by AppearancePanel and PipelineEditor.
 */

import type { CSSProperties, ReactNode } from "react";

/** Frosted glass panel container style. */
export const panelContainerStyle: CSSProperties = {
  position: "absolute",
  top: 12,
  right: 12,
  bottom: 60,
  zIndex: 10,
  background: "rgba(255, 255, 255, 0.92)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  borderRadius: 12,
  boxShadow: "0 1px 8px rgba(0,0,0,0.06)",
  border: "1px solid rgba(226,232,240,0.6)",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
};

/** Panel header style. */
export const panelHeaderStyle: CSSProperties = {
  padding: "10px 14px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  borderBottom: "1px solid rgba(226,232,240,0.6)",
  flexShrink: 0,
};

/** Panel title text style. */
export const panelTitleStyle: CSSProperties = {
  fontWeight: 600,
  color: "#1e293b",
  fontSize: 13,
  letterSpacing: "-0.02em",
};

/** Collapse/expand button (the ▶ / ◀ arrow). */
export const collapseButtonStyle: CSSProperties = {
  background: "none",
  border: "none",
  cursor: "pointer",
  fontSize: 13,
  color: "#94a3b8",
  padding: "2px 4px",
};

/** Style for the collapsed toggle button. */
const collapsedButtonStyle: CSSProperties = {
  background: "rgba(255, 255, 255, 0.88)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  border: "1px solid rgba(226,232,240,0.6)",
  borderRadius: 10,
  padding: "8px 12px",
  cursor: "pointer",
  boxShadow: "0 1px 8px rgba(0,0,0,0.06)",
  display: "flex",
  alignItems: "center",
  gap: 8,
  fontSize: 13,
  fontWeight: 600,
  color: "#1e293b",
  letterSpacing: "-0.02em",
};

interface CollapsiblePanelProps {
  title: string;
  collapsed: boolean;
  onToggleCollapse: () => void;
  /** Panel width (default: 220). */
  width?: number | string;
  /** Extra header content (buttons etc.) placed before the collapse button. */
  headerExtra?: ReactNode;
  /** Extra elements prepended inside the panel container (e.g. resize handle). */
  containerExtra?: ReactNode;
  children: ReactNode;
}

/**
 * Collapsible frosted glass panel.
 * When collapsed, renders a small button. When expanded, renders a full panel.
 */
export function CollapsiblePanel({
  title,
  collapsed,
  onToggleCollapse,
  width = 220,
  headerExtra,
  containerExtra,
  children,
}: CollapsiblePanelProps) {
  if (collapsed) {
    return (
      <div style={{ position: "absolute", top: 12, right: 12, zIndex: 10 }}>
        <button
          onClick={onToggleCollapse}
          style={collapsedButtonStyle}
          title={`Open ${title.toLowerCase()}`}
        >
          <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 400 }}>&#9664;</span>
          {title}
        </button>
      </div>
    );
  }

  return (
    <div style={{ ...panelContainerStyle, width }}>
      {containerExtra}
      <div style={panelHeaderStyle}>
        <span style={panelTitleStyle}>{title}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 8, position: "relative", flexWrap: "wrap" }}>
          {headerExtra}
          <button onClick={onToggleCollapse} style={collapseButtonStyle} title="Collapse panel">
            &#9654;
          </button>
        </div>
      </div>
      {children}
    </div>
  );
}
