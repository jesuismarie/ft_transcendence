import type { FastifyInstance } from "fastify";
import { TournamentRepo } from "../../repositories/tournament.ts";
import { MatchRepo } from "../../repositories/match.ts";

interface DeleteTournamentRequestBody {
  tournament_id: number;
}

export default async function deleteTournamentRoute(app: FastifyInstance) {
  const tournamentRepo = new TournamentRepo(app);
  const matchRepo = new MatchRepo(app);

  app.delete("/delete-tournament", async (request, reply) => {
    const { tournament_id } = request.body as DeleteTournamentRequestBody;

    if (!tournament_id || tournament_id <= 0) {
      return reply.status(400).send({ message: "Invalid tournament_id" });
    }

    try {
      const tx = app.db.transaction((txn) => {
        const tournament = tournamentRepo.getById(tournament_id, txn);

        if (!tournament) {
          throw new Error("Tournament not found");
        }

        if (tournament.status !== "created") {
          throw new Error(
            "Only tournaments with status 'created' can be deleted"
          );
        }

        matchRepo.deleteMatchesByTournamentId(tournament_id, txn);
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
