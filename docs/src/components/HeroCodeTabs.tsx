import React, { useState } from "react";
import styles from "./HeroCodeTabs.module.css";

const installCommands = [
  { label: "pip", command: "pip install megane" },
  { label: "npm", command: "npm install megane-viewer" },
];

const tabs = [
  { label: "Python" },
  { label: "CLI" },
  { label: "React" },
];

export default function HeroCodeTabs() {
  const [activeTab, setActiveTab] = useState(0);
  const [activeInstall, setActiveInstall] = useState(0);

  return (
    <div className={styles.heroCodeTabs}>
      <div className={styles.installBar}>
        <div className={styles.installTabs}>
          {installCommands.map((cmd, i) => (
            <button
              key={cmd.label}
              className={`${styles.installTab} ${activeInstall === i ? styles.active : ""}`}
              onClick={() => setActiveInstall(i)}
            >
              {cmd.label}
            </button>
          ))}
        </div>
        <div className={styles.installCommand}>
          <span className={styles.installPrompt}>$</span>
          <span className={styles.installText}>
            {installCommands[activeInstall].command}
          </span>
        </div>
      </div>

      <div className={styles.tabButtons}>
        {tabs.map((tab, i) => (
          <button
            key={tab.label}
            className={`${styles.tabButton} ${activeTab === i ? styles.active : ""}`}
            onClick={() => setActiveTab(i)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className={styles.tabContent}>
        {activeTab === 0 && (
          <pre><code>
            <span className={styles.kn}>from</span>{" "}
            <span className={styles.nn}>megane</span>{" "}
            <span className={styles.kn}>import</span>{" "}
            <span className={styles.p}>(</span>
            {"\n  "}
            <span className={styles.nc}>Pipeline</span>
            <span className={styles.p}>,</span>{" "}
            <span className={styles.nc}>LoadStructure</span>
            <span className={styles.p}>,</span>{" "}
            <span className={styles.nc}>AddBonds</span>
            <span className={styles.p}>,</span>
            {"\n  "}
            <span className={styles.nc}>Viewport</span>
            <span className={styles.p}>,</span>{" "}
            <span className={styles.nc}>MolecularViewer</span>
            {"\n"}
            <span className={styles.p}>)</span>
            {"\n\n"}
            <span className={styles.n}>pipe</span>{" "}
            <span className={styles.o}>=</span>{" "}
            <span className={styles.nc}>Pipeline</span>
            <span className={styles.p}>()</span>
            {"\n"}
            <span className={styles.n}>s</span>{" "}
            <span className={styles.o}>=</span>{" "}
            <span className={styles.n}>pipe</span>
            <span className={styles.o}>.</span>
            <span className={styles.n}>add_node</span>
            <span className={styles.p}>(</span>
            <span className={styles.nc}>LoadStructure</span>
            <span className={styles.p}>(</span>
            <span className={styles.s}>"protein.pdb"</span>
            <span className={styles.p}>))</span>
            {"\n"}
            <span className={styles.n}>b</span>{" "}
            <span className={styles.o}>=</span>{" "}
            <span className={styles.n}>pipe</span>
            <span className={styles.o}>.</span>
            <span className={styles.n}>add_node</span>
            <span className={styles.p}>(</span>
            <span className={styles.nc}>AddBonds</span>
            <span className={styles.p}>())</span>
            {"\n"}
            <span className={styles.n}>v</span>{" "}
            <span className={styles.o}>=</span>{" "}
            <span className={styles.n}>pipe</span>
            <span className={styles.o}>.</span>
            <span className={styles.n}>add_node</span>
            <span className={styles.p}>(</span>
            <span className={styles.nc}>Viewport</span>
            <span className={styles.p}>())</span>
            {"\n"}
            <span className={styles.n}>pipe</span>
            <span className={styles.o}>.</span>
            <span className={styles.n}>add_edge</span>
            <span className={styles.p}>(</span>
            <span className={styles.n}>s</span>
            <span className={styles.o}>.</span>
            <span className={styles.n}>out</span>
            <span className={styles.o}>.</span>
            <span className={styles.n}>particle</span>
            <span className={styles.p}>,</span>{" "}
            <span className={styles.n}>b</span>
            <span className={styles.o}>.</span>
            <span className={styles.n}>inp</span>
            <span className={styles.o}>.</span>
            <span className={styles.n}>particle</span>
            <span className={styles.p}>)</span>
            {"\n"}
            <span className={styles.n}>pipe</span>
            <span className={styles.o}>.</span>
            <span className={styles.n}>add_edge</span>
            <span className={styles.p}>(</span>
            <span className={styles.n}>s</span>
            <span className={styles.o}>.</span>
            <span className={styles.n}>out</span>
            <span className={styles.o}>.</span>
            <span className={styles.n}>particle</span>
            <span className={styles.p}>,</span>{" "}
            <span className={styles.n}>v</span>
            <span className={styles.o}>.</span>
            <span className={styles.n}>inp</span>
            <span className={styles.o}>.</span>
            <span className={styles.n}>particle</span>
            <span className={styles.p}>)</span>
            {"\n"}
            <span className={styles.n}>pipe</span>
            <span className={styles.o}>.</span>
            <span className={styles.n}>add_edge</span>
            <span className={styles.p}>(</span>
            <span className={styles.n}>b</span>
            <span className={styles.o}>.</span>
            <span className={styles.n}>out</span>
            <span className={styles.o}>.</span>
            <span className={styles.n}>bond</span>
            <span className={styles.p}>,</span>{" "}
            <span className={styles.n}>v</span>
            <span className={styles.o}>.</span>
            <span className={styles.n}>inp</span>
            <span className={styles.o}>.</span>
            <span className={styles.n}>bond</span>
            <span className={styles.p}>)</span>
            {"\n\n"}
            <span className={styles.n}>viewer</span>{" "}
            <span className={styles.o}>=</span>{" "}
            <span className={styles.nc}>MolecularViewer</span>
            <span className={styles.p}>()</span>
            {"\n"}
            <span className={styles.n}>viewer</span>
            <span className={styles.o}>.</span>
            <span className={styles.n}>set_pipeline</span>
            <span className={styles.p}>(</span>
            <span className={styles.n}>pipe</span>
            <span className={styles.p}>)</span>
            {"\n"}
            <span className={styles.n}>viewer</span>
          </code></pre>
        )}
        {activeTab === 1 && (
          <pre><code>
            <span className={styles.c}>$ </span>
            <span className={styles.n}>megane serve protein.pdb</span>
            {"\n\n"}
            <span className={styles.c}>Serving on </span>
            <span className={styles.s}>http://localhost:8765</span>
          </code></pre>
        )}
        {activeTab === 2 && (
          <pre><code>
            <span className={styles.kn}>import</span>{" "}
            <span className={styles.p}>{"{"}</span>{" "}
            <span className={styles.nc}>PipelineViewer</span>
            <span className={styles.p}>,</span>{" "}
            <span className={styles.nc}>Pipeline</span>
            <span className={styles.p}>,</span>
            {"\n  "}
            <span className={styles.nc}>LoadStructure</span>
            <span className={styles.p}>,</span>{" "}
            <span className={styles.nc}>AddBonds</span>
            <span className={styles.p}>,</span>{" "}
            <span className={styles.nc}>ViewportNode</span>{" "}
            <span className={styles.p}>{"}"}</span>{" "}
            <span className={styles.kn}>from</span>{" "}
            <span className={styles.s}>"megane-viewer"</span>
            {"\n\n"}
            <span className={styles.kn}>const</span>{" "}
            <span className={styles.n}>pipe</span>{" "}
            <span className={styles.o}>=</span>{" "}
            <span className={styles.kn}>new</span>{" "}
            <span className={styles.nc}>Pipeline</span>
            <span className={styles.p}>()</span>
            {"\n"}
            <span className={styles.kn}>const</span>{" "}
            <span className={styles.n}>s</span>{" "}
            <span className={styles.o}>=</span>{" "}
            <span className={styles.n}>pipe</span>
            <span className={styles.o}>.</span>
            <span className={styles.n}>addNode</span>
            <span className={styles.p}>(</span>
            <span className={styles.kn}>new</span>{" "}
            <span className={styles.nc}>LoadStructure</span>
            <span className={styles.p}>(</span>
            <span className={styles.s}>"protein.pdb"</span>
            <span className={styles.p}>))</span>
            {"\n"}
            <span className={styles.kn}>const</span>{" "}
            <span className={styles.n}>b</span>{" "}
            <span className={styles.o}>=</span>{" "}
            <span className={styles.n}>pipe</span>
            <span className={styles.o}>.</span>
            <span className={styles.n}>addNode</span>
            <span className={styles.p}>(</span>
            <span className={styles.kn}>new</span>{" "}
            <span className={styles.nc}>AddBonds</span>
            <span className={styles.p}>())</span>
            {"\n"}
            <span className={styles.kn}>const</span>{" "}
            <span className={styles.n}>v</span>{" "}
            <span className={styles.o}>=</span>{" "}
            <span className={styles.n}>pipe</span>
            <span className={styles.o}>.</span>
            <span className={styles.n}>addNode</span>
            <span className={styles.p}>(</span>
            <span className={styles.kn}>new</span>{" "}
            <span className={styles.nc}>ViewportNode</span>
            <span className={styles.p}>())</span>
            {"\n\n"}
            <span className={styles.n}>pipe</span>
            <span className={styles.o}>.</span>
            <span className={styles.n}>addEdge</span>
            <span className={styles.p}>(</span>
            <span className={styles.n}>s</span>
            <span className={styles.o}>.</span>
            <span className={styles.n}>out</span>
            <span className={styles.o}>.</span>
            <span className={styles.n}>particle</span>
            <span className={styles.p}>,</span>{" "}
            <span className={styles.n}>b</span>
            <span className={styles.o}>.</span>
            <span className={styles.n}>inp</span>
            <span className={styles.o}>.</span>
            <span className={styles.n}>particle</span>
            <span className={styles.p}>)</span>
            {"\n"}
            <span className={styles.n}>pipe</span>
            <span className={styles.o}>.</span>
            <span className={styles.n}>addEdge</span>
            <span className={styles.p}>(</span>
            <span className={styles.n}>s</span>
            <span className={styles.o}>.</span>
            <span className={styles.n}>out</span>
            <span className={styles.o}>.</span>
            <span className={styles.n}>particle</span>
            <span className={styles.p}>,</span>{" "}
            <span className={styles.n}>v</span>
            <span className={styles.o}>.</span>
            <span className={styles.n}>inp</span>
            <span className={styles.o}>.</span>
            <span className={styles.n}>particle</span>
            <span className={styles.p}>)</span>
            {"\n"}
            <span className={styles.n}>pipe</span>
            <span className={styles.o}>.</span>
            <span className={styles.n}>addEdge</span>
            <span className={styles.p}>(</span>
            <span className={styles.n}>b</span>
            <span className={styles.o}>.</span>
            <span className={styles.n}>out</span>
            <span className={styles.o}>.</span>
            <span className={styles.n}>bond</span>
            <span className={styles.p}>,</span>{" "}
            <span className={styles.n}>v</span>
            <span className={styles.o}>.</span>
            <span className={styles.n}>inp</span>
            <span className={styles.o}>.</span>
            <span className={styles.n}>bond</span>
            <span className={styles.p}>)</span>
            {"\n\n"}
            <span className={styles.o}>{"<"}</span>
            <span className={styles.nc}>PipelineViewer</span>{" "}
            <span className={styles.na}>pipeline</span>
            <span className={styles.o}>{"={"}</span>
            <span className={styles.n}>pipe</span>
            <span className={styles.o}>.</span>
            <span className={styles.n}>toObject</span>
            <span className={styles.p}>()</span>
            <span className={styles.o}>{"}"}</span>{" "}
            <span className={styles.o}>{"/>"}</span>
          </code></pre>
        )}
      </div>
    </div>
  );
}
