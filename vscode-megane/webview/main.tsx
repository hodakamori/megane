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

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      const message = event.data;
      if (message.type === "loadFile") {
        const { content, filename } = message;
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
        });
      } else if (message.type === "loadPipeline") {
        const { pipeline, structureFiles, trajectoryFiles } = message as {
          pipeline: SerializedPipeline;
          structureFiles: Array<{ nodeId: string; content: string; filename: string }>;
          trajectoryFiles: Array<{ nodeId: string; content: number[]; filename: string }>;
        };

        (async () => {
          const store = usePipelineStore.getState();

          // Restore the full pipeline configuration (nodes, edges, viewport settings, etc.)
          store.deserialize(pipeline);

          // Parse and load each structure file into its corresponding node snapshot
          let firstSnapshot = null;
          for (const sf of structureFiles) {
            const file = new File([sf.content], sf.filename, { type: "text/plain" });
            const result = await parseStructureFile(file);
            store.setNodeSnapshot(sf.nodeId, {
              snapshot: result.snapshot,
              frames: result.frames.length > 0 ? result.frames : null,
              meta: result.meta,
              labels: result.labels,
            });
            store.updateNodeParams(sf.nodeId, { fileName: sf.filename });
            if (!firstSnapshot) {
              firstSnapshot = result.snapshot;
              // Also populate useMeganeLocal so MeganeViewer props (atom selection etc.) work
              await local.loadFile(file);
              // Re-deserialize to restore the saved pipeline config (loadFile resets pipeline)
              store.deserialize(pipeline);
              store.setNodeSnapshot(sf.nodeId, {
                snapshot: result.snapshot,
                frames: result.frames.length > 0 ? result.frames : null,
                meta: result.meta,
                labels: result.labels,
              });
              store.updateNodeParams(sf.nodeId, { fileName: sf.filename });
            }
          }

          // Parse and load trajectory files
          if (firstSnapshot && trajectoryFiles.length > 0) {
            for (const tf of trajectoryFiles) {
              const bytes = new Uint8Array(tf.content);
              const file = new File([bytes], tf.filename);
              const ext = tf.filename.toLowerCase();
              const isLammps = ext.endsWith(".lammpstrj") || ext.endsWith(".dump");
              const parseFn = isLammps ? parseLammpstrjFile : parseXTCFile;
              const { frames, meta } = await parseFn(file, firstSnapshot.nAtoms);
              store.setFileFrames(frames, meta ?? null);
              store.updateNodeParams(tf.nodeId, { fileName: tf.filename });
            }
          }

          setLoaded(true);
        })();
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
    [local.loadFile]
  );

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
      onLabelSourceChange={(s) =>
        local.setLabelSource(s as "none" | "structure" | "file")
      }
      onLoadLabelFile={(f) => local.loadLabelFile(f)}
      onVectorSourceChange={(s) =>
        local.setVectorSource(s as "none" | "file" | "demo")
      }
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
  </StrictMode>
);
