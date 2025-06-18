import { FastifyInstance, FastifyReply } from "fastify";
import { UserRepo } from "../../repositories/userRepo";
import { UserTypes } from "@KarenDanielyan/ft-transcendence-api-types";

export default async function getUserByIdRoute(app: FastifyInstance, userRepo: UserRepo) {
	app.get<{Reply: UserTypes.UserView}>(
		'/users/:id',
		async (req, reply: FastifyReply) => {
		const id = Number((req.params as any).id);
		const user = userRepo.findById(id);
		if (!user)
			return reply.sendError({statusCode: 404, message: 'User not found'});
		return userRepo.toView(user);
	});
}