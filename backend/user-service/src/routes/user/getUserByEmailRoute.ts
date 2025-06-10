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
			const view = userRepo.toView(user);
			try {
				const res = await app.gameService.getGamestats({ Params: { user: view.id.toString() } });
				view.wins = res.wins;
				view.losses = res.losses;
			}
			catch (err) { console.error(err); }
			try {
				view.online = app.isUserOnline(view.id);
			}
			catch (err) { console.error(err); }
			return view;
		}
	);
}