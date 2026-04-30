/**
 * VSCode webview entry point for megane.
 *
 * The extension host posts either a single structure file or a pipeline
 * (.megane.json + companion files) into the webview. Both flows are funneled
 * through the canonical `usePipelineStore.openFile` ingestion path so the
 * pipeline graph stays in sync with whatever was opened — exactly the same
 * contract the webapp drag-drop and the JupyterLab DocWidget use.
 *
 * `useMeganeLocal` is still instantiated to keep `MeganeViewer.snapshot` /
 * `frame` props populated for atom selection and measurement until PR-B
 * removes those props in favour of subscribing to pipeline state directly.
 */

import { StrictMode, useState, useEffect, useCallback } from "react";
import { createRoot } from "react-dom/client";
import { MeganeViewer } from "../../src/components/MeganeViewer";
import { useMeganeLocal } from "../../src/hooks/useMeganeLocal";
import { usePipelineStore } from "../../src/pipeline/store";
import type { SerializedPipeline } from "../../src/pipeline/types";
import "../../src/styles/megane.css";

// Acquire VS Code API
const vscode = acquireVsCodeApi();

function setWasmUrlFromBytes(wasmBytes: number[] | undefined): void {
  if (!wasmBytes) return;
  const wasmBlob = new Blob([new Uint8Array(wasmBytes)], { type: "application/wasm" });
  (globalThis as Record<string, unknown>).__MEGANE_WASM_URL__ = URL.createObjectURL(wasmBlob);
}

function App() {
  const local = useMeganeLocal();
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      const message = event.data;

      if (message.type === "loadFile") {
        const { contentBytes, filename, wasmBytes } = message;
        setWasmUrlFromBytes(wasmBytes);
        // Build a File from raw bytes so binary formats like .traj round-trip
        // unmodified. The shared parser dispatches by extension to text() or
        // arrayBuffer() and both work over a Uint8Array-backed File.
        const bytes = new Uint8Array(contentBytes);
        const file = new File([bytes], filename);
        // useMeganeLocal.loadFile internally drives the pipeline (via
        // applyResult: setNodeSnapshot + load_structure / load_trajectory
        // fileName updates) so we no longer need a manual
        // updateNodeParams patch here.
        local
          .loadFile(file)
          .then(() => setLoaded(true))
          .catch((err) => {
            console.error("Failed to load file:", err);
            setError(`Failed to load file: ${err instanceof Error ? err.message : String(err)}`);
          });
        return;
      }

      if (message.type === "error") {
        setError(message.message || "Unknown error from extension host");
        return;
      }

      if (message.type === "loadPipeline") {
        const { pipeline, structureFiles, trajectoryFiles, wasmBytes } = message as {
          pipeline: SerializedPipeline;
          structureFiles: Array<{ nodeId: string; content: string; filename: string }>;
          trajectoryFiles: Array<{ nodeId: string; content: ArrayBuffer; filename: string }>;
          wasmBytes?: number[];
        };
        setWasmUrlFromBytes(wasmBytes);

        (async () => {
          const companions: File[] = [
            ...structureFiles.map(
              (sf) => new File([sf.content], sf.filename, { type: "text/plain" }),
            ),
            ...trajectoryFiles.map(
              (tf) => new File([new Uint8Array(tf.content)], tf.filename),
            ),
          ];

          // Re-stringify the pipeline payload into a File so the canonical
          // openFile entry point sees the same .megane.json contract that
          // every other host uses.
          const meganeFile = new File(
            [JSON.stringify(pipeline)],
            "pipeline.megane.json",
            { type: "application/json" },
          );
          await usePipelineStore.getState().openFile(meganeFile, { companions });

          // Populate useMeganeLocal so MeganeViewer props (atom selection,
          // measurements) keep working in pipeline mode. applyResult re-runs
          // setNodeSnapshot on the first load_structure node — that's
          // idempotent because openFile already set the same snapshot for
          // that node a moment ago. PR-B will drop these props entirely.
          if (structureFiles.length > 0) {
            const firstStructure = new File(
              [structureFiles[0].content],
              structureFiles[0].filename,
              { type: "text/plain" },
            );
            await local.loadFile(firstStructure);
          }

          setLoaded(true);
        })().catch((err) => {
          console.error("Failed to load pipeline:", err);
          // Surface the viewer anyway so the user can recover via node file
          // pickers rather than facing a permanent loading screen.
          setLoaded(true);
        });
      }
    };

    window.addEventListener("message", handler);

    // Signal to the extension host that the webview is ready
    vscode.postMessage({ type: "ready" });

    return () => window.removeEventListener("message", handler);
  }, []);

  const handleUploadStructure = useCallback(
    (file: File) => {
      local.loadFile(file);
    },
    [local.loadFile],
  );

  if (error) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          color: "#ef4444",
          fontSize: "14px",
          padding: "20px",
          textAlign: "center",
          gap: "8px",
        }}
      >
        <div style={{ fontWeight: "bold" }}>Error</div>
        <div style={{ color: "#64748b", maxWidth: "400px", wordBreak: "break-word" }}>{error}</div>
      </div>
    );
  }

  if (!loaded) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          color: "#64748b",
          fontSize: "14px",
        }}
      >
        Loading structure...
      </div>
    );
  }

  return (
    <MeganeViewer
      testContext="vscode"
      onUploadStructure={handleUploadStructure}
      onBondSourceChange={(s) =>
        local.setBondSource(s as "structure" | "file" | "distance" | "none")
      }
      onLabelSourceChange={(s) => local.setLabelSource(s as "none" | "structure" | "file")}
      onLoadLabelFile={(f) => local.loadLabelFile(f)}
      onVectorSourceChange={(s) => local.setVectorSource(s as "none" | "file" | "demo")}
      onLoadVectorFile={(f) => local.loadVectorFile(f)}
      onLoadDemoVectors={() => local.loadDemoVectors()}
    />
  );
}

// Declare acquireVsCodeApi for TypeScript
declare function acquireVsCodeApi(): {
  postMessage(message: unknown): void;
  getState(): unknown;
  setState(state: unknown): void;
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
