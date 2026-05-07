/**
 * RDF (Radial Distribution Function) analysis pipeline node.
 * Computes g(r) from particle positions, with optional trajectory averaging.
 */

import type { NodeProps, Node } from "@xyflow/react";
import type { PipelineNodeData } from "../../pipeline/execute";
import type { RdfParams } from "../../pipeline/types";
import { usePipelineStore } from "../../pipeline/store";
import { NodeShell } from "./NodeShell";

const rowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 8,
  marginBottom: 8,
};

const labelStyle: React.CSSProperties = {
  fontSize: 17,
  fontWeight: 500,
  color: "#64748b",
  flex: 1,
};

const inputStyle: React.CSSProperties = {
  width: 72,
  padding: "3px 6px",
  fontSize: 16,
  border: "1px solid #e2e8f0",
  borderRadius: 6,
  background: "var(--megane-node-bg, #fff)",
  color: "inherit",
  boxSizing: "border-box",
};

const checkboxRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 6,
  marginBottom: 8,
};

const hintStyle: React.CSSProperties = {
  fontSize: 12,
  color: "#94a3b8",
  marginTop: 4,
  lineHeight: 1.4,
};

export function RdfNode({ id, data }: NodeProps<Node<PipelineNodeData>>) {
  const updateNodeParams = usePipelineStore((s) => s.updateNodeParams);
  const params = data.params as RdfParams;

  return (
    <NodeShell id={id} nodeType="rdf" enabled={data.enabled}>
      <div style={rowStyle}>
        <span style={labelStyle}>Element A (Z)</span>
        <input
          type="number"
          className="nodrag"
          data-testid="rdf-element-a"
          value={params.elementA}
          min={0}
          max={118}
          step={1}
          style={inputStyle}
          title="Atomic number of type-A atoms (0 = all)"
          onChange={(e) => {
            const v = parseInt(e.target.value, 10);
            if (!isNaN(v) && v >= 0) updateNodeParams(id, { elementA: v });
          }}
        />
      </div>
      <div style={rowStyle}>
        <span style={labelStyle}>Element B (Z)</span>
        <input
          type="number"
          className="nodrag"
          data-testid="rdf-element-b"
          value={params.elementB}
          min={0}
          max={118}
          step={1}
          style={inputStyle}
          title="Atomic number of type-B atoms (0 = all)"
          onChange={(e) => {
            const v = parseInt(e.target.value, 10);
            if (!isNaN(v) && v >= 0) updateNodeParams(id, { elementB: v });
          }}
        />
      </div>
      <div style={rowStyle}>
        <span style={labelStyle}>Bin width (Å)</span>
        <input
          type="number"
          className="nodrag"
          data-testid="rdf-bin-width"
          value={params.binWidth}
          min={0.01}
          max={1}
          step={0.01}
          style={inputStyle}
          onChange={(e) => {
            const v = parseFloat(e.target.value);
            if (!isNaN(v) && v > 0) updateNodeParams(id, { binWidth: v });
          }}
        />
      </div>
      <div style={rowStyle}>
        <span style={labelStyle}>r-max (Å)</span>
        <input
          type="number"
          className="nodrag"
          data-testid="rdf-rmax"
          value={params.rMax}
          min={1}
          max={50}
          step={0.5}
          style={inputStyle}
          onChange={(e) => {
            const v = parseFloat(e.target.value);
            if (!isNaN(v) && v > 0) updateNodeParams(id, { rMax: v });
          }}
        />
      </div>
      <div style={checkboxRowStyle}>
        <input
          type="checkbox"
          className="nodrag"
          id={`rdf-pbc-${id}`}
          data-testid="rdf-use-pbc"
          checked={params.usePbc}
          onChange={(e) => updateNodeParams(id, { usePbc: e.target.checked })}
        />
        <label htmlFor={`rdf-pbc-${id}`} style={{ fontSize: 17, color: "#64748b" }}>
          Use PBC
        </label>
      </div>
      <p style={hintStyle}>Z=0 → all atoms. Connect Cell for PBC g(r).</p>
    </NodeShell>
  );
}
