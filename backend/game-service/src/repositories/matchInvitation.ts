import type { FastifyInstance } from "fastify";
import type { Database } from "better-sqlite3";

export interface MatchInvitation {
  id?: number;
  username1: string;
  username2: string;
  date_time?: string;
  is_accepted?: boolean;
}

export class MatchInvitationRequestRepo {
  private db: Database;

  constructor(app: FastifyInstance & { db: Database }) {
    this.db = app.db;
  }

  add(data: MatchInvitation, db?: Database): void {
    const database = db ?? this.db;
    const stmt = database.prepare(`
      INSERT INTO match_invitation_request (username1, username2, date_time)
      VALUES (?, ?, ?)
    `);
    stmt.run(
      data.username1,
      data.username2,
      data.date_time ?? new Date().toISOString()
    );
  }

  update(id: number, updates: Partial<MatchInvitation>, db?: Database): void {
    const database = db ?? this.db;
    const parts: string[] = [];
    const values: any[] = [];

    if (updates.is_accepted !== undefined) {
      parts.push("is_accepted = ?");
      values.push(updates.is_accepted ? 1 : 0);
    }

    if (parts.length === 0) return; // Nothing to update

    values.push(id);

    const stmt = database.prepare(`
      UPDATE match_invitation_request
      SET ${parts.join(", ")}
      WHERE id = ?
    `);
    stmt.run(...values);
  }

  delete(id: number, db?: Database): void {
    const database = db ?? this.db;
    const stmt = database.prepare(`
      DELETE FROM match_invitation_request WHERE id = ?
    `);
    stmt.run(id);
  }

  getById(id: number, db?: Database): MatchInvitation | null {
    const database = db ?? this.db;
    const stmt = database.prepare(`
      SELECT * FROM match_invitation_request WHERE id = ?
    `);
    return (stmt.get(id) as MatchInvitation | undefined) || null;
  }

  listPendingForUser(username: string, db?: Database): MatchInvitation[] {
    const database = db ?? this.db;
    const stmt = database.prepare(`
      SELECT * FROM match_invitation_request
      WHERE (username1 = ? OR username2 = ?) AND is_accepted = 0
    `);
    return stmt.all(username, username) as MatchInvitation[];
  }

  hasPendingRequestBetween(
    username1: string,
    username2: string,
    db?: Database
  ): boolean {
    const database = db ?? this.db;
    const stmt = database.prepare(`
      SELECT 1 FROM match_invitation_request
      WHERE
        (
          (username1 = ? AND username2 = ?)
          OR
          (username1 = ? AND username2 = ?)
        )
        AND is_accepted IS NULL
      LIMIT 1
    `);
    const row = stmt.get(username1, username2, username2, username1);
    return !!row;
  }
}
