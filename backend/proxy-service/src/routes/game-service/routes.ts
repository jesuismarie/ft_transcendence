import type { FastifyInstance } from "fastify";
import createTournamentRoute from "./createTournament";
import deleteTournamentRoute from "./deleteTournament";
import getTournamentParticipantsRoute from "./getTournamentParticipants";
import getTournamentsInfoRoute from "./getTournamentsInfo";
import registerToTournamentRoute from "./registerToTournament";

export default async function gameServiceRoutes(app: FastifyInstance) {
  await createTournamentRoute(app);
  await deleteTournamentRoute(app);
  await getTournamentParticipantsRoute(app);
  await getTournamentsInfoRoute(app);
  await registerToTournamentRoute(app);
}
