import { FastifyInstance, FastifyReply } from "fastify";
import { UserRepo } from "../../repositories/userRepo";
import {createUserResponseSchema, createUserSchema} from "../../schemas/userSchemas";
import { errorSchema } from "../../schemas/errorSchema";
import { UserTypes } from "@KarenDanielyan/ft-transcendence-api-types";
import { CommonTypes } from "@KarenDanielyan/ft-transcendence-api-types";
import argon2 from "argon2";

export default async function createUserRoute(app: FastifyInstance, userRepo: UserRepo) {
	// @ts-ignore
	app.post<{ Body: UserTypes.CreateUserRequest; Reply: UserTypes.CreateUserResponse | CommonTypes.ApiError }>(
		'/internal/users',
		{
			schema: {
				body: createUserSchema,
				response:
					{
						201: createUserResponseSchema,
						409: errorSchema,
						500: errorSchema
					}
			}
		},
		async (req, reply: FastifyReply) => {
			const {email, password, username, authProvider, providerSub} = req.body;
			if (userRepo.findByEmail(email))
				return reply.sendError({statusCode: 409, code: "EMAIL_EXISTS", message: "Email already exists"});
			if (userRepo.findByUsername(username))
				return reply.sendError({statusCode: 409, code: "USERNAME_EXISTS", message: "Username already exists"});
			const hash = await argon2.hash(password);
			const user = userRepo.create(email, username, hash, authProvider, providerSub);
			if (!user) {
				return reply.sendError({statusCode: 500, message: 'Failed to create user'});
			}
			const replyUser: UserTypes.CreateUserResponse = {
				id: user.id,
				email: user.email,
				username: user.username
			}
			reply.code(201).send(replyUser);
		}
	);
}