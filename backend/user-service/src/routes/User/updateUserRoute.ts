import { FastifyInstance, FastifyReply } from "fastify";
import { UserRepo } from "../../repositories/userRepo";
import { updateUserSchema } from "../../schemas/userSchemas";


export default async function updateUserRoute(app: FastifyInstance, userRepo: UserRepo) {
	app.put(
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
}