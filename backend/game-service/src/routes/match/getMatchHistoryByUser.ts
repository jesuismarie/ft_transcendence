import type { FastifyInstance } from "fastify";
import { MatchRepo } from "../../repositories/match";
import type { Status } from "../../types/index";

interface GetMatchHistoryRequest {
  username: string;
  limit?: number;
  offset?: number;
}

interface GetMatchHistoryResponse {
  totalCount: number;
  matches: MatchHistory[];
}

interface MatchHistory {
  id: number;
  opponent: string;
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

  app.get("/get-match-history-by-user", async (request, reply) => {
    const {
      username,
      limit = 50,
      offset = 0,
    } = request.query as GetMatchHistoryRequest;

    if (!username || limit < 0 || offset < 0) {
      return reply.status(400).send({ message: "Invalid input parameters" });
    }

    try {
      const totalCount = await matchRepo.countUserMatchHistory(username);
      const rawMatches = await matchRepo.getUserMatchHistory(
        username,
        limit,
        offset
      );

      const formattedMatches = rawMatches.map((match) => {
        const isPlayer1 = match.player_1 === username;
        const player_score = isPlayer1 ? match.score_1 : match.score_2;
        const opponent_score = isPlayer1 ? match.score_2 : match.score_1;
        const isMatchWon = match.winner_username === username;

        return {
          id: match.id,
          opponent: isPlayer1 ? match.player_2 : match.player_1,
          status: match.status,
          is_won: match.winner_username === null ? null : isMatchWon,
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
      return reply
        .status(500)
        .send({ message: "Failed to fetch match history" });
    }
  });
}
