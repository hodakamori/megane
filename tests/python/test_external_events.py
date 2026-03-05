"""Tests for external event trigger system."""

import json
from pathlib import Path

from megane.widget import MolecularViewer

FIXTURES = Path(__file__).parent.parent / "fixtures"


def test_selected_atoms_trait():
    """selected_atoms is a synced traitlet with default empty list."""
    v = MolecularViewer()
    assert v.selected_atoms == []


def test_selected_atoms_settable():
    """selected_atoms can be set to a list of integers."""
    v = MolecularViewer()
    v.selected_atoms = [0, 1, 2, 3]
    assert v.selected_atoms == [0, 1, 2, 3]


def test_measurement_json_trait():
    """_measurement_json is a synced traitlet with default empty string."""
    v = MolecularViewer()
    assert v._measurement_json == ""


def test_measurement_property_none_when_empty():
    """measurement property returns None when no measurement data."""
    v = MolecularViewer()
    assert v.measurement is None


def test_measurement_property_parses_json():
    """measurement property parses _measurement_json."""
    v = MolecularViewer()
    data = {"type": "distance", "value": 3.5, "label": "3.500 Å", "atoms": [0, 1]}
    v._measurement_json = json.dumps(data)
    result = v.measurement
    assert result == data
    assert result["type"] == "distance"
    assert result["value"] == 3.5


def test_on_event_decorator():
    """on_event works as a decorator."""
    v = MolecularViewer()
    calls = []

    @v.on_event("measurement")
    def handler(data):
        calls.append(data)

    data = {"type": "distance", "value": 3.5, "label": "3.500 Å", "atoms": [0, 1]}
    v._measurement_json = json.dumps(data)
    assert len(calls) == 1
    assert calls[0] == data


def test_on_event_method_call():
    """on_event works as a method call."""
    v = MolecularViewer()
    calls = []

    def handler(data):
        calls.append(data)

    v.on_event("selection_change", handler)
    v.selected_atoms = [5, 10]
    assert len(calls) == 1
    assert calls[0] == {"atoms": [5, 10]}


def test_on_event_frame_change():
    """frame_change event fires when frame_index changes."""
    v = MolecularViewer()
    calls = []

    @v.on_event("frame_change")
    def handler(data):
        calls.append(data)

    v.frame_index = 42
    assert len(calls) == 1
    assert calls[0] == {"frame_index": 42}


def test_on_event_multiple_handlers():
    """Multiple handlers can be registered for the same event."""
    v = MolecularViewer()
    calls_a = []
    calls_b = []

    v.on_event("frame_change", lambda d: calls_a.append(d))
    v.on_event("frame_change", lambda d: calls_b.append(d))

    v.frame_index = 10
    assert len(calls_a) == 1
    assert len(calls_b) == 1


def test_off_event_specific():
    """off_event removes a specific handler."""
    v = MolecularViewer()
    calls = []

    def handler(data):
        calls.append(data)

    v.on_event("frame_change", handler)
    v.frame_index = 1
    assert len(calls) == 1

    v.off_event("frame_change", handler)
    v.frame_index = 2
    assert len(calls) == 1  # no new call


def test_off_event_all():
    """off_event with no callback removes all handlers."""
    v = MolecularViewer()
    calls = []

    v.on_event("frame_change", lambda d: calls.append(d))
    v.on_event("frame_change", lambda d: calls.append(d))
    v.frame_index = 1
    assert len(calls) == 2

    v.off_event("frame_change")
    v.frame_index = 2
    assert len(calls) == 2  # no new calls


def test_measurement_event_none_on_empty():
    """measurement event fires with None when measurement json is cleared."""
    v = MolecularViewer()
    calls = []

    @v.on_event("measurement")
    def handler(data):
        calls.append(data)

    v._measurement_json = json.dumps({"type": "distance", "value": 1.0,
                                       "label": "1.0 Å", "atoms": [0, 1]})
    v._measurement_json = ""
    assert len(calls) == 2
    assert calls[0] is not None
    assert calls[1] is None


def test_widget_state_includes_new_keys():
    """get_state() contains the new external event keys."""
    v = MolecularViewer()
    state = v.get_state()
    assert "selected_atoms" in state
    assert "_measurement_json" in state
