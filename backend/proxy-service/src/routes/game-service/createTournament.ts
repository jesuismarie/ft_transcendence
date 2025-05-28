import type { FastifyInstance } from "fastify";
import { microserviceRequestHandler } from "./helpers";
import { services } from "../../config";
import { createTournamentSchema } from "../../schemas/game-service/schemas";

export interface CreateTournamentRequestBody {
  name: string;
  max_players_count: number;
  created_by: string;
}

export default async function createTournamentRoute(app: FastifyInstance) {
  app.post<{ Body: CreateTournamentRequestBody }>(
    "/game-service/create-tournament",
    {
      schema: {
        body: createTournamentSchema,
      },
    },
    async (request, reply) => {
      await microserviceRequestHandler(app, request, reply, {
        method: "POST",
        url: `${services.gameService}/create-tournament`,
        data: request.body,
      });
    }
  );
}
