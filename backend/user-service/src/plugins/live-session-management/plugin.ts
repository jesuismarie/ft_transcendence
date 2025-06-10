import fp from 'fastify-plugin';
import type { FastifyInstance, FastifyRequest } from 'fastify';
import { handleConnection } from './handlers';
import { onlineUsers, UserId } from './state';

export default fp(async (fastify: FastifyInstance) => {
	fastify.get(
		'/users/ws', {
		websocket: true
		},
		async (socket, req) => {
			handleConnection(socket);
		});
	fastify.decorate('isUserOnline', (userId: UserId) => onlineUsers.has(userId));
});

declare module 'fastify' {
	interface FastifyInstance {
		isUserOnline: (userId: UserId) => boolean;
	}
}
