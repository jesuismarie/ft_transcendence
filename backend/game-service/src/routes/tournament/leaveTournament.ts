import type { FastifyInstance } from "fastify";
import { TournamentRepo } from "../../repositories/tournament";
import { TournamentPlayerRepo } from "../../repositories/tournamentPlayer";
import { MatchRepo } from "../../repositories/match";

interface LeaveTournamentRequestBody {
  user_id: number;
  tournament_id: number;
}

export default async function leaveTournamentRoute(app: FastifyInstance) {
  const tournamentRepo = new TournamentRepo(app);
  const tournamentPlayerRepo = new TournamentPlayerRepo(app);
  const matchRepo = new MatchRepo(app);

  app.post("/leave-tournament", async (request, reply) => {
    const { user_id, tournament_id } =
      request.body as LeaveTournamentRequestBody;

    if (!user_id || !tournament_id || tournament_id <= 0) {
      return reply
        .status(400)
        .send({ message: "Invalid user_id or tournament_id" });
    }

    try {
      const tournament = tournamentRepo.getById(tournament_id);
      if (!tournament) {
        return reply.status(404).send({ message: "Tournament not found" });
      }

      // Check if the user is the tournament creator
      if (tournament.created_by === user_id) {
        return reply.status(400).send({
          message: "Tournament creator cannot leave their own tournament",
        });
      }

      const tx = app.db.transaction((txn) => {
        const status = tournamentRepo.getStatus(tournament_id, txn);
        if (status !== "in_progress") {
          throw new Error("Tournament must be in progress to leave");
        }

        const isInTournament = tournamentPlayerRepo.isPlayerInTournament(
          user_id,
          tournament_id,
          txn
        );
        if (!isInTournament) {
          throw new Error("User is not part of the tournament");
        }

        // Удаляем игрока
        tournamentPlayerRepo.unregister(user_id, tournament_id, txn);

        // Получаем незавершённые матчи
        const matches = matchRepo.getIncompleteTournamentMatchesWithPlayer(
          user_id,
          tournament_id,
          txn
        );

        for (const match of matches) {
          const opponentId =
          match.player_1 === user_id ? match.player_2 : match.player_1;
          matchRepo.setMatchWinner(match.id, opponentId, txn);
          tournamentPlayerRepo.incrementWins(opponentId, tournament_id, txn);
        }
      }) as unknown as () => void;

      tx();

      return reply
        .status(200)
        .send({ message: "User left the tournament and matches updated" });
    } catch (err) {
      app.log.error(err);
      return reply.status(400).send({
        message: (err as Error).message || "Failed to leave tournament",
      });
    }
  });
}
