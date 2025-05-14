import type { FastifyInstance } from "fastify";
import createTournamentRoute from "./createTournament.ts";
import registerToTournamentRoute from "./registerToTournament.ts";
import unregisterFromTournamentRoute from "./unregisterFromTournament.ts";

export default async function tournamentRoutes(app: FastifyInstance) {
  await createTournamentRoute(app);
  await registerToTournamentRoute(app);
  await unregisterFromTournamentRoute(app);
}
