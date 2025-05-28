import { FastifyInstance } from "fastify";
import { userServiceRequestHandler } from "../helpers";
import { removeFriendSchema } from "../../../schemas/user-service/friendSchemas";

export default async function removeFriendRoute(app: FastifyInstance) {
  app.delete(
    "/friends",
    { schema: { body: removeFriendSchema } },
    async (req, reply) => {
      await userServiceRequestHandler(app, req, reply, {
        method: "DELETE",
        url: "/friends",
        data: req.body,
      });
    }
  );
}
