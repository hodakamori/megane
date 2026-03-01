/**
 * Left sidebar panel for file management and viewer controls.
 */

import { useCallback, useRef } from "react";

interface SidebarProps {
  mode: "streaming" | "local";
  onToggleMode: () => void;
  atomCount: number;
  bondCount: number;
  pdbFileName: string | null;
  xtcFileName: string | null;
  totalFrames: number;
  timestepPs: number;
  onUploadPdb: (pdb: File) => void;
  onUploadXtc: (xtc: File) => void;
  onResetView: () => void;
  hasCell: boolean;
  cellVisible: boolean;
  onToggleCell: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const sectionLabelStyle: React.CSSProperties = {
  fontSize: 10,
  fontWeight: 600,
  color: "#94a3b8",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  marginBottom: 6,
};

const smallBtnStyle: React.CSSProperties = {
  background: "none",
  border: "1px solid #e2e8f0",
  borderRadius: 5,
  padding: "2px 10px",
  cursor: "pointer",
  fontSize: 11,
  fontWeight: 500,
  color: "#64748b",
  transition: "all 0.15s",
};

const activeBtnStyle: React.CSSProperties = {
  ...smallBtnStyle,
  background: "rgba(59, 130, 246, 0.08)",
  borderColor: "rgba(59, 130, 246, 0.25)",
  color: "#3b82f6",
};

const fileNameStyle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  color: "#1e293b",
  wordBreak: "break-all",
};

const statsStyle: React.CSSProperties = {
  fontSize: 11,
  color: "#94a3b8",
  marginTop: 2,
};

const placeholderStyle: React.CSSProperties = {
  fontSize: 12,
  color: "#94a3b8",
  fontStyle: "italic",
};

const STRUCTURE_ACCEPT = ".pdb,.gro,.xyz,.mol,.sdf";
const STRUCTURE_EXTS = [".pdb", ".gro", ".xyz", ".mol", ".sdf"];

function matchesAccept(name: string, exts: string[]): boolean {
  const lower = name.toLowerCase();
  return exts.some((ext) => lower.endsWith(ext));
}

function DropZone({
  accept,
  exts,
  onFile,
  label,
  children,
}: {
  accept: string;
  exts: string[];
  onFile: (file: File) => void;
  label: string;
  children: React.ReactNode;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const files = Array.from(e.dataTransfer.files);
      const match = files.find((f) => matchesAccept(f.name, exts));
      if (match) onFile(match);
    },
    [exts, onFile],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files) return;
      const match = Array.from(files).find((f) => matchesAccept(f.name, exts));
      if (match) onFile(match);
      e.target.value = "";
    },
    [exts, onFile],
  );

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      style={{ minHeight: 0 }}
    >
      {children}
      <button
        onClick={() => inputRef.current?.click()}
        style={{ ...smallBtnStyle, marginTop: 6 }}
      >
        {label}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
    </div>
  );
}

export function Sidebar({
  mode,
  onToggleMode,
  atomCount,
  bondCount,
  pdbFileName,
  xtcFileName,
  totalFrames,
  timestepPs,
  onUploadPdb,
  onUploadXtc,
  onResetView,
  hasCell,
  cellVisible,
  onToggleCell,
  collapsed,
  onToggleCollapse,
}: SidebarProps) {
  if (collapsed) {
    return (
      <div
        style={{
          position: "absolute",
          top: 12,
          left: 12,
          zIndex: 10,
        }}
      >
        <button
          onClick={onToggleCollapse}
          style={{
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
            fontWeight: 700,
            color: "#1e293b",
            letterSpacing: "-0.02em",
          }}
          title="Open sidebar"
        >
          megane
          <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 400 }}>
            &#9654;
          </span>
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        position: "absolute",
        top: 12,
        left: 12,
        bottom: 60,
        width: 240,
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
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "10px 14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid rgba(226,232,240,0.6)",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontWeight: 700,
            color: "#1e293b",
            fontSize: 14,
            letterSpacing: "-0.02em",
          }}
        >
          megane
        </span>
        <button
          onClick={onToggleCollapse}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 13,
            color: "#94a3b8",
            padding: "2px 4px",
          }}
          title="Collapse sidebar"
        >
          &#9664;
        </button>
      </div>

      {/* Scrollable content */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "10px 14px",
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        {/* Mode Section */}
        <div>
          <div style={sectionLabelStyle}>Mode</div>
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
                flex: 1,
                background:
                  mode === "local" ? "rgba(59,130,246,0.08)" : "none",
                border: "none",
                borderRight: "1px solid #e2e8f0",
                padding: "4px 0",
                cursor: mode === "local" ? "default" : "pointer",
                fontSize: 12,
                fontWeight: 500,
                color: mode === "local" ? "#3b82f6" : "#94a3b8",
                transition: "all 0.15s",
              }}
            >
              Local
            </button>
            <button
              onClick={mode === "streaming" ? undefined : onToggleMode}
              style={{
                flex: 1,
                background:
                  mode === "streaming" ? "rgba(59,130,246,0.08)" : "none",
                border: "none",
                padding: "4px 0",
                cursor: mode === "streaming" ? "default" : "pointer",
                fontSize: 12,
                fontWeight: 500,
                color: mode === "streaming" ? "#3b82f6" : "#94a3b8",
                transition: "all 0.15s",
              }}
            >
              Stream
            </button>
          </div>
        </div>

        {/* Structure Section */}
        <div>
          <div style={sectionLabelStyle}>Structure</div>
          <DropZone accept={STRUCTURE_ACCEPT} exts={STRUCTURE_EXTS} onFile={onUploadPdb} label="Change...">
            {pdbFileName ? (
              <>
                <div style={fileNameStyle}>{pdbFileName}</div>
                {atomCount > 0 && (
                  <div style={statsStyle}>
                    {atomCount.toLocaleString()} atoms /{" "}
                    {bondCount.toLocaleString()} bonds
                  </div>
                )}
              </>
            ) : (
              <div style={placeholderStyle}>No structure loaded</div>
            )}
          </DropZone>
        </div>

        {/* Trajectory Section */}
        <div>
          <div style={sectionLabelStyle}>Trajectory</div>
          <DropZone accept=".xtc" exts={[".xtc"]} onFile={onUploadXtc} label="Load XTC...">
            {xtcFileName ? (
              <>
                <div style={fileNameStyle}>{xtcFileName}</div>
                <div style={statsStyle}>
                  {totalFrames.toLocaleString()} frames
                  {timestepPs > 0 &&
                    ` · ${timestepPs.toFixed(1)} ps/frame`}
                </div>
              </>
            ) : (
              <div style={placeholderStyle}>No trajectory loaded</div>
            )}
          </DropZone>
        </div>
      </div>

      {/* Footer actions */}
      <div
        style={{
          padding: "8px 14px",
          borderTop: "1px solid rgba(226,232,240,0.6)",
          display: "flex",
          gap: 6,
          flexShrink: 0,
        }}
      >
        <button onClick={onResetView} style={smallBtnStyle} title="Reset view">
          Reset
        </button>
        {hasCell && (
          <button
            onClick={onToggleCell}
            style={cellVisible ? activeBtnStyle : smallBtnStyle}
            title="Toggle simulation cell"
          >
            Cell
          </button>
        )}
      </div>
    </div>
  );
}
