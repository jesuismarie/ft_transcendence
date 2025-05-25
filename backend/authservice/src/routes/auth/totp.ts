import { FastifyInstance } from 'fastify';
import { AuthTypes } from '@ft-transcendence/api-types';
import { apiError } from '../../lib/error';
import { issueTokenPair } from "../../lib/token";

export default async function login2faRoutes(app: FastifyInstance) {
	// 2FA verification route
	app.post<{ Body: AuthTypes.Login2FARequest; Reply: AuthTypes.LoginSuccess }>(
		'/auth/login/2fa',
		{
			schema: {
				body: { $ref: 'auth.login2faRequest#' },
				response: {
					200: { $ref: 'auth.loginSuccess#' },
					401: { $ref: 'api.error#' }
				}
			}
		},
		async (req, reply) => {
			const { loginTicket, otp } = req.body;
			
			// Check if the login ticket exists and is valid
			const ticket = await app.prisma.loginTicket.findUnique({ where: { id: loginTicket } });
			if (!ticket || ticket.used || ticket.expiresAt < new Date()) {
				throw apiError('TICKET_INVALID', 'Login ticket invalid or expired', 401);
			}
			// Generate the token pair
			const tokens = await issueTokenPair(app, ticket.userId);
			return reply.send( tokens satisfies AuthTypes.LoginSuccess);
		}
	);
}
