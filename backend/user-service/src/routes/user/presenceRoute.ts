import { FastifyInstance } from 'fastify';
import { UserRepo } from "../../repositories/userRepo";

interface PresenceRequest {
	usernames: string[];
}

type PresenceStatus = 'online' | 'offline' | 'unknown';

interface PresenceResponse {
	[username: string]: PresenceStatus;
}

const presenceRequestSchema = {
	type: 'object',
	properties: {
		usernames: {
			type: 'array',
			items: {type: 'string'},
			minItems: 1,
			maxItems: 100,
		},
	},
	required: ['usernames'],
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
			const { usernames } = req.body;
			const result: PresenceResponse = {};
			
			await Promise.all(
				usernames.map(async (username) => {
					try {
						const userId = userRepo.findByUsername(username)?.id;
						if (!userId) {
							result[username] = 'unknown';
						} else {
							result[username] = fastify.isUserOnline(userId) ? 'online' : 'offline';
						}
					} catch {
						result[username] = 'unknown'; // fallback in case of DB errors
					}
				})
			);
			return result;
		}
	);
}

export default registerPresenceRoute;
