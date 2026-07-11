import React, { useEffect, useRef, useState } from "react";
import useBaseUrl from "@docusaurus/useBaseUrl";
import styles from "./HeroViewer.module.css";

/**
 * HeroViewer — the landing hero's live, auto-rotating structure.
 *
 * It mounts the real `MoleculeRenderer` (the same viewer the docs and Gallery
 * use) as a non-interactive dark backdrop: the WebGL context is created lazily
 * once the hero scrolls into view AND the browser is idle, so it never blocks
 * first paint / LCP. The mode buttons swap the loaded structure.
 *
 * Colors are literal (not --ifm-* tokens): the hero is always dark regardless
 * of the docs color mode.
 */
export type HeroMode = "trajectory" | "pipeline";

const MODE_DATA: Record<HeroMode, string> = {
  trajectory: "caffeine_traj",
  pipeline: "caffeine_water",
};

const HERO_BG = 0x0a0c10;

interface FrameData {
  positions: Float32Array;
  nAtoms: number;
  frameId: number;
}

export default function HeroViewer({ mode }: { mode: HeroMode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  const dataName = MODE_DATA[mode] ?? MODE_DATA.trajectory;
  const resolvedSrc = useBaseUrl(`/data/${dataName}.json`);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const container = containerRef.current;
    if (!container) return;

    let renderer: any = null;
    let observer: IntersectionObserver | null = null;
    let playInterval: ReturnType<typeof setInterval> | null = null;
    let idleHandle: number | null = null;
    let unmounted = false;

    setReady(false);

    const prefersReducedMotion =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

    async function initPreview() {
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

      try {
        const res = await fetch(resolvedSrc);
        if (!res.ok || unmounted) return;
        const snap = await res.json();
        if (unmounted) return;

        const snapshot = {
          nAtoms: snap.nAtoms,
          nBonds: snap.nBonds,
          nFileBonds: snap.nFileBonds,
          positions: new Float32Array(snap.positions),
          elements: new Uint8Array(snap.elements),
          bonds: new Uint32Array(snap.bonds),
          bondOrders: snap.bondOrders ? new Uint8Array(snap.bondOrders) : null,
          box: snap.box ? new Float32Array(snap.box) : null,
        };
        renderer.loadSnapshot(snapshot);
        // setBackgroundColor again — loadSnapshot may reset the clear color.
        renderer.setBackgroundColor(HERO_BG);
        setReady(true);

        // Auto-play trajectories (no Timeline UI on the hero).
        if (!prefersReducedMotion && snap.frames && snap.frames.length > 1) {
          const frames: FrameData[] = snap.frames.map((f: any, i: number) => ({
            positions: new Float32Array(f.positions),
            nAtoms: snap.nAtoms,
            frameId: i,
          }));
          let idx = 0;
          playInterval = setInterval(() => {
            if (unmounted || !renderer) return;
            idx = (idx + 1) % frames.length;
            renderer.updateFrame(frames[idx]);
          }, 1000 / 12);
        }
      } catch {
        /* leave the static hero copy — the backdrop is decorative */
      }
    }

    function scheduleInit() {
      const ric: typeof window.requestIdleCallback | undefined =
        (window as any).requestIdleCallback;
      if (ric) {
        idleHandle = ric(() => initPreview(), { timeout: 1200 });
      } else {
        idleHandle = window.setTimeout(() => initPreview(), 300) as any;
      }
    }

    observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          observer?.disconnect();
          observer = null;
          scheduleInit();
        }
      },
      { rootMargin: "100px" },
    );
    observer.observe(container);

    return () => {
      unmounted = true;
      observer?.disconnect();
      if (playInterval) clearInterval(playInterval);
      if (idleHandle != null) {
        const cic: typeof window.cancelIdleCallback | undefined =
          (window as any).cancelIdleCallback;
        if (cic) cic(idleHandle);
        else clearTimeout(idleHandle);
      }
      if (renderer) renderer.dispose();
    };
  }, [resolvedSrc]);

  return (
    <div
      ref={containerRef}
      className={styles.heroViewer}
      data-ready={ready ? "true" : "false"}
      aria-hidden="true"
    />
  );
}
