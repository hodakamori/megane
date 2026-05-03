import { Widget } from "@lumino/widgets";
import type { IStatusBar } from "@jupyterlab/statusbar";
import type { WidgetTracker } from "@jupyterlab/apputils";
import type { IDocumentWidget } from "@jupyterlab/docregistry";
import type { MeganeReactView } from "./MeganeDocWidget";

export function setupFrameStatusBar(
  tracker: WidgetTracker<IDocumentWidget<MeganeReactView>>,
  statusBar: IStatusBar,
): void {
  const item = new Widget();
  item.addClass("jp-megane-frame-status");
  item.node.textContent = "";

  let currentUnsub: (() => void) | null = null;

  tracker.currentChanged.connect((_tracker, widget) => {
    currentUnsub?.();
    currentUnsub = null;
    item.node.textContent = "";
    if (widget) {
      currentUnsub = widget.content.subscribeFrameChange((frame) => {
        item.node.textContent = `Frame ${frame}`;
      });
    }
  });

  statusBar.registerStatusItem("megane:frame-counter", {
    item,
    align: "right",
    rank: 100,
    isActive: () => tracker.currentWidget !== null,
  });
}
