import type { FastifyInstance } from "fastify";
import { TournamentRepo } from "../../repositories/tournament.ts";
import { TournamentPlayerRepo } from "../../repositories/tournamentPlayer.ts";
import { MatchRepo } from "../../repositories/match.ts";

interface StartTournamentRequestBody {
  tournament_id: number;
}

export default async function startTournamentRoute(app: FastifyInstance) {
  const tournamentRepo = new TournamentRepo(app);
  const tournamentPlayerRepo = new TournamentPlayerRepo(app);
  const matchRepo = new MatchRepo(app);

  app.post("/start-tournament", async (request, reply) => {
    const { tournament_id } = request.body as { tournament_id: number };

    if (!tournament_id || tournament_id <= 0) {
      return reply.status(400).send({ message: "Invalid tournament_id" });
    }

    const tournament = await tournamentRepo.getById(tournament_id);
    if (!tournament) {
      return reply.status(404).send({ message: "Tournament not found" });
    }

    if (tournament.status !== "created") {
      return reply.status(400).send({ message: "Tournament already started" });
    }

    if (tournament.current_players_count !== tournament.max_players_count) {
      return reply.status(400).send({ message: "Tournament is not full yet" });
    }

    const players = await tournamentPlayerRepo.getPlayersByTournament(
      tournament_id
    );

    const db = app.db;

    const tx = db.transaction((txn) => {
      // Перемешиваем игроков
      const shuffled = [...players].sort(() => Math.random() - 0.5);

      const totalPlayers = shuffled.length;

      if (![2, 4, 8, 16].includes(totalPlayers)) {
        throw new Error("Invalid number of players for tournament bracket");
      }

      const matchesToCreate = totalPlayers / 2;

      for (let i = 0; i < matchesToCreate; i++) {
        const player1 = shuffled[i * 2];
        const player2 = shuffled[i * 2 + 1];

        // Передаём txn в метод, чтобы он использовал транзакцию
        matchRepo.createTournamentMatch(
          {
            tournament_id,
            group_id: i + 1, // каждый матч — отдельная группа
            game_level: totalPlayers / 2,
            player_1: player1,
            player_2: player2,
          },
          txn
        );
      }

      tournamentRepo.updateStatus(tournament_id, "in_progress", txn);
    }) as unknown as () => void;

    try {
      tx(); // вызываем без аргументов!
      return reply.status(200).send({ message: "Tournament started" });
    } catch (err) {
      app.log.error(err);
      return reply.status(500).send({ message: "Failed to start tournament" });
    }
  });
}
