import argon2 from "argon2";
import fs from "fs";
import sharp from "sharp";
import path from "path";
import { randomUUID } from "crypto";
import {FastifyInstance, FastifyReply} from "fastify";
import { UserRepo } from "../repositories/userRepo";
import {createUserSchema, updatePasswordSchema, updateUserSchema} from "../schemas/userSchemas";
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
                username: displayName,
                email});
        }
    );
    
    app.put('/users/:id/avatar', async (req, reply: FastifyReply) => {
        const id = Number((req.params as any).id);
        const user = userRepo.findById(id);
        if (!user)
            return reply.sendError({ statusCode: 404, message: 'User not found' });
        
        // get the file
        const file = await (req as any).file();          // plugin guarantees type
        if (!file)
            return reply.sendError({ statusCode: 400, message: 'No file field' });
        
        // read into buffer
        let buf = await file.toBuffer();
        
        // verify dimensions (must be 200×200)
        const meta = await sharp(buf).metadata();
        if (meta.width !== 200 || meta.height !== 200) {
            // Resize to 200x200
            buf = await sharp(buf)
                .resize(200, 200, { fit: 'cover' })
                .toBuffer();
        }
        // store under public/avatars
        const filename = `${randomUUID()}.png`;
        const absPath  = path.join(process.cwd(), 'public', 'avatars');
        fs.mkdirSync(absPath, { recursive: true });
        await sharp(buf).png().toFile(path.join(absPath, filename));
        // update DB
        const avatarUrl = `/static/avatars/${filename}`;
        return userRepo.update(id, { avatarPath: avatarUrl });
    });
    
    app.put('/users/:id/password', { schema: { body: updatePasswordSchema } },
        async (req, reply: FastifyReply) => {
        const id = Number((req.params as any).id);
        const { oldPassword, newPassword } = req.body as any;
        const user = userRepo.findByIdAll(id);
        
        if (!user)
            return reply.sendError({ statusCode: 404, message: 'User not found' });
        if (!await argon2.verify(user.passwordHash, oldPassword))
            return reply.sendError({ statusCode: 401, message: 'Invalid password' });
        if (oldPassword === newPassword)
            return reply.sendError({ statusCode: 400, message: 'New password must be different from old password' });
        const hash = await argon2.hash(newPassword);
        return userRepo.update(id, { passwordHash: hash });
    });
    
    app.delete('/users/:id', async (req, reply: FastifyReply) => {
        const id = Number((req.params as any).id);
        const deleted = userRepo.delete(id);
        if (!deleted) return reply.sendError({statusCode: 404, message: 'User not found'});
        reply.code(204).send();
    });
}