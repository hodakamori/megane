"""NetworkX-style pipeline builder for megane molecular viewer.

Nodes are class instances added via ``add_node()``, connections via
``add_edge()`` with ports auto-resolved from types.  The pipeline
serializes to the same ``SerializedPipeline`` v3 JSON format used by
the TypeScript pipeline engine, which remains the source of truth.

Example::

    from megane.pipeline import Pipeline, LoadStructure, Filter, Modify, AddBonds

    pipe = Pipeline()
    s = pipe.add_node(LoadStructure("protein.pdb"))
    carbons = pipe.add_node(Filter(query="element == 'C'"))
    m = pipe.add_node(Modify(scale=1.3))
    bonds = pipe.add_node(AddBonds(source="distance"))

    pipe.add_edge(s, carbons)
    pipe.add_edge(carbons, m)
    pipe.add_edge(s, bonds)

    viewer.set_pipeline(pipe)
"""

from __future__ import annotations

from typing import Literal


# ─── Node Classes ───────────────────────────────────────────────────


class PipelineNode:
    """Base class for all pipeline node types."""

    _node_type: str = ""

    def __init__(self) -> None:
        self._id: str | None = None


class LoadStructure(PipelineNode):
    """Load a molecular structure from a file.

    Supported formats: PDB, GRO, XYZ, MOL, LAMMPS data, CIF.
    """

    _node_type = "load_structure"

    def __init__(self, path: str) -> None:
        super().__init__()
        self.path = path


class LoadTrajectory(PipelineNode):
    """Load an external trajectory file (XTC or ASE .traj).

    Requires connection from a ``LoadStructure`` node.
    Frames are loaded lazily when ``frame_index`` changes.

    Args:
        xtc: Path to XTC trajectory file.
        traj: Path to ASE .traj file.
    """

    _node_type = "load_trajectory"

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
    """

    _node_type = "streaming"

    def __init__(self) -> None:
        super().__init__()


class LoadVector(PipelineNode):
    """Load per-atom vector data from a file."""

    _node_type = "load_vector"

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
    """

    _node_type = "filter"

    def __init__(self, *, query: str) -> None:
        super().__init__()
        self.query = query


class Modify(PipelineNode):
    """Modify per-atom visual properties (scale, opacity)."""

    _node_type = "modify"

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
    """

    _node_type = "add_bond"

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
    """

    _node_type = "label_generator"

    def __init__(
        self,
        *,
        source: Literal["element", "resname", "index"] = "element",
    ) -> None:
        super().__init__()
        self.source = source


class AddPolyhedra(PipelineNode):
    """Generate coordination polyhedra mesh."""

    _node_type = "polyhedron_generator"

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
    """Configure per-atom vector visualization (e.g. forces)."""

    _node_type = "vector_overlay"

    def __init__(self, *, scale: float = 1.0) -> None:
        super().__init__()
        self.scale = scale


# ─── Port Resolution ────────────────────────────────────────────────

# target_node_type → (default source_handle, target_handle)
_TARGET_PORT_MAP: dict[str, tuple[str, str]] = {
    "load_trajectory": ("particle", "particle"),
    "filter": ("particle", "in"),
    "modify": ("particle", "in"),
    "add_bond": ("particle", "particle"),
    "label_generator": ("particle", "particle"),
    "polyhedron_generator": ("particle", "particle"),
    "vector_overlay": ("vector", "vector"),
    "viewport": ("particle", "particle"),  # fallback; actual handle varies
}

# source_node_type → default output handle
_SOURCE_OUTPUT_MAP: dict[str, str] = {
    "filter": "out",
    "modify": "out",
    "load_vector": "vector",
    "vector_overlay": "vector",
    "add_bond": "bond",
    "label_generator": "label",
    "polyhedron_generator": "mesh",
}


