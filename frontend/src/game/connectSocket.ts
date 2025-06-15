// lib/connectSocket.ts
import {ApiConstants} from "@/core/constants/apiConstants";

type Listener = (data: any) => void;

class WebSocketWrapper {
  private ws: WebSocket;
  private listeners: Map<string, Listener[]> = new Map();

  constructor(matchId: string, username: string) {

    const url = `${ApiConstants.gameWebsocketBaseUrl}/${matchId}/${username}`;
    this.ws = new WebSocket(url);
    this.ws.onopen = () => {
      console.log("WebSocket GAME  opened");

    }

    this.ws.onerror = (e) => {
      console.error(`WebSocket GAME ERROR ${JSON.stringify(e)}`);
    }
    this.ws.onmessage = (event) => {
      try {
        const { event: evt, data } = JSON.parse(event.data);
        const callbacks = this.listeners.get(evt);
        if (callbacks) {
          callbacks.forEach((cb) => cb(data));
        }
      } catch (err) {
        console.error("Invalid WebSocket message", err);
      }
    };
  }

  on(event: string, callback: Listener) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  emit(event: string, data: any) {
    this.ws.send(JSON.stringify({ event, data }));
  }
}

export const connectSocket = (matchId: string, username: string) =>
    new WebSocketWrapper(matchId, username);
