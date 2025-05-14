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

  async getById(id: number): Promise<{
    id: number;
    max_players_count: number;
    current_players_count: number;
    status: Status;
  } | null> {
    const stmt = this.app.db.prepare(`
      SELECT id, max_players_count, current_players_count, status
      FROM tournament
      WHERE id = ?
    `);
    const row = stmt.get(id);
    return row ? (row as any) : null;
  }

  private getByIdForUpdate(tournament_id: number): {
    id: number;
    max_players_count: number;
    current_players_count: number;
    status: Status;
  } | null {
    const stmt = this.app.db.prepare(`
      SELECT id, max_players_count, current_players_count, status
      FROM tournament
      WHERE id = ?
    `);
    const row = stmt.get(tournament_id);
    return row ? (row as any) : null;
  }

  private incrementPlayerCount(tournament_id: number): void {
    this.app.db
      .prepare(
        `
      UPDATE tournament
      SET current_players_count = current_players_count + 1
      WHERE id = ?
    `
      )
      .run(tournament_id);
  }

  registerPlayerToTournament(tournament_id: number, user_id: number): void {
    const tx = this.app.db.transaction(() => {
      const tournament = this.getByIdForUpdate(tournament_id);
      if (
        !tournament ||
        tournament.status !== "created" ||
        tournament.current_players_count >= tournament.max_players_count
      ) {
        throw new Error("Tournament is not available for registration");
      }

      this.insertPlayer(tournament_id, user_id);
      this.incrementPlayerCount(tournament_id);
    });

    tx();
  }

  private insertPlayer(tournament_id: number, user_id: number): void {
    this.app.db
      .prepare(
        `
      INSERT INTO tournament_player (tournament_id, player_id)
      VALUES (?, ?)
    `
      )
      .run(tournament_id, user_id);
  }

  // Уменьшает счётчик текущих игроков
  async decrementPlayerCount(tournament_id: number): Promise<void> {
    const stmt = this.app.db.prepare(
      `UPDATE tournament SET current_players_count = current_players_count - 1 WHERE id = ?`
    );
    stmt.run(tournament_id);
  }
}
