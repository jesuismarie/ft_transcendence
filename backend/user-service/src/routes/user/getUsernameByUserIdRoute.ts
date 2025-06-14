import { FastifyInstance } from 'fastify';
import { UserRepo } from '../../repositories/userRepo';
import { Type } from '@sinclair/typebox';

interface GetUsernameByUserIdRequest {
    userIds: number[];
}

export default async function getUsernameByUserIdRoute(app: FastifyInstance, userRepo: UserRepo) {
  app.post<{
  }>('/users/usernames', {
    schema: {
      body: Type.Object({
        userIds: Type.Array(Type.Number(), { minItems: 1 })
      }, {
        required: ['userIds'],
        additionalProperties: false
      })
    },

      handler: async (request, reply) => {
      const { userIds } = request.body as GetUsernameByUserIdRequest;

      if (!userIds || userIds.length === 0) {
        return reply.sendError({ statusCode: 400, code:"BAD_REQUEST", message: 'No user IDs provided' });
      }

      const result: Record<number, string> = {};

      for (const userId of userIds) {
        const user = userRepo.findById(userId);
        if (!user) {
          return reply.sendError({ statusCode: 404, code:"NOT_FOUND", message: `User not found, id: ${userId}` });
        }
        result[userId] = user.username;
      }

      return reply.code(200).send(result);
    }
  });
}
