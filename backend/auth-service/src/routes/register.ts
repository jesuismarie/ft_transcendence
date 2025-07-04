import { FastifyInstance } from 'fastify';
import { AuthTypes } from '@KarenDanielyan/ft-transcendence-api-types';
import { apiError } from '../lib/error';
import { issueTokenPair } from '../lib/token';

export default async function registerRoutes(app: FastifyInstance) {
	app.post<{ Body: AuthTypes.RegisterRequest; Reply: AuthTypes.RegisterResponse }>(
		'/auth/register',
		{
			schema: {
				body: { $ref: 'auth.registerRequest#' },
				response: {
					200: { $ref: 'auth.registerResponse#' },
					409: { $ref: 'api.error#' }
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
				if (e.code === 'USERSERVICE_DOWN') throw apiError('USERSERVICE_DOWN', 'UserService is unavailable', 503);
				console.log("Error creating user:", e);
				throw apiError('INTERNAL_ERROR', 'Failed to create user', 500);
			}
			try {
				const tokens = await issueTokenPair(app, userId);
				return reply.send(tokens);

			}
			catch (e) {
				console.log(`AAAA:::${e}`);
			}
		}
	);
}