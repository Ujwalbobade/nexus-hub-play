// Type for all station WebSocket messages
export type StationMessage = {
  action?: string;
  minutes?: number;
  bonusCoins?: number;
  [key: string]: unknown;
  addedMinutes?: number;
  data?: StationMessage | null;
  command?: string;
  type?: string;
  stationId?: string;
  sessionId?: string;
  userId?: string;
  username?: string;
  gameId?: string;
  gameTitle?: string;
  endTime?: string;
  status?: {
    timeLeft: number;
    coins: number;
    activeGame?: string;
  };
  transactionId?: string;
  amount?: number;
  itemName?: string;
  timestamp?: string;
  message?: string;
timeRemaining?: number;
};

import { timePacks } from "@/components/station/data";
import config from "../../public/stationconfig.json";
import { getStationFromMac } from "./api";
import { TimePacksTab } from "@/components/station/tabs/TimePacksTab";

export class StationWebSocket {
  public getStationId() {
    return this.stationId;
  }
  private ws: WebSocket | null = null;
  private readonly url: string;
  private reconnectInterval = 5000;
  private stationId: string;
  private stationName?: string;
  private messageHandlers: Map<string, (data: StationMessage) => void> = new Map();
  private isReconnecting = false;


  async connect() {
    if (this.isReconnecting) return;

    try {
      // ✅ Fetch real station data first
      const station = await getStationFromMac(config.macAddress);
      this.stationId = station.id.toString();
      this.stationName = station.name;

      console.log(`✅ Station resolved via MAC: ${this.stationName} (ID: ${this.stationId})`);

      // ✅ Create WebSocket only after we have real stationId
      const wsUrl = `ws://localhost:8087/ws/station?stationId=${this.stationId}`;
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log("✅ Station WebSocket connected:", this.stationId);
        this.isReconnecting = false;
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
    } catch (error) {
      console.error("❌ Failed to resolve station from MAC:", error);
    }
  }

  send(payload: StationMessage) {
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

  // --- Admin commands ---
  sendPaymentNotification(transactionId: string, amount: number, itemName: string) {
    this.send({
      action: "PAYMENT_NOTIFICATION",
      stationId: this.stationId,
      transactionId,
      amount,
      itemName,
      timestamp: new Date().toISOString()
    });
  }

  // --- Message handling ---
  private handleMessage(data: StationMessage) {
    const { command, type, action } = data;

    // Handle admin commands
    if (typeof action === "string" && this.messageHandlers.has(action)) {
      this.messageHandlers.get(action)?.(data);
      return;
    }

    if (typeof command === "string" && this.messageHandlers.has(command)) {
      this.messageHandlers.get(command)?.(data);
      return;
    }

    switch (type || command || action) {
      case "STATION_REGISTER":
      case "STATION_REGISTERED":
      case "SESSION_DETAILS":
        console.log(`✅ Station ${data.stationId} registered successfully with session ${data.sessionId}`);
        this.messageHandlers.get("STATION_REGISTERED")?.(data);
        this.messageHandlers.get("SESSION_DETAILS")?.(data);
        return;

      case "COMMAND":
        if (typeof data.command === "string") {
          console.log("Execute command:", data.command, data.data);
          // If data.data is not a StationMessage, pass an empty object
          this.messageHandlers.get(data.command)?.(typeof data.data === "object" && data.data !== null ? data.data as StationMessage : {});
        }
        break;

      case "ADD_TIME":
      case "LOGOUT_USER":
      case "SHUTDOWN_STATION":
      case "RESTART_STATION":
      case "TIME_APPROVED": {
        const key = typeof action === "string" ? action : typeof type === "string" ? type : typeof command === "string" ? command : undefined;
        if (key && this.messageHandlers.has(key)) {
          console.log("Admin command received:", key, data);
          this.messageHandlers.get(key)?.(data);
        }
        break;
      }

      case "TIME_ADDED": {
        const payload = (data.data as StationMessage) || data;
        const addedMinutes = payload.addedMinutes ?? payload.minutes;

        console.log(`⏱️ Additional time added: +${addedMinutes} minutes`);
        this.messageHandlers.get("TIME_ADDED")?.(payload);
        ;
        return;
      }

      case "PING":
        this.send({ action: "PONG" });
        break;

    }
    if (data.message === "Station registered successfully") {
      console.log(`✅ Station ${data.stationId} registered successfully with session ${data.sessionId}`);
      this.messageHandlers.get("STATION_REGISTERED")?.(data);
      return;
    }
    console.log("Unhandled WebSocket message:", data);
  }

  disconnect() {
    if (this.ws) {
      this.send({ action: "STATION_DISCONNECT", stationId: this.stationId });
      this.ws.close();
      this.ws = null;
    }
  }

  on(messageType: string, handler: (data: StationMessage) => void) {
    this.messageHandlers.set(messageType, handler);
  }


}