/**
 * WebSocket client for streaming molecular data from the Python server.
 */

export type OnMessageCallback = (data: ArrayBuffer) => void;
export type OnStatusCallback = (connected: boolean) => void;

export class WebSocketClient {
  private ws: WebSocket | null = null;
  private onMessage: OnMessageCallback;
  private onStatus: OnStatusCallback | null;
  private url: string;

  constructor(
    url: string,
    onMessage: OnMessageCallback,
    onStatus?: OnStatusCallback,
  ) {
    this.url = url;
    this.onMessage = onMessage;
    this.onStatus = onStatus ?? null;
  }

  connect(): void {
    this.ws = new WebSocket(this.url);
    this.ws.binaryType = "arraybuffer";

    this.ws.onopen = () => {
      this.onStatus?.(true);
    };

    this.ws.onmessage = (event: MessageEvent) => {
      if (event.data instanceof ArrayBuffer) {
        this.onMessage(event.data);
      }
    };

    this.ws.onerror = (event: Event) => {
      console.error("[megane] WebSocket error:", event);
    };

    this.ws.onclose = () => {
      this.ws = null;
      this.onStatus?.(false);
    };
  }

  /** Send a JSON command to the server. */
  send(data: Record<string, unknown>): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  get connected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }
}
