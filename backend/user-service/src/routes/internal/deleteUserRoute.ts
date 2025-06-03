import { FastifyInstance, FastifyReply } from "fastify";
import { UserRepo } from "../../repositories/userRepo";


export default async function deleteUserRoute(app: FastifyInstance, userRepo: UserRepo) {
	app.delete<{Params: {id: string}}>(
		'/internal/users/:id',
		async (req, reply: FastifyReply) => {
			const id = Number(req.params.id);
			const deleted = userRepo.delete(id);
			if (!deleted)
				return reply.sendError({statusCode: 404, message: 'User not found'});
			reply.code(204).send();
		}
	);
}