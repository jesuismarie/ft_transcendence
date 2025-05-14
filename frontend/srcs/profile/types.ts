interface UserProfile {
	id: number;
	username: string;
	email: string;
	wins: number;
	losses: number;
	online: boolean;
	avatar?: string | null;
	// friends: Friend[];
	// tournaments: Tournament[];
	// matches: Match[];
}

interface Friend {
	id: number;
	username: string;
	avatar?: string | null;
	online: boolean;
}

interface UserSearchResult {
	id: number;
	username: string;
	avatar?: string | null;
	isFriend: boolean;
	requestSent: boolean;
}

interface FriendRequest {
	id: number;
	fromUser: {
		id: number;
		username: string;
		avatar?: string | null;
	};
}

interface Match {
	id: number;
	opponent: {
		id: number;
		username: string;
	};
	win: boolean;
	score: {
		user: number;
		opponent: number;
	};
	date: string;
}

interface Tournament {
	creator: {
		id: number;
		username: string | null;
	}
	id: number;
	name: string;
	capacity: number;
	participants: TournamentParticipant[];
}

interface TournamentParticipant {
	id: number;
	username: string;
}

interface RegistrationFormData {
	username: string;
	email: string;
	password: string;
}


interface LoginFormData {
	username: string;
	password: string;
}
