import type { FastifyInstance } from "fastify";
import createMatchRoute from "./createMatch";
import getMatchHistoryByUserRoute from "./getMatchHistoryByUser";
import getTournamentMatchHistoryRoute from "./getTournamentMatchHistory";
import saveMatchResultRoute from "./saveMatchResult";

export default async function matchRoutes(app: FastifyInstance) {
  await createMatchRoute(app);
  await getMatchHistoryByUserRoute(app);
  await getTournamentMatchHistoryRoute(app);
  await saveMatchResultRoute(app);
}
