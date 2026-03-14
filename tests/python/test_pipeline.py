"""Tests for the Python pipeline builder."""

from pathlib import Path

import pytest

from megane.pipeline import (
    AddBonds,
    AddLabels,
    AddPolyhedra,
    Filter,
    LoadStructure,
    LoadTrajectory,
    LoadVector,
    Modify,
    Pipeline,
    VectorOverlay,
)

FIXTURES = Path(__file__).parent.parent / "fixtures"


class TestNodeClasses:
    """Node classes store parameters correctly."""

    def test_load_structure(self):
        n = LoadStructure("test.pdb")
        assert n.path == "test.pdb"
        assert n._node_type == "load_structure"

    def test_filter(self):
        n = Filter(query="element == 'C'")
        assert n.query == "element == 'C'"
        assert n._node_type == "filter"

    def test_modify_defaults(self):
        n = Modify()
        assert n.scale == 1.0
        assert n.opacity == 1.0
        assert n._node_type == "modify"

    def test_modify_custom(self):
        n = Modify(scale=1.5, opacity=0.3)
        assert n.scale == 1.5
        assert n.opacity == 0.3

    def test_add_bonds_default(self):
        n = AddBonds()
        assert n.source == "distance"
        assert n._node_type == "add_bond"

    def test_add_bonds_structure(self):
        n = AddBonds(source="structure")
        assert n.source == "structure"

    def test_add_labels(self):
        n = AddLabels(source="resname")
        assert n.source == "resname"
        assert n._node_type == "label_generator"

    def test_add_polyhedra(self):
        n = AddPolyhedra(center_elements=[26], ligand_elements=[8, 7])
        assert n.center_elements == [26]
        assert n.ligand_elements == [8, 7]
        assert n.max_distance == 2.5
        assert n._node_type == "polyhedron_generator"

    def test_add_polyhedra_defaults(self):
        n = AddPolyhedra(center_elements=[26])
        assert n.ligand_elements == [8]
        assert n.opacity == 0.5
        assert n.show_edges is False

    def test_load_vector(self):
        n = LoadVector("vectors.dat")
        assert n.path == "vectors.dat"
        assert n._node_type == "load_vector"

    def test_vector_overlay(self):
        n = VectorOverlay(scale=2.0)
        assert n.scale == 2.0
        assert n._node_type == "vector_overlay"

    def test_load_trajectory(self):
        n = LoadTrajectory(xtc="traj.xtc")
        assert n.xtc == "traj.xtc"
        assert n._node_type == "load_trajectory"


class TestPipelineAddNode:
    """Pipeline.add_node() assigns IDs and stores nodes."""

    def test_add_single_node(self):
        pipe = Pipeline()
        n = pipe.add_node(LoadStructure(str(FIXTURES / "1crn.pdb")))
        assert n._id is not None
        assert n._id.startswith("load_structure-")

    def test_add_multiple_nodes_unique_ids(self):
        pipe = Pipeline()
        n1 = pipe.add_node(Filter(query="a"))
        n2 = pipe.add_node(Filter(query="b"))
        assert n1._id != n2._id

    def test_add_node_returns_same_instance(self):
        pipe = Pipeline()
        original = Filter(query="test")
        returned = pipe.add_node(original)
        assert returned is original


class TestPipelineAddEdge:
    """Pipeline.add_edge() creates edges with correct port resolution."""

    def test_structure_to_filter(self):
        pipe = Pipeline()
        s = pipe.add_node(LoadStructure(str(FIXTURES / "1crn.pdb")))
        f = pipe.add_node(Filter(query="element == 'C'"))
        pipe.add_edge(s, f)

        assert len(pipe._edges) == 1
        edge = pipe._edges[0]
        assert edge["source"] == s._id
        assert edge["target"] == f._id
        assert edge["sourceHandle"] == "particle"
        assert edge["targetHandle"] == "in"

    def test_filter_to_modify(self):
        pipe = Pipeline()
        s = pipe.add_node(LoadStructure(str(FIXTURES / "1crn.pdb")))
        f = pipe.add_node(Filter(query="element == 'C'"))
        m = pipe.add_node(Modify(scale=1.3))
        pipe.add_edge(s, f)
        pipe.add_edge(f, m)

        edge = pipe._edges[1]
        assert edge["sourceHandle"] == "out"
        assert edge["targetHandle"] == "in"

    def test_structure_to_add_bonds(self):
        pipe = Pipeline()
        s = pipe.add_node(LoadStructure(str(FIXTURES / "1crn.pdb")))
        b = pipe.add_node(AddBonds(source="distance"))
        pipe.add_edge(s, b)

        edge = pipe._edges[0]
        assert edge["sourceHandle"] == "particle"
        assert edge["targetHandle"] == "particle"

    def test_structure_to_label_generator(self):
        pipe = Pipeline()
        s = pipe.add_node(LoadStructure(str(FIXTURES / "1crn.pdb")))
        lbl = pipe.add_node(AddLabels(source="element"))
        pipe.add_edge(s, lbl)

        edge = pipe._edges[0]
        assert edge["sourceHandle"] == "particle"
        assert edge["targetHandle"] == "particle"

    def test_error_on_unadded_nodes(self):
        pipe = Pipeline()
        s = LoadStructure("test.pdb")
        f = Filter(query="test")
        with pytest.raises(ValueError, match="must be added"):
            pipe.add_edge(s, f)


