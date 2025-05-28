import { FastifyInstance, FastifyReply } from "fastify";
import { UserRepo } from "../../repositories/userRepo";
import { updateUserSchema } from "../../schemas/userSchemas";
import { errorSchema } from "../../schemas/errorSchema";
import { UserTypes } from "@KarenDanielyan/ft-transcendence-api-types";


export default async function updateUserRoute(app: FastifyInstance, userRepo: UserRepo) {
	app.put<{Body: UserTypes.UpdateUserRequest; Params: {id: string}; Reply: UserTypes.UserUpdateResponse}>(
		'/users/:id',
		{
			schema: {
				body: updateUserSchema,
				response: {
					200: {
						type: 'object',
						additionalProperties: false,
						properties: {
							modified: { type: 'boolean' }
						}
					},
					'4xx': errorSchema
				}
			}
		},
		async (req, reply: FastifyReply) => {
			const id = Number(req.params.id);
			const { username, email } = req.body;
			
			// fetch current row or 404
			const user = userRepo.findById(id);
			if (!user)
				return reply.sendError({ statusCode: 404, code: 'USER_NOT_FOUND', message: 'User not found' });
			
			// duplicate-email guard
			if (email && userRepo.findByEmail(email))
				return reply.sendError({ statusCode: 409, code: 'EMAIL_EXISTS', message: 'Email already registered' });
			
			const updated = userRepo.update(id, {
				username: username,
				email: email});
			return reply.send({"modified": updated});
		}
	);
}