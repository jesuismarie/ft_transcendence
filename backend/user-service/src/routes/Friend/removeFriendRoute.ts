import { removeFriendSchema } from "../../schemas/friendSchemas";
import { FastifyInstance, FastifyReply } from "fastify";
import errorSchema from "../../schemas/errorSchema";
import { CommonTypes } from "@KarenDanielyan/ft-transcendence-api-types";
import { UserTypes } from "@KarenDanielyan/ft-transcendence-api-types";


export default async function removeFriendRoute(app: FastifyInstance, userRepo: any, friendRepo: any) {
	app.delete<{Body: UserTypes.DeleteFriendRequest}>(
		'/friends',
		{
			schema: {
				body: removeFriendSchema,
				response: {
					'4xx': errorSchema
				}
			}
		},
		async (req, reply) => {
			const userId = Number(req.body.userId);
			const friendId = Number(req.body.friendId);
			
			const userExists = userRepo.findById(userId);
			const friendExists = userRepo.findById(friendId);
			if (!userExists || !friendExists) {
				return reply.sendError({ statusCode: 404, message: 'User or friend not found' });
			}
			friendRepo.delete(userId, friendId);
			reply.code(204).send();
		}
	);
}