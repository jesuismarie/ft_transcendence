import { FastifyInstance } from	'fastify';
import fp from 'fastify-plugin';
import { FastifyPluginAsync } from 'fastify';
import { request } from 'undici';
import { AuthTypes, UserTypes } from '@ft-transcendence/api-types';
import { apiError } from '../lib/error';

export interface UserServiceClient {
	/* Verify if the user typed the correct password. */
	verifyPassword(body: AuthTypes.LoginRequest): Promise<number>;
	/* Create a new user with the given details. */
	createUser(body: AuthTypes.RegisterRequest): Promise<number>;
	/* Get user details by ID. */
	getUserById(id: number): Promise<UserTypes.User>;
}

export interface UserServiceClientConfig {
	baseUrl: string;
	clusterToken: string;
	timeoutMs?: number; // optional timeout in milliseconds
}

const buildClient = ({ baseUrl, clusterToken } : UserServiceClientConfig): UserServiceClient => {
	const headers = {
		'content-type': 'application/json',
		'x-cluster-token': clusterToken
	} as const;
	
	/** helper — wraps undici.request with JSON encode/decode + error mapping */
	async function call<T>(path: string, body: unknown, expected: number[]): Promise<T> {
		const { statusCode, body: resBody } = await request(`${baseUrl}${path}`, {
			method: 'POST',
			headers,
			body: JSON.stringify(body),
		});
		
		const json:any = await resBody.json();
		
		if (!expected.includes(statusCode)) {
			const errCode = (json && json.code) ?? 'USERSERVICE_DOWN';
			const msg = (json && json.message) ?? 'UserService error';
			
			throw apiError(errCode, msg, statusCode as number);
		}
		
		return json as T;
	}
	
	return {
		async verifyPassword(body) {
			const res = await call<{ userId: number }>('/internal/users/verify-password', body, [200]);
			return res.userId;
		},
		
		async createUser(body) {
			const res = await call<{ userId: number }>('/internal/users', body, [201]);
			return res.userId;
		},
		
		async getUserById(id) {
			const { statusCode, body: resBody } = await request(`${baseUrl}/internal/users/${id}`, {
				method: 'GET',
				headers,
			});
			if (statusCode !== 200) throw apiError('USER_NOT_FOUND', 'User not found', statusCode);
			return (await resBody.json()) as UserTypes.User;
		}
	};
};

// ────────────────────────────────────────────────────────────────────────────
// Fastify plugin – decorates app with userService client instance
// ────────────────────────────────────────────────────────────────────────────

declare module 'fastify' {
	interface FastifyInstance {
		userService: UserServiceClient;
	}
}

const userServiceClientPlugin: FastifyPluginAsync = async (app : FastifyInstance) => {
	const baseUrl = app.config.USER_SERVICE_URL ?? 'http://userservice:3000';
	const clusterToken = app.config.CLUSTER_TOKEN;
	
	app.decorate('userService', buildClient({ baseUrl, clusterToken }));
};

export default fp(userServiceClientPlugin, {
	name: 'user-service-client'
});
