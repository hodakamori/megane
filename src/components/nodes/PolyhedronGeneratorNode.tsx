/**
 * Polyhedron Generator node (VESTA-style).
 * Takes particle input, produces mesh output (coordination polyhedra).
 *
 * Defaults to creating polyhedra for every (metal/metalloid center, anion-former
 * ligand) pair detected in the upstream structure. The UI shows a checkbox per
 * detected element; unchecking adds the Z to `excludedCenters` / `excludedLigands`,
 * mirroring VESTA's behaviour. The user also adjusts a single covalent-radius
 * tolerance multiplier; per-pair cutoffs are computed from Cordero radii.
 */

import { useCallback, useMemo } from "react";
import type { NodeProps, Node } from "@xyflow/react";
import type { PipelineNodeData } from "../../pipeline/execute";
import type { PolyhedronGeneratorParams } from "../../pipeline/types";
import { usePipelineStore } from "../../pipeline/store";
import { getElementsPresentInUpstream } from "../../pipeline/upstream";
import {
  ELEMENT_SYMBOLS,
  isMetalLike,
  isDefaultLigand,
} from "../../constants";
import { NodeShell } from "./NodeShell";

const labelStyle: React.CSSProperties = {
  fontSize: 17,
  fontWeight: 500,
  color: "#64748b",
  marginBottom: 3,
};

const checkboxRowStyle: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "4px 12px",
  marginBottom: 10,
};

const checkboxLabelStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  fontSize: 17,
  fontWeight: 500,
  color: "#475569",
  cursor: "pointer",
  userSelect: "none",
};

const placeholderStyle: React.CSSProperties = {
  fontSize: 16,
  color: "#94a3b8",
  fontStyle: "italic",
  marginBottom: 10,
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

function ElementCheckboxRow({
  candidates,
  excluded,
  onToggle,
  emptyMessage,
}: {
  candidates: number[];
  excluded: number[];
  onToggle: (z: number) => void;
  emptyMessage: string;
}) {
  if (candidates.length === 0) {
    return <div style={placeholderStyle}>{emptyMessage}</div>;
  }
  const excludedSet = new Set(excluded);
  return (
    <div style={checkboxRowStyle}>
      {candidates.map((z) => {
        const checked = !excludedSet.has(z);
        const sym = ELEMENT_SYMBOLS[z] ?? `#${z}`;
        return (
          <label key={z} style={checkboxLabelStyle}>
            <input
              type="checkbox"
              checked={checked}
              onChange={() => onToggle(z)}
              style={toggleStyle}
              aria-label={sym}
            />
            <span style={{ color: checked ? "#3b82f6" : "#94a3b8" }}>{sym}</span>
          </label>
        );
      })}
    </div>
  );
}

export function PolyhedronGeneratorNode({ id, data }: NodeProps<Node<PipelineNodeData>>) {
  const updateNodeParams = usePipelineStore((s) => s.updateNodeParams);
  const nodes = usePipelineStore((s) => s.nodes);
  const edges = usePipelineStore((s) => s.edges);
  const nodeSnapshots = usePipelineStore((s) => s.nodeSnapshots);
  const params = data.params as PolyhedronGeneratorParams;

  const present = useMemo(
    () => getElementsPresentInUpstream(id, nodes, edges, nodeSnapshots),
    [id, nodes, edges, nodeSnapshots],
  );

  const { centerCandidates, ligandCandidates } = useMemo(() => {
    if (present == null) return { centerCandidates: [], ligandCandidates: [] };
    const centers: number[] = [];
    const ligands: number[] = [];
    for (const z of present) {
      if (isMetalLike(z)) centers.push(z);
      if (isDefaultLigand(z)) ligands.push(z);
    }
    centers.sort((a, b) => a - b);
    ligands.sort((a, b) => a - b);
    return { centerCandidates: centers, ligandCandidates: ligands };
  }, [present]);

  const toggleCenter = useCallback(
    (z: number) => {
      const set = new Set(params.excludedCenters);
      if (set.has(z)) set.delete(z);
      else set.add(z);
      updateNodeParams(id, { excludedCenters: [...set].sort((a, b) => a - b) });
    },
    [params.excludedCenters, updateNodeParams, id],
  );

  const toggleLigand = useCallback(
    (z: number) => {
      const set = new Set(params.excludedLigands);
      if (set.has(z)) set.delete(z);
      else set.add(z);
      updateNodeParams(id, { excludedLigands: [...set].sort((a, b) => a - b) });
    },
    [params.excludedLigands, updateNodeParams, id],
  );

  const noUpstream = present == null;

  return (
    <NodeShell id={id} nodeType="polyhedron_generator" enabled={data.enabled}>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <div>
          <div style={labelStyle}>Centers</div>
          {noUpstream ? (
            <div style={placeholderStyle}>Connect a structure to detect elements</div>
          ) : (
            <ElementCheckboxRow
              candidates={centerCandidates}
              excluded={params.excludedCenters}
              onToggle={toggleCenter}
              emptyMessage="No metal centers detected"
            />
          )}
        </div>
        <div>
          <div style={labelStyle}>Ligands</div>
          {noUpstream ? (
            <div style={placeholderStyle}>Connect a structure to detect elements</div>
          ) : (
            <ElementCheckboxRow
              candidates={ligandCandidates}
              excluded={params.excludedLigands}
              onToggle={toggleLigand}
              emptyMessage="No anion-former ligands detected"
            />
          )}
        </div>
        <div>
          <div style={labelStyle}>Cutoff tolerance</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              className="nodrag"
              type="range"
              min={0.8}
              max={1.6}
              step={0.01}
              value={params.cutoffTolerance}
              onChange={(e) =>
                updateNodeParams(id, { cutoffTolerance: parseFloat(e.target.value) })
              }
              style={sliderStyle}
              aria-label="Cutoff tolerance"
            />
            <span style={valueStyle}>{params.cutoffTolerance.toFixed(2)}</span>
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
              aria-label="Opacity"
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
