/**
 * Reusable slider-based node components.
 * createSliderNode: single slider (e.g. vector scale)
 * createDualSliderNode: two sliders for scale + opacity
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

const labelStyle: React.CSSProperties = {
  fontSize: 10,
  fontWeight: 500,
  color: "#64748b",
  marginBottom: 2,
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

interface DualSliderConfig {
  nodeType: PipelineNodeType;
  scaleMin: number;
  scaleMax: number;
  scaleStep: number;
  scaleFormat: (value: number) => string;
}

export function createDualSliderNode(config: DualSliderConfig) {
  return function DualSliderNodeComponent({ id, data }: NodeProps<Node<PipelineNodeData>>) {
    const updateNodeParams = usePipelineStore((s) => s.updateNodeParams);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const params = data.params as any;
    const scale = params.scale as number;
    const opacity = params.opacity as number;

    return (
      <NodeShell id={id} nodeType={config.nodeType} enabled={data.enabled}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div>
            <div style={labelStyle}>Scale</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input
                type="range"
                min={config.scaleMin}
                max={config.scaleMax}
                step={config.scaleStep}
                value={scale}
                onChange={(e) =>
                  updateNodeParams(id, { scale: parseFloat(e.target.value) })
                }
                style={sliderStyle}
              />
              <span style={valueStyle}>{config.scaleFormat(scale)}</span>
            </div>
          </div>
          <div>
            <div style={labelStyle}>Opacity</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={opacity}
                onChange={(e) =>
                  updateNodeParams(id, { opacity: parseFloat(e.target.value) })
                }
                style={sliderStyle}
              />
              <span style={valueStyle}>{`${Math.round(opacity * 100)}%`}</span>
            </div>
          </div>
        </div>
      </NodeShell>
    );
  };
}

export const SetAtomNode = createDualSliderNode({
  nodeType: "set_atom",
  scaleMin: 0.1,
  scaleMax: 2.0,
  scaleStep: 0.01,
  scaleFormat: (v) => v.toFixed(2),
});

export const SetBondNode = createDualSliderNode({
  nodeType: "set_bond",
  scaleMin: 0.1,
  scaleMax: 3.0,
  scaleStep: 0.01,
  scaleFormat: (v) => v.toFixed(2),
});
