import type { FastifyInstance } from "fastify";
import { MatchRepo } from "../../repositories/match";
import type { Status } from "../../types/index";
import {getMatchHistoryByUserSchema} from "../../schemas/schemas";

interface GetMatchHistoryRequest {
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
  is_won: boolean;
  score: {
    user: number;
    opponent: number;
  };
  date: string;
}

export default async function getMatchHistoryByUserRoute(app: FastifyInstance) {
  const matchRepo = new MatchRepo(app);

  app.get("/get-match-history-by-user",  {
    schema: {
    querystring: getMatchHistoryByUserSchema,
  }
},
async (request, reply) => {
    const {
      user_id,
      limit = 50,
      offset = 0,
    } = request.query as GetMatchHistoryRequest;

    if (!user_id || limit < 0 || offset < 0) {
      return reply.sendError({ statusCode: 400, message: "Invalid input parameters" });
    }

    if (user_id <= 0) {
      return reply.sendError({ statusCode: 400, message: "Invalid user_id" });
    }

    try {
      const totalCount = matchRepo.countUserMatchHistory(user_id);
      const rawMatches = matchRepo.getUserMatchHistory(
        user_id,
        limit,
        offset
      );

      const formattedMatches = rawMatches.map((match) => {
        const isPlayer1 = match.player_1 === user_id;
        const player_score = isPlayer1 ? match.score_1 : match.score_2;
        const opponent_score = isPlayer1 ? match.score_2 : match.score_1;
        const isMatchWon = match.winner === user_id;

        return {
          id: match.id,
          opponent: isPlayer1 ? match.player_2 : match.player_1,
          status: match.status,
          is_won: match.winner === null ? null : isMatchWon,
          score: {
            user: player_score,
            opponent: opponent_score,
          },
          date: match.started_at,
        } as MatchHistory;
      });

      const response: GetMatchHistoryResponse = {
        totalCount,
        matches: formattedMatches,
      };
      return reply.send(response);
    } catch (err) {
      app.log.error(err);
      return reply.sendError({statusCode: 500, message: "Failed to fetch match history"})
    }
  });
}
