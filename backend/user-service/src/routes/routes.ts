// Core imports
import { FastifyInstance } from "fastify";

// Routes for the user service
import healthRoute from "./health";
import userRoutes from "./User/routes";
import friendRoutes from "./Friend/routes";

// Repositories
import { UserRepo } from "../repositories/userRepo";
import { FriendRepo} from "../repositories/friendRepo";

export default async function routes(app: FastifyInstance) {
	const userRepo = new UserRepo(app);
	const friendRepo = new FriendRepo(app);
	
	// Health check route
	await healthRoute(app);

	// User routes
	await userRoutes(app, userRepo);

	// Friend routes
	await friendRoutes(app, userRepo, friendRepo);
}