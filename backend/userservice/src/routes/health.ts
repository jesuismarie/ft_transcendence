import { FastifyInstance } from 'fastify';

export default async function healthRoutes(app: FastifyInstance) {
  app.get('/healthz', async () => ({ status: 'ok' }));
}
