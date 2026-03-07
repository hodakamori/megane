/**
 * Reusable slider-based node component.
 * Used for atom scale, atom opacity, bond scale, bond opacity, etc.
 */

import type { NodeProps, Node } from "@xyflow/react";
import type { PipelineNodeData } from "../../pipeline/execute";
import type { PipelineNodeType } from "../../pipeline/types";
import { usePipelineStore } from "../../pipeline/store";
import { NodeShell } from "./NodeShell";

const sliderStyle: React.CSSProperties = {
  width: "100%",
  height: 4,
  cursor: "pointer",
  appearance: "none",
  WebkitAppearance: "none",
  borderRadius: 2,
  outline: "none",
};

const valueStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 500,
  color: "#3b82f6",
  minWidth: 36,
  textAlign: "right",
};

interface SliderNodeConfig {
  nodeType: PipelineNodeType;
  paramKey: string;
  min: number;
  max: number;
  step: number;
  format: (value: number) => string;
}

export function createSliderNode(config: SliderNodeConfig) {
  return function SliderNodeComponent({ id, data }: NodeProps<Node<PipelineNodeData>>) {
    const updateNodeParams = usePipelineStore((s) => s.updateNodeParams);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const value = (data.params as any)[config.paramKey] as number;

    return (
      <NodeShell id={id} nodeType={config.nodeType} enabled={data.enabled}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input
            type="range"
            min={config.min}
            max={config.max}
            step={config.step}
            value={value}
            onChange={(e) =>
              updateNodeParams(id, { [config.paramKey]: parseFloat(e.target.value) })
            }
            style={sliderStyle}
          />
          <span style={valueStyle}>{config.format(value)}</span>
        </div>
      </NodeShell>
    );
  };
}

export const SetAtomScaleNode = createSliderNode({
  nodeType: "set_atom_scale",
  paramKey: "scale",
  min: 0.1,
  max: 2.0,
  step: 0.01,
  format: (v) => v.toFixed(2),
});

export const SetAtomOpacityNode = createSliderNode({
  nodeType: "set_atom_opacity",
  paramKey: "opacity",
  min: 0,
  max: 1,
  step: 0.01,
  format: (v) => `${Math.round(v * 100)}%`,
});

export const SetBondScaleNode = createSliderNode({
  nodeType: "set_bond_scale",
  paramKey: "scale",
  min: 0.1,
  max: 3.0,
  step: 0.01,
  format: (v) => v.toFixed(2),
});

export const SetBondOpacityNode = createSliderNode({
  nodeType: "set_bond_opacity",
  paramKey: "opacity",
  min: 0,
  max: 1,
  step: 0.01,
  format: (v) => `${Math.round(v * 100)}%`,
});
