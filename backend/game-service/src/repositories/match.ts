import type { FastifyInstance } from "fastify";

export class MatchRepo {
  private app: FastifyInstance;

  constructor(app: FastifyInstance) {
    this.app = app;
  }

  async createFriendlyMatch(data: { player_1: number; player_2: number }) {
    const stmt = this.app.db.prepare(`
      INSERT INTO match (player_1, player_2, started_at)
      VALUES (?, ?, ?)
    `);
    stmt.run(data.player_1, data.player_2, new Date().toISOString());
  }

  async createTournamentMatch(data: {
    player_1: number;
    player_2: number;
    tournament_id: number;
    group_id: number;
    gameLevel: number;
  }) {
    const stmt = this.app.db.prepare(`
      INSERT INTO match (player_1, player_2, tournament_id, group_id, gameLevel, started_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      data.player_1,
      data.player_2,
      data.tournament_id,
      data.group_id,
      data.gameLevel,
      new Date().toISOString()
    );
  }
}
