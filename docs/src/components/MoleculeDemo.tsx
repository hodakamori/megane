import React, { useRef, useEffect } from "react";
import styles from "./MoleculeDemo.module.css";

interface Props {
  src: string;
  height?: string;
  autoRotate?: boolean;
}

export default function MoleculeDemo({
  src,
  height = "400px",
  autoRotate = false,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    let renderer: any = null;
    let disposed = false;

    (async () => {
      const { MoleculeRenderer } = await import(
        "../../../src/renderer/MoleculeRenderer"
      );
      if (disposed) return;

      renderer = new MoleculeRenderer();
      renderer.mount(container);

      const res = await fetch(src);
      const data = await res.json();
      if (disposed) return;

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

      if (autoRotate) {
        const r = renderer as any;
        if (r.controls) {
          r.controls.autoRotate = true;
          r.controls.autoRotateSpeed = 2.0;
        }
      }
    })();

    return () => {
      disposed = true;
      if (renderer) {
        renderer.dispose();
      }
    };
  }, [src, autoRotate]);

  return (
    <div className={styles.moleculeDemo}>
      <div
        ref={containerRef}
        className={styles.moleculeContainer}
        style={{ height }}
      />
    </div>
  );
}
