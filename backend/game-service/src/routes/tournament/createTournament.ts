import type { FastifyInstance } from "fastify";
import { TournamentRepo } from "../../repositories/tournament.ts";

export interface CreateTournamentRequestBody {
  maxPlayersCount: number;
  createdBy: number;
}

export default async function createTournamentRoute(app: FastifyInstance) {
  const tournamentRepo = new TournamentRepo(app);

  app.post("/create-tournament", async (request, reply) => {
    const { maxPlayersCount, createdBy } =
      request.body as CreateTournamentRequestBody;

    // Валидация maxPlayersCount
    if (![4, 8, 16].includes(maxPlayersCount)) {
      return reply.status(400).send({
        message: "maxPlayersCount must be one of the following: 4, 8, 16",
      });
    }

    // Проверка, есть ли турнир с таким createdBy и статусом 'created' или 'in_progress'
    const existingTournament =
      await tournamentRepo.checkIsActiveTournamentByUserId(createdBy);
    if (existingTournament) {
      return reply.status(400).send({
        message:
          "A tournament with this createdBy already exists in 'created' or 'in_progress' status.",
      });
    }

    try {
      // Создаем новый турнир
      await tournamentRepo.createTournament({
        maxPlayersCount,
        createdBy,
      });

      return reply
        .status(201)
        .send({ message: "Tournament created successfully" });
    } catch (err) {
      app.log.error(err);
      return reply.status(500).send({ message: "Error creating tournament" });
    }
  });
}
