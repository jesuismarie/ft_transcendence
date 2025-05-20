import type { FastifyInstance } from "fastify";
import { MatchRepo } from "../../repositories/match.ts";
import type { Status } from "../../types/index.ts";

interface GetMatchHistoryByTournamentRequestBody {
  tournament_id: number;
  limit?: number;
  offset?: number;
  statuses?: Status[];
}

interface GetMatchHistoryByTournamentResponse {
  total_count: number;
  matches: TournamentMatchHistory[];
}
interface TournamentMatchHistory {
  id: number;
  user1: string;
  user2: string;
  status: Status;
  winner_username: string | null;
  score: {
    score_1: number;
    score_2: number;
  };
  date: string | null;
}

const VALID_STATUSES = ["created", "in_progress", "ended", "error"] as const;
type MatchStatus = (typeof VALID_STATUSES)[number];

export default async function getTournamentMatchHistoryRoute(
  app: FastifyInstance
) {
  const matchRepo = new MatchRepo(app);

  app.post("/get-tournament-match-history", async (request, reply) => {
    const {
      tournament_id,
      limit = 10,
      offset = 0,
      statuses = [],
    } = request.body as GetMatchHistoryByTournamentRequestBody;

    if (!tournament_id || tournament_id <= 0) {
      return reply.status(400).send({ message: "Invalid tournament_id" });
    }

    if (!Array.isArray(statuses)) {
      return reply
        .status(400)
        .send({ message: "statuses must be an array of strings" });
    }

    const invalidStatuses = statuses.filter(
      (status) => !VALID_STATUSES.includes(status as MatchStatus)
    );
    if (invalidStatuses.length > 0) {
      return reply
        .status(400)
        .send({ message: `Invalid statuses: ${invalidStatuses.join(", ")}` });
    }

    try {
      const { matches, totalCount } = matchRepo.getTournamentMatches({
        tournament_id,
        limit,
        offset,
        statuses: statuses.length > 0 ? (statuses as MatchStatus[]) : undefined,
      });

      const response: GetMatchHistoryByTournamentResponse = {
        total_count: totalCount,
        matches: matches.map(
          (match) =>
            ({
              id: match.id,
              user1: match.player_1,
              user2: match.player_2,
              status: match.status as Status,
              winner_username: match.winner_username,
              score: {
                score_1: match.score_1,
                score_2: match.score_2,
              },
              date: match.started_at,
            } as TournamentMatchHistory)
        ),
      };
      return reply.send(response);
    } catch (err) {
      app.log.error(err);
      return reply.status(500).send({ message: "Failed to retrieve matches" });
    }
  });
}
