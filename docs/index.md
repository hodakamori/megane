---
layout: home

hero:
  name: megane
  text: A fast, beautiful molecular viewer
  tagline: Render PDB structures and XTC trajectories in real time. From Jupyter to the browser.
  actions:
    - theme: brand
      text: Get Started
      link: /getting-started
    - theme: alt
      text: API Reference
      link: /api/

features:
  - title: Scales to 1M+ Atoms
    details: Billboard impostor rendering with Three.js delivers real-time performance at any scale — from small molecules to massive protein complexes.
  - title: Jupyter Widget
    details: anywidget-based integration for JupyterLab, Notebook, VS Code, and Colab. Load structures and trajectories directly from Python.
  - title: CLI & Web
    details: Serve structures from the command line with a single command, or embed the React component library in your own web application.
  - title: Rust-Powered Parsing
    details: PDB, GRO, XYZ, MOL, and XTC parsers written in Rust — shared between Python (PyO3) and browser (WASM) for blazing-fast performance.
---

<script setup>
import { useData } from 'vitepress'
</script>

<!-- Full-featured viewer in the hero area -->
<div class="hero-viewer">
  <FullViewerDemo height="500px" />
  <p class="hero-viewer-caption">
    Full-featured viewer with sidebar, appearance panel, and file upload.
    Try dragging a <code>.pdb</code> file onto the viewer.
  </p>
</div>

<style>
.hero-viewer {
  max-width: 1152px;
  margin: -24px auto 48px;
  padding: 0 24px;
}

.hero-viewer-caption {
  text-align: center;
  margin-top: 8px;
  color: var(--vp-c-text-3);
  font-size: 0.85rem;
}

.hero-viewer-caption code {
  font-size: 0.8rem;
  background: var(--vp-c-bg-soft);
  padding: 2px 6px;
  border-radius: 4px;
}
</style>
