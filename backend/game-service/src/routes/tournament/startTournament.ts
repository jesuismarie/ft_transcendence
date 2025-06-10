import type { FastifyInstance } from "fastify";
import { TournamentRepo } from "../../repositories/tournament";
import { TournamentPlayerRepo } from "../../repositories/tournamentPlayer";
import { MatchRepo } from "../../repositories/match";
import {startTournamentSchema} from "../../schemas/schemas";

interface StartTournamentRequestBody {
  tournament_id: number;
  created_by: number;
}

interface StartTournamentResponse {
  match_id?: number;
  player_1?: number;
  player_2?: number;
  participants?: number[];
  status: string;
}

export default async function startTournamentRoute(app: FastifyInstance) {
  const tournamentRepo = new TournamentRepo(app);
  const tournamentPlayerRepo = new TournamentPlayerRepo(app);
  const matchRepo = new MatchRepo(app);

  app.post("/start-tournament",
      {
        schema: {
          body: startTournamentSchema,
        },
      },
      async (request, reply) => {
    const { tournament_id, created_by } =
      request.body as StartTournamentRequestBody;

    if (!tournament_id || tournament_id <= 0) {
      return reply.sendError({ statusCode: 400, message: "Invalid tournament_id" });
    }

    if (!created_by || created_by < 0) {
      return reply.sendError({ statusCode: 400, message: "Invalid created_by" });
    }

    const tournament = tournamentRepo.getById(tournament_id);
    if (!tournament) {
      return reply.sendError({ statusCode: 404, message: "Tournament not found" });
    }

    if (tournament.created_by !== created_by) {
      return reply.sendError({
        statusCode: 403,
        message: "Only the tournament creator can start the tournament",
      });
    }

    if (tournament.status !== "created") {
      return reply.sendError({ statusCode: 400, message: "Tournament already started" });
    }

    if (tournament.current_players_count !== tournament.max_players_count) {
      return reply.sendError({ statusCode: 400, message: "Tournament is not full yet" });
    }

    const players = tournamentPlayerRepo.getPlayersByTournament(
      tournament_id
    );

    const db = app.db;

    const tx = db.transaction((txn) => {
      // Перемешиваем игроков
      const shuffled = [...players].sort(() => Math.random() - 0.5);

      const totalPlayers = shuffled.length;
      console.log(`Total players: ${totalPlayers}`);
      if (![2, 4, 8, 16].includes(totalPlayers)) {
        throw new Error("Invalid number of players for tournament bracket");
      }

      const matchesToCreate = totalPlayers / 2;
      let firstMatchId: number | undefined; // Инициализация переменной
      console.log(`Matches to create: ${matchesToCreate}`);
      for (let i = 0; i < matchesToCreate; i++) {
        const player1 = shuffled[i * 2];
        const player2 = shuffled[i * 2 + 1];

        const createdMatchId = matchRepo.createTournamentMatch(
          {
            tournament_id,
            group_id: Math.floor(i / 2) + 1, // Каждые 2 матча в одной группе
            game_level: totalPlayers / 2, // Уровень игры соответствует количеству матчей
            player_1: player1,
            player_2: player2,
          },
          txn
        );
        if (!firstMatchId) {
          firstMatchId = createdMatchId; // Сохраняем ID первого созданного матча
        }
        console.log(`Created match: ${createdMatchId} for players ${player1} and ${player2}`);
      }

      // Устанавливаем статус "in_progress" для первого матча
      if (firstMatchId !== undefined) {
        matchRepo.updateMatchStatus(firstMatchId, "in_progress", txn);
        const startedAt = new Date().toISOString();
        matchRepo.updateMatchStartedAt(firstMatchId, startedAt, txn);
      } else {
        throw new Error("Не удалось определить ID первого матча");
      }

      tournamentRepo.updateStatus(tournament_id, "in_progress", txn);

      return firstMatchId;
    }) as unknown as () => number | undefined;

    try {
      const firstMatchId = tx();

      if (firstMatchId === undefined) {
        throw new Error("Не удалось определить ID первого матча");
      }

      const firstMatch = matchRepo.getById(firstMatchId);
      const participants =
        tournamentPlayerRepo.getPlayersByTournament(tournament_id);

      const response: StartTournamentResponse = {
        match_id: firstMatch?.id,
        player_1: firstMatch?.player_1,
        player_2: firstMatch?.player_2,
        participants,
        status: "in_progress",
      };

      return reply.status(200).send(response);
    } catch (err) {
      app.log.error(err);
      return reply.sendError({ statusCode: 500, message: "Failed to start tournament" });
    }
  });
}
