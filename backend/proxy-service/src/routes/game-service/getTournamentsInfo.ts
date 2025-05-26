import type { FastifyInstance } from "fastify";
import { microserviceRequestHandler } from "../helpers";
import { services } from "../../config";
import { getTournamentsInfoSchema } from "./schemas";

export interface GetTournamentsInfoRequest {
  limit?: number;
  offset?: number;
}

export default async function getTournamentsInfoRoute(app: FastifyInstance) {
  app.get(
    "/game-service/get-tournaments-info",
    {
      schema: {
        querystring: getTournamentsInfoSchema,
      },
    },
    async (request, reply) => {
      await microserviceRequestHandler(app, request, reply, {
        method: "GET",
        url: `${services.gameService}/get-tournaments-info`,
        params: request.query as GetTournamentsInfoRequest,
      });
    }
  );
}
