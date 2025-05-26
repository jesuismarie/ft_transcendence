import type { FastifyInstance } from "fastify";
import { microserviceRequestHandler } from "../helpers";
import { services } from "../../config";
import { tournamentNextStepSchema } from "./schemas";

export interface TournamentNextStepRequestBody {
  id: number;
}

export default async function tournamentNextStepRoute(app: FastifyInstance) {
  app.post(
    "/game-service/tournament-next-step",
    {
      schema: {
        body: tournamentNextStepSchema,
      },
    },
    async (request, reply) => {
      await microserviceRequestHandler(app, request, reply, {
        method: "POST",
        url: `${services.gameService}/tournament-next-step`,
        data: request.body,
      });
    }
  );
}
