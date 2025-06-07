import type { FastifyInstance } from "fastify";
import { TournamentRepo } from "../../repositories/tournament";
import { TournamentPlayerRepo } from "../../repositories/tournamentPlayer";
import type { Tournament } from "../../types/index";
import {getTournamentsInfoSchema} from "../../schemas/schemas";

interface GetTournamentsInfoRequest {
  limit?: number;
  offset?: number;
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
    const { limit = 50, offset = 0 } =
      request.query as GetTournamentsInfoRequest;

    try {
      const tournaments = tournamentRepo.getAllCreated(
        limit,
        offset
      ) as Tournament[];
      const totalCount = tournamentRepo.countAllCreated();
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
      return reply
        .status(500)
        .send({ message: "Failed to fetch tournaments info" });
    }
  });
}
