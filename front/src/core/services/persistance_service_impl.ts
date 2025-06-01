import {type PresenceMessage, Status} from "@/core/models/status";
import type {PersistenceService} from "@/core/services/persistance_service";
import {getCurrentUserId} from "@/utils/user";


export class PersistenceServiceImpl implements PersistenceService {
    private ws: WebSocket | null = null;
    private readonly backendUrl: string;

    constructor(backendUrl: string) {
        this.backendUrl = backendUrl;
        this.init();
    }

    public init(): void {
        this.ws = new WebSocket(this.backendUrl);

        this.ws.onopen = () => {
            this.sendStatus(Status.Online);
            window.addEventListener("beforeunload", this.handleUnload);
        };

        this.ws.onclose = () => {
            this.sendStatus(Status.Offline);
            window.removeEventListener("beforeunload", this.handleUnload);
        };

        this.ws.onerror = (err) => {
            console.error("WebSocket error:", err);
        };
    }

    public handleUnload = (): void => {
        this.sendStatus(Status.Offline);
    };

    public sendStatus(status: Status): void {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            const userId = getCurrentUserId().toString();
            const payload: PresenceMessage = {
                userId: userId,
                status,
            };
            this.ws.send(JSON.stringify({ event: "user:status", payload }));
        }
    }

    public disconnect(): void {
        this.sendStatus(Status.Offline);
        this.ws?.close();
    }
}