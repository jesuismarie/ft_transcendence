import type { FastifyInstance } from "fastify";

export default async function (fastify: FastifyInstance) {
  fastify.get("/ping", async () => {
    return { status: "ok" };
  });
}
