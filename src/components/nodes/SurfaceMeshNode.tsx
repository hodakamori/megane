/**
 * Surface Mesh node.
 * Takes particle (+ optional cell) input, produces mesh output.
 * Generates an isosurface mesh around atom positions using Marching Cubes.
 */

import type { NodeProps, Node } from "@xyflow/react";
import type { PipelineNodeData } from "../../pipeline/execute";
import type { SurfaceMeshParams } from "../../pipeline/types";
import { usePipelineStore } from "../../pipeline/store";
import { NodeShell } from "./NodeShell";

const labelStyle: React.CSSProperties = {
  fontSize: 17,
  fontWeight: 500,
  color: "#64748b",
  marginBottom: 3,
};

const sliderStyle: React.CSSProperties = {
  width: "100%",
  height: 7,
  cursor: "pointer",
  appearance: "none",
  WebkitAppearance: "none",
  borderRadius: 3,
  outline: "none",
};

const valueStyle: React.CSSProperties = {
  fontSize: 19,
  fontWeight: 500,
  color: "#3b82f6",
  minWidth: 50,
  textAlign: "right",
};

const toggleRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  fontSize: 19,
  color: "#475569",
  padding: "3px 0",
};

const toggleStyle: React.CSSProperties = {
  cursor: "pointer",
  accentColor: "#3b82f6",
};

export function SurfaceMeshNode({ id, data }: NodeProps<Node<PipelineNodeData>>) {
  const updateNodeParams = usePipelineStore((s) => s.updateNodeParams);
  const params = data.params as SurfaceMeshParams;

  return (
    <NodeShell id={id} nodeType="surface_mesh" enabled={data.enabled}>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <div>
          <div style={labelStyle}>Probe radius</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              className="nodrag"
              type="range"
              min={1.0}
              max={8.0}
              step={0.1}
              value={params.probeRadius}
              onChange={(e) => updateNodeParams(id, { probeRadius: parseFloat(e.target.value) })}
              style={sliderStyle}
            />
            <span style={valueStyle}>{params.probeRadius.toFixed(1)}</span>
          </div>
        </div>
        <div>
          <div style={labelStyle}>Smoothing</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              className="nodrag"
              type="range"
              min={0}
              max={10}
              step={1}
              value={params.smoothingLevel}
              onChange={(e) => updateNodeParams(id, { smoothingLevel: parseInt(e.target.value) })}
              style={sliderStyle}
            />
            <span style={valueStyle}>{params.smoothingLevel}</span>
          </div>
        </div>
        <div>
          <div style={labelStyle}>Grid resolution</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              className="nodrag"
              type="range"
              min={0.5}
              max={4.0}
              step={0.1}
              value={params.gridResolution}
              onChange={(e) => updateNodeParams(id, { gridResolution: parseFloat(e.target.value) })}
              style={sliderStyle}
            />
            <span style={valueStyle}>{params.gridResolution.toFixed(1)}</span>
          </div>
        </div>
        <div>
          <div style={labelStyle}>Opacity</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              className="nodrag"
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={params.opacity}
              onChange={(e) => updateNodeParams(id, { opacity: parseFloat(e.target.value) })}
              style={sliderStyle}
            />
            <span style={valueStyle}>{`${Math.round(params.opacity * 100)}%`}</span>
          </div>
        </div>
        <div>
          <div style={labelStyle}>Color</div>
          <input
            type="color"
            value={params.color}
            onChange={(e) => updateNodeParams(id, { color: e.target.value })}
            style={{
              width: "100%",
              height: 28,
              cursor: "pointer",
              border: "1px solid #e2e8f0",
              borderRadius: 4,
            }}
          />
        </div>
        <label style={toggleRowStyle}>
          Show edges
          <input
            type="checkbox"
            checked={params.showEdges}
            onChange={(e) => updateNodeParams(id, { showEdges: e.target.checked })}
            style={toggleStyle}
          />
        </label>
        {params.showEdges && (
          <>
            <div>
              <div style={labelStyle}>Edge color</div>
              <input
                type="color"
                value={params.edgeColor}
                onChange={(e) => updateNodeParams(id, { edgeColor: e.target.value })}
                style={{
                  width: "100%",
                  height: 28,
                  cursor: "pointer",
                  border: "1px solid #e2e8f0",
                  borderRadius: 4,
                }}
              />
            </div>
            <div>
              <div style={labelStyle}>Edge width</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input
                  className="nodrag"
                  type="range"
                  min={1}
                  max={10}
                  step={0.5}
                  value={params.edgeWidth}
                  onChange={(e) => updateNodeParams(id, { edgeWidth: parseFloat(e.target.value) })}
                  style={sliderStyle}
                />
                <span style={valueStyle}>{params.edgeWidth.toFixed(1)}</span>
              </div>
            </div>
          </>
        )}
      </div>
    </NodeShell>
  );
}
