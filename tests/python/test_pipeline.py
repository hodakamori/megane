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
    NodePort,
    Pipeline,
    PortNamespace,
    VectorOverlay,
    Viewport,
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


class TestPortObjects:
    """NodePort and PortNamespace work correctly."""

    def test_node_has_out_and_inp(self):
        n = LoadStructure("test.pdb")
        assert isinstance(n.out, PortNamespace)
        assert isinstance(n.inp, PortNamespace)

    def test_load_structure_out_ports(self):
        n = LoadStructure("test.pdb")
        p = n.out.particle
        assert isinstance(p, NodePort)
        assert p._node is n
        assert p.handle == "particle"

    def test_load_structure_out_traj(self):
        n = LoadStructure("test.pdb")
        p = n.out.traj
        assert p.handle == "trajectory"

    def test_load_structure_out_cell(self):
        n = LoadStructure("test.pdb")
        p = n.out.cell
        assert p.handle == "cell"

    def test_filter_inp_particle(self):
        n = Filter(query="element == 'C'")
        p = n.inp.particle
        assert p.handle == "in"

    def test_filter_out_particle(self):
        n = Filter(query="element == 'C'")
        p = n.out.particle
        assert p.handle == "out"

    def test_viewport_inp_traj(self):
        v = Viewport()
        p = v.inp.traj
        assert p.handle == "trajectory"

    def test_viewport_inp_bond(self):
        v = Viewport()
        p = v.inp.bond
        assert p.handle == "bond"

    def test_invalid_port_raises_attribute_error(self):
        n = LoadStructure("test.pdb")
        with pytest.raises(AttributeError, match="No port"):
            _ = n.out.nonexistent

    def test_invalid_inp_port_raises_attribute_error(self):
        n = Viewport()
        with pytest.raises(AttributeError, match="No port"):
            _ = n.inp.nonexistent

    def test_load_structure_has_no_inp_ports(self):
        n = LoadStructure("test.pdb")
        with pytest.raises(AttributeError):
            _ = n.inp.particle

    def test_viewport_has_no_out_ports(self):
        v = Viewport()
        with pytest.raises(AttributeError):
            _ = v.out.particle

    def test_port_dir_lists_available(self):
        n = LoadStructure("test.pdb")
        ports = dir(n.out)
        assert "particle" in ports
        assert "traj" in ports
        assert "cell" in ports


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
    """Pipeline.add_edge() creates edges with correct port handles."""

    def test_structure_to_filter(self):
        pipe = Pipeline()
        s = pipe.add_node(LoadStructure(str(FIXTURES / "1crn.pdb")))
        f = pipe.add_node(Filter(query="element == 'C'"))
        pipe.add_edge(s.out.particle, f.inp.particle)

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
        pipe.add_edge(s.out.particle, f.inp.particle)
        pipe.add_edge(f.out.particle, m.inp.particle)

        edge = pipe._edges[1]
        assert edge["sourceHandle"] == "out"
        assert edge["targetHandle"] == "in"

    def test_structure_to_add_bonds(self):
        pipe = Pipeline()
        s = pipe.add_node(LoadStructure(str(FIXTURES / "1crn.pdb")))
        b = pipe.add_node(AddBonds(source="distance"))
        pipe.add_edge(s.out.particle, b.inp.particle)

        edge = pipe._edges[0]
        assert edge["sourceHandle"] == "particle"
        assert edge["targetHandle"] == "particle"

    def test_structure_to_label_generator(self):
        pipe = Pipeline()
        s = pipe.add_node(LoadStructure(str(FIXTURES / "1crn.pdb")))
        lbl = pipe.add_node(AddLabels(source="element"))
        pipe.add_edge(s.out.particle, lbl.inp.particle)

        edge = pipe._edges[0]
        assert edge["sourceHandle"] == "particle"
        assert edge["targetHandle"] == "particle"

    def test_structure_to_viewport_particle(self):
        pipe = Pipeline()
        s = pipe.add_node(LoadStructure(str(FIXTURES / "1crn.pdb")))
        v = pipe.add_node(Viewport())
        pipe.add_edge(s.out.particle, v.inp.particle)

        edge = pipe._edges[0]
        assert edge["sourceHandle"] == "particle"
        assert edge["targetHandle"] == "particle"

    def test_add_bonds_to_viewport_bond(self):
        pipe = Pipeline()
        s = pipe.add_node(LoadStructure(str(FIXTURES / "1crn.pdb")))
        b = pipe.add_node(AddBonds())
        v = pipe.add_node(Viewport())
        pipe.add_edge(s.out.particle, b.inp.particle)
        pipe.add_edge(b.out.bond, v.inp.bond)

        edge = pipe._edges[1]
        assert edge["sourceHandle"] == "bond"
        assert edge["targetHandle"] == "bond"

    def test_trajectory_to_viewport_traj(self):
        pipe = Pipeline()
        s = pipe.add_node(LoadStructure(str(FIXTURES / "caffeine_water.pdb")))
        t = pipe.add_node(LoadTrajectory(
            xtc=str(FIXTURES / "caffeine_water_vibration.xtc"),
        ))
        v = pipe.add_node(Viewport())
        pipe.add_edge(s.out.particle, t.inp.particle)
        pipe.add_edge(t.out.traj, v.inp.traj)

        traj_edge = pipe._edges[1]
        assert traj_edge["sourceHandle"] == "trajectory"
        assert traj_edge["targetHandle"] == "trajectory"

    def test_error_on_unadded_nodes(self):
        pipe = Pipeline()
        s = LoadStructure("test.pdb")
        f = pipe.add_node(Filter(query="test"))
        with pytest.raises(ValueError, match="must be added"):
            pipe.add_edge(s.out.particle, f.inp.particle)


