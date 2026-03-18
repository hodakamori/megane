"""NetworkX-style pipeline builder for megane molecular viewer.

Nodes are class instances added via ``add_node()``, connections via
``add_edge()`` with explicit port objects.  The pipeline serializes to
the same ``SerializedPipeline`` v3 JSON format used by the TypeScript
pipeline engine, which remains the source of truth.

A ``Viewport`` node must be explicitly added and connected for data
to be rendered.

Example::

    from megane import Pipeline, LoadStructure, Filter, Modify, AddBonds, Viewport, MolecularViewer

    pipe = Pipeline()
    s = pipe.add_node(LoadStructure("protein.pdb"))
    f = pipe.add_node(Filter(query="element == 'C'"))
    m = pipe.add_node(Modify(scale=1.3))
    b = pipe.add_node(AddBonds())
    v = pipe.add_node(Viewport())

    pipe.add_edge(s.out.particle, f.inp.particle)
    pipe.add_edge(f.out.particle, m.inp.particle)
    pipe.add_edge(s.out.particle, b.inp.particle)
    pipe.add_edge(m.out.particle, v.inp.particle)
    pipe.add_edge(b.out.bond, v.inp.bond)

    viewer = MolecularViewer()
    viewer.set_pipeline(pipe)
"""

from __future__ import annotations

from typing import TYPE_CHECKING, Literal

if TYPE_CHECKING:
    pass

# ─── Port Objects ────────────────────────────────────────────────────


class NodePort:
    """A single typed I/O port on a pipeline node.

    Returned by ``node.out.<name>`` and ``node.inp.<name>``.
    Pass to ``Pipeline.add_edge()`` to connect nodes explicitly.
    """

    def __init__(self, node: PipelineNode, handle: str) -> None:
        self._node = node
        self.handle = handle  # JSON wire name, e.g. "particle", "trajectory", "in"


class PortNamespace:
    """Attribute-access namespace that returns :class:`NodePort` instances.

    Example: ``node.out.particle`` → ``NodePort(node, 'particle')``.
    """

    def __init__(self, node: PipelineNode, port_map: dict[str, str]) -> None:
        # Use object.__setattr__ to avoid triggering our own __getattr__.
        object.__setattr__(self, "_node", node)
        object.__setattr__(self, "_port_map", port_map)

    def __getattr__(self, name: str) -> NodePort:
        port_map: dict[str, str] = object.__getattribute__(self, "_port_map")
        node: PipelineNode = object.__getattribute__(self, "_node")
        if name not in port_map:
            available = ", ".join(sorted(port_map)) or "(none)"
            raise AttributeError(f"No port {name!r} on {node._node_type!r} node. Available: {available}")
        return NodePort(node, port_map[name])

    def __dir__(self) -> list[str]:
        port_map: dict[str, str] = object.__getattribute__(self, "_port_map")
        return sorted(port_map)


# ─── Node Classes ───────────────────────────────────────────────────


class PipelineNode:
    """Base class for all pipeline node types."""

    _node_type: str = ""
    _out_ports: dict[str, str] = {}
    _inp_ports: dict[str, str] = {}

    def __init__(self) -> None:
        self._id: str | None = None
        self.out = PortNamespace(self, self.__class__._out_ports)
        self.inp = PortNamespace(self, self.__class__._inp_ports)


class LoadStructure(PipelineNode):
    """Load a molecular structure from a file.

    Supported formats: PDB, GRO, XYZ, MOL, LAMMPS data.

    Ports:
        out.particle — atom data
        out.traj     — trajectory channel
        out.cell     — simulation cell
    """

    _node_type = "load_structure"
    _out_ports = {"particle": "particle", "traj": "trajectory", "cell": "cell"}
    _inp_ports: dict[str, str] = {}

    def __init__(self, path: str) -> None:
        super().__init__()
        self.path = path


class LoadTrajectory(PipelineNode):
    """Load an external trajectory file (XTC or ASE .traj).

    Requires connection from a ``LoadStructure`` node via
    ``pipe.add_edge(s.out.particle, t.inp.particle)``.
    Frames are loaded lazily when ``frame_index`` changes.

    Args:
        xtc: Path to XTC trajectory file.
        traj: Path to ASE .traj file.

    Ports:
        inp.particle — atom topology source
        out.traj     — trajectory frames
    """

    _node_type = "load_trajectory"
    _out_ports = {"traj": "trajectory"}
    _inp_ports = {"particle": "particle"}

    def __init__(
        self,
        *,
        xtc: str | None = None,
        traj: str | None = None,
    ) -> None:
        super().__init__()
        self.xtc = xtc
        self.traj = traj


