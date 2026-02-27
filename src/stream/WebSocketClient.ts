/**
 * WebSocket client for streaming molecular data from the Python server.
 */

export type OnMessageCallback = (data: ArrayBuffer) => void;

export class WebSocketClient {
  private ws: WebSocket | null = null;
  private onMessage: OnMessageCallback;
  private url: string;

  constructor(url: string, onMessage: OnMessageCallback) {
    this.url = url;
    this.onMessage = onMessage;
  }

  connect(): void {
    this.ws = new WebSocket(this.url);
    this.ws.binaryType = "arraybuffer";

    this.ws.onmessage = (event: MessageEvent) => {
      if (event.data instanceof ArrayBuffer) {
        this.onMessage(event.data);
      }
    };

    this.ws.onclose = () => {
      this.ws = null;
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