class TestPipelineSerialization:
    """Pipeline.to_dict() produces valid SerializedPipeline v3."""

    def test_version(self):
        pipe = Pipeline()
        pipe.add_node(LoadStructure(str(FIXTURES / "1crn.pdb")))
        result = pipe.to_dict()
        assert result["version"] == 3

    def test_no_viewport_without_explicit_node(self):
        """Pipeline without Viewport node should not include viewport."""
        pipe = Pipeline()
        pipe.add_node(LoadStructure(str(FIXTURES / "1crn.pdb")))
        result = pipe.to_dict()

        node_types = [n["type"] for n in result["nodes"]]
        assert "viewport" not in node_types

    def test_explicit_viewport_node(self):
        """Viewport node appears when explicitly added."""
        pipe = Pipeline()
        s = pipe.add_node(LoadStructure(str(FIXTURES / "1crn.pdb")))
        v = pipe.add_node(Viewport())
        pipe.add_edge(s.out.particle, v.inp.particle)
        result = pipe.to_dict()

        node_types = [n["type"] for n in result["nodes"]]
        assert "viewport" in node_types
        viewport_edges = [
            e for e in result["edges"] if e["target"] == v._id
        ]
        assert len(viewport_edges) == 1
        assert viewport_edges[0]["sourceHandle"] == "particle"
        assert viewport_edges[0]["targetHandle"] == "particle"

    def test_viewport_serialization_params(self):
        """Viewport parameters are serialized correctly."""
        pipe = Pipeline()
        v = pipe.add_node(Viewport(perspective=True, cell_axes_visible=False))
        result = pipe.to_dict()

        vp_node = next(n for n in result["nodes"] if n["type"] == "viewport")
        assert vp_node["perspective"] is True
        assert vp_node["cellAxesVisible"] is False

    def test_viewport_port_resolution(self):
        """add_edge resolves correct ports for various types → viewport."""
        pipe = Pipeline()
        s = pipe.add_node(LoadStructure(str(FIXTURES / "1crn.pdb")))
        b = pipe.add_node(AddBonds(source="distance"))
        lbl = pipe.add_node(AddLabels(source="element"))
        v = pipe.add_node(Viewport())

        pipe.add_edge(s.out.particle, b.inp.particle)
        pipe.add_edge(s.out.particle, lbl.inp.particle)
        pipe.add_edge(s.out.particle, v.inp.particle)
        pipe.add_edge(b.out.bond, v.inp.bond)
        pipe.add_edge(lbl.out.label, v.inp.label)

        result = pipe.to_dict()
        viewport_edges = [
            e for e in result["edges"] if e["target"] == v._id
        ]
        handles = {(e["sourceHandle"], e["targetHandle"]) for e in viewport_edges}
        assert ("particle", "particle") in handles
        assert ("bond", "bond") in handles
        assert ("label", "label") in handles

    def test_filter_modify_chain(self):
        pipe = Pipeline()
        s = pipe.add_node(LoadStructure(str(FIXTURES / "1crn.pdb")))
        f = pipe.add_node(Filter(query="element == 'C'"))
        m = pipe.add_node(Modify(scale=1.5))
        pipe.add_edge(s.out.particle, f.inp.particle)
        pipe.add_edge(f.out.particle, m.inp.particle)
        result = pipe.to_dict()

        filter_node = next(n for n in result["nodes"] if n["type"] == "filter")
        assert filter_node["query"] == "element == 'C'"

        modify_node = next(n for n in result["nodes"] if n["type"] == "modify")
        assert modify_node["scale"] == 1.5

    def test_add_bonds_serialization(self):
        pipe = Pipeline()
        s = pipe.add_node(LoadStructure(str(FIXTURES / "1crn.pdb")))
        b = pipe.add_node(AddBonds(source="structure"))
        pipe.add_edge(s.out.particle, b.inp.particle)
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
        pipe.add_edge(s.out.particle, p.inp.particle)
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
        v = pipe.add_node(Viewport())
        pipe.add_edge(s.out.particle, f1.inp.particle)
        pipe.add_edge(s.out.particle, f2.inp.particle)
        pipe.add_edge(s.out.particle, b.inp.particle)
        pipe.add_edge(f1.out.particle, v.inp.particle)
        pipe.add_edge(f2.out.particle, v.inp.particle)
        pipe.add_edge(b.out.bond, v.inp.bond)

        result = pipe.to_dict()
        assert len(result["edges"]) == 6

    def test_chain_filter_modify_labels(self):
        """Filter → Modify and Filter → Labels from same parent."""
        pipe = Pipeline()
        s = pipe.add_node(LoadStructure(str(FIXTURES / "1crn.pdb")))
        f = pipe.add_node(Filter(query="element == 'C'"))
        m = pipe.add_node(Modify(scale=1.3))
        lbl = pipe.add_node(AddLabels(source="element"))
        pipe.add_edge(s.out.particle, f.inp.particle)
        pipe.add_edge(f.out.particle, m.inp.particle)
        pipe.add_edge(f.out.particle, lbl.inp.particle)

        result = pipe.to_dict()
        # f → m: out → in
        fm_edge = next(
            e for e in result["edges"]
            if e["source"] == f._id and e["target"] == m._id
        )
        assert fm_edge["sourceHandle"] == "out"

        # f → lbl: out → particle
        fl_edge = next(
            e for e in result["edges"]
            if e["source"] == f._id and e["target"] == lbl._id
        )
        assert fl_edge["sourceHandle"] == "out"
