import type { FastifyInstance } from "fastify";
import { microserviceRequestHandler } from "../helpers";
import { services } from "../../config";
import { getMatchHistoryByUserSchema } from "../../schemas/game-service/schemas";

interface GetMatchHistoryByUserQuery {
  username: string;
  limit?: number;
  offset?: number;
}

export default async function getMatchHistoryByUserRoute(app: FastifyInstance) {
  app.get<{ Querystring: GetMatchHistoryByUserQuery }>(
    "/game-service/get-match-history-by-user",
    {
      schema: {
        querystring: getMatchHistoryByUserSchema,
      },
    },
    async (request, reply) => {
      await microserviceRequestHandler(app, request, reply, {
        method: "GET",
        url: `${services.gameService}/get-match-history-by-user`,
        params: request.query,
      });
    }
  );
}
