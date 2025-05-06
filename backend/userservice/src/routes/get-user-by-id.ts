import { FastifyInstance } from 'fastify';
import db from '../db';
import { userParams } from '../schemas/user-schema';

export default async function getUserByIdRoute(app: FastifyInstance) {
  app.get('/users/:id', { schema: { params: userParams } }, async (req, reply) => {
    const { id } = req.params as { id: number };
    const user = db.prepare(
      'SELECT id, email, displayName, createdAt FROM users WHERE id = ?'
    ).get(id);
    if (!user) return reply.status(404).send({ error: 'User not found' });
    reply.send(user);
  });
}
