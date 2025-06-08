import 'fastify';

declare module 'fastify' {
	interface FastifyReply {
		sendError(
			err: { statusCode?: number; code?: string; message?: string } | string
		): void;
	}
}