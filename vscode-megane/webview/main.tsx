/**
 * VSCode webview entry point for megane.
 * Receives structure file content from the extension host via postMessage,
 * parses it using the WASM parser, and renders the megane viewer.
 */

import { StrictMode, useState, useEffect, useCallback } from "react";
import { createRoot } from "react-dom/client";
import { MeganeViewer } from "../../src/components/MeganeViewer";
import { useMeganeLocal } from "../../src/hooks/useMeganeLocal";
import { usePipelineStore } from "../../src/pipeline/store";
import { parseStructureFile } from "../../src/parsers/structure";
import { parseXTCFile, parseLammpstrjFile } from "../../src/parsers/xtc";
import type { SerializedPipeline } from "../../src/pipeline/types";
import "../../src/styles/megane.css";

// Acquire VS Code API
const vscode = acquireVsCodeApi();

function App() {
  const local = useMeganeLocal();
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      const message = event.data;
      if (message.type === "loadFile") {
        const { content, filename, wasmBytes } = message;
        // If WASM bytes were sent from the extension host, use them directly
        // to avoid fetch() issues in some webview environments
        if (wasmBytes) {
          (globalThis as Record<string, unknown>).__MEGANE_WASM_URL__ =
            new Uint8Array(wasmBytes).buffer;
        }
        // Create a File object so parseStructureFile can detect format from extension
        const file = new File([content], filename, { type: "text/plain" });
        local.loadFile(file).then(() => {
          setLoaded(true);
          // Update the LoadStructure node's fileName for display
          const { nodes, updateNodeParams } = usePipelineStore.getState();
          const loaderNode = nodes.find((n) => n.type === "load_structure");
          if (loaderNode) {
            updateNodeParams(loaderNode.id, { fileName: filename });
          }
        }).catch((err) => {
          console.error("Failed to load file:", err);
          setError(`Failed to load file: ${err instanceof Error ? err.message : String(err)}`);
        });
      } else if (message.type === "error") {
        setError(message.message || "Unknown error from extension host");
      } else if (message.type === "loadPipeline") {
        const { pipeline, structureFiles, trajectoryFiles, wasmBytes } = message as {
          pipeline: SerializedPipeline;
          structureFiles: Array<{ nodeId: string; content: string; filename: string }>;
          trajectoryFiles: Array<{ nodeId: string; content: ArrayBuffer; filename: string }>;
          wasmBytes?: number[];
        };
        // If WASM bytes were sent from the extension host, use them directly
        if (wasmBytes) {
          (globalThis as Record<string, unknown>).__MEGANE_WASM_URL__ =
            new Uint8Array(wasmBytes).buffer;
        }

        (async () => {
          const store = usePipelineStore.getState();

          // Restore the full pipeline configuration (nodes, edges, viewport settings, etc.)
          store.deserialize(pipeline);

          // Parse all structure files first, collect results
          let firstFile: File | null = null;
          const parsed: Array<{
            sf: (typeof structureFiles)[0];
            file: File;
            result: Awaited<ReturnType<typeof parseStructureFile>>;
          }> = [];
          for (const sf of structureFiles) {
            const file = new File([sf.content], sf.filename, { type: "text/plain" });
            const result = await parseStructureFile(file);
            parsed.push({ sf, file, result });
            if (!firstFile) firstFile = file;
          }

          // Populate useMeganeLocal for the primary structure so MeganeViewer
          // props (atom selection, measurements) work. local.loadFile triggers
          // execute() before per-node snapshots are set, so we apply them after.
          if (firstFile) {
            await local.loadFile(firstFile);
          }

          // Apply all per-node snapshots after local.loadFile
          let firstSnapshot = null;
          for (const { sf, result } of parsed) {
            store.setNodeSnapshot(sf.nodeId, {
              snapshot: result.snapshot,
              frames: result.frames.length > 0 ? result.frames : null,
              meta: result.meta,
              labels: result.labels,
            });
            store.updateNodeParams(sf.nodeId, {
              fileName: sf.filename,
              hasTrajectory: result.frames.length > 0,
              hasCell: !!result.snapshot.box,
            });
            if (!firstSnapshot) firstSnapshot = result.snapshot;
          }

          // Load only the first trajectory file (store supports a single global trajectory)
          if (firstSnapshot && trajectoryFiles.length > 0) {
            const tf = trajectoryFiles[0];
            const bytes = new Uint8Array(tf.content);
            const file = new File([bytes], tf.filename);
            const ext = tf.filename.toLowerCase();
            const isLammps = ext.endsWith(".lammpstrj") || ext.endsWith(".dump");
            const parseFn = isLammps ? parseLammpstrjFile : parseXTCFile;
            const { frames, meta } = await parseFn(file, firstSnapshot.nAtoms);
            store.setFileFrames(frames, meta ?? null);
            store.updateNodeParams(tf.nodeId, { fileName: tf.filename });
          }

          setLoaded(true);
        })().catch((err) => {
          console.error("Failed to load pipeline:", err);
          setLoaded(true); // Show viewer even on error so user can recover manually
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
      snapshot={local.snapshot}
      frame={local.frame}
      currentFrame={local.currentFrame}
      totalFrames={local.meta?.nFrames ?? 0}
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
