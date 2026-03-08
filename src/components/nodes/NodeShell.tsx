/**
 * Shared node shell for all pipeline nodes.
 * Renders header with title, enable/disable toggle, delete button,
 * and typed input/output handles with color-coded indicators.
 */

import { Handle, Position } from "@xyflow/react";
import type { PipelineNodeType, PortDefinition } from "../../pipeline/types";
import { NODE_TYPE_LABELS, NODE_PORTS, DATA_TYPE_COLORS, NODE_CATEGORY, NODE_CATEGORY_COLORS } from "../../pipeline/types";
import { usePipelineStore } from "../../pipeline/store";

interface NodeShellProps {
  id: string;
  nodeType: PipelineNodeType;
  enabled: boolean;
  children: React.ReactNode;
  /** Port names that should be visually disabled (grayed out). */
  disabledPorts?: Set<string>;
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

const handleLabelStyle: React.CSSProperties = {
  position: "absolute",
  fontSize: 8,
  color: "#94a3b8",
  whiteSpace: "nowrap",
  pointerEvents: "none",
};

function getHandleColor(port: PortDefinition, disabled?: boolean): string {
  if (disabled) return "#cbd5e1"; // slate-300 gray
  return DATA_TYPE_COLORS[port.dataType];
}

/**
 * Compute handle positions evenly distributed across the node width.
 * Returns a percentage (0-100) for the `left` CSS property.
 */
function getHandlePosition(index: number, total: number): string {
  if (total === 1) return "50%";
  const step = 80 / (total - 1); // distribute across 10%-90%
  return `${10 + step * index}%`;
}

export function NodeShell({ id, nodeType, enabled, children, disabledPorts }: NodeShellProps) {
  const toggleNode = usePipelineStore((s) => s.toggleNode);
  const removeNode = usePipelineStore((s) => s.removeNode);
  const ports = NODE_PORTS[nodeType];
  const categoryColor = NODE_CATEGORY_COLORS[NODE_CATEGORY[nodeType]];

  const containerStyle: React.CSSProperties = {
    ...(enabled ? nodeStyle : disabledStyle),
    borderLeft: `3px solid ${categoryColor}`,
  };

  return (
    <div style={containerStyle}>
      {/* Input handles */}
      {ports.inputs.map((port, i) => {
        const isDisabled = disabledPorts?.has(port.name) ?? false;
        return (
          <Handle
            key={`in-${port.name}`}
            type="target"
            position={Position.Top}
            id={port.name}
            style={{
              ...baseHandleStyle,
              background: getHandleColor(port, isDisabled),
              left: getHandlePosition(i, ports.inputs.length),
            }}
          >
            <span
              style={{
                ...handleLabelStyle,
                top: -14,
                left: "50%",
                transform: "translateX(-50%)",
                color: isDisabled ? "#cbd5e1" : "#94a3b8",
              }}
            >
              {port.label}
            </span>
          </Handle>
        );
      })}

      <div style={headerStyle}>
        <span style={titleStyle}>{NODE_TYPE_LABELS[nodeType]}</span>
        <div
          onClick={() => toggleNode(id)}
          style={{
            width: 28,
            height: 14,
            borderRadius: 7,
            background: enabled ? "#3b82f6" : "#cbd5e1",
            position: "relative",
            cursor: "pointer",
            transition: "background 0.15s",
            flexShrink: 0,
          }}
          title={enabled ? "Disable node" : "Enable node"}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: "white",
              position: "absolute",
              top: 2,
              left: enabled ? 16 : 2,
              transition: "left 0.15s",
            }}
          />
        </div>
        {nodeType !== "viewport" && (
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

      {/* Output handles */}
      {ports.outputs.map((port, i) => {
        const isDisabled = disabledPorts?.has(port.name) ?? false;
        return (
          <Handle
            key={`out-${port.name}`}
            type="source"
            position={Position.Bottom}
            id={port.name}
            style={{
              ...baseHandleStyle,
              background: getHandleColor(port, isDisabled),
              left: getHandlePosition(i, ports.outputs.length),
            }}
          >
            <span
              style={{
                ...handleLabelStyle,
                bottom: -14,
                left: "50%",
                transform: "translateX(-50%)",
                color: isDisabled ? "#cbd5e1" : "#94a3b8",
              }}
            >
              {port.label}
            </span>
          </Handle>
        );
      })}
    </div>
  );
}
