import type { FastifyInstance } from "fastify";
import { TournamentRepo } from "../../repositories/tournament";
import { TournamentPlayerRepo } from "../../repositories/tournamentPlayer";
import {getTournamentParticipantsSchema} from "../../schemas/schemas";

interface GetTournamentParticipantsQuery {
  id: number;
}

interface GetTournamentParticipantsResponse {
  maxPlayersCount: number;
  currentPlayersCount: number;
  participants: number[];
}

export default async function getTournamentParticipantsRoute(
  app: FastifyInstance
) {
  const tournamentRepo = new TournamentRepo(app);
  const tournamentPlayerRepo = new TournamentPlayerRepo(app);

  app.get("/get-tournament-participants",
      {
        schema: {
          querystring: getTournamentParticipantsSchema,
        },
      },
      async (request, reply) => {
    const { id } = request.query as GetTournamentParticipantsQuery;

    if (!id || id <= 0) {
      return reply.sendError({ statusCode: 400, message: "Invalid tournament ID" });
    }

    try {
      const tournament = tournamentRepo.getById(id);
      if (!tournament) {
        return reply.sendError({ statusCode: 404, message: "Tournament not found" });
      }

      const participants = tournamentPlayerRepo.getPlayersByTournament(id);

      const response: GetTournamentParticipantsResponse = {
        maxPlayersCount: tournament.max_players_count,
        currentPlayersCount: tournament.current_players_count,
        participants,
      };

      return reply.status(200).send(response);
    } catch (err) {
      app.log.error(err);
      return reply.sendError({ statusCode: 500, message: "Failed to fetch participants" });
    }
  });
}
