import { describe, it, expect } from "vitest";
import {
  Pipeline,
  NodePort,
  LoadStructure,
  LoadTrajectory,
  LoadVector,
  Streaming,
  Filter,
  Modify,
  AddBonds,
  AddLabels,
  AddPolyhedra,
  VectorOverlay,
  Viewport,
} from "@/pipeline/builder";

// ─── NodePort ─────────────────────────────────────────────────────────

describe("NodePort", () => {
  it("holds node reference and handle", () => {
    const node = new LoadStructure("test.pdb");
    const port = new NodePort(node, "particle");
    expect(port.node).toBe(node);
    expect(port.handle).toBe("particle");
  });
});

// ─── PortAccessor (Proxy) ─────────────────────────────────────────────

describe("PortAccessor", () => {
  it("returns NodePort for valid output port", () => {
    const node = new LoadStructure("test.pdb");
    node._id = "n1";
    const port = node.out.particle;
    expect(port).toBeInstanceOf(NodePort);
    expect(port.handle).toBe("particle");
    expect(port.node).toBe(node);
  });

  it("maps traj alias to trajectory handle", () => {
    const node = new LoadStructure("test.pdb");
    expect(node.out.traj.handle).toBe("trajectory");
  });

  it("throws for unknown output port with helpful message", () => {
    const node = new LoadStructure("test.pdb");
    expect(() => node.out.nonexistent).toThrow(/No port "nonexistent" on "load_structure"/);
    expect(() => node.out.nonexistent).toThrow(/Available:/);
  });

  it("returns NodePort for valid input port", () => {
    const node = new Filter({ query: "all" });
    const port = node.inp.particle;
    expect(port).toBeInstanceOf(NodePort);
    expect(port.handle).toBe("in");
  });

  it("throws for unknown input port", () => {
    const node = new Viewport();
    expect(() => node.inp.nonexistent).toThrow(/No port "nonexistent" on "viewport"/);
  });
});

// ─── Node Classes ─────────────────────────────────────────────────────

describe("LoadStructure", () => {
  it("serializes to v3 format", () => {
    const node = new LoadStructure("protein.pdb");
    node._id = "load_structure-1";
    const params = node._toSerializedParams();
    expect(params).toMatchObject({
      type: "load_structure",
      fileName: "protein.pdb",
      hasTrajectory: false,
      hasCell: false,
    });
  });

  it("exposes out.particle, out.traj, out.cell", () => {
    const node = new LoadStructure("x.pdb");
    expect(node.out.particle.handle).toBe("particle");
    expect(node.out.traj.handle).toBe("trajectory");
    expect(node.out.cell.handle).toBe("cell");
  });

  it("has no input ports", () => {
    const node = new LoadStructure("x.pdb");
    expect(() => node.inp.particle).toThrow(/Available: \(none\)/);
  });
});

describe("LoadTrajectory", () => {
  it("serializes xtc path", () => {
    const node = new LoadTrajectory({ xtc: "traj.xtc" });
    const params = node._toSerializedParams();
    expect(params).toMatchObject({ type: "load_trajectory", fileName: "traj.xtc" });
  });

  it("serializes traj path when xtc is null", () => {
    const node = new LoadTrajectory({ traj: "sim.traj" });
    const params = node._toSerializedParams();
    expect(params).toMatchObject({ fileName: "sim.traj" });
  });

  it("exposes inp.particle and out.traj", () => {
    const node = new LoadTrajectory({ xtc: "traj.xtc" });
    expect(node.inp.particle.handle).toBe("particle");
    expect(node.out.traj.handle).toBe("trajectory");
  });
});

describe("LoadVector", () => {
  it("serializes fileName", () => {
    const node = new LoadVector("forces.json");
    const params = node._toSerializedParams();
    expect(params).toMatchObject({ type: "load_vector", fileName: "forces.json" });
  });
});

