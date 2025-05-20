import type { FastifyInstance } from "fastify";
import { MatchRepo } from "../../repositories/match.ts";
import type { Status } from "../../types/index.ts";

interface GetMatchHistoryRequestBody {
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
      username,
      limit = 10,
      offset = 0,
    } = request.body as GetMatchHistoryRequestBody;

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
        };
      });

      return reply.send({ totalCount, matches: formattedMatches });
    } catch (err) {
      app.log.error(err);
      return reply
        .status(500)
        .send({ message: "Failed to fetch match history" });
    }
  });
}
