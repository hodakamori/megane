/**
 * Pipeline editor panel using xyflow.
 * Typed data-flow pipeline with color-coded handles per data type.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import {
  NODE_TYPE_LABELS,
  canConnect,
  DATA_TYPE_COLORS,
  NODE_PORTS,
  NODE_CATEGORY_COLORS,
  NODE_CATEGORY,
} from "../pipeline/types";
import type { NodeCategory } from "../pipeline/types";
import { PIPELINE_TEMPLATES } from "../pipeline/templates";
import { CollapsiblePanel } from "./CollapsiblePanel";
import { LoadStructureNode } from "./nodes/LoadStructureNode";
import { LoadTrajectoryNode } from "./nodes/LoadTrajectoryNode";
import { AddBondNode } from "./nodes/AddBondNode";
import { ViewportNode } from "./nodes/ViewportNode";
import { FilterNode } from "./nodes/FilterNode";
import { ModifyNode } from "./nodes/ModifyNode";
import { LabelGeneratorNode } from "./nodes/LabelGeneratorNode";
import { PolyhedronGeneratorNode } from "./nodes/PolyhedronGeneratorNode";

const nodeTypes = {
  load_structure: LoadStructureNode,
  load_trajectory: LoadTrajectoryNode,
  add_bond: AddBondNode,
  viewport: ViewportNode,
  filter: FilterNode,
  modify: ModifyNode,
  label_generator: LabelGeneratorNode,
  polyhedron_generator: PolyhedronGeneratorNode,
};

const ADD_NODE_GROUPS: { category: NodeCategory; label: string; types: PipelineNodeType[] }[] = [
  { category: "data_load", label: "Data Load", types: ["load_structure", "load_trajectory"] },
  { category: "bond", label: "Bond", types: ["add_bond"] },
  { category: "filter", label: "Filter", types: ["filter"] },
  { category: "modify", label: "Modify", types: ["modify"] },
  { category: "overlay", label: "Overlay", types: ["label_generator", "polyhedron_generator"] },
];

const MIN_WIDTH = 320;
const MAX_WIDTH = 600;
const DEFAULT_WIDTH = 480;

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
  minWidth: 180,
  padding: "4px 0",
};

const dropdownItemStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  background: "none",
  border: "none",
  padding: "6px 14px 6px 20px",
  cursor: "pointer",
  fontSize: 12,
  color: "#334155",
  textAlign: "left",
};

const groupHeaderStyle: React.CSSProperties = {
  fontSize: 10,
  fontWeight: 600,
  color: "#94a3b8",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  padding: "6px 14px 2px",
  display: "flex",
  alignItems: "center",
  gap: 6,
};

const templateBtnStyle: React.CSSProperties = {
  background: "rgba(139, 92, 246, 0.08)",
  border: "1px solid rgba(139, 92, 246, 0.25)",
  borderRadius: 6,
  padding: "4px 12px",
  cursor: "pointer",
  fontSize: 11,
  fontWeight: 600,
  color: "#8b5cf6",
};

const templateItemDescStyle: React.CSSProperties = {
  fontSize: 10,
  color: "#94a3b8",
  marginTop: 1,
};

const resizeHandleStyle: React.CSSProperties = {
  position: "absolute",
  left: 0,
  top: 0,
  bottom: 0,
  width: 5,
  cursor: "col-resize",
  zIndex: 20,
  background: "transparent",
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
  onWidthChange,
}: {
  collapsed: boolean;
  onToggleCollapse: () => void;
  onWidthChange?: (width: number) => void;
}) {
  const nodes = usePipelineStore((s) => s.nodes);
  const edges = usePipelineStore((s) => s.edges);
  const onNodesChange = usePipelineStore((s) => s.onNodesChange);
  const onEdgesChange = usePipelineStore((s) => s.onEdgesChange);
  const onConnect = usePipelineStore((s) => s.onConnect);
  const addNode = usePipelineStore((s) => s.addNode);
  const applyTemplate = usePipelineStore((s) => s.applyTemplate);

  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showTemplateMenu, setShowTemplateMenu] = useState(false);
  const [panelWidth, setPanelWidth] = useState(DEFAULT_WIDTH);
  const dragRef = useRef<{ startX: number; startWidth: number } | null>(null);

  // Resize drag handling
  const handleResizeMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    dragRef.current = { startX: e.clientX, startWidth: panelWidth };

    const handleMouseMove = (ev: MouseEvent) => {
      if (!dragRef.current) return;
      // Panel is on the right: dragging left increases width
      const newWidth = dragRef.current.startWidth - (ev.clientX - dragRef.current.startX);
      const clamped = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, newWidth));
      setPanelWidth(clamped);
      onWidthChange?.(clamped);
    };

    const handleMouseUp = () => {
      dragRef.current = null;
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }, [panelWidth, onWidthChange]);

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
        animated: true,
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

  const handleApplyTemplate = useCallback(
    (templateId: string) => {
      applyTemplate(templateId);
      setShowTemplateMenu(false);
    },
    [applyTemplate],
  );

  const memoizedNodeTypes = useMemo(() => nodeTypes, []);

  const headerExtra = (
    <>
      <button
        onClick={() => {
          setShowTemplateMenu(!showTemplateMenu);
          setShowAddMenu(false);
        }}
        style={templateBtnStyle}
      >
        Templates
      </button>
      {showTemplateMenu && (
        <div style={{ ...dropdownStyle, right: "auto", left: 0 }}>
          {PIPELINE_TEMPLATES.map((template) => (
            <button
              key={template.id}
              onClick={() => handleApplyTemplate(template.id)}
              style={{ ...dropdownItemStyle, padding: "8px 14px" }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.background = "rgba(139,92,246,0.06)";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.background = "none";
              }}
            >
              <div style={{ fontWeight: 500 }}>{template.label}</div>
              <div style={templateItemDescStyle}>{template.description}</div>
            </button>
          ))}
        </div>
      )}
      <button
        onClick={() => {
          setShowAddMenu(!showAddMenu);
          setShowTemplateMenu(false);
        }}
        style={addBtnStyle}
      >
        + Add Node
      </button>
      {showAddMenu && (
        <div style={dropdownStyle}>
          {ADD_NODE_GROUPS.map((group) => (
            <div key={group.category}>
              <div style={groupHeaderStyle}>
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: NODE_CATEGORY_COLORS[group.category],
                    display: "inline-block",
                    flexShrink: 0,
                  }}
                />
                {group.label}
              </div>
              {group.types.map((type) => (
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
          ))}
        </div>
      )}
    </>
  );

  const resizeHandle = (
    <div
      style={resizeHandleStyle}
      onMouseDown={handleResizeMouseDown}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.background = "rgba(59,130,246,0.15)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.background = "transparent";
      }}
    />
  );

  return (
    <CollapsiblePanel
      title="Pipeline"
      collapsed={collapsed}
      onToggleCollapse={onToggleCollapse}
      width={panelWidth}
      headerExtra={headerExtra}
      containerExtra={resizeHandle}
    >
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
          fitViewOptions={{ padding: 0.1, maxZoom: 1.95 }}
          minZoom={0.3}
          maxZoom={2}
          defaultEdgeOptions={{
            type: "bezier",
            animated: true,
            style: { stroke: "#94a3b8", strokeWidth: 3 },
          }}
          proOptions={{ hideAttribution: true }}
        >
          <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="#e2e8f0" />
          <MiniMap
            style={{
              background: "rgba(255,255,255,0.8)",
              border: "1px solid #e2e8f0",
              borderRadius: 6,
              width: 100,
              height: 70,
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
    </CollapsiblePanel>
  );
}

export function PipelineEditor({
  collapsed,
  onToggleCollapse,
  onWidthChange,
}: {
  collapsed: boolean;
  onToggleCollapse: () => void;
  onWidthChange?: (width: number) => void;
}) {
  return (
    <ReactFlowProvider>
      <PipelineEditorInner
        collapsed={collapsed}
        onToggleCollapse={onToggleCollapse}
        onWidthChange={onWidthChange}
      />
    </ReactFlowProvider>
  );
}
