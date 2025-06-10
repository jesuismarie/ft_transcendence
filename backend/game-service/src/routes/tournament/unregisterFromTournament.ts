import type { FastifyInstance } from "fastify";
import { TournamentRepo } from "../../repositories/tournament";
import { TournamentPlayerRepo } from "../../repositories/tournamentPlayer";
import {unregisterFromTournamentSchema} from "../../schemas/schemas";

interface UnregisterRequestBody {
  user_id: number;
  tournament_id: number;
}

export default async function unregisterFromTournamentRoute(
  app: FastifyInstance
) {
  const tournamentRepo = new TournamentRepo(app);
  const tournamentPlayerRepo = new TournamentPlayerRepo(app);

  app.post("/unregister-from-tournament",
      {
        schema: {
          body: unregisterFromTournamentSchema,
        },
      },
      async (request, reply) => {
    const { user_id, tournament_id } = request.body as UnregisterRequestBody;

    if (!user_id || !tournament_id || tournament_id <= 0) {
      return reply.sendError({ statusCode: 400, message: "Invalid user_id or tournament_id" });
    }

    if (user_id < 0) {
      return reply.sendError({ statusCode: 400, message: "user_id must be greater than zero" })
    }

    try {
      const tournament = tournamentRepo.getById(tournament_id);
      if (tournament?.created_by === user_id) {
        return reply.sendError({
          statusCode: 400,
          message:
            "Tournament creator cannot unregister from their own tournament",
        });
      }

      const tx = app.db.transaction((txn) => {
        const isInTournament = tournamentPlayerRepo.isPlayerInTournament(
          user_id,
          tournament_id,
          txn
        );
        if (!isInTournament) {
          throw new Error("User is not registered in the tournament");
        }

        const status = tournamentRepo.getStatus(tournament_id, txn);
        if (status !== "created") {
          throw new Error(
            "Cannot unregister from a tournament that has already started"
          );
        }

        tournamentPlayerRepo.unregister(user_id, tournament_id, txn);
        tournamentRepo.decrementPlayerCount(tournament_id, txn);
      }) as unknown as () => void;

      tx(); // запускаем транзакцию

      return reply
        .status(200)
        .send({ message: "User unregistered from tournament" });
    } catch (err) {
      app.log.error(err);
      return reply.sendError({
        statusCode: 500,
        message: (err as Error).message || "Unregistration failed",
      });
    }
  });
}
