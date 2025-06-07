import type { FastifyInstance } from "fastify";
import { TournamentRepo } from "../../repositories/tournament";
import { TournamentPlayerRepo } from "../../repositories/tournamentPlayer";
import {registerToTournamentSchema} from "../../schemas/schemas";

interface RegisterRequestBody {
  user_id: number;
  tournament_id: number;
}

export default async function registerToTournamentRoute(app: FastifyInstance) {
  const tournamentRepo = new TournamentRepo(app);
  const tournamentPlayerRepo = new TournamentPlayerRepo(app);

  app.post("/register-to-tournament",
      {
        schema: {
          body: registerToTournamentSchema,
        },
      },
      async (request, reply) => {
    const { user_id, tournament_id } = request.body as RegisterRequestBody;

    if (!user_id || !tournament_id || tournament_id <= 0) {
      return reply
        .status(400)
        .send({ message: "Invalid user_id or tournament_id" });
    }

    if (user_id < 0) {
      return reply.status(400).send({message: "user_id must be greater than zero"})
    }

    const isAlreadyInActiveTournament = tournamentPlayerRepo.isPlayerInAnyActiveTournament(user_id);
    if (isAlreadyInActiveTournament) {
      return reply.status(400).send({
        message: "User is already registered in another active tournament",
      });
    }

    try {
      tournamentRepo.registerPlayerToTournament(tournament_id, user_id);
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
