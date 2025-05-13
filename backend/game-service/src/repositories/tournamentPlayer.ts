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
}