class Streaming(PipelineNode):
    """Streaming source node for WebSocket-based data delivery.

    Connects to the server via WebSocket and provides particle,
    trajectory, and cell data from the streaming connection.

    Ports:
        out.particle — atom data
        out.bond     — bond data
        out.traj     — trajectory channel
        out.cell     — simulation cell
    """

    _node_type = "streaming"
    _out_ports = {
        "particle": "particle",
        "bond": "bond",
        "traj": "trajectory",
        "cell": "cell",
    }
    _inp_ports: dict[str, str] = {}

    def __init__(self) -> None:
        super().__init__()


class LoadVector(PipelineNode):
    """Load per-atom vector data from a file.

    Ports:
        out.vector — vector field
    """

    _node_type = "load_vector"
    _out_ports = {"vector": "vector"}
    _inp_ports: dict[str, str] = {}

    def __init__(self, path: str) -> None:
        super().__init__()
        self.path = path


class Filter(PipelineNode):
    """Filter atoms by a selection query.

    Query syntax examples::

        element == 'C'
        element == 'O' and x > 5.0
        resname == 'ALA'
        index >= 100 and index < 200

    Ports:
        inp.particle — atom data in
        out.particle — filtered atom data
    """

    _node_type = "filter"
    _out_ports = {"particle": "out"}
    _inp_ports = {"particle": "in"}

    def __init__(self, *, query: str = "all", bond_query: str = "") -> None:
        super().__init__()
        self.query = query
        self.bond_query = bond_query


class Modify(PipelineNode):
    """Modify per-atom visual properties (scale, opacity).

    Ports:
        inp.particle — atom data in
        out.particle — modified atom data
    """

    _node_type = "modify"
    _out_ports = {"particle": "out"}
    _inp_ports = {"particle": "in"}

    def __init__(
        self,
        *,
        scale: float = 1.0,
        opacity: float = 1.0,
    ) -> None:
        super().__init__()
        self.scale = scale
        self.opacity = opacity


class AddBonds(PipelineNode):
    """Compute and display bonds.

    Args:
        source: ``"distance"`` for VDW-based inference,
                ``"structure"`` to use bonds from the file.

    Ports:
        inp.particle — atom data
        out.bond     — computed bonds
    """

    _node_type = "add_bond"
    _out_ports = {"bond": "bond"}
    _inp_ports = {"particle": "particle"}

    def __init__(
        self,
        *,
        source: Literal["distance", "structure"] = "distance",
    ) -> None:
        super().__init__()
        self.source = source


class AddLabels(PipelineNode):
    """Generate text labels at atom positions.

    Args:
        source: ``"element"``, ``"resname"``, or ``"index"``.

    Ports:
        inp.particle — atom data
        out.label    — label data
    """

    _node_type = "label_generator"
    _out_ports = {"label": "label"}
    _inp_ports = {"particle": "particle"}

    def __init__(
        self,
        *,
        source: Literal["element", "resname", "index"] = "element",
    ) -> None:
        super().__init__()
        self.source = source


class AddPolyhedra(PipelineNode):
    """Generate coordination polyhedra mesh.

    Ports:
        inp.particle — atom data
        out.mesh     — polyhedra mesh
    """

    _node_type = "polyhedron_generator"
    _out_ports = {"mesh": "mesh"}
    _inp_ports = {"particle": "particle"}

    def __init__(
        self,
        *,
        center_elements: list[int],
        ligand_elements: list[int] | None = None,
        max_distance: float = 2.5,
        opacity: float = 0.5,
        show_edges: bool = False,
        edge_color: str = "#dddddd",
        edge_width: float = 3.0,
    ) -> None:
        super().__init__()
        self.center_elements = center_elements
        self.ligand_elements = ligand_elements if ligand_elements is not None else [8]
        self.max_distance = max_distance
        self.opacity = opacity
        self.show_edges = show_edges
        self.edge_color = edge_color
        self.edge_width = edge_width


class VectorOverlay(PipelineNode):
    """Configure per-atom vector visualization (e.g. forces).

    Ports:
        inp.vector — vector field in
        out.vector — configured vector field
    """

    _node_type = "vector_overlay"
    _out_ports = {"vector": "vector"}
    _inp_ports = {"vector": "vector"}

    def __init__(self, *, scale: float = 1.0) -> None:
        super().__init__()
        self.scale = scale


