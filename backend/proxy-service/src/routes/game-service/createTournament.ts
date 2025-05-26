import type { FastifyInstance } from "fastify";
import axios from "axios";
import { services } from "../../config";
import { createTournamentSchema } from "./schemas";

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
      try {
        const response = await axios.post(
          `${services.gameService}/create-tournament`,
          request.body
        );

        reply.send(response.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          app.log.error(`Microservice request error: : ${error.message}`);

          if (error.response) {
            reply.sendError({
              statusCode: error.response.status,
              message: error.response.data?.message || "Microservice error",
            });
          }
        } else {
          app.log.error(
            `Requst error: ${services.gameService}/create-tournament: internal server error`
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
