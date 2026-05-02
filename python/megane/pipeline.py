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
    from megane.widget import MolecularViewer

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
    """Load an external trajectory file (XTC, ASE .traj, or multi-frame XYZ).

    Requires connection from a ``LoadStructure`` node via
    ``pipe.add_edge(s.out.particle, t.inp.particle)``.
    Frames are loaded lazily when ``frame_index`` changes.

    Args:
        xtc: Path to XTC trajectory file.
        traj: Path to ASE .traj file.
        xyz: Path to multi-frame XYZ file.

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
        xyz: str | None = None,
    ) -> None:
        super().__init__()
        self.xtc = xtc
        self.traj = traj
        self.xyz = xyz


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
    """Modify per-atom visual properties (scale, opacity, color scheme).

    Args:
        scale: Atom radius scale multiplier (default 1.0).
        opacity: Atom opacity 0-1 (default 1.0).
        color_scheme: One of ``"element"`` (CPK), ``"residue"``,
                      ``"chain"``, or ``"bfactor"`` (default ``"element"``).

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
        color_scheme: str = "element",
    ) -> None:
        super().__init__()
        self.scale = scale
        self.opacity = opacity
        self.color_scheme = color_scheme


class AddBonds(PipelineNode):
    """Compute and display bonds.

    Args:
        source: ``"distance"`` for VDW-based inference,
                ``"structure"`` (alias ``"file"``) to use bonds from the
                loaded structure file.
        top: Path to a GROMACS ``.top`` topology file.  When provided,
             *source* is ignored and bonds are read from the topology.

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
        source: Literal["distance", "structure", "file"] = "distance",
        top: str | None = None,
    ) -> None:
        super().__init__()
        self.source = "structure" if source == "file" else source
        self.top = top


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
        pivot_marker_visible: bool = True,
    ) -> None:
        super().__init__()
        self.perspective = perspective
        self.cell_axes_visible = cell_axes_visible
        self.pivot_marker_visible = pivot_marker_visible


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

    text_parsers = {
        ".pdb": megane_parser.parse_pdb,
        ".gro": megane_parser.parse_gro,
        ".xyz": megane_parser.parse_xyz,
        ".mol": megane_parser.parse_mol,
        ".sdf": megane_parser.parse_mol,
        ".data": megane_parser.parse_lammps_data,
        ".lammps": megane_parser.parse_lammps_data,
    }
    binary_parsers = {
        ".traj": megane_parser.parse_traj,
    }

    if ext in text_parsers:
        with open(path) as f:
            text = f.read()
        result = text_parsers[ext](text)
    elif ext in binary_parsers:
        with open(path, "rb") as f:
            data = f.read()
        result = binary_parsers[ext](data)
    else:
        supported = sorted({*text_parsers, *binary_parsers})
        raise ValueError(f"Unsupported structure format: {ext!r}.  Supported: {', '.join(supported)}")

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
                traj=fname if ext == ".traj" else None,
                xyz=fname if ext == ".xyz" else None,
            )
        elif ntype == "filter":
            return Filter(query=nd.get("query", "all"), bond_query=nd.get("bond_query", ""))
        elif ntype == "modify":
            return Modify(scale=nd.get("scale", 1.0), opacity=nd.get("opacity", 1.0), color_scheme=nd.get("colorScheme", "element"))
        elif ntype == "add_bond":
            bond_source = nd.get("bondSource", "distance")
            if bond_source == "file":
                return AddBonds(top=nd.get("bondFileName", ""))
            return AddBonds(source=bond_source)
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
                pivot_marker_visible=nd.get("pivotMarkerVisible", True),
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
            raise ValueError(f"Unsupported pipeline version: {d.get('version')!r}. Expected 3.")

        pipe = cls()
        node_by_id: dict[str, PipelineNode] = {}

        for i, nd in enumerate(d.get("nodes", [])):
            if "id" not in nd:
                raise ValueError(f"Node at index {i} is missing required field 'id'.")
            node = cls._build_node_from_dict(nd)
            node._id = nd["id"]
            pipe._nodes[node._id] = (node, pipe._serialize_node(node))
            node_by_id[node._id] = node

            if isinstance(node, LoadStructure) and node.path:
                pipe._load_structure_data(node)

        for i, e in enumerate(d.get("edges", [])):
            for field in ("source", "target", "sourceHandle", "targetHandle"):
                if field not in e:
                    raise ValueError(f"Edge at index {i} is missing required field {field!r}.")
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
            base["fileName"] = node.xtc or node.traj or node.xyz
        elif isinstance(node, Streaming):
            base["connected"] = False
        elif isinstance(node, Filter):
            base["query"] = node.query
            base["bond_query"] = node.bond_query
        elif isinstance(node, Modify):
            base["scale"] = node.scale
            base["opacity"] = node.opacity
            base["colorScheme"] = node.color_scheme
        elif isinstance(node, AddBonds):
            if node.top is not None:
                base["bondSource"] = "file"
                base["bondFileName"] = node.top
                base["bondFileData"] = self._parse_top_bonds(node)
            else:
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
            base["pivotMarkerVisible"] = node.pivot_marker_visible

        return base

    @staticmethod
    def _parse_top_bonds(node: AddBonds) -> list[int]:
        """Read a .top file and return flat bond pairs [a0, b0, a1, b1, ...]."""
        from megane.parsers.top import parse_top_bonds

        assert node.top is not None
        bonds = parse_top_bonds(node.top)
        return bonds.flatten().tolist()

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

            trajectory = load_trajectory(source.path, node.xtc)
            self._trajectories[node._id] = trajectory
        elif node.traj is not None:
            from megane.parsers.traj import load_traj

            _, trajectory = load_traj(node.traj)
            self._trajectories[node._id] = trajectory
        elif node.xyz is not None:
            from megane.parsers.xyz import load_xyz_trajectory

            _, trajectory = load_xyz_trajectory(node.xyz)
            self._trajectories[node._id] = trajectory
        else:
            return

        # Update parent LoadStructure's hasTrajectory flag. Only mark true
        # when there is more than one frame — single-frame sources
        # shouldn't advertise a playable trajectory to the frontend.
        if trajectory.n_frames > 1 and source._id in self._nodes:
            self._nodes[source._id][1]["hasTrajectory"] = True


# ─── Convenience wrappers ────────────────────────────────────────────


def view(
    path: str,
    *,
    bonds: Literal["distance", "structure", "file"] | None = "distance",
    perspective: bool = False,
    cell_axes_visible: bool = True,
) -> "MolecularViewer":
    """Open a molecular viewer for a structure file.

    Builds a minimal pipeline with :class:`LoadStructure` and
    :class:`Viewport` nodes and, when *bonds* is not ``None``
    (the default), an additional :class:`AddBonds` node, then
    returns a :class:`~megane.widget.MolecularViewer` widget.

    Args:
        path: Path to a structure file (PDB, GRO, XYZ, MOL, LAMMPS data).
        bonds: Bond detection method. ``"distance"`` (default) uses VDW radii,
            ``"structure"`` (alias ``"file"``) reads bonds from the loaded
            structure file, ``None`` disables bonds.
        perspective: Use perspective projection instead of orthographic.
        cell_axes_visible: Show unit cell axes.

    Returns:
        A :class:`~megane.widget.MolecularViewer` widget ready for display.

    Example::

        import megane
        viewer = megane.view("protein.pdb")
        viewer  # displays in notebook
    """
    from megane.widget import MolecularViewer

    pipe = Pipeline()
    s = pipe.add_node(LoadStructure(path))
    v = pipe.add_node(Viewport(perspective=perspective, cell_axes_visible=cell_axes_visible))
    pipe.add_edge(s.out.particle, v.inp.particle)
    pipe.add_edge(s.out.cell, v.inp.cell)

    if bonds is not None:
        b = pipe.add_node(AddBonds(source=bonds))
        pipe.add_edge(s.out.particle, b.inp.particle)
        pipe.add_edge(b.out.bond, v.inp.bond)

    viewer = MolecularViewer()
    viewer.set_pipeline(pipe)
    return viewer


def view_traj(
    path: str,
    *,
    xtc: str | None = None,
    traj: str | None = None,
    xyz: str | None = None,
    bonds: Literal["distance", "structure", "file"] | None = "distance",
    perspective: bool = False,
    cell_axes_visible: bool = True,
) -> "MolecularViewer":
    """Open a molecular viewer with a trajectory.

    Builds a pipeline (LoadStructure → LoadTrajectory → Viewport, with an
    optional AddBonds node when *bonds* is not None) and returns a
    :class:`~megane.widget.MolecularViewer` widget.

    When *path* points to a self-contained trajectory file (``.traj`` or
    multi-frame ``.xyz``) and no explicit trajectory kwarg is provided,
    the trajectory is auto-loaded from that same file.

    Args:
        path: Path to a structure or self-contained trajectory file (PDB,
            GRO, XYZ, MOL, LAMMPS data, ASE .traj).
        xtc: Path to an XTC trajectory file.
        traj: Path to an ASE ``.traj`` file.
        xyz: Path to a multi-frame XYZ trajectory file.
        bonds: Bond detection method. ``"distance"`` (default) uses VDW radii
            and is recomputed per frame during trajectory playback,
            ``"structure"`` (alias ``"file"``) reads bonds once from the
            loaded structure file, ``None`` disables bonds.
        perspective: Use perspective projection instead of orthographic.
        cell_axes_visible: Show unit cell axes.

    Returns:
        A :class:`~megane.widget.MolecularViewer` widget ready for display.

    Raises:
        ValueError: If more than one of *xtc*, *traj*, *xyz* is provided,
            or if none is provided and *path* isn't a self-contained
            trajectory file.

    Example::

        import megane
        viewer = megane.view_traj("protein.pdb", xtc="trajectory.xtc")
        viewer = megane.view_traj("trajectory.traj")   # auto-detects .traj
        viewer = megane.view_traj("multiframe.xyz")    # auto-detects .xyz
        viewer.frame_index = 50
    """
    import pathlib

    if sum(x is not None for x in (xtc, traj, xyz)) > 1:
        raise ValueError("Only one of 'xtc', 'traj', or 'xyz' can be provided, not multiple.")

    if xtc is None and traj is None and xyz is None:
        ext = pathlib.Path(path).suffix.lower()
        if ext == ".traj":
            traj = path
        elif ext == ".xyz":
            xyz = path
        else:
            raise ValueError(
                "Either 'xtc', 'traj', or 'xyz' must be provided, "
                "or 'path' must point to a .traj or .xyz file. "
                "Use view() for structure-only display."
            )

    from megane.widget import MolecularViewer

    pipe = Pipeline()
    s = pipe.add_node(LoadStructure(path))
    t = pipe.add_node(LoadTrajectory(xtc=xtc, traj=traj, xyz=xyz))
    v = pipe.add_node(Viewport(perspective=perspective, cell_axes_visible=cell_axes_visible))

    pipe.add_edge(s.out.particle, t.inp.particle)
    pipe.add_edge(s.out.particle, v.inp.particle)
    pipe.add_edge(s.out.cell, v.inp.cell)
    pipe.add_edge(t.out.traj, v.inp.traj)

    if bonds is not None:
        b = pipe.add_node(AddBonds(source=bonds))
        pipe.add_edge(s.out.particle, b.inp.particle)
        pipe.add_edge(b.out.bond, v.inp.bond)

    viewer = MolecularViewer()
    viewer.set_pipeline(pipe)
    return viewer


def build_pipeline(
    path: str,
    *,
    xtc: str | None = None,
    traj: str | None = None,
    xyz: str | None = None,
    bonds: Literal["distance", "structure", "file"] | None = "distance",
    top: str | None = None,
    perspective: bool = False,
    cell_axes_visible: bool = True,
    pivot_marker_visible: bool = True,
) -> Pipeline:
    """Build a pipeline for a molecular structure, optionally with a trajectory.

    Constructs a :class:`Pipeline` with :class:`LoadStructure` and
    :class:`Viewport` nodes.  When *xtc*, *traj*, or *xyz* is provided, a
    :class:`LoadTrajectory` node is added.  When *bonds* is not ``None``
    (the default), an :class:`AddBonds` node is included.

    Unlike :func:`view` and :func:`view_traj`, this function returns the
    :class:`Pipeline` directly without creating a widget, making it
    suitable for serialization (via :meth:`Pipeline.to_json`) or further
    programmatic modification.

    Args:
        path: Path to a structure file (PDB, GRO, XYZ, MOL, LAMMPS data,
            ASE .traj).
        xtc: Path to an XTC trajectory file.
        traj: Path to an ASE ``.traj`` file.
        xyz: Path to a multi-frame XYZ trajectory file.
        bonds: Bond detection method. ``"distance"`` (default) uses VDW radii,
            ``"structure"`` (alias ``"file"``) reads bonds from the loaded
            structure file, ``None`` disables bonds. Ignored when *top* is
            provided.
        top: Path to a GROMACS ``.top`` topology file for bond definitions.
            When provided, overrides *bonds*.
        perspective: Use perspective projection instead of orthographic.
        cell_axes_visible: Show unit cell axes.
        pivot_marker_visible: Show pivot marker in viewport.

    Returns:
        A :class:`Pipeline` instance ready for serialization or
        passing to :meth:`~megane.widget.MolecularViewer.set_pipeline`.

    Raises:
        ValueError: If more than one of *xtc*, *traj*, *xyz* is provided.

    Example::

        import megane

        # Structure only -> JSON
        pipe = megane.build_pipeline("protein.pdb")
        print(pipe.to_json())

        # With trajectory -> save to file
        pipe = megane.build_pipeline("protein.pdb", xtc="trajectory.xtc")
        pipe.save("pipeline.json")

        # With GROMACS topology
        pipe = megane.build_pipeline("protein.pdb", top="topology.top")
        print(pipe.to_json())
    """
    if sum(x is not None for x in (xtc, traj, xyz)) > 1:
        raise ValueError("Only one of 'xtc', 'traj', or 'xyz' can be provided, not multiple.")

    pipe = Pipeline()
    s = pipe.add_node(LoadStructure(path))
    v = pipe.add_node(
        Viewport(
            perspective=perspective,
            cell_axes_visible=cell_axes_visible,
            pivot_marker_visible=pivot_marker_visible,
        )
    )

    pipe.add_edge(s.out.particle, v.inp.particle)
    pipe.add_edge(s.out.cell, v.inp.cell)

    if xtc is not None or traj is not None or xyz is not None:
        t = pipe.add_node(LoadTrajectory(xtc=xtc, traj=traj, xyz=xyz))
        pipe.add_edge(s.out.particle, t.inp.particle)
        pipe.add_edge(t.out.traj, v.inp.traj)

    if top is not None:
        b = pipe.add_node(AddBonds(top=top))
        pipe.add_edge(s.out.particle, b.inp.particle)
        pipe.add_edge(b.out.bond, v.inp.bond)
    elif bonds is not None:
        b = pipe.add_node(AddBonds(source=bonds))
        pipe.add_edge(s.out.particle, b.inp.particle)
        pipe.add_edge(b.out.bond, v.inp.bond)

    return pipe
