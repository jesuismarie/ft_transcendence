import type { FastifyInstance } from "fastify";
import createTournamentRoute from "./createTournament";
import deleteTournamentRoute from "./deleteTournament";

export default async function gameServiceRoutes(app: FastifyInstance) {
  //   await handler(app);
  await createTournamentRoute(app);
  await deleteTournamentRoute(app);
}
