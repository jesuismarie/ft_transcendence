function showModal(modalId: string) {
	const modal = document.getElementById(modalId);
	if (modal) {
		modal.classList.remove("hidden");
	}
}

function hideModal(modalId: string) {
	const modal = document.getElementById(modalId);
	if (modal) {
		modal.classList.add("hidden");
	}
}

function initPersonaleData(username: string | null = null, ) {
	initWipeText();
	searchUsers();
	viewFriends(username);
	viewMatches(username);

	const editProfileBtn = document.getElementById("edit-profile-btn") as HTMLButtonElement | null;
	const upcomingTournaments = document.getElementById("upcoming-tournaments") as HTMLButtonElement | null;
	const friendRequestBtn = document.getElementById("friend-request-btn") as HTMLButtonElement | null;

	if (!editProfileBtn || !upcomingTournaments || !friendRequestBtn)
	{
		console.error("One or more required elements are missing in the DOM.");
		return;
	}

	if (username === getCurrentUser()) {
		editProfileBtn?.classList.remove("hidden");
		editProfile();
		upcomingTournaments?.classList.remove("hidden");
		initRequests(username);
		initTournaments();
	} else {
		editProfileBtn?.classList.add("hidden");
		upcomingTournaments?.classList.add("hidden");
		friendRequestBtn?.classList.add("hidden");
	}
}
