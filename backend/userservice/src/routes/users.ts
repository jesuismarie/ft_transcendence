import argon2 from "argon2";
import {FastifyInstance, FastifyReply} from "fastify";
import { UserRepo } from "../repositories/userRepo";
import { createUserSchema, updateUserSchema } from "../schemas/userSchemas";
import { listUsersQuery } from "../schemas/userSchemas";

export default async function userRoutes(app: FastifyInstance) {
    const userRepo = new UserRepo(app);

    /* --- CRUD --- */
    app.post('/users', {schema: {body: createUserSchema}}, async (req, reply: FastifyReply) => {
        const {email, password, displayName} = req.body as any;
        if (userRepo.findByEmail(email)) return reply.sendError({statusCode: 409, message: 'Email already exists'});
        const hash = await argon2.hash(password);
        const user = userRepo.create(email, displayName, hash);
        reply.code(201).send(user);
    });

    app.get('/users', { schema: { querystring: listUsersQuery } }, async (req) => {
        const { offset = 0, limit = 20, q } = req.query as any;
        return userRepo.findAll({ offset, limit, q });
    });

    app.get('/users/:id', async (req, reply: FastifyReply) => {
        const id = Number((req.params as any).id);
        const user = userRepo.findById(id);
        if (!user)
            return reply.sendError({statusCode: 404, message: 'User not found'});
        return user;
    });

    app.put('/users/:id', {schema: {body: updateUserSchema}}, async (req, reply: FastifyReply) => {
        reply.send({status: 'ok'});
    });
    
    app.patch(
        '/users/:id',
        { schema: {body: updateUserSchema}},
        async (req, reply: FastifyReply) => {
            const id = Number((req.params as any).id);
            const { displayName, email } = req.body as any;
            
            // fetch current row or 404
            const user = userRepo.findById(id);
            if (!user)
                return reply.sendError({ statusCode: 404, code: 'USER_NOT_FOUND', message: 'User not found' });
            
            // duplicate-email guard
            if (email && userRepo.findByEmail(email))
                return reply.sendError({ statusCode: 409, code: 'EMAIL_EXISTS', message: 'Email already registered' });
            
            return userRepo.update(id, {
                displayName,
                email});
        }
    );
    
    app.delete('/users/:id', async (req, reply: FastifyReply) => {
        const id = Number((req.params as any).id);
        const deleted = userRepo.delete(id);
        if (!deleted) return reply.sendError({statusCode: 404, message: 'User not found'});
        reply.code(204).send();
    });
}