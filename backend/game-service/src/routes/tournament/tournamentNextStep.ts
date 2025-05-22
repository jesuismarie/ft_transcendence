import type { FastifyInstance } from "fastify";
import { TournamentRepo } from "../../repositories/tournament.ts";
import { MatchRepo } from "../../repositories/match.ts";

interface NewMatch {
  id?: number; // Optional, as it will be auto-generated
  tournament_id: number;
  group_id: number;
  game_level: number;
  player_1: string;
  player_2: string;
  status: string;
}

export default async function tournamentNextStepRoute(app: FastifyInstance) {
  const tournamentRepo = new TournamentRepo(app);
  const matchRepo = new MatchRepo(app);

  app.post("/tournament-next-step", async (request, reply) => {
    const { tournament_id } = request.body as { tournament_id: number };

    // 1. Validate tournament_id
    if (!tournament_id || tournament_id <= 0) {
      return reply.status(400).send({ message: "Invalid tournament_id" });
    }

    const tournament = tournamentRepo.getById(tournament_id);
    if (!tournament) {
      return reply.status(404).send({ message: "Tournament not found" });
    }

    if (tournament.status !== "in_progress") {
      return reply
        .status(400)
        .send({ message: "Tournament is not in progress" });
    }

    // 2. Find the last ended match
    let allMatches = matchRepo.getTournamentMatches({
      tournament_id,
      limit: 100,
      offset: 0,
    }).matches;

    // Сортируем все матчи по id в порядке возрастания
    allMatches = allMatches.sort((a, b) => a.id - b.id);

    const endedMatches = allMatches.filter((match) => match.status === "ended");
    const lastEndedMatch =
      endedMatches.length > 0
        ? endedMatches.sort((a, b) => b.id - a.id)[0] // Сортировка строго по id
        : null;

    // Проверяем, является ли последний завершённый матч финальным
    if (lastEndedMatch && lastEndedMatch.game_level === 1) {
      return reply
        .status(400)
        .send({ message: "The tournament has already ended" });
    }

    // 3. Check if there is a match in progress
    const inProgressMatch = allMatches.find(
      (match) => match.status === "in_progress"
    );
    if (inProgressMatch) {
      return reply
        .status(400)
        .send({ message: "A match is already in progress" });
    }

    // 4. Find the next created match after the last ended match
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
      // Set the next match to in_progress
      const tx = app.db.transaction((txn) => {
        matchRepo.updateMatchStatus(nextMatch.id, "in_progress", txn); // Use updateMatchStatus
      }) as unknown as () => void;

      tx();

      return reply.status(200).send({
        match_id: nextMatch.id,
        player_1: nextMatch.player_1,
        player_2: nextMatch.player_2,
      });
    }

    // 5. Check if all matches in the current level are completed
    const currentGameLevel = Math.min(
      ...allMatches.map((match) => match.game_level)
    );
    const currentLevelMatches = allMatches.filter(
      (match) => match.game_level === currentGameLevel
    );

    if (currentLevelMatches.some((match) => match.status !== "ended")) {
      return reply
        .status(400)
        .send({ message: "Not all matches in the current level are finished" });
    }

    // 6. Create matches for the next level
    const winners = currentLevelMatches
      .map((match) => match.winner_username)
      .filter((username): username is string => Boolean(username));
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
          firstMatchId = createdMatchId; // Сохраняем id первого созданного матча
        }
      });

      // Устанавливаем статус "in_progress" для первого матча нового уровня
      if (firstMatchId) {
        matchRepo.updateMatchStatus(firstMatchId, "in_progress", txn);
      } else {
        throw new Error("Не удалось определить ID первого матча");
      }
    }) as unknown as () => void;

    tx();

    const firstMatch = newMatches[0];
    return reply.status(200).send({
      match_id: firstMatchId,
      player_1: firstMatch.player_1,
      player_2: firstMatch.player_2,
    });
  });
}
