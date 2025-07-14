export type WebSocketStatus = "OPEN" | "CONNECTING" | "CLOSED";
export type WebSocketHeartbeatMessage = string | ArrayBuffer | Blob;

export interface WebSocketClientOptions {
  // 握手成功
  onConnected?: (ws: WebSocket) => void;
  // 断开连接
  onDisconnected?: (ws: WebSocket, ev: CloseEvent) => void;
  // 错误
  onError?: (ws: WebSocket, ev: Event) => void;
  // 后端发送的消息
  onMessage?: (ws: WebSocket, ev: MessageEvent) => void;
  // 心跳保活
  heartbeat?:
    | false
    | {
        // 要发的心跳消息
        message?: WebSocketHeartbeatMessage; // default: 'ping'
        // 心跳响应消息
        responseMessage?: WebSocketHeartbeatMessage; // default: message
        // 心跳间隔
        interval?: number; // ms, default: 1000
        // 心跳超时时间
        pongTimeout?: number; // ms, default: 1000
      };
  // 自动重连
  autoReconnect?:
    | false
    | {
        // 最大尝试次数
        retries?: number | ((retries: number) => boolean); // default: ∞
        // 重连间隔
        delay?: number; // ms, default: 1000
        // 重连失败
        onFailed?: () => void;
      };
  // 创建实例后立即连接 设为false时得手动client.open
  immediate?: boolean; // open() upon instantiation, default: true
  //WebSocket 子协议列表，等同浏览器原生 new WebSocket(url, protocols) 第二参数。常见如 ['graphql-ws']、['json']
  protocols?: string[]; // WebSocket sub‑protocols
  // 是否缓存未发送的消息
  buffer?: boolean; // store unsent msgs when not OPEN, default: true
}

export class WebSocketClient {
  readonly status: { value: WebSocketStatus } = { value: "CLOSED" };
  readonly data: { value: unknown | null } = { value: null };

  constructor(
    private url: string | URL,
    private options: WebSocketClientOptions = {}
  ) {
    if (options.immediate !== false) this.open();
  }

  send(data: string | ArrayBuffer | Blob, useBuffer = true): boolean {
    if (!this.ws || this.status.value !== "OPEN") {
      if (useBuffer && this.options.buffer !== false) this.buffered.push(data);
      return false;
    }
    this.flushBuffer();
    this.ws.send(data);
    return true;
  }

  close(code = 1000, reason?: string) {
    this.stopRetry();
    this.stopHeartbeat();
    this.explicitlyClosed = true;
    this.ws?.close(code, reason);
    this.ws = undefined;
    this.status.value = "CLOSED";
  }

  open() {
    if (this.explicitlyClosed) this.explicitlyClosed = false;
    this.close();
    this.init();
  }

  private ws?: WebSocket;
  private buffered: (string | ArrayBuffer | Blob)[] = [];
  private explicitlyClosed = false;
  private retries = 0;
  private retryTimer?: ReturnType<typeof setTimeout>;
  private hbTimer?: ReturnType<typeof setInterval>;
  private pongTimer?: ReturnType<typeof setTimeout>;

  private init() {
    const {
      protocols = [],
      onConnected,
      onError,
      onMessage,
      onDisconnected,
    } = this.options;
    this.ws = new WebSocket(this.url, protocols);
    this.status.value = "CONNECTING";

    this.ws.onopen = () => {
      this.status.value = "OPEN";
      this.retries = 0;
      onConnected?.(this.ws!);
      this.startHeartbeat();
      this.flushBuffer();
    };

    this.ws.onmessage = (e) => {
      if (this.handleHeartbeatMsg(e)) return;
      this.data.value = e.data;
      onMessage?.(this.ws!, e);
    };

    this.ws.onerror = (e) => onError?.(this.ws!, e);

    this.ws.onclose = (ev) => {
      this.status.value = "CLOSED";
      this.stopHeartbeat();
      onDisconnected?.(this.ws!, ev);
      this.maybeReconnect();
    };
  }

  private flushBuffer() {
    if (this.ws && this.status.value === "OPEN" && this.buffered.length) {
      for (const b of this.buffered) this.ws.send(b);
      this.buffered = [];
    }
  }

  private startHeartbeat() {
    const hb = this.options.heartbeat;
    if (!hb) return;
    const {
      message = "ping",
      responseMessage = message,
      interval = 1000,
      pongTimeout = 1000,
    } = hb;

    this.hbTimer = setInterval(() => {
      this.send(message, false);
      this.pongTimer ??= setTimeout(() => {
        this.close(); // triggers auto‑reconnect if enabled
      }, pongTimeout);
    }, interval);

    this.heartbeatExpect = responseMessage;
  }

  private stopHeartbeat() {
    clearInterval(this.hbTimer);
    clearTimeout(this.pongTimer);
    this.hbTimer = this.pongTimer = undefined;
  }

  private heartbeatExpect?: WebSocketHeartbeatMessage;
  private handleHeartbeatMsg(e: MessageEvent) {
    if (!this.options.heartbeat) return false;
    if (e.data === this.heartbeatExpect) {
      clearTimeout(this.pongTimer);
      this.pongTimer = undefined;
      return true;
    }
    return false;
  }

  private maybeReconnect() {
    const ar = this.options.autoReconnect;
    if (!ar || this.explicitlyClosed) return;

    const { retries = -1, delay = 1000, onFailed } = ar;

    const shouldRetry =
      typeof retries === "function"
        ? retries(this.retries)
        : retries < 0 || this.retries < retries;

    if (shouldRetry) {
      this.retries++;
      this.retryTimer = setTimeout(() => this.init(), delay);
    } else {
      onFailed?.();
    }
  }

  private stopRetry() {
    clearTimeout(this.retryTimer);
  }
}
