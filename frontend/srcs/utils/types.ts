interface UserProfile {
	id: number;
	username: string;
	email: string;
	wins: number;
	losses: number;
	avatar?: string | null;
}

interface Friend {
	id: number;
	username: string;
	avatar?: string | null;
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
	status: "Win" | "Loss" | "Draw";
	score: {
		user: number;
		opponent: number;
	};
	date: string;
}

interface Tournament {
	id: number;
	name: string;
	created_by: string;
	max_players_count: number;
	current_players_count: number;
	status: "created" | "in_progress" | "ended" | "error";
	participants: string[];
}

interface TournamentParticipant {
	id: number;
	username: string;
	avatar?: string | null;
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
