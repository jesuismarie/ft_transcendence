import crypto from 'node:crypto';
import { FastifyInstance } from 'fastify';
import { AuthTypes } from '@KarenDanielyan/ft-transcendence-api-types';

/** Hash refresh token deterministically using HMAC‑SHA256 + service salt */
export function hashRefresh(token: string, salt: string) {
	return crypto.createHmac('sha256', salt).update(token).digest('hex');
}

/**
 * Issues access + refresh token pair and stores hashed refresh in DB.
 * Shared by login and register flows.
 */
export async function issueTokenPair(app: FastifyInstance, userId: number): Promise<AuthTypes.TokenPair> {
	const accessToken = app.jwt.sign({ sub: userId });
	const rawRefresh  = crypto.randomBytes(32).toString('hex');
	const tokenHash   = hashRefresh(rawRefresh, app.config.REFRESH_TOKEN_SALT);
	
	console.log(userId + ' recieved new refresh token: ' + tokenHash);
	await app.prisma.refreshToken.create({
		data: {
			userId,
			tokenHash,
			expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30) // 30 days
		}
	});
	
	return {
		accessToken,
		refreshToken: rawRefresh,
		userId
	};
}