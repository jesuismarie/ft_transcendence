import type { FastifyInstance } from "fastify";
import { authServiceRequestHandler } from "./helpers";
import { services } from "../../config";
import {
  enable2faResponseSchema,
  verify2faRequestSchema,
  verify2faResponseSchema,
} from "../../schemas/auth-service/schemas";

export default async function totpRoutes(app: FastifyInstance) {
  // Enable 2FA
  app.post(
    "/auth/2fa/enable",
    {
      schema: {
        response: {
          200: enable2faResponseSchema,
        },
      },
    },
    async (request, reply) => {
      await authServiceRequestHandler(app, request, reply, {
        method: "POST",
        url: `${services.authService}/auth/2fa/enable`,
        data: request.body,
      });
    }
  );

  // Verify 2FA
  app.post(
    "/auth/2fa/verify",
    {
      schema: {
        body: verify2faRequestSchema,
        response: {
          200: verify2faResponseSchema,
        },
      },
    },
    async (request, reply) => {
      await authServiceRequestHandler(app, request, reply, {
        method: "POST",
        url: `${services.authService}/auth/2fa/verify`,
        data: request.body,
      });
    }
  );
}
