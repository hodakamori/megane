/**
 * WebSocket client for streaming molecular data from the Python server.
 * Includes automatic reconnection with exponential backoff.
 */

export type OnMessageCallback = (data: ArrayBuffer) => void;
export type OnStatusCallback = (connected: boolean) => void;

const INITIAL_RECONNECT_DELAY = 1000;
const MAX_RECONNECT_DELAY = 30000;

export class WebSocketClient {
  private ws: WebSocket | null = null;
  private onMessage: OnMessageCallback;
  private onStatus: OnStatusCallback | null;
  private url: string;
  private shouldReconnect = false;
  private reconnectDelay = INITIAL_RECONNECT_DELAY;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;

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
    this.shouldReconnect = true;
    this._connect();
  }

  private _connect(): void {
    if (this.ws) return;

    this.ws = new WebSocket(this.url);
    this.ws.binaryType = "arraybuffer";

    this.ws.onopen = () => {
      this.reconnectDelay = INITIAL_RECONNECT_DELAY;
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
      this._scheduleReconnect();
    };
  }

  private _scheduleReconnect(): void {
    if (!this.shouldReconnect) return;

    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this._connect();
    }, this.reconnectDelay);

    this.reconnectDelay = Math.min(
      this.reconnectDelay * 2,
      MAX_RECONNECT_DELAY,
    );
  }

  /** Send a JSON command to the server. */
  send(data: Record<string, unknown>): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  disconnect(): void {
    this.shouldReconnect = false;
    if (this.reconnectTimer !== null) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  get connected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }
}
