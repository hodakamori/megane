import { describe, it, expect, vi, beforeEach } from "vitest";

// @lumino/widgets is resolved via the stub alias in vitest.config.ts
import { setupFrameStatusBar } from "../../../jupyterlab-megane/src/frameStatusBar";

type CurrentChangedHandler = (
  tracker: unknown,
  widget: { content: { subscribeFrameChange: (cb: (f: number) => void) => () => void } } | null,
) => void;

function makeTracker(currentWidget: unknown = null) {
  let handler: CurrentChangedHandler | null = null;
  return {
    currentWidget,
    currentChanged: {
      connect: vi.fn((h: CurrentChangedHandler) => {
        handler = h;
      }),
    },
    fireCurrentChanged(
      widget: { content: { subscribeFrameChange: (cb: (f: number) => void) => () => void } } | null,
    ) {
      handler?.(this, widget);
    },
  };
}

function makeStatusBar() {
  return { registerStatusItem: vi.fn() };
}

function registeredItem(
  statusBar: ReturnType<typeof makeStatusBar>,
): { node: { textContent: string } } {
  return statusBar.registerStatusItem.mock.calls[0][1].item as {
    node: { textContent: string };
  };
}

describe("setupFrameStatusBar", () => {
  let tracker: ReturnType<typeof makeTracker>;
  let statusBar: ReturnType<typeof makeStatusBar>;

  beforeEach(() => {
    tracker = makeTracker();
    statusBar = makeStatusBar();
  });

  it("registers a status item with the correct id and alignment", () => {
    setupFrameStatusBar(tracker as never, statusBar as never);

    expect(statusBar.registerStatusItem).toHaveBeenCalledWith(
      "megane:frame-counter",
      expect.objectContaining({ align: "right", rank: 100 }),
    );
  });

  it("connects to tracker.currentChanged", () => {
    setupFrameStatusBar(tracker as never, statusBar as never);
    expect(tracker.currentChanged.connect).toHaveBeenCalledTimes(1);
  });

  it("starts with empty status item text", () => {
    setupFrameStatusBar(tracker as never, statusBar as never);
    const item = registeredItem(statusBar);
    expect(item.node.textContent).toBe("");
  });

  it("subscribes to the widget's frame changes when a widget becomes active", () => {
    setupFrameStatusBar(tracker as never, statusBar as never);

    const unsub = vi.fn();
    const mockWidget = {
      content: {
        subscribeFrameChange: vi.fn(() => unsub),
      },
    };

    tracker.fireCurrentChanged(mockWidget);
    expect(mockWidget.content.subscribeFrameChange).toHaveBeenCalledTimes(1);
  });

  it("updates item text content when frame changes", () => {
    setupFrameStatusBar(tracker as never, statusBar as never);

    let frameCb: ((f: number) => void) | null = null;
    const mockWidget = {
      content: {
        subscribeFrameChange: vi.fn((cb: (f: number) => void) => {
          frameCb = cb;
          return vi.fn();
        }),
      },
    };

    tracker.fireCurrentChanged(mockWidget);
    frameCb!(99);

    const item = registeredItem(statusBar);
    expect(item.node.textContent).toBe("Frame 99");
  });

  it("clears item text and unsubscribes when widget is deactivated", () => {
    setupFrameStatusBar(tracker as never, statusBar as never);

    let frameCb: ((f: number) => void) | null = null;
    const unsub = vi.fn();
    const mockWidget = {
      content: {
        subscribeFrameChange: vi.fn((cb: (f: number) => void) => {
          frameCb = cb;
          return unsub;
        }),
      },
    };

    tracker.fireCurrentChanged(mockWidget);
    frameCb!(5);

    const item = registeredItem(statusBar);
    expect(item.node.textContent).toBe("Frame 5");

    tracker.fireCurrentChanged(null);
    expect(unsub).toHaveBeenCalledTimes(1);
    expect(item.node.textContent).toBe("");
  });

  it("unsubscribes from previous widget when a new widget becomes active", () => {
    setupFrameStatusBar(tracker as never, statusBar as never);

    const unsub1 = vi.fn();
    const widget1 = {
      content: { subscribeFrameChange: vi.fn(() => unsub1) },
    };
    const unsub2 = vi.fn();
    const widget2 = {
      content: { subscribeFrameChange: vi.fn(() => unsub2) },
    };

    tracker.fireCurrentChanged(widget1);
    tracker.fireCurrentChanged(widget2);

    expect(unsub1).toHaveBeenCalledTimes(1);
    expect(unsub2).not.toHaveBeenCalled();
  });

  it("isActive returns true when tracker has a current widget", () => {
    const trackerWithWidget = makeTracker({ content: {} });
    setupFrameStatusBar(trackerWithWidget as never, statusBar as never);

    const options = statusBar.registerStatusItem.mock.calls[0][1] as {
      isActive: () => boolean;
    };
    expect(options.isActive()).toBe(true);
  });

  it("isActive returns false when tracker has no current widget", () => {
    setupFrameStatusBar(tracker as never, statusBar as never);

    const options = statusBar.registerStatusItem.mock.calls[0][1] as {
      isActive: () => boolean;
    };
    expect(options.isActive()).toBe(false);
  });
});
