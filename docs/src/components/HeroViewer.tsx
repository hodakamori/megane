import React, { useEffect, useRef, useState } from "react";
import useBaseUrl from "@docusaurus/useBaseUrl";
import styles from "./HeroViewer.module.css";

/**
 * HeroViewer — the landing hero's live, auto-rotating structure.
 *
 * It mounts the real `MoleculeRenderer` (the same viewer the docs and Gallery
 * use) as a non-interactive dark backdrop: the WebGL context is created lazily
 * once the hero scrolls into view AND the browser is idle, so it never blocks
 * first paint / LCP. The renderer is mounted ONCE; changing `mode` only swaps
 * the loaded structure (no context teardown), so the landing can cycle between
 * structures over time without GPU churn.
 *
 * Colors are literal (not --ifm-* tokens): the hero is always dark regardless
 * of the docs color mode.
 */
export type HeroMode = "molecular" | "crystal";

const MODE_DATA: Record<HeroMode, string> = {
  molecular: "caffeine_water",
  crystal: "perovskite_srtio3",
};

const HERO_BG = 0x0a0c10;

async function fetchSnapshot(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`snapshot ${res.status}`);
  const snap = await res.json();
  return {
    nAtoms: snap.nAtoms,
    nBonds: snap.nBonds,
    nFileBonds: snap.nFileBonds,
    positions: new Float32Array(snap.positions),
    elements: new Uint8Array(snap.elements),
    bonds: new Uint32Array(snap.bonds),
    bondOrders: snap.bondOrders ? new Uint8Array(snap.bondOrders) : null,
    box: snap.box ? new Float32Array(snap.box) : null,
  };
}

export default function HeroViewer({ mode }: { mode: HeroMode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<any>(null);
  const [mounted, setMounted] = useState(false);
  const [ready, setReady] = useState(false);

  const dataName = MODE_DATA[mode] ?? MODE_DATA.molecular;
  const resolvedSrc = useBaseUrl(`/data/${dataName}.json`);

  // Mount the renderer once (lazy: on intersection + idle).
  useEffect(() => {
    if (typeof window === "undefined") return;
    const container = containerRef.current;
    if (!container) return;

    let renderer: any = null;
    let observer: IntersectionObserver | null = null;
    let idleHandle: number | null = null;
    let unmounted = false;

    const prefersReducedMotion =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

    async function init() {
      if (unmounted || !container) return;
      const { MoleculeRenderer } = await import(
        "../../../src/renderer/MoleculeRenderer"
      );
      if (unmounted || !container) return;

      renderer = new MoleculeRenderer();
      renderer.mount(container);
      renderer.setBackgroundColor(HERO_BG);

      // Backdrop, not a control surface.
      if (renderer.controls) {
        renderer.controls.enabled = false;
        if (!prefersReducedMotion) {
          renderer.controls.autoRotate = true;
          renderer.controls.autoRotateSpeed = 1.4;
        }
      }
      rendererRef.current = renderer;
      setMounted(true);
    }

    function schedule() {
      const ric: typeof window.requestIdleCallback | undefined = (window as any)
        .requestIdleCallback;
      if (ric) idleHandle = ric(() => init(), { timeout: 1200 });
      else idleHandle = window.setTimeout(() => init(), 300) as any;
    }

    observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          observer?.disconnect();
          observer = null;
          schedule();
        }
      },
      { rootMargin: "100px" },
    );
    observer.observe(container);

    return () => {
      unmounted = true;
      observer?.disconnect();
      if (idleHandle != null) {
        const cic: typeof window.cancelIdleCallback | undefined = (window as any)
          .cancelIdleCallback;
        if (cic) cic(idleHandle);
        else clearTimeout(idleHandle);
      }
      if (renderer) renderer.dispose();
      rendererRef.current = null;
    };
  }, []);

  // Load / swap the structure whenever the mode's source changes (once mounted).
  useEffect(() => {
    if (!mounted) return;
    let cancelled = false;
    (async () => {
      const renderer = rendererRef.current;
      if (!renderer) return;
      try {
        const snapshot = await fetchSnapshot(resolvedSrc);
        if (cancelled || !rendererRef.current) return;
        renderer.loadSnapshot(snapshot);
        // loadSnapshot may reset the clear color — keep the dark hero bg.
        renderer.setBackgroundColor(HERO_BG);
        setReady(true);
      } catch {
        /* decorative backdrop — ignore load failures */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [mounted, resolvedSrc]);

  return (
    <div
      ref={containerRef}
      className={styles.heroViewer}
      data-ready={ready ? "true" : "false"}
      aria-hidden="true"
    />
  );
}
