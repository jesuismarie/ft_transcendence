import type { FastifyInstance } from "fastify";
import { userServiceRequestHandler } from "../helpers";
import { listUsersQuery } from "../../../schemas/user-service/userSchemas";
import { services } from "../../../config";

export interface ListUsersQuery {
  offset?: number;
  limit?: number;
  q?: string;
}

export default async function getUsersRoute(app: FastifyInstance) {
  app.get<{ Querystring: ListUsersQuery }>(
    "/user-service/users",
    {
      schema: {
        querystring: listUsersQuery,
      },
    },
    async (request, reply) => {
      await userServiceRequestHandler(app, request, reply, {
        method: "GET",
        url: `${services.userService}/users`,
        params: request.query,
      });
    }
  );
}
