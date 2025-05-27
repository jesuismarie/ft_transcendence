import type { FastifyInstance } from "fastify";
import { userServiceRequestHandler } from "./helpers";
import { createUserSchema } from "../../schemas/user-service/userSchemas";
import { services } from "../../config";

export interface CreateUserRequest {
  email: string;
  password: string;
  displayName: string;
}

export default async function createUserRoute(app: FastifyInstance) {
  app.post<{ Body: CreateUserRequest }>(
    "/user-service/users",
    {
      schema: {
        body: createUserSchema,
      },
    },
    async (request, reply) => {
      await userServiceRequestHandler(app, request, reply, {
        method: "POST",
        url: `${services.userService}/users`,
        data: request.body,
      });
    }
  );
}
