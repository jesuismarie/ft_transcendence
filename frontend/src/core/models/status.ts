export type PresenceMessage = {
    userId: string;
    status: Status;
};

export enum Status {
    Online = "online",
    Offline = "offline",
}