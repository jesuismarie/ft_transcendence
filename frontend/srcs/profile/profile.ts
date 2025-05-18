async function initPersonalData(username: string | null = null) {
	initWipeText();
	searchUsers();
	viewFriends(username);
	viewMatches(username);

	const editProfileBtn = document.getElementById("edit-profile-btn") as HTMLButtonElement | null;
	const upcomingTournaments = document.getElementById("upcoming-tournaments") as HTMLElement | null;
	const friendRequestBtn = document.getElementById("friend-request-btn") as HTMLButtonElement | null;
	const friendRequestListBtn = document.getElementById("friend-request-list-btn") as HTMLButtonElement | null;
	const addTournamentPreviewBtn = document.getElementById("add-tournament-preview-btn") as HTMLButtonElement | null;

	if (!editProfileBtn || !upcomingTournaments || !friendRequestBtn || !friendRequestListBtn || !addTournamentPreviewBtn) {
		console.error("One or more required elements are missing in the DOM.");
		return;
	}

	try {
		const currentUsername = getCurrentUser();
		const targetUsername = username || currentUsername;

		if (!targetUsername) {
			throw new Error("Username is required to load user profile");
		}

		const res = await fetch(`/api/users/${targetUsername}`);
		if (!res.ok)
			throw new Error("Failed to load user profile");
		const user: UserProfile = await res.json();

		if (targetUsername === currentUsername) {
			editProfileBtn.classList.remove("hidden");
			editProfile(user);
			upcomingTournaments.classList.remove("hidden");
			initFriendRequests(targetUsername);
			initTournaments(targetUsername);
			addTournament();
		} else {
			editProfileBtn.classList.add("hidden");
			upcomingTournaments.classList.add("hidden");
			friendRequestBtn.classList.remove("hidden");
			friendRequestListBtn.classList.add("hidden");
			addTournamentPreviewBtn.classList.add("hidden");
		}
	} catch (err) {
		console.error("Error loading personal data:", err);
	}
}
