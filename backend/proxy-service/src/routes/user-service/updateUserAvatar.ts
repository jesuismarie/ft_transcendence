import type { FastifyInstance } from "fastify";
import { userServiceRequestHandler } from "./helpers";
import { services } from "../../config";

export default async function updateUserAvatarRoute(app: FastifyInstance) {
  app.put<{ Params: { id: string } }>(
    "/user-service/users/:id/avatar",
    async (request, reply) => {
      await userServiceRequestHandler(app, request, reply, {
        method: "PUT",
        url: `${services.userService}/users/${request.params.id}/avatar`,
        data: request.body,
      });
    }
  );
}
