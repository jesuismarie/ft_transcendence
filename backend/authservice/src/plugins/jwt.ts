import fp from 'fastify-plugin';
import fastifyJwt from '@fastify/jwt';
import { FastifyInstance } from 'fastify';

export default fp(async (app: FastifyInstance) => {
	app.register(fastifyJwt, {
		secret: app.config.JWT_SECRET,       // provided by env plugin
	});
	
	app.decorate('authenticate', async (request) => {
		await request.jwtVerify();
	});
});

declare module 'fastify' {
	interface FastifyInstance {
		authenticate: (request: any) => Promise<void>;
	}
}
