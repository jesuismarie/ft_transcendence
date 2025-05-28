import {FastifyInstance, FastifyPluginAsync} from 'fastify';
import fp from 'fastify-plugin';
import {request} from 'undici';
import {AuthTypes, UserTypes} from '@KarenDanielyan/ft-transcendence-api-types';
import {apiError} from '../lib/error';

interface FindOrCreateOAuthBody {
	email: string;
	provider: 'google'; // Add more providers as needed
	providerUserId: string; // Unique ID from the OAuth provider
	username?: string; // Optional username can be derived from email
}

export interface UserServiceClient {
	/* Verify if the user typed the correct password. */
	verifyPassword(body: AuthTypes.LoginRequest): Promise<number>;
	/* Create a new user with the given details. */
	createUser(body: AuthTypes.RegisterRequest): Promise<number>;
	/* Get user details by ID. */
	getUserById(id: number): Promise<UserTypes.UserView>;
	/* Find or create a user based on OAuth provider details. */
	findOrCreateOAuth(body: FindOrCreateOAuthBody): Promise<number>;
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
		const {statusCode, body: resBody} = await request(`${baseUrl}${path}`, {
			method: 'POST',
			headers,
			body: JSON.stringify(body),
		});
		
		const json: any = await resBody.json();
		
		if (!expected.includes(statusCode)) {
			const errCode = (json && json.code) ?? 'USERSERVICE_DOWN';
			const msg = (json && json.message) ?? 'UserService error';
			
			throw apiError(errCode, msg, statusCode as number);
		}
		
		return json as T;
	}
	const verifyPassword = async (body: AuthTypes.LoginRequest): Promise<number> => {
		const res = await call<{ userId: number }>('/internal/users/verify-password', body, [200]);
		return res.userId;
	};
	const createUser = async (body: UserTypes.CreateUserRequest): Promise<number> => {
		const res = await call<{ userId: number }>('/internal/users', body, [201]);
		return res.userId;
	};
	const getUserById = async (id: number): Promise<UserTypes.UserView> => {
		const {statusCode, body: resBody} = await request(`${baseUrl}/internal/users/${id}`, {
			method: 'GET',
			headers,
		});
		if (statusCode !== 200) throw apiError('USER_NOT_FOUND', 'User not found', statusCode);
		return (await resBody.json()) as UserTypes.UserView;
	};
	const findOrCreateOAuth = async (body: FindOrCreateOAuthBody): Promise<number> => {
		const {email, provider, providerUserId, username} = body;
		const {statusCode, body: resBody} = await request(`${baseUrl}/internal/users/${email}`, {
			method: 'GET',
			headers,
		});
		if (statusCode === 404) {
			// User not found, create a new one
			return await createUser(
				{
					email,
					password: '',
					username: username ?? email.split('@')[0], // Default username from email
					authProvider: provider,
					providerSub: providerUserId
				}).catch(err => {
				if (err.code === 'USER_ALREADY_EXISTS') {
					// If Username already exists, create a user with `username` and a random unique suffix
					body.username = `${username ?? email.split('@')[0]}-${Math.floor(Math.random() * 10000)}`;
					return findOrCreateOAuth(body);
				}
				throw err; });
		}
		else if (statusCode === 201) {
			const user = await resBody.json() as UserTypes.UserView;
			return user.id;
		}
		else {
			throw apiError('USER_NOT_FOUND', 'User not found', statusCode);
		}
	};
	
	return {
		verifyPassword,
		createUser,
		getUserById,
		findOrCreateOAuth
	}
}
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
