import type { Status, Tournament } from "../types/index";
import type { Database } from "better-sqlite3";
import { BaseRepo } from "./base";

export class TournamentRepo extends BaseRepo {
  // Все методы принимают в качестве опционального параметра объект с методом prepare
  // Просто передаем объект Database

  exists(id: number, db?: Database): boolean {
    const database = db ?? this.db;
    const stmt = database.prepare(`SELECT 1 FROM tournament WHERE id = ?`);
    return !!stmt.get(id);
  }

  getStatus(id: number, db?: Database): Status | null {
    const database = db ?? this.db;
    const stmt = database.prepare(`SELECT status FROM tournament WHERE id = ?`);
    const row = stmt.get(id) as { status: Status } | undefined;
    return row ? row.status : null;
  }

  checkIsActiveTournamentByUsername(createdBy: number, db?: Database): boolean {
    const database = db ?? this.db;
    const stmt = database.prepare(
      `SELECT 1 FROM tournament WHERE created_by = ? AND status IN ('created', 'in_progress')`
    );
    const row = stmt.get(createdBy);
    return !!row;
  }

  createTournament(
    data: { name: string; maxPlayersCount: number; createdBy: number },
    db?: Database
  ): { id: number; name: string } {
    const database = db ?? this.db;
    const { name, maxPlayersCount, createdBy } = data;
    const stmt = database.prepare(`
      INSERT INTO tournament (name, max_players_count, current_players_count, status, created_by)
      VALUES (?, ?, 0, 'created', ?)
      RETURNING id, name
    `);
    return stmt.get(name, maxPlayersCount, createdBy) as {
      id: number;
      name: string;
    };
  }

  getById(id: number, db?: Database): Tournament | null {
    const database = db ?? this.db;
    const stmt = database.prepare(`
      SELECT id, name, created_by, max_players_count, current_players_count, status, winner
      FROM tournament
      WHERE id = ?
    `);
    const row = stmt.get(id);
    return row ? (row as Tournament) : null;
  }

  private getByIdForUpdate(
    tournament_id: number,
    db: Database
  ): {
    id: number;
    max_players_count: number;
    current_players_count: number;
    status: Status;
  } | null {
    const stmt = db.prepare(`
      SELECT id, max_players_count, current_players_count, status
      FROM tournament
      WHERE id = ?
    `);
    const row = stmt.get(tournament_id);
    return row ? (row as any) : null;
  }

  private incrementPlayerCount(tournament_id: number, db: Database): void {
    db.prepare(
      `
      UPDATE tournament
      SET current_players_count = current_players_count + 1
      WHERE id = ?
    `
    ).run(tournament_id);
  }

  registerPlayerToTournament(tournament_id: number, user_id: number): void {
    const tx = this.db.transaction(() => {
      const tournament = this.getByIdForUpdate(tournament_id, this.db);

      if (
        !tournament ||
        tournament.status !== "created" ||
        tournament.current_players_count >= tournament.max_players_count
      ) {
        throw new Error("Tournament is not available for registration");
      }

      this.insertPlayer(tournament_id, user_id, this.db);
      this.incrementPlayerCount(tournament_id, this.db);
    });

    tx();
  }

  private insertPlayer(
    tournament_id: number,
    user_id: number,
    db: Database
  ): void {
    db.prepare(
      `
      INSERT INTO tournament_player (tournament_id, user_id)
      VALUES (?, ?)
    `
    ).run(tournament_id, user_id);
  }

  decrementPlayerCount(tournament_id: number, db?: Database): void {
    const database = db ?? this.db;
    database
      .prepare(
        `
      UPDATE tournament SET current_players_count = current_players_count - 1 WHERE id = ?
    `
      )
      .run(tournament_id);
  }

  updateStatus(id: number, status: Status, db?: Database): void {
    const database = db ?? this.db;
    database
      .prepare(
        `
      UPDATE tournament SET status = ?, started_at = datetime('now') WHERE id = ?
    `
      )
      .run(status, id);
  }

  setStatus(tournament_id: number, status: Status, db?: Database) {
    const database = db ?? this.db;
    database
      .prepare(`UPDATE tournament SET status = ? WHERE id = ?`)
      .run(status, tournament_id);
  }

  updateWinner(tournament_id: number, winner: number, db?: Database): void {
    const database = db ?? this.db;
    database
      .prepare(
        `UPDATE tournament SET winner = ?, status = 'ended', ended_at = datetime('now') WHERE id = ?`
      )
      .run(winner, tournament_id);
  }

  deleteTournament(tournament_id: number, db?: Database): void {
    const database = db ?? this.db;
    const stmt = database.prepare(`
      DELETE FROM tournament WHERE id = ?
    `);
    stmt.run(tournament_id);
  }

  getAll(db?: Database): Tournament[] {
    const database = db ?? this.db;
    const stmt = database.prepare(`
      SELECT id, name, created_by, max_players_count, current_players_count, status, winner
      FROM tournament
    `);
    return stmt.all() as Tournament[];
  }

  getAllCreated(limit: number, offset: number, db?: Database): Tournament[] {
    const database = db ?? this.db;
    const stmt = database.prepare(`
      SELECT id, name, created_by, max_players_count, current_players_count, status, winner
      FROM tournament
      WHERE status = 'created'
      ORDER BY id DESC
      LIMIT ? OFFSET ?
    `);
    return stmt.all(limit, offset) as Tournament[];
  }

  countAllCreated(db?: Database): number {
    const database = db ?? this.db;
    const stmt = database.prepare(`
      SELECT COUNT(*) as count
      FROM tournament
      WHERE status = 'created'
    `);
    const row = stmt.get() as { count: number };
    return row.count;
  }
}
