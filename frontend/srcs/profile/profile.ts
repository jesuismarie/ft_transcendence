function initData(user: User) {
	const playerName = document.getElementById("player-name") as HTMLElement | null;
	const playerWins = document.getElementById("player-wins") as HTMLElement | null;
	const playerLosses = document.getElementById("player-losses") as HTMLElement | null;
	const onlineStatus = document.getElementById("online-status") as HTMLElement | null;

	if (!playerName || !playerWins || !playerLosses || !onlineStatus) {
		console.error("One or more required elements are missing in the DOM.");
		return;
	}

	playerName.innerHTML = user.username || "Player";
	playerWins.innerHTML = user.wins.toString();
	playerLosses.innerHTML = user.losses.toString();
	// onlineStatus.innerHTML = `
	// <div class="w-2 h-2 bg-red-500 rounded-full inline-block mr-1"></div>
	// <span class="text-red-500">Offline</span>
	// `;
	onlineStatus.innerHTML = `
		<div class="w-2 h-2 bg-green-500 rounded-full inline-block mr-1"></div>
		<span class="text-green-500">Online</span>
	`;
}

async function initPersonalData(id: number) {
	initWipeText();

	const editProfileBtn = document.getElementById("edit-profile-btn") as HTMLButtonElement | null;
	const upcomingTournaments = document.getElementById("upcoming-tournaments") as HTMLElement | null;
	const friendRequestBtn = document.getElementById("friend-request-btn") as HTMLButtonElement | null;
	const addTournamentPreviewBtn = document.getElementById("add-tournament-preview-btn") as HTMLButtonElement | null;

	if (!editProfileBtn || !upcomingTournaments || !friendRequestBtn || !addTournamentPreviewBtn) {
		console.error("One or more required elements are missing in the DOM.");
		return;
	}

	try {
		// const currentUserId = getCurrentUserId();
		// const targetUserId = username || currentUserId;

		let currentUserId;
		let targetUserId = id || currentUserId;
		if (!targetUserId)
			targetUserId = 1; // For testing purposes
		currentUserId = 1; // For testing purposes
		
		if (!targetUserId)
			throw new Error("Username is required to load user profile");

		// const res = await fetch(`/users/${targetUserId}`);
		// if (!res.ok)
		// 	throw new Error("Failed to load user profile");
		// const user: User = await res.json();

		const user: User = {
			id: 1,
			username: "hello",
			email: "hey@gmail.com",
			wins: 10,
			losses: 5,
			avatar: "https://example.com/avatar.png",
		};
		searchUsers();
		viewFriends(user.id);
		viewMatches(user.id, user.username);
		initData(user);

		if (targetUserId === currentUserId) {
			initAvatarUpload(targetUserId);
			editProfileBtn.classList.remove("hidden");
			editProfile(user);
			// setup2FA();
			// upcomingTournaments.classList.remove("hidden");
			// initTournaments(targetUserId);
			addTournament();
		} else {
			editProfileBtn.classList.add("hidden");
			upcomingTournaments.classList.add("hidden");
			friendRequestBtn.classList.remove("hidden");
			addTournamentPreviewBtn.classList.add("hidden");
		}
	} catch (err) {
		console.error("Error loading personal data:", err);
	}
}
