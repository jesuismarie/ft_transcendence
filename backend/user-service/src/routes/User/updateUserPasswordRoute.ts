import { FastifyInstance, FastifyReply } from "fastify";
import { UserRepo } from "../../repositories/userRepo";
import { updatePasswordSchema } from "../../schemas/userSchemas";
import argon2 from "argon2";


export default async function updateUserPasswordRoute(app: FastifyInstance, userRepo: UserRepo) {
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
}