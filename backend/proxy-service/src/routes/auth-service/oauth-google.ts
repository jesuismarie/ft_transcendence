import type { FastifyInstance } from "fastify";
import { authServiceRequestHandler } from "./helpers";
import { services } from "../../config";

export default async function googleOauthRoute(app: FastifyInstance) {
  app.get("/auth/oauth/google/callback", async (request, reply) => {
    await authServiceRequestHandler(app, request, reply, {
      method: "GET",
      url: `${services.authService}/auth/oauth/google/callback`,
      params: request.query,
    });
  });
}
