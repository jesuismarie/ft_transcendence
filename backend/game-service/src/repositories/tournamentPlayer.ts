import type { FastifyInstance } from "fastify";
import type { Database } from "better-sqlite3";

export class TournamentPlayerRepo {
  private db: Database;

  constructor(app: FastifyInstance & { db: Database }) {
    this.db = app.db;
  }

  isPlayerInTournament(
    user_id: number,
    tournamentId: number,
    db?: Database
  ): boolean {
    const database = db ?? this.db;
    const stmt = database.prepare(`
      SELECT 1 FROM tournament_player WHERE user_id = ? AND tournament_id = ?
    `);
    return !!stmt.get(user_id, tournamentId);
  }

  isPlayerInAnyActiveTournament(user_id: number, db?: Database): boolean {
    const database = db ?? this.db;
    const stmt = database.prepare(`
      SELECT 1
      FROM tournament_player tp
      JOIN tournament t ON tp.tournament_id = t.id
      WHERE tp.user_id = ?
        AND t.status IN ('created', 'in_progress')
      LIMIT 1
    `);
    const result = stmt.get(user_id);
    return !!result;
  }

  unregister(user_id: number, tournament_id: number, db?: Database): void {
    const database = db ?? this.db;
    database
      .prepare(
        `DELETE FROM tournament_player WHERE user_id = ? AND tournament_id = ?`
      )
      .run(user_id, tournament_id);
  }

  getPlayersByTournament(tournament_id: number, db?: Database): number[] {
    const database = db ?? this.db;
    const stmt = database.prepare(`
      SELECT user_id FROM tournament_player WHERE tournament_id = ?
    `);
    const rows = stmt.all(tournament_id) as { user_id: number }[];
    return rows.map((row) => row.user_id);
  }

  incrementWins(user_id: number, tournament_id: number, db?: Database) {
    const database = db ?? this.db;
    const stmt = database.prepare(`
      UPDATE tournament_player
      SET wins = wins + 1
      WHERE user_id = ? AND tournament_id = ?
    `);
    stmt.run(user_id, tournament_id);
  }

  incrementLosses(user_id: number, tournament_id: number, db?: Database) {
    const database = db ?? this.db;
    const stmt = database.prepare(`
      UPDATE tournament_player
      SET losses = losses + 1
      WHERE user_id = ? AND tournament_id = ?
    `);
    stmt.run(user_id, tournament_id);
  }

  unregisterAllPlayers(tournament_id: number, db?: Database): void {
    const database = db ?? this.db;
    database
      .prepare(`DELETE FROM tournament_player WHERE tournament_id = ?`)
      .run(tournament_id);
  }

  getUserStats(
    user_id: number,
    db?: Database
  ): { wins: number; losses: number } | null {
    const database = db ?? this.db;
    const stmt = database.prepare(`
      SELECT SUM(wins) as wins, SUM(losses) as losses
      FROM tournament_player
      WHERE user_id = ?
    `);
    const row = stmt.get(user_id) as
      | { wins: number; losses: number }
      | undefined;
    return row || null;
  }
}
