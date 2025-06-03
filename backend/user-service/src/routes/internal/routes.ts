import { FastifyInstance } from "fastify";
import createUserRoute from "./createUserRoute";
import deleteUserRoute from "./deleteUserRoute";
import { UserRepo } from "../../repositories/userRepo";

export default async function internalRoutes(app: FastifyInstance, UserRepo: UserRepo) {
	await createUserRoute(app, UserRepo);
	await deleteUserRoute(app, UserRepo);
}