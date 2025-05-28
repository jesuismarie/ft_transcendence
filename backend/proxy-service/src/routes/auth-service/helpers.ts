import axios, { AxiosRequestConfig } from "axios";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { services } from "../../config";

export async function authServiceRequestHandler<T>(
  app: FastifyInstance,
  request: FastifyRequest,
  reply: FastifyReply,
  config: AxiosRequestConfig
): Promise<void> {
  try {
    const response = await axios.request<T>({
      ...config,
      baseURL: services.authService,
    });
    reply.send(response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      app.log.error(`AuthService request error: ${error.message}`);

      if (error.response) {
        reply.sendError({
          statusCode: error.response.data?.statusCode,
          code: error.response.data?.code || "AuthServiceError",
          message: error.response.data?.message || "AuthService error",
        });
      }
    } else {
      app.log.error(`Request error: ${config.url}: internal server error`);
      reply.sendError({
        statusCode: 500,
        message: "Internal Server Error",
      });
    }
  }
}
