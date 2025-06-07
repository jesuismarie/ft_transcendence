import type { FastifyInstance } from "fastify";
import { TournamentRepo } from "../../repositories/tournament";
import { MatchRepo } from "../../repositories/match";
import { TournamentPlayerRepo } from "../../repositories/tournamentPlayer";
import {deleteTournamentSchema} from "../../schemas/schemas";

interface DeleteTournamentRequestBody {
  tournament_id: number;
  created_by: number;
}

export default async function deleteTournamentRoute(app: FastifyInstance) {
  const tournamentRepo = new TournamentRepo(app);
  const matchRepo = new MatchRepo(app);
  const tournamentPlayerRepo = new TournamentPlayerRepo(app);

  app.delete("/delete-tournament",
      {
        schema: {
          body: deleteTournamentSchema,
        },
      },
      async (request, reply) => {
    const { tournament_id, created_by } =
      request.body as DeleteTournamentRequestBody;

    if (!tournament_id || tournament_id <= 0) {
      return reply.status(400).send({ message: "Invalid tournament_id" });
    }

    if (!created_by || created_by < 0) {
      return reply.status(400).send({ message: "Missing created_by field" });
    }

    try {
      const tx = app.db.transaction((txn) => {
        const tournament = tournamentRepo.getById(tournament_id, txn);

        if (!tournament) {
          throw new Error("Tournament not found");
        }

        if (tournament.created_by !== created_by) {
          throw new Error(
            "Only the tournament creator can delete the tournament"
          );
        }

        if (tournament.status !== "created") {
          throw new Error(
            "Only tournaments with status 'created' can be deleted"
          );
        }

        app.log.info(`Deleting tournament: ${tournament.name}`);

        matchRepo.deleteMatchesByTournamentId(tournament_id, txn);
        tournamentPlayerRepo.unregisterAllPlayers(tournament_id, txn); // Delete all players from the tournament
        tournamentRepo.deleteTournament(tournament_id, txn);
      }) as unknown as () => void;

      tx();

      return reply
        .status(200)
        .send({ message: "Tournament deleted successfully" });
    } catch (err) {
      app.log.error(err);
      const errorMessage =
        (err as Error).message || "Failed to delete tournament";
      return reply.status(400).send({ message: errorMessage });
    }
  });
}
