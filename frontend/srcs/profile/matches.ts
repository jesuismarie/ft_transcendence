const MATCHS_LIMIT = 10;
let currentMatchOffset = 0;
let totalMatchResults = 0;

function viewMatches(id: number, username: string | null) {
	const elements = getMatchElements();
	if (!elements)
		return;

	const { modalInfo, paginationInfo } = elements;

	addModalEvents(modalInfo, "matches-modal");
	addMatchPaginationEvents(username, paginationInfo, modalInfo);
	fetchMatchList(username, currentMatchOffset, modalInfo, paginationInfo);
}

function getMatchElements(): {
	modalInfo: ModalInfo;
	paginationInfo: PaginationInfo;
} | null {
	const previewContainer = document.getElementById("matches-preview") as HTMLElement;
	const listContainer = document.getElementById("match-modal-list") as HTMLElement;
	const openModalBtn = document.getElementById("match-list-btn") as HTMLButtonElement;
	const closeModalBtn = document.getElementById("close-matches-modal") as HTMLButtonElement;
	const prevPageBtn = document.getElementById("prev-matches-page") as HTMLButtonElement;
	const nextPageBtn = document.getElementById("next-matches-page") as HTMLButtonElement;
	const pageInfo = document.getElementById("match-page-info") as HTMLElement;
	const paginatioBtns = document.getElementById("match-pagination") as HTMLElement;

	if (!previewContainer || !listContainer || !openModalBtn || !closeModalBtn || !prevPageBtn || !nextPageBtn || !pageInfo || !paginatioBtns)
		return null;

	return {
		modalInfo: {
			previewContainer,
			openModalBtn,
			listContainer,
			closeModalBtn,
		},
		paginationInfo: {
			pageInfo,
			paginatioBtns,
			prevPageBtn,
			nextPageBtn,
		}
	};
}

function renderMatchItem(match: MatchHistory, username: string | null): string {
	return `
		<div class="px-4 py-3 shadow-sm hover:bg-gray-50 transition duration-300">
			<div class="flex flex-col sm:flex-row sm:justify-between sm:items-center">
				<div class="text-lg font-semibold text-gray-800 flex items-center flex-wrap gap-2 sm:gap-4">
					<span>${username}</span>
					<span class="font-normal">vs</span>
					<span>${match.opponent}</span>
					<span class="ml-auto px-3 py-1 text-xs font-semibold rounded-full
						${match.is_won === true ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} shadow-sm">
						${match.is_won ? "Win" : "Lose"}
					</span>
				</div>
				<div class="mt-2 sm:mt-0 text-sm text-gray-500 text-right">
					<div class="font-semibold text-lg text-gray-700">${match.score.user} - ${match.score.opponent}</div>
					<div>${match.date}</div>
				</div>
			</div>
		</div>
	`;
}

function renderMatchResults(data: GetMatchHistoryResponse, modalInfo: ModalInfo, offset: number, username: string | null) {
	if (data.totalCount === 0 && modalInfo.previewContainer) {
		modalInfo.previewContainer.innerHTML = `<p class="text-gray-500 p-4">No matches yet.</p>`;
		return;
	}

	if (offset === 0 && modalInfo.previewContainer) {
		modalInfo.previewContainer.innerHTML = "";
		const previewMatches = data.matches.slice(0, 5);
		previewMatches.forEach(match => {
			modalInfo.previewContainer!.insertAdjacentHTML("beforeend", renderMatchItem(match, username));
		});
	}

	if (data.totalCount > 5)
		modalInfo.openModalBtn.classList.remove("hidden");
	if (modalInfo.listContainer)
		modalInfo.listContainer.innerHTML = data.matches.map(match => renderMatchItem(match, username)).join("");
}

async function fetchMatchList(
	username: string | null,
	offset: number,
	modalInfo: ModalInfo,
	paginationInfo: PaginationInfo
) {
	try {
		const res = await fetch(`/get-match-history-by-user?username${username}offset=${offset}&limit=${MATCHS_LIMIT}`);
		if (!res.ok)
			throw new Error("Failed to fetch matches");

		const data: GetMatchHistoryResponse = await res.json();

		renderMatchResults(data, modalInfo, offset, username);
		totalMatchResults = data.totalCount;
		currentMatchOffset = offset;

		updatePaginationControls(paginationInfo, totalMatchResults, currentMatchOffset, MATCHS_LIMIT);

		if (data.totalCount > MATCHS_LIMIT) {
			paginationInfo.paginatioBtns.classList.remove("hidden");
		} else {
			paginationInfo.paginatioBtns.classList.add("hidden");
		}
	} catch (err) {
		console.error("Error loading matches:", err);
		if (modalInfo.listContainer)
			modalInfo.listContainer.innerHTML = `<p class="text-red-500 p-4">Failed to load matches list.</p>`;
	}
}

function addMatchPaginationEvents(
	username: string | null,
	paginationInfo: PaginationInfo,
	modalInfo: ModalInfo
) {
	paginationInfo.prevPageBtn.onclick = () => {
		if (currentMatchOffset >= MATCHS_LIMIT) {
			fetchMatchList(username, currentMatchOffset - MATCHS_LIMIT, modalInfo, paginationInfo);
		}
	};

	paginationInfo.nextPageBtn.onclick = () => {
		if (currentMatchOffset + MATCHS_LIMIT < totalMatchResults) {
			fetchMatchList(username, currentMatchOffset + MATCHS_LIMIT, modalInfo, paginationInfo);
		}
	};
}

