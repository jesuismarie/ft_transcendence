const SEARCH_LIMIT = 10;
let currentSearchOffset = 0;
let totalSearchResults = 0;

function searchUsers() {
	const searchModalBtn = document.getElementById("search-modal-btn") as HTMLButtonElement | null;
	const listContainer = document.getElementById("search-users-list") as HTMLElement | null;
	const closeModalBtn = document.getElementById("close-search-modal") as HTMLButtonElement | null;
	const searchInput = document.getElementById("search-people") as HTMLInputElement | null;
	const searchBtn = document.getElementById("search-users-btn") as HTMLButtonElement | null;
	const prevPageBtn = document.getElementById("prev-search-page") as HTMLButtonElement | null;
	const nextPageBtn = document.getElementById("next-search-page") as HTMLButtonElement | null;
	const pageInfo = document.getElementById("search-page-info") as HTMLElement | null;
	const paginatioBtns = document.getElementById("search-pagination") as HTMLButtonElement | null;

	if (!searchModalBtn || !listContainer || !closeModalBtn || !searchInput || !searchBtn || !prevPageBtn || !nextPageBtn || !pageInfo || !paginatioBtns) {
		console.error("One or more required elements are missing in the DOM.");
		return;
	}

	const renderSearchItem = (user: UserProfile): string => {
		const targetHash = user.username === currentUser ? "#profile" : `#profile/${user.username}`;
		return `
			<div onclick="location.hash = '${targetHash}';" class="px-4 py-3 hover:bg-gray-50 flex items-center gap-3 cursor-pointer">
				<img src="${user.avatar}" alt="${user.username}'s avatar" class="w-10 h-10 rounded-full object-cover" />
				<span>${user.username}</span>
			</div>
		`;
	};

	const renderSearchResults = (results: UserProfile[], container: HTMLElement) => {
		container.innerHTML = results.length === 0
			? `<p class="text-gray-500 p-4">No users found.</p>`
			: results.map(renderSearchItem).join("");
	};

	const updatePaginationControls = () => {
		const totalPages = Math.ceil(totalSearchResults / SEARCH_LIMIT);
		const currentPage = Math.floor(currentSearchOffset / SEARCH_LIMIT) + 1;

		pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
		prevPageBtn.disabled = currentSearchOffset === 0;
		nextPageBtn.disabled = currentSearchOffset + SEARCH_LIMIT >= totalSearchResults;
	};

	const loadSearchResults = async (query: string, offset: number = 0) => {
		try {
			const res = await fetch(`/api/users?query=${encodeURIComponent(query)}&offset=${offset}&limit=${SEARCH_LIMIT}`);
			if (!res.ok)
				throw new Error("Failed to fetch users");

			const data: SearchUserResponse = await res.json();
			renderSearchResults(data.users, listContainer);

			totalSearchResults = data.total;
			currentSearchOffset = offset;
			updatePaginationControls();

			if (data.total > SEARCH_LIMIT)
				paginatioBtns.classList.remove("hidden");
		} catch (err) {
			console.error("Error fetching users:", err);
			listContainer.innerHTML = `<p class="text-red-500 p-4">Failed to load users.</p>`;
		}
	};

	searchModalBtn.addEventListener("click", () => {
		showModal("search-users-modal");
	});

	searchBtn.addEventListener("click", () => {
		const query = searchInput.value.trim();
		if (query) {
			currentSearchOffset = 0;
			loadSearchResults(query, currentSearchOffset);
		}
	});

	prevPageBtn.addEventListener("click", () => {
		const query = searchInput.value.trim();
		if (query && currentSearchOffset >= SEARCH_LIMIT) {
			loadSearchResults(query, currentSearchOffset - SEARCH_LIMIT);
		}
	});

	nextPageBtn.addEventListener("click", () => {
		const query = searchInput.value.trim();
		if (query && currentSearchOffset + SEARCH_LIMIT < totalSearchResults) {
			loadSearchResults(query, currentSearchOffset + SEARCH_LIMIT);
		}
	});

	closeModalBtn.addEventListener("click", () => {
		hideModal("search-users-modal");
	});
}
