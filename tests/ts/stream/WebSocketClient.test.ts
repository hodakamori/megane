import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { WebSocketClient } from "@/stream/WebSocketClient";

class MockWebSocket {
  static CONNECTING = 0;
  static OPEN = 1;
  static CLOSING = 2;
  static CLOSED = 3;

  static instances: MockWebSocket[] = [];

  url: string;
  binaryType = "blob";
  readyState: number = MockWebSocket.CONNECTING;
  onopen: ((this: MockWebSocket, ev: Event) => void) | null = null;
  onmessage: ((this: MockWebSocket, ev: MessageEvent) => void) | null = null;
  onerror: ((this: MockWebSocket, ev: Event) => void) | null = null;
  onclose: ((this: MockWebSocket, ev: CloseEvent) => void) | null = null;

  send = vi.fn();
  close = vi.fn(() => {
    this.readyState = MockWebSocket.CLOSED;
    this.onclose?.(new Event("close") as CloseEvent);
  });

  constructor(url: string) {
    this.url = url;
    MockWebSocket.instances.push(this);
  }

  fireOpen(): void {
    this.readyState = MockWebSocket.OPEN;
    this.onopen?.(new Event("open"));
  }

  fireMessage(data: ArrayBuffer | string): void {
    this.onmessage?.({ data } as MessageEvent);
  }

  fireClose(): void {
    this.readyState = MockWebSocket.CLOSED;
    this.onclose?.(new Event("close") as CloseEvent);
  }

  fireError(): void {
    this.onerror?.(new Event("error"));
  }
}

