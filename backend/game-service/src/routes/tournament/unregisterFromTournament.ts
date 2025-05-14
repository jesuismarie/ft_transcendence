import type { FastifyInstance } from "fastify";
import { TournamentRepo } from "../../repositories/tournament.ts";
import { TournamentPlayerRepo } from "../../repositories/tournamentPlayer.ts";

interface UnregisterRequestBody {
  user_id: number;
  tournament_id: number;
}

export default async function unregisterFromTournamentRoute(
  app: FastifyInstance
) {
  const tournamentRepo = new TournamentRepo(app);
  const tournamentPlayerRepo = new TournamentPlayerRepo(app);

  app.post("/unregister-from-tournament", async (request, reply) => {
    const { user_id, tournament_id } = request.body as UnregisterRequestBody;

    if (!user_id || !tournament_id || user_id <= 0 || tournament_id <= 0) {
      return reply
        .status(400)
        .send({ message: "Invalid user_id or tournament_id" });
    }

    const isInTournament = await tournamentPlayerRepo.isPlayerInTournament(
      user_id,
      tournament_id
    );
    if (!isInTournament) {
      return reply
        .status(400)
        .send({ message: "User is not registered in the tournament" });
    }

    // Выполняем удаление и декремент в одной транзакции
    const db = app.db;
    const tx = db.transaction(() => {
      tournamentPlayerRepo.unregister(user_id, tournament_id);
      tournamentRepo.decrementPlayerCount(tournament_id);
    });

    try {
      tx(); // Запускаем транзакцию
      return reply
        .status(200)
        .send({ message: "User unregistered from tournament" });
    } catch (err) {
      app.log.error(err);
      return reply.status(500).send({ message: "Unregistration failed" });
    }
  });
}
