export interface PaginationInfo {
	pageInfo:		HTMLElement;
	paginatioBtns:	HTMLElement;
	prevPageBtn:	HTMLButtonElement;
	nextPageBtn:	HTMLButtonElement;
}

export interface ModalInfo {
	previewContainer?:	HTMLElement;
	openModalBtn:		HTMLButtonElement;
	listContainer?:		HTMLElement;
	closeModalBtn:		HTMLButtonElement;
	saveBtn?:			HTMLButtonElement;
}

export interface EditProfileElements {
	usernameInput:			HTMLInputElement;
	emailInput:				HTMLInputElement;
	oldPasswordInput:		HTMLInputElement;
	passwordInput:			HTMLInputElement;
	confirmPasswordInput:	HTMLInputElement;
}

export interface TwoFAModalElements {
	twofaInput:	HTMLInputElement;
	verifyBtn:	HTMLButtonElement;
}

export interface AvatarElements {
	uploadBtn: HTMLButtonElement;
	fileInput: HTMLInputElement;
	avatarImage: HTMLImageElement;
}

export const ALLOWED_IMAGE_TYPES = [
	'image/jpeg',
	'image/jpg',
	'image/png',
	'image/gif',
	'image/webp'
] as const;


// API Types
export interface TwoFAEnableResponse {
	otpauthUrl: string;
	qrSvg: string;
}

export interface TwoFAVerifyRequest {
	otp: string;
}

export interface TwoFAVerifyResponse {
	verified: true;
}

export interface UserView {
	id:			number;
	username:	string;
	email:		string;
	wins:		number;
	losses:		number;
	avatar?:	string | null;
}

export interface UpdateAvatarRequest {
	avatarPath:	string;
}

export interface UpdateUserRequest {
	displayName?:	string;
	email?:			string;
}

export interface ChangePasswordRequest {
	currentPwd:	string;
	newPwd:		string;
}

export interface SearchUserResponse {
	totalCount:	number;
	users:		QuickUserResponse[];
}

export interface QuickUserResponse {
	id:			number;
	username:	string;
	avatarPath:	string | null;
}

export interface FriendResponse {
	totalCount:	number;
	friends:	QuickUserResponse[];
}

export interface AddFriendRequest {
	userId:		number;
	friendId:	number;
}

// export interface GetMatchHistoryResponse {
// 	totalCount:	number;
// 	matches:	MatchHistory[];
// }

// export interface MatchHistory {
// 	id:				number;
// 	opponent:		string;
// 	status:			number;
// 	is_won:			boolean;
// 	score: {
// 		user:		number;
// 		opponent:	number;
// 	};
// 	date:			string;
// }

export interface GetTournamentsInfoResponse {
	totalCount:	number;
	tournament:	TournamentInfo[];
}

export interface TournamentInfo {
	id:						number;
	name:					string;
	created_by:				string;
	max_players_count:		number;
	current_players_count:	number;
	status:					string;
	participants:			string[];
}

export interface RegisterRequest {
	email:		string;
	username:	string;
	password:	string;
}

export interface LoginRequest {
	email:		string;
	password:	string;
}

export interface ApiError {
	status: 'error';
	code: string;
	message: string;
}

// Tournament status

// Error message
