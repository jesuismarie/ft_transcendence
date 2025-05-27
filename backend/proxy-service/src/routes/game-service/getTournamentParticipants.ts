import type { FastifyInstance } from "fastify";
import { services } from "../../config";
import { microserviceRequestHandler } from "../helpers";
import { getTournamentParticipantsSchema } from "../../schemas/game-service/schemas";

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
      await microserviceRequestHandler(app, request, reply, {
        method: "GET",
        url: `${services.gameService}/get-tournament-participants`,
        params: request.query as GetTournamentParticipantsQuery,
      });
    }
  );
}
