import type { FastifyInstance } from "fastify";
import { authServiceRequestHandler } from "./helpers";
import { services } from "../../config";
import {
  registerRequestSchema,
  registerResponseSchema,
} from "../../schemas/auth-service/schemas";

export default async function registerRoute(app: FastifyInstance) {
  app.post(
    "/auth/register",
    {
      schema: {
        body: registerRequestSchema,
        response: {
          200: registerResponseSchema,
        },
      },
    },
    async (request, reply) => {
      await authServiceRequestHandler(app, request, reply, {
        method: "POST",
        url: `${services.authService}/auth/register`,
        data: request.body,
      });
    }
  );
}
