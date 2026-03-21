/**
 * JavaScript/TypeScript pipeline builder for megane molecular viewer.
 *
 * Mirrors the Python Pipeline API: add nodes, wire ports explicitly, then
 * serialize to the SerializedPipeline v3 JSON format understood by the
 * TypeScript pipeline engine.
 *
 * Example:
 *
 *   import { Pipeline, LoadStructure, Filter, Modify, AddBonds, Viewport } from '@/pipeline/builder'
 *
 *   const pipe = new Pipeline()
 *   const s = pipe.addNode(new LoadStructure('protein.pdb'))
 *   const f = pipe.addNode(new Filter({ query: "element == 'C'" }))
 *   const m = pipe.addNode(new Modify({ scale: 1.3 }))
 *   const b = pipe.addNode(new AddBonds())
 *   const v = pipe.addNode(new Viewport())
 *
 *   pipe.addEdge(s.out.particle, f.inp.particle)
 *   pipe.addEdge(f.out.particle, m.inp.particle)
 *   pipe.addEdge(s.out.particle, b.inp.particle)
 *   pipe.addEdge(m.out.particle, v.inp.particle)
 *   pipe.addEdge(b.out.bond,     v.inp.bond)
 *
 *   const json = pipe.toJSON()
 */

import type { SerializedPipeline } from "./types";

// ─── Port Objects ────────────────────────────────────────────────────

/** A single typed I/O port on a pipeline node. */
export class NodePort {
  constructor(
    public readonly node: PipelineNode,
    public readonly handle: string,
  ) {}
}

/**
 * Attribute-access namespace that returns NodePort instances.
 *
 * Example: node.out.particle → NodePort(node, 'particle')
 * Accessing an undefined port throws an Error with available port names.
 */
export interface PortAccessor {
  [portName: string]: NodePort;
}

const hasOwn = (obj: Record<string, string>, key: string): boolean =>
  Object.prototype.hasOwnProperty.call(obj, key);

function makePortNamespace(node: PipelineNode, portMap: Record<string, string>): PortAccessor {
  return new Proxy({} as PortAccessor, {
    get(_, prop: string) {
      if (typeof prop !== "string" || prop.startsWith("__") || prop === "then") return undefined;
      if (hasOwn(portMap, prop)) return new NodePort(node, portMap[prop]);
      const available = Object.keys(portMap).sort().join(", ") || "(none)";
      throw new Error(`No port "${prop}" on "${node.nodeType}" node. Available: ${available}`);
    },
    has(_, prop: string) {
      return typeof prop === "string" && hasOwn(portMap, prop);
    },
    ownKeys() {
      return Object.keys(portMap);
    },
    getOwnPropertyDescriptor(_, prop: string) {
      if (typeof prop === "string" && hasOwn(portMap, prop)) {
        return { configurable: true, enumerable: true };
      }
      return undefined;
    },
  });
}

// ─── Node Base Class ─────────────────────────────────────────────────

export abstract class PipelineNode {
  abstract readonly nodeType: string;
  protected abstract readonly _outPorts: Record<string, string>;
  protected abstract readonly _inpPorts: Record<string, string>;

  _id: string | null = null;

  /** Output port namespace. Access ports via node.out.portName */
  get out(): PortAccessor {
    return makePortNamespace(this, this._outPorts);
  }

  /** Input port namespace. Access ports via node.inp.portName */
  get inp(): PortAccessor {
    return makePortNamespace(this, this._inpPorts);
  }

  /** Serialize node parameters to the SerializedPipeline v3 node dict. */
  abstract _toSerializedParams(): Record<string, unknown>;
}

// ─── Node Classes ────────────────────────────────────────────────────

/**
 * Load a molecular structure file.
 *
 * Supported formats: PDB, GRO, XYZ, MOL, LAMMPS data.
 *
 * Ports:
 *   out.particle — atom data
 *   out.traj     — trajectory channel
 *   out.cell     — simulation cell
 */
