import axios, { AxiosRequestConfig } from "axios";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { services } from "../../config";

export async function userServiceRequestHandler<T>(
  app: FastifyInstance,
  request: FastifyRequest,
  reply: FastifyReply,
  config: AxiosRequestConfig
): Promise<void> {
  try {
    const response = await axios.request<T>({
      ...config,
      baseURL: services.userService,
    });
    reply.send(response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      app.log.error(`UserService request error: ${error.message}`);

      if (error.response) {
        reply.sendError({
          statusCode: error.response.data?.statusCode,
          code: error.response.data?.code || "UserServiceError",
          message: error.response.data?.message || "UserService error",
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
