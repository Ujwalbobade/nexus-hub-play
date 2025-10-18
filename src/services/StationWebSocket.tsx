import os from "os";

export class StationWebSocket {
  private ws: WebSocket | null = null;
  private readonly url: string;
  private reconnectInterval = 5000;
  private stationId: string;
  private stationName?: string;
  private messageHandlers: Map<string, (data: any) => void> = new Map();
  private isReconnecting = false;

  constructor(stationId?: string, stationName?: string) {
    this.stationId = stationId || this.getMacAddress(); // Fallback to system MAC
    this.stationName = stationName || "UnknownStation";
    this.url = `ws://localhost:8087/ws/station?stationId=${this.stationId}`;
  }

  private getMacAddress(): string {
    try {
      const interfaces = os.networkInterfaces();
      for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]!) {
          if (!iface.internal && iface.mac && iface.mac !== "00:00:00:00:00:00") {
            console.log("Using MAC address as station ID:", iface.mac);
            return iface.mac.toLowerCase();
          }
        }
      }
    } catch {
      console.warn("⚠️ Unable to fetch MAC address (browser environment)");
    }
    return "unknown-mac";
  }

  connect() {
  if (this.isReconnecting) return;

  this.ws = new WebSocket(this.url);

  this.ws.onopen = () => {
    console.log("✅ Station WebSocket connected:", this.stationId);
    this.isReconnecting = false;

    // Send only MAC address to backend
    this.send({
      action: "STATION_REGISTER",
      stationId: this.stationId, // only MAC
    });
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
    console.warn("⚠️ Disconnected, will reconnect in 5s...", event.reason);
    this.isReconnecting = true;
    setTimeout(() => {
      this.isReconnecting = false;
      this.connect();
    }, this.reconnectInterval);
  };

  this.ws.onerror = (err) => {
    console.error("❌ WebSocket error:", err);
    this.ws?.close();
  };
}
  send(payload: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(payload));
      console.log("📤 Sent:", payload);
    } else {
      console.warn("WebSocket not open. Cannot send:", payload);
    }
  }

  // --- User actions ---
  sendUserLogin(userId: string, username: string) {
    this.send({
      action: "USER_LOGIN",
      stationId: this.stationId,
      userId,
      username,
      timestamp: new Date().toISOString()
    });
  }

  sendUserLogout(userId: string) {
    this.send({
      action: "USER_LOGOUT",
      stationId: this.stationId,
      userId,
      timestamp: new Date().toISOString()
    });
  }

  sendGameLaunch(gameId: string, gameTitle: string, userId: string) {
    this.send({
      action: "GAME_LAUNCH",
      stationId: this.stationId,
      gameId,
      gameTitle,
      userId,
      timestamp: new Date().toISOString()
    });
  }

  sendStationStatus(status: { timeLeft: number; coins: number; activeGame?: string }) {
    this.send({
      action: "STATION_STATUS_UPDATE",
      stationId: this.stationId,
      status,
      timestamp: new Date().toISOString()
    });
  }

  // --- Message handling ---
  private handleMessage(data: any) {
    const { command, type } = data;
    if (command && this.messageHandlers.has(command)) {
      this.messageHandlers.get(command)?.(data);
      return;
    }

    switch (type || command) {
      case "COMMAND":
        console.log("Execute command:", data.command, data.data);
        this.messageHandlers.get(data.command)?.(data.data);
        break;

      case "PING":
        this.send({ action: "PONG" });
        break;

      default:
        console.log("Unhandled WebSocket message:", data);
    }
  }

  disconnect() {
    if (this.ws) {
      this.send({ action: "STATION_DISCONNECT", stationId: this.stationId });
      this.ws.close();
      this.ws = null;
    }
  }

  on(messageType: string, handler: (data: any) => void) {
    this.messageHandlers.set(messageType, handler);
  }
}