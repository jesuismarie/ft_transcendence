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
}
