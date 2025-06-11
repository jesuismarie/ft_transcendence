import { FastifyInstance } from "fastify";

// Health check route
export default async function healthRoute(app: FastifyInstance) {
	app.get('/health', async (request, reply) => {
		reply.send({ status: 'ok' });
	});
}
