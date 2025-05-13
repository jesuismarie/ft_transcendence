import type { FastifyInstance } from "fastify";
import type { Status } from "../types/index.ts";

export class TournamentRepo {
  private app: FastifyInstance;

  constructor(app: FastifyInstance) {
    this.app = app;
  }

  async exists(id: number): Promise<boolean> {
    const stmt = this.app.db.prepare(`SELECT 1 FROM tournament WHERE id = ?`);
    return !!stmt.get(id);
  }

  async getStatus(id: number): Promise<Status | null> {
    const stmt = this.app.db.prepare(
      `SELECT status FROM tournament WHERE id = ?`
    );
    const row = stmt.get(id) as { status: Status } | undefined;
    return row ? row.status : null;
  }

  async checkIsActiveTournamentByUserId(createdBy: number): Promise<boolean> {
    const stmt = this.app.db.prepare(
      `SELECT 1 FROM tournament WHERE created_by = ? AND status IN ('created', 'in_progress')`
    );
    const row = stmt.get(createdBy);
    return row ? true : false;
  }

  async createTournament(data: { maxPlayersCount: number; createdBy: number }) {
    const { maxPlayersCount, createdBy } = data;

    const stmt = this.app.db.prepare(`
      INSERT INTO tournament (max_players_count, current_players_count, status, created_by)
      VALUES (?, 0, 'created', ?)
    `);
    stmt.run(maxPlayersCount, createdBy);
  }
}
