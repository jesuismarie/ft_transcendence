// A minimalist http client for communicating with the game service
import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { request } from 'undici';
import { Dispatcher } from "undici";

interface GamestatsRequest {
	Params: { username: string };
}

interface GamestatsResponse {
	username: string;
	wins: number;
	losses: number;
}

export interface GameServiceClientConfig {
	baseUrl: string;
	timeout?: number;
}

interface GameServiceClient {
	getGamestats: (request: GamestatsRequest) => Promise<GamestatsResponse>;
}

const buildClient = ({ baseUrl, timeout }: GameServiceClientConfig): GameServiceClient => {
	const headers = {
		'content-type': 'application/json',
	} as const;
	
	/** helper — wraps undici.request with JSON encode/decode + error mapping */
	async function call<T>(method: Dispatcher.HttpMethod | undefined, path: string, body: unknown, expected: number[]): Promise<T> {
		const {statusCode, body: resBody} = await request(`${baseUrl}${path}`, {
			method: method,
			headers,
			body: JSON.stringify(body),
			bodyTimeout: 1
		});
		const json: any = await resBody.json();
		
		if (!expected.includes(statusCode)) {
			const errCode = (json && json.code) ?? 'GAMESERVICE_DOWN';
			const msg = (json && json.message) ?? 'GameService error';
			
			throw {statusCode: 'error', error: errCode, message: msg};
		}
		
		return json as T;
	}
	
	const getGamestats = async (request: GamestatsRequest): Promise<GamestatsResponse> => {
		const { username } = request.Params;
		const path = `internal/gamestats/${username}`;
		const res = await call<GamestatsResponse>('GET', path, undefined, [200]);
		return {username: res.username, wins: res.wins, losses: res.losses};
	}

	return {
		getGamestats
	}
}
// ────────────────────────────────────────────────────────────────────────────
// Fastify plugin – decorates app with userService client instance
// ────────────────────────────────────────────────────────────────────────────

declare module 'fastify' {
	interface FastifyInstance {
		gameService: GameServiceClient;
	}
}

const gameServiceClientPlugin: FastifyPluginAsync = async (app : FastifyInstance) => {
	const baseUrl = process.env.GAME_SERVICE_URL ?? 'http://game-service:5004';
	
	app.decorate('gameService', buildClient({ baseUrl, timeout: 3000}));
};

export default fp(gameServiceClientPlugin, {
	name: 'game-service-client'
});