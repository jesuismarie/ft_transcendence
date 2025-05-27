import type { FastifyInstance } from "fastify";
import { userServiceRequestHandler } from "./helpers";
import { updatePasswordSchema } from "../../schemas/user-service/userSchemas";
import { services } from "../../config";

export interface UpdatePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export default async function updateUserPasswordRoute(app: FastifyInstance) {
  app.put<{ Params: { id: string }; Body: UpdatePasswordRequest }>(
    "/user-service/users/:id/password",
    {
      schema: {
        body: updatePasswordSchema,
      },
    },
    async (request, reply) => {
      await userServiceRequestHandler(app, request, reply, {
        method: "PUT",
        url: `${services.userService}/users/${request.params.id}/password`,
        data: request.body,
      });
    }
  );
}