def _resolve_ports(
    source: PipelineNode,
    target: PipelineNode,
) -> tuple[str, str]:
    """Resolve source and target port handles from node types."""
    target_handle = _TARGET_PORT_MAP.get(
        target._node_type, ("particle", "particle")
    )[1]

    # Source handle: use the source node's known output, or infer
    # from what the target expects.
    source_handle = _SOURCE_OUTPUT_MAP.get(source._node_type)
    if source_handle is None:
        # LoadStructure or other multi-output node: use what the
        # target expects as its input type.
        source_handle = _TARGET_PORT_MAP.get(
            target._node_type, ("particle", "particle")
        )[0]

    return source_handle, target_handle


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
        raise ValueError(
            f"Unsupported structure format: {ext!r}.  "
            f"Supported: {', '.join(sorted(parsers))}"
        )

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
    """

    def __init__(self) -> None:
        self._nodes: list[tuple[PipelineNode, dict]] = []
        self._edges: list[dict] = []
        self._node_data: dict[str, bytes] = {}
        self._trajectories: dict[str, object] = {}
        self._structures: dict[str, object] = {}
        self._counter = 0

    # ── Public API ──────────────────────────────────────────

    def add_node(self, node: PipelineNode) -> PipelineNode:
        """Add a node to the pipeline.

        Returns the same node instance so it can be used in
        ``add_edge()`` calls.
        """
        self._counter += 1
        node._id = f"{node._node_type}-{self._counter}"

        config = self._serialize_node(node)
        self._nodes.append((node, config))

        if isinstance(node, LoadStructure):
            self._load_structure_data(node)

        return node

    def add_edge(
        self,
        source: PipelineNode,
        target: PipelineNode,
    ) -> None:
        """Connect *source* → *target*.

        Port handles are auto-resolved from the node types.
        """
        if source._id is None or target._id is None:
            raise ValueError(
                "Both nodes must be added to the pipeline before connecting."
            )
        source_handle, target_handle = _resolve_ports(source, target)
        self._edges.append({
            "source": source._id,
            "target": target._id,
            "sourceHandle": source_handle,
            "targetHandle": target_handle,
        })

        # Trigger lazy trajectory loading when connecting
        # LoadStructure → LoadTrajectory.
        if isinstance(target, LoadTrajectory) and isinstance(
            source, LoadStructure
        ):
            self._load_trajectory_data(target, source)

    # ── Serialization ───────────────────────────────────────

    def to_dict(self) -> dict:
        """Serialize to ``SerializedPipeline`` v3 format.

        A viewport node is auto-generated and connected to all
        unconnected output ports.
        """
        nodes = [config for _, config in self._nodes]
        edges = list(self._edges)

        viewport_id = "viewport-auto"
        viewport_node = {
            "id": viewport_id,
            "type": "viewport",
            "perspective": False,
            "cellAxesVisible": True,
            "position": {"x": 0, "y": 0},
        }
        nodes.append(viewport_node)

        viewport_edges = self._auto_connect_viewport(viewport_id)
        edges.extend(viewport_edges)

        return {"version": 3, "nodes": nodes, "edges": edges}

    # ── Internal ────────────────────────────────────────────

    def _serialize_node(self, node: PipelineNode) -> dict:
        """Convert a node instance to the TS SerializedPipeline node dict."""
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

        return base

    def _load_structure_data(self, node: LoadStructure) -> None:
        """Load structure file and store binary snapshot data."""
        from megane.protocol import encode_snapshot

        structure = _load_structure_file(node.path)
        self._structures[node._id] = structure
        self._node_data[node._id] = encode_snapshot(structure)

        # Re-serialize to update hasCell
        import numpy as np
        for i, (n, _) in enumerate(self._nodes):
            if n._id == node._id:
                self._nodes[i] = (n, self._serialize_node(n))
                break

    def _load_trajectory_data(
        self,
        node: LoadTrajectory,
        source: LoadStructure,
    ) -> None:
        """Load trajectory object for lazy frame loading."""
        if node.xtc is not None:
            from megane.parsers.xtc import load_trajectory

            self._trajectories[node._id] = load_trajectory(
                source.path, node.xtc
            )

            # Update parent LoadStructure's hasTrajectory flag
            for i, (n, config) in enumerate(self._nodes):
                if n._id == source._id:
                    config["hasTrajectory"] = True
                    break
        elif node.traj is not None:
            from megane.parsers.traj import load_traj

            _, trajectory = load_traj(node.traj)
            self._trajectories[node._id] = trajectory

    def _auto_connect_viewport(self, viewport_id: str) -> list[dict]:
        """Connect all unconnected outputs to the auto-generated viewport."""
        # Collect set of (node_id, handle) that are already used as edge sources
        used_outputs: set[tuple[str, str]] = set()
        for edge in self._edges:
            used_outputs.add((edge["source"], edge["sourceHandle"]))

        # Map of node_type → list of output handles
        output_handles: dict[str, list[str]] = {
            "load_structure": ["particle", "trajectory", "cell"],
            "load_trajectory": ["trajectory"],
            "load_vector": ["vector"],
            "streaming": ["particle", "bond", "trajectory", "cell"],
            "filter": ["out"],
            "modify": ["out"],
            "add_bond": ["bond"],
            "label_generator": ["label"],
            "polyhedron_generator": ["mesh"],
            "vector_overlay": ["vector"],
        }

        # Map output handle name → viewport input handle name
        handle_to_viewport: dict[str, str] = {
            "particle": "particle",
            "out": "particle",  # filter/modify output → viewport particle
            "bond": "bond",
            "cell": "cell",
            "trajectory": "trajectory",
            "label": "label",
            "mesh": "mesh",
            "vector": "vector",
        }

        viewport_edges: list[dict] = []
        for node, _ in self._nodes:
            handles = output_handles.get(node._node_type, [])
            for handle in handles:
                if (node._id, handle) not in used_outputs:
                    viewport_handle = handle_to_viewport.get(handle)
                    if viewport_handle:
                        viewport_edges.append({
                            "source": node._id,
                            "target": viewport_id,
                            "sourceHandle": handle,
                            "targetHandle": viewport_handle,
                        })

        return viewport_edges
