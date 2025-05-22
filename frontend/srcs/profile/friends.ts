const FRIENDS_LIMIT = 10;
let currentFriendOffset = 0;
let totalFriendResults = 0;

function viewFriends(username: string | null = null) {
	const previewContainer = document.getElementById("friends-preview") as HTMLElement | null;
	const modalListContainer = document.getElementById("friend-modal-list") as HTMLElement | null;
	const viewAllBtn = document.getElementById("friend-list-btn") as HTMLButtonElement | null;
	const closeModalBtn = document.getElementById("close-friends-modal") as HTMLButtonElement | null;
	const prevPageBtn = document.getElementById("prev-friends-page") as HTMLButtonElement | null;
	const nextPageBtn = document.getElementById("next-friends-page") as HTMLButtonElement | null;
	const pageInfo = document.getElementById("friend-page-info") as HTMLElement | null;
	const paginatioBtns = document.getElementById("friend-pagination") as HTMLButtonElement | null;

	if (!previewContainer || !modalListContainer || !viewAllBtn || !closeModalBtn || !prevPageBtn || !nextPageBtn || !pageInfo || !paginatioBtns) {
		console.error("One or more required elements are missing in the DOM.");
		return;
	}

	const renderFriendItem = (friend: Friend): string => {
		const targetHash = friend.username === currentUser ? "#profile" : `#profile/${friend.username}`;
		return `
			<div onclick="location.hash = '${targetHash}'; initPersonalData('${friend.username}');" class="px-4 py-3 hover:bg-gray-50 flex items-center gap-3 cursor-pointer">
				<img src="${friend.avatar}" alt="${friend.username}'s avatar" class="w-10 h-10 rounded-full object-cover" />
				<span>${friend.username}</span>
			</div>
		`;
	};

	const loadFriendList = async (offset: number = 0) => {
		try {
			const res = await fetch(`/api/friends?offset=${offset}&limit=${FRIENDS_LIMIT}`);
			if (!res.ok)
				throw new Error("Failed to fetch friends");

			const data: FriendResponse = await res.json();
			if (data.total === 0) {
				previewContainer.innerHTML = `<p class="text-gray-500 p-4">No friends yet.</p>`;
				return ;
			}
			if (currentFriendOffset === 0)
			{
				previewContainer.innerHTML = "";
				const previewFriends = data.friends.slice(0, 3);
				previewFriends.forEach(friend => {
					previewContainer.insertAdjacentHTML("beforeend", renderFriendItem(friend));
				});
			}

			if (data.total > 3)
				viewAllBtn.classList.remove("hidden");
			modalListContainer.innerHTML = data.friends.map(renderFriendItem).join("");
			totalFriendResults = data.total;
			currentFriendOffset = offset;

			const totalPages = Math.ceil(totalFriendResults / FRIENDS_LIMIT);
			const currentPage = Math.floor(offset / FRIENDS_LIMIT) + 1;
			pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;

			prevPageBtn.disabled = offset === 0;
			nextPageBtn.disabled = offset + FRIENDS_LIMIT >= totalFriendResults;

			if (data.total > FRIENDS_LIMIT) {
				paginatioBtns.classList.remove("hidden");
			}
		} catch (err) {
			console.error("Error loading friends:", err);
			modalListContainer.innerHTML = `<p class="text-red-500 p-4">Failed to load friends list.</p>`;
		}
	};

	prevPageBtn.onclick = () => {
		if (currentFriendOffset >= FRIENDS_LIMIT) {
			loadFriendList(currentFriendOffset - FRIENDS_LIMIT);
		}
	};

	nextPageBtn.onclick = () => {
		if (currentFriendOffset + FRIENDS_LIMIT < totalFriendResults) {
			loadFriendList(currentFriendOffset + FRIENDS_LIMIT);
		}
	};

	viewAllBtn.onclick = () => {
		showModal("friends-modal");
	};
	loadFriendList(currentFriendOffset);

	closeModalBtn.onclick = () => {
		hideModal("friends-modal");
	};
}
