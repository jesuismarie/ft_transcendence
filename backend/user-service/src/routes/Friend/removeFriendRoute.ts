import { removeFriendSchema } from "../../schemas/friendSchemas";
import { FastifyInstance, FastifyReply } from "fastify";


export default async function removeFriendRoute(app: FastifyInstance, userRepo: any, friendRepo: any) {
	app.delete('/friends', { schema: {body: removeFriendSchema} }, async (req, reply: FastifyReply) => {
		const { userId, friendId } = req.body as { userId: number; friendId: number };
		
		const userExists = userRepo.findById(userId);
		const friendExists = userRepo.findById(friendId);
		if (!userExists || !friendExists) {
			return reply.sendError({ statusCode: 404, message: 'User or friend not found' });
		}
		friendRepo.delete(userId, friendId);
		reply.code(204).send();
	});
}