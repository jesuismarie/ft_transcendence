import type { FastifyInstance } from "fastify";
import { MatchRepo } from "../../repositories/match";
import { TournamentRepo } from "../../repositories/tournament";
import { TournamentPlayerRepo } from "../../repositories/tournamentPlayer";
import {saveMatchResultSchema} from "../../schemas/schemas";

interface SaveMatchResultBody {
  match_id: number;
  winner: number;
  score: {
    winner_score: number;
    looser_score: number;
  };
}

export default async function saveMatchResultRoute(app: FastifyInstance) {
  const matchRepo = new MatchRepo(app);
  const tournamentRepo = new TournamentRepo(app);
  const tournamentPlayerRepo = new TournamentPlayerRepo(app);

  app.post("/save-match-result",
      {
        schema: {
          body: saveMatchResultSchema,
        },
      },
      async (request, reply) => {
    const { match_id, winner, score } = request.body as SaveMatchResultBody;

    if (
      !match_id ||
      !winner ||
      !score ||
      score.winner_score < 0 ||
      score.looser_score < 0
    ) {
      return reply.sendError({ statusCode: 400, message: "Invalid input parameters" });
    }
    if (winner < 0) {
      return reply.sendError({ statusCode: 400, message: "Invalid input parameters: winner" });
    }

    const match = matchRepo.getById(match_id);
    if (!match) {
      return reply.sendError({ statusCode: 404, message: "Match not found" });
    }

    if (match.status !== "in_progress") {
      return reply.sendError({ statusCode: 400, message: "Match is not in progress" });
    }

    if (winner !== match.player_1 && winner !== match.player_2) {
      return reply.sendError({ statusCode: 400, message: "Invalid winner" });
    }

    const loser = winner === match.player_1 ? match.player_2 : match.player_1;

    const db = app.db;

    const tx = db.transaction((txn) => {
      const scoreData = {
        score_1: winner === match.player_1 ? score.winner_score : score.looser_score,
        score_2: winner === match.player_1 ? score.looser_score : score.winner_score,
      }

      // Update match result
      matchRepo.updateMatchResult(match_id, winner, scoreData, txn);

      // Update player stats
      tournamentPlayerRepo.incrementWins(winner, match.tournament_id, txn);
      tournamentPlayerRepo.incrementLosses(loser, match.tournament_id, txn);

      // Check if this was the final match
      if (match.game_level === 1) {
        tournamentRepo.updateWinner(match.tournament_id, winner, txn);
      }
    }) as unknown as () => void;

    try {
      tx();
      return reply
        .status(200)
        .send({ message: "Match result saved successfully" });
    } catch (err) {
      app.log.error(err);
      return reply.sendError({ statusCode: 500, message: "Failed to save match result" });
    }
  });
}
