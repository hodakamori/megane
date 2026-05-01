import { ReactWidget } from "@jupyterlab/ui-components";
import type { DocumentRegistry } from "@jupyterlab/docregistry";
import type { Contents } from "@jupyterlab/services";
import { useCallback, useEffect, useState } from "react";
import { MeganeViewer } from "@megane/components/MeganeViewer";
import { usePipelineStore } from "@megane/pipeline/store";
import { useTour } from "@megane/tour/useTour";
import "@megane/styles/megane.css";
import { ensureWasmUrl } from "./wasmLoader";

type ActivationSubscribe = (cb: () => void) => () => void;

interface DocBodyProps {
  context: DocumentRegistry.Context;
  contents: Contents.IManager;
  subscribeActivation: ActivationSubscribe;
}

type LoadState = "loading" | "ready" | { error: string };

interface MinimalSerializedPipeline {
  version?: number;
  nodes?: Array<{
    id?: string;
    type?: string;
    fileName?: string | null;
  }>;
}

function dirname(p: string): string {
  const idx = p.lastIndexOf("/");
  return idx >= 0 ? p.slice(0, idx) : "";
}

function basename(p: string): string {
  const idx = p.lastIndexOf("/");
  return idx >= 0 ? p.slice(idx + 1) : p;
}

function joinUnderDir(dir: string, rel: string): string | null {
  if (rel.startsWith("/")) return null;
  const parts = (dir ? `${dir}/${rel}` : rel).split("/");
  const out: string[] = [];
  for (const seg of parts) {
    if (seg === "" || seg === ".") continue;
    if (seg === "..") {
      if (out.length === 0) return null;
      out.pop();
      continue;
    }
    out.push(seg);
  }
  const joined = out.join("/");
  if (dir === "") return joined;
  if (joined !== dir && !joined.startsWith(`${dir}/`)) return null;
  return joined;
}

async function fetchCompanion(
  contents: Contents.IManager,
  path: string,
): Promise<File | null> {
  try {
    const model = await contents.get(path, { content: true, format: "base64" });
    const raw = String(model.content ?? "");
    const bytes = Uint8Array.from(atob(raw), (c) => c.charCodeAt(0));
    return new File([bytes], basename(path));
  } catch {
    return null;
  }
}

function DocBody({ context, contents, subscribeActivation }: DocBodyProps): JSX.Element {
  const [state, setState] = useState<LoadState>("loading");
  useTour({ host: "jupyterlab" });

  const reload = useCallback(
    async (token: { cancelled: boolean }) => {
      try {
        await ensureWasmUrl();
        await context.ready;
        if (token.cancelled) return;

        // Same reasoning as MeganeDocWidget: the pipeline store is a
        // singleton shared across documents, so we start every open
        // from a clean default before deserialize installs the new
        // graph. If JSON.parse below throws, we still want subsequent
        // documents to land in a sane state.
        usePipelineStore.getState().reset();

        const pipelineText = context.model.toString();
        const pipeline = JSON.parse(pipelineText) as MinimalSerializedPipeline;
        const dir = dirname(context.path);

        // Resolve every load_structure / load_trajectory node's referenced
        // file under the pipeline file's directory and pull it through the
        // Jupyter Contents service in parallel — the previous serial loop
        // dominated open latency for pipelines with multiple companions.
        // We delegate the rest (deserialize, parse, setNodeSnapshot) to the
        // shared `usePipelineStore.openFile` entry point.
        const companionTargets: string[] = [];
        for (const node of pipeline.nodes ?? []) {
          if (
            node.type !== "load_structure" &&
            node.type !== "load_trajectory"
          ) {
            continue;
          }
          if (!node.fileName) continue;
          const target = joinUnderDir(dir, String(node.fileName));
          if (target) companionTargets.push(target);
        }
        const fetched = await Promise.all(
          companionTargets.map((p) => fetchCompanion(contents, p)),
        );
        if (token.cancelled) return;
        const companions: File[] = fetched.filter((f): f is File => f !== null);

        const meganeFile = new File([pipelineText], basename(context.path), {
          type: "application/json",
        });
        await usePipelineStore.getState().openFile(meganeFile, { companions });

        if (!token.cancelled) setState("ready");
      } catch (err) {
        // Reset the store again so a half-deserialized pipeline (e.g.
        // deserialize ran but a companion parse threw) doesn't leak
        // into the next document the user opens.
        usePipelineStore.getState().reset();
        if (!token.cancelled) {
          setState({ error: err instanceof Error ? err.message : String(err) });
        }
      }
    },
    [context, contents],
  );

  useEffect(() => {
    let activeToken = { cancelled: false };
    void reload(activeToken);
    const unsubscribe = subscribeActivation(() => {
      activeToken.cancelled = true;
      activeToken = { cancelled: false };
      setState("loading");
      void reload(activeToken);
    });
    return () => {
      activeToken.cancelled = true;
      unsubscribe();
    };
  }, [reload, subscribeActivation]);

  const handleUploadStructure = useCallback(
    (file: File) => {
      void usePipelineStore.getState().openFile(file, { mode: "merge" });
    },
    [],
  );

  if (typeof state === "object") {
    return (
      <div
        className="megane-jupyter-status error"
        data-testid="megane-pipeline-doc-root"
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
        data-testid="megane-pipeline-doc-root"
        data-state="loading"
      >
        Loading pipeline...
      </div>
    );
  }

  return (
    <div
      data-testid="megane-pipeline-doc-root"
      data-state="ready"
      style={{ width: "100%", height: "100%" }}
    >
      <MeganeViewer testContext="jupyterlab-pipeline" onUploadStructure={handleUploadStructure} />
    </div>
  );
}

export class MeganePipelineReactView extends ReactWidget {
  private readonly listeners = new Set<() => void>();

  constructor(
    private readonly context: DocumentRegistry.Context,
    private readonly contents: Contents.IManager,
  ) {
    super();
    this.addClass("megane-jupyter-doc");
  }

  protected onAfterShow(msg: import("@lumino/messaging").Message): void {
    super.onAfterShow(msg);
    for (const cb of this.listeners) {
      try {
        cb();
      } catch {
        /* ignore */
      }
    }
  }

  private subscribeActivation = (cb: () => void): (() => void) => {
    this.listeners.add(cb);
    return () => {
      this.listeners.delete(cb);
    };
  };

  protected render(): JSX.Element {
    return (
      <DocBody
        context={this.context}
        contents={this.contents}
        subscribeActivation={this.subscribeActivation}
      />
    );
  }
}
