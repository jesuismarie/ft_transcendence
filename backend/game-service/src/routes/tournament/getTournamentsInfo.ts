import type { FastifyInstance } from "fastify";
import { TournamentRepo } from "../../repositories/tournament";
import { TournamentPlayerRepo } from "../../repositories/tournamentPlayer";
import type { Tournament } from "../../types/index";
import {getTournamentsInfoSchema} from "../../schemas/schemas";

interface GetTournamentsInfoRequest {
  limit?: number;
  offset?: number;
  status?: string[];
}

interface GetTournamentsInfoResponse {
  totalCount: number;
  tournaments: TournamentInfo[];
}

interface TournamentInfo {
  id: number;
  name: string;
  created_by: number;
  max_players_count: number;
  current_players_count: number;
  status: string;
  participants: number[];
}

export default async function getTournamentsInfoRoute(app: FastifyInstance) {
  const tournamentRepo = new TournamentRepo(app);
  const tournamentPlayerRepo = new TournamentPlayerRepo(app);

  app.get("/get-tournaments-info",
      {
        schema: {
          querystring: getTournamentsInfoSchema,
        },
      },
      async (request, reply) => {
    const { limit = 50, offset = 0, status } =
      request.query as GetTournamentsInfoRequest;

    try {
      let tournaments: Tournament[];
      let totalCount: number;

      if (status && Array.isArray(status) && status.length > 0) {
        tournaments = tournamentRepo.getAllByStatuses(status, limit, offset) as Tournament[];
        totalCount = tournamentRepo.countAllByStatuses(status);
      } else {
        tournaments = tournamentRepo.getAll(limit, offset) as Tournament[];
        totalCount = tournamentRepo.countAll();
      }

      const tournamentsInfo = tournaments.map((tournament) => {
        const participants = tournamentPlayerRepo.getPlayersByTournament(
          tournament.id
        );
        return {
          ...tournament,
          participants,
        };
      });

      const response: GetTournamentsInfoResponse = {
        totalCount,
        tournaments: tournamentsInfo,
      };

      return reply.status(200).send(response);
    } catch (err) {
      app.log.error(err);
      return reply.sendError({ statusCode: 500, message: "Failed to fetch tournaments info" });
    }
  });
}