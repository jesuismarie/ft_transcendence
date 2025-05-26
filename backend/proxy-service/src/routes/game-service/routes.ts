import type { FastifyInstance } from "fastify";
import createTournamentRoute from "./createTournament";

export default async function gameServiceRoutes(app: FastifyInstance) {
  //   await handler(app);
  await createTournamentRoute(app);
}
