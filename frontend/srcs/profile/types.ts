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

interface Friend {
	id: number;
	username: string;
	avatar?: string | null;
	status: boolean;
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
		username: string | null;
	}
	id: number;
	name: string;
	date: string;
	capacity: number;
	registered: boolean;
}


interface RegistrationFormData {
	name: string;
	surname: string;
	username: string;
	email: string;
	password: string;
}

interface LoginFormData {
	username: string;
	password: string;
}
