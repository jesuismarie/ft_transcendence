import type { FastifyInstance } from "fastify";
import { microserviceRequestHandler } from "../helpers";
import { services } from "../../config";
import { registerToTournamentSchema } from "./schemas";

export interface RegisterRequestBody {
  username: string;
  tournament_id: number;
}

export default async function registerToTournamentRoute(app: FastifyInstance) {
  app.post<{ Body: RegisterRequestBody }>(
    "/game-service/register-to-tournament",
    {
      schema: {
        body: registerToTournamentSchema,
      },
    },
    async (request, reply) => {
      await microserviceRequestHandler(app, request, reply, {
        method: "POST",
        url: `${services.gameService}/register-to-tournament`,
        data: request.body,
      });
    }
  );
}
