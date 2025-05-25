/**
 * API types for authentication-related requests.
 */

export interface RegisterRequest {
	email		:	string;		// RFC-5322
	username	:	string;		// optional public name
	password	:	string;		// min-8, same rules as login
}

export interface LoginRequest {
	email: string;        // RFC-5322
	password: string;     // min 8 chars
}

// ---------- Response payloads ----------
export interface TokenPair {
	accessToken: string;
	refreshToken: string;
	/** numeric user-id as allocated by UserService */
	userId: number;
}

export interface LoginSuccess extends TokenPair {}

export interface Login2FARequired {
	requires2fa: true;
	loginTicket: string;
}

export interface Login2FARequest {
	loginTicket: string;  // uuid v4
	otp: string;          // "123456"
}

export interface TwoFAEnableResponse {
	otpauthUrl: string;
	qrSvg: string;
}

/** Admin/Service request to revoke a refresh token by DB id */
export interface InternalRevokeTokenRequest {
	/** Primary-key id of the refresh-token row to revoke */
	tokenId: string;
}


export interface TwoFAVerifyRequest {
	otp: string;          // "123456"
}
export interface TwoFAVerifyResponse { verified: true; }

export interface OAuthCallbackResponse extends TokenPair {}

export interface RefreshRequest  { refreshToken: string; }
export interface RefreshResponse extends TokenPair {}

export interface LogoutRequest   { refreshToken: string; }
export interface LogoutResponse  { revoked: true; }


// Discriminated union for callers
export type LoginResponse = LoginSuccess | Login2FARequired;
export type RegisterResponse = TokenPair;
