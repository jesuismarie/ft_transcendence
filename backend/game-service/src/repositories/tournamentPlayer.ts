import type { FastifyInstance } from "fastify";

export class TournamentPlayerRepo {
  private app: FastifyInstance;

  constructor(app: FastifyInstance) {
    this.app = app;
  }

  async isPlayerInTournament(
    playerId: number,
    tournamentId: number
  ): Promise<boolean> {
    const stmt = this.app.db.prepare(`
        SELECT 1 FROM tournament_player WHERE player_id = ? AND tournament_id = ?
      `);
    return !!stmt.get(playerId, tournamentId);
  }

  async isPlayerInAnyActiveTournament(userId: number): Promise<boolean> {
    const stmt = this.app.db.prepare(`
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

  // Удаляет регистрацию игрока
  async unregister(user_id: number, tournament_id: number): Promise<void> {
    const stmt = this.app.db.prepare(
      `DELETE FROM tournament_player WHERE player_id = ? AND tournament_id = ?`
    );
    stmt.run(user_id, tournament_id);
  }
}