beforeEach(() => {
  MockWebSocket.instances = [];
  vi.useFakeTimers();
  vi.stubGlobal("WebSocket", MockWebSocket as unknown as typeof WebSocket);
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("WebSocketClient", () => {
  it("connect() opens a socket with arraybuffer binary type", () => {
    const client = new WebSocketClient("ws://localhost:1234", () => {});
    client.connect();

    expect(MockWebSocket.instances).toHaveLength(1);
    const ws = MockWebSocket.instances[0];
    expect(ws.url).toBe("ws://localhost:1234");
    expect(ws.binaryType).toBe("arraybuffer");
  });

  it("calls onStatus(true) when the socket opens", () => {
    const onStatus = vi.fn();
    const client = new WebSocketClient("ws://x", () => {}, onStatus);
    client.connect();

    MockWebSocket.instances[0].fireOpen();
    expect(onStatus).toHaveBeenCalledWith(true);
  });

  it("delivers ArrayBuffer messages to onMessage", () => {
    const onMessage = vi.fn();
    const client = new WebSocketClient("ws://x", onMessage);
    client.connect();
    MockWebSocket.instances[0].fireOpen();

    const buf = new ArrayBuffer(8);
    MockWebSocket.instances[0].fireMessage(buf);
    expect(onMessage).toHaveBeenCalledWith(buf);
  });

  it("ignores non-ArrayBuffer message payloads", () => {
    const onMessage = vi.fn();
    const client = new WebSocketClient("ws://x", onMessage);
    client.connect();
    MockWebSocket.instances[0].fireMessage("hello");
    expect(onMessage).not.toHaveBeenCalled();
  });

  it("calls onStatus(false) on close", () => {
    const onStatus = vi.fn();
    const client = new WebSocketClient("ws://x", () => {}, onStatus);
    client.connect();
    MockWebSocket.instances[0].fireOpen();
    onStatus.mockClear();

    MockWebSocket.instances[0].fireClose();
    expect(onStatus).toHaveBeenCalledWith(false);
  });

  it("schedules a reconnect with 1s initial delay after close", () => {
    const client = new WebSocketClient("ws://x", () => {});
    client.connect();
    MockWebSocket.instances[0].fireOpen();
    MockWebSocket.instances[0].fireClose();

    expect(MockWebSocket.instances).toHaveLength(1);
    vi.advanceTimersByTime(999);
    expect(MockWebSocket.instances).toHaveLength(1);
    vi.advanceTimersByTime(1);
    expect(MockWebSocket.instances).toHaveLength(2);
  });

  it("uses exponential backoff for repeated reconnects", () => {
    const client = new WebSocketClient("ws://x", () => {});
    client.connect();

    // First close → reconnect at 1000ms
    MockWebSocket.instances[0].fireClose();
    vi.advanceTimersByTime(1000);
    expect(MockWebSocket.instances).toHaveLength(2);

    // Second close before opening → reconnect at 2000ms
    MockWebSocket.instances[1].fireClose();
    vi.advanceTimersByTime(1999);
    expect(MockWebSocket.instances).toHaveLength(2);
    vi.advanceTimersByTime(1);
    expect(MockWebSocket.instances).toHaveLength(3);

    // Third close → reconnect at 4000ms
    MockWebSocket.instances[2].fireClose();
    vi.advanceTimersByTime(4000);
    expect(MockWebSocket.instances).toHaveLength(4);
  });

  it("resets backoff after a successful open", () => {
    const client = new WebSocketClient("ws://x", () => {});
    client.connect();

    // Cycle close → reconnect → close to grow backoff
    MockWebSocket.instances[0].fireClose();
    vi.advanceTimersByTime(1000);
    MockWebSocket.instances[1].fireClose();
    vi.advanceTimersByTime(2000);
    expect(MockWebSocket.instances).toHaveLength(3);

    // Successful open should reset the delay back to 1s
    MockWebSocket.instances[2].fireOpen();
    MockWebSocket.instances[2].fireClose();
    vi.advanceTimersByTime(1000);
    expect(MockWebSocket.instances).toHaveLength(4);
  });

  it("caps backoff at 30s", () => {
    const client = new WebSocketClient("ws://x", () => {});
    client.connect();

    // Drive backoff up: 1s → 2s → 4s → 8s → 16s → 30s (cap)
    const delays = [1000, 2000, 4000, 8000, 16000, 30000, 30000];
    let expectedSockets = 1;
    for (const delay of delays) {
      MockWebSocket.instances[expectedSockets - 1].fireClose();
      vi.advanceTimersByTime(delay);
      expectedSockets++;
      expect(MockWebSocket.instances).toHaveLength(expectedSockets);
    }
  });

  it("disconnect() prevents further reconnects", () => {
    const client = new WebSocketClient("ws://x", () => {});
    client.connect();
    MockWebSocket.instances[0].fireOpen();

    client.disconnect();
    vi.advanceTimersByTime(60000);
    // Initial socket plus no reconnects.
    expect(MockWebSocket.instances).toHaveLength(1);
  });

  it("disconnect() also clears a pending reconnect timer", () => {
    const client = new WebSocketClient("ws://x", () => {});
    client.connect();
    MockWebSocket.instances[0].fireClose();

    // Reconnect is queued for 1000ms.
    client.disconnect();
    vi.advanceTimersByTime(60000);
    expect(MockWebSocket.instances).toHaveLength(1);
  });

  it("send() is a no-op when readyState is not OPEN", () => {
    const client = new WebSocketClient("ws://x", () => {});
    client.connect();
    // Socket is in CONNECTING state.
    client.send({ type: "ping" });
    expect(MockWebSocket.instances[0].send).not.toHaveBeenCalled();
  });

  it("send() serializes JSON when the socket is open", () => {
    const client = new WebSocketClient("ws://x", () => {});
    client.connect();
    MockWebSocket.instances[0].fireOpen();

    client.send({ type: "request_frame", frame: 7 });
    expect(MockWebSocket.instances[0].send).toHaveBeenCalledTimes(1);
    expect(MockWebSocket.instances[0].send).toHaveBeenCalledWith(
      JSON.stringify({ type: "request_frame", frame: 7 }),
    );
  });

  it("connected getter reflects the live readyState", () => {
    const client = new WebSocketClient("ws://x", () => {});
    expect(client.connected).toBe(false);

    client.connect();
    expect(client.connected).toBe(false); // still CONNECTING

    MockWebSocket.instances[0].fireOpen();
    expect(client.connected).toBe(true);

    MockWebSocket.instances[0].fireClose();
    expect(client.connected).toBe(false);
  });

  it("logs but does not throw on socket errors", () => {
    const errSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const client = new WebSocketClient("ws://x", () => {});
    client.connect();
    expect(() => MockWebSocket.instances[0].fireError()).not.toThrow();
    expect(errSpy).toHaveBeenCalled();
    errSpy.mockRestore();
  });
});
