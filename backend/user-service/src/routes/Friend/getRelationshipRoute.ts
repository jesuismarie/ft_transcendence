import { FastifyInstance, FastifyReply } from 'fastify';
import { relationshipResponseSchema } from '../../schemas/friendSchemas';
import errorSchema from '../../schemas/errorSchema';


interface RelationshipResponse {
	status: boolean;
}

export default async function getRelationshipRoute(app: FastifyInstance, userRepo: any, friendRepo: any) {
	app.get<{ Params: { userId: string; friendId: string }; Reply: RelationshipResponse }>(
		'/users/:userId/relationship/:friendId',
		{
			schema: {
				response: {
					200: relationshipResponseSchema,
					404: errorSchema
				}
			}
		},
		async (req, reply : FastifyReply) => {
			console.log(`Received request to check relationship between user ${req.params.userId} and friend ${req.params.friendId}`);
			const userId = Number(req.params.userId);
			const friendId = Number(req.params.friendId);
			const userExists = userRepo.findById(userId);
			const friendExists = userRepo.findById(friendId);
			
			if (!userExists || !friendExists)
				return reply.sendError({statusCode: 404, message: 'User or Friend not found'});
			const relationshipExists = friendRepo.getRelationship(userId, friendId);
			return reply.send({status: relationshipExists});
		}
	);
}