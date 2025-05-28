import type { FastifyInstance } from "fastify";
import { MatchRepo } from "../../repositories/match";
import { TournamentRepo } from "../../repositories/tournament";
import { TournamentPlayerRepo } from "../../repositories/tournamentPlayer";

export interface CreateMatchRequestBody {
  player_1: string;
  player_2: string;
  game_level: number;
  tournament_id?: number;
  group_id?: number;
  gameLevel?: number;
}

export default async function createMatchRoute(app: FastifyInstance) {
  const matchRepo = new MatchRepo(app);
  const tournamentRepo = new TournamentRepo(app);
  const tournamentPlayerRepo = new TournamentPlayerRepo(app);

  app.post("/create-match", async (request, reply) => {
    const { player_1, player_2, tournament_id, group_id, game_level } =
      request.body as CreateMatchRequestBody;

    if (!player_1 || !player_2) {
      return reply.status(400).send({ message: "Invalid player usernames" });
    }

    if (tournament_id) {
      try {
        const tx = app.db.transaction((txn) => {
          // Проверки внутри транзакции
          const tournamentExists = tournamentRepo.exists(tournament_id, txn);
          if (!tournamentExists) {
            throw new Error("Tournament does not exist");
          }

          if (group_id === undefined || game_level === undefined) {
            throw new Error(
              "group_id and gameLevel are required for tournament matches"
            );
          }

          const tournamentStatus = tournamentRepo.getStatus(tournament_id, txn);
          if (
            tournamentStatus !== "created" &&
            tournamentStatus !== "in_progress"
          ) {
            throw new Error(
              "Tournament must be in 'created' or 'in_progress' status"
            );
          }

          const player1InTournament = tournamentPlayerRepo.isPlayerInTournament(
            player_1,
            tournament_id,
            txn
          );
          const player2InTournament = tournamentPlayerRepo.isPlayerInTournament(
            player_2,
            tournament_id,
            txn
          );

          if (!player1InTournament || !player2InTournament) {
            throw new Error("Both players must be in the tournament");
          }

          // Создаем матч внутри транзакции
          matchRepo.createTournamentMatch(
            {
              tournament_id,
              group_id,
              game_level,
              player_1,
              player_2,
            },
            txn
          );
        }) as unknown as () => void;

        tx();
        return reply.status(201).send({ message: "Tournament match created" });
      } catch (err) {
        app.log.error(err);
        return reply.status(400).send({ message: "Error creating match" });
      }
    } else {
      try {
        await matchRepo.createFriendlyMatch({ player_1, player_2 });
        return reply.status(201).send({ message: "Friendly match created" });
      } catch (err) {
        app.log.error(err);
        return reply.status(500).send({ message: "Error creating match" });
      }
    }
  });
}
