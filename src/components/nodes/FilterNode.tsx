/**
 * Filter node for the pipeline editor.
 * Accepts particle or bond input; filters based on query.
 * When connected to particle: uses the selection query language.
 * When connected to bond: future bond-order filtering.
 */

import { useState, useCallback, useEffect } from "react";
import type { NodeProps, Node } from "@xyflow/react";
import type { PipelineNodeData } from "../../pipeline/execute";
import type { FilterParams } from "../../pipeline/types";
import { usePipelineStore } from "../../pipeline/store";
import { validateQuery } from "../../pipeline/selection";
import { NodeShell } from "./NodeShell";

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "7px 10px",
  fontSize: 19,
  fontFamily: "monospace",
  border: "1px solid #e2e8f0",
  borderRadius: 7,
  outline: "none",
  background: "#f8fafc",
  color: "#1e293b",
  boxSizing: "border-box",
};

const inputErrorStyle: React.CSSProperties = {
  ...inputStyle,
  borderColor: "#ef4444",
  background: "#fef2f2",
};

const errorStyle: React.CSSProperties = {
  fontSize: 17,
  color: "#ef4444",
  marginTop: 7,
  lineHeight: 1.3,
};

const hintStyle: React.CSSProperties = {
  fontSize: 15,
  color: "#94a3b8",
  marginTop: 7,
  lineHeight: 1.3,
};

export function FilterNode({ id, data }: NodeProps<Node<PipelineNodeData>>) {
  const updateNodeParams = usePipelineStore((s) => s.updateNodeParams);
  const params = data.params as FilterParams;
  const [localQuery, setLocalQuery] = useState(params.query);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLocalQuery(params.query);
  }, [params.query]);

  const handleCommit = useCallback(() => {
    const result = validateQuery(localQuery);
    setError(result.valid ? null : result.error ?? "Invalid query");
    updateNodeParams(id, { query: localQuery });
  }, [id, localQuery, updateNodeParams]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        handleCommit();
      }
    },
    [handleCommit],
  );

  return (
    <NodeShell id={id} nodeType="filter" enabled={data.enabled}>
      <input
        value={localQuery}
        onChange={(e) => setLocalQuery(e.target.value)}
        onBlur={handleCommit}
        onKeyDown={handleKeyDown}
        placeholder='element == "C"'
        style={error ? inputErrorStyle : inputStyle}
      />
      {error && <div style={errorStyle}>{error}</div>}
      {!error && !localQuery && (
        <div style={hintStyle}>
          element, index, x, y, z, resname, mass
        </div>
      )}
    </NodeShell>
  );
}
