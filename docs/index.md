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

<div class="demo-section">
  <div class="demo-header">
    <h2>Try it now</h2>
    <p>Interactive 3D viewer — rotate, zoom, and explore Crambin (1CRN, 327 atoms)</p>
  </div>
  <MoleculeDemo src="/megane/data/1crn.json" height="450px" :autoRotate="true" />
</div>

<style>
.demo-section {
  max-width: 900px;
  margin: 48px auto;
  padding: 0 24px;
}

.demo-header {
  text-align: center;
  margin-bottom: 16px;
}

.demo-header h2 {
  font-size: 1.6rem;
  font-weight: 600;
  margin-bottom: 8px;
}

.demo-header p {
  color: var(--vp-c-text-2);
  font-size: 0.95rem;
}
</style>
