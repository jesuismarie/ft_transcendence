import type { FastifyInstance } from "fastify";
import { MatchRepo } from "../../repositories/match.ts";

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
    } = request.body as {
      tournament_id?: number;
      limit?: number;
      offset?: number;
      statuses?: string[];
    };

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

      return reply.send({ totalCount, matches });
    } catch (err) {
      app.log.error(err);
      return reply.status(500).send({ message: "Failed to retrieve matches" });
    }
  });
}
