import { FastifyInstance } from "fastify";
import { TournamentRepo } from "../../repositories/tournament";
import { MatchRepo } from "../../repositories/match";
import {getTournamentActiveMatchSchema} from "../../schemas/schemas";

interface GetTournamentActiveMatchResponse {
    match_id: number;
    tournament_id: number;
    status: string;
    player1: number;
    player2: number;
}

export async function getTournamentActiveMatchRoute(app: FastifyInstance) {
  const tournamentRepo = new TournamentRepo(app);
  const matchRepo = new MatchRepo(app);

  app.get("/get-tournament-active-match/:id", {
    schema: {
      params: getTournamentActiveMatchSchema
    },
    handler: async (request, reply) => {
      const { id } = request.params as { id: number };

      const tournament = tournamentRepo.getById(id);
      console.log(tournament);
      if (!tournament || tournament.status !== "in_progress") {
        return reply.sendError({ statusCode: 404, message: "Tournament not found or not active" });
      }

      const match = matchRepo.getActiveMatchByTournamentId(id);
      if (!match) {
        return reply.sendError({ statusCode: 404, message: "No active match found for this tournament" });
      }

      return reply.send({
        match_id: match.id,
        tournament_id: match.tournament_id,
        status: match.status,
        player1: match.player_1,
        player2: match.player_2,
      } as GetTournamentActiveMatchResponse);
    },
  });
}
