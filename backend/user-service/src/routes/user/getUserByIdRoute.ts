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
		const view = userRepo.toView(user);
		try {
			console.log('Reached game service to get gamestats for user', view.username);
			const res = await app.gameService.getGamestats({ Params: { user: view.id.toString() } });
			view.wins = res.wins;
			view.losses = res.losses;
		}
		catch (err) {
			console.error('Error fetching gamestats for user:', view.username, err);
			view.wins = 0;
			view.losses = 0;
		}
		try {
			console.log(`Is user ${view.id} online?`, app.isUserOnline(view.id));
			view.online = app.isUserOnline(view.id);
		}
		catch (err) { console.error(err) }
		return view;
	});
}