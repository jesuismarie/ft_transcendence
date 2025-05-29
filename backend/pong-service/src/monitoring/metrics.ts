import type { FastifyInstance } from "fastify";
import { register } from "../utilities/monitoring";

export default async function metricsRoute(app: FastifyInstance) {
  app.get("/metrics", async (request, reply) => {
    reply.header("Content-Type", register.contentType);
    reply.send(await register.metrics());
  });
}
