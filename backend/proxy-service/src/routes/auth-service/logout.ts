import type { FastifyInstance } from "fastify";
import { authServiceRequestHandler } from "./helpers";
import { services } from "../../config";
import {
  logoutRequestSchema,
  logoutResponseSchema,
} from "../../schemas/auth-service/schemas";

export default async function logoutRoute(app: FastifyInstance) {
  app.post(
    "/auth/logout",
    {
      schema: {
        body: logoutRequestSchema,
        response: {
          200: logoutResponseSchema,
        },
      },
    },
    async (request, reply) => {
      await authServiceRequestHandler(app, request, reply, {
        method: "POST",
        url: `${services.authService}/auth/logout`,
        data: request.body,
      });
    }
  );
}