export class LoadStructure extends PipelineNode {
  readonly nodeType = "load_structure";
  protected readonly _outPorts = { particle: "particle", traj: "trajectory", cell: "cell" };
  protected readonly _inpPorts: Record<string, string> = {};

  constructor(public path: string) {
    super();
  }

  _toSerializedParams() {
    return {
      type: this.nodeType,
      fileName: this.path,
      hasTrajectory: false,
      hasCell: false,
    };
  }
}

/**
 * Load an external trajectory file (XTC or ASE .traj).
 *
 * Requires connection from a LoadStructure node.
 *
 * Ports:
 *   inp.particle — atom topology source
 *   out.traj     — trajectory frames
 */
export class LoadTrajectory extends PipelineNode {
  readonly nodeType = "load_trajectory";
  protected readonly _outPorts = { traj: "trajectory" };
  protected readonly _inpPorts = { particle: "particle" };

  public xtc: string | null;
  public traj: string | null;

  constructor({ xtc = null, traj = null }: { xtc?: string | null; traj?: string | null } = {}) {
    super();
    this.xtc = xtc;
    this.traj = traj;
  }

  _toSerializedParams() {
    return {
      type: this.nodeType,
      fileName: this.xtc ?? this.traj,
    };
  }
}

/**
 * Streaming source node for WebSocket-based real-time data delivery.
 *
 * Ports:
 *   out.particle — atom data
 *   out.bond     — bond data
 *   out.traj     — trajectory channel
 *   out.cell     — simulation cell
 */
export class Streaming extends PipelineNode {
  readonly nodeType = "streaming";
  protected readonly _outPorts = {
    particle: "particle",
    bond: "bond",
    traj: "trajectory",
    cell: "cell",
  };
  protected readonly _inpPorts: Record<string, string> = {};

  _toSerializedParams() {
    return { type: this.nodeType, connected: false };
  }
}

/**
 * Load per-atom vector data from a file.
 *
 * Ports:
 *   out.vector — vector field
 */
export class LoadVector extends PipelineNode {
  readonly nodeType = "load_vector";
  protected readonly _outPorts = { vector: "vector" };
  protected readonly _inpPorts: Record<string, string> = {};

  constructor(public path: string) {
    super();
  }

  _toSerializedParams() {
    return { type: this.nodeType, fileName: this.path };
  }
}

/**
 * Filter atoms by a selection query.
 *
 * Query syntax examples:
 *   element == 'C'
 *   element == 'O' and x > 5.0
 *   resname == 'ALA'
 *   index >= 100 and index < 200
 *
 * Ports:
 *   inp.particle — atom data in
 *   out.particle — filtered atom data
 */
export class Filter extends PipelineNode {
  readonly nodeType = "filter";
  protected readonly _outPorts = { particle: "out" };
  protected readonly _inpPorts = { particle: "in" };

  public query: string;
  public bondQuery: string;

  constructor({ query = "all", bondQuery = "" }: { query?: string; bondQuery?: string } = {}) {
    super();
    this.query = query;
    this.bondQuery = bondQuery;
  }

  _toSerializedParams() {
    return { type: this.nodeType, query: this.query, bond_query: this.bondQuery };
  }
}

/**
 * Override per-atom visual properties (scale, opacity).
 *
 * Ports:
 *   inp.particle — atom data in
 *   out.particle — modified atom data
 */
export class Modify extends PipelineNode {
  readonly nodeType = "modify";
  protected readonly _outPorts = { particle: "out" };
  protected readonly _inpPorts = { particle: "in" };

  public scale: number;
  public opacity: number;

  constructor({ scale = 1.0, opacity = 1.0 }: { scale?: number; opacity?: number } = {}) {
    super();
    this.scale = scale;
    this.opacity = opacity;
  }

  _toSerializedParams() {
    return { type: this.nodeType, scale: this.scale, opacity: this.opacity };
  }
}

/**
 * Compute and display bonds.
 *
 * Ports:
 *   inp.particle — atom data
 *   out.bond     — computed bonds
 */
