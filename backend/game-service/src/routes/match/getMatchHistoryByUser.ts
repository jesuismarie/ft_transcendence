import type { FastifyInstance } from "fastify";
import { MatchRepo } from "../../repositories/match.ts";

interface GetMatchHistoryRequestBody {
  user_id: number;
  limit?: number;
  offset?: number;
}

export default async function getMatchHistoryByUserRoute(app: FastifyInstance) {
  const matchRepo = new MatchRepo(app);

  app.post("/get-match-history-by-user", async (request, reply) => {
    const {
      user_id,
      limit = 10,
      offset = 0,
    } = request.body as GetMatchHistoryRequestBody;

    if (!user_id || user_id <= 0 || limit < 0 || offset < 0) {
      return reply.status(400).send({ message: "Invalid input parameters" });
    }

    try {
      const totalCount = matchRepo.countUserMatchHistory(user_id);
      const rawMatches = matchRepo.getUserMatchHistory(user_id, limit, offset);

      const matches = rawMatches.map((match) => {
        const isPlayer1 = match.player_1 === user_id;
        const player_score = isPlayer1 ? match.score_1 : match.score_2;
        const opponent_score = isPlayer1 ? match.score_2 : match.score_1;
        return {
          match_id: match.id,
          player: user_id,
          opponent: isPlayer1 ? match.player_2 : match.player_1,
          startedAt: match.started_at,
          isMatchWon: player_score > opponent_score,
          player_score,
          opponent_score,
        };
      });

      return reply.send({ totalCount, matches });
    } catch (err) {
      app.log.error(err);
      return reply
        .status(500)
        .send({ message: "Failed to fetch match history" });
    }
  });
}
