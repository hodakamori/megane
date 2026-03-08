/**
 * VSCode webview entry point for megane.
 * Receives structure file content from the extension host via postMessage,
 * parses it using the WASM parser, and renders the megane viewer.
 */

import { StrictMode, useState, useEffect, useCallback } from "react";
import { createRoot } from "react-dom/client";
import { MeganeViewer } from "../../src/components/MeganeViewer";
import { useMeganeLocal } from "../../src/hooks/useMeganeLocal";
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
        local.loadFile(file).then(() => setLoaded(true));
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
