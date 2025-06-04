import {Status} from "@/core/models/status";

export interface PersistenceService {
    init(): void;
    disconnect(): void;
    handleUnload(): void;
    sendStatus(status: Status): void;
    handleUnload(): void;
}