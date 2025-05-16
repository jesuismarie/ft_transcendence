function searchUsers() {
	const searchModalBtn = document.getElementById("search-modal-btn") as HTMLButtonElement | null;
	const listContainer = document.getElementById("search-users-list") as HTMLElement | null;
	const closeModalBtn = document.getElementById("close-search-modal") as HTMLButtonElement | null;
	const searchInput = document.getElementById("search-people") as HTMLInputElement | null;
	const searchResultsContainer = document.getElementById("search-users-btn") as HTMLElement | null;

	if (!searchModalBtn || !listContainer || !closeModalBtn || !searchInput || !searchResultsContainer) {
		console.error("One or more required elements are missing in the DOM.");
		return;
	}

	let users: UserProfile[] = [
	];

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
		container.innerHTML = "";

		if (results.length === 0) {
			container.innerHTML = `<p class="text-gray-500 p-4">No users found.</p>`;
			return;
		}

		results.forEach(user => {
			container.insertAdjacentHTML("beforeend", renderSearchItem(user));
		});
	};

	searchModalBtn.addEventListener("click", async () => {
		showModal("search-users-modal");
	});
	
	searchResultsContainer.addEventListener("click", async () => {
		try {
			const res = await fetch("/api/users");
			if (!res.ok) throw new Error("Failed to fetch users");

			users = await res.json();
			renderSearchResults(users, listContainer);
		} catch (err) {
			console.error("Error fetching users:", err);
			listContainer.innerHTML = `<p class="text-red-500 p-4">Failed to load users.</p>`;
		}
	});

	// searchInput.addEventListener("input", () => {
	// 	const query = searchInput.value.trim().toLowerCase();
	// 	const filtered = users.filter(user => user.username.toLowerCase().includes(query));
	// 	renderSearchResults(filtered, listContainer);
	// });

	closeModalBtn.addEventListener("click", () => {
		hideModal("search-users-modal");
	});
}
