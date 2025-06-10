import type { FastifyInstance } from "fastify";
import { TournamentRepo } from "../../repositories/tournament";
import { MatchRepo } from "../../repositories/match";
import { TournamentPlayerRepo } from "../../repositories/tournamentPlayer";
import {tournamentNextStepSchema} from "../../schemas/schemas";

interface NewMatch {
  id?: number; // Optional, as it will be auto-generated
  tournament_id: number;
  group_id: number;
  game_level: number;
  player_1: number;
  player_2: number;
  status: string;
}

interface TournamentNextStepRequestBody {
  id: number;
}

interface TournamentNextStepResponse {
  match_id?: number;
  player_1?: number;
  player_2?: number;
  participants?: number[];
  status: string;
}

export default async function tournamentNextStepRoute(app: FastifyInstance) {
  const tournamentRepo = new TournamentRepo(app);
  const matchRepo = new MatchRepo(app);
  const tournamentPlayerRepo = new TournamentPlayerRepo(app);

  app.post<{
    Body: { id: number };
    Reply: TournamentNextStepResponse | { message: string };
  }>("/tournament-next-step",
      {
        schema: {
          body: tournamentNextStepSchema,
        },
      },
      async (request, reply) => {
    const { id: tournament_id } = request.body as TournamentNextStepRequestBody;

    if (!tournament_id || tournament_id <= 0) {
      return reply.sendError({ statusCode: 400, message: "Invalid tournament_id" });
    }

    const tournament = tournamentRepo.getById(tournament_id);
    if (!tournament) {
      return reply.sendError({ statusCode: 404, message: "Tournament not found" });
    }

    if (tournament.status === "ended") {
      return reply.status(200).send({
        status: "ended",
      });
    }
    if (tournament.status !== "in_progress") {
      return reply.sendError({ statusCode: 400, message: "Tournament is not in progress" });
    }

    let allMatches = matchRepo.getTournamentMatches({
      tournament_id,
      limit: 100,
      offset: 0,
    }).matches;

    allMatches = allMatches.sort((a, b) => a.id - b.id);

    const endedMatches = allMatches.filter((match) => match.status === "ended");
    const lastEndedMatch =
      endedMatches.length > 0
        ? endedMatches.sort((a, b) => b.id - a.id)[0] // Сортировка строго по id
        : null;

    const inProgressMatch = allMatches.find(
      (match) => match.status === "in_progress"
    );
    if (inProgressMatch) {
      return reply.sendError({ statusCode: 400, message: "Match already in progress" });
    }

    const nextMatch = allMatches.find((match) => {
      const isCreated = match.status === "created";
      const isAfterLastEnded = !lastEndedMatch || match.id > lastEndedMatch.id;

      console.log(
        `Checking match id=${match.id}, status=${match.status}, isCreated=${isCreated}, isAfterLastEnded=${isAfterLastEnded}`
      );

      return isCreated && isAfterLastEnded;
    });

    console.log("Next match:", nextMatch);
    if (nextMatch) {
      const tx = app.db.transaction((txn) => {
        matchRepo.updateMatchStatus(nextMatch.id, "in_progress", txn);
        const startedAt = new Date().toISOString();
        matchRepo.updateMatchStartedAt(nextMatch.id, startedAt, txn); // Устанавливаем started_at
      }) as unknown as () => void;

      tx();

      const tournamentParticipants =
        tournamentPlayerRepo.getPlayersByTournament(tournament_id);

      return reply.status(200).send({
        match_id: nextMatch.id,
        player_1: nextMatch.player_1,
        player_2: nextMatch.player_2,
        participants: tournamentParticipants,
        status: tournament.status,
      });
    }

    const currentGameLevel = Math.min(
      ...allMatches.map((match) => match.game_level)
    );
    const currentLevelMatches = allMatches.filter(
      (match) => match.game_level === currentGameLevel
    );

    if (currentLevelMatches.some((match) => match.status !== "ended")) {
      return reply.sendError({ statusCode: 400, message: "Not all matches in the current level are finished" });
    }

    const winners = currentLevelMatches
      .map((match) => match.winner)
      .filter((number): number is number => Boolean(number));
    const nextLevel = currentGameLevel / 2;
    const newMatches: NewMatch[] = [];

    for (let i = 0; i < winners.length; i += 2) {
      const player1 = winners[i];
      const player2 = winners[i + 1];
      const groupId = Math.floor(i / 4) + 1;
      newMatches.push({
        tournament_id,
        group_id: groupId,
        game_level: nextLevel,
        player_1: player1,
        player_2: player2,
        status: "created",
      });
    }

    let firstMatchId: number | undefined;

    const tx = app.db.transaction((txn) => {
      newMatches.forEach((match) => {
        const createdMatchId = matchRepo.createTournamentMatch(match, txn);
        if (!firstMatchId) {
          firstMatchId = createdMatchId;
        }
      });

      if (firstMatchId) {
        matchRepo.updateMatchStatus(firstMatchId, "in_progress", txn);
        const startedAt = new Date().toISOString();
        matchRepo.updateMatchStartedAt(firstMatchId, startedAt, txn);
      } else {
        throw new Error("Не удалось определить ID первого матча");
      }
    }) as unknown as () => void;

    tx();

    const firstMatch = newMatches[0];
    const tournamentParticipants =
      tournamentPlayerRepo.getPlayersByTournament(tournament_id);

    return reply.status(200).send({
      match_id: firstMatchId,
      player_1: firstMatch.player_1,
      player_2: firstMatch.player_2,
      participants: tournamentParticipants,
      status: tournament.status,
    });
  });
}
