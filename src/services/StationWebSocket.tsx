// station-websocket.ts
export class StationWebSocket {
  private ws: WebSocket | null = null;
  private readonly url: string;
  private reconnectInterval = 5000; // 5s reconnect
  private stationId: string;
  private messageHandlers: Map<string, (data: any) => void> = new Map();
  private isReconnecting = false;

  constructor(stationId: string) {
    this.stationId = stationId;
    this.url = `ws://localhost:8087/ws/station?stationId=${stationId}`;
  }

  connect() {
    if (this.isReconnecting) return;
    
    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      console.log("✅ Station WebSocket connected:", this.stationId);
      this.isReconnecting = false;
      // Register station on connect
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
      this.isReconnecting = true;
      this.send({ action: "STATION_DISCONNECT", stationId: this.stationId });
      setTimeout(() => {
        this.isReconnecting = false;
        this.connect();
      }, this.reconnectInterval);
    };

    this.ws.onerror = (err) => {
      console.error("WebSocket error:", err);
      this.ws?.close();
    };
  }

  send(payload: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(payload));
      console.log("📤 Sent to server:", payload);
    } else {
      console.warn("WebSocket not open. Cannot send:", payload);
    }
  }

  // Register custom message handlers
  on(messageType: string, handler: (data: any) => void) {
    this.messageHandlers.set(messageType, handler);
  }

  // Send user login action
  sendUserLogin(userId: string, username: string) {
    this.send({
      action: "USER_LOGIN",
      stationId: this.stationId,
      userId,
      username,
      timestamp: new Date().toISOString()
    });
  }

  // Send user logout action
  sendUserLogout(userId: string) {
    this.send({
      action: "USER_LOGOUT",
      stationId: this.stationId,
      userId,
      timestamp: new Date().toISOString()
    });
  }

  // Send game launch action
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

  // Send station status update
  sendStationStatus(status: { timeLeft: number; coins: number; activeGame?: string }) {
    this.send({
      action: "STATION_STATUS_UPDATE",
      stationId: this.stationId,
      status,
      timestamp: new Date().toISOString()
    });
  }

  // Send station active session
  sendStationActive(sessionData: any) {
    this.send({
      action: "STATION_ACTIVE",
      stationId: this.stationId,
      sessionData,
      timestamp: new Date().toISOString()
    });
  }

  private handleMessage(data: any) {
    const { command, type } = data;
    
    // Handle custom registered handlers
    if (command && this.messageHandlers.has(command)) {
      this.messageHandlers.get(command)?.(data);
      return;
    }

    switch (type || command) {
      case "COMMAND":
        console.log("Execute command:", data.command, data.data);
        // Emit to custom handlers
        if (data.command && this.messageHandlers.has(data.command)) {
          this.messageHandlers.get(data.command)?.(data.data);
        }
        break;
      
      case "PING":
        this.send({ action: "PONG" });
        break;
      
      case "STATION_RECONNECT":
        console.log("Station reconnect requested");
        this.connect();
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
}