import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { apiError } from '../../lib/error';
import { AuthTypes, CommonTypes } from '@ft-transcendence/api-types';

// Utility middleware: ensure X-Cluster-Token matches env
async function clusterAuth(req: FastifyRequest, reply: FastifyReply) {
	const header = req.headers['x-cluster-token'] as string | undefined;
	if (!header || header !== process.env.CLUSTER_TOKEN) {
		throw apiError('FORBIDDEN', 'Internal route forbidden', 403);
	}
}

export default async function internalTokenRoutes(app: FastifyInstance) {
	// For other services to verify a token
	app.post<{ Body: AuthTypes.InternalVerifyTokenRequest; Reply: AuthTypes.InternalVerifyTokenResponse | CommonTypes.ApiError }>(
		'/internal/tokens/verify',
		{
			preHandler: clusterAuth,
			schema: {
				body: { $ref: 'auth.tokenVerifyRequest#' },
				response: { 200: { $ref: 'auth.tokenVerifyResponse#' }, 401: { $ref: 'api.error#' } }
			}
		},
		async (req, reply) =>
		{
			try {
				const { sub: userId } = app.jwt.verify<{ sub: number }>(req.body.token);
				const user = await app.userService.getUserById(userId);
				if (!user) return reply.sendError({ code: 'USER_NOT_FOUND', message: 'User not found', statusCode: 404 });
				return reply.send({userId: userId, username: user.username});
			}
			catch (err) {
				throw apiError('INVALID_TOKEN', 'Token invalid or expired', 401);
			}
		}
	);
	
	// Revoke a refresh token internally
	app.post<{ Body: AuthTypes.InternalRevokeTokenRequest; Reply: AuthTypes.LogoutResponse | CommonTypes.ApiError }>(
		'/internal/tokens/revoke',
		{
			preHandler: clusterAuth,
			schema: {
				body: { $ref: 'auth.internalRevokeTokenRequest#' },
				response: { 200: { $ref: 'auth.logoutResponse#' }, 404: { $ref: 'api.error#' } }
			}
		},
		async (req, reply) => {
			const { tokenId } = req.body;
			const deleted = await app.prisma.refreshToken.update({
				where: { id: tokenId },
				data: { revoked: true, revokedReason: 'admin' }
			}).catch(() => null);
			
			if (!deleted) throw apiError('TOKEN_NOT_FOUND', 'Refresh token not found', 404);
			return reply.send({ revoked: true });
		}
	);
}