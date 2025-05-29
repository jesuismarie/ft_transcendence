import type { SocketStream } from './types';

export type UserId = number;

// Multiple connections are allowed for the same user, but only one is considered "active" at a time.
export const allConnections = new Set<SocketStream>();
export const userConnections = new Map<UserId, Set<SocketStream>>();
export const onlineUsers = new Set<UserId>();
export const graceTimers = new Map<UserId, NodeJS.Timeout>();
