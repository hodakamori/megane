---
layout: home

hero:
  name: megane
  text: "Desktop-grade molecular visualization.\nRight in your browser."
  tagline: "Rust-powered rendering at 1M+ atoms. pip install megane — 3 lines to your first structure."
  actions:
    - theme: brand
      text: Get Started
      link: /getting-started
    - theme: alt
      text: GitHub
      link: https://github.com/hodakamori/megane

features:
  - title: 1M+ Atoms at 60fps
    details: Billboard impostor rendering with WebGL handles massive protein complexes in real time — no desktop app required.
  - title: Jupyter, CLI, React
    details: One pip install. Use as a Jupyter widget, serve from the command line, or embed the React component in your own app.
  - title: Rust + WASM
    details: PDB, GRO, XYZ, MOL, and XTC parsers in Rust — shared between Python (PyO3) and browser (WASM). Parse once, run anywhere.
  - title: Trajectory Streaming
    details: Stream XTC trajectories over WebSocket in real time. Scrub through thousands of frames without loading everything into memory.
---
