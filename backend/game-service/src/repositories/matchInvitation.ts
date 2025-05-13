import type { FastifyInstance } from "fastify";

export interface MatchInvitation {
  id?: number;
  user_id1: number;
  user_id2: number;
  date_time?: string;
  is_accepted?: boolean;
}

export class MatchInvitationRequestRepo {
  private app: FastifyInstance;

  constructor(app: FastifyInstance) {
    this.app = app;
  }

  add(data: MatchInvitation): void {
    const stmt = this.app.db.prepare(`
      INSERT INTO match_invitation_request (user_id1, user_id2, date_time)
      VALUES (?, ?, ?)
    `);
    stmt.run(
      data.user_id1,
      data.user_id2,
      data.date_time ?? new Date().toISOString()
    );
  }

  update(id: number, updates: Partial<MatchInvitation>): void {
    const parts: string[] = [];
    const values: any[] = [];

    if (updates.is_accepted !== undefined) {
      parts.push("is_accepted = ?");
      values.push(updates.is_accepted ? 1 : 0);
    }

    if (parts.length === 0) return; // Nothing to update

    values.push(id);

    const stmt = this.app.db.prepare(`
      UPDATE match_invitation_request
      SET ${parts.join(", ")}
      WHERE id = ?
    `);
    stmt.run(...values);
  }

  delete(id: number): void {
    const stmt = this.app.db.prepare(`
      DELETE FROM match_invitation_request WHERE id = ?
    `);
    stmt.run(id);
  }

  getById(id: number): MatchInvitation | null {
    const stmt = this.app.db.prepare(`
      SELECT * FROM match_invitation_request WHERE id = ?
    `);
    return (stmt.get(id) as MatchInvitation | undefined) || null;
  }

  listPendingForUser(userId: number): MatchInvitation[] {
    const stmt = this.app.db.prepare(`
      SELECT * FROM match_invitation_request
      WHERE (user_id1 = ? OR user_id2 = ?) AND is_accepted = 0
    `);
    return stmt.all(userId, userId) as MatchInvitation[];
  }

  hasPendingRequestBetween(userId1: number, userId2: number): boolean {
    const stmt = this.app.db.prepare(`
      SELECT 1 FROM match_invitation_request
      WHERE
        (
          (user_id1 = ? AND user_id2 = ?)
          OR
          (user_id1 = ? AND user_id2 = ?)
        )
        AND is_accepted IS NULL
      LIMIT 1
    `);
    const row = stmt.get(userId1, userId2, userId2, userId1);
    return !!row;
  }
}
