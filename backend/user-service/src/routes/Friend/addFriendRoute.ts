import { FastifyInstance, FastifyReply } from "fastify";
import { addFriendSchema } from "../../schemas/friendSchemas";
import { errorSchema } from "../../schemas/errorSchema";
import {UserRepo} from "../../repositories/userRepo";
import {FriendRepo} from "../../repositories/friendRepo";
import {CommonTypes, UserTypes} from "@KarenDanielyan/ft-transcendence-api-types";

export default async function addFriendRoute(app: FastifyInstance, userRepo: UserRepo, friendRepo: FriendRepo) {
	app.post<{Body: UserTypes.AddFriendRequest; Response: {status: string} | CommonTypes.ApiError}>(
		'/friends',
		{
			schema: {
				body: addFriendSchema,
				response: {
					'2xx': {status: 'friend_added'},
					'4xx': errorSchema
				}
			}
		},
		async (req, reply: FastifyReply) => {
			const { userId, friendId } = req.body as { userId: number; friendId: number };
			if (userId === friendId) return reply.sendError({ statusCode: 400, message: 'Cannot friend yourself' });
		
			const userExists = userRepo.findById(userId);
			const friendExists = userRepo.findById(friendId);
			if (!userExists || !friendExists) {
				return reply.sendError({ statusCode: 404, message: 'User or friend not found' });
			}
			friendRepo.add(userId, friendId);
			reply.code(201).send({ status: 'friend_added' });
		}
	);
}