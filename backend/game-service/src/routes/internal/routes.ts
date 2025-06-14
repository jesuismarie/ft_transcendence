import type { FastifyInstance } from "fastify";
import gamestatsRoute from "./gamestats";
import saveMatchResultRoute from "./saveMatchResult";

export default async function internalRoutes(app: FastifyInstance) {
  await gamestatsRoute(app);
  await saveMatchResultRoute(app);
}
