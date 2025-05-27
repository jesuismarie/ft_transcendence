import type { FastifyInstance } from "fastify";
import { userServiceRequestHandler } from "./helpers";
import { updateUserSchema } from "../../schemas/user-service/userSchemas";
import { services } from "../../config";

export interface UpdateUserRequest {
  displayName?: string;
  email?: string;
}

export default async function updateUserRoute(app: FastifyInstance) {
  app.put<{ Params: { id: string }; Body: UpdateUserRequest }>(
    "/user-service/users/:id",
    {
      schema: {
        body: updateUserSchema,
      },
    },
    async (request, reply) => {
      await userServiceRequestHandler(app, request, reply, {
        method: "PUT",
        url: `${services.userService}/users/${request.params.id}`,
        data: request.body,
      });
    }
  );
}
