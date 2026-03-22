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
            <span className={styles.kn}>import</span>{" "}
            <span className={styles.nn}>megane</span>
            {"\n\n"}
            <span className={styles.c}># One-liner to view a structure</span>
            {"\n"}
            <span className={styles.n}>viewer</span>{" "}
            <span className={styles.o}>=</span>{" "}
            <span className={styles.n}>megane</span>
            <span className={styles.o}>.</span>
            <span className={styles.n}>view</span>
            <span className={styles.p}>(</span>
            <span className={styles.s}>"protein.pdb"</span>
            <span className={styles.p}>)</span>
            {"\n"}
            <span className={styles.n}>viewer</span>
            {"\n\n"}
            <span className={styles.c}># With trajectory</span>
            {"\n"}
            <span className={styles.n}>viewer</span>{" "}
            <span className={styles.o}>=</span>{" "}
            <span className={styles.n}>megane</span>
            <span className={styles.o}>.</span>
            <span className={styles.n}>view_traj</span>
            <span className={styles.p}>(</span>
            <span className={styles.s}>"protein.pdb"</span>
            <span className={styles.p}>,</span>{" "}
            <span className={styles.na}>xtc</span>
            <span className={styles.o}>=</span>
            <span className={styles.s}>"trajectory.xtc"</span>
            <span className={styles.p}>)</span>
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
            <span className={styles.nc}>PipelineViewer</span>{" "}
            <span className={styles.p}>{"}"}</span>{" "}
            <span className={styles.kn}>from</span>{" "}
            <span className={styles.s}>"megane-viewer"</span>
            {"\n\n"}
            <span className={styles.kn}>export default</span>{" "}
            <span className={styles.kn}>function</span>{" "}
            <span className={styles.nc}>App</span>
            <span className={styles.p}>()</span>{" "}
            <span className={styles.p}>{"{"}</span>
            {"\n  "}
            <span className={styles.kn}>return</span>{" "}
            <span className={styles.p}>(</span>
            {"\n    "}
            <span className={styles.o}>{"<"}</span>
            <span className={styles.nc}>PipelineViewer</span>
            {"\n      "}
            <span className={styles.na}>pipeline</span>
            <span className={styles.o}>{"={"}</span>
            <span className={styles.n}>pipeline</span>
            <span className={styles.o}>{"}"}</span>
            {"\n      "}
            <span className={styles.na}>width</span>
            <span className={styles.o}>=</span>
            <span className={styles.s}>"100%"</span>
            {"\n      "}
            <span className={styles.na}>height</span>
            <span className={styles.o}>{"={"}</span>
            <span className={styles.n}>500</span>
            <span className={styles.o}>{"}"}</span>
            {"\n    "}
            <span className={styles.o}>{"/>"}</span>
            {"\n  "}
            <span className={styles.p}>)</span>
            {"\n"}
            <span className={styles.p}>{"}"}</span>
          </code></pre>
        )}
      </div>
    </div>
  );
}
