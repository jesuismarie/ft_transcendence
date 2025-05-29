import fp from 'fastify-plugin';
import { FastifyInstance } from 'fastify';
import fastifyEnv from '@fastify/env';

// Define the expected environment variables and their types
export interface EnvConfig {
	JWT_SECRET: string;
	DATABASE_URL: string;
	REFRESH_TOKEN_SALT: string;
	CLUSTER_TOKEN: string;
	GOOGLE_CLIENT_ID: string;
	GOOGLE_CLIENT_SECRET: string;
	GOOGLE_CALLBACK_URL: string;
	USER_SERVICE_URL: string;
	AUTH_SERVICE_URL: string;
	GAME_SERVICE_URL: string;
	PONG_SERVICE_URL: string;
	PROXY_SERVICE_URL: string;
}

const schema = {
	type: 'object',
	required: ['JWT_SECRET', 'DATABASE_URL'],
	properties: {
		JWT_SECRET: { type: 'string', minLength: 32 },
		DATABASE_URL: { type: 'string' },
		REFRESH_TOKEN_SALT: { type: 'string' },
		CLUSTER_TOKEN: { type: 'string' },
		GOOGLE_CLIENT_ID: { type: 'string' },
		GOOGLE_CLIENT_SECRET: { type: 'string' },
		GOOGLE_CALLBACK_URL: { type: 'string' },
		USER_SERVICE_URL: { type: 'string' },
		AUTH_SERVICE_URL: { type: 'string' },
		GAME_SERVICE_URL: { type: 'string' },
		PONG_SERVICE_URL: { type: 'string' },
		PROXY_SERVICE_URL: { type: 'string'}
	}
};

export default fp(async (app: FastifyInstance) => {
	await app.register(fastifyEnv, { schema, dotenv: true });
});

declare module 'fastify' {
	interface FastifyInstance {
		config: EnvConfig;
	}
}
