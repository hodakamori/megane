"""JupyterLab server configuration for Galata tests."""

from pathlib import Path

# Project root (two levels up from this file)
_PROJECT_ROOT = str(Path(__file__).resolve().parent.parent.parent)

c = get_config()  # noqa: F821 — provided by Jupyter config loader

c.ServerApp.token = ""
c.ServerApp.password = ""
c.ServerApp.disable_check_xsrf = True
c.ServerApp.open_browser = False

# Set notebook_dir to project root so notebooks can use relative paths
# like "tests/fixtures/caffeine_water.pdb"
c.ServerApp.root_dir = _PROJECT_ROOT
