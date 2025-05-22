import type { FastifyInstance } from "fastify";
import { TournamentRepo } from "../../repositories/tournament.ts";
import { TournamentPlayerRepo } from "../../repositories/tournamentPlayer.ts";
import type { Tournament } from "../../types/index.ts";

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
  winner?: string; // Добавлено поле winner
}

export default async function getTournamentsInfoRoute(app: FastifyInstance) {
  const tournamentRepo = new TournamentRepo(app);
  const tournamentPlayerRepo = new TournamentPlayerRepo(app);

  app.post("/get-tournaments-info", async (request, reply) => {
    const { tournament_id } = request.body as GetTournamentsInfoRequest;

    try {
      if (tournament_id) {
        const tournament = tournamentRepo.getById(
          tournament_id
        ) as Tournament | null; // Явно указываем тип
        if (!tournament) {
          return reply.status(404).send({ message: "Tournament not found" });
        }

        const participants =
          tournamentPlayerRepo.getPlayersByTournament(tournament_id);

        const tournamentInfo: TournamentInfo = {
          ...tournament,
          participants,
          winner: tournament.winner ?? undefined, // Преобразуем null в undefined
        };

        return reply.status(200).send([tournamentInfo]);
      }

      // If no tournament_id is provided, return all tournaments
      const tournaments = tournamentRepo.getAll() as Tournament[]; // Явно указываем тип
      const tournamentsInfo: TournamentInfo[] = tournaments.map(
        (tournament) => {
          const participants = tournamentPlayerRepo.getPlayersByTournament(
            tournament.id
          );
          return {
            ...tournament,
            participants,
            winner: tournament.winner ?? undefined, // Преобразуем null в undefined
          };
        }
      );

      return reply.status(200).send(tournamentsInfo);
    } catch (err) {
      app.log.error(err);
      return reply
        .status(500)
        .send({ message: "Failed to fetch tournaments info" });
    }
  });
}
