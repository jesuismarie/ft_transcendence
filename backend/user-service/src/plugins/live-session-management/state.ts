import Websocket from 'ws';

export type UserId = number;

// Multiple connections are allowed for the same user, but only one is considered "active" at a time.
export const allConnections = new Set<Websocket>();
export const userConnections = new Map<UserId, Set<Websocket>>();
export const onlineUsers = new Set<UserId>();
export const graceTimers = new Map<UserId, NodeJS.Timeout>();
