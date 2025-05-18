function viewMatches(username: string | null = null) {
	const previewContainer = document.getElementById("matches-preview") as HTMLElement | null;
	const modalListContainer = document.getElementById("match-modal-list") as HTMLElement | null;
	const viewAllBtn = document.getElementById("match-list-btn") as HTMLButtonElement | null;
	const closeModalBtn = document.getElementById("close-matches-modal") as HTMLButtonElement | null;

	if (!previewContainer || !modalListContainer || !viewAllBtn || !closeModalBtn) {
		console.error("One or more required elements are missing in the DOM.");
		return;
	}

	const matches: Match[] = [];

	const renderMatchItem = (match: Match): string => {
		return `
		<div class="px-4 py-3 shadow-sm hover:bg-gray-50 transition duration-300">
			<div class="flex flex-col sm:flex-row sm:justify-between sm:items-center">
				<div class="text-lg font-semibold text-gray-800 flex items-center flex-wrap gap-2 sm:gap-4">
					<span >${username}</span>
					<span class="font-normal">vs</span>
					<span >${match.opponent.username}</span>
					<span class="ml-auto px-3 py-1 text-xs font-semibold rounded-full
						${match.status === 'Win' ? 'bg-green-100 text-green-800' : match.status === 'Draw' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'} shadow-sm">
						${match.status}
					</span>
				</div>
				<div class="mt-2 sm:mt-0 text-sm text-gray-500 text-right">
					<div class="font-medium text-gray-700">${match.score.user} - ${match.score.opponent}</div>
					<div>${match.date}</div>
				</div>
			</div>
		</div>

		`;
	};

	previewContainer.innerHTML = "";
	const previewMatches = matches.slice(0, 5);
	previewMatches.forEach(match => {
		previewContainer.insertAdjacentHTML("beforeend", renderMatchItem(match));
	});

	modalListContainer.innerHTML = "";
	matches.forEach(match => {
		modalListContainer.insertAdjacentHTML("beforeend", renderMatchItem(match));
	});

	if (matches.length == 0) {
		previewContainer.innerHTML = `<p class="text-gray-500 p-4">No matches yet.</p>`;
		return;
	}
	if (matches.length > 5) {
		viewAllBtn.classList.remove("hidden");
	}

	viewAllBtn.addEventListener("click", () => {
		showModal("matches-modal");
	});

	closeModalBtn.addEventListener("click", () => {
		hideModal("matches-modal");
	});
}
