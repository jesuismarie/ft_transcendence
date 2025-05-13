import type { FastifyInstance } from "fastify";
import createMatchRoute from "./createMatch.ts";

export default async function matchRoutes(app: FastifyInstance) {
  await createMatchRoute(app);
}
