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
export type HeroMode = "molecular" | "protein" | "perovskite" | "quartz";

/** How each mode is rendered:
 *  - "molecular": ball-and-stick atoms
 *  - "polyhedra": atoms + coordination polyhedra overlay (crystals)
 *  - "cartoon":   protein ribbon + translucent molecular-surface mesh overlay */
type ModeKind = "molecular" | "polyhedra" | "cartoon";

const MODE_DATA: Record<HeroMode, { data: string; kind: ModeKind }> = {
  molecular: { data: "caffeine_water", kind: "molecular" },
  protein: { data: "ubiquitin", kind: "cartoon" },
  perovskite: { data: "perovskite_srtio3", kind: "polyhedra" },
  quartz: { data: "quartz_sio2", kind: "polyhedra" },
};

const HERO_BG = 0x0a0c10;

async function fetchSnapshot(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`snapshot ${res.status}`);
  const snap = await res.json();
  const out: any = {
    nAtoms: snap.nAtoms,
    nBonds: snap.nBonds,
    nFileBonds: snap.nFileBonds,
    positions: new Float32Array(snap.positions),
    elements: new Uint8Array(snap.elements),
    bonds: new Uint32Array(snap.bonds),
    bondOrders: snap.bondOrders ? new Uint8Array(snap.bondOrders) : null,
    box: snap.box ? new Float32Array(snap.box) : null,
  };
  // Cα backbone + secondary structure for cartoon-ribbon rendering.
  if (snap.caIndices) {
    out.caIndices = new Uint32Array(snap.caIndices);
    out.caChainIds = new Uint8Array(snap.caChainIds);
    out.caResNums = new Uint32Array(snap.caResNums);
    out.caSsType = new Uint8Array(snap.caSsType);
  }
  return out;
}

export default function HeroViewer({ mode }: { mode: HeroMode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<any>(null);
  const [mounted, setMounted] = useState(false);
  const [ready, setReady] = useState(false);

  const modeInfo = MODE_DATA[mode] ?? MODE_DATA.molecular;
  const resolvedSrc = useBaseUrl(`/data/${modeInfo.data}.json`);
  const kind = modeInfo.kind;

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

  // Load / swap the structure whenever the mode changes (once mounted). The
  // crystal additionally renders VESTA-style coordination polyhedra (TiO6
  // octahedra); the molecular view clears them.
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

        if (kind === "polyhedra") {
          renderer.setRepresentationType?.("atoms");
          const { executePolyhedronGenerator } = await import(
            "../../../src/pipeline/executors/polyhedronGenerator"
          );
          if (cancelled || !rendererRef.current) return;
          const particle: any = {
            type: "particle",
            source: snapshot,
            sourceNodeId: "hero",
            indices: null,
            scaleOverrides: null,
            opacityOverrides: null,
            colorOverrides: null,
          };
          const inputs: any = new Map([["particle", [particle]]]);
          const params: any = {
            type: "polyhedron_generator",
            // Exclude Sr (Z=38) so perovskite shows the classic corner-sharing
            // TiO6 octahedra, not SrO12 cuboctahedra. Harmless for quartz
            // (no Sr present) where Si centers give SiO4 tetrahedra.
            excludedCenters: [38],
            excludedLigands: [],
            cutoffTolerance: 1.15,
            opacity: 0.72,
            showEdges: true,
            edgeColor: "#cfd6df",
            edgeWidth: 2,
          };
          const mesh = executePolyhedronGenerator(params, inputs).get("mesh");
          if (mesh && !cancelled && rendererRef.current) {
            renderer.loadPolyhedra(mesh);
          }
        } else if (kind === "cartoon") {
          // Ribbon backbone + a translucent molecular-surface mesh overlay
          // (reuses the polyhedra overlay slot, which renders any MeshData).
          renderer.setRepresentationType?.("cartoon");
          const { buildSurfaceMeshData } = await import(
            "../../../src/renderer/alphaSurface"
          );
          if (cancelled || !rendererRef.current) return;
          const surface = buildSurfaceMeshData(
            snapshot.positions,
            snapshot.nAtoms,
            3.0,
            "#3ad6c8",
            0.16,
          );
          if (surface && !cancelled && rendererRef.current) {
            renderer.loadPolyhedra(surface);
          }
        } else {
          renderer.setRepresentationType?.("atoms");
          renderer.clearPolyhedra?.();
        }
        setReady(true);
      } catch {
        /* decorative backdrop — ignore load failures */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [mounted, resolvedSrc, mode]);

  return (
    <div
      ref={containerRef}
      className={styles.heroViewer}
      data-ready={ready ? "true" : "false"}
      aria-hidden="true"
    />
  );
}
