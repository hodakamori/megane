/**
 * Minimal toolbar overlay.
 */

interface ToolbarProps {
  atomCount: number;
  bondCount: number;
  onResetView: () => void;
}

export function Toolbar({ atomCount, bondCount, onResetView }: ToolbarProps) {
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
        <button
          onClick={onResetView}
          style={{
            background: "none",
            border: "1px solid #dee2e6",
            borderRadius: 4,
            padding: "2px 10px",
            cursor: "pointer",
            fontSize: 12,
            color: "#495057",
          }}
          title="Reset view"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
