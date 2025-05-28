import type { FastifyInstance } from "fastify";
import metricsRoute from "./metrics";

export default async function monitoringRoutes(app: FastifyInstance) {
  await metricsRoute(app);
}
