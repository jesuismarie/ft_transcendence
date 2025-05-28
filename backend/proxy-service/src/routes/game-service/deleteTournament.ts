import type { FastifyInstance } from "fastify";
import { services } from "../../config";
import { microserviceRequestHandler } from "../helpers";
import { deleteTournamentSchema } from "./schemas";

interface DeleteTournamentRequestBody {
  tournament_id: number;
  created_by: string;
}

export default async function deleteTournamentRoute(app: FastifyInstance) {
  app.delete<{ Body: DeleteTournamentRequestBody }>(
    "/game-service/delete-tournament",
    {
      schema: {
        body: deleteTournamentSchema,
      },
    },
    async (request, reply) => {
      await microserviceRequestHandler(app, request, reply, {
        method: "DELETE",
        url: `${services.gameService}/delete-tournament`,
        data: request.body,
      });
    }
  );
}
