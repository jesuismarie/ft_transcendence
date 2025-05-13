import type { FastifyInstance } from "fastify";
import createTournamentRoute from "./createTournament.ts";

export default async function tournamentRoutes(app: FastifyInstance) {
  await createTournamentRoute(app);
}
