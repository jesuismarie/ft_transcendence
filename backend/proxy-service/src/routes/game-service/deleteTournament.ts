import type { FastifyInstance } from "fastify";
import axios from "axios";
import { services } from "../../config";
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
      try {
        const response = await axios.delete(
          `${services.gameService}/delete-tournament`,
          {
            data: request.body,
          }
        );

        reply.send(response.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          app.log.error(`Microservice request error: ${error.message}`);

          if (error.response) {
            reply.sendError({
              statusCode: error.response.status,
              message: error.response.data?.message || "Microservice error",
            });
          }
        } else {
          app.log.error(
            `Requst error: ${services.gameService}/delete-tournament: internal server error`
          );
          reply.sendError({
            statusCode: 500,
            message: "Internal Server Error",
          });
        }
      }
    }
  );
}
