/**
 * Start a new game against another user.
 */
export interface CreateGameRequest {
	/** User ID of the opponent */
	opponentId: number; // TODO: confirm numeric or string ID
}

/**
 * Submit a move in an existing game.
 */
export interface MakeMoveRequest {
	/** ID of the game to play in */
	gameId: number;
	/** X-coordinate on the board */
	x: number;          // TODO: define valid range (0–2, 1–3, etc)
	/** Y-coordinate on the board */
	y: number;
}
