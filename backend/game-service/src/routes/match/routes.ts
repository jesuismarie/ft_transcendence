import type { FastifyInstance } from "fastify";
import getMatchHistoryByUserRoute from "./getMatchHistoryByUser";
import getTournamentMatchHistoryRoute from "./getTournamentMatchHistory";

export default async function matchRoutes(app: FastifyInstance) {
  await getMatchHistoryByUserRoute(app);
  await getTournamentMatchHistoryRoute(app);
}
