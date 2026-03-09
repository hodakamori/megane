/**
 * Polyhedron Generator node.
 * Takes particle input, produces mesh output (coordination polyhedra).
 * User selects center/ligand elements, max distance, opacity, and edge display.
 */

import { useCallback } from "react";
import type { NodeProps, Node } from "@xyflow/react";
import type { PipelineNodeData } from "../../pipeline/execute";
import type { PolyhedronGeneratorParams } from "../../pipeline/types";
import { usePipelineStore } from "../../pipeline/store";
import { NodeShell } from "./NodeShell";

/** Common center atoms for coordination polyhedra (atomic number → symbol). */
const CENTER_ELEMENTS: { z: number; sym: string }[] = [
  { z: 14, sym: "Si" },
  { z: 13, sym: "Al" },
  { z: 22, sym: "Ti" },
  { z: 26, sym: "Fe" },
  { z: 40, sym: "Zr" },
  { z: 25, sym: "Mn" },
  { z: 27, sym: "Co" },
  { z: 28, sym: "Ni" },
  { z: 24, sym: "Cr" },
  { z: 30, sym: "Zn" },
  { z: 12, sym: "Mg" },
  { z: 20, sym: "Ca" },
];

/** Common ligand atoms (atomic number → symbol). */
const LIGAND_ELEMENTS: { z: number; sym: string }[] = [
  { z: 8, sym: "O" },
  { z: 9, sym: "F" },
  { z: 17, sym: "Cl" },
  { z: 7, sym: "N" },
  { z: 16, sym: "S" },
];

const labelStyle: React.CSSProperties = {
  fontSize: 17,
  fontWeight: 500,
  color: "#64748b",
  marginBottom: 3,
};

const chipContainerStyle: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 5,
  marginBottom: 10,
};

const chipBase: React.CSSProperties = {
  border: "1px solid #e2e8f0",
  borderRadius: 7,
  padding: "3px 10px",
  cursor: "pointer",
  fontSize: 17,
  fontWeight: 500,
  background: "none",
  color: "#94a3b8",
  transition: "all 0.15s",
  lineHeight: "27px",
};

const chipActive: React.CSSProperties = {
  ...chipBase,
  background: "rgba(59, 130, 246, 0.08)",
  borderColor: "rgba(59, 130, 246, 0.25)",
  color: "#3b82f6",
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

function ElementChips({
  elements,
  selected,
  onChange,
}: {
  elements: { z: number; sym: string }[];
  selected: number[];
  onChange: (newSelected: number[]) => void;
}) {
  const selectedSet = new Set(selected);

  const toggle = useCallback(
    (z: number) => {
      const newSet = new Set(selectedSet);
      if (newSet.has(z)) {
        newSet.delete(z);
      } else {
        newSet.add(z);
      }
      onChange([...newSet]);
    },
    [selectedSet, onChange],
  );

  return (
    <div style={chipContainerStyle}>
      {elements.map(({ z, sym }) => (
        <button
          key={z}
          onClick={() => toggle(z)}
          style={selectedSet.has(z) ? chipActive : chipBase}
        >
          {sym}
        </button>
      ))}
    </div>
  );
}

export function PolyhedronGeneratorNode({ id, data }: NodeProps<Node<PipelineNodeData>>) {
  const updateNodeParams = usePipelineStore((s) => s.updateNodeParams);
  const params = data.params as PolyhedronGeneratorParams;

  return (
    <NodeShell id={id} nodeType="polyhedron_generator" enabled={data.enabled}>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <div>
          <div style={labelStyle}>Center</div>
          <ElementChips
            elements={CENTER_ELEMENTS}
            selected={params.centerElements}
            onChange={(v) => updateNodeParams(id, { centerElements: v })}
          />
        </div>
        <div>
          <div style={labelStyle}>Ligand</div>
          <ElementChips
            elements={LIGAND_ELEMENTS}
            selected={params.ligandElements}
            onChange={(v) => updateNodeParams(id, { ligandElements: v })}
          />
        </div>
        <div>
          <div style={labelStyle}>Max distance</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              type="range"
              min={1.0}
              max={5.0}
              step={0.1}
              value={params.maxDistance}
              onChange={(e) =>
                updateNodeParams(id, { maxDistance: parseFloat(e.target.value) })
              }
              style={sliderStyle}
            />
            <span style={valueStyle}>{params.maxDistance.toFixed(1)}</span>
          </div>
        </div>
        <div>
          <div style={labelStyle}>Opacity</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={params.opacity}
              onChange={(e) =>
                updateNodeParams(id, { opacity: parseFloat(e.target.value) })
              }
              style={sliderStyle}
            />
            <span style={valueStyle}>{`${Math.round(params.opacity * 100)}%`}</span>
          </div>
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
                style={{ width: "100%", height: 28, cursor: "pointer", border: "1px solid #e2e8f0", borderRadius: 4 }}
              />
            </div>
            <div>
              <div style={labelStyle}>Edge width</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input
                  type="range"
                  min={1}
                  max={10}
                  step={0.5}
                  value={params.edgeWidth}
                  onChange={(e) =>
                    updateNodeParams(id, { edgeWidth: parseFloat(e.target.value) })
                  }
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
