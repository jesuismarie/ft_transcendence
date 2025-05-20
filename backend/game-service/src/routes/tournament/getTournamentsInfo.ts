import type { FastifyInstance } from "fastify";
import { TournamentRepo } from "../../repositories/tournament.ts";
import { TournamentPlayerRepo } from "../../repositories/tournamentPlayer.ts";

interface GetTournamentsInfoRequest {
  tournament_id?: number;
}

interface TournamentInfo {
  id: number;
  name: string;
  created_by: string;
  max_players_count: number;
  current_players_count: number;
  status: string;
  participants: string[];
}

export default async function getTournamentsInfoRoute(app: FastifyInstance) {
  const tournamentRepo = new TournamentRepo(app);
  const tournamentPlayerRepo = new TournamentPlayerRepo(app);

  app.post("/get-tournaments-info", async (request, reply) => {
    const { tournament_id } = request.body as GetTournamentsInfoRequest;

    try {
      if (tournament_id) {
        const tournament = tournamentRepo.getById(tournament_id);
        if (!tournament) {
          return reply.status(404).send({ message: "Tournament not found" });
        }

        const participants =
          tournamentPlayerRepo.getPlayersByTournament(tournament_id);

        const tournamentInfo: TournamentInfo = {
          ...tournament,
          participants,
        };

        return reply.status(200).send([tournamentInfo]);
      } else {
        const tournaments = tournamentRepo.getAll();
        const tournamentsInfo: TournamentInfo[] = tournaments.map(
          (tournament) => {
            const participants = tournamentPlayerRepo.getPlayersByTournament(
              tournament.id
            );
            return {
              ...tournament,
              participants,
            };
          }
        );

        return reply.status(200).send(tournamentsInfo);
      }
    } catch (err) {
      app.log.error(err);
      return reply
        .status(500)
        .send({ message: "Failed to fetch tournaments info" });
    }
  });
}
