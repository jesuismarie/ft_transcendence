/**
 * Payload for user login.
 */
export interface LoginRequest {
	/** TODO: replace with “email” if you only accept emails */
	username: string;
	/** TODO: define password constraints (min length, chars) */
	password: string;
}

/**
 * Payload to invalidate a session on logout.
 */
export interface LogoutRequest {
	/** TODO: if you track sessions, include sessionId or token */
	token: string;
}
