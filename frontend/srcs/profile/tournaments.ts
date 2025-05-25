function initTournaments(username: string | null = null) {
	const viewBtn = document.getElementById("view-tournament") as HTMLButtonElement | null;
	const closeModalBtn = document.getElementById("close-tournament-modal") as HTMLButtonElement | null;

	if (!viewBtn || !closeModalBtn) {
		console.error("Modal buttons not found.");
		return;
	}

	const tournaments: Tournament[] = [];

	if (tournaments.length === 0) {
		const previewContainer = document.getElementById("tournament-preview");
		if (previewContainer)
			previewContainer.innerHTML = `<p class="text-gray-500 p-4">No tournaments yet.</p>`;
		return;
	}

	if (tournaments.length > 3) {
		viewBtn.classList.remove("hidden");
	}

	updateTournamentUI(tournaments, username);

	viewBtn.addEventListener("click", () => {
		showModal("tournament-modal");
	});

	closeModalBtn.addEventListener("click", () => {
		hideModal("tournament-modal");
	});
}
