import { userConnections, onlineUsers, graceTimers, UserId } from './state';
import type { SocketStream } from './types';

// Message from SPA
export interface StatusMessage {
	userId: UserId;
	status: 'online' | 'offline';
}

export function handleSessionMessages(conn: SocketStream, jwtUserId: UserId) {
	conn.socket.on('message', (msg) => {
		try {
			const data = JSON.parse(msg.toString()) as StatusMessage;
			// Ignore messages with wrong userId or invalid status
			if (data.userId !== jwtUserId) return;
			if (!['online', 'offline'].includes(data.status)) return;
			
			// Always replace prior session for user (already handled in plugin)
			if (data.status === 'online') {
				onlineUsers.add(data.userId);
				// Remove any pending offline timer
				clearGraceTimer(data.userId);
			} else if (data.status === 'offline') {
				maybeScheduleOffline(data.userId);
			}
		} catch {
			// Ignore parse errors or bad input
		}
	});
	
	conn.socket.on('close', () => {
		// Remove connection from userConnections
		let userId: UserId | undefined;
		for (const [uid, c] of userConnections) {
			if (c === conn) {
				userId = uid;
				break;
			}
		}
		if (userId !== undefined) {
			userConnections.delete(userId);
			maybeScheduleOffline(userId);
		}
	});
}

function maybeScheduleOffline(userId: UserId) {
	if (graceTimers.has(userId)) return;
	graceTimers.set(
		userId,
		setTimeout(() => {
			graceTimers.delete(userId);
			if (!userConnections.has(userId)) onlineUsers.delete(userId);
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