class TestPipelineSerialization:
    """Pipeline.to_dict() produces valid SerializedPipeline v3."""

    def test_version(self):
        pipe = Pipeline()
        pipe.add_node(LoadStructure(str(FIXTURES / "1crn.pdb")))
        result = pipe.to_dict()
        assert result["version"] == 3

    def test_viewport_auto_generated(self):
        pipe = Pipeline()
        pipe.add_node(LoadStructure(str(FIXTURES / "1crn.pdb")))
        result = pipe.to_dict()

        node_types = [n["type"] for n in result["nodes"]]
        assert "viewport" in node_types

    def test_terminal_nodes_connected_to_viewport(self):
        pipe = Pipeline()
        s = pipe.add_node(LoadStructure(str(FIXTURES / "1crn.pdb")))
        result = pipe.to_dict()

        # LoadStructure has unconnected particle, trajectory, cell outputs
        # All should be connected to viewport
        viewport_edges = [
            e for e in result["edges"]
            if e["target"] == "viewport-auto"
        ]
        assert len(viewport_edges) >= 1  # at least particle

    def test_filter_modify_chain(self):
        pipe = Pipeline()
        s = pipe.add_node(LoadStructure(str(FIXTURES / "1crn.pdb")))
        f = pipe.add_node(Filter(query="element == 'C'"))
        m = pipe.add_node(Modify(scale=1.5))
        pipe.add_edge(s, f)
        pipe.add_edge(f, m)
        result = pipe.to_dict()

        # Verify node params are serialized correctly
        filter_node = next(n for n in result["nodes"] if n["type"] == "filter")
        assert filter_node["query"] == "element == 'C'"

        modify_node = next(n for n in result["nodes"] if n["type"] == "modify")
        assert modify_node["scale"] == 1.5

    def test_add_bonds_serialization(self):
        pipe = Pipeline()
        s = pipe.add_node(LoadStructure(str(FIXTURES / "1crn.pdb")))
        b = pipe.add_node(AddBonds(source="structure"))
        pipe.add_edge(s, b)
        result = pipe.to_dict()

        bond_node = next(n for n in result["nodes"] if n["type"] == "add_bond")
        assert bond_node["bondSource"] == "structure"

    def test_polyhedra_serialization(self):
        pipe = Pipeline()
        s = pipe.add_node(LoadStructure(str(FIXTURES / "1crn.pdb")))
        p = pipe.add_node(AddPolyhedra(
            center_elements=[26],
            ligand_elements=[8],
            max_distance=3.0,
            opacity=0.7,
        ))
        pipe.add_edge(s, p)
        result = pipe.to_dict()

        poly_node = next(
            n for n in result["nodes"] if n["type"] == "polyhedron_generator"
        )
        assert poly_node["centerElements"] == [26]
        assert poly_node["maxDistance"] == 3.0
        assert poly_node["opacity"] == 0.7


class TestPipelineDataLoading:
    """Pipeline loads structure data into _node_data."""

    def test_load_structure_populates_node_data(self):
        pipe = Pipeline()
        s = pipe.add_node(LoadStructure(str(FIXTURES / "1crn.pdb")))
        assert s._id in pipe._node_data
        assert len(pipe._node_data[s._id]) > 0
        # Check MEGN magic bytes
        assert pipe._node_data[s._id][:4] == b"MEGN"

    def test_multiple_structures(self):
        pipe = Pipeline()
        s1 = pipe.add_node(LoadStructure(str(FIXTURES / "1crn.pdb")))
        s2 = pipe.add_node(LoadStructure(str(FIXTURES / "caffeine_water.pdb")))
        assert s1._id in pipe._node_data
        assert s2._id in pipe._node_data
        assert s1._id != s2._id

    def test_unsupported_format_raises(self, tmp_path):
        # Create a dummy file with unsupported extension
        dummy = tmp_path / "test.unknown"
        dummy.write_text("dummy")
        pipe = Pipeline()
        with pytest.raises(ValueError, match="Unsupported"):
            pipe.add_node(LoadStructure(str(dummy)))


class TestPipelineDAG:
    """Pipeline supports DAG branching correctly."""

    def test_fan_out_from_structure(self):
        """Multiple downstream nodes from one LoadStructure."""
        pipe = Pipeline()
        s = pipe.add_node(LoadStructure(str(FIXTURES / "1crn.pdb")))
        f1 = pipe.add_node(Filter(query="element == 'C'"))
        f2 = pipe.add_node(Filter(query="element == 'N'"))
        b = pipe.add_node(AddBonds(source="distance"))
        pipe.add_edge(s, f1)
        pipe.add_edge(s, f2)
        pipe.add_edge(s, b)

        result = pipe.to_dict()
        # Should have 3 explicit edges + viewport auto-edges
        explicit_edges = [
            e for e in result["edges"]
            if e["target"] != "viewport-auto"
        ]
        assert len(explicit_edges) == 3

    def test_chain_filter_modify_labels(self):
        """Filter → Modify and Filter → Labels from same parent."""
        pipe = Pipeline()
        s = pipe.add_node(LoadStructure(str(FIXTURES / "1crn.pdb")))
        f = pipe.add_node(Filter(query="element == 'C'"))
        m = pipe.add_node(Modify(scale=1.3))
        lbl = pipe.add_node(AddLabels(source="element"))
        pipe.add_edge(s, f)
        pipe.add_edge(f, m)
        pipe.add_edge(f, lbl)

        result = pipe.to_dict()
        # f → m uses out → in
        fm_edge = next(
            e for e in result["edges"]
            if e["source"] == f._id and e["target"] == m._id
        )
        assert fm_edge["sourceHandle"] == "out"

        # f → lbl uses out → particle
        fl_edge = next(
            e for e in result["edges"]
            if e["source"] == f._id and e["target"] == lbl._id
        )
        assert fl_edge["sourceHandle"] == "out"
