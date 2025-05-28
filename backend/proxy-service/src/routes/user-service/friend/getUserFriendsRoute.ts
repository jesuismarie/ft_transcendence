import { FastifyInstance } from "fastify";
import { userServiceRequestHandler } from "../helpers";
import { listFriendsQuery } from "../../../schemas/user-service/friendSchemas";

export default async function getUserFriendsRoute(app: FastifyInstance) {
  app.get(
    "/friends",
    { schema: { querystring: listFriendsQuery } },
    async (req, reply) => {
      await userServiceRequestHandler(app, req, reply, {
        method: "GET",
        url: "/friends",
        params: req.query,
      });
    }
  );
}