describe("Streaming", () => {
  it("serializes with connected=false", () => {
    const node = new Streaming();
    expect(node._toSerializedParams()).toMatchObject({ type: "streaming", connected: false });
  });

  it("exposes out.particle, out.bond, out.traj, out.cell", () => {
    const node = new Streaming();
    expect(node.out.particle.handle).toBe("particle");
    expect(node.out.bond.handle).toBe("bond");
    expect(node.out.traj.handle).toBe("trajectory");
    expect(node.out.cell.handle).toBe("cell");
  });
});

describe("Filter", () => {
  it("uses default query 'all'", () => {
    const node = new Filter();
    expect(node._toSerializedParams()).toMatchObject({ type: "filter", query: "all", bond_query: "" });
  });

  it("accepts custom query", () => {
    const node = new Filter({ query: "element == 'C'" });
    expect(node._toSerializedParams()).toMatchObject({ query: "element == 'C'" });
  });

  it("maps inp.particle → handle 'in', out.particle → handle 'out'", () => {
    const node = new Filter();
    expect(node.inp.particle.handle).toBe("in");
    expect(node.out.particle.handle).toBe("out");
  });
});

describe("Modify", () => {
  it("uses default scale=1.0 opacity=1.0", () => {
    const node = new Modify();
    expect(node._toSerializedParams()).toMatchObject({ type: "modify", scale: 1.0, opacity: 1.0 });
  });

  it("accepts custom values", () => {
    const node = new Modify({ scale: 1.5, opacity: 0.3 });
    expect(node._toSerializedParams()).toMatchObject({ scale: 1.5, opacity: 0.3 });
  });
});

describe("AddBonds", () => {
  it("uses default source 'distance'", () => {
    const node = new AddBonds();
    expect(node._toSerializedParams()).toMatchObject({ type: "add_bond", bondSource: "distance" });
  });

  it("accepts source 'structure'", () => {
    const node = new AddBonds({ source: "structure" });
    expect(node._toSerializedParams()).toMatchObject({ bondSource: "structure" });
  });
});

describe("AddLabels", () => {
  it("defaults to source 'element'", () => {
    const node = new AddLabels();
    expect(node._toSerializedParams()).toMatchObject({ type: "label_generator", source: "element" });
  });

  it("accepts 'resname' and 'index'", () => {
    expect(new AddLabels({ source: "resname" })._toSerializedParams()).toMatchObject({ source: "resname" });
    expect(new AddLabels({ source: "index" })._toSerializedParams()).toMatchObject({ source: "index" });
  });
});

describe("AddPolyhedra", () => {
  it("serializes all parameters", () => {
    const node = new AddPolyhedra({
      centerElements: [22],
      ligandElements: [8],
      maxDistance: 2.5,
      opacity: 0.5,
      showEdges: true,
      edgeColor: "#ff0000",
      edgeWidth: 2.0,
    });
    expect(node._toSerializedParams()).toMatchObject({
      type: "polyhedron_generator",
      centerElements: [22],
      ligandElements: [8],
      maxDistance: 2.5,
      opacity: 0.5,
      showEdges: true,
      edgeColor: "#ff0000",
      edgeWidth: 2.0,
    });
  });

  it("uses defaults for optional params", () => {
    const node = new AddPolyhedra({ centerElements: [14] });
    expect(node._toSerializedParams()).toMatchObject({
      ligandElements: [8],
      maxDistance: 2.5,
      opacity: 0.5,
      showEdges: false,
      edgeColor: "#dddddd",
      edgeWidth: 3.0,
    });
  });
});

describe("VectorOverlay", () => {
  it("serializes scale", () => {
    const node = new VectorOverlay({ scale: 2.0 });
    expect(node._toSerializedParams()).toMatchObject({ type: "vector_overlay", scale: 2.0 });
  });
});

