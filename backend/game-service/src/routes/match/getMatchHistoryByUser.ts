import type { FastifyInstance } from "fastify";
import { MatchRepo } from "../../repositories/match.ts";
import type { Status } from "../../types/index.ts";

interface GetMatchHistoryRequestBody {
  user_id: number;
  limit?: number;
  offset?: number;
}

interface GetMatchHistoryResponse {
  totalCount: number;
  matches: MatchHistory[];
}

interface MatchHistory {
  id: number;
  opponent: number;
  status: Status;
  is_won: boolean | null;
  score: {
    user: number;
    opponent: number;
  };
  date: string | null;
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
      const totalCount = await matchRepo.countUserMatchHistory(user_id);
      const rawMatches = await matchRepo.getUserMatchHistory(
        user_id,
        limit,
        offset
      );

      const formattedMatches: MatchHistory[] = rawMatches.map((match) => {
        const isPlayer1 = match.user1_id === user_id;
        const player_score = isPlayer1 ? match.score_1 : match.score_2;
        const opponent_score = isPlayer1 ? match.score_2 : match.score_1;
        const isMatchWon = match.winner_id === user_id;

        return {
          id: match.id,
          opponent: isPlayer1 ? match.user2_id : match.user1_id,
          status: match.status as Status,
          is_won: match.winner_id === null ? null : isMatchWon,
          score: {
            user: player_score,
            opponent: opponent_score,
          },
          date: match.started_at,
        };
      });

      const response: GetMatchHistoryResponse = {
        totalCount,
        matches: formattedMatches,
      };

      return reply.send(response);
    } catch (err) {
      app.log.error(err);
      return reply
        .status(500)
        .send({ message: "Failed to fetch match history" });
    }
  });
}
