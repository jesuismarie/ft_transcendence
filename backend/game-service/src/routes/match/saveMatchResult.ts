import type { FastifyInstance } from "fastify";
import { MatchRepo } from "../../repositories/match";
import { TournamentRepo } from "../../repositories/tournament";
import { TournamentPlayerRepo } from "../../repositories/tournamentPlayer";

interface SaveMatchResultBody {
  match_id: number;
  winner: string;
  score: {
    score_1: number;
    score_2: number;
  };
}

export default async function saveMatchResultRoute(app: FastifyInstance) {
  const matchRepo = new MatchRepo(app);
  const tournamentRepo = new TournamentRepo(app);
  const tournamentPlayerRepo = new TournamentPlayerRepo(app);

  app.post("/save-match-result", async (request, reply) => {
    const { match_id, winner, score } = request.body as SaveMatchResultBody;

    if (
      !match_id ||
      !winner ||
      !score ||
      score.score_1 < 0 ||
      score.score_2 < 0
    ) {
      return reply.status(400).send({ message: "Invalid input parameters" });
    }

    const match = matchRepo.getById(match_id);
    if (!match) {
      return reply.status(404).send({ message: "Match not found" });
    }

    if (match.status !== "in_progress") {
      return reply.status(400).send({ message: "Match is not in progress" });
    }

    if (winner !== match.player_1 && winner !== match.player_2) {
      return reply.status(400).send({ message: "Invalid winner" });
    }

    const loser = winner === match.player_1 ? match.player_2 : match.player_1;

    const db = app.db;

    const tx = db.transaction((txn) => {
      // Update match result
      matchRepo.updateMatchResult(match_id, winner, score, txn);

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
      return reply.status(500).send({ message: "Failed to save match result" });
    }
  });
}