describe("Viewport", () => {
  it("uses default params", () => {
    const node = new Viewport();
    expect(node._toSerializedParams()).toMatchObject({
      type: "viewport",
      perspective: false,
      cellAxesVisible: true,
      pivotMarkerVisible: true,
    });
  });

  it("exposes all input ports", () => {
    const node = new Viewport();
    expect(node.inp.particle.handle).toBe("particle");
    expect(node.inp.bond.handle).toBe("bond");
    expect(node.inp.cell.handle).toBe("cell");
    expect(node.inp.traj.handle).toBe("trajectory");
    expect(node.inp.label.handle).toBe("label");
    expect(node.inp.mesh.handle).toBe("mesh");
    expect(node.inp.vector.handle).toBe("vector");
  });

  it("has no output ports", () => {
    const node = new Viewport();
    expect(() => node.out.anything).toThrow(/Available: \(none\)/);
  });
});

// ─── Pipeline ─────────────────────────────────────────────────────────

describe("Pipeline.addNode", () => {
  it("assigns auto-incremented id to node", () => {
    const pipe = new Pipeline();
    const s = pipe.addNode(new LoadStructure("x.pdb"));
    expect(s._id).toBe("load_structure-1");
  });

  it("returns the same node instance", () => {
    const pipe = new Pipeline();
    const node = new LoadStructure("x.pdb");
    expect(pipe.addNode(node)).toBe(node);
  });

  it("increments counter across different node types", () => {
    const pipe = new Pipeline();
    const s = pipe.addNode(new LoadStructure("x.pdb"));
    const v = pipe.addNode(new Viewport());
    expect(s._id).toBe("load_structure-1");
    expect(v._id).toBe("viewport-2");
  });
});

describe("Pipeline.addEdge", () => {
  it("records edge between two nodes", () => {
    const pipe = new Pipeline();
    const s = pipe.addNode(new LoadStructure("x.pdb"));
    const v = pipe.addNode(new Viewport());
    pipe.addEdge(s.out.particle, v.inp.particle);

    const obj = pipe.toObject();
    expect(obj.edges).toHaveLength(1);
    expect(obj.edges[0]).toEqual({
      source: "load_structure-1",
      target: "viewport-2",
      sourceHandle: "particle",
      targetHandle: "particle",
    });
  });

  it("throws when source is not a NodePort", () => {
    const pipe = new Pipeline();
    pipe.addNode(new Viewport());
    expect(() => pipe.addEdge("particle" as any, new NodePort(new Viewport(), "bond"))).toThrow(
      /requires NodePort arguments/,
    );
  });

  it("throws when source node was not added to pipeline", () => {
    const pipe = new Pipeline();
    const v = pipe.addNode(new Viewport());
    const orphan = new LoadStructure("x.pdb"); // NOT added
    expect(() => pipe.addEdge(orphan.out.particle, v.inp.particle)).toThrow(
      /Source node must be added/,
    );
  });

  it("throws when target node was not added to pipeline", () => {
    const pipe = new Pipeline();
    const s = pipe.addNode(new LoadStructure("x.pdb"));
    const orphan = new Viewport(); // NOT added
    expect(() => pipe.addEdge(s.out.particle, orphan.inp.particle)).toThrow(
      /Target node must be added/,
    );
  });
});

describe("Pipeline.toObject", () => {
  it("produces SerializedPipeline v3", () => {
    const pipe = new Pipeline();
    const s = pipe.addNode(new LoadStructure("protein.pdb"));
    const v = pipe.addNode(new Viewport());
    pipe.addEdge(s.out.particle, v.inp.particle);

    const obj = pipe.toObject();
    expect(obj.version).toBe(3);
    expect(obj.nodes).toHaveLength(2);
    expect(obj.edges).toHaveLength(1);

    const sNode = obj.nodes.find((n) => n.id === "load_structure-1")!;
    expect(sNode.type).toBe("load_structure");
    expect((sNode as any).fileName).toBe("protein.pdb");
    expect(sNode.position).toEqual({ x: 0, y: 0 });
  });
});

