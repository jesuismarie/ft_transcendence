import type { FastifyInstance } from "fastify";
import type { Database } from "better-sqlite3";

interface RawMatch {
  id: number;
  player_1: number;
  player_2: number;
  score_1: number;
  score_2: number;
  started_at: string;
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
    data: { player_1: number; player_2: number },
    db?: Database
  ) {
    const database = db ?? this.db;
    const stmt = database.prepare(`
      INSERT INTO match (player_1, player_2, started_at)
      VALUES (?, ?, ?)
    `);
    stmt.run(data.player_1, data.player_2, new Date().toISOString());
  }

  async createTournamentMatch(
    data: {
      tournament_id: number;
      group_id: number;
      game_level: number;
      player_1: number;
      player_2: number;
    },
    db?: Database
  ) {
    const database = db ?? this.db;
    const stmt = database.prepare(`
      INSERT INTO match (
        tournament_id,
        group_id,
        game_level,
        player_1,
        player_2
      )
      VALUES (?, ?, ?, ?, ?)
    `);

    stmt.run(
      data.tournament_id,
      data.group_id,
      data.game_level,
      data.player_1,
      data.player_2
    );
  }

  countUserMatchHistory(user_id: number): number {
    const stmt = this.db.prepare(`
      SELECT COUNT(*) as count
      FROM match
      WHERE 
        (player_1 = ? OR player_2 = ?)
        AND tournament_id IS NULL
        AND status IN ('ended', 'error')
    `);
    const row = stmt.get(user_id, user_id) as { count: number };
    return row.count;
  }

  getUserMatchHistory(
    user_id: number,
    limit: number,
    offset: number
  ): RawMatch[] {
    const stmt = this.db.prepare(`
      SELECT 
        id,
        player_1,
        player_2,
        score_1,
        score_2,
        started_at
      FROM match
      WHERE 
        (player_1 = ? OR player_2 = ?)
        AND tournament_id IS NULL
        AND status IN ('ended', 'error')
      ORDER BY started_at DESC
      LIMIT ? OFFSET ?
    `);

    return stmt.all(user_id, user_id, limit, offset) as RawMatch[];
  }

  getTournamentMatches(params: GetTournamentMatchesParams): {
    totalCount: number;
    matches: {
      match_id: number;
      player_1: number;
      player_2: number;
      score_1: number;
      score_2: number;
      started_at: string;
      status: string;
      game_level: number;
      tournament_id: number;
    }[];
  } {
    const db = this.db;

    const { tournament_id, limit, offset, statuses } = params;

    const baseQuery = `
      SELECT id AS match_id, player_1, player_2, score_1, score_2, started_at, status, game_level, tournament_id
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

    const matches = db.prepare(baseQuery).all(...bindings) as any[];
    const totalCountRow = db.prepare(countQuery).get(...countBindings) as {
      count: number;
    };

    return {
      totalCount: totalCountRow.count,
      matches: matches.map((match) => ({
        match_id: match.match_id,
        player_1: match.player_1,
        player_2: match.player_2,
        score_1: match.score_1,
        score_2: match.score_2,
        started_at: match.started_at,
        status: match.status,
        game_level: match.game_level,
        tournament_id: match.tournament_id,
      })),
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

  setMatchWinner(match_id: number, winner_id: number, db: Database) {
    const database = db ?? this.db;
    const stmt = database.prepare(`
      UPDATE match
      SET winner_id = ?, status = 'ended'
      WHERE id = ?
    `);
    stmt.run(winner_id, match_id);
  }
}
