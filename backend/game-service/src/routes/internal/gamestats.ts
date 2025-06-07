import type { FastifyInstance } from "fastify";
import { TournamentPlayerRepo } from "../../repositories/tournamentPlayer";
import {gamestatsSchema, getMatchHistoryByUserSchema} from "../../schemas/schemas";

interface GamestatsRequest {
  Params: { user: number };
}

interface GamestatsResponse {
  user: number;
  wins: number;
  losses: number;
}

export default async function gamestatsRoute(app: FastifyInstance) {
  const tournamentPlayerRepo = new TournamentPlayerRepo(app);

  app.get<GamestatsRequest>(
    "/internal/gamestats/:user",
      {
          schema: {
              params: gamestatsSchema,
          }
      },
    async (request, reply) => {
      const { user } = request.params;

      if (!user || user < 0) {
        return reply.status(400).send({ message: "Invalid user_id" });
      }

      try {
        const stats = tournamentPlayerRepo.getUserStats(user);

        if (!stats) {
          return reply.status(404).send({ message: "User not found" });
        }

        const response: GamestatsResponse = {
          user,
          wins: stats.wins,
          losses: stats.losses,
        };

        return reply.status(200).send(response);
      } catch (err) {
        app.log.error(err);
        return reply.status(500).send({ message: "Failed to fetch stats" });
      }
    }
  );
}