describe("Pipeline.toJSON", () => {
  it("returns valid JSON string", () => {
    const pipe = new Pipeline();
    pipe.addNode(new LoadStructure("x.pdb"));
    const json = pipe.toJSON();
    expect(() => JSON.parse(json)).not.toThrow();
    expect(JSON.parse(json).version).toBe(3);
  });

  it("is compatible with deserializePipeline", async () => {
    const { deserializePipeline } = await import("@/pipeline/serialize");

    const pipe = new Pipeline();
    const s = pipe.addNode(new LoadStructure("protein.pdb"));
    const f = pipe.addNode(new Filter({ query: "element == 'C'" }));
    const b = pipe.addNode(new AddBonds());
    const v = pipe.addNode(new Viewport());

    pipe.addEdge(s.out.particle, f.inp.particle);
    pipe.addEdge(f.out.particle, v.inp.particle);
    pipe.addEdge(s.out.particle, b.inp.particle);
    pipe.addEdge(b.out.bond, v.inp.bond);

    const { nodes, edges } = deserializePipeline(pipe.toObject());
    expect(nodes).toHaveLength(4);
    expect(edges).toHaveLength(4);

    const filterNode = nodes.find((n) => n.type === "filter")!;
    expect((filterNode.data.params as any).query).toBe("element == 'C'");
  });
});

// ─── Full pipeline round-trip ─────────────────────────────────────────

describe("Pipeline full example", () => {
  it("builds filter+modify+bonds pipeline", () => {
    const pipe = new Pipeline();
    const s = pipe.addNode(new LoadStructure("protein.pdb"));
    const f = pipe.addNode(new Filter({ query: "element == 'C'" }));
    const m = pipe.addNode(new Modify({ scale: 1.3 }));
    const b = pipe.addNode(new AddBonds());
    const v = pipe.addNode(new Viewport());

    pipe.addEdge(s.out.particle, f.inp.particle);
    pipe.addEdge(f.out.particle, m.inp.particle);
    pipe.addEdge(s.out.particle, b.inp.particle);
    pipe.addEdge(m.out.particle, v.inp.particle);
    pipe.addEdge(b.out.bond, v.inp.bond);

    const obj = pipe.toObject();
    expect(obj.nodes).toHaveLength(5);
    expect(obj.edges).toHaveLength(5);

    // Verify filter → modify edge uses the correct handles
    const fmEdge = obj.edges.find(
      (e) => e.source === "filter-2" && e.target === "modify-3",
    );
    expect(fmEdge).toEqual({
      source: "filter-2",
      target: "modify-3",
      sourceHandle: "out",
      targetHandle: "in",
    });
  });

  it("supports DAG with fan-out from single source", () => {
    const pipe = new Pipeline();
    const s = pipe.addNode(new LoadStructure("crystal.pdb"));
    const ca = pipe.addNode(new Filter({ query: "element == 'Ca'" }));
    const other = pipe.addNode(new Filter({ query: "element != 'Ca'" }));
    const vp = pipe.addNode(new Viewport());

    pipe.addEdge(s.out.particle, ca.inp.particle);
    pipe.addEdge(s.out.particle, other.inp.particle);
    pipe.addEdge(ca.out.particle, vp.inp.particle);
    pipe.addEdge(other.out.particle, vp.inp.particle);

    const obj = pipe.toObject();
    const sourcedges = obj.edges.filter((e) => e.source === "load_structure-1");
    expect(sourcedges).toHaveLength(2);
  });

  it("trajectory pipeline wires traj port to viewport", () => {
    const pipe = new Pipeline();
    const s = pipe.addNode(new LoadStructure("protein.pdb"));
    const t = pipe.addNode(new LoadTrajectory({ xtc: "traj.xtc" }));
    const v = pipe.addNode(new Viewport());

    pipe.addEdge(s.out.particle, t.inp.particle);
    pipe.addEdge(s.out.particle, v.inp.particle);
    pipe.addEdge(t.out.traj, v.inp.traj);

    const obj = pipe.toObject();
    const trajEdge = obj.edges.find((e) => e.sourceHandle === "trajectory");
    expect(trajEdge).toBeDefined();
    expect(trajEdge!.targetHandle).toBe("trajectory");
  });
});
