/**
 * Pipeline editor panel using xyflow.
 * Typed data-flow pipeline with color-coded handles per data type.
 */

import { useCallback, useMemo, useRef, useState } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
  useReactFlow,
} from "@xyflow/react";
import type { Connection } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { usePipelineStore } from "../pipeline/store";
import { downloadBlob } from "../renderer/RenderCapture";
import type { PipelineNodeType } from "../pipeline/types";
import {
  NODE_TYPE_LABELS,
  canConnect,
  DATA_TYPE_COLORS,
  NODE_PORTS,
  NODE_CATEGORY_COLORS,
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
import { LoadVectorNode } from "./nodes/LoadVectorNode";
import { VectorOverlayNode } from "./nodes/VectorOverlayNode";
import { StreamingNode } from "./nodes/StreamingNode";
import { PipelineChatBox } from "./PipelineChatBox";
import { RenderModal } from "./RenderModal";
import type { MoleculeRenderer } from "../renderer/MoleculeRenderer";

const nodeTypes = {
  load_structure: LoadStructureNode,
  load_trajectory: LoadTrajectoryNode,
  load_vector: LoadVectorNode,
  streaming: StreamingNode,
  add_bond: AddBondNode,
  viewport: ViewportNode,
  filter: FilterNode,
  modify: ModifyNode,
  label_generator: LabelGeneratorNode,
  polyhedron_generator: PolyhedronGeneratorNode,
  vector_overlay: VectorOverlayNode,
};

const ADD_NODE_GROUPS: { category: NodeCategory; label: string; types: PipelineNodeType[] }[] = [
  {
    category: "data_load",
    label: "Data Load",
    types: ["load_structure", "load_trajectory", "load_vector", "streaming"],
  },
  { category: "bond", label: "Bond", types: ["add_bond"] },
  { category: "filter", label: "Filter", types: ["filter"] },
  { category: "modify", label: "Modify", types: ["modify"] },
  {
    category: "overlay",
    label: "Overlay",
    types: ["label_generator", "polyhedron_generator", "vector_overlay"],
  },
];

/* ── Inline SVG Icons (14×14, currentColor) ────────────────────────── */

const IconRender = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const IconLayout = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);

const IconExport = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const IconImport = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

const IconTemplates = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
  </svg>
);

const IconPlus = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

/* Category icons for Add Node dropdown */
const CATEGORY_ICONS: Record<NodeCategory, React.ReactNode> = {
  data_load: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  ),
  bond: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  ),
  filter: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  ),
  modify: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" />
      <line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" />
      <line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" />
      <line x1="1" y1="14" x2="7" y2="14" />
      <line x1="9" y1="8" x2="15" y2="8" />
      <line x1="17" y1="16" x2="23" y2="16" />
    </svg>
  ),
  overlay: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  ),
  viewport: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  ),
};

/* ── Toolbar styles ────────────────────────────────────────────────── */

const MIN_WIDTH = 320;
const MAX_WIDTH = 600;
const DEFAULT_WIDTH = 480;

/** Shared base for icon+text buttons */
const textBtnBase: React.CSSProperties = {
  borderRadius: 6,
  padding: "4px 10px",
  cursor: "pointer",
  fontSize: 11,
  fontWeight: 600,
  display: "flex",
  alignItems: "center",
  gap: 4,
};

/** Shared base for icon-only buttons */
const iconOnlyBtnBase: React.CSSProperties = {
  borderRadius: 6,
  padding: "5px 8px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  lineHeight: 1,
  border: "none",
};

const addBtnStyle: React.CSSProperties = {
  ...textBtnBase,
  background: "rgba(59, 130, 246, 0.08)",
  border: "1px solid rgba(59, 130, 246, 0.25)",
  color: "#3b82f6",
};

const renderBtnStyle: React.CSSProperties = {
  ...textBtnBase,
  background: "rgba(245, 158, 11, 0.08)",
  border: "1px solid rgba(245, 158, 11, 0.25)",
  color: "#f59e0b",
};

