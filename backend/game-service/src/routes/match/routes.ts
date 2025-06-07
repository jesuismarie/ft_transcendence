import type { FastifyInstance } from "fastify";
import getMatchHistoryByUserRoute from "./getMatchHistoryByUser";
import getTournamentMatchHistoryRoute from "./getTournamentMatchHistory";
import saveMatchResultRoute from "./saveMatchResult";

export default async function matchRoutes(app: FastifyInstance) {
  await getMatchHistoryByUserRoute(app);
  await getTournamentMatchHistoryRoute(app);
  await saveMatchResultRoute(app);
}
