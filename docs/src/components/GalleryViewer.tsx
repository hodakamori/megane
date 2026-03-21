import React, { useRef, useEffect, useState } from "react";
import type { GalleryExample } from "../gallery/types";
import styles from "./GalleryViewer.module.css";

type TabId = "jupyter" | "react" | "vscode";

const tabs: { id: TabId; label: string }[] = [
  { id: "jupyter", label: "Jupyter" },
  { id: "react", label: "React" },
  { id: "vscode", label: "VSCode" },
];

interface Props {
  example: GalleryExample;
}

export default function GalleryViewer({ example }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<TabId>("jupyter");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    let renderer: any = null;
    let observer: IntersectionObserver | null = null;
    let unmounted = false;

    async function initPreview() {
      if (!container) return;

      const { MoleculeRenderer } = await import(
        "../../../src/renderer/MoleculeRenderer"
      );
      if (unmounted || !container) return;

      renderer = new MoleculeRenderer();
      renderer.mount(container);

      try {
        const res = await fetch(example.snapshotUrl);
        if (!res.ok) {
          console.error("Failed to load gallery snapshot:", example.snapshotUrl, res.status);
          return;
        }
        if (unmounted) return;
        const data = await res.json();
        if (unmounted) return;

        const snapshot = {
          nAtoms: data.nAtoms,
          nBonds: data.nBonds,
          nFileBonds: data.nFileBonds,
          positions: new Float32Array(data.positions),
          elements: new Uint8Array(data.elements),
          bonds: new Uint32Array(data.bonds),
          bondOrders: data.bondOrders ? new Uint8Array(data.bondOrders) : null,
          box: data.box ? new Float32Array(data.box) : null,
        };

        renderer.loadSnapshot(snapshot);

        const { deserializePipeline } = await import(
          "../../../src/pipeline/serialize"
        );
        const { executePipeline } = await import(
          "../../../src/pipeline/execute"
        );
        const { applyViewportState } = await import(
          "../../../src/pipeline/apply"
        );
        if (unmounted) return;

        const pipeline = JSON.parse(example.code.vscode);
        const { nodes, edges } = deserializePipeline(pipeline);

        const nodeSnapshots: Record<string, any> = {};
        for (const node of nodes) {
          if ((node as any).type === "load_structure") {
            nodeSnapshots[(node as any).id] = {
              snapshot,
              frames: null,
              meta: null,
              labels: null,
            };
          }
        }

        const { viewportState } = executePipeline(nodes, edges, {
          nodeSnapshots,
        });
        applyViewportState(renderer, viewportState, null);
      } catch (error) {
        console.error("Error loading gallery snapshot:", example.snapshotUrl, error);
      }
    }

    observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          observer!.disconnect();
          observer = null;
          initPreview();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(container);

    return () => {
      unmounted = true;
      observer?.disconnect();
      if (renderer) {
        renderer.dispose();
      }
    };
  }, [example]);

  async function copyCode() {
    const code = example.code[activeTab];
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      try {
        const ta = document.createElement("textarea");
        ta.value = code;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      } catch {
        return;
      }
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className={styles.galleryItem} id={example.id}>
      <div className={styles.galleryHeader}>
        <div className={styles.galleryTitleRow}>
          <h3 className={styles.galleryTitle}>{example.title}</h3>
          <div className={styles.galleryTags}>
            {example.tags.map((tag) => (
              <span key={tag} className={styles.galleryTag}>
                {tag}
              </span>
            ))}
          </div>
        </div>
        <p className={styles.galleryDescription}>{example.description}</p>
      </div>

      <div className={styles.galleryBody}>
        <div
          className={styles.galleryPreview}
          ref={containerRef}
          style={{ height: example.height ?? "380px" }}
        />

        <div className={styles.galleryCode}>
          <div className={styles.codeTabs}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`${styles.codeTab} ${activeTab === tab.id ? styles.active : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
            <button className={styles.copyBtn} onClick={copyCode}>
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          {tabs.map((tab) => (
            <pre
              key={tab.id}
              className={styles.codeBlock}
              style={{ display: activeTab === tab.id ? "block" : "none" }}
            >
              <code>{example.code[tab.id]}</code>
            </pre>
          ))}
        </div>
      </div>
    </div>
  );
}
