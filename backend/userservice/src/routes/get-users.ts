import { FastifyInstance } from 'fastify';
import db from '../db';

export default async function getUsersRoute(app: FastifyInstance) {
  app.get('/users', async (req, reply) => {
    const users = db.prepare(
      'SELECT id, email, displayName, createdAt FROM users ORDER BY createdAt DESC'
    ).all();
    reply.status(200).send(users);
  });
}
