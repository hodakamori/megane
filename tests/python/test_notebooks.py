"""Run test notebooks with nbconvert and verify they complete without errors."""

import subprocess
import sys
from pathlib import Path

import pytest

NOTEBOOK_DIR = Path(__file__).parent.parent / "notebooks"

NOTEBOOKS = [
    "test_visualization.ipynb",
    "test_pipeline.ipynb",
    "test_render_setup.ipynb",
]


@pytest.mark.parametrize("notebook", NOTEBOOKS)
def test_notebook_executes(notebook):
    """Execute notebook with nbconvert and assert zero exit code."""
    nb_path = NOTEBOOK_DIR / notebook
    assert nb_path.exists(), f"Notebook not found: {nb_path}"

    executed_name = f"_executed_{notebook}"
    executed_path = NOTEBOOK_DIR / executed_name

    try:
        result = subprocess.run(
            [
                sys.executable,
                "-m",
                "jupyter",
                "nbconvert",
                "--to",
                "notebook",
                "--execute",
                "--ExecutePreprocessor.timeout=120",
                "--ExecutePreprocessor.kernel_name=python3",
                "--output-dir",
                str(NOTEBOOK_DIR),
                "--output",
                executed_name,
                str(nb_path),
            ],
            capture_output=True,
            text=True,
            timeout=180,
        )

        assert result.returncode == 0, (
            f"Notebook {notebook} failed:\n"
            f"STDOUT: {result.stdout}\n"
            f"STDERR: {result.stderr}"
        )
    finally:
        if executed_path.exists():
            executed_path.unlink()
