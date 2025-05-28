// Internal POST request to verify a user's password
import { FastifyInstance, FastifyReply } from "fastify";
import { UserRepo } from "../../repositories/userRepo";
import { verifyPasswordResponseSchema, verifyPasswordSchema } from "../../schemas/userSchemas";
import { errorSchema } from "../../schemas/errorSchema";
import {AuthTypes} from "@ft-transcendence/api-types";
import argon2 from "argon2";


export default async function verifyPasswordRoute(app: FastifyInstance, userRepo: UserRepo) {
	app.post<{Body: AuthTypes.LoginRequest; Reply: {userId: number}}>(
		'/internal/users/verify-password',
		{
			schema: {
				body: verifyPasswordSchema,
				response: {
					'2xx': verifyPasswordResponseSchema,
					'4xx': errorSchema,
					'5xx': errorSchema
				}
			}
		},
		async (req, reply) => {
			const {email, password} = req.body;
			const user = userRepo.findByEmail(email);
			if (!user) {
				reply.sendError({statusCode: 404, message: 'User not found'});
			} else {
				if (user.authProvider !== 'local') {
					reply.sendError({statusCode: 400, message: "Google Authorized Users can't have a password."});
				}
				const pwdHash = user.passwordHash ?? '';
				if (await argon2.verify(pwdHash, password)) {
					reply.send({userId: user.id});
				}
			}
			reply.sendError({ statusCode: 401, message: 'Invalid password' });
		}
	);
}