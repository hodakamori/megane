"""Run test notebooks with nbconvert and verify they complete without errors."""

import subprocess
import sys
from pathlib import Path

import pytest

REPO_ROOT = Path(__file__).resolve().parent.parent.parent
TEST_NOTEBOOK_DIR = REPO_ROOT / "tests" / "notebooks"
EXAMPLES_DIR = REPO_ROOT / "examples"

# (directory, filename) pairs. Notebooks under `examples/` use relative paths
# like "../tests/fixtures/..." so they must execute with their own directory
# as the cwd; nbconvert's ExecutePreprocessor uses the notebook's parent
# directory when --output-dir is also that directory.
NOTEBOOKS: list[tuple[Path, str]] = [
    (TEST_NOTEBOOK_DIR, "test_visualization.ipynb"),
    (TEST_NOTEBOOK_DIR, "test_pipeline.ipynb"),
    (TEST_NOTEBOOK_DIR, "test_render_setup.ipynb"),
    (EXAMPLES_DIR, "demo.ipynb"),
    (EXAMPLES_DIR, "external_events.ipynb"),
    (EXAMPLES_DIR, "pipeline.ipynb"),
]


@pytest.mark.parametrize(
    "notebook_dir,notebook",
    NOTEBOOKS,
    ids=[f"{d.name}/{n}" for d, n in NOTEBOOKS],
)
def test_notebook_executes(notebook_dir: Path, notebook: str):
    """Execute notebook with nbconvert and assert zero exit code."""
    nb_path = notebook_dir / notebook
    assert nb_path.exists(), f"Notebook not found: {nb_path}"

    executed_name = f"_executed_{notebook}"
    executed_path = notebook_dir / executed_name

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
                "--ExecutePreprocessor.timeout=180",
                "--ExecutePreprocessor.kernel_name=python3",
                "--output-dir",
                str(notebook_dir),
                "--output",
                executed_name,
                str(nb_path),
            ],
            capture_output=True,
            text=True,
            timeout=240,
        )

        assert result.returncode == 0, (
            f"Notebook {notebook} failed:\n"
            f"STDOUT: {result.stdout}\n"
            f"STDERR: {result.stderr}"
        )
    finally:
        if executed_path.exists():
            executed_path.unlink()
