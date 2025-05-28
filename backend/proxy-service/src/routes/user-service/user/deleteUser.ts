import type { FastifyInstance } from "fastify";
import { userServiceRequestHandler } from "../helpers";
import { services } from "../../../config";

export default async function deleteUserRoute(app: FastifyInstance) {
  app.delete<{ Params: { id: string } }>(
    "/user-service/users/:id",
    async (request, reply) => {
      await userServiceRequestHandler(app, request, reply, {
        method: "DELETE",
        url: `${services.userService}/users/${request.params.id}`,
      });
    }
  );
}

// TODO: delete
