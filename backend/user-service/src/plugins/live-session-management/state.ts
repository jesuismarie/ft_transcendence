import type { SocketStream } from './types';

export type UserId = number;

// Only one active connection per user (latest one wins)
export const userConnections = new Map<UserId, SocketStream>();
export const onlineUsers = new Set<UserId>();
export const graceTimers = new Map<UserId, NodeJS.Timeout>();
