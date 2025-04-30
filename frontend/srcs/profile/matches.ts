interface Match {
	id: number;
	player1: string;
	player2: string;
	date: string;
	win: boolean;
	pl_1_score: number;
	pl_2_score: number;
}

const matches: Match[] = [
	{ id: 1, player1: "Alice", player2: "Bob", date: "2023-10-01", win: true, pl_1_score: 5, pl_2_score: 3 },
	{ id: 2, player1: "Charlie", player2: "Diana", date: "2023-10-02", win: false, pl_1_score: 2, pl_2_score: 4 },
	{ id: 3, player1: "Edward", player2: "Alice", date: "2023-10-03", win: true, pl_1_score: 6, pl_2_score: 5 },
	{ id: 4, player1: "Bob", player2: "Charlie", date: "2023-10-04", win: false, pl_1_score: 3, pl_2_score: 7 },
	{ id: 5, player1: "Diana", player2: "Edward", date: "2023-10-05", win: true, pl_1_score: 8, pl_2_score: 6 },
	{ id: 6, player1: "Alice", player2: "Charlie", date: "2023-10-06", win: false, pl_1_score: 4, pl_2_score: 5 },
	{ id: 7, player1: "Bob", player2: "Diana", date: "2023-10-07", win: true, pl_1_score: 7, pl_2_score: 4 },
	{ id: 8, player1: "Edward", player2: "Alice", date: "2023-10-08", win: false, pl_1_score: 3, pl_2_score: 6 },
	{ id: 9, player1: "Charlie", player2: "Bob", date: "2023-10-09", win: true, pl_1_score: 5, pl_2_score: 4 },
	{ id: 10, player1: "Diana", player2: "Edward", date: "2023-10-10", win: false, pl_1_score: 2, pl_2_score: 3 },
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
					<span >${match.player1}</span>
					<span class="font-normal">vs</span>
					<span >${match.player2}</span>
					<span class="ml-auto px-3 py-1 text-xs font-semibold rounded-full 
						${match.win ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'} shadow-sm">
						${match.win ? "Win" : "Lose"}
					</span>
				</div>
				<div class="mt-2 sm:mt-0 text-sm text-gray-500 text-right">
					<div class="font-medium text-gray-700">${match.pl_1_score} - ${match.pl_2_score}</div>
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
