import fp from 'fastify-plugin';
import type { FastifyInstance, FastifyRequest } from 'fastify';
import { fetch } from 'undici';
import { handleSessionMessages } from './handlers';
import { userConnections, onlineUsers, UserId } from './state';
import type { SocketStream } from './types';

// Set these in env or config!
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://authservice:3001/internal/tokens/verify';
const CLUSTER_TOKEN = process.env.CLUSTER_TOKEN || 'supersecret';

export default fp(async (fastify: FastifyInstance) => {
	
	fastify.get(
		'/users/ws', {
		websocket: true
		},
		async (conn: any, req: FastifyRequest) => {
			// 1. Extract JWT from 'sec-websocket-protocol' header
			let token = req.headers['sec-websocket-protocol'];
			if (Array.isArray(token)) token = token[0];
			if (!token) {
				conn.socket.close(4003, 'Unauthorized'); // 4003: "Forbidden"
				return;
			}
			// 2. Verify JWT via AuthService
			let jwtUserId: number | null = null;
			try {
				const res = await fetch(AUTH_SERVICE_URL, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'X-Cluster-Token': CLUSTER_TOKEN,
					},
					body: JSON.stringify({ token }),
				});

				if (!res.ok) {
					conn.socket.close(4003, 'Unauthorized');
					return;
				}
				const { userId, username } = await res.json() as { userId: any, username: any };
				if (typeof userId !== 'number') throw new Error('Malformed response');
				jwtUserId = userId;
			} catch {
				conn.socket.close(4003, 'Unauthorized');
				return;
			}
			// 3. Ensure single active connection per user
			const prevConn = userConnections.get(jwtUserId);
			if (prevConn) {
				prevConn.socket.close(4000, 'Another session opened'); // Custom close code
			}
			userConnections.set(jwtUserId, conn as SocketStream);
			// 4. Setup message handling
			handleSessionMessages(conn as SocketStream, jwtUserId);
		});
	fastify.decorate('isUserOnline', (userId: UserId) => onlineUsers.has(userId));
});

declare module 'fastify' {
	interface FastifyInstance {
		isUserOnline: (userId: UserId) => boolean;
	}
}
