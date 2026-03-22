import React from "react";
import Layout from "@theme/Layout";
import BrowserOnly from "@docusaurus/BrowserOnly";
import FullViewerDemo from "../components/FullViewerDemo";

export default function DemoPage() {
  return (
    <Layout title="Live Demo" description="Try megane directly in your browser">
      <main className="container margin-vert--lg">
        <h1>Live Demo</h1>
        <p>Try megane directly in your browser — no installation required.</p>

        <BrowserOnly>{() => <FullViewerDemo height="700px" />}</BrowserOnly>

        <h2>Controls</h2>
        <table>
          <thead>
            <tr>
              <th>Action</th>
              <th>Mouse</th>
              <th>Trackpad</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Rotate</td>
              <td>Left drag</td>
              <td>Two-finger drag</td>
            </tr>
            <tr>
              <td>Pan</td>
              <td>Right drag</td>
              <td>Shift + two-finger drag</td>
            </tr>
            <tr>
              <td>Zoom</td>
              <td>Scroll wheel</td>
              <td>Pinch</td>
            </tr>
            <tr>
              <td>Select atom</td>
              <td>Click</td>
              <td>Click</td>
            </tr>
            <tr>
              <td>Measure</td>
              <td>Click 2–4 atoms</td>
              <td>Click 2–4 atoms</td>
            </tr>
          </tbody>
        </table>

        <h2>What to Try</h2>
        <ol>
          <li><strong>Upload a structure</strong> — Drag &amp; drop a PDB, GRO, XYZ, or MOL file</li>
          <li><strong>Open the pipeline editor</strong> — Click the pipeline icon in the sidebar to build visualization workflows</li>
          <li><strong>Try a template</strong> — Use the Templates dropdown in the pipeline editor to load a pre-built pipeline</li>
          <li><strong>Measure distances</strong> — Click two atoms to measure the distance between them</li>
        </ol>
      </main>
    </Layout>
  );
}
