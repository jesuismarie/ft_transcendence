import { allConnections, userConnections, onlineUsers, graceTimers, UserId } from './state';
import type { StatusMessage } from './types';
import WebSocket from "ws";


export function handleConnection(socket : WebSocket) {
	let currentUserId: UserId | null = null;
	allConnections.add(socket);
	
	socket.on('message', (msg) => {
		try {
			const data = JSON.parse(msg.toString()) as StatusMessage;
			console.log(data);
			if (!['online', 'offline'].includes(data.status)) {
				socket.send("error");
				return;
			}
			
			currentUserId = Number(data.userId);
			console.log(`User ${data.userId} is now ${data.status}`);
			let set = userConnections.get(currentUserId);
			if (!set) userConnections.set(currentUserId, (set = new Set<WebSocket>()));
			set.add(socket);
			
			console.log('Adding userId:', currentUserId, 'Type:', typeof currentUserId);
			if (data.status === 'online') {
				onlineUsers.add(currentUserId);
				clearGraceTimer(data.userId);
			} else if (data.status === 'offline') {
				maybeScheduleOffline(data.userId);
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