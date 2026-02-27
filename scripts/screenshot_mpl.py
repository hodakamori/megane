"""Generate a high-quality screenshot of 1crn.pdb using matplotlib."""

import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D
from megane.parsers.pdb import load_pdb

# CPK colors by atomic number
CPK_COLORS = {
    1: "#FFFFFF",   # H
    6: "#555555",   # C
    7: "#3344DD",   # N
    8: "#DD2222",   # O
    15: "#FF8800",  # P
    16: "#DDCC22",  # S
}
DEFAULT_COLOR = "#CC66CC"

VDW_RADII = {1: 1.2, 6: 1.7, 7: 1.55, 8: 1.52, 15: 1.8, 16: 1.8}
DEFAULT_RADIUS = 1.5
ATOM_SCALE = 12  # matplotlib marker size scale

structure = load_pdb("tests/fixtures/1crn.pdb")
pos = structure.positions
elems = structure.elements
bonds_arr = structure.bonds
n_atoms = structure.n_atoms
n_bonds = bonds_arr.shape[0]

x = pos[:, 0]
y = pos[:, 1]
z = pos[:, 2]

# Colors and sizes
colors = [CPK_COLORS.get(int(elems[i]), DEFAULT_COLOR) for i in range(n_atoms)]
sizes = [VDW_RADII.get(int(elems[i]), DEFAULT_RADIUS) * ATOM_SCALE for i in range(n_atoms)]

fig = plt.figure(figsize=(16, 9), dpi=120, facecolor="#f0f2f5")
ax = fig.add_subplot(111, projection="3d", facecolor="#f0f2f5")

# Draw bonds
for i in range(n_bonds):
    ai, bi = bonds_arr[i]
    ax.plot(
        [x[ai], x[bi]], [y[ai], y[bi]], [z[ai], z[bi]],
        color="#888888", linewidth=1.0, alpha=0.6, zorder=1,
    )

# Draw atoms
ax.scatter(
    x, y, z,
    c=colors, s=sizes, edgecolors="none",
    alpha=0.95, depthshade=True, zorder=2,
)

# Camera angle
ax.view_init(elev=20, azim=45)

# Clean up axes
ax.set_xlabel("")
ax.set_ylabel("")
ax.set_zlabel("")
ax.set_xticklabels([])
ax.set_yticklabels([])
ax.set_zticklabels([])
ax.grid(False)

# Remove pane backgrounds
ax.xaxis.pane.fill = False
ax.yaxis.pane.fill = False
ax.zaxis.pane.fill = False
ax.xaxis.pane.set_edgecolor("none")
ax.yaxis.pane.set_edgecolor("none")
ax.zaxis.pane.set_edgecolor("none")

# Title
ax.set_title(
    f"megane  ·  Crambin (1CRN)  ·  {n_atoms} atoms / {n_bonds} bonds",
    fontsize=14, fontweight="bold", color="#333333", pad=20,
)

plt.tight_layout()
plt.savefig("screenshots/screenshot_mpl.png", dpi=150, bbox_inches="tight",
            facecolor=fig.get_facecolor(), edgecolor="none")
print(f"Saved: screenshots/screenshot_mpl.png ({n_atoms} atoms, {n_bonds} bonds)")
