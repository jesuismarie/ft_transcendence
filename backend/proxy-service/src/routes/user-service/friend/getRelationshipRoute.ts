import { FastifyInstance } from "fastify";
import { userServiceRequestHandler } from "../helpers";
import { relationshipResponseSchema } from "../../../schemas/user-service/friendSchemas";

export default async function getRelationshipRoute(app: FastifyInstance) {
  app.get(
    "/users/:userId/relationship/:friendId",
    {
      schema: {
        response: {
          200: relationshipResponseSchema,
        },
      },
    },
    async (req, reply) => {
      const { userId, friendId } = req.params as {
        userId: string;
        friendId: string;
      };
      await userServiceRequestHandler(app, req, reply, {
        method: "GET",
        url: `/users/${userId}/relationship/${friendId}`,
      });
    }
  );
}
