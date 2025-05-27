import type { FastifyInstance } from "fastify";
import createTournamentRoute from "./createTournament";
import deleteTournamentRoute from "./deleteTournament";
import getTournamentParticipantsRoute from "./getTournamentParticipants";
import getTournamentsInfoRoute from "./getTournamentsInfo";
import registerToTournamentRoute from "./registerToTournament";
import startTournamentRoute from "./startTournament";
import tournamentNextStepRoute from "./tournamentNextStep";
import unregisterFromTournamentRoute from "./unregisterFromTournament";
import getMatchHistoryByUserRoute from "./getMatchHistoryByUser";
import saveMatchResultRoute from "./saveMatchResult";

export default async function gameServiceRoutes(app: FastifyInstance) {
  await createTournamentRoute(app);
  await deleteTournamentRoute(app);
  await getTournamentParticipantsRoute(app);
  await getTournamentsInfoRoute(app);
  await registerToTournamentRoute(app);
  await startTournamentRoute(app);
  await tournamentNextStepRoute(app);
  await unregisterFromTournamentRoute(app);
  await getMatchHistoryByUserRoute(app);
  await saveMatchResultRoute(app);
}
