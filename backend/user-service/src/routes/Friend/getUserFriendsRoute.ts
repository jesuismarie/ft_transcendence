import { FastifyInstance, FastifyReply } from "fastify";
import { listFriendsQuery, listFriendsResponseSchema } from "../../schemas/friendSchemas";
import { UserRepo } from "../../repositories/userRepo";
import { FriendRepo } from "../../repositories/friendRepo";
import errorSchema from "../../schemas/errorSchema";
import { UserTypes } from "@ft-transcendence/api-types";

export default async function getUserFriendsRoute(app: FastifyInstance, userRepo: UserRepo, friendRepo: FriendRepo) {
	app.get<{Params: {userId: string}}>(
		'/friends/:userId',
		{
			schema: {
				querystring: listFriendsQuery,
				response: {
					'2xx': listFriendsResponseSchema,
					'4xx': errorSchema
				}
			}
		},
		async (req, reply: FastifyReply) => {
			const userId = Number(req.params.userId);
			const { offset = 0, limit = 20, q } = req.query as UserTypes.PaginationQuery;
		
			const userExists = userRepo.findById(userId);
			if (!userExists) {
				return reply.sendError({ statusCode: 404, message: 'User not found' });
			}
			const friends = friendRepo.list(userId, { offset, limit, q });
			reply.send({total: friends.length, friends: friends});
		}
	);
}