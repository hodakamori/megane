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
}

const buttonStyle: React.CSSProperties = {
  background: "none",
  border: "1px solid #dee2e6",
  borderRadius: 4,
  padding: "2px 10px",
  cursor: "pointer",
  fontSize: 12,
  color: "#495057",
};

const activeButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  background: "#e9ecef",
  borderColor: "#adb5bd",
};

export function Toolbar({
  atomCount,
  bondCount,
  onResetView,
  onUpload,
  hasCell = false,
  cellVisible = true,
  onToggleCell,
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
          background: "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(8px)",
          borderRadius: 8,
          padding: "6px 14px",
          fontSize: 13,
          fontFamily: "system-ui, -apple-system, sans-serif",
          color: "#495057",
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          display: "flex",
          gap: 16,
          alignItems: "center",
        }}
      >
        <span style={{ fontWeight: 600, color: "#212529" }}>megane</span>
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
