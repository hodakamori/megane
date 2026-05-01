import { ReactWidget } from "@jupyterlab/ui-components";
import type { DocumentRegistry } from "@jupyterlab/docregistry";
import { useCallback, useEffect, useState } from "react";
import { MeganeViewer } from "@megane/components/MeganeViewer";
import { useMeganeLocal } from "@megane/hooks/useMeganeLocal";
import { usePipelineStore } from "@megane/pipeline/store";
import { useTour } from "@megane/tour/useTour";
import "@megane/styles/megane.css";
import { ensureWasmUrl } from "./wasmLoader";
import { STRUCTURE_FILETYPES_BINARY } from "./filetypes";

const BINARY_EXTENSIONS = new Set(
  STRUCTURE_FILETYPES_BINARY.flatMap((f) => f.extensions ?? []),
);

interface DocBodyProps {
  context: DocumentRegistry.Context;
}

type LoadState = "loading" | "ready" | { error: string };

function DocBody({ context }: DocBodyProps): JSX.Element {
  const local = useMeganeLocal();
  const [state, setState] = useState<LoadState>("loading");
  useTour({ host: "jupyterlab" });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await ensureWasmUrl();
        await context.ready;
        // Reset the global pipeline store before loading. The same
        // singleton store is shared across every JupyterLab document
        // tab, so a previously-opened .megane.json (or a failed open)
        // would otherwise leave its graph + node snapshots in place,
        // and useMeganeLocal.applyResult would inject this file's data
        // into a foreign pipeline — or silently no-op if that graph
        // had no load_structure node.
        usePipelineStore.getState().reset();
        const filename = context.path.split("/").pop() ?? "structure";
        const raw = context.model.toString();
        // Binary file types (e.g. ASE .traj) are registered with
        // fileFormat: "base64" in filetypes.ts, so the model serializes to a
        // base64 string. Decode to bytes and let parseStructureFile dispatch
        // to the right WASM parser via file.arrayBuffer(). We check both the
        // contentsModel format and the file extension as a safety net,
        // because contentsModel can be null in some restore paths.
        const dot = filename.lastIndexOf(".");
        const ext = dot >= 0 ? filename.slice(dot).toLowerCase() : "";
        const isBase64 =
          context.contentsModel?.format === "base64" || BINARY_EXTENSIONS.has(ext);
        const bytes = isBase64
          ? Uint8Array.from(atob(raw), (c) => c.charCodeAt(0))
          : new TextEncoder().encode(raw);
        const file = new File([bytes], filename);
        await local.loadFile(file);
        if (!cancelled) setState("ready");
      } catch (err) {
        if (!cancelled) {
          setState({ error: err instanceof Error ? err.message : String(err) });
        }
      }
    })();
    return () => {
      cancelled = true;
    };
    // `local` is intentionally omitted: useMeganeLocal returns a fresh
    // object on every render, so including it would re-fire this effect
    // on every state update and re-parse the file in a loop. We only
    // want to load when the document context is first ready.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context]);

  const handleUploadStructure = useCallback(
    (file: File) => {
      local.loadFile(file);
    },
    [local],
  );

  if (typeof state === "object") {
    return (
      <div
        className="megane-jupyter-status error"
        data-testid="megane-doc-root"
        data-state="error"
      >
        <div className="label">Error</div>
        <div>{state.error}</div>
      </div>
    );
  }

  if (state === "loading") {
    return (
      <div
        className="megane-jupyter-status"
        data-testid="megane-doc-root"
        data-state="loading"
      >
        Loading structure...
      </div>
    );
  }

  return (
    <div
      data-testid="megane-doc-root"
      data-state="ready"
      style={{ width: "100%", height: "100%" }}
    >
      <MeganeViewer
        testContext="jupyterlab-doc"
        onUploadStructure={handleUploadStructure}
        onBondSourceChange={(s: string) =>
          local.setBondSource(s as "structure" | "file" | "distance" | "none")
        }
        onLabelSourceChange={(s: string) =>
          local.setLabelSource(s as "none" | "structure" | "file")
        }
        onLoadLabelFile={(f: File) => local.loadLabelFile(f)}
        onVectorSourceChange={(s: string) => local.setVectorSource(s as "none" | "file" | "demo")}
        onLoadVectorFile={(f: File) => local.loadVectorFile(f)}
        onLoadDemoVectors={() => local.loadDemoVectors()}
      />
    </div>
  );
}

export class MeganeReactView extends ReactWidget {
  constructor(private readonly context: DocumentRegistry.Context) {
    super();
    this.addClass("megane-jupyter-doc");
  }

  protected render(): JSX.Element {
    return <DocBody context={this.context} />;
  }
}
