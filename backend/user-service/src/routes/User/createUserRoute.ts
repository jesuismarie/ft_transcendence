import { FastifyInstance, FastifyReply } from "fastify";
import { UserRepo } from "../../repositories/userRepo";
import { createUserSchema } from "../../schemas/userSchemas";
import argon2 from "argon2";

export default async function createUserRoute(app: FastifyInstance, userRepo: UserRepo) {
	app.post('/users', {schema: {body: createUserSchema}}, async (req, reply: FastifyReply) => {
		const {email, password, displayName} = req.body as any;
		if (userRepo.findByEmail(email)) return reply.sendError({statusCode: 409, message: 'Email already exists'});
		const hash = await argon2.hash(password);
		const user = userRepo.create(email, displayName, hash);
		reply.code(201).send(user);
	});
}