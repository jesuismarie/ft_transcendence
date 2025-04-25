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
	viewFriends();
	viewMatches();
}

window.addEventListener("DOMContentLoaded", () => {
	document.getElementById("edit-profile-btn")?.addEventListener("click", () => {
		showModal("edit-profile-modal");
	});

	document.getElementById("friend-list-btn")?.addEventListener("click", () => {
		showModal("friends-modal");
	});

	document.getElementById("match-list-btn")?.addEventListener("click", () => {
		showModal("match-modal");
	});

	document.getElementById("close-edit-modal")?.addEventListener("click", () => {
		hideModal("edit-profile-modal");
	});

	document.getElementById("close-friends-modal")?.addEventListener("click", () => {
		hideModal("friends-modal");
	});

	document.getElementById("close-match-modal")?.addEventListener("click", () => {
		hideModal("match-modal");
	});
});
