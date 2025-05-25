// Shared TypeScript interfaces for ft_transcendence front‑end ⇄ back‑end contracts
// -----------------------------------------------------------------------------
// These map 1‑to‑1 with the JSON bodies accepted/returned by UserService.
// Keep them in a small workspace package (e.g. packages/api-types) so both
// the SPA and the back‑end can import the same source of truth.

/* Common Objects */

export interface User {
	id:			number;
	email:		string;
	username:	string;
	avatarPath:	string | null;
	wins:		number;
	losses:		number;
	createdAt:	string; // ISO timestamp
}

/* Request Bodies */

export interface CreateUserRequest {
	email:		string;
	password:	string;
	username:	string;
}

export interface PatchUserRequest {
	displayName?:	string;
	email?:			string;
	password?:		string; // plain text; server will hash
	avatarPath?:	string; // used only by internal avatar route
}

export interface AddFriendRequest {
	userId:		number;
	friendId:	number;
}

export interface DeleteFriendRequest extends AddFriendRequest {}

export interface ChangePasswordRequest {
	currentPwd:	string;
	newPwd:		string;
}

/* Query string helpers */

export interface PaginationQuery {
	offset?:	number; // default 0
	limit?:		number;  // default 50
	q?:			string;      // search string
}

// Error envelope for API responses
export interface ApiError {
	status: 'error';
	code: string;   // machine‑readable, e.g. EMAIL_EXISTS
	message: string;
}

// Generic API response type
export type ApiResponse<T> = T | ApiError;
