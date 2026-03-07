/**
 * Shared node shell for all pipeline nodes.
 * Renders header with title, enable/disable toggle, delete button,
 * and input/output handles.
 */

import { Handle, Position } from "@xyflow/react";
import type { PipelineNodeType } from "../../pipeline/types";
import { NODE_TYPE_LABELS } from "../../pipeline/types";
import { usePipelineStore } from "../../pipeline/store";

interface NodeShellProps {
  id: string;
  nodeType: PipelineNodeType;
  enabled: boolean;
  hasInput?: boolean;
  hasOutput?: boolean;
  children: React.ReactNode;
}

const nodeStyle: React.CSSProperties = {
  background: "rgba(255, 255, 255, 0.95)",
  backdropFilter: "blur(8px)",
  border: "1px solid #e2e8f0",
  borderRadius: 8,
  minWidth: 200,
  maxWidth: 240,
  fontSize: 12,
  boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
};

const disabledStyle: React.CSSProperties = {
  ...nodeStyle,
  opacity: 0.5,
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "6px 10px",
  borderBottom: "1px solid #e2e8f0",
  gap: 6,
};

const titleStyle: React.CSSProperties = {
  fontWeight: 600,
  fontSize: 11,
  color: "#1e293b",
  letterSpacing: "-0.02em",
  flex: 1,
};

const iconBtnStyle: React.CSSProperties = {
  background: "none",
  border: "none",
  cursor: "pointer",
  fontSize: 11,
  color: "#94a3b8",
  padding: "2px 4px",
  lineHeight: 1,
};

const bodyStyle: React.CSSProperties = {
  padding: "8px 10px",
};

const baseHandleStyle: React.CSSProperties = {
  width: 8,
  height: 8,
  border: "2px solid white",
  boxShadow: "0 0 2px rgba(0,0,0,0.2)",
};

function getHandleStyle(
  nodeType: PipelineNodeType,
  handleType: "source" | "target",
): React.CSSProperties {
  const blue = "#3b82f6";
  const orange = "#f59e0b";
  let color = blue;
  // selection output carries selection context → orange
  if (nodeType === "selection" && handleType === "source") color = orange;
  // selection and set_atom inputs accept selection context → orange
  if ((nodeType === "selection" || nodeType === "set_atom") && handleType === "target") color = orange;
  return { ...baseHandleStyle, background: color };
}

export function NodeShell({
  id,
  nodeType,
  enabled,
  hasInput = true,
  hasOutput = true,
  children,
}: NodeShellProps) {
  const toggleNode = usePipelineStore((s) => s.toggleNode);
  const removeNode = usePipelineStore((s) => s.removeNode);

  return (
    <div style={enabled ? nodeStyle : disabledStyle}>
      {hasInput && (
        <Handle
          type="target"
          position={Position.Top}
          style={getHandleStyle(nodeType, "target")}
        />
      )}
      <div style={headerStyle}>
        <span style={titleStyle}>{NODE_TYPE_LABELS[nodeType]}</span>
        <button
          onClick={() => toggleNode(id)}
          style={{
            ...iconBtnStyle,
            color: enabled ? "#3b82f6" : "#94a3b8",
          }}
          title={enabled ? "Disable node" : "Enable node"}
        >
          {enabled ? "\u25C9" : "\u25CB"}
        </button>
        {nodeType !== "load_structure" && (
          <button
            onClick={() => removeNode(id)}
            style={iconBtnStyle}
            title="Remove node"
          >
            &times;
          </button>
        )}
      </div>
      <div style={bodyStyle}>{children}</div>
      {hasOutput && (
        <Handle
          type="source"
          position={Position.Bottom}
          style={getHandleStyle(nodeType, "source")}
        />
      )}
    </div>
  );
}
