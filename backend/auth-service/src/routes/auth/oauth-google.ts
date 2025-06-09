import { FastifyInstance } from 'fastify';
import { apiError } from '../../lib/error';
import crypto from "node:crypto";
import * as process from "node:process";
import {AuthTypes, CommonTypes} from "@KarenDanielyan/ft-transcendence-api-types";
import {issueTokenPair} from "../../lib/token";

export default async function googleOauthRoutes(app: FastifyInstance) {
	// OAuthTypes callback endpoint
	app.get('/auth/oauth/google/callback', async (req, reply) => {
		try {
			console.log('Google OAuthTypes callback received');
			const { token } = await app.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(req);
			console.log(token);
			const idToken = token.id_token as string;
			const payload = app.jwt.decode(idToken) as any;
			const email = payload.email;
			const googleSub = payload.sub;
			
			// Credentials fetched from Google
			console.log(`Google OAuthTypes callback received for user: ${email} with sub: ${googleSub}`);
			// Ask UserService to find-or-create user by Google sub
			const userId = await app.userService.findOrCreateOAuth({
				email,
				provider: 'google',
				providerUserId: googleSub,
				username: email.split('@')[0]
			});
			// Log if user was created or found
			console.log(`User ${userId} ${payload.email} was created/found via Google OAuth`);
			// Create a login ticket
			const loginTicket = crypto.randomUUID();
			await app.prisma.loginTicket.create({
				data: {
					id: loginTicket,
					userId,
					expiresAt: new Date(Date.now() + 90_000),   // 90 s
				},
			});
			// secure redirect (fragment → SPA)
			reply
				.header('Cache-Control', 'no-store')
				.header('Referrer-Policy', 'no-referrer')
				.redirect(`${process.env.SPA_OAUTH_URL}?ticket=${loginTicket}`.replace('?', '#'));
		} catch (err) {
			console.log(err);
			throw apiError('OAUTH_FAILED', 'Google OAuthTypes failed', 500);
		}
	});
	
	// OAuth Claim endpoint
	app.post<{
			Body: { loginTicket: string };
			Reply: AuthTypes.LoginSuccess | CommonTypes.ApiError;
		}>(
		'/auth/oauth/google/claim',
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
