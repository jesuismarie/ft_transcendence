import { FastifyInstance, FastifyReply } from "fastify";
import { listFriendsQuery } from "../../schemas/friendSchemas";

export default async function getUserFriendsRoute(app: FastifyInstance, userRepo: any, friendRepo: any) {
	app.get('/friends', { schema: { querystring: listFriendsQuery } }, async (req, reply: FastifyReply) => {
		const { userId } = req.query as { userId: number };
		
		const userExists = userRepo.findById(userId);
		if (!userExists) {
			return reply.sendError({ statusCode: 404, message: 'User not found' });
		}
		
		const friends = friendRepo.getFriends(userId);
		reply.send(friends);
	});
}