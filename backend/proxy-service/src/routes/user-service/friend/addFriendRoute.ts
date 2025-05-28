import { FastifyInstance } from "fastify";
import { userServiceRequestHandler } from "../helpers";
import { addFriendSchema } from "../../../schemas/user-service/friendSchemas";

export default async function addFriendRoute(app: FastifyInstance) {
  app.post(
    "/friends",
    { schema: { body: addFriendSchema } },
    async (req, reply) => {
      await userServiceRequestHandler(app, req, reply, {
        method: "POST",
        url: "/friends",
        data: req.body,
      });
    }
  );
}
