const matches: Match[] = [
	{ id: 1, opponent: { id: 2, username: "Player2", avatar: null }, win: true, score: { user: 3, opponent: 1 }, date: "2023-10-01" },
	{ id: 2, opponent: { id: 3, username: "Player3", avatar: null }, win: false, score: { user: 1, opponent: 2 }, date: "2023-10-02" },
	{ id: 3, opponent: { id: 4, username: "Player4", avatar: null }, win: true, score: { user: 2, opponent: 0 }, date: "2023-10-03" },
	{ id: 4, opponent: { id: 5, username: "Player5", avatar: null }, win: false, score: { user: 0, opponent: 3 }, date: "2023-10-04" },
	{ id: 5, opponent: { id: 6, username: "Player6", avatar: null }, win: true, score: { user: 4, opponent: 2 }, date: "2023-10-05" },
	{ id: 6, opponent: { id: 7, username: "Player7", avatar: null }, win: false, score: { user: 1, opponent: 5 }, date: "2023-10-06" },
	{ id: 7, opponent: { id: 8, username: "Player8", avatar: null }, win: true, score: { user: 3, opponent: 1 }, date: "2023-10-07" },
	{ id: 8, opponent: { id: 9, username: "Player9", avatar: null }, win: false, score: { user: 2, opponent: 4 }, date: "2023-10-08" },
	{ id: 9, opponent: { id: 10, username: "Player10", avatar: null }, win: true, score: { user: 5, opponent: 3 }, date: "2023-10-09" },
	
];

function viewMatches(username: string | null = null) {
	const previewContainer = document.getElementById("matches-preview") as HTMLElement | null;
	const modalListContainer = document.getElementById("match-modal-list") as HTMLElement | null;
	const viewAllBtn = document.getElementById("match-list-btn") as HTMLButtonElement | null;
	const closeModalBtn = document.getElementById("close-matches-modal") as HTMLButtonElement | null;

	if (!previewContainer || !modalListContainer || !viewAllBtn || !closeModalBtn) {
		console.error("One or more required elements are missing in the DOM.");
		return;
	}

	const renderMatchItem = (match: Match): string => {
		return `
		<div class="px-4 py-3 shadow-sm hover:bg-gray-50 transition duration-300">
			<div class="flex flex-col sm:flex-row sm:justify-between sm:items-center">
				<div class="text-lg font-semibold text-gray-800 flex items-center flex-wrap gap-2 sm:gap-4">
					<span >${currentUser}</span>
					<span class="font-normal">vs</span>
					<span >${match.opponent.username}</span>
					<span class="ml-auto px-3 py-1 text-xs font-semibold rounded-full 
						${match.win ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'} shadow-sm">
						${match.win ? "Win" : "Lose"}
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
