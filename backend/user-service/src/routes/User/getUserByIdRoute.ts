import { FastifyInstance, FastifyReply } from "fastify";
import { UserRepo } from "../../repositories/userRepo";

export default async function getUserByIdRoute(app: FastifyInstance, userRepo: UserRepo) {
	app.get('/users/:id', async (req, reply: FastifyReply) => {
		const id = Number((req.params as any).id);
		const user = userRepo.findById(id);
		if (!user)
			return reply.sendError({statusCode: 404, message: 'User not found'});
		return user;
	});
}