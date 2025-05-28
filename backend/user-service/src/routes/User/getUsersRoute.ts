import { FastifyInstance } from "fastify";
import { UserRepo } from "../../repositories/userRepo";
import { listUsersQuery } from "../../schemas/userSchemas";
import { UserTypes } from "@KarenDanielyan/ft-transcendence-api-types";

export default async function getUsersRoute(app:FastifyInstance, userRepo:UserRepo) {
	app.get<{Reply: UserTypes.UserListView}>(
		'/users',
		{
			schema: {
				querystring: listUsersQuery
			}
		},
		async (req) => {
			const {offset = 0, limit = 20, q} = req.query as UserTypes.PaginationQuery;
			const users = userRepo.findAll({offset, limit, q});
			const views = users.map(user => userRepo.toQuickView(user));
			// TODO: Ask win/loss from game service
			return {total: views.length, users: views};
		}
	);
}