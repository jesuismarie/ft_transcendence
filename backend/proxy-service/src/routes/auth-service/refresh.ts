import type { FastifyInstance } from "fastify";
import { authServiceRequestHandler } from "./helpers";
import { services } from "../../config";
import {
  refreshRequestSchema,
  refreshResponseSchema,
} from "../../schemas/auth-service/schemas";

export default async function refreshRoute(app: FastifyInstance) {
  app.post(
    "/auth/refresh",
    {
      schema: {
        body: refreshRequestSchema,
        response: {
          200: refreshResponseSchema,
        },
      },
    },
    async (request, reply) => {
      await authServiceRequestHandler(app, request, reply, {
        method: "POST",
        url: `${services.authService}/auth/refresh`,
        data: request.body,
      });
    }
  );
}
