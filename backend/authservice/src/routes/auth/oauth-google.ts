import { FastifyInstance } from 'fastify';
import { issueTokenPair } from '../../lib/token';
import { apiError } from '../../lib/error';
import { AuthTypes, CommonTypes } from '@ft-transcendence/api-types';

export default async function googleOauthRoutes(app: FastifyInstance) {
	// OAuthTypes callback endpoint
	app.get<{
		Reply: AuthTypes.LoginSuccess | CommonTypes.ApiError;
	}>('/auth/oauth/google/callback', async (req, reply) => {
		try {
			const { token } = await app.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(req);
			const idToken = token.id_token as string;
			const payload = app.jwt.decode(idToken) as any;
			const email = payload.email;
			const googleSub = payload.sub;
			
			// Ask UserService to find-or-create user by Google sub
			const userId = await app.userService.findOrCreateOAuth({
				email,
				provider: 'google',
				providerUserId: googleSub,
				username: email.split('@')[0]
			});
			
			const tokens = await issueTokenPair(app, userId);
			reply.send(tokens);
		} catch (err) {
			throw apiError('OAUTH_FAILED', 'Google OAuthTypes failed', 500);
		}
	});
}
