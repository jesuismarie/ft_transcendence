import type { FastifyInstance } from "fastify";
import createTournamentRoute from "./createTournament.ts";
import registerToTournamentRoute from "./registerToTournament.ts";
import unregisterFromTournamentRoute from "./unregisterFromTournament.ts";
import startTournamentRoute from "./startTournament.ts";
import leaveTournamentRoute from "./leaveTournament.ts";
import deleteTournamentRoute from "./deleteTournament.ts";
import getTournamentsInfoRoute from "./getTournamentsInfo.ts";

export default async function tournamentRoutes(app: FastifyInstance) {
  await createTournamentRoute(app);
  await registerToTournamentRoute(app);
  await unregisterFromTournamentRoute(app);
  await startTournamentRoute(app);
  await leaveTournamentRoute(app);
  await deleteTournamentRoute(app);
  await getTournamentsInfoRoute(app);
}
