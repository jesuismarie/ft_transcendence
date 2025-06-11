import { FastifyInstance } from "fastify";
import { matches } from "../game/state";
import {Match} from "../types";

// Create match route will add a new match to the matches array
export default async function createMatchRoute(app: FastifyInstance) {
	app.post<{Body: Match}>('/create-match',
		{
			schema: {
				body: {
					type: 'object',
					properties: {
						player1_id: {type: 'string'},
						player2_id: {type: 'string'},
						match_id: {type: 'string'}
					},
					required: ['player1_id', 'player2_id', 'match_id']
				},
			},
		},
		async (request, reply) => {
		matches.push(request.body);
		reply.status(201).send({"modified": true});
	});
}