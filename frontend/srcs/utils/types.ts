interface PaginationInfo {
	pageInfo:		HTMLElement;
	paginatioBtns:	HTMLElement;
	prevPageBtn:	HTMLButtonElement;
	nextPageBtn:	HTMLButtonElement;
}

interface ModalInfo {
	previewContainer?:	HTMLElement;
	openModalBtn:		HTMLButtonElement;
	listContainer?:		HTMLElement;
	closeModalBtn:		HTMLButtonElement;
	saveBtn?:			HTMLButtonElement;
}

interface EditProfileElements {
	usernameInput:			HTMLInputElement;
	emailInput:				HTMLInputElement;
	oldPasswordInput:		HTMLInputElement;
	passwordInput:			HTMLInputElement;
	confirmPasswordInput:	HTMLInputElement;
}

interface AvatarElements {
	uploadBtn: HTMLButtonElement;
	fileInput: HTMLInputElement;
	avatarImage: HTMLImageElement;
}

const ALLOWED_IMAGE_TYPES = [
	'image/jpeg',
	'image/jpg',
	'image/png',
	'image/gif',
	'image/webp'
] as const;



// API Types
interface User {
	id:			number;
	username:	string;
	email:		string;
	wins:		number;
	losses:		number;
	avatar?:	string | null;
}

interface PatchUserRequest {
	displayName?:	string;
	email?:			string;
}

interface ChangePasswordRequest {
	currentPwd:	string;
	newPwd:		string;
}

interface SearchUserResponse {
	totalCount:	number;
	users:		User[];
}

interface Friend {
	id:			number;
	username:	string;
	avatar?:	string | null;
}

interface FriendResponse {
	totalCount:		number;
	friends:		Friend[];
}

interface AddFriendRequest {
	userId:		number;
	friendId:	number;
}

interface GetMatchHistoryResponse {
	totalCount:	number;
	matches:	MatchHistory[];
}

interface MatchHistory {
	id: 			number;
	opponent:		string;
	status:			number;
	is_won:			boolean;
	score: {
		user:		number;
		opponent:	number;
	};
	date:			string;
}

interface GetTournamentsInfoResponse {
	totalCount:	number;
	tournament:	TournamentInfo[];
}

interface TournamentInfo {
	id:						number;
	name:					string;
	created_by:				string;
	max_players_count:		number;
	current_players_count:	number;
	status:					string;
	participants:			string[];
}

interface RegisterRequest {
	email:		string;
	username:	string;
	password:	string;
}

interface LoginRequest {
	email:		string;
	password:	string;
}

interface ApiError {
	status: 'error';
	code: string;
	message: string;
}

// Tournament status

// Error message
