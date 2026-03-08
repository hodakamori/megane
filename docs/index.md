---
layout: home

hero:
  name: megane
  text: "Spectacles for atomistic data."
  image:
    src: /logo.png
    alt: megane
  tagline: "1M+ atoms at 60fps. Visual pipelines. Jupyter, browser, React, VSCode."
  actions:
    - theme: brand
      text: Get Started
      link: /getting-started
    - theme: alt
      text: Live Demo
      link: /demo
    - theme: alt
      text: GitHub
      link: https://github.com/hodakamori/megane

features:
  - title: "\U0001F680 1M+ Atoms at 60fps"
    details: Billboard impostor rendering scales from small molecules to massive protein complexes in real time. Stream XTC trajectories over WebSocket — scrub thousands of frames without loading everything into memory.
  - title: "\U0001F30D Runs Everywhere"
    details: "Jupyter widget, CLI server, React component, VSCode extension. Same Rust parsers shared between Python (PyO3) and browser (WASM): parse once, run anywhere."
  - title: "\U0001F9E9 Visual Pipeline Editor"
    details: Build visualization workflows by wiring nodes — filter atoms, adjust styles, generate labels, render coordination polyhedra. No code required. Typed data flows through color-coded edges.
  - title: "\U0001F517 Embed & Integrate"
    details: Control the viewer from Plotly via ipywidgets events. Embed in MDX / Next.js docs. React to frame_change, selection_change, and measurement events. Use the framework-agnostic renderer from Vue, Svelte, or vanilla JS.
---

<div class="pillar-section">

## Scale

megane renders over **1 million atoms at 60fps** in the browser. Small systems get high-quality InstancedMesh spheres and cylinders; large systems automatically switch to GPU-accelerated billboard impostors. No desktop app, no plugin — just a browser tab.

Trajectory streaming works over WebSocket via a binary protocol. Load an XTC file and scrub through thousands of frames in real time, without reading everything into memory.

</div>

<div class="pillar-section">

## Anywhere

<div class="pillar-two-col">
  <div class="pillar-text">

One codebase, every environment.

| Environment | How | Install |
|---|---|---|
| **Jupyter** | anywidget inline viewer | `pip install megane` |
| **Browser** | `megane serve` local server | `pip install megane` |
| **React** | `<MeganeViewer />` component | `npm install megane-viewer` |
| **VSCode** | Custom editor for .pdb, .gro, .xyz | Extension |

The secret: PDB, GRO, XYZ, MOL, and XTC parsers are written in **Rust** and compiled to both **PyO3** (Python) and **WASM** (browser). Parse once, run anywhere.

  </div>
  <div class="pillar-images">
    <img src="/screenshots/jupyter.png" alt="megane in Jupyter Notebook" />
    <img src="/screenshots/browser-trajectory.png" alt="megane in browser" />
    <img src="/screenshots/vscode.png" alt="megane in VSCode" />
  </div>
</div>

</div>

<div class="pillar-section">

## Visual Pipelines

<div class="pillar-two-col">
  <div class="pillar-text">

Wire nodes to build visualization workflows — no code required.

**8 node types** across 5 categories: load data, add bonds, filter atoms by query, modify scale and opacity per-group, generate labels, render coordination polyhedra, and display in a 3D viewport.

**6 typed data channels** — particle, bond, cell, label, mesh, trajectory — flow through color-coded edges. Only matching types can connect.

Pipelines serialize to JSON, so you can save, share, and version-control your visualization recipes.

  </div>
  <div class="pillar-images">
    <img src="/screenshots/pipeline-complex.png" alt="Visual Pipeline Editor with complex workflow" />
    <img src="/screenshots/pipeline-polyhedra.png" alt="Visual Pipeline Editor with polyhedra rendering" />
  </div>
</div>

</div>

<div class="pillar-section">

## Integrate

megane is not a walled garden. It fits into your existing workflow.

**Plotly** — Click a point on a Plotly `FigureWidget` to jump to a trajectory frame. Use megane's `on_event("frame_change")` callback to update Plotly markers in sync.

**MDX / Next.js** — Drop `<MeganeViewer />` or `<Viewport />` into your `.mdx` documentation. WASM parsing works out of the box with a one-line webpack config.

**ipywidgets** — React to `frame_change`, `selection_change`, and `measurement` events. Compose megane with any widget in the Jupyter ecosystem.

**Framework-agnostic** — `MoleculeRenderer` is a plain Three.js class. Mount it in Vue, Svelte, or a vanilla `<div>`.

</div>
