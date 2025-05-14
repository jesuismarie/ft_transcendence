function searchUsers() {
	const searchModalBtn = document.getElementById("search-modal-btn") as HTMLButtonElement | null;
	const listContainer = document.getElementById("search-users-list") as HTMLElement | null;
	const closeModalBtn = document.getElementById("close-search-modal") as HTMLButtonElement | null;

	if (!searchModalBtn || !listContainer || !closeModalBtn) {
		console.error("One or more required elements are missing in the DOM.");
		return;
	}

	searchModalBtn.addEventListener("click", () => {
		showModal("search-users-modal");
	});

	closeModalBtn.addEventListener("click", () => {
		hideModal("search-users-modal");
	});
}
