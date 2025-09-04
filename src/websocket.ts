export type WebSocketStatus = "OPEN" | "CONNECTING" | "CLOSED";
export type WebSocketHeartbeatMessage = string | ArrayBuffer | Blob;

export interface WebSocketClientOptions {
  onConnected?: (ws: WebSocket) => void;
  onDisconnected?: (ws: WebSocket, ev: CloseEvent) => void;
  onError?: (ws: WebSocket, ev: Event) => void;
  onMessage?: (ws: WebSocket, ev: MessageEvent) => void;
  onReconnecting?: (retryCount: number) => void;
  onReconnected?: () => void;
  heartbeat?:
    | false
    | {
        message?: WebSocketHeartbeatMessage; // default: 'ping'
        responseMessage?: WebSocketHeartbeatMessage; // default: message
        interval?: number; // ms, default: 1000
        pongTimeout?: number; // ms, default: 1000
      };
  autoReconnect?:
    | false
    | {
        retries?: number | ((retries: number) => boolean); // default: ∞
        delay?: number | ((retryCount: number) => number); // ms, default: 1000
        onFailed?: () => void;
      };
  immediate?: boolean; // default: true
  protocols?: string[];
  buffer?: boolean; // default: true
  maxBufferSize?: number; // default: 100
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
      if (useBuffer && this.options.buffer !== false) {
        // 检查缓冲区大小限制
        const maxSize = this.options.maxBufferSize || 100;
        if (this.buffered.length >= maxSize) {
          console.warn(
            `WebSocket buffer is full (${maxSize}), dropping oldest message`
          );
          this.buffered.shift();
        }
        this.buffered.push(data);
      }
      return false;
    }
    this.flushBuffer();
    this.ws.send(data);
    return true;
  }

  /** 手动关闭连接（不会再重连） */
  close(code = 1000, reason?: string) {
    this.doClose(true, code, reason);
  }

  /** 重新连接（内部调用，允许重连） */
  open() {
    this.explicitlyClosed = false;
    if (this.ws) this.doClose(false, 1000); // 内部关闭，不设explicitlyClosed
    this.init();
  }

  /** 销毁客户端，清理所有资源 */
  destroy() {
    this.explicitlyClosed = true;
    this.stopRetry();
    this.stopHeartbeat();
    this.ws?.close(1000, "destroyed");
    this.ws = undefined;
    this.buffered = [];
    this.status.value = "CLOSED";
  }

  /** 获取连接状态 */
  get isConnected(): boolean {
    return this.status.value === "OPEN";
  }

  /** 获取重连次数 */
  get retryCount(): number {
    return this.retries;
  }

  private ws?: WebSocket;
  private buffered: (string | ArrayBuffer | Blob)[] = [];
  // 手动关闭为true 异常关闭为false
  private explicitlyClosed = false;
  private retries = 0;
  private retryTimer?: ReturnType<typeof setTimeout>;
  private hbTimer?: ReturnType<typeof setInterval>;
  private pongTimer?: ReturnType<typeof setTimeout>;
  private heartbeatExpect?: WebSocketHeartbeatMessage;

  /** 统一关闭方法 */
  private doClose(isExplicit: boolean, code = 1000, reason?: string) {
    this.stopRetry();
    this.stopHeartbeat();
    if (isExplicit) this.explicitlyClosed = true;
    this.ws?.close(code, reason);
    this.ws = undefined;
    this.status.value = "CLOSED";
  }

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
      this.maybeReconnect(ev);
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
      this.pongTimer = setTimeout(() => {
        console.log("心跳超时，准备重连");
        this.ws?.close(3001, "heartbeat timeout");
      }, pongTimeout);
    }, interval);

    this.heartbeatExpect = responseMessage;
  }

  private stopHeartbeat() {
    clearInterval(this.hbTimer);
    clearTimeout(this.pongTimer);
    this.hbTimer = this.pongTimer = undefined;
  }

  private handleHeartbeatMsg(e: MessageEvent) {
    if (!this.options.heartbeat || !this.heartbeatExpect) return false;

    // 改进心跳消息比较，支持不同类型
    const isHeartbeat = this.compareHeartbeatMessage(
      e.data,
      this.heartbeatExpect
    );
    if (isHeartbeat) {
      clearTimeout(this.pongTimer);
      this.pongTimer = undefined;
      return true;
    }
    return false;
  }

  private compareHeartbeatMessage(
    data: any,
    expected: WebSocketHeartbeatMessage
  ): boolean {
    if (typeof data === typeof expected) {
      return data === expected;
    }

    // 对于不同类型，尝试转换为字符串比较
    if (data instanceof ArrayBuffer && typeof expected === "string") {
      return new TextDecoder().decode(data) === expected;
    }

    if (typeof data === "string" && expected instanceof ArrayBuffer) {
      return data === new TextDecoder().decode(expected);
    }

    return false;
  }

  private maybeReconnect(ev: CloseEvent) {
    const ar = this.options.autoReconnect;
    if (!ar || this.explicitlyClosed) return;

    // 修复：正常关闭且是手动关闭时不重连
    if (ev.code === 1000 && this.explicitlyClosed) return;

    const { retries = -1, delay = 2000, onFailed } = ar;
    const shouldRetry =
      typeof retries === "function"
        ? retries(this.retries)
        : retries < 0 || this.retries < retries;

    if (shouldRetry) {
      this.retries++;

      // 支持动态延迟
      const actualDelay =
        typeof delay === "function" ? delay(this.retries) : delay;

      this.options.onReconnecting?.(this.retries);
      console.log(`第 ${this.retries} 次重连，等待 ${actualDelay}ms...`);

      this.retryTimer = setTimeout(() => {
        console.log("开始重连...");
        this.init();
        this.options.onReconnected?.();
      }, actualDelay);
    } else {
      console.log("重连失败，已达最大次数");
      onFailed?.();
    }
  }

  private stopRetry() {
    clearTimeout(this.retryTimer);
  }
}
