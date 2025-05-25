import type { FastifyInstance } from "fastify";
import { TournamentRepo } from "../../repositories/tournament";
import { TournamentPlayerRepo } from "../../repositories/tournamentPlayer";

interface RegisterRequestBody {
  username: string;
  tournament_id: number;
}

export default async function registerToTournamentRoute(app: FastifyInstance) {
  const tournamentRepo = new TournamentRepo(app);
  const tournamentPlayerRepo = new TournamentPlayerRepo(app);

  app.post("/register-to-tournament", async (request, reply) => {
    const { username, tournament_id } = request.body as RegisterRequestBody;

    if (!username || !tournament_id || tournament_id <= 0) {
      return reply
        .status(400)
        .send({ message: "Invalid username or tournament_id" });
    }

    const isAlreadyInActiveTournament =
      await tournamentPlayerRepo.isPlayerInAnyActiveTournament(username);
    if (isAlreadyInActiveTournament) {
      return reply.status(400).send({
        message: "User is already registered in another active tournament",
      });
    }

    try {
      await tournamentRepo.registerPlayerToTournament(tournament_id, username);
      return reply
        .status(201)
        .send({ message: "User registered to tournament" });
    } catch (err: any) {
      app.log.error(err);
      return reply
        .status(400)
        .send({ message: err.message || "Registration failed" });
    }
  });
}
