import argon2 from "argon2";
import { FastifyInstance } from "fastify";
import { UserRepo } from "../repositories/userRepo";
import { createUserSchema, updateUserSchema } from "../schemas/userSchemas";

export default async function userRoutes(app: FastifyInstance) {
    const userRepo = new UserRepo(app);

    /* --- CRUD --- */
    app.post('/users', {schema: {body: createUserSchema}}, async (req, reply) => {
        const {email, password, displayName} = req.body as any;
        if (userRepo.findByEmail(email)) return reply.code(409).send({error: 'Email exists'});
        const hash = await argon2.hash(password);
        const user = userRepo.create(email, displayName, hash);
        reply.code(201).send(user);
    });

    app.get('/users', async () => userRepo.findAll());

    app.get('/users/:id', async (req, reply) => {
        const id = Number((req.params as any).id);
        const user = userRepo.findById(id);
        if (!user) return reply.code(404).send({error: 'Not found'});
        return user;
    });

    app.put('/users/:id', {schema: {body: updateUserSchema}}, async (req, reply) => {
        const id = Number((req.params as any).id);
        const {displayName} = req.body as any;
        const user = userRepo.update(id, displayName);
        if (!user) return reply.code(404).send({error: 'Not found'});
        return user;
    });

    app.delete('/users/:id', async (req, reply) => {
        const id = Number((req.params as any).id);
        const deleted = userRepo.delete(id);
        if (!deleted) return reply.code(404).send({error: 'Not found'});
        reply.code(204).send();
    });
}