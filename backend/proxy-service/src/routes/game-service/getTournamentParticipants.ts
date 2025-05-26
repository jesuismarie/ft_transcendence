import type { FastifyInstance } from "fastify";
import axios from "axios";
import { services } from "../../config";
import { getTournamentParticipantsSchema } from "./schemas";

interface GetTournamentParticipantsQuery {
  id: number;
}

export default async function getTournamentParticipantsRoute(
  app: FastifyInstance
) {
  app.get(
    "/game-service/get-tournament-participants",
    {
      schema: {
        querystring: getTournamentParticipantsSchema,
      },
    },
    async (request, reply) => {
      try {
        const response = await axios.get(
          `${services.gameService}/get-tournament-participants`,
          {
            params: request.query as GetTournamentParticipantsQuery,
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
            `Requst error: ${services.gameService}/get-tournament-participants: internal server error`
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
