import type { FastifyInstance } from "fastify";
import createTournamentRoute from "./createTournament";
import registerToTournamentRoute from "./registerToTournament";
import unregisterFromTournamentRoute from "./unregisterFromTournament";
import startTournamentRoute from "./startTournament";
import leaveTournamentRoute from "./leaveTournament";
import deleteTournamentRoute from "./deleteTournament";
import getTournamentsInfoRoute from "./getTournamentsInfo";
import tournamentNextStepRoute from "./tournamentNextStep";
import getTournamentParticipantsRoute from "./getTournamentParticipants";

export default async function tournamentRoutes(app: FastifyInstance) {
  await createTournamentRoute(app);
  await registerToTournamentRoute(app);
  await unregisterFromTournamentRoute(app);
  await startTournamentRoute(app);
  await leaveTournamentRoute(app);
  await deleteTournamentRoute(app);
  await getTournamentsInfoRoute(app);
  await tournamentNextStepRoute(app);
  await getTournamentParticipantsRoute(app);
}
