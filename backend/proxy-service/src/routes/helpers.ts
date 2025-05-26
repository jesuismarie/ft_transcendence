import axios, { AxiosRequestConfig } from "axios";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export async function microserviceRequestHandler<T>(
  app: FastifyInstance,
  request: FastifyRequest,
  reply: FastifyReply,
  config: AxiosRequestConfig
): Promise<void> {
  try {
    const response = await axios.request<T>(config);
    reply.send(response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      app.log.error(`Microservice request error: ${error.message}`);

      if (error.response) {
        reply.sendError({
          statusCode: error.response.status,
          message: error.response.data?.message || "Microservice error",
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
