import type { FastifyInstance } from "fastify";
import { microserviceRequestHandler } from "./helpers";
import { services } from "../../config";
import { saveMatchResultSchema } from "../../schemas/game-service/schemas";

export interface SaveMatchResultBody {
  match_id: number;
  winner: string;
  score: {
    score_1: number;
    score_2: number;
  };
}

export default async function saveMatchResultRoute(app: FastifyInstance) {
  app.post<{ Body: SaveMatchResultBody }>(
    "/game-service/save-match-result",
    {
      schema: {
        body: saveMatchResultSchema,
      },
    },
    async (request, reply) => {
      await microserviceRequestHandler(app, request, reply, {
        method: "POST",
        url: `${services.gameService}/save-match-result`,
        data: request.body,
      });
    }
  );
}
