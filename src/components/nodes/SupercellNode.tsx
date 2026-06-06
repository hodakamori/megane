/**
 * Supercell node — replicate the unit cell across an na×nb×nc grid and/or apply
 * the crystallographic symmetry operations to fill each cell (VESTA-style
 * packing for molecular crystals). Particle in → particle out.
 *
 * Place this early in the stack (right after Load Structure): it rebuilds the
 * particle set, so per-atom overrides from upstream nodes are dropped.
 */

import type { NodeProps, Node } from "@xyflow/react";
import type { PipelineNodeData } from "../../pipeline/execute";
import type { SupercellParams } from "../../pipeline/types";
import { usePipelineStore } from "../../pipeline/store";
import { NodeShell } from "./NodeShell";

const labelStyle: React.CSSProperties = {
  fontSize: 17,
  fontWeight: 500,
  color: "#64748b",
  marginBottom: 3,
};

const numberInputStyle: React.CSSProperties = {
  width: "100%",
  fontSize: 18,
  padding: "4px 6px",
  borderRadius: 4,
  border: "1px solid #cbd5e1",
  textAlign: "center",
};

const axisDefs: { key: "na" | "nb" | "nc"; label: string; testid: string }[] = [
  { key: "na", label: "a", testid: "supercell-node-na" },
  { key: "nb", label: "b", testid: "supercell-node-nb" },
  { key: "nc", label: "c", testid: "supercell-node-nc" },
];

export function SupercellNode({ id, data }: NodeProps<Node<PipelineNodeData>>) {
  const updateNodeParams = usePipelineStore((s) => s.updateNodeParams);
  const params = data.params as SupercellParams;

  return (
    <NodeShell id={id} nodeType="supercell" enabled={data.enabled}>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div>
          <div style={labelStyle}>Repeat (a × b × c)</div>
          <div style={{ display: "flex", gap: 6 }}>
            {axisDefs.map(({ key, label, testid }) => (
              <div key={key} style={{ flex: 1 }}>
                <div style={{ ...labelStyle, textAlign: "center", marginBottom: 1 }}>{label}</div>
                <input
                  data-testid={testid}
                  className="nodrag"
                  type="number"
                  min={1}
                  max={20}
                  step={1}
                  value={params[key]}
                  onChange={(e) =>
                    updateNodeParams(id, {
                      [key]: Math.max(1, Math.floor(Number(e.target.value) || 1)),
                    })
                  }
                  style={numberInputStyle}
                />
              </div>
            ))}
          </div>
        </div>
        <label
          style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 17 }}
        >
          <input
            data-testid="supercell-node-symmetry"
            className="nodrag"
            type="checkbox"
            checked={params.applySymmetry}
            onChange={(e) => updateNodeParams(id, { applySymmetry: e.target.checked })}
          />
          <span style={{ color: "#64748b", fontWeight: 500 }}>Apply symmetry ops</span>
        </label>
      </div>
    </NodeShell>
  );
}
