/**
 * Add Bond node.
 * Takes particle input and outputs bond data.
 * Supports bond sources: structure (from file), VDW (distance-based), topology file (.top).
 */

import type { NodeProps, Node } from "@xyflow/react";
import type { PipelineNodeData } from "../../pipeline/execute";
import type { AddBondParams } from "../../pipeline/types";
import { usePipelineStore } from "../../pipeline/store";
import { NodeShell } from "./NodeShell";
import { TabSelector, smallBtnStyle, fileNameStyle } from "../ui";
import { parseTopBonds } from "../../parsers/structure";
import type { BondSource } from "../../types";
import { useRef, useCallback } from "react";

const sectionLabelStyle: React.CSSProperties = {
  fontSize: 17,
  fontWeight: 600,
  color: "#94a3b8",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  marginBottom: 7,
  marginTop: 0,
};

const TOPOLOGY_ACCEPT = ".top";
const TOPOLOGY_EXTS = [".top"];

export function AddBondNode({ id, data }: NodeProps<Node<PipelineNodeData>>) {
  const updateNodeParams = usePipelineStore((s) => s.updateNodeParams);
  const params = data.params as AddBondParams;
  const inputRef = useRef<HTMLInputElement>(null);

  const handleTopologyFile = useCallback(
    async (file: File) => {
      const lower = file.name.toLowerCase();
      if (!TOPOLOGY_EXTS.some((ext) => lower.endsWith(ext))) return;
      const text = await file.text();
      // Parse with max n_atoms; executor filters to actual atom count
      const bondIndices = await parseTopBonds(text, 0xffffffff);
      updateNodeParams(id, {
        bondSource: "file" as BondSource,
        bondFileName: file.name,
        bondFileData: bondIndices,
      });
    },
    [id, updateNodeParams],
  );

  return (
    <NodeShell id={id} nodeType="add_bond" enabled={data.enabled}>
      <div style={sectionLabelStyle}>Source</div>
      <TabSelector<BondSource>
        options={[
          { value: "structure", label: "File" },
          { value: "distance", label: "VDW" },
          { value: "file", label: "Topology" },
        ]}
        value={params.bondSource}
        onChange={(v) => updateNodeParams(id, { bondSource: v })}
      />
      {params.bondSource === "file" && (
        <div style={{ marginTop: 4 }}>
          {params.bondFileName ? (
            <div style={{ ...fileNameStyle, fontSize: 18 }}>{params.bondFileName}</div>
          ) : (
            <div style={{ fontSize: 18, color: "#94a3b8", fontStyle: "italic" }}>
              No topology loaded
            </div>
          )}
          <button
            onClick={() => inputRef.current?.click()}
            style={{ ...smallBtnStyle, marginTop: 6, width: "100%" }}
          >
            Load .top...
          </button>
          <input
            ref={inputRef}
            type="file"
            accept={TOPOLOGY_ACCEPT}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleTopologyFile(file);
              e.target.value = "";
            }}
            style={{ display: "none" }}
          />
        </div>
      )}
    </NodeShell>
  );
}
