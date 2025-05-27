import { FastifyInstance, FastifyReply } from "fastify";
import { UserRepo } from "../../repositories/userRepo";
import { listUsersQuery } from "../../schemas/userSchemas";

export default function getUsersRoute(app:FastifyInstance, userRepo:UserRepo) {
	app.get('/users', { schema: { querystring: listUsersQuery } }, async (req) => {
		const { offset = 0, limit = 20, q } = req.query as any;
		return userRepo.findAll({ offset, limit, q });
	});
}