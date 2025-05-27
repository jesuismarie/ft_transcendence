import { FastifyInstance, FastifyReply } from "fastify";
import { UserRepo } from "../../repositories/userRepo";
import { UserTypes } from "@ft-transcendence/api-types"

export default function getUserByUsernameRoute(app: FastifyInstance, userRepo: UserRepo) {
	app.get('/users/username/:username', async (req, reply: FastifyReply) => {
		const { username } = req.params as any;
		const user = userRepo.findByUsername(username);
		if (!user) {
			return reply.sendError({ statusCode: 404, message: 'User not found' });
		}
		return user as UserTypes.User;
	});
}