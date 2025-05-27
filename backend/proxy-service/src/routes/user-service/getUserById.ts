import type { FastifyInstance } from "fastify";
import { userServiceRequestHandler } from "./helpers";
import { services } from "../../config";

export default async function getUserByIdRoute(app: FastifyInstance) {
  app.get<{ Params: { id: string } }>(
    "/user-service/users/:id",
    async (request, reply) => {
      await userServiceRequestHandler(app, request, reply, {
        method: "GET",
        url: `${services.userService}/users/${request.params.id}`,
      });
    }
  );
}