class Viewport(PipelineNode):
    """3D rendering output node.

    All data to be rendered must be explicitly connected to this node.

    Ports:
        inp.particle — atom data
        inp.bond     — bond data
        inp.cell     — simulation cell
        inp.traj     — trajectory frames
        inp.label    — text labels
        inp.mesh     — polyhedra mesh
        inp.vector   — vector field
    """

    _node_type = "viewport"
    _out_ports: dict[str, str] = {}
    _inp_ports = {
        "particle": "particle",
        "bond": "bond",
        "cell": "cell",
        "traj": "trajectory",
        "label": "label",
        "mesh": "mesh",
        "vector": "vector",
    }

    def __init__(
        self,
        *,
        perspective: bool = False,
        cell_axes_visible: bool = True,
    ) -> None:
        super().__init__()
        self.perspective = perspective
        self.cell_axes_visible = cell_axes_visible


# ─── Pipeline ───────────────────────────────────────────────────────


def _load_structure_file(path: str):
    """Auto-detect format and load a structure file.

    Returns a ``Structure`` object (from ``megane.parsers.pdb``).
    """
    import pathlib

    import numpy as np

    from megane import megane_parser
    from megane.parsers.pdb import Structure

    ext = pathlib.Path(path).suffix.lower()

    with open(path) as f:
        text = f.read()

    parsers = {
        ".pdb": megane_parser.parse_pdb,
        ".gro": megane_parser.parse_gro,
        ".xyz": megane_parser.parse_xyz,
        ".mol": megane_parser.parse_mol,
        ".data": megane_parser.parse_lammps_data,
    }

    parse_fn = parsers.get(ext)
    if parse_fn is None:
        raise ValueError(f"Unsupported structure format: {ext!r}.  Supported: {', '.join(sorted(parsers))}")

    result = parse_fn(text)
    return Structure(
        n_atoms=result.n_atoms,
        positions=np.asarray(result.positions, dtype=np.float32),
        elements=np.asarray(result.elements, dtype=np.uint8),
        bonds=np.asarray(result.bonds, dtype=np.uint32),
        bond_orders=np.asarray(result.bond_orders, dtype=np.uint8),
        box=np.asarray(result.box_matrix, dtype=np.float32),
    )


