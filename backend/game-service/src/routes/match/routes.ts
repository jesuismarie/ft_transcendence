import type { FastifyInstance } from "fastify";
import createMatchRoute from "./createMatch.ts";
import getMatchHistoryByUserRoute from "./getMatchHistoryByUser.ts";

export default async function matchRoutes(app: FastifyInstance) {
  await createMatchRoute(app);
  await getMatchHistoryByUserRoute(app);
}
