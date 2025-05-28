import { FastifyInstance } from 'fastify';
import { AuthTypes, CommonTypes } from '@ft-transcendence/api-types';
import { apiError } from '../../lib/error';
import { hashRefresh } from '../../lib/token';

// Logout route
export default async function logoutRoutes(app: FastifyInstance) {
	// Logout route
	app.post<{ Body: AuthTypes.LogoutRequest; Reply: AuthTypes.LogoutResponse | CommonTypes.ApiError }>(
		'/auth/logout',
		{
			schema: {
				body: {$ref: 'auth.logoutRequest#'},
				response: {
					200: {$ref: 'auth.logoutResponse#'},
					404: {$ref: 'api.error#'}
				}
			}
		},
		async (req, reply) => {
			const {refreshToken} = req.body;
			const hashed = hashRefresh(refreshToken, process.env.REFRESH_TOKEN_SALT!);
			
			const success = await app.prisma.refreshToken
				.update({
					where: {tokenHash: hashed},
					data: {revoked: true, revokedReason: 'USER_LOGOUT', rotatedAt: new Date()}
				})
				.then(() => true)
				.catch(() => false);
			if (!success) {
				throw apiError('TOKEN_NOT_FOUND', 'Refresh token not found or already revoked', 404);
			}
			reply.send({revoked: true} satisfies AuthTypes.LogoutResponse);
		}
	);
}