export class AddBonds extends PipelineNode {
  readonly nodeType = "add_bond";
  protected readonly _outPorts = { bond: "bond" };
  protected readonly _inpPorts = { particle: "particle" };

  public source: "distance" | "structure";

  constructor({ source = "distance" }: { source?: "distance" | "structure" } = {}) {
    super();
    this.source = source;
  }

  _toSerializedParams() {
    return { type: this.nodeType, bondSource: this.source };
  }
}

/**
 * Generate text labels at atom positions.
 *
 * Ports:
 *   inp.particle — atom data
 *   out.label    — label data
 */
export class AddLabels extends PipelineNode {
  readonly nodeType = "label_generator";
  protected readonly _outPorts = { label: "label" };
  protected readonly _inpPorts = { particle: "particle" };

  public source: "element" | "resname" | "index";

  constructor({ source = "element" }: { source?: "element" | "resname" | "index" } = {}) {
    super();
    this.source = source;
  }

  _toSerializedParams() {
    return { type: this.nodeType, source: this.source };
  }
}

/**
 * Generate coordination polyhedra mesh.
 *
 * Ports:
 *   inp.particle — atom data
 *   out.mesh     — polyhedra mesh
 */
export class AddPolyhedra extends PipelineNode {
  readonly nodeType = "polyhedron_generator";
  protected readonly _outPorts = { mesh: "mesh" };
  protected readonly _inpPorts = { particle: "particle" };

  public centerElements: number[];
  public ligandElements: number[];
  public maxDistance: number;
  public opacity: number;
  public showEdges: boolean;
  public edgeColor: string;
  public edgeWidth: number;

  constructor({
    centerElements,
    ligandElements = [8],
    maxDistance = 2.5,
    opacity = 0.5,
    showEdges = false,
    edgeColor = "#dddddd",
    edgeWidth = 3.0,
  }: {
    centerElements: number[];
    ligandElements?: number[];
    maxDistance?: number;
    opacity?: number;
    showEdges?: boolean;
    edgeColor?: string;
    edgeWidth?: number;
  }) {
    super();
    this.centerElements = centerElements;
    this.ligandElements = ligandElements;
    this.maxDistance = maxDistance;
    this.opacity = opacity;
    this.showEdges = showEdges;
    this.edgeColor = edgeColor;
    this.edgeWidth = edgeWidth;
  }

  _toSerializedParams() {
    return {
      type: this.nodeType,
      centerElements: this.centerElements,
      ligandElements: this.ligandElements,
      maxDistance: this.maxDistance,
      opacity: this.opacity,
      showEdges: this.showEdges,
      edgeColor: this.edgeColor,
      edgeWidth: this.edgeWidth,
    };
  }
}

/**
 * Configure per-atom vector visualization (e.g. forces, velocities).
 *
 * Ports:
 *   inp.vector — vector data in
 *   out.vector — configured vector data
 */
export class VectorOverlay extends PipelineNode {
  readonly nodeType = "vector_overlay";
  protected readonly _outPorts = { vector: "vector" };
  protected readonly _inpPorts = { vector: "vector" };

  public scale: number;

  constructor({ scale = 1.0 }: { scale?: number } = {}) {
    super();
    this.scale = scale;
  }

  _toSerializedParams() {
    return { type: this.nodeType, scale: this.scale };
  }
}

/**
 * 3D rendering output node. All data to be rendered must be connected here.
 *
 * Ports:
 *   inp.particle — atom data
 *   inp.bond     — bond data
 *   inp.cell     — simulation cell
 *   inp.traj     — trajectory channel
 *   inp.label    — text labels
 *   inp.mesh     — polyhedra mesh
 *   inp.vector   — vector field
 */
export class Viewport extends PipelineNode {
  readonly nodeType = "viewport";
  protected readonly _outPorts: Record<string, string> = {};
  protected readonly _inpPorts = {
    particle: "particle",
    bond: "bond",
    cell: "cell",
    traj: "trajectory",
    label: "label",
    mesh: "mesh",
    vector: "vector",
  };

  public perspective: boolean;
  public cellAxesVisible: boolean;
  public pivotMarkerVisible: boolean;

