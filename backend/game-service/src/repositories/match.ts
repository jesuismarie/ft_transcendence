import type { FastifyInstance } from "fastify";
import type { Database } from "better-sqlite3";

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
}
