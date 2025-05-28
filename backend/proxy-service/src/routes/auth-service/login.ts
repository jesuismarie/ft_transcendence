import type { FastifyInstance } from "fastify";
import { authServiceRequestHandler } from "./helpers";
import { services } from "../../config";
import {
  loginRequestSchema,
  loginSuccessSchema,
} from "../../schemas/auth-service/schemas";

export default async function loginRoute(app: FastifyInstance) {
  app.post(
    "/auth/login",
    {
      schema: {
        body: loginRequestSchema,
        response: {
          200: loginSuccessSchema,
        },
      },
    },
    async (request, reply) => {
      await authServiceRequestHandler(app, request, reply, {
        method: "POST",
        url: `${services.authService}/auth/login`,
        data: request.body,
      });
    }
  );
}
