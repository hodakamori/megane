/**
 * Pipeline editor panel using xyflow.
 * Typed data-flow pipeline with color-coded handles per data type.
 */

import { useCallback, useMemo, useState } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
} from "@xyflow/react";
import type { Connection } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { usePipelineStore } from "../pipeline/store";
import type { PipelineNodeType } from "../pipeline/types";
import { NODE_TYPE_LABELS, canConnect, DATA_TYPE_COLORS, NODE_PORTS } from "../pipeline/types";
import { DataLoaderNode } from "./nodes/DataLoaderNode";
import { ViewportNode } from "./nodes/ViewportNode";
import { FilterNode } from "./nodes/FilterNode";
import { ModifyNode } from "./nodes/ModifyNode";
import { LabelGeneratorNode } from "./nodes/LabelGeneratorNode";

const nodeTypes = {
  data_loader: DataLoaderNode,
  viewport: ViewportNode,
  filter: FilterNode,
  modify: ModifyNode,
  label_generator: LabelGeneratorNode,
};

const ADDABLE_NODE_TYPES: PipelineNodeType[] = [
  "filter",
  "modify",
  "label_generator",
  "viewport",
];

const panelStyle: React.CSSProperties = {
  position: "absolute",
  top: 12,
  left: 12,
  bottom: 60,
  width: 480,
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

const headerStyle: React.CSSProperties = {
  padding: "10px 14px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  borderBottom: "1px solid rgba(226,232,240,0.6)",
  flexShrink: 0,
};

const addBtnStyle: React.CSSProperties = {
  background: "rgba(59, 130, 246, 0.08)",
  border: "1px solid rgba(59, 130, 246, 0.25)",
  borderRadius: 6,
  padding: "4px 12px",
  cursor: "pointer",
  fontSize: 11,
  fontWeight: 600,
  color: "#3b82f6",
};

const dropdownStyle: React.CSSProperties = {
  position: "absolute",
  top: "100%",
  right: 0,
  marginTop: 4,
  background: "white",
  border: "1px solid #e2e8f0",
  borderRadius: 8,
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  zIndex: 100,
  minWidth: 160,
  padding: "4px 0",
};

const dropdownItemStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  background: "none",
  border: "none",
  padding: "6px 14px",
  cursor: "pointer",
  fontSize: 12,
  color: "#334155",
  textAlign: "left",
};

/**
 * Determine edge color from the source handle's data type.
 */
function getEdgeColor(sourceNodeType: string | undefined, sourceHandle: string | null): string {
  if (!sourceNodeType || !sourceHandle) return "#94a3b8";
  const ports = NODE_PORTS[sourceNodeType as PipelineNodeType];
  if (!ports) return "#94a3b8";
  const port = ports.outputs.find((p) => p.name === sourceHandle);
  if (!port) return "#94a3b8";
  return DATA_TYPE_COLORS[port.dataType];
}

function PipelineEditorInner({
  collapsed,
  onToggleCollapse,
}: {
  collapsed: boolean;
  onToggleCollapse: () => void;
}) {
  const nodes = usePipelineStore((s) => s.nodes);
  const edges = usePipelineStore((s) => s.edges);
  const onNodesChange = usePipelineStore((s) => s.onNodesChange);
  const onEdgesChange = usePipelineStore((s) => s.onEdgesChange);
  const onConnect = usePipelineStore((s) => s.onConnect);
  const addNode = usePipelineStore((s) => s.addNode);

  const [showAddMenu, setShowAddMenu] = useState(false);

  // Connection validation using typed port matching
  const isValidConnection = useCallback(
    (connection: Connection | { source: string; target: string; sourceHandle?: string | null; targetHandle?: string | null }) => {
      if (connection.source === connection.target) return false;
      const sourceNode = nodes.find((n) => n.id === connection.source);
      const targetNode = nodes.find((n) => n.id === connection.target);
      if (!sourceNode?.type || !targetNode?.type) return false;
      return canConnect(
        sourceNode.type as PipelineNodeType,
        (connection as Connection).sourceHandle ?? null,
        targetNode.type as PipelineNodeType,
        (connection as Connection).targetHandle ?? null,
      );
    },
    [nodes],
  );

  // Color edges based on data type
  const styledEdges = useMemo(() => {
    return edges.map((edge) => {
      const sourceNode = nodes.find((n) => n.id === edge.source);
      const color = getEdgeColor(sourceNode?.type, edge.sourceHandle ?? null);
      return {
        ...edge,
        style: {
          stroke: color,
          strokeWidth: 2,
        },
      };
    });
  }, [edges, nodes]);

  const handleAddNode = useCallback(
    (type: PipelineNodeType) => {
      addNode(type);
      setShowAddMenu(false);
    },
    [addNode],
  );

  const memoizedNodeTypes = useMemo(() => nodeTypes, []);

  if (collapsed) {
    return (
      <div style={{ position: "absolute", top: 12, left: 12, zIndex: 10 }}>
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
            fontWeight: 600,
            color: "#1e293b",
            letterSpacing: "-0.02em",
          }}
          title="Open pipeline editor"
        >
          <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 400 }}>
            &#9654;
          </span>
          Pipeline
        </button>
      </div>
    );
  }

  return (
    <div style={panelStyle}>
      <div style={headerStyle}>
        <span
          style={{
            fontWeight: 600,
            color: "#1e293b",
            fontSize: 13,
            letterSpacing: "-0.02em",
          }}
        >
          Pipeline
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 8, position: "relative" }}>
          <button
            onClick={() => setShowAddMenu(!showAddMenu)}
            style={addBtnStyle}
          >
            + Add Node
          </button>
          {showAddMenu && (
            <div style={dropdownStyle}>
              {ADDABLE_NODE_TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() => handleAddNode(type)}
                  style={dropdownItemStyle}
                  onMouseEnter={(e) => {
                    (e.target as HTMLElement).style.background = "rgba(59,130,246,0.06)";
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLElement).style.background = "none";
                  }}
                >
                  {NODE_TYPE_LABELS[type]}
                </button>
              ))}
            </div>
          )}
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
            title="Collapse panel"
          >
            &#9664;
          </button>
        </div>
      </div>

      <div style={{ flex: 1, position: "relative" }}>
        <ReactFlow
          nodes={nodes}
          edges={styledEdges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          isValidConnection={isValidConnection}
          nodeTypes={memoizedNodeTypes}
          fitView
          fitViewOptions={{ padding: 1.2, maxZoom: 0.65 }}
          minZoom={0.3}
          maxZoom={2}
          defaultEdgeOptions={{
            type: "smoothstep",
            style: { stroke: "#94a3b8", strokeWidth: 2 },
          }}
          proOptions={{ hideAttribution: true }}
        >
          <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="#e2e8f0" />
          <MiniMap
            style={{
              background: "rgba(255,255,255,0.8)",
              border: "1px solid #e2e8f0",
              borderRadius: 6,
            }}
            nodeColor="#3b82f6"
            maskColor="rgba(59,130,246,0.05)"
          />
          <Controls
            showInteractive={false}
            style={{
              border: "1px solid #e2e8f0",
              borderRadius: 6,
              boxShadow: "none",
            }}
          />
        </ReactFlow>
      </div>
    </div>
  );
}

export function PipelineEditor({
  collapsed,
  onToggleCollapse,
}: {
  collapsed: boolean;
  onToggleCollapse: () => void;
}) {
  return (
    <ReactFlowProvider>
      <PipelineEditorInner
        collapsed={collapsed}
        onToggleCollapse={onToggleCollapse}
      />
    </ReactFlowProvider>
  );
}