  constructor({
    perspective = false,
    cellAxesVisible = true,
    pivotMarkerVisible = true,
  }: {
    perspective?: boolean;
    cellAxesVisible?: boolean;
    pivotMarkerVisible?: boolean;
  } = {}) {
    super();
    this.perspective = perspective;
    this.cellAxesVisible = cellAxesVisible;
    this.pivotMarkerVisible = pivotMarkerVisible;
  }

  _toSerializedParams() {
    return {
      type: this.nodeType,
      perspective: this.perspective,
      cellAxesVisible: this.cellAxesVisible,
      pivotMarkerVisible: this.pivotMarkerVisible,
    };
  }
}

// ─── Pipeline Builder ─────────────────────────────────────────────────

type SerializedNode = SerializedPipeline["nodes"][number];
type SerializedEdge = SerializedPipeline["edges"][number];

/**
 * Pipeline graph builder.
 *
 * Build a DAG of processing nodes and serialize to the SerializedPipeline
 * v3 JSON format understood by the TypeScript pipeline engine.
 *
 * A Viewport node must be explicitly added and connected for data to be rendered.
 *
 * Example:
 *
 *   const pipe = new Pipeline()
 *   const s = pipe.addNode(new LoadStructure('protein.pdb'))
 *   const v = pipe.addNode(new Viewport())
 *   pipe.addEdge(s.out.particle, v.inp.particle)
 *   const json = pipe.toJSON()
 */
export class Pipeline {
  private _nodes: Map<string, SerializedNode> = new Map();
  private _edges: SerializedEdge[] = [];
  private _counter = 0;

  /**
   * Add a node to the pipeline.
   *
   * Returns the same node instance so its ports can be used in addEdge():
   *
   *   const s = pipe.addNode(new LoadStructure('protein.pdb'))
   *   pipe.addEdge(s.out.particle, ...)
   */
  addNode<T extends PipelineNode>(node: T): T {
    if (node._id !== null && this._nodes.has(node._id)) {
      throw new Error(
        `Node "${node._id}" has already been added to this pipeline. ` +
          "Create a new node instance instead of reusing the same one.",
      );
    }
    this._counter++;
    node._id = `${node.nodeType}-${this._counter}`;
    const params = node._toSerializedParams();
    this._nodes.set(node._id, {
      ...(params as PipelineNode["_toSerializedParams"] extends () => infer R ? R : never),
      id: node._id,
      position: { x: 0, y: 0 },
    } as SerializedNode);
    return node;
  }

  /**
   * Connect a source port to a target port.
   *
   * Both ports must belong to nodes already added to this pipeline:
   *
   *   pipe.addEdge(s.out.particle, f.inp.particle)
   *   pipe.addEdge(f.out.particle, v.inp.particle)
   */
  addEdge(source: NodePort, target: NodePort): void {
    if (!(source instanceof NodePort) || !(target instanceof NodePort)) {
      throw new TypeError(
        "addEdge() requires NodePort arguments. " +
          "Use node.out.<name> and node.inp.<name>, " +
          "e.g. pipe.addEdge(s.out.particle, f.inp.particle).",
      );
    }
    if (source.node._id === null || !this._nodes.has(source.node._id)) {
      throw new Error("Source node must be added to this pipeline before connecting.");
    }
    if (target.node._id === null || !this._nodes.has(target.node._id)) {
      throw new Error("Target node must be added to this pipeline before connecting.");
    }
    this._edges.push({
      source: source.node._id,
      target: target.node._id,
      sourceHandle: source.handle,
      targetHandle: target.handle,
    });
  }

  /**
   * Serialize to SerializedPipeline v3 format as a plain object.
   */
  toObject(): SerializedPipeline {
    return {
      version: 3,
      nodes: Array.from(this._nodes.values()),
      edges: [...this._edges],
    };
  }

  /**
   * Serialize to a JSON string (SerializedPipeline v3).
   */
  toJSON(indent = 2): string {
    return JSON.stringify(this.toObject(), null, indent);
  }
}
