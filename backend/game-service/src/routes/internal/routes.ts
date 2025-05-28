import type { FastifyInstance } from "fastify";
import gamestatsRoute from "./gamestats";

export default async function internalRoutes(app: FastifyInstance) {
  await gamestatsRoute(app);
}
