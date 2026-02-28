/**
 * Minimal toolbar overlay.
 */

import { useCallback, useRef } from "react";

interface ToolbarProps {
  atomCount: number;
  bondCount: number;
  onResetView: () => void;
  onUpload?: (pdb: File, xtc?: File) => void;
  hasCell?: boolean;
  cellVisible?: boolean;
  onToggleCell?: () => void;
  mode?: "streaming" | "local";
  onToggleMode?: () => void;
}

const buttonStyle: React.CSSProperties = {
  background: "none",
  border: "1px solid #e2e8f0",
  borderRadius: 6,
  padding: "3px 12px",
  cursor: "pointer",
  fontSize: 12,
  fontWeight: 500,
  color: "#64748b",
  transition: "all 0.15s",
};

const activeButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  background: "rgba(59, 130, 246, 0.08)",
  borderColor: "rgba(59, 130, 246, 0.25)",
  color: "#3b82f6",
};

export function Toolbar({
  atomCount,
  bondCount,
  onResetView,
  onUpload,
  hasCell = false,
  cellVisible = true,
  onToggleCell,
  mode,
  onToggleMode,
}: ToolbarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || !onUpload) return;
      const pdb = Array.from(files).find((f) =>
        f.name.toLowerCase().endsWith(".pdb"),
      );
      if (pdb) onUpload(pdb);
      // Reset so the same file can be re-selected
      e.target.value = "";
    },
    [onUpload],
  );

  return (
    <div
      style={{
        position: "absolute",
        top: 12,
        left: 12,
        display: "flex",
        gap: 8,
        alignItems: "center",
        zIndex: 10,
      }}
    >
      <div
        style={{
          background: "rgba(255, 255, 255, 0.88)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderRadius: 10,
          padding: "8px 16px",
          fontSize: 13,
          color: "#64748b",
          boxShadow: "0 1px 8px rgba(0,0,0,0.06)",
          border: "1px solid rgba(226,232,240,0.6)",
          display: "flex",
          gap: 16,
          alignItems: "center",
        }}
      >
        <span style={{ fontWeight: 700, color: "#1e293b", letterSpacing: "-0.02em" }}>megane</span>
        {onToggleMode && mode && (
          <div
            style={{
              display: "flex",
              borderRadius: 6,
              overflow: "hidden",
              border: "1px solid #e2e8f0",
            }}
          >
            <button
              onClick={mode === "local" ? undefined : onToggleMode}
              style={{
                background: mode === "local" ? "rgba(59,130,246,0.08)" : "none",
                border: "none",
                borderRight: "1px solid #e2e8f0",
                padding: "2px 8px",
                cursor: mode === "local" ? "default" : "pointer",
                fontSize: 12,
                fontWeight: 500,
                color: mode === "local" ? "#3b82f6" : "#94a3b8",
                transition: "all 0.15s",
              }}
              title="In-memory mode (no server)"
            >
              Local
            </button>
            <button
              onClick={mode === "streaming" ? undefined : onToggleMode}
              style={{
                background: mode === "streaming" ? "rgba(59,130,246,0.08)" : "none",
                border: "none",
                padding: "2px 8px",
                cursor: mode === "streaming" ? "default" : "pointer",
                fontSize: 12,
                fontWeight: 500,
                color: mode === "streaming" ? "#3b82f6" : "#94a3b8",
                transition: "all 0.15s",
              }}
              title="WebSocket streaming mode"
            >
              Stream
            </button>
          </div>
        )}
        {atomCount > 0 && (
          <span>
            {atomCount.toLocaleString()} atoms / {bondCount.toLocaleString()}{" "}
            bonds
          </span>
        )}
        {onUpload && (
          <>
            <button
              onClick={() => inputRef.current?.click()}
              style={buttonStyle}
              title="Open PDB file"
            >
              Open
            </button>
            <input
              ref={inputRef}
              type="file"
              accept=".pdb"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </>
        )}
        <button
          onClick={onResetView}
          style={buttonStyle}
          title="Reset view"
        >
          Reset
        </button>
        {hasCell && onToggleCell && (
          <button
            onClick={onToggleCell}
            style={cellVisible ? activeButtonStyle : buttonStyle}
            title="Toggle simulation cell"
          >
            Cell
          </button>
        )}
      </div>
    </div>
  );
}
