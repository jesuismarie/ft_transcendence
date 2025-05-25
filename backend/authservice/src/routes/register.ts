import { FastifyInstance } from 'fastify';
import { AuthTypes } from '@ft-transcendence/api-types';
import { apiError } from '../lib/error.js';
import { issueTokenPair } from '../lib/token';

export default async function registerRoutes(app: FastifyInstance) {
	app.post<{ Body: AuthTypes.RegisterRequest; Reply: AuthTypes.RegisterResponse }>(
		'/auth/register',
		{
			schema: {
				body: 'auth.registerRequest#',
				response: {
					200: 'auth.registerResponse#',
					409: 'api.error#'
				}
			}
		},
		async (req, reply) => {
			const { email, password, username } = req.body;
			
			let userId: number;
			try {
				userId = await app.userService.createUser({ email, password, username });
			} catch (e: any) {
				if (e.code === 'EMAIL_EXISTS') throw apiError('EMAIL_EXISTS', 'E‑mail already in use', 409);
				if (e.code === 'USERNAME_EXISTS') throw apiError('USERNAME_EXISTS', 'Username already in use', 409);
				throw e;
			}
			const tokens = await issueTokenPair(app, userId);
			return reply.send(tokens);
		}
	);
}