class Pipeline:
    """NetworkX-style pipeline graph builder.

    Build a DAG of processing nodes and serialize to the
    ``SerializedPipeline`` v3 JSON format understood by the
    TypeScript pipeline engine.

    Example::

        from megane import Pipeline, LoadStructure, Viewport

        pipe = Pipeline()
        s = pipe.add_node(LoadStructure("protein.pdb"))
        v = pipe.add_node(Viewport())
        pipe.add_edge(s.out.particle, v.inp.particle)
    """

    def __init__(self) -> None:
        self._nodes: dict[str, tuple[PipelineNode, dict]] = {}
        self._edges: list[dict] = []
        self._node_data: dict[str, bytes] = {}
        self._trajectories: dict[str, object] = {}
        self._structures: dict[str, object] = {}
        self._counter = 0

    # ── Public API ──────────────────────────────────────────

    def add_node(self, node: PipelineNode) -> PipelineNode:
        """Add a node to the pipeline.

        Returns the same node instance so its ports can be used in
        ``add_edge()`` calls::

            s = pipe.add_node(LoadStructure("protein.pdb"))
            pipe.add_edge(s.out.particle, ...)
        """
        self._counter += 1
        node._id = f"{node._node_type}-{self._counter}"

        config = self._serialize_node(node)
        self._nodes[node._id] = (node, config)

        if isinstance(node, LoadStructure):
            self._load_structure_data(node)

        return node

    def add_edge(
        self,
        source: NodePort,
        target: NodePort,
    ) -> None:
        """Connect *source* port to *target* port.

        Both ports must belong to nodes already added to this pipeline::

            pipe.add_edge(s.out.particle, f.inp.particle)
            pipe.add_edge(s.out.traj, v.inp.traj)
        """
        if not isinstance(source, NodePort) or not isinstance(target, NodePort):
            raise TypeError(
                "add_edge() requires NodePort arguments. "
                "Use node.out.<name> and node.inp.<name>, "
                "e.g. pipe.add_edge(s.out.particle, f.inp.particle)."
            )
        if source._node._id not in self._nodes or target._node._id not in self._nodes:
            raise ValueError("Both nodes must be added to this pipeline before connecting.")
        self._edges.append(
            {
                "source": source._node._id,
                "target": target._node._id,
                "sourceHandle": source.handle,
                "targetHandle": target.handle,
            }
        )

        # Trigger lazy trajectory loading when connecting
        # LoadStructure → LoadTrajectory.
        if isinstance(target._node, LoadTrajectory) and isinstance(source._node, LoadStructure):
            self._load_trajectory_data(target._node, source._node)

    # ── Serialization ───────────────────────────────────────

    def to_dict(self) -> dict:
        """Serialize to ``SerializedPipeline`` v3 format."""
        nodes = [config for _, config in self._nodes.values()]
        edges = list(self._edges)
        return {"version": 3, "nodes": nodes, "edges": edges}

    def to_json(self, *, indent: int | None = 2) -> str:
        """Serialize to a JSON string (SerializedPipeline v3).

        Args:
            indent: JSON indentation level (default 2). Pass ``None`` for compact output.

        Returns:
            JSON string representation of the pipeline.
        """
        import json

        return json.dumps(self.to_dict(), indent=indent)

    def save(self, path) -> None:
        """Save the pipeline to a JSON file.

        Args:
            path: Destination file path (``str`` or :class:`pathlib.Path`).
                  Creates or overwrites the file.
        """
        import pathlib

        pathlib.Path(path).write_text(self.to_json(), encoding="utf-8")

    @staticmethod
    def _build_node_from_dict(nd: dict) -> "PipelineNode":
        """Instantiate the correct PipelineNode subclass from a v3 node dict."""
        ntype = nd.get("type")
        if ntype == "load_structure":
            return LoadStructure(nd.get("fileName") or "")
        elif ntype == "load_trajectory":
            import pathlib

            fname = nd.get("fileName") or ""
            ext = pathlib.Path(fname).suffix.lower()
            return LoadTrajectory(
                xtc=fname if ext == ".xtc" else None,
                traj=fname if ext != ".xtc" and fname else None,
            )
        elif ntype == "filter":
            return Filter(query=nd.get("query", "all"), bond_query=nd.get("bond_query", ""))
        elif ntype == "modify":
            return Modify(scale=nd.get("scale", 1.0), opacity=nd.get("opacity", 1.0))
        elif ntype == "add_bond":
            return AddBonds(source=nd.get("bondSource", "distance"))
        elif ntype == "label_generator":
            return AddLabels(source=nd.get("source", "element"))
        elif ntype == "polyhedron_generator":
            return AddPolyhedra(
                center_elements=nd.get("centerElements", []),
                ligand_elements=nd.get("ligandElements", [8]),
                max_distance=nd.get("maxDistance", 2.5),
                opacity=nd.get("opacity", 0.5),
                show_edges=nd.get("showEdges", False),
                edge_color=nd.get("edgeColor", "#dddddd"),
                edge_width=nd.get("edgeWidth", 3.0),
            )
        elif ntype == "vector_overlay":
            return VectorOverlay(scale=nd.get("scale", 1.0))
        elif ntype == "viewport":
            return Viewport(
                perspective=nd.get("perspective", False),
                cell_axes_visible=nd.get("cellAxesVisible", True),
            )
        elif ntype == "streaming":
            return Streaming()
        elif ntype == "load_vector":
            return LoadVector(nd.get("fileName") or "")
        else:
            raise ValueError(f"Unknown node type {ntype!r}")

    @classmethod
    def from_dict(cls, d: dict) -> "Pipeline":
        """Reconstruct a Pipeline from a SerializedPipeline v3 dict.

        ``LoadStructure`` file paths in the JSON must still be accessible.
        Relative paths are resolved from the current working directory at call
        time.

        Args:
            d: A dict in ``SerializedPipeline`` v3 format (e.g. from
               :meth:`to_dict`).

        Returns:
            A new :class:`Pipeline` instance ready to pass to
            ``MolecularViewer.set_pipeline()``.

        Raises:
            ValueError: If the dict is not version 3 or contains an unknown
                        node type.
        """
        if d.get("version") != 3:
            raise ValueError(
                f"Unsupported pipeline version: {d.get('version')!r}. Expected 3."
            )

        pipe = cls()
        node_by_id: dict[str, PipelineNode] = {}

        for nd in d.get("nodes", []):
            node = cls._build_node_from_dict(nd)
            node._id = nd["id"]
            pipe._nodes[node._id] = (node, pipe._serialize_node(node))
            node_by_id[node._id] = node

            if isinstance(node, LoadStructure) and node.path:
                pipe._load_structure_data(node)

        pipe._edges = [dict(e) for e in d.get("edges", [])]

        # Trigger trajectory loading for LoadStructure → LoadTrajectory edges.
        for edge in pipe._edges:
            target = node_by_id.get(edge["target"])
            source = node_by_id.get(edge["source"])
            if isinstance(target, LoadTrajectory) and isinstance(source, LoadStructure):
                pipe._load_trajectory_data(target, source)

        # Advance counter past any imported IDs to avoid future collisions.
        max_counter = 0
        for nid in pipe._nodes:
            parts = nid.rsplit("-", 1)
            if len(parts) == 2 and parts[1].isdigit():
                max_counter = max(max_counter, int(parts[1]))
        pipe._counter = max_counter

        return pipe

    @classmethod
    def from_json(cls, s: str) -> "Pipeline":
        """Reconstruct a Pipeline from a JSON string.

        Args:
            s: JSON string in ``SerializedPipeline`` v3 format.

        Returns:
            A new :class:`Pipeline` instance.
        """
        import json

        return cls.from_dict(json.loads(s))

    @classmethod
    def load(cls, path) -> "Pipeline":
        """Load a Pipeline from a JSON file saved with :meth:`save`.

        Args:
            path: Path to a JSON file in ``SerializedPipeline`` v3 format
                  (``str`` or :class:`pathlib.Path`).

        Returns:
            A new :class:`Pipeline` instance.
        """
        import pathlib

        return cls.from_json(pathlib.Path(path).read_text(encoding="utf-8"))

    # ── Internal ────────────────────────────────────────────

    def _serialize_node(self, node: PipelineNode) -> dict:
        """Convert a node instance to the TS SerializedPipeline node dict."""
        if node._id is None:
            raise ValueError("Node must be added to the pipeline before serialization.")
        base: dict = {
            "id": node._id,
            "type": node._node_type,
            "position": {"x": 0, "y": 0},
        }

        if isinstance(node, LoadStructure):
            structure = self._structures.get(node._id)
            has_cell = False
            if structure is not None:
                import numpy as np

                has_cell = bool(np.any(structure.box != 0))
            base["fileName"] = node.path
            base["hasTrajectory"] = False
            base["hasCell"] = has_cell
        elif isinstance(node, LoadTrajectory):
            base["fileName"] = node.xtc or node.traj
        elif isinstance(node, Streaming):
            base["connected"] = False
        elif isinstance(node, Filter):
            base["query"] = node.query
            base["bond_query"] = node.bond_query
        elif isinstance(node, Modify):
            base["scale"] = node.scale
            base["opacity"] = node.opacity
        elif isinstance(node, AddBonds):
            base["bondSource"] = node.source
        elif isinstance(node, AddLabels):
            base["source"] = node.source
        elif isinstance(node, AddPolyhedra):
            base["centerElements"] = node.center_elements
            base["ligandElements"] = node.ligand_elements
            base["maxDistance"] = node.max_distance
            base["opacity"] = node.opacity
            base["showEdges"] = node.show_edges
            base["edgeColor"] = node.edge_color
            base["edgeWidth"] = node.edge_width
        elif isinstance(node, LoadVector):
            base["fileName"] = node.path
        elif isinstance(node, VectorOverlay):
            base["scale"] = node.scale
        elif isinstance(node, Viewport):
            base["perspective"] = node.perspective
            base["cellAxesVisible"] = node.cell_axes_visible

        return base

    def _load_structure_data(self, node: LoadStructure) -> None:
        """Load structure file and store binary snapshot data."""
        from megane.protocol import encode_snapshot

        if node._id is None:
            raise ValueError("Node must be added to the pipeline before loading data.")
        structure = _load_structure_file(node.path)
        self._structures[node._id] = structure
        self._node_data[node._id] = encode_snapshot(structure)

        # Re-serialize to update hasCell
        self._nodes[node._id] = (node, self._serialize_node(node))

    def _load_trajectory_data(
        self,
        node: LoadTrajectory,
        source: LoadStructure,
    ) -> None:
        """Load trajectory object for lazy frame loading."""
        if node._id is None:
            raise ValueError("Node must be added to the pipeline before loading data.")
        if node.xtc is not None:
            from megane.parsers.xtc import load_trajectory

            self._trajectories[node._id] = load_trajectory(source.path, node.xtc)

            # Update parent LoadStructure's hasTrajectory flag
            if source._id in self._nodes:
                self._nodes[source._id][1]["hasTrajectory"] = True
        elif node.traj is not None:
            from megane.parsers.traj import load_traj

            _, trajectory = load_traj(node.traj)
            self._trajectories[node._id] = trajectory
