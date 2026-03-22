import React from "react";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import HeroCodeTabs from "../components/HeroCodeTabs";
import FullViewerDemo from "../components/FullViewerDemo";
import BrowserOnly from "@docusaurus/BrowserOnly";
import styles from "./index.module.css";

function Hero() {
  return (
    <header className={styles.hero}>
      <div className={styles.heroInner}>
        <div className={styles.heroText}>
          <h1 className={styles.heroTitle}>megane</h1>
          <p className={styles.heroTagline}>
            Spectacles for atomistic data.
          </p>
          <p className={styles.heroSubtitle}>
            1M+ atoms at 60fps. Visual pipelines. Jupyter, browser, React, VSCode.
          </p>
          <div className={styles.heroActions}>
            <Link className="button button--primary button--lg" to="/getting-started">
              Get Started
            </Link>
            <Link className="button button--secondary button--lg" to="/demo">
              Live Demo
            </Link>
            <Link
              className="button button--secondary button--lg"
              href="https://github.com/hodakamori/megane"
            >
              GitHub
            </Link>
          </div>
          <HeroCodeTabs />
        </div>
        <div className={styles.heroViewer}>
          <div className={styles.heroViewerDesktop}>
            <BrowserOnly>{() => <FullViewerDemo height="600px" />}</BrowserOnly>
          </div>
          <div className={styles.heroViewerMobile}>
            <div className={styles.mobileDemoCard}>
              <div className={styles.mobileDemoIcon}>🧪</div>
              <p className={styles.mobileDemoText}>Interactive 3D molecular viewer</p>
              <Link className="button button--primary" to="/demo">
                Try Demo
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

const paths = [
  {
    icon: "🔬",
    title: "Python / Jupyter",
    install: "pip install megane",
    isCommand: true,
    description: "Interactive widget inside Jupyter notebooks. Build pipelines in Python, display structures inline.",
    href: "/guide/jupyter",
    label: "Jupyter Guide",
  },
  {
    icon: "🌐",
    title: "Web / React",
    install: "npm install megane-viewer",
    isCommand: true,
    description: "Drop <MeganeViewer /> into any React app. Build pipelines with the TypeScript builder API.",
    href: "/guide/web",
    label: "React Guide",
  },
  {
    icon: "💻",
    title: "CLI Server",
    install: "docker run hodakamori/megane",
    isCommand: true,
    description: "Serve local structure files and view them instantly in the browser. No code needed.",
    href: "/guide/cli",
    label: "CLI Guide",
  },
  {
    icon: "🧩",
    title: "Visual Pipeline",
    install: "Drag-and-drop, no code required",
    isCommand: false,
    description: "Wire nodes in the browser or VSCode to build visualization pipelines. Powered by AI generation.",
    href: "/guide/pipeline",
    label: "Pipeline Guide",
  },
];

function QuickStartPaths() {
  return (
    <section className={styles.quickStart}>
      <div className={styles.quickStartInner}>
        <h2 className={styles.quickStartTitle}>Start in your environment</h2>
        <p className={styles.quickStartSubtitle}>
          megane works everywhere — pick your entry point.
        </p>
        <div className={styles.pathGrid}>
          {paths.map((p) => (
            <Link key={p.href} className={styles.pathCard} to={p.href}>
              <div className={styles.pathIcon}>{p.icon}</div>
              <h3 className={styles.pathTitle}>{p.title}</h3>
              {p.isCommand ? (
                <code className={styles.pathInstall}>{p.install}</code>
              ) : (
                <span className={styles.pathInstall}>{p.install}</span>
              )}
              <p className={styles.pathDesc}>{p.description}</p>
              <span className={styles.pathLink}>{p.label} →</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  const features = [
    {
      title: "🚀 1M+ Atoms at 60fps",
      description:
        "Billboard impostor rendering scales from small molecules to massive protein complexes in real time. Stream XTC trajectories over WebSocket — scrub thousands of frames without loading everything into memory.",
    },
    {
      title: "🌍 Runs Everywhere",
      description:
        "Jupyter widget, CLI server, React component, VSCode extension. Rust parsers (PDB, GRO, XYZ, MOL, CIF, XTC, LAMMPS, .traj) shared between Python (PyO3) and browser (WASM): parse once, run anywhere.",
    },
    {
      title: "🧩 Visual Pipeline Editor",
      description:
        "Build visualization workflows by wiring 11 node types — load data, filter atoms, adjust styles, generate labels, render coordination polyhedra, overlay vectors. No code required. 7 typed data channels flow through color-coded edges. An AI generator can build pipelines from natural language.",
    },
    {
      title: "🔗 Embed & Integrate",
      description:
        "Control the viewer from Plotly via ipywidgets events. Embed in MDX / Next.js docs. React to frame_change, selection_change, and measurement events. Use the framework-agnostic renderer from Vue, Svelte, or vanilla JS.",
    },
  ];

  return (
    <section className={styles.features}>
      <div className={styles.featuresGrid}>
        {features.map((f, i) => (
          <div key={i} className={styles.featureCard}>
            <h3>{f.title}</h3>
            <p>{f.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function PillarSection() {
  return (
    <div className={styles.pillars}>
      <section className="pillar-section">
        <h2>Scale</h2>
        <p>
          megane renders over <strong>1 million atoms at 60fps</strong> in the browser.
          Small systems get high-quality InstancedMesh spheres and cylinders; large systems
          automatically switch to GPU-accelerated billboard impostors. No desktop app,
          no plugin — just a browser tab.
        </p>
        <p>
          Trajectory streaming works over WebSocket via a binary protocol. Load an XTC
          file and scrub through thousands of frames in real time, without reading
          everything into memory.
        </p>
      </section>

      <section className="pillar-section">
        <h2>Anywhere</h2>
        <div className="pillar-two-col">
          <div className="pillar-text">
            <p>One codebase, every environment.</p>
            <table>
              <thead>
                <tr>
                  <th>Environment</th>
                  <th>How</th>
                  <th>Install</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Jupyter</strong></td>
                  <td>anywidget inline viewer</td>
                  <td><code>pip install megane</code></td>
                </tr>
                <tr>
                  <td><strong>Browser</strong></td>
                  <td><code>megane serve</code> local server</td>
                  <td><code>pip install megane</code></td>
                </tr>
                <tr>
                  <td><strong>React</strong></td>
                  <td><code>{"<MeganeViewer />"}</code> component</td>
                  <td><code>npm install megane-viewer</code></td>
                </tr>
                <tr>
                  <td><strong>VSCode</strong></td>
                  <td>Custom editor for .pdb, .gro, .xyz, .mol, .sdf, .cif</td>
                  <td>Extension</td>
                </tr>
              </tbody>
            </table>
            <p>
              The secret: PDB, GRO, XYZ, MOL, CIF, XTC, LAMMPS, and ASE .traj parsers
              are written in <strong>Rust</strong> and compiled to both <strong>PyO3</strong>{" "}
              (Python) and <strong>WASM</strong> (browser). Parse once, run anywhere.
            </p>
          </div>
          <div className="pillar-images single-col">
            <img src="/megane/screenshots/jupyter.png" alt="megane in Jupyter Notebook" />
          </div>
        </div>
      </section>

      <section className="pillar-section">
        <h2>Visual Pipelines</h2>
        <div className="pillar-two-col">
          <div className="pillar-text">
            <p>Wire nodes to build visualization workflows — no code required.</p>
            <p>
              <strong>11 node types</strong> across 5 categories: load data (structure,
              trajectory, streaming, vector), process (filter, modify), overlay (bonds,
              labels, polyhedra, vectors), and display in a 3D viewport.
            </p>
            <p>
              <strong>7 typed data channels</strong> — particle, bond, cell, label, mesh,
              trajectory, vector — flow through color-coded edges. Only matching types
              can connect.
            </p>
            <p>
              Pipelines serialize to JSON, so you can save, share, and version-control
              your visualization recipes.
            </p>
          </div>
          <div className="pillar-images single-col">
            <img src="/megane/screenshots/pipeline-editor.png" alt="Visual Pipeline Editor" />
          </div>
        </div>
      </section>

      <section className="pillar-section">
        <h2>Integrate</h2>
        <p>megane is not a walled garden. It fits into your existing workflow.</p>
        <p>
          <strong>Plotly</strong> — Click a point on a Plotly FigureWidget to jump to a
          trajectory frame. Use megane's <code>on_event("frame_change")</code> callback to
          update Plotly markers in sync.
        </p>
        <p>
          <strong>MDX / Next.js</strong> — Drop <code>{"<MeganeViewer />"}</code> or{" "}
          <code>{"<Viewport />"}</code> into your <code>.mdx</code> documentation. WASM
          parsing works out of the box with a one-line webpack config.
        </p>
        <p>
          <strong>ipywidgets</strong> — React to <code>frame_change</code>,{" "}
          <code>selection_change</code>, and <code>measurement</code> events. Compose
          megane with any widget in the Jupyter ecosystem.
        </p>
        <p>
          <strong>Framework-agnostic</strong> — <code>MoleculeRenderer</code> is a plain
          Three.js class. Mount it in Vue, Svelte, or a vanilla <code>{"<div>"}</code>.
        </p>
      </section>
    </div>
  );
}

export default function Home(): React.JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title={siteConfig.title} description={siteConfig.tagline}>
      <Hero />
      <main>
        <QuickStartPaths />
        <Features />
        <div className="container">
          <PillarSection />
        </div>
      </main>
    </Layout>
  );
}
