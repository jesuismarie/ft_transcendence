import type { FastifyInstance } from "fastify";
import type { Database } from "better-sqlite3";
import type { Status } from "../types/index.ts";

interface Match {
  id: number;
  player_1: number;
  player_2: number;
  winner: number | null;
  score_1: number;
  score_2: number;
  status: Status;
  game_level: number;
  group_id: number;
  tournament_id: number;
  started_at: string | null;
}

interface GetTournamentMatchesParams {
  tournament_id: number;
  limit: number;
  offset: number;
  statuses?: string[];
}

export class MatchRepo {
  private db: Database;

  constructor(app: FastifyInstance & { db: Database }) {
    this.db = app.db;
  }

  async createFriendlyMatch(
    data: { player_1: string; player_2: string },
    db?: Database
  ) {
    const database = db ?? this.db;
    const stmt = database.prepare(`
      INSERT INTO match (player_1, player_2, started_at)
      VALUES (?, ?, ?)
    `);
    stmt.run(data.player_1, data.player_2, new Date().toISOString());
  }

  createTournamentMatch(
    data: {
      tournament_id: number;
      group_id: number;
      game_level: number;
      player_1: number;
      player_2: number;
    },
    db?: Database
  ): number {
    const database = db ?? this.db;
    const stmt = database.prepare(`
      INSERT INTO match (
        tournament_id,
        group_id,
        game_level,
        player_1,
        player_2,
        status
      )
      VALUES (?, ?, ?, ?, ?, 'created')
      RETURNING id
    `);

    const result = stmt.get(
      data.tournament_id,
      data.group_id,
      data.game_level,
      data.player_1,
      data.player_2
    ) as { id: number };

    return result.id;
  }

  countUserMatchHistory(user_id: number): number {
    const stmt = this.db.prepare(`
      SELECT COUNT(*) as count
      FROM match
      WHERE 
        (player_1 = ? OR player_2 = ?)
        AND status IN ('ended', 'error')
    `);
    const row = stmt.get(user_id, user_id) as { count: number };
    return row.count;
  }

  getUserMatchHistory(
    user_id: number,
    limit: number,
    offset: number
  ): Match[] {
    const stmt = this.db.prepare(`
      SELECT 
        id,
        player_1,
        player_2,
        winner,
        score_1,
        score_2,
        started_at,
        group_id,
        game_level,
        tournament_id,
        status
      FROM match
      WHERE 
        (player_1 = ? OR player_2 = ?)
        AND status IN ('ended')
      ORDER BY id DESC
      LIMIT ? OFFSET ?
    `);

    return stmt.all(user_id, user_id, limit, offset) as Match[];
  }

  getTournamentMatches(params: GetTournamentMatchesParams): {
    totalCount: number;
    matches: Match[];
  } {
    const db = this.db;

    const { tournament_id, limit, offset, statuses } = params;

    const baseQuery = `
      SELECT 
        id AS id, 
        player_1,
        player_2,
        winner, 
        score_1, 
        score_2, 
        started_at, 
        status, 
        game_level, 
        group_id, 
        tournament_id
      FROM match
      WHERE tournament_id = ?
      ${
        statuses && statuses.length > 0
          ? `AND status IN (${statuses.map(() => "?").join(",")})`
          : ""
      }
      ORDER BY started_at DESC
      LIMIT ?
      OFFSET ?
    `;

    const countQuery = `
      SELECT COUNT(*) as count
      FROM match
      WHERE tournament_id = ?
      ${
        statuses && statuses.length > 0
          ? `AND status IN (${statuses.map(() => "?").join(",")})`
          : ""
      }
    `;

    const bindings = [tournament_id, ...(statuses || []), limit, offset];
    const countBindings = [tournament_id, ...(statuses || [])];

    const matches = db.prepare(baseQuery).all(...bindings) as Match[];
    const totalCountRow = db.prepare(countQuery).get(...countBindings) as {
      count: number;
    };

    return {
      totalCount: totalCountRow.count,
      matches: matches,
    };
  }

  getIncompleteTournamentMatchesWithPlayer(
    user_id: number,
    tournament_id: number,
    db: Database
  ): {
    id: number;
    player_1: number;
    player_2: number;
  }[] {
    const database = db ?? this.db;
    const stmt = database.prepare(`
      SELECT id, player_1, player_2
      FROM match
      WHERE tournament_id = ?
        AND (player_1 = ? OR player_2 = ?)
        AND status IN ('created', 'in_progress')
    `);

    return stmt.all(tournament_id, user_id, user_id) as {
      id: number;
      player_1: number;
      player_2: number;
    }[];
  }

  setMatchWinner(match_id: number, winner: number, db?: Database) {
    const database = db ?? this.db;
    const stmt = database.prepare(`
      UPDATE match
      SET winner = ?, status = 'ended'
      WHERE id = ?
    `);
    stmt.run(winner, match_id);
  }

  updateMatchResult(
    match_id: number,
    winner: number,
    score: { score_1: number; score_2: number },
    db?: Database
  ): void {
    const database = db ?? this.db;
    const stmt = database.prepare(`
      UPDATE match
      SET winner = ?, score_1 = ?, score_2 = ?, status = 'ended'
      WHERE id = ?
    `);
    stmt.run(winner, score.score_1, score.score_2, match_id);
  }

  updateMatchStatus(match_id: number, status: string, db?: Database): void {
    const database = db ?? this.db;
    const stmt = database.prepare(`
      UPDATE match
      SET status = ?
      WHERE id = ?
    `);
    stmt.run(status, match_id);
  }

  updateMatchStartedAt(
    match_id: number,
    started_at: string,
    db?: Database
  ): void {
    const database = db ?? this.db;
    const stmt = database.prepare(`
      UPDATE match
      SET started_at = ?
      WHERE id = ?
    `);
    stmt.run(started_at, match_id);
  }

  deleteMatchesByTournamentId(tournament_id: number, db?: Database): void {
    const database = db ?? this.db;
    const stmt = database.prepare(`
      DELETE FROM match WHERE tournament_id = ?
    `);
    stmt.run(tournament_id);
  }

  getById(match_id: number, db?: Database): Match | null {
    const database = db ?? this.db;
    const stmt = database.prepare(`
      SELECT * FROM match WHERE id = ?
    `);
    const row = stmt.get(match_id);
    return row ? (row as Match) : null;
  }

  getActiveMatchByTournamentId(tournamentId: number, db?: Database): Match {
    const database = db ?? this.db;
    const stmt = database.prepare(`
      SELECT
        id AS id,
        player_1,
        player_2,
        status,
        tournament_id
      FROM match
      WHERE tournament_id = ? AND status = 'in_progress'
      LIMIT 1
    `);
    return stmt.get(tournamentId) as Match;
  }
}