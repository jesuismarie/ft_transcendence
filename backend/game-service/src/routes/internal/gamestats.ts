import type { FastifyInstance } from "fastify";
import { TournamentPlayerRepo } from "../../repositories/tournamentPlayer";

interface GamestatsRequest {
  Params: { username: string };
}

interface GamestatsResponse {
  username: string;
  wins: number;
  losses: number;
}

export default async function gamestatsRoute(app: FastifyInstance) {
  const tournamentPlayerRepo = new TournamentPlayerRepo(app);

  app.get<GamestatsRequest>(
    "/internal/gamestats/:username",
    async (request, reply) => {
      const { username } = request.params;

      if (!username || username.trim().length === 0) {
        return reply.status(400).send({ message: "Invalid username" });
      }

      try {
        const stats = tournamentPlayerRepo.getUserStats(username);

        if (!stats) {
          return reply.status(404).send({ message: "User not found" });
        }

        const response: GamestatsResponse = {
          username,
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
