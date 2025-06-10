import { FastifyInstance, FastifyReply } from "fastify";
import { UserRepo } from "../../repositories/userRepo";
import { UserTypes } from "@KarenDanielyan/ft-transcendence-api-types"

export default async function getUserByUsernameRoute(app: FastifyInstance, userRepo: UserRepo) {
	app.get<{Params: {username: string}; Reply: UserTypes.UserView}>(
		'/users/username/:username',
		async (req, reply: FastifyReply) => {
			const username = req.params.username;
			const user = userRepo.findByUsername(username);
			if (!user) {
				return reply.sendError({ statusCode: 404, message: 'User not found' });
			}
			const view = userRepo.toView(user);
			// Try to get user stats and online status
			try {
				const res = await app.gameService.getGamestats({ Params: { user: view.id.toString() } });
				view.wins = res.wins;
				view.losses = res.losses;
			}
			catch (err) { console.error(err); }
			try {
				view.online = app.isUserOnline(view.id);
			} catch (err) { console.error(err); }
			return view
		}
	);
}