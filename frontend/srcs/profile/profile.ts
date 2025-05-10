function showModal(modalId: string) {
	const modal = document.getElementById(modalId) as HTMLElement | null;
	if (modal) {
		modal.classList.remove("hidden");
	}
}

function hideModal(modalId: string) {
	const modal = document.getElementById(modalId) as HTMLElement | null;
	if (modal) {
		modal.classList.add("hidden");
	}
}

function initPersonalData(username: string | null = null) {
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

	if (username === getCurrentUser()) {
		editProfileBtn?.classList.remove("hidden");
		editProfile();
		upcomingTournaments?.classList.remove("hidden");
		initFriendRequests(username);
		initTournaments(username);
		addTournament();
	} else {
		editProfileBtn?.classList.add("hidden");
		upcomingTournaments?.classList.add("hidden");
		friendRequestBtn?.classList.remove("hidden");
		friendRequestListBtn?.classList.add("hidden");
		addTournamentPreviewBtn?.classList.add("hidden");
	}
}
