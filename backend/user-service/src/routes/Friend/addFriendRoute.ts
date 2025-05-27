import { FastifyInstance, FastifyReply } from "fastify";
import { addFriendSchema } from "../../schemas/friendSchemas";

export default async function addFriendRoute(app: FastifyInstance, userRepo: any, friendRepo: any) {
	app.post('/friends', { schema: { body: addFriendSchema } }, async (req, reply: FastifyReply) => {
		const { userId, friendId } = req.body as { userId: number; friendId: number };
		if (userId === friendId) return reply.sendError({ statusCode: 400, message: 'Cannot friend yourself' });
		
		const userExists = userRepo.findById(userId);
		const friendExists = userRepo.findById(friendId);
		if (!userExists || !friendExists) {
			return reply.sendError({ statusCode: 404, message: 'User or friend not found' });
		}
		friendRepo.add(userId, friendId);
		reply.code(201).send({ status: 'friend_added' });
	});
}