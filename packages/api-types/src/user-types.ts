// Shared TypeScript interfaces for ft_transcendence front‑end ⇄ back‑end contracts
// -----------------------------------------------------------------------------
// These map 1‑to‑1 with the JSON bodies accepted/returned by UserService.
// Keep them in a small workspace package (e.g. packages/api-types) so both
// the SPA and the back‑end can import the same source of truth.

import { ApiError } from "./common-types";

/* Request Bodies */

export interface CreateUserRequest {
	email:			string;
	password:		string;
	username:		string;
	authProvider?:	string; // e.g. "google", "github"
	providerSub?:	string; // e.g. "1234567890" for Google
}

export interface UpdateUserRequest {
	username?:		string;
	email?:			string;
}

export interface UpdateAvatarRequest {
	avatarPath:		string; // can't be empty
}

export interface UpdatePasswordRequest {
	currentPwd:		string;
	newPwd:			string;
}


export interface AddFriendRequest {
	userId:			number;
	friendId:		number;
}

export interface DeleteFriendRequest extends AddFriendRequest {}

/* Query Parameters */
export interface PaginationQuery {
	offset?:		number; 	// default 0
	limit?:			number;  	// default 50
	q?:				string;     // search string
}

/* Responses */
export interface UserView {
	id:				number;
	email:			string;
	username:		string;
	avatarPath:		string | null;
	wins:			number;
	losses:			number;
	online:			boolean;
}

export interface CreateUserResponse {
	id:			number;
	email:		string;
	username:	string;
}

export interface QuickUserResponse {
	id:			number;
	username:	string;
	avatarPath:	string | null;
}

export interface UserUpdateResponse {
	modified:		boolean;
}

export interface UserListView {
	total: number; // total number of users matching the query
	users: QuickUserResponse[];
}

// Generic API response type
export type ApiResponse<T> = T | ApiError;
