import type { FastifyInstance } from "fastify";
import type { Database } from "better-sqlite3";

export class TournamentPlayerRepo {
  private db: Database;

  constructor(app: FastifyInstance & { db: Database }) {
    this.db = app.db;
  }

  isPlayerInTournament(
    username: string,
    tournamentId: number,
    db?: Database
  ): boolean {
    const database = db ?? this.db;
    const stmt = database.prepare(`
      SELECT 1 FROM tournament_player WHERE player_username = ? AND tournament_id = ?
    `);
    return !!stmt.get(username, tournamentId);
  }

  isPlayerInAnyActiveTournament(username: string, db?: Database): boolean {
    const database = db ?? this.db;
    const stmt = database.prepare(`
      SELECT 1
      FROM tournament_player tp
      JOIN tournament t ON tp.tournament_id = t.id
      WHERE tp.player_username = ?
        AND t.status IN ('created', 'in_progress')
      LIMIT 1
    `);
    const result = stmt.get(username);
    return !!result;
  }

  unregister(username: string, tournament_id: number, db?: Database): void {
    const database = db ?? this.db;
    database
      .prepare(
        `DELETE FROM tournament_player WHERE player_username = ? AND tournament_id = ?`
      )
      .run(username, tournament_id);
  }

  getPlayersByTournament(tournament_id: number, db?: Database): string[] {
    const database = db ?? this.db;
    const stmt = database.prepare(`
      SELECT player_username FROM tournament_player WHERE tournament_id = ?
    `);
    const rows = stmt.all(tournament_id) as { player_username: string }[];
    return rows.map((row) => row.player_username);
  }

  incrementWins(username: string, tournament_id: number, db?: Database) {
    const database = db ?? this.db;
    const stmt = database.prepare(`
      UPDATE tournament_player
      SET wins = wins + 1
      WHERE player_username = ? AND tournament_id = ?
    `);
    stmt.run(username, tournament_id);
  }

  incrementLosses(username: string, tournament_id: number, db?: Database) {
    const database = db ?? this.db;
    const stmt = database.prepare(`
      UPDATE tournament_player
      SET losses = losses + 1
      WHERE player_username = ? AND tournament_id = ?
    `);
    stmt.run(username, tournament_id);
  }

  unregisterAllPlayers(tournament_id: number, db?: Database): void {
    const database = db ?? this.db;
    database
      .prepare(`DELETE FROM tournament_player WHERE tournament_id = ?`)
      .run(tournament_id);
  }

  getUserStats(
    username: string,
    db?: Database
  ): { wins: number; losses: number } | null {
    const database = db ?? this.db;
    const stmt = database.prepare(`
      SELECT SUM(wins) as wins, SUM(losses) as losses
      FROM tournament_player
      WHERE player_username = ?
    `);
    const row = stmt.get(username) as
      | { wins: number; losses: number }
      | undefined;
    return row || null;
  }
}
