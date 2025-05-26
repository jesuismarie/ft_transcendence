import type { FastifyInstance } from "fastify";
import createTournamentRoute from "./createTournament";
import deleteTournamentRoute from "./deleteTournament";
import getTournamentParticipantsRoute from "./getTournamentParticipants";

export default async function gameServiceRoutes(app: FastifyInstance) {
  await createTournamentRoute(app);
  await deleteTournamentRoute(app);
  await getTournamentParticipantsRoute(app);
}
