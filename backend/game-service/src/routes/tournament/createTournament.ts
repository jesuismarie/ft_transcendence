import type { FastifyInstance } from "fastify";
import { TournamentRepo } from "../../repositories/tournament";
import { TournamentPlayerRepo } from "../../repositories/tournamentPlayer";
import {createTournamentSchema} from "../../schemas/schemas";

export interface CreateTournamentRequestBody {
  name: string;
  max_players_count: number;
  created_by: number;
}

export default async function createTournamentRoute(app: FastifyInstance) {
  const tournamentRepo = new TournamentRepo(app);
  const tournamentPlayerRepo = new TournamentPlayerRepo(app);

  app.post("/create-tournament", {
    schema: {
      body: createTournamentSchema,
    },
  },
      async (request, reply) => {
    const { name, max_players_count, created_by } =
      request.body as CreateTournamentRequestBody;

    if (!name || name.trim().length === 0) {
      return reply.status(400).send({ message: "Tournament name is required" });
    }

    if (created_by < 0) {
      return reply.status(400).send({
        message: "creator id must be greater than 0",
      })
    }

    if (![2, 4, 8, 16].includes(max_players_count)) {
      return reply.status(400).send({
        message: "max_players_count must be one of the following: 2, 4, 8, 16",
      });
    }

    // Check if the creator is already registered in another active tournament
    const isCreatorInActiveTournament =
      tournamentPlayerRepo.isPlayerInAnyActiveTournament(created_by);
    if (isCreatorInActiveTournament) {
      return reply.status(400).send({
        message:
          "Creator is already registered in another active tournament and cannot create a new one.",
      });
    }

    // Check if the creator already has an active tournament they created
    const existingTournament =
      tournamentRepo.checkIsActiveTournamentByUsername(created_by);
    if (existingTournament) {
      return reply.status(400).send({
        message:
          "A tournament created by this user already exists in 'created' or 'in_progress' status.",
      });
    }

    try {
      // Create a new tournament and get its ID and name
      const { id, name: tournamentName } = tournamentRepo.createTournament({
        name,
        maxPlayersCount: max_players_count,
        createdBy: created_by,
      });

      // Automatically register the creator in the tournament
      tournamentRepo.registerPlayerToTournament(id, created_by);

      return reply.status(201).send({
        message: "Tournament created successfully",
        tournament_id: id,
        name: tournamentName,
      });
    } catch (err) {
      app.log.error(err);
      return reply.status(500).send({ message: "Error creating tournament" });
    }
  });
}
