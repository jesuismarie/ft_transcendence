import type { FastifyInstance } from "fastify";
import { TournamentRepo } from "../../repositories/tournament.ts";
import { TournamentPlayerRepo } from "../../repositories/tournamentPlayer.ts";

interface UnregisterRequestBody {
  username: string;
  tournament_id: number;
}

export default async function unregisterFromTournamentRoute(
  app: FastifyInstance
) {
  const tournamentRepo = new TournamentRepo(app);
  const tournamentPlayerRepo = new TournamentPlayerRepo(app);

  app.post("/unregister-from-tournament", async (request, reply) => {
    const { username, tournament_id } = request.body as UnregisterRequestBody;

    if (!username || !tournament_id || tournament_id <= 0) {
      return reply
        .status(400)
        .send({ message: "Invalid username or tournament_id" });
    }

    try {
      // Check if the user is the tournament creator
      const tournament = tournamentRepo.getById(tournament_id);
      if (tournament?.created_by === username) {
        return reply.status(400).send({
          message:
            "Tournament creator cannot unregister from their own tournament",
        });
      }

      // Вся логика (включая проверки) внутри транзакции
      const tx = app.db.transaction((txn) => {
        const isInTournament = tournamentPlayerRepo.isPlayerInTournament(
          username,
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

        tournamentPlayerRepo.unregister(username, tournament_id, txn);
        tournamentRepo.decrementPlayerCount(tournament_id, txn);
      }) as unknown as () => void;

      tx(); // запускаем транзакцию

      return reply
        .status(200)
        .send({ message: "User unregistered from tournament" });
    } catch (err) {
      app.log.error(err);
      return reply.status(500).send({
        message: (err as Error).message || "Unregistration failed",
      });
    }
  });
}
