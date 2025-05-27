import { FastifyInstance, FastifyReply } from "fastify";
import { UserRepo } from "../../repositories/userRepo";


export default async function deleteUserRoute(app: FastifyInstance, userRepo: UserRepo) {
	app.delete('/users/:id', async (req, reply: FastifyReply) => {
		const id = Number((req.params as any).id);
		const deleted = userRepo.delete(id);
		if (!deleted) return reply.sendError({statusCode: 404, message: 'User not found'});
		reply.code(204).send();
	});
}