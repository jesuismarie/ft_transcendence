import { allConnections, userConnections, onlineUsers, graceTimers, UserId } from './state';
import type { SocketStream } from './types';

// Message from SPA
export interface StatusMessage {
	userId: UserId;
	status: 'online' | 'offline';
}

export function handleConnection(conn: SocketStream) {
	let currentUserId: UserId | null = null;
	allConnections.add(conn);
	
	conn.socket.on('message', (msg) => {
		try {
			const data = JSON.parse(msg.toString()) as StatusMessage;
			if (!['online', 'offline'].includes(data.status)) return;
			
			currentUserId = data.userId;
			let set = userConnections.get(data.userId);
			if (!set) userConnections.set(data.userId, (set = new Set<SocketStream>()));
			set.add(conn);
			
			if (data.status === 'online') {
				onlineUsers.add(data.userId);
				clearGraceTimer(data.userId);
			} else if (data.status === 'offline') {
				maybeScheduleOffline(data.userId);
			}
		} catch {}
	});
	
	conn.socket.on('close', () => {
		allConnections.delete(conn);
		if (currentUserId !== null) {
			const set = userConnections.get(currentUserId);
			set?.delete(conn);
			if (!set || set.size === 0) {
				userConnections.delete(currentUserId);
				maybeScheduleOffline(currentUserId);
			}
		}
	});
}

function maybeScheduleOffline(userId: UserId) {
	if (graceTimers.has(userId)) return;
	graceTimers.set(
		userId,
		setTimeout(() => {
			graceTimers.delete(userId);
			const set = userConnections.get(userId);
			if (!set || set.size === 0) onlineUsers.delete(userId);
		}, 100)
	);
}

function clearGraceTimer(userId: UserId) {
	const timer = graceTimers.get(userId);
	if (timer) {
		clearTimeout(timer);
		graceTimers.delete(userId);
	}
}