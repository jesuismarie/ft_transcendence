import Websocket from 'ws';
import { allConnections, userConnections, onlineUsers, graceTimers, UserId } from './state';
import type { StatusMessage } from './types';


export function handleConnection(socket : Websocket) {
	let currentUserId: UserId | null = null;
	allConnections.add(socket);
	
	socket.on('message', (msg) => {
		try {
			const data = JSON.parse(msg.toString()) as { event: string, payload: StatusMessage };
			console.log(data);
			// Check for a custom event type
			if (data.event !== 'user:status') return ; // Just do nothing
			const payload = data.payload as StatusMessage;
			if (!['online', 'offline'].includes(payload.status)) {
				socket.send("error");
				return;
			}
			
			currentUserId = Number(payload.userId);
			console.log(`User ${payload.userId} is now ${payload.status}`);
			let set = userConnections.get(currentUserId);
			if (!set) userConnections.set(currentUserId, (set = new Set<Websocket>()));
			set.add(socket);
			
			console.log('Adding userId:', currentUserId, 'Type:', typeof currentUserId);
			if (payload.status === 'online') {
				onlineUsers.add(currentUserId);
				clearGraceTimer(payload.userId);
			} else if (payload.status === 'offline') {
				maybeScheduleOffline(payload.userId);
			}
			socket.send("ok");
		} catch {
			console.error('Error processing message:', msg.toString());
			socket.send("error");
		}
	});
	
	socket.on('close', () => {
		allConnections.delete(socket);
		if (currentUserId !== null) {
			const set = userConnections.get(currentUserId);
			set?.delete(socket);
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
		}, 1)
	);
}

function clearGraceTimer(userId: UserId) {
	const timer = graceTimers.get(userId);
	if (timer) {
		clearTimeout(timer);
		graceTimers.delete(userId);
	}
}