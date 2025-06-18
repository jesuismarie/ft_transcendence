import { FastifyInstance } from 'fastify';
import { AuthTypes } from '@KarenDanielyan/ft-transcendence-api-types';
import { apiError } from '../../lib/error';
import { issueTokenPair, hashRefresh } from '../../lib/token';
import crypto from 'node:crypto';

export default async function loginRoutes(app: FastifyInstance) {
	// Login route
	app.post<{ Body: AuthTypes.LoginRequest; Reply: AuthTypes.Login2FARequired }>(
		'/auth/login',
		{
			schema: {
				body: { $ref: 'auth.loginRequest#' },
				response: {
					200: { $ref: 'auth.2faRequired#' },
					401: { $ref: 'api.error#' }
				}
			}
		},
		async (req, reply) => {
			// Verify credentials via UserService
			const userId = await app.userService.verifyPassword(req.body).catch(() => {
				throw apiError('INVALID_CREDENTIALS', 'Email or password incorrect', 401);
			});
			// Open a login ticket
			const loginTicket = crypto.randomUUID();
			let requires2fa = false;
			await app.prisma.loginTicket.create({
				data: { id: loginTicket, userId, expiresAt: new Date(Date.now() + 5 * 60 * 1000) }
			});
			const totp = await app.prisma.totpSecret.findUnique({ where: { userId } });
			// Check if the user has 2FA enabled
			if (totp && totp.verified)
				requires2fa = true;
			// Return response { loginTicket, require2fa }
			return reply.send({
				loginTicket,
				requires2fa
			} as AuthTypes.Login2FARequired);
		}
	);
	// Refresh route
	app.post<{ Body: AuthTypes.RefreshRequest; Reply: AuthTypes.RefreshResponse }>(
		'/auth/refresh',
		{
			schema: {
				body: { $ref: 'auth.refreshRequest#' },
				response: {
					200: { $ref: 'auth.refreshResponse#' },
					401: { $ref: 'api.error#' }
				}
			}
		},
		async (req, reply) => {
			const { refreshToken } = req.body;
			const hash = hashRefresh(refreshToken, app.config.REFRESH_TOKEN_SALT);
			
			// Find the refresh token record
			const record = await app.prisma.refreshToken.findUnique({
				where: { tokenHash: hash }
			});
			if (!record || record.revoked || record.expiresAt < new Date()) {
				throw apiError('INVALID_REFRESH', 'Refresh token invalid or expired', 401);
			}
			
			// Rotate – revoke current & issue new
			await app.prisma.refreshToken.update({
				where: { id: record.id },
				data: { revoked: true, rotatedAt: new Date(), revokedReason: 'rotated' }
			});
			
			const tokens = await issueTokenPair(app, record.userId);
			return reply.send({ ...tokens, userId: record.userId });
		}
	);
}
