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
  - title: Scales to 1M Atoms
    details: Billboard impostor rendering with Three.js InstancedMesh for real-time performance at any scale.
  - title: Jupyter Widget
    details: anywidget-based integration. Load structures and trajectories directly from Python notebooks.
  - title: CLI & Web
    details: Serve structures from the command line, or embed the React component in your own web application.
  - title: Rust-Powered Parsing
    details: PDB, GRO, XYZ, MOL, and XTC parsers shared between Python (PyO3) and browser (WASM).
---
