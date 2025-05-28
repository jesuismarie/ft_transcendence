const SEARCH_LIMIT = 10;
let currentSearchOffset = 0;
let totalSearchResults = 0;

function searchUsers() {
	const elements = getSearchElements();
	if (!elements)
		return;

	const { modalInfo, paginationInfo, searchInput, searchBtn } = elements;

	addModalEvents(modalInfo, "search-users-modal");
	addSearchEvents(searchInput, searchBtn, modalInfo, paginationInfo);
	addSearchPaginationEvents(searchInput, paginationInfo, modalInfo);
}

function getSearchElements(): {
	modalInfo: ModalInfo;
	paginationInfo: PaginationInfo;
	searchInput: HTMLInputElement;
	searchBtn: HTMLButtonElement;
} | null {
	const searchModalBtn = document.getElementById("search-modal-btn") as HTMLButtonElement;
	const listContainer = document.getElementById("search-users-list") as HTMLElement;
	const closeModalBtn = document.getElementById("close-search-modal") as HTMLButtonElement;
	const searchInput = document.getElementById("search-people") as HTMLInputElement;
	const searchBtn = document.getElementById("search-users-btn") as HTMLButtonElement;
	const prevPageBtn = document.getElementById("prev-search-page") as HTMLButtonElement;
	const nextPageBtn = document.getElementById("next-search-page") as HTMLButtonElement;
	const pageInfo = document.getElementById("search-page-info") as HTMLElement;
	const paginatioBtns = document.getElementById("search-pagination") as HTMLElement;

	if (!searchModalBtn || !listContainer || !closeModalBtn || !searchInput || !searchBtn || !prevPageBtn || !nextPageBtn || !pageInfo || !paginatioBtns) {
		console.error("One or more required elements are missing in the DOM.");
		return null;
	}

	return {
		modalInfo: {
			openModalBtn: searchModalBtn,
			listContainer,
			closeModalBtn,
		},
		paginationInfo: {
			pageInfo,
			paginatioBtns,
			prevPageBtn,
			nextPageBtn,
		},
		searchInput,
		searchBtn,
	};
}

function renderSearchItem(user: QuickUserResponse): string {
	const targetHash = user.username === currentUser ? "#profile" : `#profile/${user.username}`;
	return `
		<div onclick="location.hash = '${targetHash}'; initPersonalData(${user.id});" class="px-4 py-3 hover:bg-gray-50 flex items-center gap-3 cursor-pointer">
			<img src="${user.avatarPath}" alt="${user.username}'s avatar" class="w-10 h-10 rounded-full object-cover" />
			<span>${user.username}</span>
		</div>
	`;
}

function renderSearchResults(users: QuickUserResponse[], container: HTMLElement) {
	container.innerHTML = users.length === 0
		? `<p class="text-gray-500 p-4">No users found.</p>`
		: users.map(renderSearchItem).join("");
}

async function fetchSearchResults(
	query: string,
	offset: number,
	modalInfo: ModalInfo,
	paginationInfo: PaginationInfo
) {
	try {
		const res = await fetch(`/api/users?query=${encodeURIComponent(query)}&offset=${offset}&limit=${SEARCH_LIMIT}`, {
			credentials: 'include'
		});
		if (!res.ok)
			throw new Error("Failed to fetch users");

		const data: SearchUserResponse = await res.json();

		if (modalInfo.listContainer)
			renderSearchResults(data.users, modalInfo.listContainer);
		totalSearchResults = data.totalCount;
		currentSearchOffset = offset;
		updatePaginationControls(paginationInfo, totalSearchResults, currentSearchOffset, SEARCH_LIMIT);

		if (data.totalCount > SEARCH_LIMIT)
			paginationInfo.paginatioBtns.classList.remove("hidden");
		else
			paginationInfo.paginatioBtns.classList.add("hidden");
	} catch (err) {
		console.error("Error fetching users:", err);
		if (modalInfo.listContainer)
			modalInfo.listContainer.innerHTML = `<p class="text-red-500 p-4">Failed to load users.</p>`;
	}
}

function addSearchEvents(
	searchInput: HTMLInputElement,
	searchBtn: HTMLButtonElement,
	modalInfo: ModalInfo,
	paginationInfo: PaginationInfo
) {
	searchBtn.addEventListener("click", () => {
		const query = searchInput.value.trim();
		if (query) {
			currentSearchOffset = 0;
			fetchSearchResults(query, currentSearchOffset, modalInfo, paginationInfo);
		}
	});
}

function addSearchPaginationEvents(
	searchInput: HTMLInputElement,
	paginationInfo: PaginationInfo,
	modalInfo: ModalInfo
) {
	paginationInfo.prevPageBtn.addEventListener("click", () => {
		const query = searchInput.value.trim();
		if (query && currentSearchOffset >= SEARCH_LIMIT) {
			fetchSearchResults(query, currentSearchOffset - SEARCH_LIMIT, modalInfo, paginationInfo);
		}
	});
	paginationInfo.nextPageBtn.addEventListener("click", () => {
		const query = searchInput.value.trim();
		if (query && currentSearchOffset + SEARCH_LIMIT < totalSearchResults) {
			fetchSearchResults(query, currentSearchOffset + SEARCH_LIMIT, modalInfo, paginationInfo);
		}
	});
}
