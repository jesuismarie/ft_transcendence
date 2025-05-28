import { FastifyInstance, FastifyReply } from "fastify";
import { UserRepo } from "../../repositories/userRepo";
import {updatePasswordResponseSchema, updatePasswordSchema} from "../../schemas/userSchemas";
import { errorSchema } from "../../schemas/errorSchema";
import { UserTypes } from "@KarenDanielyan/ft-transcendence-api-types";
import argon2 from "argon2";


export default async function updateUserPasswordRoute(app: FastifyInstance, userRepo: UserRepo) {
	app.put<{Body: UserTypes.UpdatePasswordRequest; Reply: UserTypes.UserUpdateResponse}>(
		'/users/:id/password',
		{
			schema: {
				body: updatePasswordSchema,
				response: {
					'2xx': updatePasswordResponseSchema,
					'4xx': errorSchema,
					'5xx': errorSchema
				}
			}
		},
		async (req, reply: FastifyReply) => {
			const id = Number((req.params as any).id);
			const { currentPwd, newPwd } = req.body as UserTypes.UpdatePasswordRequest;
			const user = userRepo.findById(id);
			
			if (!user)
				return reply.sendError({ statusCode: 404, message: 'User not found' });
			if (user.authProvider != 'local')
				return reply.sendError({ statusCode: 400, message: "Google Authorized Users can't set a password." });
			const pwdHash = user.passwordHash ?? '';
			if (!await argon2.verify(pwdHash, currentPwd))
				return reply.sendError({ statusCode: 401, message: 'Invalid password' });
			if (currentPwd === newPwd)
				return reply.sendError({ statusCode: 400, message: 'New password must be different from old password' });
			const hash = await argon2.hash(newPwd);
			const updated = userRepo.update(id, { passwordHash: hash });
			return reply.send({modified: updated});
		});
}