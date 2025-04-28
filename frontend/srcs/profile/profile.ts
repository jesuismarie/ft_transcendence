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

function initProfileData() {
	initWipeText();
	editProfile();
	viewFriends();
	searchUsers();
	viewMatches();
}

function editProfile() {
	const editProfileBtn = document.getElementById("edit-profile-btn") as HTMLButtonElement | null;
	const closeEditModalBtn = document.getElementById("close-edit-modal") as HTMLButtonElement | null;

	if (!editProfileBtn || !closeEditModalBtn) {
		console.error("One or more required elements are missing in the DOM.");
		return;
	}

	editProfileBtn.addEventListener("click", () => {
		showModal("edit-profile-modal");
	});

	closeEditModalBtn.addEventListener("click", () => {
		hideModal("edit-profile-modal");
	});
}
