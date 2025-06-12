import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { services } from "../config";
import axios from "axios";

const excludedRoutes = ["/user-service/health",
                        "/user-service/static",
                        "/metrics", "/public",
                        "/auth-service"
]; // Handlers that do not require authentication

export default async function authMiddleware(app: FastifyInstance) {
  app.addHook(
    "onRequest",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { url, headers } = request;

      if (excludedRoutes.some((route) => url.startsWith(route))) {
        return;
      }

      try {
        const authHeader = headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
          throw new Error("Authorization header is missing or invalid");
        }

        const token = authHeader.slice(7); // Remove "Bearer "

        const response = await axios.post(
          `${services.authService}/internal/tokens/verify`,
          { token },
          { timeout: 5000 }
        );

        if (response.status !== 200) {
          throw new Error("Token verification failed");
        }
      } catch (error) {
        console.log("Token verification error:", error);

        if (axios.isAxiosError(error)) {
          app.log.error(`auth-service request error: ${error.message}`);

          if (error.response) {
            return reply.sendError({
              statusCode: error.response.data?.statusCode || 401,
              code: error.response.data?.code || "UNAUTHORIZED",
              message:
                error.response.data?.message || "Token verification failed",
            });
          }

          return reply.sendError({
            statusCode: 401,
            code: "REFUSED_CONNECTION",
            message: "Could not connect to auth service",
          });
        } else {
          app.log.error(`internal server error`);
          throw error;
        }
      }
    }
  );
}
