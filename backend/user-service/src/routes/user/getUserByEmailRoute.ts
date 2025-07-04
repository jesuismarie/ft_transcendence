import { FastifyInstance, FastifyReply } from "fastify";
import { UserRepo } from "../../repositories/userRepo";
import {CommonTypes, UserTypes} from "@KarenDanielyan/ft-transcendence-api-types"

export default async function getUserByUsernameRoute(app: FastifyInstance, userRepo: UserRepo) {
	app.get<{
		Params: { email: string };
		Reply: UserTypes.UserView | CommonTypes.ApiError
	}>(
		'/users/email/:email',
		async (req, reply: FastifyReply) => {
			const email = req.params.email;
			const user = userRepo.findByEmail(email);
			if (!user) {
				return reply.sendError({ statusCode: 404, message: 'User not found' });
			}
			return userRepo.toView(user);
		}
	);
}