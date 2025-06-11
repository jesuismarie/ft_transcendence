import { FastifyInstance } from 'fastify';
import { UserRepo } from "../../repositories/userRepo";

interface PresenceRequest {
	users: number[];
}

type PresenceStatus = 'online' | 'offline' | 'unknown';

interface PresenceResponse {
	[users: number]: PresenceStatus;
}

const presenceRequestSchema = {
	type: 'object',
	properties: {
		users: {
			type: 'array',
			items: {type: 'number'},
			minItems: 1,
			maxItems: 100,
		},
	},
	required: ['users'],
}

const presenceResponseSchema = {
	type: 'object',
	additionalProperties: {
		type: 'string',
		enum: ['online', 'offline', 'unknown'],
	},
}

export async function registerPresenceRoute(fastify: FastifyInstance, userRepo: UserRepo) {
	fastify.post<{ Body: PresenceRequest; Reply: PresenceResponse }>(
		'/presence',
		{
			schema: {
				body: presenceRequestSchema,
				response: {
					200: presenceResponseSchema,
				},
			},
		},
		async (req, reply) => {
			const { users } = req.body;
			const result: PresenceResponse = {};
			
			await Promise.all(
				users.map(async (user) => {
					try {
						const userId = userRepo.findById(user)?.id;
						if (!userId) {
							result[user] = 'unknown';
						} else {
							result[userId] = fastify.isUserOnline(userId) ? 'online' : 'offline';
						}
					} catch {
						result[user] = 'unknown'; // fallback in case of DB errors
					}
				})
			);
			return result;
		}
	);
}

export default registerPresenceRoute;
