// Core imports
import { FastifyInstance } from "fastify";

// Routes for the user service
import healthRoute from "./health";
import userRoutes from "./user/routes";
import friendRoutes from "./Friend/routes";
import internalRoutes from "./internal/routes";

// Repositories
import { UserRepo } from "../repositories/userRepo";
import { FriendRepo } from "../repositories/friendRepo";
import monitoringRoutes from "./monitoring/routes";

export default async function routes(app: FastifyInstance) {
  const userRepo = new UserRepo(app);
  const friendRepo = new FriendRepo(app);

  // Health check route
  await healthRoute(app);

  // User routes
  await userRoutes(app, userRepo);
  
  // Internal routes
    await internalRoutes(app, userRepo);

  // Friend routes
  await friendRoutes(app, userRepo, friendRepo);
  await monitoringRoutes(app);
}
