import type { FastifyInstance } from "fastify";
import { TournamentRepo } from "../../repositories/tournament.ts";

export interface CreateTournamentRequestBody {
  max_players_count: number;
  created_by: number;
}

export default async function createTournamentRoute(app: FastifyInstance) {
  const tournamentRepo = new TournamentRepo(app);

  app.post("/create-tournament", async (request, reply) => {
    const { max_players_count, created_by } =
      request.body as CreateTournamentRequestBody;

    // Валидация max_players_count
    if (![4, 8, 16].includes(max_players_count)) {
      return reply.status(400).send({
        message: "max_players_count must be one of the following: 4, 8, 16",
      });
    }

    // Проверка, есть ли турнир с таким created_by и статусом 'created' или 'in_progress'
    const existingTournament =
      await tournamentRepo.checkIsActiveTournamentByUserId(created_by);
    if (existingTournament) {
      return reply.status(400).send({
        message:
          "A tournament with this created_by already exists in 'created' or 'in_progress' status.",
      });
    }

    try {
      // Создаем новый турнир
      await tournamentRepo.createTournament({
        maxPlayersCount: max_players_count,
        createdBy: created_by,
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
