import React, { useRef, useEffect, useState } from "react";
import useBaseUrl from "@docusaurus/useBaseUrl";
import { Timeline } from "../../../src/components/Timeline";
import styles from "./LiveViewer.module.css";

/**
 * LiveViewer — an inline, real 3D megane preview for use inside guides.
 *
 * Unlike <FullViewerDemo> (which embeds the whole app in an iframe), this
 * mounts the actual `MoleculeRenderer` directly from the viewer source, the
 * same way the Gallery does. It is lazy: the WebGL context is only created
 * once the block scrolls into view, so a page can host several without a
 * startup cost.
 *
 * Usage in MDX:
 *
 *   import LiveViewer from "@site/src/components/LiveViewer";
 *
 *   <LiveViewer data="1crn" caption="Crambin (PDB 1CRN)" />
 *   <LiveViewer data="caffeine_traj" height="420px" />
 *
 * `data` is a snapshot name under docs/public/data/ (the same assets the
 * Gallery uses). Pass `src` instead for a fully-qualified URL, or `pipeline`
 * (a SerializedPipeline object/JSON string) to apply camera + representation
 * state on top of the loaded structure.
 */
interface LiveViewerProps {
  /** Snapshot name under docs/public/data/ (without the .json extension). */
  data?: string;
  /** Fully-qualified snapshot URL. Overrides `data` when both are given. */
  src?: string;
  /** Optional SerializedPipeline (object or JSON string) for camera/representation. */
  pipeline?: string | Record<string, unknown>;
  /** CSS height of the canvas area. Default "360px". */
  height?: string;
  /** Optional caption rendered under the viewer. */
  caption?: string;
}

interface FrameData {
  positions: Float32Array;
  nAtoms: number;
  frameId: number;
}

export default function LiveViewer({
  data,
  src,
  pipeline,
  height = "360px",
  caption,
}: LiveViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">(
    "idle",
  );

  // Trajectory playback state (only shown when the snapshot has >1 frame).
  const [totalFrames, setTotalFrames] = useState(0);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [fps, setFps] = useState(10);

  const framesRef = useRef<FrameData[]>([]);
  const rendererRef = useRef<any>(null);
  const playIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const currentFrameRef = useRef(0);
  const fpsRef = useRef(10);

  const resolvedSrc = useBaseUrl(
    src ?? (data ? `/data/${data}.json` : "/data/1crn.json"),
  );

  function stopPlayback() {
    if (playIntervalRef.current !== null) {
      clearInterval(playIntervalRef.current);
      playIntervalRef.current = null;
    }
  }

  function advance(nextIdx: number) {
    currentFrameRef.current = nextIdx;
    setCurrentFrame(nextIdx);
    rendererRef.current?.updateFrame(framesRef.current[nextIdx]);
  }

  function handleSeek(index: number) {
    stopPlayback();
    setPlaying(false);
    advance(index);
  }

  function startInterval(rate: number) {
    playIntervalRef.current = setInterval(() => {
      const frames = framesRef.current;
      if (frames.length === 0) return;
      advance((currentFrameRef.current + 1) % frames.length);
    }, 1000 / rate);
  }

  function handlePlayPause() {
    setPlaying((prev) => {
      const next = !prev;
      if (next) {
        startInterval(fpsRef.current);
      } else {
        stopPlayback();
      }
      return next;
    });
  }

  function handleFpsChange(newFps: number) {
    fpsRef.current = newFps;
    setFps(newFps);
    if (playIntervalRef.current !== null) {
      stopPlayback();
      startInterval(newFps);
    }
  }

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    let renderer: any = null;
    let observer: IntersectionObserver | null = null;
    let unmounted = false;

    stopPlayback();
    setPlaying(false);
    setCurrentFrame(0);
    setTotalFrames(0);
    currentFrameRef.current = 0;
    framesRef.current = [];
    rendererRef.current = null;

    async function initPreview() {
      if (!container) return;
      setStatus("loading");

      const { MoleculeRenderer } = await import(
        "../../../src/renderer/MoleculeRenderer"
      );
      if (unmounted || !container) return;

      renderer = new MoleculeRenderer();
      renderer.mount(container);

      try {
        const res = await fetch(resolvedSrc);
        if (!res.ok) {
          console.error("LiveViewer: failed to load snapshot", resolvedSrc, res.status);
          setStatus("error");
          return;
        }
        if (unmounted) return;
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
        rendererRef.current = renderer;

        if (snap.frames && snap.frames.length > 1) {
          framesRef.current = snap.frames.map((f: any, i: number) => ({
            positions: new Float32Array(f.positions),
            nAtoms: snap.nAtoms,
            frameId: i,
          }));
          setTotalFrames(snap.frames.length);
        }

        // Optionally apply camera + representation state from a pipeline.
        if (pipeline) {
          const serialized =
            typeof pipeline === "string" ? JSON.parse(pipeline) : pipeline;
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

          const { nodes, edges } = deserializePipeline(serialized);
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
        }

        setStatus("ready");
      } catch (error) {
        console.error("LiveViewer: error loading snapshot", resolvedSrc, error);
        setStatus("error");
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
      { rootMargin: "200px" },
    );
    observer.observe(container);

    return () => {
      unmounted = true;
      stopPlayback();
      observer?.disconnect();
      if (renderer) {
        renderer.dispose();
      }
    };
  }, [resolvedSrc, pipeline]);

  return (
    <figure className={styles.liveViewer}>
      <div
        className={styles.canvas}
        ref={containerRef}
        style={{ height }}
        data-status={status}
      >
        {status !== "ready" && status !== "idle" && (
          <span className={styles.badge}>
            {status === "error" ? "Preview unavailable" : "Loading preview…"}
          </span>
        )}
        {totalFrames > 1 && (
          <Timeline
            currentFrame={currentFrame}
            totalFrames={totalFrames}
            playing={playing}
            fps={fps}
            onSeek={handleSeek}
            onPlayPause={handlePlayPause}
            onFpsChange={handleFpsChange}
          />
        )}
      </div>
      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  );
}
