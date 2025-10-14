// station-websocket.ts
export class StationWebSocket {
  private ws: WebSocket | null = null;
  private readonly url: string;
  private reconnectInterval = 5000; // 5s reconnect
  private stationId: string;

  constructor(stationId: string) {
    this.stationId = stationId;
    this.url = `ws://localhost:8087/ws/station?stationId=${stationId}`;
  }

  connect() {
    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      console.log("✅ Station WebSocket connected:", this.stationId);
      // Optionally register station on connect
      this.send({ action: "STATION_REGISTER", stationId: this.stationId });
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("📡 Received from server:", data);
        this.handleMessage(data);
      } catch (err) {
        console.error("Invalid WebSocket message:", event.data, err);
      }
    };

    this.ws.onclose = (event) => {
      console.warn("⚠️ Station WebSocket disconnected, reconnecting in 5s...", event.reason);
      setTimeout(() => this.connect(), this.reconnectInterval);
    };

    this.ws.onerror = (err) => {
      console.error("WebSocket error:", err);
      this.ws?.close();
    };
  }

  send(payload: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(payload));
    } else {
      console.warn("WebSocket not open. Cannot send:", payload);
    }
  }

  private handleMessage(data: any) {
    switch (data.type) {
      case "COMMAND":
        console.log("Execute command:", data.command, data.data);
        break;
      case "PING":
        this.send({ action: "PONG" });
        break;
      default:
        console.log("Unhandled WebSocket message:", data);
    }
  }

  disconnect() {
    this.ws?.close();
    this.ws = null;
  }
}