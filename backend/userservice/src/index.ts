import fastify from 'fastify';
import Ajv from 'ajv';
import db from './db';
import argon2 from 'argon2';

// --------------------- Fastify & Ajv setup ------------------------------
const ajv = new Ajv({
    allErrors: true,
    removeAdditional: 'all',
    coerceTypes: true,
});

const app = fastify({ logger: true });

app.setValidatorCompiler(({ schema }) => ajv.compile(schema));

// ------------------------ JSON Schemas ---------------------------------
const emailPattern = "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$";

const createUserBody = {
    type: 'object',
    required: ['email', 'password', 'displayName'],
    additionalProperties: false,
    properties: {
        email: { type: 'string', pattern: emailPattern },
        password: { type: 'string', minLength: 8 },
        displayName: { type: 'string', minLength: 3, maxLength: 32 },
    },
} as const;

const userParams = {
    type: 'object',
    required: ['id'],
    properties: {
        id: { type: 'integer', minimum: 1 },
    },
} as const;

// --------------------------- Routes ------------------------------------
app.get('/healthz', async () => ({ status: 'ok' }));

app.post(
    '/users',
    { schema: { body: createUserBody } },
    async (req, reply) => {
        const { email, password, displayName } = req.body as {
            email: string;
            password: string;
            displayName: string;
        };

        // Uniqueness check
        const exists = db.prepare('SELECT 1 FROM users WHERE email = ?').get(email);
        if (exists) {
            return reply.status(409).send({ error: 'Email already in use' });
        }

        const hash = await argon2.hash(password, { type: argon2.argon2id });
        const stmt = db.prepare(
            'INSERT INTO users (email, displayName, passwordHash) VALUES (?, ?, ?)',
        );
        const result = stmt.run(email, displayName, hash);
        return reply
            .status(201)
            .send({ id: result.lastInsertRowid, email, displayName });
    },
);

app.get(
    '/users/:id',
    { schema: { params: userParams } },
    async (req, reply) => {
        const { id } = req.params as { id: number };
        const user = db
            .prepare(
                'SELECT id, email, displayName, createdAt FROM users WHERE id = ?',
            )
            .get(id);
        if (!user) return reply.status(404).send({ error: 'User not found' });
        return user;
    },
);

// TODO: PUT /users/:id, DELETE /users/:id, friend endpoints, JWT guard

// --------------------------- Start -------------------------------------
const start = async () => {
    try {
        await app.listen({ port: 3000, host: '0.0.0.0' });
        app.log.info('UserService running on http://localhost:3000');
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};

start();

