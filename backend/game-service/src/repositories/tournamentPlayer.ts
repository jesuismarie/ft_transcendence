import type { FastifyInstance } from "fastify";
import type { Database } from "better-sqlite3";

export class TournamentPlayerRepo {
  private db: Database;

  constructor(app: FastifyInstance & { db: Database }) {
    this.db = app.db;
  }

  isPlayerInTournament(
    playerId: number,
    tournamentId: number,
    db?: Database
  ): boolean {
    const database = db ?? this.db;
    const stmt = database.prepare(`
      SELECT 1 FROM tournament_player WHERE player_id = ? AND tournament_id = ?
    `);
    return !!stmt.get(playerId, tournamentId);
  }

  isPlayerInAnyActiveTournament(userId: number, db?: Database): boolean {
    const database = db ?? this.db;
    const stmt = database.prepare(`
      SELECT 1
      FROM tournament_player tp
      JOIN tournament t ON tp.tournament_id = t.id
      WHERE tp.player_id = ?
        AND t.status IN ('created', 'in_progress')
      LIMIT 1
    `);
    const result = stmt.get(userId);
    return !!result;
  }

  unregister(user_id: number, tournament_id: number, db?: Database): void {
    const database = db ?? this.db;
    database
      .prepare(
        `DELETE FROM tournament_player WHERE player_id = ? AND tournament_id = ?`
      )
      .run(user_id, tournament_id);
  }

  getPlayersByTournament(tournament_id: number, db?: Database): number[] {
    const database = db ?? this.db;
    const stmt = database.prepare(`
      SELECT player_id FROM tournament_player WHERE tournament_id = ?
    `);
    const rows = stmt.all(tournament_id) as { player_id: number }[];
    return rows.map((row) => row.player_id);
  }

  incrementWins(user_id: number, tournament_id: number, db?: Database) {
    const database = db ?? this.db;
    const stmt = database.prepare(`
      UPDATE tournament_player
      SET wins = wins + 1
      WHERE player_id = ? AND tournament_id = ?
    `);
    stmt.run(user_id, tournament_id);
  }

  unregisterAllPlayers(tournament_id: number, db?: Database): void {
    const database = db ?? this.db;
    database
      .prepare(`DELETE FROM tournament_player WHERE tournament_id = ?`)
      .run(tournament_id);
  }
}
