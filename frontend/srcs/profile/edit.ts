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
