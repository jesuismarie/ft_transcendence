const MATCHS_LIMIT = 10;
let currentMatchOffset = 0;
let totalMatchResults = 0;

function viewMatches(username: string | null = null) {
	const previewContainer = document.getElementById("matches-preview") as HTMLElement | null;
	const modalListContainer = document.getElementById("match-modal-list") as HTMLElement | null;
	const viewAllBtn = document.getElementById("match-list-btn") as HTMLButtonElement | null;
	const closeModalBtn = document.getElementById("close-matches-modal") as HTMLButtonElement | null;
	const prevPageBtn = document.getElementById("prev-matches-page") as HTMLButtonElement | null;
	const nextPageBtn = document.getElementById("next-matches-page") as HTMLButtonElement | null;
	const pageInfo = document.getElementById("match-page-info") as HTMLElement | null;
	const paginatioBtns = document.getElementById("match-pagination") as HTMLButtonElement | null;

	if (!previewContainer || !modalListContainer || !viewAllBtn || !closeModalBtn || !prevPageBtn || !nextPageBtn || !pageInfo || !paginatioBtns) {
		console.error("One or more required elements are missing in the DOM.");
		return;
	}

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

	const loadMatchList = async (offset: number = 0) => {
		try {
			const res = await fetch(`/api/matches?offset=${offset}&limit=${MATCHS_LIMIT}`);
			if (!res.ok)
				throw new Error("Failed to fetch matches");

			const data: MatchResponse = await res.json();
			if (data.total === 0) {
				previewContainer.innerHTML = `<p class="text-gray-500 p-4">No matches yet.</p>`;
				return ;
			}
			if (currentMatchOffset === 0)
			{
				previewContainer.innerHTML = "";
				const previewMathes = data.matches.slice(0, 5);
				previewMathes.forEach(match => {
					previewContainer.insertAdjacentHTML("beforeend", renderMatchItem(match));
				});
			}

			if (data.total > 5)
				viewAllBtn.classList.remove("hidden");
			modalListContainer.innerHTML = data.matches.map(renderMatchItem).join("");
			totalMatchResults = data.total;
			currentMatchOffset = offset;

			const totalPages = Math.ceil(totalMatchResults / MATCHS_LIMIT);
			const currentPage = Math.floor(offset / MATCHS_LIMIT) + 1;
			pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;

			prevPageBtn.disabled = offset === 0;
			nextPageBtn.disabled = offset + MATCHS_LIMIT >= totalMatchResults;

			if (data.total > MATCHS_LIMIT) {
				paginatioBtns.classList.remove("hidden");
			}
		} catch (err) {
			console.error("Error loading matches:", err);
			modalListContainer.innerHTML = `<p class="text-red-500 p-4">Failed to load matches list.</p>`;
		}
	};

	prevPageBtn.onclick = () => {
		if (currentMatchOffset >= MATCHS_LIMIT) {
			loadMatchList(currentMatchOffset - MATCHS_LIMIT);
		}
	};

	nextPageBtn.onclick = () => {
		if (currentMatchOffset + MATCHS_LIMIT < totalMatchResults) {
			loadMatchList(currentMatchOffset + MATCHS_LIMIT);
		}
	};

	viewAllBtn.onclick = () => {
		showModal("matches-modal");
	};
	loadMatchList(currentMatchOffset);

	closeModalBtn.onclick = () => {
		hideModal("matches-modal");
	};
}
