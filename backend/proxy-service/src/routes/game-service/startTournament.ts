import type { FastifyInstance } from "fastify";
import { microserviceRequestHandler } from "../helpers";
import { services } from "../../config";
import { startTournamentSchema } from "../../schemas/game-service/schemas"; // Импорт схемы

interface StartTournamentRequestBody {
  tournament_id: number;
  created_by: string;
}

export default async function startTournamentRoute(app: FastifyInstance) {
  app.post<{ Body: StartTournamentRequestBody }>(
    "/game-service/start-tournament",
    {
      schema: {
        body: startTournamentSchema,
      },
    },
    async (request, reply) => {
      await microserviceRequestHandler(app, request, reply, {
        method: "POST",
        url: `${services.gameService}/start-tournament`,
        data: request.body,
      });
    }
  );
}