const templateBtnStyle: React.CSSProperties = {
  ...textBtnBase,
  background: "rgba(139, 92, 246, 0.08)",
  border: "1px solid rgba(139, 92, 246, 0.25)",
  color: "#8b5cf6",
};

const layoutIconBtnStyle: React.CSSProperties = {
  ...iconOnlyBtnBase,
  background: "rgba(16, 185, 129, 0.08)",
  border: "1px solid rgba(16, 185, 129, 0.25)",
  color: "#10b981",
};

const exportIconBtnStyle: React.CSSProperties = {
  ...iconOnlyBtnBase,
  background: "rgba(6, 182, 212, 0.08)",
  border: "1px solid rgba(6, 182, 212, 0.25)",
  color: "#06b6d4",
};

const importIconBtnStyle: React.CSSProperties = {
  ...iconOnlyBtnBase,
  background: "rgba(99, 102, 241, 0.08)",
  border: "1px solid rgba(99, 102, 241, 0.25)",
  color: "#6366f1",
};

const toolbarSepStyle: React.CSSProperties = {
  width: 1,
  height: 16,
  background: "rgba(148, 163, 184, 0.3)",
  flexShrink: 0,
  margin: "0 2px",
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
  rendererRef,
  totalFrames,
  currentFrame,
  onSeek,
}: {
  collapsed: boolean;
  onToggleCollapse: () => void;
  onWidthChange?: (width: number) => void;
  rendererRef: React.RefObject<MoleculeRenderer | null>;
  totalFrames: number;
  currentFrame: number;
  onSeek: (frame: number) => void;
}) {
  const nodes = usePipelineStore((s) => s.nodes);
  const edges = usePipelineStore((s) => s.edges);
  const onNodesChange = usePipelineStore((s) => s.onNodesChange);
  const onEdgesChange = usePipelineStore((s) => s.onEdgesChange);
  const onConnect = usePipelineStore((s) => s.onConnect);
  const addNode = usePipelineStore((s) => s.addNode);
  const applyTemplate = usePipelineStore((s) => s.applyTemplate);
  const autoLayout = usePipelineStore((s) => s.autoLayout);
  const deserialize = usePipelineStore((s) => s.deserialize);
  const { fitView } = useReactFlow();

  const { screenToFlowPosition } = useReactFlow();
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showTemplateMenu, setShowTemplateMenu] = useState(false);
  const [showRenderModal, setShowRenderModal] = useState(false);
  const [panelWidth, setPanelWidth] = useState(DEFAULT_WIDTH);
  const dragRef = useRef<{ startX: number; startWidth: number } | null>(null);
  const flowContainerRef = useRef<HTMLDivElement | null>(null);
  const importInputRef = useRef<HTMLInputElement | null>(null);

  // Resize drag handling
  const handleResizeMouseDown = useCallback(
    (e: React.MouseEvent) => {
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
    },
    [panelWidth, onWidthChange],
  );

  // Connection validation using typed port matching
  const isValidConnection = useCallback(
    (
      connection:
        | Connection
        | {
            source: string;
            target: string;
            sourceHandle?: string | null;
            targetHandle?: string | null;
          },
    ) => {
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
      // Place the new node at the center of the current viewport
      const container = flowContainerRef.current;
      if (container) {
        const rect = container.getBoundingClientRect();
        const centerPosition = screenToFlowPosition({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        });
        addNode(type, centerPosition);
      } else {
        addNode(type);
      }
      setShowAddMenu(false);
    },
    [addNode, screenToFlowPosition],
  );

  const handleApplyTemplate = useCallback(
    (templateId: string) => {
      applyTemplate(templateId);
      setShowTemplateMenu(false);
    },
    [applyTemplate],
  );

  const handleAutoLayout = useCallback(() => {
    autoLayout();
    window.requestAnimationFrame(() => {
      fitView({ padding: 0.1, maxZoom: 1.95, duration: 300 });
    });
  }, [autoLayout, fitView]);

  const handleExport = useCallback(() => {
    const serialized = usePipelineStore.getState().serialize();
    const blob = new Blob([JSON.stringify(serialized, null, 2)], { type: "application/json" });
    downloadBlob(blob, "pipeline.megane.json");
  }, []);

  const handleImportClick = useCallback(() => {
    importInputRef.current?.click();
  }, []);

  const handleImportFile = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const parsed = JSON.parse(reader.result as string);
          if (parsed.version !== 3) {
            throw new Error("Not a valid megane pipeline JSON (version 3 required)");
          }
          deserialize(parsed);
          window.requestAnimationFrame(() => {
            fitView({ padding: 0.1, maxZoom: 1.95, duration: 300 });
          });
        } catch (err) {
          window.alert("Failed to load pipeline: " + (err as Error).message);
        }
        e.target.value = "";
      };
      reader.onerror = () => {
        window.alert("Failed to read file: " + (reader.error?.message ?? "unknown error"));
        e.target.value = "";
      };
      reader.readAsText(file);
    },
    [deserialize, fitView],
  );

  const memoizedNodeTypes = useMemo(() => nodeTypes, []);

  const headerExtra = (
    <>
      {/* Group 1: Render */}
      <button onClick={() => setShowRenderModal(true)} style={renderBtnStyle} title="Render">
        {IconRender} Render
      </button>

      <div style={toolbarSepStyle} />

      {/* Group 2: Layout & IO (icon-only) */}
      <button onClick={handleAutoLayout} style={layoutIconBtnStyle} title="Auto Layout">
        {IconLayout}
      </button>
      <button onClick={handleExport} style={exportIconBtnStyle} title="Export Pipeline">
        {IconExport}
      </button>
      <button onClick={handleImportClick} style={importIconBtnStyle} title="Import Pipeline">
        {IconImport}
      </button>

      <div style={toolbarSepStyle} />

      {/* Group 3: Templates & Add Node */}
      <button
        onClick={() => {
          setShowTemplateMenu(!showTemplateMenu);
          setShowAddMenu(false);
        }}
        style={templateBtnStyle}
        title="Templates"
      >
        {IconTemplates} Templates
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
        title="Add Node"
      >
        {IconPlus} Add Node
      </button>
      {showAddMenu && (
        <div style={dropdownStyle}>
          {ADD_NODE_GROUPS.map((group) => (
            <div key={group.category}>
              <div style={{ ...groupHeaderStyle, color: NODE_CATEGORY_COLORS[group.category] }}>
                {CATEGORY_ICONS[group.category]}
                <span style={{ color: "#94a3b8" }}>{group.label}</span>
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
      <div ref={flowContainerRef} style={{ flex: 1, position: "relative", minHeight: 0 }}>
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
      <PipelineChatBox
        onPipelineApplied={() => {
          window.requestAnimationFrame(() => {
            fitView({ padding: 0.1, maxZoom: 1.95, duration: 300 });
          });
        }}
      />
      <input
        ref={importInputRef}
        type="file"
        accept=".megane.json,.json,application/json"
        style={{ display: "none" }}
        onChange={handleImportFile}
      />
      <RenderModal
        open={showRenderModal}
        onClose={() => setShowRenderModal(false)}
        rendererRef={rendererRef}
        totalFrames={totalFrames}
        currentFrame={currentFrame}
        onSeek={onSeek}
      />
    </CollapsiblePanel>
  );
}

export function PipelineEditor({
  collapsed,
  onToggleCollapse,
  onWidthChange,
  rendererRef,
  totalFrames = 0,
  currentFrame = 0,
  onSeek,
}: {
  collapsed: boolean;
  onToggleCollapse: () => void;
  onWidthChange?: (width: number) => void;
  rendererRef: React.RefObject<MoleculeRenderer | null>;
  totalFrames?: number;
  currentFrame?: number;
  onSeek?: (frame: number) => void;
}) {
  const noopSeek = useCallback((_f: number) => {}, []);
  return (
    <ReactFlowProvider>
      <PipelineEditorInner
        collapsed={collapsed}
        onToggleCollapse={onToggleCollapse}
        onWidthChange={onWidthChange}
        rendererRef={rendererRef}
        totalFrames={totalFrames}
        currentFrame={currentFrame}
        onSeek={onSeek ?? noopSeek}
      />
    </ReactFlowProvider>
  );
}
