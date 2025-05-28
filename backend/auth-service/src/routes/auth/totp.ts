import { FastifyInstance } from 'fastify';
import { AuthTypes, CommonTypes } from '@ft-transcendence/api-types';
import { apiError } from '../../lib/error';
import { issueTokenPair } from "../../lib/token";
import qrcode from 'qrcode';
import speakeasy from 'speakeasy';

export default async function totpRoutes(app: FastifyInstance) {
	// Establish TOTP
	app.post(
		'/auth/2fa/enable',
		{
			preValidation: [app.authenticate],
			schema: {
				response: { 200: { $ref: 'auth.2faEnableResponse#' } }
			}
		},
		async (req, reply) => {
			const userId = (req.user as any).sub as number;
			
			// generate secret (256bit base32)
			const secret = speakeasy.generateSecret({ length: 32, name: `ft_transcendence:${userId}` });
			
			// upsert TotpSecret row (verified = false)
			await app.prisma.totpSecret.upsert({
				where: { userId },
				update: { secret: secret.base32, verified: false },
				create: { userId, secret: secret.base32 }
			});
			
			const otpauthUrl = secret.otpauth_url!;
			const qrSvg = await qrcode.toString(otpauthUrl, { type: 'svg' });
			
			reply.send({ otpauthUrl, qrSvg });
		}
	);
	
	// Verify TOTP
	app.post<{ Body: AuthTypes.TwoFAVerifyRequest }>(
		'/auth/2fa/verify',
		{
			preValidation: [app.authenticate],
			schema: {
				body: { $ref: 'auth.2faVerifyRequest#' },
				response: { 200: { $ref: 'auth.2faVerifyResponse#' } }
			}
		},
		async (req, reply) => {
			const userId = (req.user as any).sub as number;
			const record = await app.prisma.totpSecret.findUnique({ where: { userId } });
			if (!record) throw apiError('2FA_NOT_ENABLED', '2FA not enabled', 400);
			
			const ok = speakeasy.totp.verify({ secret: record.secret, encoding: 'base32', token: req.body.otp });
			if (!ok) throw apiError('OTP_INVALID', 'Invalid OTP', 401);
			
			await app.prisma.totpSecret.update({ where: { userId }, data: { verified: true } });
			reply.send({ verified: true });
		}
	);
	
	// On every login use this route to verify TOTP
	app.post<{ Body: AuthTypes.Login2FARequest; Reply: AuthTypes.LoginSuccess | CommonTypes.ApiError }>(
		'/auth/login/2fa',
		{
			schema: {
				body: { $ref: 'auth.login2faRequest#' },
				response: { 200: { $ref: 'auth.loginSuccess#' } }
			}
		},
		async (req, reply) => {
			const { loginTicket, otp } = req.body;
			const ticket = await app.prisma.loginTicket.findUnique({ where: { id: loginTicket } });
			if (!ticket || ticket.used || ticket.expiresAt < new Date()) {
				throw apiError('TICKET_INVALID', 'Login ticket invalid or expired', 401);
			}
			
			const totp = await app.prisma.totpSecret.findUnique({ where: { userId: ticket.userId } });
			if (!totp || !totp.verified) throw apiError('2FA_NOT_SETUP', '2FA not set up', 400);
			
			const ok = speakeasy.totp.verify({ secret: totp.secret, encoding: 'base32', token: otp });
			if (!ok) throw apiError('OTP_INVALID', 'Invalid OTP', 401);
			
			// mark ticket used
			await app.prisma.loginTicket.update({ where: { id: loginTicket }, data: { used: true } });
			
			const tokens = await issueTokenPair(app, ticket.userId);
			reply.send(tokens);
		}
	);
}
