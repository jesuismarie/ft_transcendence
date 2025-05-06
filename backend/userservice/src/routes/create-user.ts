import { FastifyInstance } from 'fastify';
import db from '../db';
import argon2 from 'argon2';
import { createUserBody } from '../schemas/user-schema';

export default async function createUserRoute(app: FastifyInstance) {
  app.post('/createUser', { schema: { body: createUserBody } }, async (req, reply) => {
    const { email, password, displayName, name } = req.body as {
      email: string;
      password: string;
      displayName: string;
      name: string;
    };

    const exists = db.prepare('SELECT 1 FROM users WHERE email = ?').get(email);
    if (exists) {
      return reply.status(409).send({ error: 'Email already in use' });
    }

    const hash = await argon2.hash(password, { type: argon2.argon2id });
    const stmt = db.prepare(
      'INSERT INTO users (email, displayName, name, passwordHash) VALUES (?, ?, ?, ?)'
    );
    const result = stmt.run(email, displayName, name, hash);
    reply.status(201).send({ id: result.lastInsertRowid, email, displayName });
  });
}
