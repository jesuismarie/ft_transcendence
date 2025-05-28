import type { FastifyInstance } from "fastify";
import { microserviceRequestHandler } from "./helpers";
import { services } from "../../config";
import { unregisterFromTournamentSchema } from "../../schemas/game-service/schemas";

interface UnregisterRequestBody {
  username: string;
  tournament_id: number;
}

export default async function unregisterFromTournamentRoute(
  app: FastifyInstance
) {
  app.post<{ Body: UnregisterRequestBody }>(
    "/game-service/unregister-from-tournament",
    {
      schema: {
        body: unregisterFromTournamentSchema,
      },
    },
    async (request, reply) => {
      await microserviceRequestHandler(app, request, reply, {
        method: "POST",
        url: `${services.gameService}/unregister-from-tournament`,
        data: request.body,
      });
    }
  );
}
