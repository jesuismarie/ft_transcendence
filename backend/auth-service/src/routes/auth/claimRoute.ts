import { FastifyInstance } from 'fastify';
import { AuthTypes, CommonTypes } from '@KarenDanielyan/ft-transcendence-api-types';
import { apiError } from '../../lib/error';
import { issueTokenPair, hashRefresh } from '../../lib/token';
import crypto from 'node:crypto';

export default async function claimRoute(app: FastifyInstance) {
	// OAuth Claim endpoint
	app.post<{
		Body: { loginTicket: string };
		Reply: AuthTypes.LoginSuccess | CommonTypes.ApiError;
	}>(
		'/auth/login/claim',
		{
			schema: {
				body: { type: 'object', properties: { loginTicket: { type: 'string' } }, required: ['loginTicket'] },
				response: {
					200: { $ref: 'auth.loginSuccess#' },
					401: { $ref: 'api.error#' }
				},
			},
		},
		async (req, reply) => {
			const { loginTicket } = req.body;
			// Find the login ticket
			const ticket = await app.prisma.loginTicket.findUnique({ where: { id: loginTicket} });
			if (!ticket || ticket.expiresAt < new Date() || ticket.used) {
				throw apiError('INVALID_LOGIN_TICKET', 'Login ticket invalid or expired', 401);
			}
			// Mark the ticket as used
			await app.prisma.loginTicket.update({
				where: { id: loginTicket },
				data: { used: true }
			});
			// Issue tokens for the user
			try {
				const tokens = await issueTokenPair(app, ticket.userId);
				reply.send(tokens);
			}
			catch (err) {
				throw apiError('CLAIM_FAILED', 'Failed to claim tokens', 501);
			}
		}
	);
}