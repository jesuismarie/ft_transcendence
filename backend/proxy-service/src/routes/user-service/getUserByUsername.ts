import type { FastifyInstance } from "fastify";
import { userServiceRequestHandler } from "./helpers";
import { services } from "../../config";

export default async function getUserByUsernameRoute(app: FastifyInstance) {
  app.get<{ Params: { username: string } }>(
    "/user-service/users/username/:username",
    async (request, reply) => {
      await userServiceRequestHandler(app, request, reply, {
        method: "GET",
        url: `${services.userService}/users/username/${request.params.username}`,
      });
    }
  );
}
