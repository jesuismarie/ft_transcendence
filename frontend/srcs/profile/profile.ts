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

function initPersonaleData(username: string | null = null) {
	initWipeText();
	searchUsers();
	viewFriends(username);
	viewMatches(username);

	const editProfileBtn = document.getElementById("edit-profile-btn") as HTMLButtonElement | null;
	const upcomingTournaments = document.getElementById("upcoming-tournaments") as HTMLElement | null;

	if (username === currentUser) {
		editProfileBtn?.classList.remove("hidden");
		editProfile();
	} else {
		editProfileBtn?.classList.add("hidden");
	}

	if (username === currentUser) {
		upcomingTournaments?.classList.remove("hidden");
		//upcomingTournaments();
	} else {
		upcomingTournaments?.classList.add("hidden");
	}
}


