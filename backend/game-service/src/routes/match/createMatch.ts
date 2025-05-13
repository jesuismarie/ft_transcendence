import type { FastifyInstance } from "fastify";
import { MatchRepo } from "../../repositories/match.ts";
import { TournamentRepo } from "../../repositories/tournament.ts";
import { TournamentPlayerRepo } from "../../repositories/tournamentPlayer.ts";

export interface CreateMatchRequestBody {
  player_1: number;
  player_2: number;
  tournament_id?: number;
  group_id?: number;
  gameLevel?: number;
}

export default async function createMatchRoute(app: FastifyInstance) {
  const matchRepo = new MatchRepo(app);
  const tournamentRepo = new TournamentRepo(app);
  const tournamentPlayerRepo = new TournamentPlayerRepo(app);

  app.post("/create-match", async (request, reply) => {
    const { player_1, player_2, tournament_id, group_id, gameLevel } =
      request.body as {
        player_1: number;
        player_2: number;
        tournament_id?: number;
        group_id?: number;
        gameLevel?: number;
      };

    if (!player_1 || !player_2 || player_1 <= 0 || player_2 <= 0) {
      return reply.status(400).send({ message: "Invalid player IDs" });
    }

    // Турнирный матч
    if (tournament_id) {
      const tournamentExists = tournamentRepo.exists(tournament_id);
      if (!(await tournamentExists)) {
        return reply.status(400).send({ message: "Tournament does not exist" });
      }

      if (group_id === undefined || gameLevel === undefined) {
        return reply.status(400).send({
          message: "group_id and gameLevel are required for tournament matches",
        });
      }

      const tournamentStatus = await tournamentRepo.getStatus(tournament_id);
      if (
        tournamentStatus !== "created" &&
        tournamentStatus !== "in_progress"
      ) {
        return reply.status(400).send({
          message: "Tournament must be in 'created' or 'in_progress' status",
        });
      }

      const player1InTournament =
        await tournamentPlayerRepo.isPlayerInTournament(
          player_1,
          tournament_id
        );
      const player2InTournament =
        await tournamentPlayerRepo.isPlayerInTournament(
          player_2,
          tournament_id
        );

      if (!player1InTournament || !player2InTournament) {
        return reply
          .status(400)
          .send({ message: "Both players must be in the tournament" });
      }

      try {
        await matchRepo.createTournamentMatch({
          player_1,
          player_2,
          tournament_id,
          group_id,
          gameLevel,
        });
        return reply.status(201).send({ message: "Tournament match created" });
      } catch (err) {
        app.log.error(err);
        return reply
          .status(500)
          .send({ message: "Error creating tournament match" });
      }
    } else {
      // Обычный матч
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
