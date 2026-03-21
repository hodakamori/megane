import React, { useState } from "react";
import styles from "./HeroCodeTabs.module.css";

const installCommands = [
  { label: "pip", command: "pip install megane" },
  { label: "npm", command: "npm install megane" },
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
            <span className={styles.n}>viewer</span>{" "}
            <span className={styles.o}>=</span>{" "}
            <span className={styles.n}>megane</span>
            <span className={styles.o}>.</span>
            <span className={styles.n}>MolecularViewer</span>
            <span className={styles.p}>()</span>
            {"\n"}
            <span className={styles.n}>viewer</span>
            <span className={styles.o}>.</span>
            <span className={styles.n}>load</span>
            <span className={styles.p}>(</span>
            <span className={styles.s}>"protein.pdb"</span>
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
            <span className={styles.n}>useMeganeLocal</span>
            <span className={styles.p}>,</span>{" "}
            <span className={styles.nc}>MeganeViewer</span>{" "}
            <span className={styles.p}>{"}"}</span>{" "}
            <span className={styles.kn}>from</span>{" "}
            <span className={styles.s}>"megane"</span>
            {"\n\n"}
            <span className={styles.kn}>const</span>{" "}
            <span className={styles.n}>mol</span>{" "}
            <span className={styles.o}>=</span>{" "}
            <span className={styles.n}>useMeganeLocal</span>
            <span className={styles.p}>()</span>
            {"\n"}
            <span className={styles.n}>mol</span>
            <span className={styles.o}>.</span>
            <span className={styles.n}>loadFile</span>
            <span className={styles.p}>(</span>
            <span className={styles.s}>"protein.pdb"</span>
            <span className={styles.p}>)</span>
            {"\n\n"}
            <span className={styles.o}>{"<"}</span>
            <span className={styles.nc}>MeganeViewer</span>{" "}
            <span className={styles.na}>snapshot</span>
            <span className={styles.o}>{"="}</span>
            <span className={styles.p}>{"{"}</span>
            <span className={styles.n}>mol</span>
            <span className={styles.o}>.</span>
            <span className={styles.n}>snapshot</span>
            <span className={styles.p}>{"}"}</span>{" "}
            <span className={styles.o}>{"/>"}</span>
          </code></pre>
        )}
      </div>
    </div>
  );
}
